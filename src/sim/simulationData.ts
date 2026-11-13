import {
  computeRealTimeBuildSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getCatalogItem,
  getFarmItemMeta,
  getMinRemainingBuildFloorSec,
  PASTURE_ANIMALS,
  TIME_SAND_SKIP_SECONDS,
} from '../data/catalog';
import {
  getLevelInfo,
  getLevelTrialRequirement,
  getNextLevelXp,
  getWinsRequiredForNextLevel,
  MAX_LEVEL,
} from '../data/levels';
import { HOUSES } from '../data/names';
import {
  createDailyQuests,
  createOwlOrderQuest,
  HARVEST_FEAST_TIERS,
  STORY_QUESTS,
  TUTORIAL_STEPS,
} from '../data/quests';
import {
  ActiveSynergyResult,
  CRAFT_RECIPES,
  CraftRecipeDef,
  createCargoCrates,
  createInitialSupplyState,
  DISTRICT_SYNERGIES,
  evaluateDistrictSynergies,
  RAW_INGREDIENTS_INFO,
} from '../data/synergiesAndSupply';
import {
  CREATURE_SPECIES_PROFILES,
  createInitialSuitcaseState,
  getBondIncomeMultiplier,
  getBondXpRequiredForNext,
  getCompendiumMasteryBonusPct,
  getSpeciesProfile,
  GROOM_COOLDOWN_MS,
  INCUBATION_DURATION_MS,
  MAX_BOND_LEVEL,
  MORPH_INFO,
  SUITCASE_EXPEDITIONS,
  TRAIN_COOLDOWN_MS,
} from '../data/suitcase';
import {
  createInitialMatch3State,
  getExtraMovesGoldCost,
  getItemPuzzleStarCost,
  getMatch3LevelDef,
  getUpgradePuzzleStarCost,
  getZonePuzzleStarCost,
  HEART_REGEN_MS,
  MATCH3_BOOSTERS,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
  REFILL_HEARTS_GOLD_COST,
  TOTAL_MINIGAME_STAGES,
} from '../data/match3Levels';
import { getZoneAt, getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import { MagicalAudio } from '../engine/audio';
import { findNextStepOnPaths, getRandomUnlockedPathTile } from '../engine/pathfinding';

const STRICT_SANDBOX_LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

/**
 * Hằng số biên dịch tĩnh: Vite thay thế `import.meta.env.DEV` thành `false` khi chạy `npm run build`,
 * giúp loại bỏ hoàn toàn (dead-code elimination) toàn bộ nút/công tắc Sandbox & Dev khỏi `dist/`.
 */
export const IS_SANDBOX_BUILD_ENABLED: boolean =
  import.meta.env.DEV && import.meta.env.VITE_ALLOW_SANDBOX === '1';

/**
 * Kiểm tra runtime nghiêm ngặt: chỉ cho phép mở các tính năng Sandbox/Dev nội bộ khi chạy Vite dev
 * kèm cờ `VITE_ALLOW_SANDBOX=1` trực tiếp trên loopback (`localhost` / `127.0.0.1`), chặn cả IP LAN.
 */
export function isSandboxRuntimeAllowed(): boolean {
  if (!IS_SANDBOX_BUILD_ENABLED) return false;
  if (typeof window === 'undefined' || !window.location) return false;
  const host = String(window.location.hostname || '').trim().toLowerCase();
  return STRICT_SANDBOX_LOOPBACK_HOSTS.has(host);
}
import {
  createDefaultRetentionState,
  reconcileRetentionStateOnLoad,
} from './retentionAndNarrative';
import {
  BuildReductionResult,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  EscapedCreatureEntity,
  FarmBarnState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FarmOwlOrder,
  FestivalType,
  FireworkBurst,
  FloatingEffect,
  FlyRewardKind,
  GameState,
  HarvestFeastState,
  HarvestFeastTierDef,
  HeatmapMode,
  HomeOwlLanternMark,
  HouseName,
  IsoDirection,
  LanguageQuizState,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  LevelTrialRequirement,
  Match3BoosterId,
  MAX_STAFF_PER_ROLE,
  MinigameLeaderboardState,
  MinigameRescueContext,
  PastureAnimalId,
  MinigameTrialKind,
  NeighborGardenHelpKind,
  NeighborMinigameSos,
  NeighborPresetNoteId,
  NeighborProfileState,
  NeighborSocialState,
  OfflineReport,
  PlacedBuilding,
  PuzzleArcadeMode,
  QuestDef,
  QuestObjectiveType,
  RibbonUnveilCelebration,
  SavedCaroSession,
  SavedChessHistoryItem,
  SavedChessPiece,
  SavedChessSession,
  SavedMatch3Piece,
  SavedMatch3Session,
  SavedOnetSession,
  SavedSudokuSession,
  SavedSudokuUndoItem,
  StaffEntity,
  SuitcaseExpeditionId,
  TileCell,
  TutorialState,
  TutorialStepDef,
  TutorialStepId,
  ValleyVillagerEntity,
  ValleyVillagerId,
  VerifiedRealPlayerProfile,
  WeatherForecastSlot,
  WeatherKind,
  ZoneId,
} from '../types/game';
import { buildSampleCoasterLoop, TrackWaypoint, traceCoasterCircuit } from './coaster';
import {
  buildNeighborValleySnapshot,
  CANON_NPC_NEIGHBOR_IDS,
  classifyBuildingGardenHelpKind,
  createFriendNeighborFromCode,
  createInitialNeighborSocialState,
  FRIENDSHIP_CHEST_TOKEN_COST,
  getGardenHelpMetaVi,
  getLocalCalendarResetKey,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  isNpcNeighborProfile,
  MAX_DAILY_FRIEND_HELPS,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  MAX_HOME_LANTERN_MARKS,
  pickSimulatedHomeLanternMark,
  syncNeighborSocialDailyReset,
} from './neighborSocial';
import {
  buildAllPersonalRecordsSummary,
  buildMinigameLeaderboard,
  ensureMinigameLeaderboardState,
  getAllCachedCloudLeaderboards,
  getCachedCloudLeaderboardEntries,
  getPlayerHogwartsHouse,
  HOGWARTS_HOUSE_META,
  isScoredLeaderboardGame,
  LeaderboardStandingResult,
  normalizeScoredLeaderboardGame,
  PersonalDisciplineSummaryRow,
  recordMinigameSessionResult,
  rollSortingHatHouse,
  setPlayerHogwartsHouse,
  submitPlayerCloudLeaderboardEntry,
} from './minigameLeaderboard';
import {
  createInitialPuzzleArcadeState,
  JIGSAW_PAINTINGS,
  PuzzleRewardSpec,
} from './puzzleShared';
import {
  ActiveQuizChallenge,
  createInitialLanguageQuizState,
  QuizAttemptOutcome,
  recordQuizAttempt,
  sanitizeLanguageQuizState,
} from './languageQuizEngine';
import {
  BackstageEvaluation,
  BiomeEvaluation,
  evaluateBackstageShielding,
  evaluateHabitatBiome,
  getBuildingGates,
  traceQueueSlots,
} from './zooAndBackstage';


export const SAVE_KEY = 'burrow_hogsmeade_777_v3';
export const FARM_HARVEST_CHEST_XP = 200;

export const PLAYFUL_BREAKDOWNS = [
  'Chổi thần lộn ngược vòng!',
  'Phanh bùa chú quá nhiệt!',
  'Bánh răng cổ ngữ kẹt kẹo dẻo!',
  'Đệm bay lơ lửng lệch pha!',
];

export const FIREWORK_COLORS = ['#fbbf24', '#f472b6', '#38bdf8', '#34d399', '#c084fc', '#fb7185'];

export function getLocalDateKey(now?: Date): string {
  if (!now) {
    return getLocalCalendarResetKey();
  }
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function starIncomeMultiplier(stars: number): number {
  const table = [1, 1.0, 1.45, 2.05, 2.9, 4.1];
  return table[Math.max(1, Math.min(5, stars))] ?? 1;
}

export function getUpgradeCost(item: CatalogItem, currentStars: number): number {
  return Math.round(item.cost * Math.pow(1.75, currentStars));
}

export function deltaToFacing(dx: number, dy: number, fallback: IsoDirection = 'se'): IsoDirection {
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return fallback;
  // Screen iso: sx ~ (gx - gy), sy ~ (gx + gy)
  const isoX = dx - dy;
  const isoY = dx + dy;
  if (isoY >= 0) {
    return isoX >= 0 ? 'se' : 'sw';
  }
  return isoX >= 0 ? 'ne' : 'nw';
}

export const CANON_OWL_SENDERS: Array<{
  senderId: string;
  senderName: string;
  senderTitle: string;
  portraitSprite?: string;
  portraitEmoji: string;
  owlName: 'Hedwig' | 'Errol' | 'Pigwidgeon';
  notes: string[];
}> = [
  {
    senderId: 'luna',
    senderName: 'Luna Lovegood',
    senderTitle: 'Đồi Rookery • Bữa Trà Chiều',
    portraitEmoji: '🌼',
    owlName: 'Pigwidgeon',
    notes: [
      'Bố mình bảo Bánh Táo Quế của bác Molly giúp xua tan lũ Nargle quanh hiên nhà tuyệt lắm!',
      'Cho mình đặt vài giỏ dâu mọng và mật ong hoa táo để đãi bạn bè nhé!',
    ],
  },
  {
    senderId: 'hermione',
    senderName: 'Hermione Granger',
    senderTitle: 'Thư Viện Hogsmeade',
    portraitEmoji: '📚',
    owlName: 'Hedwig',
    notes: [
      'Trời trở gió thu rồi, bác Molly gửi giúp cháu chiếc Áo Len chữ W và lọ mật ong ấm cổ nhé!',
      'Cháu đang ôn Cổ Ngữ suốt buổi chiều, có thêm bánh nướng thơm phức thì tỉnh táo hẳn!',
    ],
  },
  {
    senderId: 'hagrid',
    senderName: 'Bác Rubeus Hagrid',
    senderTitle: 'Chòi Đá Bìa Rừng',
    portraitSprite: 'staff_hagrid_farm',
    portraitEmoji: '🎃',
    owlName: 'Errol',
    notes: [
      'Fang cứ hít hà mùi Bánh Bí Ngô Kem Mật suốt từ sáng, bồ gửi giúp bác mẻ bánh nóng hổi nha!',
      'Đàn Bằng Mã ngoài trảng cỏ mê táo đỏ và lúa mạch Hang Sóc lắm đó!',
    ],
  },
  {
    senderId: 'dumbledore',
    senderName: 'Cụ Albus Dumbledore',
    senderTitle: 'Khách Quý Hội Mùa Gặt',
    portraitEmoji: '🧙‍♂️',
    owlName: 'Hedwig',
    notes: [
      'Ta đặc biệt yêu thích một cốc Nước Táo Ép Mật dùng kèm kẹo sô-cô-la dâu mỗi tối đọc sách.',
      'Những đôi tất len ấm và bánh táo nhà Weasley luôn là phép màu ngọt ngào nhất thế gian!',
    ],
  },
  {
    senderId: 'rosmerta',
    senderName: 'Bà Rosmerta',
    senderTitle: 'Quán Ba Cây Chổi',
    portraitEmoji: '🍺',
    owlName: 'Errol',
    notes: [
      'Quán trọ tối nay đông kín khách! Giao gấp cho cô ít Bột Mì Mịn và Bia Bơ Sủi Bọt Kem nhé!',
    ],
  },
  {
    senderId: 'sprout',
    senderName: 'Giáo sư Pomona Sprout',
    senderTitle: 'Nhà Kính Thảo Dược',
    portraitEmoji: '🌿',
    owlName: 'Pigwidgeon',
    notes: [
      'Các chậu cây non đang cần thêm Tinh Dầu Thảo Dược và củ Mandrake khỏe mạnh từ Hang Sóc!',
    ],
  },
];

export const MAX_PHOENIX_TALISMANS = 12;
export const PHOENIX_FORGE_GOLD_COST = 180;
export const PHOENIX_FORGE_ELIGIBLE_GOODS: ReadonlyArray<FarmGoodId> = [
  'cinnamon_apple_pie',
  'pumpkin_pie',
  'cream_mushroom_soup',
  'weasley_sweater_w',
  'honey_apple_cider',
  'blossom_honey_jar',
  'frothy_butterbeer',
  'choc_frog_sweet',
  'sprout_growth_elixir',
  'floral_bouquet_gift',
];

export function createCanonFarmOwlOrder(level: number, seed: number): FarmOwlOrder {
  const sender = CANON_OWL_SENDERS[seed % CANON_OWL_SENDERS.length];
  const unlockedCrops = (Object.keys(FARM_CROPS) as FarmCropId[]).filter(
    (cid) => FARM_CROPS[cid].unlockLevel <= Math.max(1, level)
  );
  const candidateGoods: FarmGoodId[] = [
    'cinnamon_apple_pie',
    'pumpkin_pie',
    ...(level >= 2 ? (['farm_egg_wool', 'creamy_dairy_milk', 'floral_bouquet_gift'] as FarmGoodId[]) : []),
    ...(level >= 3 ? (['weasley_sweater_w'] as FarmGoodId[]) : []),
    ...(level >= 5 ? (['fine_wheat_flour'] as FarmGoodId[]) : []),
    ...(level >= 7 ? (['blossom_honey_jar', 'honey_apple_cider'] as FarmGoodId[]) : []),
    ...(level >= 14 ? (['frothy_butterbeer', 'cream_mushroom_soup'] as FarmGoodId[]) : []),
    ...(level >= 16 ? (['sprout_growth_elixir'] as FarmGoodId[]) : []),
  ];

  const c1 = unlockedCrops[(seed * 5 + 2) % unlockedCrops.length];
  const qtyCrop = 2 + (seed % 2);
  const useCraftedGood = level >= 2 || seed % 2 === 0;
  const g1 = candidateGoods[(seed * 3 + 1) % candidateGoods.length];
  const qtyGood = 1 + (level >= 6 ? seed % 2 : 0);

  const c2 = unlockedCrops[(seed * 7 + 1) % unlockedCrops.length];
  const requirements: FarmOwlOrder['requirements'] = useCraftedGood
    ? [
        { itemId: g1, qty: qtyGood },
        { itemId: c1, qty: qtyCrop },
      ]
    : c2 !== c1
      ? [
          { itemId: c1, qty: qtyCrop },
          { itemId: c2, qty: 2 },
        ]
      : [{ itemId: c1, qty: qtyCrop + 1 }];

  const baseValue = requirements.reduce((acc, r) => {
    const meta = r.itemId in FARM_GOODS ? FARM_GOODS[r.itemId as FarmGoodId] : FARM_CROPS[r.itemId as FarmCropId];
    return acc + meta.sellValue * r.qty;
  }, 0);
  const baseXp = requirements.reduce((acc, r) => {
    const meta = r.itemId in FARM_GOODS ? FARM_GOODS[r.itemId as FarmGoodId] : FARM_CROPS[r.itemId as FarmCropId];
    return acc + meta.xp * r.qty;
  }, 0);
  const rewardGalleons = Math.max(1, Math.round(baseValue * 1.55 + Math.round((level * 6) / 5)));
  const rewardXp = Math.round(baseXp * 1.6 + level * 4);
  const isFeastMarquee = seed % 3 === 2;

  return {
    id: `farm_owl_${Date.now()}_${seed}`,
    senderId: sender.senderId,
    senderName: sender.senderName,
    senderTitle: sender.senderTitle,
    portraitSprite: sender.portraitSprite,
    portraitEmoji: sender.portraitEmoji,
    owlName: sender.owlName,
    noteVi: sender.notes[seed % sender.notes.length],
    requirements,
    rewardGalleons: isFeastMarquee ? Math.round(rewardGalleons * 1.25) : rewardGalleons,
    rewardXp: isFeastMarquee ? Math.round(rewardXp * 1.25) : rewardXp,
    rewardMugglePlug: seed % 3 === 0 ? 1 : undefined,
    isFeastMarquee,
  };
}

export function createInitialFarmBarnState(): FarmBarnState {
  // Starter Barn for Level 1 Build-From-Scratch meadow
  return {
    capacity: 60,
    ordersDelivered: 0,
    crops: {
      ottery_wheat: 4,
      honey_carrot: 3,
      garden_pumpkin: 3,
      golden_corn: 0,
      crisp_cabbage: 0,
      ruby_strawberry: 0,
      burrow_apple: 2,
      burrow_potato: 0,
      baby_mandrake: 0,
      ruby_tomato: 0,
      dew_blueberry: 0,
      dried_lavender: 0,
      hedge_sunflower: 0,
      glow_mushroom: 0,
      meadow_daisy: 2,
      english_rose: 0,
      golden_daffodil: 0,
      rainbow_tulip: 0,
      forest_bluebell: 0,
      blush_peony: 0,
      moonlight_flower: 0,
      phoenix_fireflower: 0,
    },
    goods: {
      cinnamon_apple_pie: 2,
      pumpkin_pie: 1,
      cream_mushroom_soup: 0,
      weasley_sweater_w: 0,
      honey_apple_cider: 0,
      blossom_honey_jar: 1,
      fine_wheat_flour: 2,
      farm_egg_wool: 1,
      muggle_plug_kit: 0,
      frothy_butterbeer: 0,
      choc_frog_sweet: 0,
      sprout_growth_elixir: 0,
      floral_bouquet_gift: 0,
      creamy_dairy_milk: 0,
    },
    seeds: {
      ottery_wheat: 3,
      honey_carrot: 2,
      garden_pumpkin: 1,
      meadow_daisy: 2,
      english_rose: 1,
    },
    owlOrders: [
      {
        id: 'farm_owl_init_1',
        senderId: 'luna',
        senderName: 'Luna Lovegood',
        senderTitle: 'Đồi Rookery • Bữa Trà Chiều',
        portraitEmoji: '🌼',
        owlName: 'Pigwidgeon',
        noteVi: 'Chào mừng bồ về khai hoang đồi Hang Sóc! Gửi mình ít Lúa Mì đầu mùa và Giỏ Trứng Gà tươi nhé!',
        requirements: [
          { itemId: 'ottery_wheat', qty: 2 },
          { itemId: 'farm_egg_wool', qty: 1 },
        ],
        rewardGalleons: 33,
        rewardXp: 70,
        rewardMugglePlug: 1,
      },
      {
        id: 'farm_owl_init_2',
        senderId: 'hagrid',
        senderName: 'Bác Rubeus Hagrid',
        senderTitle: 'Chòi Đá Bìa Rừng',
        portraitSprite: 'staff_hagrid_farm',
        portraitEmoji: '🎃',
        owlName: 'Errol',
        noteVi: 'Fang thích nhấm Cà Rốt Mật và Bí Ngô đầu mùa của đồi Hang Sóc lắm đó!',
        requirements: [
          { itemId: 'honey_carrot', qty: 2 },
          { itemId: 'garden_pumpkin', qty: 2 },
        ],
        rewardGalleons: 30,
        rewardXp: 65,
      },
      {
        id: 'farm_owl_init_3',
        senderId: 'hermione',
        senderName: 'Hermione Granger',
        senderTitle: 'Thư Viện Hogsmeade',
        portraitEmoji: '📚',
        owlName: 'Hedwig',
        noteVi: 'Khi nào dựng xong Lò Bánh Bà Molly, bồ nướng gửi mình mẻ Bánh Bí Ngô Kem Mật nha!',
        requirements: [
          { itemId: 'pumpkin_pie', qty: 2 },
          { itemId: 'ottery_wheat', qty: 2 },
        ],
        rewardGalleons: 44,
        rewardXp: 90,
      },
      {
        id: 'farm_owl_init_4',
        senderId: 'dumbledore',
        senderName: 'Cụ Albus Dumbledore',
        senderTitle: 'Khách Quý Hội Mùa Gặt',
        portraitEmoji: '🧙‍♂️',
        owlName: 'Hedwig',
        noteVi: 'Đơn tiệc trà khai trương điền trang: Bánh Táo Quế thơm giòn cùng Cà Rốt Mật tươi!',
        requirements: [
          { itemId: 'cinnamon_apple_pie', qty: 2 },
          { itemId: 'honey_carrot', qty: 2 },
        ],
        rewardGalleons: 52,
        rewardXp: 110,
        rewardMugglePlug: 1,
        isFeastMarquee: true,
      },
    ],
  };
}

export function createInitialTutorialState(active = true): TutorialState {
  if (!active) {
    return {
      active: false,
      stepIndex: TUTORIAL_STEPS.length,
      stepId: 'completed',
      skipped: false,
      completedAt: Date.now(),
      pastureHarvestedInStep3: true,
      claimedSteps: TUTORIAL_STEPS.map((s) => s.index),
    };
  }
  return {
    active: true,
    stepIndex: 0,
    stepId: TUTORIAL_STEPS[0].id,
    skipped: false,
    pastureHarvestedInStep3: false,
    claimedSteps: [],
  };
}

export function formatHarvestFeastRewardVi(def: HarvestFeastTierDef): string {
  const parts: string[] = [];
  if (def.rewardPhoenixTalisman && def.rewardPhoenixTalisman > 0) {
    parts.push(`+${def.rewardPhoenixTalisman} 🔥 Bùa Phượng Hoàng`);
  }
  if (def.rewardMugglePlug && def.rewardMugglePlug > 0) {
    parts.push(`+${def.rewardMugglePlug} 🔌 Phích Cắm`);
  }
  if (def.rewardGoodId && (def.rewardGoodQty ?? 0) > 0) {
    const gm = FARM_GOODS[def.rewardGoodId];
    parts.push(`+${def.rewardGoodQty} ${gm.emoji} ${gm.name}`);
  }
  if (def.rewardSeedCropId && (def.rewardSeedQty ?? 0) > 0) {
    const cm = FARM_CROPS[def.rewardSeedCropId];
    parts.push(`+${def.rewardSeedQty} hạt ${cm.emoji} ${cm.name}`);
  }
  if (def.rewardTimeSand && def.rewardTimeSand > 0) {
    parts.push(`+${def.rewardTimeSand} ⏳ Cát Xoay`);
  }
  if (def.rewardGalleons && def.rewardGalleons > 0) {
    parts.push(`+${def.rewardGalleons.toLocaleString('vi-VN')}G`);
  }
  if (def.rewardXp && def.rewardXp > 0) {
    parts.push(`+${def.rewardXp} ⭐`);
  }
  return parts.join(' • ');
}

export function createInitialHarvestFeastState(): HarvestFeastState {
  return {
    seasonCycle: 1,
    points: 0,
    claimedTiers: [],
    totalPointsAllTime: 0,
    unveilsCompleted: 0,
  };
}

export interface ValleyVillagerProfile {
  id: ValleyVillagerId;
  nameVi: string;
  titleVi: string;
  idleSprite: string;
  walkSprite: string;
  moodBubble: string;
  unlockLevel: number;
  favoriteItemIds: string[];
  greetingsVi: [string, string];
}

export const VALLEY_VILLAGER_PROFILES: readonly ValleyVillagerProfile[] = [
  {
    id: 'molly',
    nameVi: 'Bà Molly Weasley',
    titleVi: 'Chủ Bếp Trang Trại Hang Sóc',
    idleSprite: 'villager_molly_idle',
    walkSprite: 'villager_molly_walk',
    moodBubble: '🥧',
    unlockLevel: 1,
    favoriteItemIds: ['burrow_house_canon', 'molly_apple_bakery', 'burrow_self_knitting_loom'],
    greetingsVi: [
      'Bà Molly vừa ra lò mẻ Bánh Táo Quế thơm lừng cho cả nhà!',
      'Nhớ tưới nước mát Aguamenti cho luống lúa và hoa hồng nha con!',
    ],
  },
  {
    id: 'arthur',
    nameVi: 'Ông Arthur Weasley',
    titleVi: 'Nhà Sưu Tầm Bảo Vật Muggle',
    idleSprite: 'villager_arthur_idle',
    walkSprite: 'villager_arthur_walk',
    moodBubble: '🔌',
    unlockLevel: 1,
    favoriteItemIds: ['arthur_ford_shed', 'burrow_windmill_canon', 'burrow_reed_pond_mill'],
    greetingsVi: [
      'Chà, cấu tạo của chiếc phích cắm Muggle này thật kỳ diệu!',
      'Chiếc Ford Anglia xanh ngọc trong chòi vừa được đánh bóng sáng loáng!',
    ],
  },
  {
    id: 'ginny',
    nameVi: 'Ginny Weasley',
    titleVi: 'Người Trồng Hoa Đồi Gió',
    idleSprite: 'villager_ginny_idle',
    walkSprite: 'villager_ginny_walk',
    moodBubble: '🌹',
    unlockLevel: 1,
    favoriteItemIds: ['burrow_flower_garden', 'burrow_puffskein_pasture', 'burrow_animal_pasture'],
    greetingsVi: [
      'Những bụi Hoa Hồng Anh và Tulip Cầu Vồng nở rực cả ngọn đồi!',
      'Bầy Puffskein Lông Vàng cứ lăn tròn đòi ăn dâu tây mãi thôi!',
    ],
  },
  {
    id: 'ron',
    nameVi: 'Ron Weasley',
    titleVi: 'Kiện Tướng Cờ Phù Thủy',
    idleSprite: 'villager_ron_idle',
    walkSprite: 'villager_ron_walk',
    moodBubble: '♟️',
    unlockLevel: 2,
    favoriteItemIds: ['burrow_honeydukes_canon', 'burrow_broomsticks_canon', 'burrow_feast_marquee'],
    greetingsVi: [
      'Làm một ván Cờ Phù Thủy 8×8 ở Đại Sảnh Khảo Thí không bạn hiền?',
      'Mùi kẹo Gác Xép Honeydukes với bánh bí ngô làm mình đói bụng quá!',
    ],
  },
  {
    id: 'hermione',
    nameVi: 'Hermione Granger',
    titleVi: 'Học Giả Thần Chú Đa Ngữ',
    idleSprite: 'villager_hermione_idle',
    walkSprite: 'villager_hermione_walk',
    moodBubble: '📚',
    unlockLevel: 3,
    favoriteItemIds: ['burrow_greenhouse_canon', 'burrow_owl_post', 'burrow_cider_apiary'],
    greetingsVi: [
      'Ôn từ vựng trong Sổ Tay Cổ Ngữ giúp nhận hạt giống 0G và giảm giờ xây nhanh lắm!',
      'Mình vừa tra cứu xong công thức ủ Mật Ong Hoa Thạch Nam trong thư viện!',
    ],
  },
  {
    id: 'hagrid',
    nameVi: 'Rubeus Hagrid',
    titleVi: 'Người Gác Rừng & Chăm Thú Phép',
    idleSprite: 'villager_hagrid_idle',
    walkSprite: 'villager_hagrid_walk',
    moodBubble: '🎃',
    unlockLevel: 5,
    favoriteItemIds: ['hagrid_pumpkin_hut', 'hippogriff_glade', 'unicorn_glade'],
    greetingsVi: [
      'Bí ngô khổng lồ năm nay to bằng cả cỗ xe ngựa Beauxbatons rồi nghen!',
      'Buckbeak và đàn Kỳ Lân Trăng Bạc rất thích ghé chơi thung lũng của bồ!',
    ],
  },
];

export function createInitialGameState(): GameState {
  const now = Date.now();
  const dateKey = getLocalDateKey(new Date(now));

  // Canon Trang Trại Hang Sóc (The Burrow) — Sunny Devon Meadow, Cattail Reed Marsh & Hogsmeade Edge
  const tileOverrides: GameState['tileOverrides'] = {};
  const setTile = (gx: number, gy: number, data: GameState['tileOverrides'][string]): void => {
    const key = `${gx},${gy}`;
    tileOverrides[key] = { ...(tileOverrides[key] ?? {}), ...data };
  };

  // 1. Warm cobbled Hogsmeade street apron under Honeydukes & Three Broomsticks (North-East Hogsmeade zone)
  for (let gy = 5; gy <= 10; gy++) {
    for (let gx = 28; gx <= 45; gx++) {
      if (gx + gy <= 52 && gx - gy >= 19) {
        setTile(gx, gy, { terrain: 'stone' });
      }
    }
  }

  // 2. Scenic Western Babbling Ottery Stream along far-west bank (leaves a vast 31×30 unbroken sunlit meadow at Lv.1!)
  for (let gy = 14; gy <= 44; gy++) {
    const baseGx = gy <= 20 ? 3 : gy <= 36 ? 4 : 5;
    for (let dx = 0; dx <= 1; dx++) {
      const wx = baseGx + dx;
      setTile(wx, gy, { terrain: 'water' });
    }
  }
  // Two cozy oak plank bridges crossing the western stream into the wildflower bank (x = 0..2)
  for (const bx of [3, 4, 5]) {
    if (tileOverrides[`${bx},22`]?.terrain === 'water') {
      setTile(bx, 22, { terrain: 'water', path: 'wood_pier' });
    }
    if (tileOverrides[`${bx},34`]?.terrain === 'water') {
      setTile(bx, 34, { terrain: 'water', path: 'wood_pier' });
    }
  }

  // 3. Southern Winding Cattail Marsh & Frog Pond (in Ao Ếch Xanh Lv.4 & Đồng Cỏ Lv.8, south of Lv.1 meadow)
  for (let gx = 6; gx <= 38; gx++) {
    const centerGy = gx <= 15 ? 45 : gx <= 26 ? 46 : 45;
    for (let dy = -1; dy <= 1; dy++) {
      setTile(gx, centerGy + dy, { terrain: 'water' });
    }
  }
  // Two rustic oak boardwalk bridges crossing the southern marsh!
  for (const gy of [44, 45, 46]) {
    setTile(14, gy, { terrain: 'water', path: 'wood_pier' });
    setTile(15, gy, { terrain: 'water', path: 'wood_pier' });
  }
  for (const gy of [45, 46, 47]) {
    setTile(28, gy, { terrain: 'water', path: 'wood_pier' });
    setTile(29, gy, { terrain: 'water', path: 'wood_pier' });
  }

  // 4. Sparkling Highland Black Lake Cove in Hagrid's Forest zone (x: 57..64, y: 46..51) for Black Lake Boats
  for (let gy = 46; gy <= 51; gy++) {
    for (let gx = 57; gx <= 64; gx++) {
      if ((gx === 57 || gx === 64) && (gy === 46 || gy === 51)) continue;
      setTile(gx, gy, { terrain: 'water' });
    }
  }

  // 5. AAA Sunlit Homestead Golden Cobblestone Lanes connecting the Western Arched Stone Bridge (gy=22) into the Hang Sóc Courtyard!
  const starterCobbleCoords: Array<[number, number]> = [
    [1, 22], [2, 22],
    [6, 22], [7, 22], [8, 22], [9, 22],
    [9, 23], [10, 23], [11, 23], [12, 23], [13, 23], [14, 23], [15, 23], [16, 23], [17, 23], [18, 23], [19, 23], [20, 23], [21, 23],
    [16, 20], [16, 21], [16, 22], [16, 24], [16, 25], [16, 26], [16, 27], [16, 28],
    [12, 27], [13, 27], [14, 27], [15, 27], [17, 27], [18, 27], [19, 27], [20, 27],
  ];
  for (const [cgx, cgy] of starterCobbleCoords) {
    if (tileOverrides[`${cgx},${cgy}`]?.terrain !== 'water') {
      setTile(cgx, cgy, { ...(tileOverrides[`${cgx},${cgy}`] ?? {}), path: 'cobble' });
    }
  }

  const mkBuilding = (
    uid: string,
    itemId: string,
    gx: number,
    gy: number,
    readyBubbles = 0,
    storedGalleons = 0,
    storedXp = 0,
    indestructible = false
  ): PlacedBuilding => ({
    uid,
    itemId,
    gx,
    gy,
    rotation: 0,
    stars: 2,
    placedAt: now,
    constructEndsAt: now,
    lastTickAt: now,
    storedGalleons,
    storedXp,
    readyBubbles,
    durability: 100,
    visitorsServed: 24,
    isIndestructible: indestructible,
  });

  // Build-From-Scratch Lv.1 Start: 2 merged tilled farmland plots + 2 merged animal pastures in the 36×30 sunlit valley!
  const starterBuildings: PlacedBuilding[] = [
    {
      ...mkBuilding('burrow_plot_wheat', 'farmland_plot', 17, 25, 1, 18, 8),
      stars: 1,
      cropId: 'ottery_wheat',
      cropPlantedAt: now - 35_000,
      cropReadyAt: now - 2_000,
      cropWateredBoost: false,
      harvestCycleCount: -1,
    },
    {
      ...mkBuilding('burrow_plot_empty', 'farmland_plot', 19, 25),
      stars: 1,
    },
    {
      ...mkBuilding('burrow_pasture_hen', 'burrow_animal_pasture', 12, 25, 1, 26, 12),
      stars: 1,
      pastureAnimalId: 'burrow_hen',
      pastureStockedAt: now - 32_000,
      pastureReadyAt: now - 2_000,
      pastureFedBoost: false,
      harvestCycleCount: -1,
    },
    {
      ...mkBuilding('burrow_pasture_empty', 'burrow_animal_pasture', 14, 25),
      stars: 1,
    },
  ];

  return {
    version: 6,
    parkName: 'Trang Trại Hang Sóc',
    level: 1,
    xp: 0,
    galleons: 450,
    timeSand: 5,
    sandboxMode: false,
    parkEntryFee: 0,
    unlockedZones: ['ga_hogsmeade', 'hem_xeo'],
    buildings: starterBuildings,
    tileOverrides,
    storyQuestIndex: 0,
    storyQuestProgress: {},
    storyClaimedIds: [],
    owlQuests: [
      createOwlOrderQuest(1, 0),
      createOwlOrderQuest(1, 1),
      createOwlOrderQuest(1, 4),
    ],
    dailyQuests: createDailyQuests(1, dateKey),
    lastDailyResetKey: dateKey,
    collectedCards: {},
    housePoints: {
      Gryffindor: 0,
      Slytherin: 0,
      Ravenclaw: 0,
      Hufflepuff: 0,
    },
    houseCupMilestoneTier: 1,
    supply: createInitialSupplyState(1),
    farmBarn: createInitialFarmBarnState(),
    languageQuiz: createInitialLanguageQuizState(),
    tutorial: createInitialTutorialState(true),
    harvestFeast: createInitialHarvestFeastState(),
    neighborSocial: createInitialNeighborSocialState(now),
    suitcase: createInitialSuitcaseState(),
    match3: createInitialMatch3State(),
    puzzleArcade: createInitialPuzzleArcadeState(),
    lastPlayedMinigame: 'match3',
    levelUpTrialCompletedLevel: 0,
    puzzleLevelWinsProgress: 0,
    featuredStarClaimedLevel: 0,
    phoenixTalismans: 1,
    quizTalismanProgress: 0,
    retention: createDefaultRetentionState(),
    staffPatrolZones: {},
    lastProphetHeadline: {
      title: 'KHAI HOANG ĐỒI CỎ HANG SÓC — THÁP 5 MÔN GIẢI ĐỐ 777 MÀN!',
      subtitle: 'Chinh phục 5×777 màn Giải Đố tích lũy 🌟 Sao Phép Thuật & Cấp Độ để kiến tạo Đại Điền Trang!',
      positive: true,
    },
    finance: {
      gateRevenue: 0,
      ticketRevenue: 0,
      shopRevenue: 0,
      harvestRevenue: 0,
      staffWagesPaid: 0,
      constructionSpent: 0,
    },
    stats: {
      totalGalleonsHarvested: 0,
      farmHarvestsCount: 0,
      neighborHelpsDone: 0,
      butterbeerServed: 0,
      wandsSold: 0,
      spellsCastByGuests: 0,
      creaturesFed: 0,
      starUpgradesDone: 0,
      pathsPlaced: 0,
      nifflersCaught: 0,
      coasterRiders: 0,
      cardsFound: 0,
      repairsDone: 0,
      cargoTrainsSent: 0,
      vipsHosted: 0,
      minigamesWon: 0,
    },
    staffHired: {
      caretaker: 1,
      artificer: 1,
      magizoologist: 1,
      auror: 0,
      house_elf: 0,
    },
    settings: {
      showGrid: false,
      cutawayMode: false,
      soundEnabled: true,
      bgmEnabled: true,
      weatherOverride: 'clear',
      timeOverride: 'day',
      activeFestival: 'auto',
    },
    lastSavedAt: now,
  };
}

export function sanitizePlainText(val: unknown, maxLen = 220): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>]/g, '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, maxLen);
}

export function clampFinite(val: unknown, min: number, max: number, fallback: number): number {
  const n = typeof val === 'number' && Number.isFinite(val) ? val : fallback;
  return Math.max(min, Math.min(max, n));
}

export function getItemPriceBounds(item: CatalogItem): { min: number; max: number } {
  const base = Math.max(2, item.ticketPrice ?? 12);
  return {
    min: Math.max(1, Math.round(base * 0.5)),
    max: Math.max(4, Math.round(base * 2.0)),
  };
}

export function sanitizeQuestList(raw: unknown, fallback: QuestDef[]): QuestDef[] {
  if (!Array.isArray(raw)) return fallback;
  const cleaned: QuestDef[] = [];
  for (const q of raw.slice(0, 8)) {
    if (!q || typeof q !== 'object') continue;
    const rec = q as QuestDef;
    if (typeof rec.id !== 'string' || typeof rec.objectiveType !== 'string') continue;
    cleaned.push({
      ...rec,
      id: sanitizePlainText(rec.id, 64),
      giverName: sanitizePlainText(rec.giverName, 64) || 'Cú Đưa Thư',
      giverTitle: sanitizePlainText(rec.giverTitle, 80),
      giverEmoji: sanitizePlainText(rec.giverEmoji, 8) || '🦉',
      title: sanitizePlainText(rec.title, 120) || 'Nhiệm vụ phép thuật',
      dialogue: sanitizePlainText(rec.dialogue, 280),
      targetAmount: Math.round(clampFinite(rec.targetAmount, 1, 9999999, 1)),
      progress: Math.round(clampFinite(rec.progress, 0, 9999999, 0)),
      rewardGalleons: Math.round(clampFinite(rec.rewardGalleons, 0, 9999999, 50)),
      rewardXp: Math.round(clampFinite(rec.rewardXp, 0, 9999999, 25)),
      rewardTimeSand: Math.round(clampFinite(rec.rewardTimeSand, 0, 999, 0)),
      completed: Boolean(rec.completed),
      claimed: Boolean(rec.claimed),
    });
  }
  return cleaned.length > 0 ? cleaned : fallback;
}

function sanitizeSudoku9x9NumberMatrix(
  raw: unknown,
  min: number,
  max: number
): number[][] | null {
  if (!Array.isArray(raw) || raw.length !== 9) return null;
  const out: number[][] = [];
  for (let r = 0; r < 9; r++) {
    const row = raw[r];
    if (!Array.isArray(row) || row.length !== 9) return null;
    const outRow: number[] = [];
    for (let c = 0; c < 9; c++) {
      const n = row[c];
      if (typeof n !== 'number' || !Number.isFinite(n)) return null;
      const iv = Math.round(n);
      if (iv < min || iv > max) return null;
      outRow.push(iv);
    }
    out.push(outRow);
  }
  return out;
}

function sanitizeSudoku9x9BooleanMatrix(raw: unknown): boolean[][] | null {
  if (!Array.isArray(raw) || raw.length !== 9) return null;
  const out: boolean[][] = [];
  for (let r = 0; r < 9; r++) {
    const row = raw[r];
    if (!Array.isArray(row) || row.length !== 9) return null;
    out.push(row.map((v) => Boolean(v)));
  }
  return out;
}

function sanitizeSudokuCoord(raw: unknown): { r: number; c: number } | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as { r?: unknown; c?: unknown };
  if (typeof rec.r !== 'number' || typeof rec.c !== 'number') return null;
  const r = Math.round(rec.r);
  const c = Math.round(rec.c);
  if (!Number.isFinite(r) || !Number.isFinite(c) || r < 0 || r >= 9 || c < 0 || c >= 9) {
    return null;
  }
  return { r, c };
}

export function sanitizeSavedSudokuSession(
  raw: unknown,
  expectedStage: number
): SavedSudokuSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Partial<SavedSudokuSession>;
  if (Math.round(clampFinite(rec.stage, -1, MAX_MINIGAME_STAGE, -1)) !== expectedStage) {
    return null;
  }
  if (rec.status !== 'playing' && rec.status !== 'lost') {
    return null;
  }
  const solution = sanitizeSudoku9x9NumberMatrix(rec.solution, 1, 9);
  const initialGiven = sanitizeSudoku9x9BooleanMatrix(rec.initialGiven);
  const given = sanitizeSudoku9x9BooleanMatrix(rec.given);
  const grid = sanitizeSudoku9x9NumberMatrix(rec.grid, 0, 9);
  const notes = sanitizeSudoku9x9NumberMatrix(rec.notes, 0, 0x3fe);
  if (!solution || !initialGiven || !given || !grid || !notes) {
    return null;
  }
  let allSolved = true;
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if ((initialGiven[r][c] || given[r][c]) && grid[r][c] !== solution[r][c]) {
        return null;
      }
      if (grid[r][c] !== solution[r][c]) {
        allSolved = false;
      }
    }
  }
  if (allSolved) {
    return null;
  }

  const editHistory: Array<{ r: number; c: number }> = [];
  if (Array.isArray(rec.editHistory)) {
    for (const item of rec.editHistory.slice(-81)) {
      const pt = sanitizeSudokuCoord(item);
      if (pt) editHistory.push(pt);
    }
  }

  const undoStack: SavedSudokuUndoItem[] = [];
  if (Array.isArray(rec.undoStack)) {
    for (const item of rec.undoStack.slice(-60)) {
      if (!item || typeof item !== 'object') continue;
      const u = item as Partial<SavedSudokuUndoItem>;
      const uGrid = sanitizeSudoku9x9NumberMatrix(u.grid, 0, 9);
      const uNotes = sanitizeSudoku9x9NumberMatrix(u.notes, 0, 0x3fe);
      if (!uGrid || !uNotes) continue;
      undoStack.push({
        grid: uGrid,
        notes: uNotes,
        selected: sanitizeSudokuCoord(u.selected),
      });
    }
  }

  const maxMistakes = Math.round(clampFinite(rec.maxMistakes, 3, 12, 3));
  return {
    stage: expectedStage,
    solution,
    initialGiven,
    given,
    grid,
    notes,
    mistakesCount: Math.round(clampFinite(rec.mistakesCount, 0, maxMistakes + 3, 0)),
    maxMistakes,
    freeHintsLeft: Math.round(clampFinite(rec.freeHintsLeft, 0, 20, 1)),
    paidHintsLeft: Math.round(clampFinite(rec.paidHintsLeft, 0, 20, 2)),
    talismanUsed: Boolean(rec.talismanUsed),
    pencilMode: Boolean(rec.pencilMode),
    eraseMode: Boolean(rec.eraseMode),
    selected: sanitizeSudokuCoord(rec.selected),
    highlightDigit: Math.round(clampFinite(rec.highlightDigit, 0, 9, 0)),
    elapsedSec: clampFinite(rec.elapsedSec, 0, 864000, 0),
    status: rec.status,
    editHistory,
    undoStack,
    companionCharge: Math.round(clampFinite(rec.companionCharge, 0, 20, 0)),
    snackPieUsed: Boolean(rec.snackPieUsed),
    savedAt: Math.round(clampFinite(rec.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now())),
  };
}

export function sanitizeSavedCaroSession(
  raw: unknown,
  expectedStage: number
): SavedCaroSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Partial<SavedCaroSession>;
  if (Math.round(clampFinite(rec.stage, -1, MAX_MINIGAME_STAGE, -1)) !== expectedStage) {
    return null;
  }
  if (
    rec.status !== 'playing' &&
    rec.status !== 'ai_thinking' &&
    rec.status !== 'lost' &&
    rec.status !== 'draw'
  ) {
    return null;
  }
  if (!Array.isArray(rec.grid) || rec.grid.length !== 13) return null;
  const grid: Array<Array<0 | 1 | 2 | 3>> = [];
  let runeSealCount = 0;
  for (let r = 0; r < 13; r++) {
    const row = rec.grid[r];
    if (!Array.isArray(row) || row.length !== 13) return null;
    const outRow: Array<0 | 1 | 2 | 3> = [];
    for (let c = 0; c < 13; c++) {
      const v = row[c];
      if (v !== 0 && v !== 1 && v !== 2 && v !== 3) return null;
      if (v === 3) runeSealCount++;
      outRow.push(v);
    }
    grid.push(outRow);
  }

  const validPt = (p: unknown): { r: number; c: number } | null => {
    if (!p || typeof p !== 'object') return null;
    const pr = p as { r?: unknown; c?: unknown };
    if (typeof pr.r !== 'number' || typeof pr.c !== 'number') return null;
    const r = Math.round(pr.r);
    const c = Math.round(pr.c);
    if (!Number.isFinite(r) || !Number.isFinite(c) || r < 0 || r >= 13 || c < 0 || c >= 13) {
      return null;
    }
    return { r, c };
  };

  const moveHistory: Array<{ r: number; c: number; stone: 1 | 2 }> = [];
  if (Array.isArray(rec.moveHistory)) {
    for (const m of rec.moveHistory.slice(0, 169)) {
      const pt = validPt(m);
      const st = (m as { stone?: unknown })?.stone;
      if (pt && (st === 1 || st === 2)) {
        moveHistory.push({ r: pt.r, c: pt.c, stone: st });
      }
    }
  }

  return {
    stage: expectedStage,
    grid,
    moveHistory,
    initialHistoryLen: Math.round(
      clampFinite(rec.initialHistoryLen, 0, moveHistory.length, 0)
    ),
    runeSealCount,
    winningLine: Array.isArray(rec.winningLine)
      ? rec.winningLine
          .map((p) => validPt(p))
          .filter((p): p is { r: number; c: number } => Boolean(p))
          .slice(0, 13)
      : null,
    hintCell: validPt(rec.hintCell),
    freeUndosLeft: Math.round(clampFinite(rec.freeUndosLeft, 0, 10, 0)),
    paidUndosLeft: Math.round(clampFinite(rec.paidUndosLeft, 0, 10, 1)),
    freeHintsLeft: Math.round(clampFinite(rec.freeHintsLeft, 0, 10, 0)),
    paidHintsLeft: Math.round(clampFinite(rec.paidHintsLeft, 0, 10, 1)),
    talismanUsed: Boolean(rec.talismanUsed),
    status: rec.status,
    companionCharge: Math.round(clampFinite(rec.companionCharge, 0, 20, 0)),
    snackPieUsed: Boolean(rec.snackPieUsed),
    savedAt: Math.round(clampFinite(rec.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now())),
  };
}

function sanitizeChessBoard8x8(raw: unknown): Array<Array<SavedChessPiece | null>> | null {
  if (!Array.isArray(raw) || raw.length !== 8) return null;
  const validTypes = new Set<SavedChessPiece['type']>(['p', 'n', 'b', 'r', 'q', 'k']);
  let wKings = 0;
  let bKings = 0;
  const out: Array<Array<SavedChessPiece | null>> = [];
  for (let r = 0; r < 8; r++) {
    const row = raw[r];
    if (!Array.isArray(row) || row.length !== 8) return null;
    const outRow: Array<SavedChessPiece | null> = [];
    for (let c = 0; c < 8; c++) {
      const cell = row[c];
      if (cell === null || cell === undefined) {
        outRow.push(null);
        continue;
      }
      if (!cell || typeof cell !== 'object') return null;
      const cp = cell as Partial<SavedChessPiece>;
      if ((cp.color !== 'w' && cp.color !== 'b') || !cp.type || !validTypes.has(cp.type)) {
        return null;
      }
      if (cp.type === 'k') {
        if (cp.color === 'w') wKings++;
        else bKings++;
      }
      outRow.push({ color: cp.color, type: cp.type });
    }
    out.push(outRow);
  }
  if (wKings !== 1 || bKings !== 1) return null;
  return out;
}

export function sanitizeSavedChessSession(
  raw: unknown,
  expectedStage: number
): SavedChessSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Partial<SavedChessSession>;
  if (Math.round(clampFinite(rec.stage, -1, MAX_MINIGAME_STAGE, -1)) !== expectedStage) {
    return null;
  }
  if (rec.subMode !== 'tactics' && rec.subMode !== 'match') return null;
  if (rec.turn !== 'w' && rec.turn !== 'b') return null;
  if (
    rec.status !== 'playing' &&
    rec.status !== 'ai_thinking' &&
    rec.status !== 'lost' &&
    rec.status !== 'draw'
  ) {
    return null;
  }
  const board = sanitizeChessBoard8x8(rec.board);
  if (!board) return null;

  const validTypes = new Set<SavedChessPiece['type']>(['p', 'n', 'b', 'r', 'q', 'k']);
  const validSq = (s: unknown): { r: number; c: number } | null => {
    if (!s || typeof s !== 'object') return null;
    const sq = s as { r?: unknown; c?: unknown };
    if (typeof sq.r !== 'number' || typeof sq.c !== 'number') return null;
    const r = Math.round(sq.r);
    const c = Math.round(sq.c);
    if (!Number.isFinite(r) || !Number.isFinite(c) || r < 0 || r >= 8 || c < 0 || c >= 8) {
      return null;
    }
    return { r, c };
  };
  const validMv = (
    m: unknown
  ): { fromR: number; fromC: number; toR: number; toC: number } | null => {
    if (!m || typeof m !== 'object') return null;
    const mv = m as Record<string, unknown>;
    if (
      typeof mv.fromR !== 'number' ||
      typeof mv.fromC !== 'number' ||
      typeof mv.toR !== 'number' ||
      typeof mv.toC !== 'number'
    ) {
      return null;
    }
    const fromR = Math.round(mv.fromR);
    const fromC = Math.round(mv.fromC);
    const toR = Math.round(mv.toR);
    const toC = Math.round(mv.toC);
    if (
      fromR < 0 ||
      fromR >= 8 ||
      fromC < 0 ||
      fromC >= 8 ||
      toR < 0 ||
      toR >= 8 ||
      toC < 0 ||
      toC >= 8
    ) {
      return null;
    }
    return { fromR, fromC, toR, toC };
  };

  const history: SavedChessHistoryItem[] = [];
  if (Array.isArray(rec.history)) {
    for (const h of rec.history.slice(-40)) {
      if (!h || typeof h !== 'object') continue;
      const hi = h as Partial<SavedChessHistoryItem>;
      if (hi.turn !== 'w' && hi.turn !== 'b') continue;
      const hb = sanitizeChessBoard8x8(hi.board);
      if (!hb) continue;
      history.push({
        board: hb,
        turn: hi.turn,
        castling: {
          wK: Boolean(hi.castling?.wK),
          wQ: Boolean(hi.castling?.wQ),
          bK: Boolean(hi.castling?.bK),
          bQ: Boolean(hi.castling?.bQ),
        },
        enPassant: validSq(hi.enPassant),
        capturedByWhite: Array.isArray(hi.capturedByWhite)
          ? hi.capturedByWhite.filter((t): t is SavedChessPiece['type'] => validTypes.has(t)).slice(0, 16)
          : [],
        capturedByBlack: Array.isArray(hi.capturedByBlack)
          ? hi.capturedByBlack.filter((t): t is SavedChessPiece['type'] => validTypes.has(t)).slice(0, 16)
          : [],
        lastMove: validMv(hi.lastMove),
        halfMoveClock: Math.round(clampFinite(hi.halfMoveClock, 0, 200, 0)),
      });
    }
  }

  return {
    stage: expectedStage,
    subMode: rec.subMode,
    loadedFen: sanitizePlainText(rec.loadedFen, 140),
    board,
    turn: rec.turn,
    castling: {
      wK: Boolean(rec.castling?.wK),
      wQ: Boolean(rec.castling?.wQ),
      bK: Boolean(rec.castling?.bK),
      bQ: Boolean(rec.castling?.bQ),
    },
    enPassant: validSq(rec.enPassant),
    capturedByWhite: Array.isArray(rec.capturedByWhite)
      ? rec.capturedByWhite.filter((t): t is SavedChessPiece['type'] => validTypes.has(t)).slice(0, 16)
      : [],
    capturedByBlack: Array.isArray(rec.capturedByBlack)
      ? rec.capturedByBlack.filter((t): t is SavedChessPiece['type'] => validTypes.has(t)).slice(0, 16)
      : [],
    lastMove: validMv(rec.lastMove),
    hintMove: validMv(rec.hintMove),
    selected: validSq(rec.selected),
    halfMoveClock: Math.round(clampFinite(rec.halfMoveClock, 0, 200, 0)),
    moveCount: Math.round(clampFinite(rec.moveCount, 0, 500, 0)),
    freeUndosLeft: Math.round(clampFinite(rec.freeUndosLeft, 0, 10, 0)),
    paidUndosLeft: Math.round(clampFinite(rec.paidUndosLeft, 0, 10, 1)),
    freeHintsLeft: Math.round(clampFinite(rec.freeHintsLeft, 0, 10, 0)),
    paidAssistsLeft: Math.round(clampFinite(rec.paidAssistsLeft, 0, 5, 1)),
    talismanUsed: Boolean(rec.talismanUsed),
    status: rec.status,
    history,
    companionCharge: Math.round(clampFinite(rec.companionCharge, 0, 20, 0)),
    snackPieUsed: Boolean(rec.snackPieUsed),
    savedAt: Math.round(clampFinite(rec.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now())),
  };
}

export function sanitizeSavedOnetSession(
  raw: unknown,
  expectedStage: number
): SavedOnetSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Partial<SavedOnetSession>;
  if (Math.round(clampFinite(rec.stage, -1, MAX_MINIGAME_STAGE, -1)) !== expectedStage) {
    return null;
  }
  if (rec.status !== 'playing' && rec.status !== 'lost') return null;
  const rows = Math.round(clampFinite(rec.rows, 4, 12, 9));
  const cols = Math.round(clampFinite(rec.cols, 4, 20, 16));
  if (!Array.isArray(rec.grid) || rec.grid.length !== rows) return null;

  let remainingTiles = 0;
  const grid: Array<Array<string | null>> = [];
  for (let r = 0; r < rows; r++) {
    const row = rec.grid[r];
    if (!Array.isArray(row) || row.length !== cols) return null;
    const outRow: Array<string | null> = [];
    for (let c = 0; c < cols; c++) {
      const cell = row[c];
      if (cell === null || cell === undefined) {
        outRow.push(null);
      } else if (typeof cell === 'string' && cell.length > 0 && cell.length <= 32) {
        outRow.push(sanitizePlainText(cell, 32));
        remainingTiles++;
      } else {
        return null;
      }
    }
    grid.push(outRow);
  }
  const totalPairs = Math.floor((rows * cols) / 2);
  if (remainingTiles < 2 || remainingTiles % 2 !== 0 || remainingTiles > rows * cols) {
    return null;
  }

  const validCell = (pt: unknown): { r: number; c: number } | null => {
    if (!pt || typeof pt !== 'object') return null;
    const p = pt as { r?: unknown; c?: unknown };
    if (typeof p.r !== 'number' || typeof p.c !== 'number') return null;
    const r = Math.round(p.r);
    const c = Math.round(p.c);
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  };

  const hp0 = Array.isArray(rec.hintPair) ? validCell(rec.hintPair[0]) : null;
  const hp1 = Array.isArray(rec.hintPair) ? validCell(rec.hintPair[1]) : null;

  return {
    stage: expectedStage,
    rows,
    cols,
    grid,
    selected: validCell(rec.selected),
    hintPair: hp0 && hp1 ? [hp0, hp1] : null,
    hintPath: Array.isArray(rec.hintPath)
      ? rec.hintPath
          .filter(
            (pt): pt is { r: number; c: number } =>
              Boolean(
                pt &&
                  typeof pt === 'object' &&
                  typeof pt.r === 'number' &&
                  typeof pt.c === 'number' &&
                  pt.r >= -1 &&
                  pt.r <= rows &&
                  pt.c >= -1 &&
                  pt.c <= cols
              )
          )
          .slice(0, 8)
          .map((pt) => ({ r: Math.round(pt.r), c: Math.round(pt.c) }))
      : null,
    matchedPairs: totalPairs - remainingTiles / 2,
    combo: Math.round(clampFinite(rec.combo, 0, 200, 0)),
    maxCombo: Math.round(clampFinite(rec.maxCombo, 0, 200, 0)),
    score: Math.round(clampFinite(rec.score, 0, 99999999, 0)),
    movesAttempted: Math.round(clampFinite(rec.movesAttempted, 0, 99999, 0)),
    autoShufflesCount: Math.round(clampFinite(rec.autoShufflesCount, 0, 999, 0)),
    lives: Math.round(clampFinite(rec.lives, 0, 30, 10)),
    freeHintsLeft: Math.round(clampFinite(rec.freeHintsLeft, 0, 15, 0)),
    paidHintsLeft: Math.round(clampFinite(rec.paidHintsLeft, 0, 15, 1)),
    paidShufflesLeft: Math.round(clampFinite(rec.paidShufflesLeft, 0, 15, 1)),
    talismanUsed: Boolean(rec.talismanUsed),
    ...(typeof rec.timeLimitSec === 'number' && Number.isFinite(rec.timeLimitSec)
      ? { timeLimitSec: Math.round(clampFinite(rec.timeLimitSec, 30, 1200, 180)) }
      : {}),
    ...(typeof rec.timeRemainingSec === 'number' && Number.isFinite(rec.timeRemainingSec)
      ? { timeRemainingSec: Math.round(clampFinite(rec.timeRemainingSec, 0, 1200, 180) * 100) / 100 }
      : {}),
    lossReason:
      rec.lossReason === 'timeout' || rec.lossReason === 'deadlock' ? rec.lossReason : null,
    status: rec.status,
    companionCharge: Math.round(clampFinite(rec.companionCharge, 0, 20, 0)),
    snackPieUsed: Boolean(rec.snackPieUsed),
    savedAt: Math.round(clampFinite(rec.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now())),
  };
}

export function sanitizeSavedMatch3Session(
  raw: unknown,
  expectedLevelId: number
): SavedMatch3Session | null {
  if (!raw || typeof raw !== 'object') return null;
  const rec = raw as Partial<SavedMatch3Session>;
  if (Math.round(clampFinite(rec.levelId, -1, MAX_MINIGAME_STAGE, -1)) !== expectedLevelId) {
    return null;
  }
  if (rec.status !== 'playing' && rec.status !== 'out_of_moves') return null;
  const size = Math.round(clampFinite(rec.size, 6, 11, -1));
  if (size < 6 || size > 11) return null;

  const sanitizeMatrix = (m: unknown, maxVal = 20): number[][] | null => {
    if (!Array.isArray(m) || m.length !== size) return null;
    const out: number[][] = [];
    for (let r = 0; r < size; r++) {
      const row = m[r];
      if (!Array.isArray(row) || row.length !== size) return null;
      const outRow: number[] = [];
      for (let c = 0; c < size; c++) {
        const v = row[c];
        if (typeof v !== 'number' || !Number.isFinite(v)) return null;
        const iv = Math.round(v);
        if (iv < 0 || iv > maxVal) return null;
        outRow.push(iv);
      }
      out.push(outRow);
    }
    return out;
  };

  const mask = sanitizeMatrix(rec.mask, 1);
  const jelly = sanitizeMatrix(rec.jelly, 10);
  const ice = sanitizeMatrix(rec.ice, 10);
  const frosting = sanitizeMatrix(rec.frosting, 10);
  const chocolate = sanitizeMatrix(rec.chocolate, 10);
  const cauldron = sanitizeMatrix(rec.cauldron, 10);
  const cauldronCharge = sanitizeMatrix(rec.cauldronCharge, 20);
  const lockGrid = sanitizeMatrix(rec.lockGrid, 10);
  const petrify = sanitizeMatrix(rec.petrify, 10);
  const dementor = sanitizeMatrix(rec.dementor, 10);
  const dementorCharge = sanitizeMatrix(rec.dementorCharge, 20);
  const decree = sanitizeMatrix(rec.decree, 10);
  const fiendfyre = sanitizeMatrix(rec.fiendfyre, 10);
  const horcrux = sanitizeMatrix(rec.horcrux, 10);
  if (
    !mask ||
    !jelly ||
    !ice ||
    !frosting ||
    !chocolate ||
    !cauldron ||
    !cauldronCharge ||
    !lockGrid ||
    !petrify ||
    !dementor ||
    !dementorCharge ||
    !decree ||
    !fiendfyre ||
    !horcrux
  ) {
    return null;
  }

  if (!Array.isArray(rec.grid) || rec.grid.length !== size) return null;
  const validSpecials = new Set<NonNullable<SavedMatch3Piece['special']>>([
    'striped_h',
    'striped_v',
    'wrapped',
    'seeker',
    'color_bomb',
  ]);
  const grid: Array<Array<SavedMatch3Piece | null>> = [];
  for (let r = 0; r < size; r++) {
    const row = rec.grid[r];
    if (!Array.isArray(row) || row.length !== size) return null;
    const outRow: Array<SavedMatch3Piece | null> = [];
    for (let c = 0; c < size; c++) {
      const cell = row[c];
      if (cell === null || cell === undefined) {
        outRow.push(null);
        continue;
      }
      if (!cell || typeof cell !== 'object') return null;
      const pc = cell as Partial<SavedMatch3Piece>;
      if (typeof pc.color !== 'number' || !Number.isFinite(pc.color)) return null;
      const color = Math.round(pc.color);
      if (color < -1 || color > 8) return null;
      outRow.push({
        color,
        special: pc.special && validSpecials.has(pc.special) ? pc.special : null,
        blocker: pc.blocker === 'swirl' ? 'swirl' : null,
        isIngredient: Boolean(pc.isIngredient),
        bombTimer:
          typeof pc.bombTimer === 'number' && Number.isFinite(pc.bombTimer)
            ? Math.round(clampFinite(pc.bombTimer, 0, 99, 0))
            : null,
        hasKey: Boolean(pc.hasKey),
        primedWrapped: Boolean(pc.primedWrapped),
        primedMega: Boolean(pc.primedMega),
      });
    }
    grid.push(outRow);
  }

  const house: SavedMatch3Session['house'] =
    rec.house === 'gryffindor' ||
    rec.house === 'slytherin' ||
    rec.house === 'ravenclaw' ||
    rec.house === 'hufflepuff'
      ? rec.house
      : 'gryffindor';

  const collected: Record<string, number> = {};
  if (rec.collected && typeof rec.collected === 'object') {
    for (let k = 0; k <= 6; k++) {
      const v = Number((rec.collected as Record<string, unknown>)[String(k)] ?? 0);
      collected[String(k)] = Number.isFinite(v) && v > 0 ? Math.round(Math.min(99999, v)) : 0;
    }
  }

  return {
    levelId: expectedLevelId,
    size,
    house,
    mask,
    jelly,
    ice,
    frosting,
    chocolate,
    cauldron,
    cauldronCharge,
    lockGrid,
    petrify,
    dementor,
    dementorCharge,
    decree,
    fiendfyre,
    horcrux,
    grid,
    ingredientsCollected: Math.round(clampFinite(rec.ingredientsCollected, 0, 99, 0)),
    ingredientsSpawned: Math.round(clampFinite(rec.ingredientsSpawned, 0, 99, 0)),
    pendingBombSpawns: Math.round(clampFinite(rec.pendingBombSpawns, 0, 99, 0)),
    bossHp: Math.round(clampFinite(rec.bossHp, 0, 999999, 0)),
    bossDefeated: Boolean(rec.bossDefeated),
    bossEnraged: Boolean(rec.bossEnraged),
    pendingBossEnrageBurst: Boolean(rec.pendingBossEnrageBurst),
    bossEffectiveCastInterval: Math.round(clampFinite(rec.bossEffectiveCastInterval, 2, 20, 4)),
    patronusCharge: clampFinite(rec.patronusCharge, 0, 100, 0),
    score: Math.round(clampFinite(rec.score, 0, 99999999, 0)),
    movesLeft: Math.round(clampFinite(rec.movesLeft, 0, 99, 1)),
    movesUsed: Math.round(clampFinite(rec.movesUsed, 0, 999, 0)),
    talismanUsed: Boolean(rec.talismanUsed),
    status: rec.status,
    failReason: rec.failReason === 'moves' || rec.failReason === 'bomb' ? rec.failReason : null,
    collected,
    specialStats: {
      striped: Math.round(clampFinite(rec.specialStats?.striped, 0, 9999, 0)),
      wrapped: Math.round(clampFinite(rec.specialStats?.wrapped, 0, 9999, 0)),
      seeker: Math.round(clampFinite(rec.specialStats?.seeker, 0, 9999, 0)),
      color_bomb: Math.round(clampFinite(rec.specialStats?.color_bomb, 0, 9999, 0)),
    },
    movesMadeThisAttempt: Math.round(clampFinite(rec.movesMadeThisAttempt, 0, 999, 0)),
    companionCharge: Math.round(clampFinite(rec.companionCharge, 0, 20, 0)),
    snackPieUsed: Boolean(rec.snackPieUsed),
    savedAt: Math.round(clampFinite(rec.savedAt, 0, Number.MAX_SAFE_INTEGER, Date.now())),
  };
}

export function migrateLoadedState(parsed: GameState): GameState {
  const def = createInitialGameState();
  const parsedSupply = parsed.supply ?? def.supply;
  const safeLevel = Math.round(clampFinite(parsed.level, 1, MAX_LEVEL, 1));

  // Validate and clamp placed buildings against catalog & 48x48 grid bounds (migrating legacy duplicate crop beds -> farmland_plot)
  const LEGACY_CROP_BED_MAP: Record<string, FarmCropId> = {
    burrow_crop_wheat_magic: 'ottery_wheat',
    crop_strawberry_bed: 'ruby_strawberry',
    crop_mandrake_bed: 'baby_mandrake',
    crop_lavender_bed: 'dried_lavender',
    crop_sunflower_bed: 'hedge_sunflower',
  };
  const sandboxAllowedOnLoad = isSandboxRuntimeAllowed();
  const rawBuildings = Array.isArray(parsed.buildings) ? parsed.buildings : def.buildings;
  const safeBuildings: PlacedBuilding[] = [];
  for (const b of rawBuildings) {
    if (!b || typeof b !== 'object' || typeof b.itemId !== 'string') continue;
    if (!sandboxAllowedOnLoad && b.builtInSandbox) continue;
    const legacyCrop = LEGACY_CROP_BED_MAP[b.itemId];
    const resolvedItemId = legacyCrop ? 'farmland_plot' : b.itemId;
    const item = getCatalogItem(resolvedItemId);
    if (!item) continue;
    const rot = ([0, 1, 2, 3].includes(b.rotation) ? b.rotation : 0) as 0 | 1 | 2 | 3;
    const bw = rot % 2 === 1 ? item.height : item.width;
    const bh = rot % 2 === 1 ? item.width : item.height;
    if (typeof b.gx !== 'number' || typeof b.gy !== 'number' || !Number.isFinite(b.gx) || !Number.isFinite(b.gy)) {
      continue;
    }
    const gx = Math.round(b.gx);
    const gy = Math.round(b.gy);
    if (gx < 0 || gy < 0 || gx > GRID_SIZE - bw || gy > GRID_SIZE - bh) continue;
    const bounds = getItemPriceBounds(item);
    const resolvedCropId: FarmCropId | null | undefined = item.isFarmlandPlot
      ? b.cropId && b.cropId in FARM_CROPS
        ? b.cropId
        : b.cropId === null
          ? null
          : legacyCrop
      : undefined;
    const resolvedPastureAnimalId: PastureAnimalId | null | undefined = item.isAnimalPasturePlot
      ? b.pastureAnimalId && b.pastureAnimalId in PASTURE_ANIMALS
        ? b.pastureAnimalId
        : null
      : undefined;
    const isHoneydukesLauncher = resolvedItemId === 'burrow_honeydukes_canon';
    safeBuildings.push({
      ...b,
      itemId: resolvedItemId,
      uid: sanitizePlainText(b.uid, 80) || `${resolvedItemId}_${gx}_${gy}`,
      gx,
      gy,
      rotation: rot,
      stars: Math.round(clampFinite(b.stars, 1, 5, 1)),
      storedGalleons: isHoneydukesLauncher ? 0 : Math.round(clampFinite(b.storedGalleons, 0, 9999999, 0)),
      storedXp: isHoneydukesLauncher ? 0 : Math.round(clampFinite(b.storedXp, 0, 9999999, 0)),
      readyBubbles: isHoneydukesLauncher ? 0 : Math.round(clampFinite(b.readyBubbles, 0, 50, 0)),
      durability: clampFinite(b.durability, 0, 100, 100),
      visitorsServed: Math.round(clampFinite(b.visitorsServed, 0, 99999999, 0)),
      buildReducedSec:
        typeof b.buildReducedSec === 'number' && Number.isFinite(b.buildReducedSec)
          ? Math.max(0, Math.round(b.buildReducedSec))
          : undefined,
      customPrice:
        typeof b.customPrice === 'number' && Number.isFinite(b.customPrice)
          ? Math.round(clampFinite(b.customPrice, bounds.min, bounds.max, item.ticketPrice ?? bounds.min))
          : undefined,
      breakdownReason: b.breakdownReason ? sanitizePlainText(b.breakdownReason, 120) : undefined,
      creatureNickname: b.creatureNickname ? sanitizePlainText(b.creatureNickname, 28) : undefined,
      creatureHunger: item.isCreatureHabitat
        ? item.isRuralFarmstead
          ? 96
          : clampFinite(b.creatureHunger, 5, 100, 92)
        : undefined,
      creatureHappiness: item.isCreatureHabitat
        ? item.isRuralFarmstead
          ? 98
          : clampFinite(b.creatureHappiness, 10, 100, 95)
        : undefined,
      creatureBondLevel: item.isCreatureHabitat
        ? Math.round(clampFinite(b.creatureBondLevel, 1, MAX_BOND_LEVEL, 1))
        : undefined,
      creatureBondXp: item.isCreatureHabitat
        ? Math.round(clampFinite(b.creatureBondXp, 0, 999999, 0))
        : undefined,
      creatureMorph: item.isCreatureHabitat
        ? ((['normal', 'mystic', 'radiant'].includes(b.creatureMorph as string)
            ? b.creatureMorph
            : 'normal') as CreatureMorphVariant)
        : undefined,
      builtInSandbox: b.builtInSandbox ? true : undefined,
      awaitingUnveil: Boolean(b.awaitingUnveil) ? true : undefined,
      cropId: resolvedCropId,
      cropPlantedAt: item.isFarmlandPlot && typeof b.cropPlantedAt === 'number' ? b.cropPlantedAt : undefined,
      cropReadyAt: item.isFarmlandPlot && typeof b.cropReadyAt === 'number' ? b.cropReadyAt : undefined,
      cropWateredBoost: item.isFarmlandPlot ? Boolean(b.cropWateredBoost) : false,
      pastureAnimalId: resolvedPastureAnimalId,
      pastureStockedAt:
        item.isAnimalPasturePlot && typeof b.pastureStockedAt === 'number' ? b.pastureStockedAt : undefined,
      pastureReadyAt:
        item.isAnimalPasturePlot && typeof b.pastureReadyAt === 'number' ? b.pastureReadyAt : undefined,
      pastureFedBoost: item.isAnimalPasturePlot ? Boolean(b.pastureFedBoost) : false,
      workshopQueue:
        !isHoneydukesLauncher && Array.isArray(b.workshopQueue)
          ? b.workshopQueue
              .filter((s) => s && typeof s.goodId === 'string' && s.goodId in FARM_GOODS)
              .slice(0, 6)
          : undefined,
      readyFarmGoods:
        !isHoneydukesLauncher && Array.isArray(b.readyFarmGoods)
          ? b.readyFarmGoods.filter((g): g is FarmGoodId => typeof g === 'string' && g in FARM_GOODS).slice(0, 12)
          : undefined,
      harvestCycleCount:
        typeof b.harvestCycleCount === 'number' && Number.isFinite(b.harvestCycleCount)
          ? Math.max(-1, Math.min(50, Math.round(b.harvestCycleCount)))
          : undefined,
    });
  }

  const rawSuitcase = parsed.suitcase ?? def.suitcase;
  const morphSet = new Set<string>(
    Array.isArray(rawSuitcase.discoveredMorphs)
      ? rawSuitcase.discoveredMorphs.filter((m): m is string => {
          if (typeof m !== 'string' || m.length >= 60) return false;
          const prefix = m.split(':')[0] ?? '';
          return Boolean(getSpeciesProfile(prefix));
        })
      : []
  );
  for (const b of safeBuildings) {
    if (b.creatureMorph && getSpeciesProfile(b.itemId)) {
      morphSet.add(`${b.itemId}:normal`);
      morphSet.add(`${b.itemId}:${b.creatureMorph}`);
    }
  }

  // Seamlessly align storyQuestIndex with STORY_QUESTS
  const claimedList = Array.isArray(parsed.storyClaimedIds)
    ? parsed.storyClaimedIds.filter((id): id is string => typeof id === 'string')
    : [];
  const claimedSet = new Set(claimedList);
  const firstUnclaimedIdx = STORY_QUESTS.findIndex((q) => !claimedSet.has(q.id));
  const syncedStoryIdx = firstUnclaimedIdx === -1 ? STORY_QUESTS.length : firstUnclaimedIdx;

  const rawHeadline = parsed.lastProphetHeadline;
  const safeHeadline =
    rawHeadline && typeof rawHeadline === 'object'
      ? {
          title: sanitizePlainText(rawHeadline.title, 180) || def.lastProphetHeadline!.title,
          subtitle: sanitizePlainText(rawHeadline.subtitle, 240) || def.lastProphetHeadline!.subtitle,
          positive: Boolean(rawHeadline.positive),
        }
      : def.lastProphetHeadline;

  const rawStaff = parsed.staffHired ?? def.staffHired;
  const defBarn = def.farmBarn ?? createInitialFarmBarnState();
  const parsedBarn = parsed.farmBarn;
  const safeBarn: FarmBarnState = parsedBarn
    ? {
        capacity: Math.round(clampFinite(parsedBarn.capacity, 40, 2000, defBarn.capacity)),
        ordersDelivered: Math.round(clampFinite(parsedBarn.ordersDelivered, 0, 999999, 0)),
        crops: { ...defBarn.crops, ...(parsedBarn.crops ?? {}) },
        goods: { ...defBarn.goods, ...(parsedBarn.goods ?? {}) },
        seeds: { ...(defBarn.seeds ?? {}), ...(parsedBarn.seeds ?? {}) },
        owlOrders:
          Array.isArray(parsedBarn.owlOrders) && parsedBarn.owlOrders.length > 0
            ? parsedBarn.owlOrders.slice(0, 6).map((o) => ({
                ...o,
                portraitSprite:
                  o.portraitSprite && o.portraitSprite.startsWith('guest_')
                    ? undefined
                    : o.portraitSprite,
              }))
            : defBarn.owlOrders,
      }
    : defBarn;

  const parsedVersion = typeof parsed.version === 'number' ? parsed.version : 0;
  let safeTileOverrides: GameState['tileOverrides'];
  if (parsedVersion < 6) {
    // Migrate legacy 48×48 valley tileOverrides cleanly onto the expanded 72×72 (36×30 Lv.1) valley!
    safeTileOverrides = { ...def.tileOverrides };
    const rawOv = parsed.tileOverrides ?? {};
    for (const [key, ov] of Object.entries(rawOv)) {
      if (!ov || typeof ov !== 'object') continue;
      const parts = key.split(',');
      const kx = Number(parts[0]);
      const ky = Number(parts[1]);
      if (!Number.isInteger(kx) || !Number.isInteger(ky) || kx < 0 || ky < 0 || kx >= GRID_SIZE || ky >= GRID_SIZE) {
        continue;
      }
      const isLegacyAutoBridge =
        ov.path === 'wood_pier' &&
        ((ky === 30 && kx >= 11 && kx <= 14) || (ky === 26 && kx >= 18 && kx <= 22));
      const nextPatch: Partial<GameState['tileOverrides'][string]> = {};
      if (ov.path && ov.path !== 'none' && !isLegacyAutoBridge) {
        nextPatch.path = ov.path;
      }
      if (typeof ov.elevation === 'number' && ov.elevation > 0) {
        nextPatch.elevation = Math.min(3, Math.round(ov.elevation));
      }
      if (ov.coasterTrack) nextPatch.coasterTrack = true;
      if (ov.zooFence) nextPatch.zooFence = true;
      if (ov.hasLitter) nextPatch.hasLitter = true;
      if (Object.keys(nextPatch).length > 0) {
        safeTileOverrides[key] = { ...(safeTileOverrides[key] ?? {}), ...nextPatch };
      }
    }
    // Guarantee dry ground under every migrated non-water building (and water under Black Lake Boats)
    for (const b of safeBuildings) {
      const it = getCatalogItem(b.itemId);
      if (!it) continue;
      const bw = b.rotation % 2 === 1 ? it.height : it.width;
      const bh = b.rotation % 2 === 1 ? it.width : it.height;
      for (let dy = 0; dy < bh; dy++) {
        for (let dx = 0; dx < bw; dx++) {
          const k = `${b.gx + dx},${b.gy + dy}`;
          if (b.itemId === 'black_lake_boats') {
            safeTileOverrides[k] = { ...(safeTileOverrides[k] ?? {}), terrain: 'water' };
          } else if (safeTileOverrides[k]?.terrain === 'water') {
            safeTileOverrides[k] = { ...(safeTileOverrides[k] ?? {}), terrain: 'grass' };
          }
        }
      }
    }
  } else {
    safeTileOverrides = { ...(parsed.tileOverrides ?? def.tileOverrides) };
  }

  // Non-destructively upgrade pre-AAA saves that had 0 golden cobblestone lanes so existing players immediately see sculpted roads!
  let existingCobbleCount = 0;
  for (const ov of Object.values(safeTileOverrides)) {
    if (ov?.path === 'cobble') {
      existingCobbleCount++;
      if (existingCobbleCount >= 6) break;
    }
  }
  if (existingCobbleCount < 6) {
    const occupiedFootprint = new Set<string>();
    for (const b of safeBuildings) {
      const it = getCatalogItem(b.itemId);
      const bw = it ? (b.rotation % 2 === 1 ? it.height : it.width) : 2;
      const bh = it ? (b.rotation % 2 === 1 ? it.width : it.height) : 2;
      for (let dy = 0; dy < bh; dy++) {
        for (let dx = 0; dx < bw; dx++) {
          occupiedFootprint.add(`${b.gx + dx},${b.gy + dy}`);
        }
      }
    }
    for (const [k, defOv] of Object.entries(def.tileOverrides)) {
      if (defOv?.path !== 'cobble') continue;
      if (occupiedFootprint.has(k)) continue;
      const curOv = safeTileOverrides[k];
      if (curOv?.terrain === 'water') continue;
      if (!curOv?.path || curOv.path === 'none') {
        safeTileOverrides[k] = { ...(curOv ?? {}), path: 'cobble' };
      }
    }
  }

  const validZoneIds = new Set<ZoneId>(ZONES.map((z) => z.id));
  const unlockedZoneSet = new Set<ZoneId>(['ga_hogsmeade', 'hem_xeo']);
  if (Array.isArray(parsed.unlockedZones)) {
    for (const zid of parsed.unlockedZones) {
      if (validZoneIds.has(zid as ZoneId)) {
        unlockedZoneSet.add(zid as ZoneId);
      }
    }
  }
  for (const b of safeBuildings) {
    unlockedZoneSet.add(getZoneAt(b.gx, b.gy).id);
  }

  const unveiledSeedSet = new Set<string>(
    Array.isArray(parsed.unveiledItemIds)
      ? parsed.unveiledItemIds.filter((id): id is string => typeof id === 'string').slice(0, 200)
      : []
  );
  const finishXpSeedSet = new Set<string>(
    Array.isArray(parsed.finishXpItemIds)
      ? parsed.finishXpItemIds.filter((id): id is string => typeof id === 'string').slice(0, 200)
      : []
  );
  const loadNowMs = Date.now();
  for (const b of safeBuildings) {
    if (b.builtInSandbox) continue;
    const it = getCatalogItem(b.itemId);
    if (!it) continue;
    if (loadNowMs >= b.constructEndsAt && b.constructionNotified !== false) {
      finishXpSeedSet.add(it.id);
      const isCeremonial =
        !it.isFarmlandPlot &&
        !it.isAnimalPasturePlot &&
        (getItemPuzzleStarCost(it) > 0 || it.category !== 'decor');
      if (isCeremonial && !b.awaitingUnveil) {
        unveiledSeedSet.add(it.id);
      }
    }
  }

  const migratedState: GameState = {
    ...def,
    ...parsed,
    version: 6,
    sandboxMode: sandboxAllowedOnLoad ? Boolean(parsed.sandboxMode) : false,
    sandboxTainted: Boolean(parsed.sandboxTainted || parsed.sandboxMode),
    unlockedZones: Array.from(unlockedZoneSet),
    tileOverrides: safeTileOverrides,
    parkName: sanitizePlainText(parsed.parkName, 80) || def.parkName,
    level: safeLevel,
    xp: Math.round(clampFinite(parsed.xp, 0, 99999999, 0)),
    galleons: Math.round(clampFinite(parsed.galleons, 0, 999999999, 280)),
    timeSand: Math.round(clampFinite(parsed.timeSand, 0, 999999, 4)),
    parkEntryFee: 0,
    buildings: safeBuildings,
    unveiledItemIds: Array.from(unveiledSeedSet),
    finishXpItemIds: Array.from(finishXpSeedSet),
    storyClaimedIds: claimedList,
    storyQuestIndex: syncedStoryIdx,
    owlQuests: sanitizeQuestList(parsed.owlQuests, def.owlQuests),
    dailyQuests: sanitizeQuestList(parsed.dailyQuests, def.dailyQuests),
    collectedCards: parsed.collectedCards ?? {},
    housePoints: parsed.housePoints ?? def.housePoints,
    houseCupMilestoneTier: Math.round(clampFinite(parsed.houseCupMilestoneTier, 1, 9999, 1)),
    farmBarn: safeBarn,
    languageQuiz: sanitizeLanguageQuizState(parsed.languageQuiz),
    tutorial: (() => {
      const rawTut = parsed.tutorial;
      if (!rawTut || typeof rawTut !== 'object') {
        const isUntouchedStarter =
          safeLevel <= 1 &&
          (parsed.stats?.totalGalleonsHarvested ?? 0) <= 0 &&
          (parsed.match3?.totalStarsEarned ?? 0) <= 0;
        return createInitialTutorialState(isUntouchedStarter);
      }
      const maxIdx = TUTORIAL_STEPS.length;
      const safeIdx = Math.round(clampFinite(rawTut.stepIndex, 0, maxIdx, 0));
      const stepDef = TUTORIAL_STEPS[safeIdx];
      const safeStepId: TutorialStepId =
        safeIdx >= maxIdx || rawTut.stepId === 'completed'
          ? 'completed'
          : stepDef
            ? stepDef.id
            : TUTORIAL_STEPS[0].id;
      const safeClaimed = Array.isArray(rawTut.claimedSteps)
        ? rawTut.claimedSteps
            .filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0 && n < maxIdx)
        : [];
      const skipped = Boolean(rawTut.skipped);
      const active = Boolean(rawTut.active) && !skipped && safeStepId !== 'completed';
      return {
        active,
        stepIndex: safeStepId === 'completed' ? maxIdx : safeIdx,
        stepId: safeStepId,
        skipped,
        minimized: Boolean(rawTut.minimized),
        completedAt: typeof rawTut.completedAt === 'number' ? rawTut.completedAt : undefined,
        pastureHarvestedInStep3: Boolean(rawTut.pastureHarvestedInStep3),
        claimedSteps: Array.from(new Set(safeClaimed)),
      };
    })(),
    neighborSocial: (() => {
      const defSoc = def.neighborSocial ?? createInitialNeighborSocialState();
      const rawSoc = parsed.neighborSocial;
      if (!rawSoc || typeof rawSoc !== 'object') {
        return defSoc;
      }
      const merged: NeighborSocialState = {
        ...defSoc,
        ...rawSoc,
        playerFriendCode: sanitizePlainText(rawSoc.playerFriendCode, 24) || defSoc.playerFriendCode,
        friendshipTokens: Math.round(clampFinite(rawSoc.friendshipTokens, 0, 99999, defSoc.friendshipTokens)),
        chestsOpened: Math.round(clampFinite(rawSoc.chestsOpened, 0, 99999, 0)),
        heartsReceivedCount: Math.round(clampFinite(rawSoc.heartsReceivedCount, 0, 99999, 3)),
        dailyRescuesGivenIds: Array.isArray(rawSoc.dailyRescuesGivenIds)
          ? rawSoc.dailyRescuesGivenIds.filter((x): x is string => typeof x === 'string').slice(0, 20)
          : [],
        dailyRescuesReceivedCount: Math.round(
          clampFinite(rawSoc.dailyRescuesReceivedCount, 0, MAX_DAILY_MINIGAME_RESCUES, 0)
        ),
        dailyLikedNeighborIds: Array.isArray(rawSoc.dailyLikedNeighborIds)
          ? rawSoc.dailyLikedNeighborIds.filter((x): x is string => typeof x === 'string').slice(0, 50)
          : [],
        dailyMysteryClaimedIds: Array.isArray(rawSoc.dailyMysteryClaimedIds)
          ? rawSoc.dailyMysteryClaimedIds.filter((x): x is string => typeof x === 'string').slice(0, 50)
          : [],
        dailyOwlHelpRequestedCount: Math.round(
          clampFinite(rawSoc.dailyOwlHelpRequestedCount, 0, MAX_DAILY_OWL_HELP_REQUESTS, 0)
        ),
        dailyGardenHelpsCount: Math.round(
          clampFinite(rawSoc.dailyGardenHelpsCount, 0, MAX_DAILY_FRIEND_HELPS, 0)
        ),
        dailyHomeLanternsClaimedCount: Math.round(
          clampFinite(rawSoc.dailyHomeLanternsClaimedCount, 0, MAX_HOME_LANTERN_MARKS, 0)
        ),
        neighbors: Array.isArray(rawSoc.neighbors)
          ? rawSoc.neighbors.filter((n) => !isNpcNeighborProfile(n))
          : [],
        homeLanternMarks: Array.isArray(rawSoc.homeLanternMarks)
          ? rawSoc.homeLanternMarks
              .filter((m) => Boolean(m && !CANON_NPC_NEIGHBOR_IDS.has(m.helperId)))
              .slice(0, MAX_HOME_LANTERN_MARKS)
          : [],
        playerMinigameSos: rawSoc.playerMinigameSos ?? null,
        playerOwlHelpRequests: Array.isArray(rawSoc.playerOwlHelpRequests)
          ? rawSoc.playerOwlHelpRequests.slice(0, 12)
          : [],
        activityLog: Array.isArray(rawSoc.activityLog) ? rawSoc.activityLog.slice(0, 25) : defSoc.activityLog,
      };
      syncNeighborSocialDailyReset(merged);
      return merged;
    })(),
    supply: {
      ...def.supply,
      ...parsedSupply,
      ingredients: {
        ...def.supply.ingredients,
        ...(parsedSupply.ingredients ?? {}),
      },
      goods: {
        ...def.supply.goods,
        ...(parsedSupply.goods ?? {}),
      },
      cargoCrates:
        Array.isArray(parsedSupply.cargoCrates) && parsedSupply.cargoCrates.length === 3
          ? parsedSupply.cargoCrates
          : createCargoCrates(safeLevel, parsedSupply.cargoTrainIndex ?? 1),
    },
    suitcase: {
      ...def.suitcase,
      ...rawSuitcase,
      discoveredMorphs: Array.from(morphSet),
      totalGrooms: Math.round(clampFinite(rawSuitcase.totalGrooms, 0, 999999, 0)),
      totalExpeditions: Math.round(clampFinite(rawSuitcase.totalExpeditions, 0, 999999, 0)),
      totalMorphsHatched: Math.round(clampFinite(rawSuitcase.totalMorphsHatched, 0, 999999, 0)),
    },
    match3: (() => {
      const safeM3Level = Math.round(clampFinite(parsed.match3?.currentLevel, 1, MAX_MINIGAME_STAGE, 1));
      const defaultM3Cleared = Math.max(0, Math.min(MAX_MINIGAME_STAGE, safeM3Level - 1));
      return {
        stars: Math.round(clampFinite(parsed.match3?.stars, 0, 999999, def.match3.stars)),
        totalStarsEarned: Math.round(
          clampFinite(parsed.match3?.totalStarsEarned, 0, 999999, def.match3.totalStarsEarned)
        ),
        currentLevel: safeM3Level,
        maxClearedLevel: Math.round(
          clampFinite(parsed.match3?.maxClearedLevel, 0, MAX_MINIGAME_STAGE, defaultM3Cleared)
        ),
        winStreak: Math.round(clampFinite(parsed.match3?.winStreak, 0, 9999, 0)),
        hearts: Math.round(clampFinite(parsed.match3?.hearts, 0, MAX_MATCH3_HEARTS, MAX_MATCH3_HEARTS)),
        nextHeartAt: Math.round(clampFinite(parsed.match3?.nextHeartAt, 0, Number.MAX_SAFE_INTEGER, 0)),
        boosters: {
          reparo_hammer: Math.round(
            clampFinite(parsed.match3?.boosters?.reparo_hammer, 0, 9999, def.match3.boosters.reparo_hammer)
          ),
          row_col_cannon: Math.round(
            clampFinite(parsed.match3?.boosters?.row_col_cannon, 0, 9999, def.match3.boosters.row_col_cannon)
          ),
          alohomora_shuffle: Math.round(
            clampFinite(
              parsed.match3?.boosters?.alohomora_shuffle,
              0,
              9999,
              def.match3.boosters.alohomora_shuffle
            )
          ),
        },
        levelsWon: Math.round(clampFinite(parsed.match3?.levelsWon, 0, 999999, 0)),
        activeSession: sanitizeSavedMatch3Session(parsed.match3?.activeSession, safeM3Level),
      };
    })(),
    puzzleArcade: (() => {
      const safeSudokuStage = Math.round(
        clampFinite(parsed.puzzleArcade?.sudokuStage, 1, MAX_MINIGAME_STAGE, 1)
      );
      const safeCaroStage = Math.round(
        clampFinite(parsed.puzzleArcade?.caroStage, 1, MAX_MINIGAME_STAGE, 1)
      );
      const safeChessStage = Math.round(
        clampFinite(parsed.puzzleArcade?.chessStage, 1, MAX_MINIGAME_STAGE, 1)
      );
      const safeBlockStage = Math.round(
        clampFinite(parsed.puzzleArcade?.blockStage, 1, MAX_MINIGAME_STAGE, 1)
      );
      return {
        activeMode: (
          ['sudoku', 'caro', 'chess', 'blocks'] as const
        ).includes(parsed.puzzleArcade?.activeMode as PuzzleArcadeMode)
          ? (parsed.puzzleArcade!.activeMode as PuzzleArcadeMode)
          : 'caro',
        sudokuStage: safeSudokuStage,
        caroStage: safeCaroStage,
        chessStage: safeChessStage,
        jigsawStage: Math.round(clampFinite(parsed.puzzleArcade?.jigsawStage, 1, 99999, 1)),
        blockStage: safeBlockStage,
        tileStage: Math.round(clampFinite(parsed.puzzleArcade?.tileStage, 1, 99999, 1)),
        sudokuCleared: Math.round(
          clampFinite(parsed.puzzleArcade?.sudokuCleared, 0, MAX_MINIGAME_STAGE, safeSudokuStage - 1)
        ),
        caroCleared: Math.round(
          clampFinite(parsed.puzzleArcade?.caroCleared, 0, MAX_MINIGAME_STAGE, safeCaroStage - 1)
        ),
        chessCleared: Math.round(
          clampFinite(parsed.puzzleArcade?.chessCleared, 0, MAX_MINIGAME_STAGE, safeChessStage - 1)
        ),
        blockCleared: Math.round(
          clampFinite(parsed.puzzleArcade?.blockCleared, 0, MAX_MINIGAME_STAGE, safeBlockStage - 1)
        ),
        featuredWinsCount: Math.round(
          clampFinite(parsed.puzzleArcade?.featuredWinsCount, 0, 999999, 0)
        ),
        restoredPaintings: Array.isArray(parsed.puzzleArcade?.restoredPaintings)
          ? Array.from(
              new Set(
                parsed.puzzleArcade.restoredPaintings
                  .filter((x: unknown): x is string => typeof x === 'string')
                  .slice(0, 64)
              )
            )
          : [],
        totalPuzzlesSolved: Math.round(
          clampFinite(parsed.puzzleArcade?.totalPuzzlesSolved, 0, 999999, 0)
        ),
        sudokuSession: sanitizeSavedSudokuSession(
          parsed.puzzleArcade?.sudokuSession,
          safeSudokuStage
        ),
        caroSession: sanitizeSavedCaroSession(
          parsed.puzzleArcade?.caroSession,
          safeCaroStage
        ),
        chessSession: sanitizeSavedChessSession(
          parsed.puzzleArcade?.chessSession,
          safeChessStage
        ),
        onetSession: sanitizeSavedOnetSession(
          parsed.puzzleArcade?.onetSession,
          safeBlockStage
        ),
      };
    })(),
    lastPlayedMinigame: (
      ['match3', 'caro', 'sudoku', 'chess', 'blocks', 'seedquiz'] as const
    ).includes(parsed.lastPlayedMinigame as LeaderboardGameId)
      ? (parsed.lastPlayedMinigame as LeaderboardGameId)
      : 'match3',
    levelUpTrialCompletedLevel:
      typeof parsed.levelUpTrialCompletedLevel === 'number' &&
      Number.isFinite(parsed.levelUpTrialCompletedLevel)
        ? Math.round(clampFinite(parsed.levelUpTrialCompletedLevel, 0, MAX_LEVEL, safeLevel - 1))
        : Math.max(0, safeLevel - 1),
    puzzleLevelWinsProgress: Math.round(
      clampFinite(parsed.puzzleLevelWinsProgress, 0, getWinsRequiredForNextLevel(safeLevel), 0)
    ),
    featuredStarClaimedLevel: Math.round(
      clampFinite(parsed.featuredStarClaimedLevel, 0, MAX_LEVEL, 0)
    ),
    phoenixTalismans: Math.round(
      clampFinite(parsed.phoenixTalismans, 0, MAX_PHOENIX_TALISMANS, 1)
    ),
    phoenixTalismanDaily: (() => {
      const rawDaily = parsed.phoenixTalismanDaily;
      if (!rawDaily || typeof rawDaily !== 'object') return undefined;
      const dayKey =
        typeof rawDaily.dayKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDaily.dayKey)
          ? rawDaily.dayKey
          : '';
      if (!dayKey) return undefined;
      const rawMap =
        rawDaily.usedByGame && typeof rawDaily.usedByGame === 'object'
          ? (rawDaily.usedByGame as Record<string, unknown>)
          : {};
      const validKinds = ['match3', 'sudoku', 'caro', 'chess', 'blocks'] as const;
      const usedByGame: Partial<Record<(typeof validKinds)[number], boolean>> = {};
      for (const k of validKinds) {
        if (rawMap[k] === true) {
          usedByGame[k] = true;
        }
      }
      return { dayKey, usedByGame };
    })(),
    quizTalismanProgress: Math.round(
      clampFinite(parsed.quizTalismanProgress, 0, 7, 0)
    ),
    harvestFeast: (() => {
      const rawFeast = parsed.harvestFeast;
      if (!rawFeast || typeof rawFeast !== 'object') return createInitialHarvestFeastState();
      const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1]?.pointsRequired ?? 3400;
      const claimed = Array.isArray(rawFeast.claimedTiers)
        ? Array.from(
            new Set(
              rawFeast.claimedTiers
                .filter((t): t is number => typeof t === 'number' && Number.isFinite(t))
                .map((t) => Math.round(t))
                .filter((t) => t >= 1 && t <= HARVEST_FEAST_TIERS.length)
            )
          ).sort((a, b) => a - b)
        : [];
      return {
        seasonCycle: Math.round(clampFinite(rawFeast.seasonCycle, 1, 999, 1)),
        points: Math.round(clampFinite(rawFeast.points, 0, maxPts, 0)),
        claimedTiers: claimed,
        totalPointsAllTime: Math.round(clampFinite(rawFeast.totalPointsAllTime, 0, 99999999, 0)),
        unveilsCompleted: Math.round(clampFinite(rawFeast.unveilsCompleted, 0, 99999, 0)),
      };
    })(),
    staffHired: {
      caretaker: Math.round(clampFinite(rawStaff.caretaker, 0, MAX_STAFF_PER_ROLE, 1)),
      artificer: Math.round(clampFinite(rawStaff.artificer, 0, MAX_STAFF_PER_ROLE, 1)),
      magizoologist: Math.round(clampFinite(rawStaff.magizoologist, 0, MAX_STAFF_PER_ROLE, 0)),
      auror: Math.round(clampFinite(rawStaff.auror, 0, MAX_STAFF_PER_ROLE, 0)),
      house_elf: Math.round(clampFinite(rawStaff.house_elf, 0, MAX_STAFF_PER_ROLE, 0)),
    },
    staffPatrolZones: parsed.staffPatrolZones ?? {},
    lastProphetHeadline: safeHeadline,
    finance: {
      ...def.finance,
      ...(parsed.finance ?? {}),
    },
    stats: {
      ...def.stats,
      ...(parsed.stats ?? {}),
    },
    settings: {
      ...def.settings,
      ...(parsed.settings ?? {}),
      activeFestival: sandboxAllowedOnLoad
        ? (parsed.settings?.activeFestival ?? def.settings.activeFestival)
        : 'auto',
      showGrid: false,
      cutawayMode: false,
    },
  };

  if (!sandboxAllowedOnLoad && migratedState.minigameLeaderboard) {
    migratedState.minigameLeaderboard = {
      ...migratedState.minigameLeaderboard,
      includeSeededRivals: false,
    };
  }

  reconcileRetentionStateOnLoad(
    migratedState,
    parsed.retention,
    Boolean(
      (typeof parsed.lastSavedAt === 'number' && parsed.lastSavedAt > 0) ||
        safeLevel > 1 ||
        (parsed.stats?.minigamesWon ?? 0) > 0 ||
        (parsed.stats?.totalGalleonsHarvested ?? 0) > 0
    )
  );
  return migratedState;
}
