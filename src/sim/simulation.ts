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
} from './puzzleArcadeEngine';
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

const SAVE_KEY = 'burrow_hogsmeade_777_v3';
export const FARM_HARVEST_CHEST_XP = 200;

const PLAYFUL_BREAKDOWNS = [
  'Chổi thần lộn ngược vòng!',
  'Phanh bùa chú quá nhiệt!',
  'Bánh răng cổ ngữ kẹt kẹo dẻo!',
  'Đệm bay lơ lửng lệch pha!',
];

const FIREWORK_COLORS = ['#fbbf24', '#f472b6', '#38bdf8', '#34d399', '#c084fc', '#fb7185'];

export function getLocalDateKey(now = new Date()): string {
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

function deltaToFacing(dx: number, dy: number, fallback: IsoDirection = 'se'): IsoDirection {
  if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return fallback;
  // Screen iso: sx ~ (gx - gy), sy ~ (gx + gy)
  const isoX = dx - dy;
  const isoY = dx + dy;
  if (isoY >= 0) {
    return isoX >= 0 ? 'se' : 'sw';
  }
  return isoX >= 0 ? 'ne' : 'nw';
}

const CANON_OWL_SENDERS: Array<{
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
  const rewardGalleons = Math.round(baseValue * 1.55 + level * 6);
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
        rewardGalleons: 165,
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
        rewardGalleons: 150,
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
        rewardGalleons: 220,
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
        rewardGalleons: 260,
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

  // Clean sunlit 36×30 (1,080-tile) starter meadow: no stray pre-built trails so players design freely from scratch!

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
    levelUpTrialCompletedLevel: 0,
    puzzleLevelWinsProgress: 0,
    featuredStarClaimedLevel: 0,
    phoenixTalismans: 1,
    quizTalismanProgress: 0,
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

function sanitizePlainText(val: unknown, maxLen = 220): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>]/g, '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, maxLen);
}

function clampFinite(val: unknown, min: number, max: number, fallback: number): number {
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

function sanitizeQuestList(raw: unknown, fallback: QuestDef[]): QuestDef[] {
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

function migrateLoadedState(parsed: GameState): GameState {
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
  const rawBuildings = Array.isArray(parsed.buildings) ? parsed.buildings : def.buildings;
  const safeBuildings: PlacedBuilding[] = [];
  for (const b of rawBuildings) {
    if (!b || typeof b !== 'object' || typeof b.itemId !== 'string') continue;
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
    });
  }

  const rawSuitcase = parsed.suitcase ?? def.suitcase;
  const morphSet = new Set<string>(
    Array.isArray(rawSuitcase.discoveredMorphs)
      ? rawSuitcase.discoveredMorphs.filter((m): m is string => typeof m === 'string' && m.length < 60)
      : []
  );
  for (const b of safeBuildings) {
    if (b.creatureMorph) {
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

  return {
    ...def,
    ...parsed,
    version: 6,
    unlockedZones: Array.from(unlockedZoneSet),
    tileOverrides: safeTileOverrides,
    parkName: sanitizePlainText(parsed.parkName, 80) || def.parkName,
    level: safeLevel,
    xp: Math.round(clampFinite(parsed.xp, 0, 99999999, 0)),
    galleons: Math.round(clampFinite(parsed.galleons, 0, 999999999, 280)),
    timeSand: Math.round(clampFinite(parsed.timeSand, 0, 999999, 4)),
    parkEntryFee: 0,
    buildings: safeBuildings,
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
      };
    })(),
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
      showGrid: false,
      cutawayMode: false,
    },
  };
}

export class ParkSimulation {
  public state: GameState;
  public grid: TileCell[][] = [];
  public staff: StaffEntity[] = [];
  public villagers: ValleyVillagerEntity[] = [];
  public escapedCreatures: EscapedCreatureEntity[] = [];
  public effects: FloatingEffect[] = [];
  public fireworks: FireworkBurst[] = [];
  public audio: MagicalAudio;
  public isHeadmasterPreview = false;
  public activeVisitNeighborId: string | null = null;
  private homeStateWhileVisiting: GameState | null = null;
  private socialSimAcc = 0;
  public heatmapMode: HeatmapMode = 'none';
  private backupMainStateJson: string | null = null;

  public get isVisitingNeighbor(): boolean {
    return this.activeVisitNeighborId !== null && this.homeStateWhileVisiting !== null;
  }

  // Cached V2/V3 coaster circuits, biome evaluations, backstage, road connectivity, queues & synergies
  public coasterCircuits = new Map<string, { waypoints: TrackWaypoint[]; isClosed: boolean }>();
  public biomeCache = new Map<string, BiomeEvaluation>();
  public backstageCache = new Map<string, BackstageEvaluation>();
  public activeSynergies: ActiveSynergyResult = {
    activeIds: new Set(),
    buildingGoldMult: new Map(),
    buildingXpMult: new Map(),
    links: [],
  };
  public connectedPathTiles = new Set<string>();
  public connectedBuildingUids = new Set<string>();
  public queueTileToRideUid = new Map<string, string>();
  public rideQueueTailSpot = new Map<string, { gx: number; gy: number }>();
  public rideQueues = new Map<string, string[]>();

  private owlSeedCounter = 10;
  private wageTickAcc = 0;
  private autoSaveAcc = 0;
  private nightFireworkAcc = 0;
  public simSpeed: 1 | 2 = 1;
  public stateRevision = 1;
  public onUiChange: (() => void) | null = null;
  public onToast: ((msg: string, icon?: string) => void) | null = null;
  public onLevelUp: ((newLevel: number) => void) | null = null;
  public onRewardFly: ((kind: FlyRewardKind, amount: number, gx?: number, gy?: number) => void) | null = null;
  public onBuildingTactile: ((uid: string) => void) | null = null;
  /** Fired the moment a construction site turns into a finished building.
   *  Not fired during offline catch-up (silent ticks) so a long absence
   *  doesn't trigger dozens of celebration pops at once. */
  public onBuildingCompleted: ((uid: string) => void) | null = null;
  public onRibbonUnveiled: ((info: RibbonUnveilCelebration) => void) | null = null;
  public onTutorialStepChanged: ((stepId: TutorialStepId) => void) | null = null;
  private villagerGreetCooldown = new Map<ValleyVillagerId, number>();

  constructor(audio: MagicalAudio) {
    this.audio = audio;
    const loaded = this.loadFromStorage();
    this.state = loaded ?? createInitialGameState();
    this.audio.enabled = this.state.settings.soundEnabled;
    this.audio.bgmEnabled = this.state.settings.bgmEnabled;
    this.rebuildGrid();
    this.syncStaffEntities();
    this.syncValleyVillagers();
  }

  public loadFromStorage(): GameState | null {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as GameState;
      if (!parsed || typeof parsed.level !== 'number' || !Array.isArray(parsed.buildings)) {
        return null;
      }
      return migrateLoadedState(parsed);
    } catch {
      return null;
    }
  }

  private syncPlayerPrimitivesToHomeState(): void {
    if (!this.homeStateWhileVisiting) return;
    const h = this.homeStateWhileVisiting;
    h.level = this.state.level;
    h.xp = this.state.xp;
    h.galleons = this.state.galleons;
    h.timeSand = this.state.timeSand;
    h.phoenixTalismans = this.state.phoenixTalismans;
    h.quizTalismanProgress = this.state.quizTalismanProgress;
    h.levelUpTrialCompletedLevel = this.state.levelUpTrialCompletedLevel;
    h.puzzleLevelWinsProgress = this.state.puzzleLevelWinsProgress;
    h.featuredStarClaimedLevel = this.state.featuredStarClaimedLevel;
    h.houseCupMilestoneTier = this.state.houseCupMilestoneTier;
    h.lastDailyResetKey = this.state.lastDailyResetKey;
    h.storyQuestIndex = this.state.storyQuestIndex;
    h.storyClaimedIds = this.state.storyClaimedIds;
    h.storyQuestProgress = this.state.storyQuestProgress;
    h.owlQuests = this.state.owlQuests;
    h.dailyQuests = this.state.dailyQuests;
    h.farmBarn = this.state.farmBarn;
    h.languageQuiz = this.state.languageQuiz;
    h.tutorial = this.state.tutorial;
    h.harvestFeast = this.state.harvestFeast;
    h.neighborSocial = this.state.neighborSocial;
    h.match3 = this.state.match3;
    h.puzzleArcade = this.state.puzzleArcade;
    h.supply = this.state.supply;
    h.suitcase = this.state.suitcase;
    h.finance = this.state.finance;
    h.stats = this.state.stats;
    h.settings = this.state.settings;
    h.lastSavedAt = this.state.lastSavedAt;
  }

  public saveToStorage(): void {
    if (this.isHeadmasterPreview) return;
    try {
      const now = Date.now();
      this.state.lastSavedAt = now;
      this.syncPlayerPrimitivesToHomeState();
      const baseState = this.homeStateWhileVisiting ?? this.state;
      const persistedState: GameState = {
        ...baseState,
        lastSavedAt: now,
        settings: {
          ...baseState.settings,
          showGrid: false,
          cutawayMode: false,
        },
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(persistedState));
    } catch {
      // Ignore quota errors
    }
  }

  public exportSaveJson(): string {
    this.state.lastSavedAt = Date.now();
    this.syncPlayerPrimitivesToHomeState();
    const baseState = this.homeStateWhileVisiting ?? this.state;
    return JSON.stringify(baseState, null, 2);
  }

  public importSaveJson(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr) as GameState;
      if (!parsed || typeof parsed.level !== 'number' || !Array.isArray(parsed.buildings)) {
        return false;
      }
      this.isHeadmasterPreview = false;
      this.activeVisitNeighborId = null;
      this.homeStateWhileVisiting = null;
      this.backupMainStateJson = null;
      this.state = migrateLoadedState(parsed);
      this.audio.enabled = this.state.settings.soundEnabled;
      this.audio.bgmEnabled = this.state.settings.bgmEnabled;
      this.rebuildGrid();
      this.syncStaffEntities();
      this.syncValleyVillagers();
      this.escapedCreatures = [];
      this.rideQueues.clear();
      this.saveToStorage();
      this.onUiChange?.();
      return true;
    } catch {
      return false;
    }
  }

  public resetNewGame(): void {
    this.isHeadmasterPreview = false;
    this.activeVisitNeighborId = null;
    this.homeStateWhileVisiting = null;
    this.backupMainStateJson = null;
    this.state = createInitialGameState();
    this.rebuildGrid();
    this.escapedCreatures = [];
    this.rideQueues.clear();
    this.syncStaffEntities();
    this.syncValleyVillagers();
    this.saveToStorage();
    this.onUiChange?.();
  }

  public toggleHeadmasterPreview(targetLevel = 100): void {
    if (this.isVisitingNeighbor) {
      this.exitNeighborVisit(true);
    }
    if (!this.isHeadmasterPreview) {
      const prevSettings = { ...this.state.settings };
      this.backupMainStateJson = JSON.stringify(this.state);
      this.state = createInitialGameState();
      this.state.settings = prevSettings;
      this.isHeadmasterPreview = true;
      this.state.level = targetLevel;
      this.state.galleons = 999999;
      this.state.timeSand = 99;
      this.state.sandboxMode = true;
      this.state.unlockedZones = ZONES.filter((z) => z.unlockLevel <= targetLevel).map((z) => z.id);
      this.state.collectedCards = {};
      this.state.housePoints = {
        Gryffindor: 840,
        Ravenclaw: 815,
        Hufflepuff: 790,
        Slytherin: 805,
      };
      this.state.finance = {
        harvestRevenue: 48200,
        ticketRevenue: 19450,
        shopRevenue: 14680,
        gateRevenue: 5120,
        constructionSpent: 31500,
        staffWagesPaid: 2480,
      };
      this.state.storyClaimedIds = STORY_QUESTS.map((q) => q.id);
      this.state.storyQuestIndex = STORY_QUESTS.length;
      this.state.owlQuests = [
        createOwlOrderQuest(targetLevel, 0),
        createOwlOrderQuest(targetLevel, 2),
        createOwlOrderQuest(targetLevel, 4),
      ];
      this.state.dailyQuests = createDailyQuests(targetLevel, this.state.lastDailyResetKey);
      this.state.levelUpTrialCompletedLevel = targetLevel;
      this.state.puzzleLevelWinsProgress = 0;
      this.state.featuredStarClaimedLevel = targetLevel;
      this.state.phoenixTalismans = MAX_PHOENIX_TALISMANS;
      this.state.quizTalismanProgress = 0;
      this.state.puzzleArcade = {
        activeMode: 'chess',
        sudokuStage: MAX_MINIGAME_STAGE,
        caroStage: MAX_MINIGAME_STAGE,
        chessStage: MAX_MINIGAME_STAGE,
        jigsawStage: 9,
        blockStage: MAX_MINIGAME_STAGE,
        tileStage: 10,
        sudokuCleared: MAX_MINIGAME_STAGE,
        caroCleared: MAX_MINIGAME_STAGE,
        chessCleared: MAX_MINIGAME_STAGE,
        blockCleared: MAX_MINIGAME_STAGE,
        featuredWinsCount: MAX_MINIGAME_STAGE,
        restoredPaintings: JIGSAW_PAINTINGS.map((p) => p.id),
        totalPuzzlesSolved: TOTAL_MINIGAME_STAGES,
      };
      this.state.buildings = [];
      this.rideQueues.clear();
      this.rebuildGrid();

      const showcaseList: Array<{
        id: string;
        gx: number;
        gy: number;
        stars: number;
        gold: number;
        crop?: FarmCropId;
        animal?: PastureAnimalId;
      }> = [
        { id: 'burrow_house_canon', gx: 10, gy: 26, stars: 5, gold: 320 },
        { id: 'burrow_self_knitting_loom', gx: 14, gy: 26, stars: 5, gold: 180 },
        { id: 'arthur_ford_shed', gx: 9, gy: 20, stars: 5, gold: 240 },
        { id: 'burrow_cider_apiary', gx: 10, gy: 15, stars: 5, gold: 260 },
        { id: 'burrow_apple_orchard', gx: 14, gy: 15, stars: 5, gold: 150 },
        { id: 'molly_apple_bakery', gx: 15, gy: 20, stars: 5, gold: 220 },
        // Đồng Cỏ Chăn Thả 4×4 ghép liền rào (Bò Sữa, Cừu Lông Xù, Đàn Gà, Puffskein)
        { id: 'burrow_animal_pasture', gx: 19, gy: 20, stars: 5, gold: 46, animal: 'daisy_cow' },
        { id: 'burrow_animal_pasture', gx: 21, gy: 20, stars: 5, gold: 34, animal: 'ottery_sheep' },
        { id: 'burrow_animal_pasture', gx: 19, gy: 22, stars: 5, gold: 26, animal: 'burrow_hen' },
        { id: 'burrow_animal_pasture', gx: 21, gy: 22, stars: 5, gold: 62, animal: 'golden_puffskein' },
        // Ô Vườn Hoa Cảnh Hang Sóc 4×2 & Vườn Bí Ngô 4×2 ghép liền rào
        { id: 'burrow_flower_garden', gx: 25, gy: 20, stars: 5, gold: 52 },
        { id: 'burrow_flower_garden', gx: 27, gy: 20, stars: 5, gold: 0 },
        { id: 'burrow_pumpkin_gnomes', gx: 25, gy: 22, stars: 5, gold: 160 },
        { id: 'burrow_pumpkin_gnomes', gx: 27, gy: 22, stars: 5, gold: 0 },
        { id: 'burrow_owl_post', gx: 20, gy: 14, stars: 5, gold: 210 },
        { id: 'hogsmeade_stone_bridge', gx: 26, gy: 13, stars: 5, gold: 180 },
        { id: 'burrow_honeydukes_canon', gx: 29, gy: 7, stars: 5, gold: 0 },
        { id: 'burrow_broomsticks_canon', gx: 35, gy: 7, stars: 5, gold: 340 },
        { id: 'hogsmeade_harvest_fountain', gx: 41, gy: 7, stars: 5, gold: 860 },
        { id: 'burrow_greenhouse_canon', gx: 38, gy: 16, stars: 5, gold: 420 },
        { id: 'burrow_reed_pond_mill', gx: 31, gy: 26, stars: 5, gold: 210 },
        { id: 'burrow_puffskein_pasture', gx: 35, gy: 26, stars: 5, gold: 280 },
        { id: 'burrow_windmill_canon', gx: 7, gy: 14, stars: 5, gold: 480 },
        { id: 'burrow_feast_marquee', gx: 15, gy: 8, stars: 5, gold: 620 },
        // Cánh đồng Thửa Đất Canh Tác ghép rào liền mạch (Hoa Cảnh + Nông Sản)
        { id: 'farmland_plot', gx: 16, gy: 32, stars: 5, gold: 48, crop: 'english_rose' },
        { id: 'farmland_plot', gx: 18, gy: 32, stars: 5, gold: 52, crop: 'rainbow_tulip' },
        { id: 'farmland_plot', gx: 20, gy: 32, stars: 5, gold: 54, crop: 'meadow_daisy' },
        { id: 'farmland_plot', gx: 22, gy: 32, stars: 5, gold: 56, crop: 'blush_peony' },
        { id: 'farmland_plot', gx: 24, gy: 32, stars: 5, gold: 56, crop: 'forest_bluebell' },
        { id: 'farmland_plot', gx: 16, gy: 34, stars: 5, gold: 62, crop: 'moonlight_flower' },
        { id: 'farmland_plot', gx: 18, gy: 34, stars: 5, gold: 68, crop: 'phoenix_fireflower' },
        { id: 'farmland_plot', gx: 20, gy: 34, stars: 5, gold: 74, crop: 'hedge_sunflower' },
        { id: 'farmland_plot', gx: 22, gy: 34, stars: 5, gold: 82, crop: 'garden_pumpkin' },
        { id: 'farmland_plot', gx: 24, gy: 34, stars: 5, gold: 56, crop: 'ruby_strawberry' },
        { id: 'hagrid_pumpkin_hut', gx: 44, gy: 16, stars: 5, gold: 780 },
        { id: 'hippogriff_glade', gx: 42, gy: 26, stars: 5, gold: 1120 },
        { id: 'unicorn_glade', gx: 42, gy: 32, stars: 5, gold: 1960 },
        { id: 'black_lake_boats', gx: 58, gy: 47, stars: 5, gold: 1450 },
      ];

      this.state.farmBarn = {
        ...createInitialFarmBarnState(),
        capacity: 240,
        ordersDelivered: 42,
        crops: Object.fromEntries(
          (Object.keys(FARM_CROPS) as FarmCropId[]).map((cid) => [cid, 8])
        ) as Record<FarmCropId, number>,
      };

      this.state.supply = {
        ...createInitialSupplyState(targetLevel),
        ingredients: {
          mandrake_leaf: 18,
          sweet_pumpkin: 16,
          starlight_dust: 14,
          magic_cacao: 15,
        },
        goods: {
          aged_butterbeer: 4,
          felix_potion: 3,
          golden_choc_box: 3,
          dragon_firework: 5,
        },
      };

      const showcasePetMeta: Record<string, { name: string; morph: CreatureMorphVariant; bond: number }> = {
        niffler_den: { name: 'Bụng Bự Vàng', morph: 'radiant', bond: 9 },
        hippogriff_glade: { name: 'Buckbeak Kiêu Hãnh', morph: 'mystic', bond: 8 },
        thestral_grove: { name: 'Bóng Đêm Tinh Tú', morph: 'mystic', bond: 7 },
        unicorn_glade: { name: 'Ánh Trăng Bạc', morph: 'radiant', bond: 10 },
        dragon_lair: { name: 'Norbert Lửa Thiêng', morph: 'radiant', bond: 9 },
        phoenix_perch: { name: 'Fawkes Tái Sinh', morph: 'radiant', bond: 10 },
        hagrid_bowtruckle: { name: 'Pickett Nhỏ Xíu', morph: 'normal', bond: 6 },
      };

      const now = Date.now();
      for (const s of showcaseList) {
        const it = getCatalogItem(s.id);
        if (!it) continue;
        if (this.canPlaceItem(it, s.gx, s.gy, 0).ok) {
          const petMeta = showcasePetMeta[s.id];
          const plotCrop = it.isFarmlandPlot ? (s.crop ?? 'ottery_wheat') : undefined;
          const pastureAnimal = it.isAnimalPasturePlot ? (s.animal ?? 'daisy_cow') : undefined;
          this.state.buildings.push({
            uid: `preview_${s.id}_${s.gx}_${s.gy}`,
            itemId: s.id,
            gx: s.gx,
            gy: s.gy,
            rotation: 0,
            stars: s.stars,
            placedAt: now,
            constructEndsAt: now,
            lastTickAt: now,
            storedGalleons: s.gold,
            storedXp: Math.round(s.gold * 0.35),
            readyBubbles: s.gold > 0 ? 1 : 0,
            durability: 100,
            visitorsServed: 45,
            cropId: plotCrop,
            cropPlantedAt: plotCrop ? now - 180_000 : undefined,
            cropReadyAt: plotCrop ? now - 5_000 : undefined,
            pastureAnimalId: pastureAnimal,
            pastureStockedAt: pastureAnimal ? now - 120_000 : undefined,
            pastureReadyAt: pastureAnimal ? now - 5_000 : undefined,
            creatureStage: it.isCreatureHabitat ? 'legendary' : undefined,
            creatureHunger: it.isCreatureHabitat ? 96 : undefined,
            creatureHappiness: it.isCreatureHabitat ? 98 : undefined,
            hasBabyOffspring: it.isCreatureHabitat ? true : undefined,
            creatureNickname: it.isCreatureHabitat ? petMeta?.name : undefined,
            creatureMorph: it.isCreatureHabitat ? (petMeta?.morph ?? 'normal') : undefined,
            creatureBondLevel: it.isCreatureHabitat ? (petMeta?.bond ?? 5) : undefined,
            creatureBondXp: it.isCreatureHabitat ? 25 : undefined,
          });
          this.rebuildGrid();
        }
      }

      this.state.suitcase = {
        discoveredMorphs: CREATURE_SPECIES_PROFILES.flatMap((sp) => [
          `${sp.habitatItemId}:normal`,
          `${sp.habitatItemId}:mystic`,
        ]),
        activeIncubation: null,
        activeExpedition: null,
        totalGrooms: 28,
        totalExpeditions: 14,
        totalMorphsHatched: 9,
      };

      this.state.match3 = {
        stars: 999,
        totalStarsEarned: 8154,
        currentLevel: MAX_MINIGAME_STAGE,
        maxClearedLevel: MAX_MINIGAME_STAGE,
        winStreak: 5,
        hearts: MAX_MATCH3_HEARTS,
        nextHeartAt: 0,
        boosters: {
          reparo_hammer: 9,
          row_col_cannon: 9,
          alohomora_shuffle: 9,
        },
        levelsWon: MAX_MINIGAME_STAGE,
      };

      this.rebuildGrid();
      this.syncStaffEntities();
      this.syncValleyVillagers();

      this.onToast?.(
        `🌾 Đã bật Chế độ Xem Thử Đại Điền Trang Hang Sóc & Thung Lũng Hogsmeade (Cấp ${targetLevel})!`,
        '🌻'
      );
    } else if (this.backupMainStateJson) {
      this.state = migrateLoadedState(JSON.parse(this.backupMainStateJson) as GameState);
      this.isHeadmasterPreview = false;
      this.backupMainStateJson = null;
      this.escapedCreatures = [];
      this.fireworks = [];
      this.rideQueues.clear();
      this.rebuildGrid();
      this.syncStaffEntities();
      this.syncValleyVillagers();
      this.onToast?.('Đã quay về Trang Trại Hang Sóc của bạn!', '🦉');
    }
    this.onUiChange?.();
  }

  public rebuildGrid(): void {
    this.grid = Array.from({ length: GRID_SIZE }, (_, gy) =>
      Array.from({ length: GRID_SIZE }, (__, gx) => {
        const zone = getZoneAt(gx, gy);
        const ov = this.state.tileOverrides[`${gx},${gy}`];
        return {
          gx,
          gy,
          zoneId: zone.id,
          terrain: ov?.terrain ?? zone.defaultTerrain,
          path: ov?.path ?? 'none',
          elevation: ov?.elevation ?? 0,
          coasterTrack: Boolean(ov?.coasterTrack),
          zooFence: Boolean(ov?.zooFence),
          buildingUid: null,
          hasLitter: Boolean(ov?.hasLitter),
        };
      })
    );

    for (const b of this.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const bw = b.rotation % 2 === 1 ? item.height : item.width;
      const bh = b.rotation % 2 === 1 ? item.width : item.height;
      for (let dy = 0; dy < bh; dy++) {
        for (let dx = 0; dx < bw; dx++) {
          const tx = b.gx + dx;
          const ty = b.gy + dy;
          if (tx >= 0 && ty >= 0 && tx < GRID_SIZE && ty < GRID_SIZE) {
            this.grid[ty][tx].buildingUid = b.uid;
          }
        }
      }
    }

    this.recomputeAllCoastersAndBiomes();
  }

  public isBuildingConnected(uid: string): boolean {
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (b && getCatalogItem(b.itemId)?.isRuralFarmstead) return true;
    if (this.connectedBuildingUids.size === 0) return true;
    return this.connectedBuildingUids.has(uid);
  }

  public recomputeAllCoastersAndBiomes(): void {
    this.stateRevision++;
    this.coasterCircuits.clear();
    this.biomeCache.clear();
    this.backstageCache.clear();
    this.connectedPathTiles.clear();
    this.connectedBuildingUids.clear();
    this.queueTileToRideUid.clear();
    this.rideQueueTailSpot.clear();

    const now = Date.now();
    // 1. BFS Road Network Connectivity from Burrow Homestead & Floo Network Portals!
    const bfsQ: Array<[number, number]> = [];
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it) continue;
      if (it.id === 'burrow_house_canon' || (it.isFlooPortal && now >= b.constructEndsAt)) {
        this.connectedBuildingUids.add(b.uid);
        const { bw, bh } = this.getBuildingFootprint(it, b.rotation);
        for (let dy = -1; dy <= bh; dy++) {
          for (let dx = -1; dx <= bw; dx++) {
            const tx = b.gx + dx;
            const ty = b.gy + dy;
            const c = this.grid[ty]?.[tx];
            if (c && c.path !== 'none') {
              const k = `${tx},${ty}`;
              if (!this.connectedPathTiles.has(k)) {
                this.connectedPathTiles.add(k);
                bfsQ.push([tx, ty]);
              }
            }
          }
        }
      }
    }
    let head = 0;
    while (head < bfsQ.length) {
      const [cx, cy] = bfsQ[head++];
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx;
        const ny = cy + dy;
        const c = this.grid[ny]?.[nx];
        if (c && c.path !== 'none') {
          const k = `${nx},${ny}`;
          if (!this.connectedPathTiles.has(k)) {
            this.connectedPathTiles.add(k);
            bfsQ.push([nx, ny]);
          }
        }
      }
    }

    for (const b of this.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;
      const { bw, bh } = this.getBuildingFootprint(item, b.rotation);

      // Exempt decor, habitats in nature reserves, coaster track segments, and hidden backstage huts from road warning
      if (
        item.category === 'decor' ||
        item.category === 'creature' ||
        item.isBackstage ||
        item.id === 'burrow_house_canon' ||
        item.isFlooPortal ||
        item.isCoasterTrackPiece ||
        item.id === 'black_lake_boats'
      ) {
        this.connectedBuildingUids.add(b.uid);
      } else {
        let linked = false;
        for (let dy = -1; dy <= bh && !linked; dy++) {
          for (let dx = -1; dx <= bw && !linked; dx++) {
            if (dx >= 0 && dx < bw && dy >= 0 && dy < bh) continue;
            // Orthogonal adjacency to footprint
            if ((dx === -1 || dx === bw) && (dy === -1 || dy === bh)) continue;
            if (this.connectedPathTiles.has(`${b.gx + dx},${b.gy + dy}`)) {
              linked = true;
            }
          }
        }
        if (linked) {
          this.connectedBuildingUids.add(b.uid);
        }
      }

      // 2. Map every Queue Slot tile to any Ride!
      if (
        item.category === 'ride' &&
        !item.isCoasterTrackPiece &&
        !item.isFlooPortal
      ) {
        const gates = getBuildingGates(b, bw, bh);
        const slots = traceQueueSlots(this.grid, gates.entranceGx, gates.entranceGy, 12);
        for (const sl of slots) {
          this.queueTileToRideUid.set(`${sl.gx},${sl.gy}`, b.uid);
        }
        const tail = slots[slots.length - 1] ?? { gx: gates.entranceGx, gy: gates.entranceGy };
        this.rideQueueTailSpot.set(b.uid, tail);
      }

      if (item.isCustomCoasterStation) {
        const res = traceCoasterCircuit(this.grid, this.state.buildings, b, bw, bh);
        b.coasterStats = res.stats;
        if (res.waypoints.length >= 3) {
          this.coasterCircuits.set(b.uid, {
            waypoints: res.waypoints,
            isClosed: res.stats.isClosedCircuit,
          });
        }
      }

      if (item.isCreatureHabitat) {
        const bio = evaluateHabitatBiome(this.grid, this.state.buildings, b, item);
        b.biomeScore = bio.score;
        this.biomeCache.set(b.uid, bio);
        if (bio.score >= 80 && !b.hasBabyOffspring && now >= b.constructEndsAt) {
          b.hasBabyOffspring = true;
          if (!this.isHeadmasterPreview) {
            this.onToast?.(
              `🐣 Chuồng ${item.creatureName} đạt ${bio.score}% Sinh Thái Lý Tưởng và vừa sinh thêm Thú Non!`,
              '🎉'
            );
          }
        }
      }

      if (item.isBackstage) {
        this.backstageCache.set(
          b.uid,
          evaluateBackstageShielding(this.grid, this.state.buildings, b, bw, bh)
        );
      }
    }

    // 3. Evaluate 12 District Synergy Combos!
    const prevIds = this.activeSynergies.activeIds;
    this.activeSynergies = evaluateDistrictSynergies(this.state.buildings, now);
    if (!this.isHeadmasterPreview && prevIds.size > 0) {
      for (const id of this.activeSynergies.activeIds) {
        if (!prevIds.has(id)) {
          const link = this.activeSynergies.links.find((l) => l.name.length > 0);
          if (link) {
            this.onToast?.(`✨ Kích hoạt Combo Khu Phố mới: ${link.emoji} ${link.name}!`, '🌟');
          }
          break;
        }
      }
    }
  }

  public autoBuildCoasterForStation(uid: string): boolean {
    const st = this.state.buildings.find((b) => b.uid === uid);
    if (!st) return false;
    const item = getCatalogItem(st.itemId);
    if (!item?.isCustomCoasterStation) return false;
    const { bw, bh } = this.getBuildingFootprint(item, st.rotation);
    const res = buildSampleCoasterLoop(
      this.grid,
      this.state.tileOverrides,
      new Set(this.state.unlockedZones),
      this.state.sandboxMode,
      st,
      bw,
      bh
    );

    if (res.placedCount === 0) {
      this.onToast?.(
        'Không đủ ô đất trống quanh Trạm để lắp tự động — bạn có thể tự vẽ Đốt Đường Ray vào ô trống bất kỳ nhé!',
        '🛤️'
      );
      return false;
    }

    if (!this.state.sandboxMode) {
      const charge = Math.min(this.state.galleons, res.cost);
      this.state.galleons -= charge;
      this.state.finance.constructionSpent += charge;
    }
    this.rebuildGrid();
    this.audio.playLevelUp();
    this.spawnFloatingText(st.gx + 1, st.gy, '🎢 Đã lắp vòng Tàu Lượn Đồi Đá!', '#fde047');
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public setBuildingCustomPrice(uid: string, price: number): void {
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return;
    const item = getCatalogItem(b.itemId);
    if (!item) return;
    const bounds = getItemPriceBounds(item);
    b.customPrice = Math.max(bounds.min, Math.min(bounds.max, Math.round(price)));
    this.saveToStorage();
    this.onUiChange?.();
  }

  public setParkEntryFee(fee: number): void {
    this.state.parkEntryFee = Math.max(0, Math.min(50, Math.round(fee)));
    this.saveToStorage();
    this.onUiChange?.();
  }

  public getEffectivePrice(b: PlacedBuilding, item: CatalogItem): number {
    const bounds = getItemPriceBounds(item);
    if (typeof b.customPrice === 'number' && Number.isFinite(b.customPrice)) {
      return Math.max(bounds.min, Math.min(bounds.max, b.customPrice));
    }
    return item.ticketPrice ?? 12;
  }

  public getPriceValueVerdict(b: PlacedBuilding, item: CatalogItem): {
    label: string;
    color: string;
    demandMult: number;
  } {
    const fairPrice = (item.ticketPrice ?? 12) * (1 + (b.stars - 1) * 0.14);
    const cur = this.getEffectivePrice(b, item);
    const ratio = cur / Math.max(1, fairPrice);
    if (ratio <= 0.85) {
      return { label: '💚 Giá Hời Hút Khách (+Đông)', color: '#15803d', demandMult: 1.24 };
    }
    if (ratio <= 1.18) {
      return { label: '✨ Giá Hợp Lý Chuẩn Mực', color: '#b45309', demandMult: 1.02 };
    }
    if (ratio <= 1.38) {
      return { label: '⚖️ Hơi Cao (Chỉ khách rủng rỉnh mua)', color: '#d97706', demandMult: 0.86 };
    }
    // Steep realistic price elasticity above 1.38x so overpricing reduces total revenue instead of exploiting!
    const elasticDemand = Math.max(0.18, 0.86 * Math.pow(1.38 / ratio, 2.25));
    return { label: '⚠️ Quá Đắt! (Khách lắc đầu bỏ đi)', color: '#dc2626', demandMult: elasticDemand };
  }

  public moveBuilding(
    uid: string,
    newGx: number,
    newGy: number,
    newRot: 0 | 1 | 2 | 3
  ): { ok: boolean; reason?: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, reason: 'Chế độ Khách Tham Quan — không thể xê dịch công trình vườn bạn!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, reason: 'Không tìm thấy công trình' };
    const item = getCatalogItem(b.itemId);
    if (!item) return { ok: false, reason: 'Dữ liệu không hợp lệ' };

    const check = this.canPlaceItem(item, newGx, newGy, newRot, uid);
    if (!check.ok) return check;

    b.gx = newGx;
    b.gy = newGy;
    b.rotation = newRot;
    this.rideQueues.delete(uid);
    this.rebuildGrid();
    this.audio.playPlace();
    this.spawnFloatingText(newGx + 0.5, newGy + 0.5, '✋ Đã di dời!', '#93c5fd');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true };
  }

  public getRealTimePeriod(now = new Date()): 'dawn' | 'day' | 'dusk' | 'night' {
    if (this.state.settings.timeOverride !== 'realtime') {
      return this.state.settings.timeOverride;
    }
    const h = now.getHours();
    if (h >= 5 && h < 8) return 'dawn';
    if (h >= 8 && h < 17) return 'day';
    if (h >= 17 && h < 19) return 'dusk';
    return 'night';
  }

  public getActiveFestival(now = new Date()): FestivalType {
    if (this.state.settings.activeFestival !== 'auto') {
      return this.state.settings.activeFestival;
    }
    const m = now.getMonth();
    const d = now.getDate();
    if (m === 9 || (m === 10 && d <= 5)) return 'halloween';
    if (m === 11) return 'christmas';
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return 'quidditch_cup';
    return 'none';
  }

  private resolveWeatherSlotKind(slotIdx: number, dateAtSlot: Date): WeatherKind {
    // MurmurHash3 32-bit finalizer for deterministic cozy weather forecast
    let h = Math.imul(slotIdx ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35) >>> 0;
    h ^= h >>> 16;
    const roll = (h >>> 0) % 100;

    const period = this.getRealTimePeriod(dateAtSlot);
    const fest = this.getActiveFestival(dateAtSlot);
    if (fest === 'christmas') {
      if (roll < 52) return 'snow';
      if (roll < 76) return 'sunny';
      return 'cloudy';
    }
    if (period === 'dawn' && roll < 32) {
      return 'fog';
    }
    if (roll < 38) return 'sunny';
    if (roll < 60) return 'cloudy';
    if (roll < 77) return 'rain';
    if (roll < 88) return 'snow';
    if (roll < 95) return 'fog';
    return 'storm';
  }

  private describeWeatherSlot(
    kind: WeatherKind,
    startsInSec: number,
    isRainbow = false
  ): WeatherForecastSlot {
    if (isRainbow && (kind === 'sunny' || kind === 'cloudy')) {
      return {
        kind,
        icon: '🌈',
        labelVi: 'Cầu Vồng Sau Mưa',
        buffVi: 'Kỳ Diệu +20% • Toàn công viên +15% Vàng thu hoạch!',
        startsInSec,
        isRainbow: true,
      };
    }
    switch (kind) {
      case 'rain':
        return {
          kind,
          icon: '🌧️',
          labelVi: 'Mưa Phép Thuật',
          buffVi: 'Vườn Thảo Dược & Chuồng Thú +20% sản lượng',
          startsInSec,
        };
      case 'storm':
        return {
          kind,
          icon: '⛈️',
          labelVi: 'Giông Sấm Kỳ Bí',
          buffVi: 'Tiệm Đũa & Xưởng Độc Dược +25% doanh thu',
          startsInSec,
        };
      case 'snow':
        return {
          kind,
          icon: '❄️',
          labelVi: 'Tuyết Rơi Hogsmeade',
          buffVi: 'Tiệm Kẹo & Quán Ba Cây Chổi +20% vàng',
          startsInSec,
        };
      case 'fog':
        return {
          kind,
          icon: '🌫️',
          labelVi: 'Sương Sớm Hồ Đen',
          buffVi: 'Hồ Đen huyền ảo • Sinh vật huyền bí vui vẻ hơn',
          startsInSec,
        };
      case 'cloudy':
        return {
          kind,
          icon: '⛅',
          labelVi: 'Mây Bồng Bềnh',
          buffVi: 'Tiết trời dịu mát • Khách dạo chơi thư thả',
          startsInSec,
        };
      default:
        return {
          kind: 'sunny',
          icon: '☀️',
          labelVi: 'Nắng Ấm Đẹp Trời',
          buffVi: 'Khách ghé thăm đông hơn • Quầy Bia Bơ đắt khách',
          startsInSec,
        };
    }
  }

  public getCurrentWeather(nowMs = Date.now()): WeatherForecastSlot {
    const ov = this.state.settings.weatherOverride;
    if (ov && ov !== 'auto') {
      const mapped: WeatherKind =
        ov === 'clear' || ov === 'fireflies'
          ? 'sunny'
          : ov === 'cloudy' || ov === 'rain' || ov === 'storm' || ov === 'snow' || ov === 'fog'
            ? ov
            : 'sunny';
      return this.describeWeatherSlot(mapped, 0, false);
    }
    if (this.state.level <= 2 && this.state.buildings.length <= 2) {
      return this.describeWeatherSlot('sunny', 0, false);
    }
    const slotLenMs = 120_000;
    const slotIdx = Math.floor(nowMs / slotLenMs);
    const curKind = this.resolveWeatherSlotKind(slotIdx, new Date(nowMs));
    const prevKind = this.resolveWeatherSlotKind(slotIdx - 1, new Date(nowMs - slotLenMs));
    const isRainbow =
      (curKind === 'sunny' || curKind === 'cloudy') && (prevKind === 'rain' || prevKind === 'storm');
    return this.describeWeatherSlot(curKind, 0, isRainbow);
  }

  public getWeatherForecast(count = 4, nowMs = Date.now()): WeatherForecastSlot[] {
    const slotLenMs = 120_000;
    const baseSlot = Math.floor(nowMs / slotLenMs);
    const list: WeatherForecastSlot[] = [this.getCurrentWeather(nowMs)];
    if (this.state.settings.weatherOverride !== 'auto') {
      return list;
    }
    let prevKind = list[0].kind;
    for (let i = 1; i < count; i++) {
      const startMs = (baseSlot + i) * slotLenMs;
      const startsInSec = Math.max(1, Math.ceil((startMs - nowMs) / 1000));
      const kind = this.resolveWeatherSlotKind(baseSlot + i, new Date(startMs));
      const isRainbow =
        (kind === 'sunny' || kind === 'cloudy') && (prevKind === 'rain' || prevKind === 'storm');
      list.push(this.describeWeatherSlot(kind, startsInSec, isRainbow));
      prevKind = kind;
    }
    return list;
  }

  public checkDailyReset(now = new Date()): void {
    const key = getLocalDateKey(now);
    let changed = false;
    if (this.state.lastDailyResetKey !== key) {
      this.state.lastDailyResetKey = key;
      this.state.dailyQuests = createDailyQuests(this.state.level, key);
      this.onToast?.('Nhật Báo Tiên Tri vừa giao Nhiệm Vụ Hàng Ngày mới!', '📰');
      changed = true;
    }
    const social = this.ensureNeighborSocial();
    if (syncNeighborSocialDailyReset(social, now.getTime())) {
      this.onToast?.('🦉 Qua 00:00 ngày mới — lượt Giải Cứu Màn Khó & Quà Thăm Vườn đã làm mới!', '🍀');
      changed = true;
    }
    if (changed) {
      this.onUiChange?.();
    }
  }

  public processOfflineProgress(): OfflineReport | null {
    const now = Date.now();
    this.checkDailyReset(new Date(now));
    const awayMs = now - (this.state.lastSavedAt || now);
    const awaySec = Math.floor(awayMs / 1000);
    if (awaySec < 45) {
      this.tickProductionToTimestamp(now, false);
      return null;
    }

    let buildingsFinished = 0;
    for (const b of this.state.buildings) {
      if (b.constructEndsAt > this.state.lastSavedAt && b.constructEndsAt <= now) {
        buildingsFinished++;
      }
    }

    this.tickProductionToTimestamp(now, true);

    const elfCount =
      this.state.staffHired.house_elf +
      this.state.buildings.filter((b) => b.itemId === 'owlery_elf_hut' && b.constructEndsAt <= now).length;

    let autoGalleons = 0;
    let autoXp = 0;
    let collectedCount = 0;

    if (elfCount > 0 || awaySec >= 180) {
      const ratio = elfCount > 0 ? Math.min(1, 0.55 + elfCount * 0.2) : 0.35;
      for (const b of this.state.buildings) {
        if (b.storedGalleons > 0) {
          const takeG = Math.floor(b.storedGalleons * ratio);
          const takeX = Math.floor(b.storedXp * ratio);
          if (takeG > 0) {
            b.storedGalleons -= takeG;
            b.storedXp -= takeX;
            b.readyBubbles = Math.max(b.storedGalleons > 0 ? 1 : 0, Math.floor(b.readyBubbles * (1 - ratio)));
            autoGalleons += takeG;
            autoXp += takeX;
            collectedCount++;
          }
        }
      }
      if (autoGalleons > 0 || autoXp > 0) {
        this.state.galleons += autoGalleons;
        this.state.finance.harvestRevenue += autoGalleons;
        this.addXp(autoXp);
        this.recordQuestProgress('harvest_galleons', undefined, autoGalleons);
      }
    }

    this.saveToStorage();
    if (autoGalleons === 0 && buildingsFinished === 0 && awaySec < 120) {
      return null;
    }

    return {
      awaySeconds: awaySec,
      galleonsEarned: autoGalleons,
      xpEarned: autoXp,
      buildingsFinished,
      houseElfAutoCollected: collectedCount,
    };
  }

  public getBuildingFootprint(item: CatalogItem, rotation: 0 | 1 | 2 | 3): { bw: number; bh: number } {
    return {
      bw: rotation % 2 === 1 ? item.height : item.width,
      bh: rotation % 2 === 1 ? item.width : item.height,
    };
  }

  public getBuildingProductionPerCycle(b: PlacedBuilding, item: CatalogItem): { galleons: number; xp: number } {
    if (item.baseIncome <= 0 || item.cycleSec <= 0) return { galleons: 0, xp: 0 };
    let mult = starIncomeMultiplier(b.stars);

    if (item.isCreatureHabitat) {
      if (b.creatureStage === 'baby') mult *= 1.0;
      else if (b.creatureStage === 'adult') mult *= 1.35;
      else if (b.creatureStage === 'legendary') mult *= 1.85;
      if (b.hasBabyOffspring) mult *= 1.35; // Zoo Tycoon Breeding Bonus!
      // Magical Suitcase Sanctuary: Bond Closeness + Rare Morph + Compendium Mastery!
      mult *= getBondIncomeMultiplier(b.creatureBondLevel ?? 1);
      mult *= MORPH_INFO[b.creatureMorph ?? 'normal'].incomeMult;
      const masteryPct = getCompendiumMasteryBonusPct(this.state.suitcase?.discoveredMorphs.length ?? 0);
      mult *= 1 + masteryPct * 0.01;
    }

    // Custom Coaster Excitement bonus
    if (item.isCustomCoasterStation && b.coasterStats) {
      mult *= 0.7 + b.coasterStats.excitement * 0.16;
    }

    // Backstage Logistics Supply boost (+25% for nearby shops!)
    if (item.category === 'shop' && !item.isBackstage) {
      const hasNearbyBackstage = this.state.buildings.some(
        (other) =>
          Boolean(getCatalogItem(other.itemId)?.isBackstage) &&
          Date.now() >= other.constructEndsAt &&
          Math.hypot(other.gx - b.gx, other.gy - b.gy) <= 7
      );
      if (hasNearbyBackstage) mult *= 1.25;
    }

    // Price slider influence (bounded realistic elasticity: sweet spot ~1.18x-1.25x, never infinite!)
    if (item.ticketPrice) {
      const eff = this.getEffectivePrice(b, item);
      const verdict = this.getPriceValueVerdict(b, item);
      const priceFactor = (eff / item.ticketPrice) * verdict.demandMult;
      mult *= Math.max(0.45, Math.min(1.45, priceFactor));
    }

    const underCell = this.grid[b.gy]?.[b.gx];
    if (underCell) {
      if (item.grantsButterbeer && underCell.terrain === 'snow') mult *= 1.25;
      if (item.isCreatureHabitat && underCell.terrain === 'forest') mult *= 1.15;
      if (item.id === 'dragon_lair' && underCell.terrain === 'volcanic') mult *= 1.25;
    }

    const fest = this.getActiveFestival();
    if (fest === 'halloween' && item.id === 'halloween_arch') mult *= 2.0;
    if (fest === 'christmas') mult *= 1.25;
    if (fest === 'quidditch_cup' && item.id === 'burrow_feast_marquee') mult *= 2.0;

    if (this.state.level >= 100) mult *= 1.5;

    // V3 System #1: Disconnected buildings yield only 25% passive income until linked by path!
    if (!this.isBuildingConnected(b.uid)) {
      mult *= 0.25;
    }
    // V3 System #2: Broken-down rides pause passive bonus down to 20%
    if (b.isBrokenDown) {
      mult *= 0.2;
    }

    // V3 System #3: District Synergy Aura Multipliers!
    mult *= this.activeSynergies.buildingGoldMult.get(b.uid) ?? 1.0;

    // V3 System #4: Aged Butterbeer & Felix Felicis Workshop Buffs!
    const now = Date.now();
    if (item.category === 'shop' && (this.state.supply?.butterbeerBoostEndsAt ?? 0) > now) {
      mult *= 1.85;
    }

    let xpMult =
      (fest === 'halloween' ? 1.35 : 1.0) *
      (this.activeSynergies.buildingXpMult.get(b.uid) ?? 1.0);
    if ((this.state.supply?.felixBoostEndsAt ?? 0) > now) {
      xpMult *= 1.35;
    }

    return {
      galleons: Math.max(1, Math.round(item.baseIncome * mult)),
      xp: Math.max(1, Math.round(item.xpPerCollect * starIncomeMultiplier(b.stars) * xpMult)),
    };
  }

  public getActiveConstructions(now = Date.now()): PlacedBuilding[] {
    return this.state.buildings
      .filter((b) => now < b.constructEndsAt)
      .sort((a, b) => a.constructEndsAt - b.constructEndsAt);
  }

  public tickProductionToTimestamp(now: number, silent = false): void {
    this.tickMatch3Hearts(now);
    if (this.isVisitingNeighbor) {
      return;
    }
    // Check Workshop Brewing cauldron completion!
    const activeBrew = this.state.supply?.activeBrew;
    if (activeBrew && now >= activeBrew.endsAt) {
      const rec = CRAFT_RECIPES.find((r) => r.id === activeBrew.goodId);
      this.state.supply.goods[activeBrew.goodId] =
        (this.state.supply.goods[activeBrew.goodId] ?? 0) + 1;
      this.state.supply.activeBrew = null;
      if (rec && !silent) {
        this.audio.playHarvestBubble();
        this.onToast?.(`🧪 Vạc Chế Biến vừa ra lò 1 ${rec.emoji} ${rec.name}!`, rec.emoji);
      }
      this.onUiChange?.();
    }

    let anyJustConstructed = false;
    for (const b of this.state.buildings) {
      const item = getCatalogItem(b.itemId);
      if (!item) continue;

      if (now < b.constructEndsAt) {
        b.lastTickAt = b.constructEndsAt;
        continue;
      }

      if (item.isCreatureHabitat && b.creatureStage === 'egg') {
        b.creatureStage = 'baby';
        b.creatureHunger = 92;
        b.creatureHappiness = 95;
        b.lastTickAt = Math.max(b.lastTickAt, b.constructEndsAt);
        anyJustConstructed = true;
      }

      if (b.constructionNotified === false) {
        b.constructionNotified = true;
        b.lastTickAt = Math.max(b.lastTickAt, b.constructEndsAt);
        anyJustConstructed = true;
        const canCeremonialUnveil =
          !item.isFarmlandPlot &&
          !item.isAnimalPasturePlot &&
          !item.connectableGroup &&
          !item.isCreatureHabitat &&
          !item.isCoasterTrackPiece &&
          item.category !== 'decor' &&
          b.constructEndsAt > (b.placedAt || 0);
        if (canCeremonialUnveil && !this.state.sandboxMode && !this.isHeadmasterPreview) {
          b.awaitingUnveil = true;
        }
        const finishXp = Math.max(4, item.xpPerCollect);
        this.addXp(finishXp);
        if (!silent) {
          this.audio.playBuildComplete();
          this.onBuildingCompleted?.(b.uid);
          this.audio.playHarvestBubble();
          this.spawnFloatingText(
            b.gx + item.width * 0.5,
            b.gy + item.height * 0.5,
            item.isCreatureHabitat
              ? `🐣 Trứng nở! +${finishXp} ⭐`
              : b.awaitingUnveil
                ? `🎀 Sẵn sàng Cắt Băng Khánh Thành! +${finishXp} ⭐`
                : `✨ Xây xong! +${finishXp} ⭐`,
            '#fde047'
          );
          this.onToast?.(
            item.isCreatureHabitat
              ? `🐣 ${item.creatureName ?? item.name} vừa nở sau thời gian ấp trứng!`
              : b.awaitingUnveil
                ? `🎀 Công trình "${item.name}" đã hoàn tất — nhấp vào dải băng đỏ trên bản đồ để Cắt Băng Khánh Thành!`
                : `🏗️ Công trình "${item.name}" đã hoàn tất xây dựng & sẵn sàng hoạt động!`,
            item.isCreatureHabitat ? '🐣' : b.awaitingUnveil ? '🎀' : '🏗️'
          );
        }
      }

      // Honeydukes is a pure Match-3 Attic launcher (no coin or goods collection)
      if (item.id === 'burrow_honeydukes_canon') {
        b.storedGalleons = 0;
        b.storedXp = 0;
        b.readyBubbles = 0;
        b.workshopQueue = undefined;
        b.readyFarmGoods = undefined;
        b.lastTickAt = now;
        continue;
      }

      // Process Workshop Oven / Craft Queue slots (Playrix Township queue!)
      if (b.workshopQueue && b.workshopQueue.length > 0) {
        let finishedAnySlot = false;
        while (b.workshopQueue.length > 0 && now >= b.workshopQueue[0].endsAt) {
          const doneSlot = b.workshopQueue.shift()!;
          const gMeta = FARM_GOODS[doneSlot.goodId];
          b.readyFarmGoods = [...(b.readyFarmGoods ?? []), doneSlot.goodId];
          b.readyBubbles = Math.min(8, b.readyBubbles + 1);
          b.storedGalleons += Math.max(8, Math.round(gMeta.sellValue * 0.45));
          b.storedXp += gMeta.xp;
          finishedAnySlot = true;
          if (!silent) {
            this.audio.playHarvestBubble();
            this.onToast?.(
              `${gMeta.emoji} ${item.name} vừa ra lò 1 ${gMeta.name}! Bấm bong bóng để thu vào Kho Nông Sản!`,
              gMeta.emoji
            );
          }
        }
        if (finishedAnySlot) {
          anyJustConstructed = true;
        }
      }

      // 4-Stage Farmland Plot lifecycle (Plant -> Sprout/Water -> Ripe -> Harvest!)
      if (item.isFarmlandPlot) {
        if (b.cropId && b.cropReadyAt && now >= b.cropReadyAt) {
          const cMeta = FARM_CROPS[b.cropId];
          b.readyBubbles = Math.max(1, b.readyBubbles);
          b.storedGalleons = Math.max(cMeta.sellValue, b.storedGalleons);
          b.storedXp = Math.max(cMeta.xp, b.storedXp);
        }
        b.lastTickAt = now;
        continue;
      }

      // Connectable Animal Pasture lifecycle (Stock -> Graze/Feed -> Ready -> Auto-Restart Grazing!)
      if (item.isAnimalPasturePlot) {
        if (b.pastureAnimalId && b.pastureReadyAt && now >= b.pastureReadyAt) {
          const aMeta = PASTURE_ANIMALS[b.pastureAnimalId];
          if (aMeta) {
            b.readyBubbles = Math.max(1, b.readyBubbles);
            b.storedGalleons = Math.max(aMeta.sellValue, b.storedGalleons);
            b.storedXp = Math.max(aMeta.xp, b.storedXp);
          }
        }
        b.lastTickAt = now;
        continue;
      }

      if (item.cycleSec <= 0 || item.baseIncome <= 0) {
        b.lastTickAt = now;
        continue;
      }

      if (b.isEscaped) {
        b.lastTickAt = now;
        continue;
      }

      const maxCap = item.maxStorageCycles + (b.stars - 1) * 3;
      const elapsedSec = (now - b.lastTickAt) / 1000;
      const festSpeed = this.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
      const effectiveCycle = item.cycleSec * festSpeed;

      if (elapsedSec >= effectiveCycle) {
        const cycles = Math.floor(elapsedSec / effectiveCycle);
        b.lastTickAt += cycles * effectiveCycle * 1000;
        if (b.readyBubbles < maxCap) {
          const addCycles = Math.min(cycles, maxCap - b.readyBubbles);
          const prod = this.getBuildingProductionPerCycle(b, item);
          b.readyBubbles += addCycles;
          b.storedGalleons += prod.galleons * addCycles;
          b.storedXp += prod.xp * addCycles;
          if (
            addCycles > 0 &&
            (item.id === 'burrow_chicken_coop' || item.id === 'burrow_puffskein_pasture')
          ) {
            const curGoods = b.readyFarmGoods ?? [];
            if (curGoods.length < 4) {
              b.readyFarmGoods = [...curGoods, 'farm_egg_wool'];
            }
          } else if (addCycles > 0 && item.id === 'burrow_flower_garden') {
            const curGoods = b.readyFarmGoods ?? [];
            if (curGoods.length < 3) {
              b.readyFarmGoods = [...curGoods, 'floral_bouquet_gift'];
            }
          }
        }
      }
    }

    if (anyJustConstructed) {
      this.recomputeAllCoastersAndBiomes();
      this.saveToStorage();
      this.onUiChange?.();
    }
  }

  public getEffectiveItemStarCost(item: CatalogItem): number {
    const baseStars = getItemPuzzleStarCost(item);
    if (baseStars <= 0) return 0;
    if (item.connectableGroup && this.state.buildings.some((b) => b.itemId === item.id)) {
      return 0;
    }
    return baseStars;
  }

  public canPlaceItem(
    item: CatalogItem,
    gx: number,
    gy: number,
    rotation: 0 | 1 | 2 | 3,
    ignoreBuildingUid?: string
  ): { ok: boolean; reason?: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, reason: 'Chế độ Khách Tham Quan — không thể xây/sửa thung lũng của bạn bè!' };
    }
    if (!ignoreBuildingUid) {
      if (!this.state.sandboxMode && this.state.level < item.unlockLevel) {
        return { ok: false, reason: `Mở khóa bản vẽ ở Cấp Giải Đố ${item.unlockLevel}` };
      }
      const starCost = this.getEffectiveItemStarCost(item);
      if (starCost > 0) {
        if (!this.state.sandboxMode && (this.state.match3?.stars ?? 0) < starCost) {
          return {
            ok: false,
            reason: `Cần ${starCost} 🌟 Sao Phép Thuật (Vượt Bùa Gặt Honeydukes, Ngũ Ấn Đạo Tặc, Ma Trận Bảo Bối, Cờ Phù Thủy hoặc Nối Hình Sinh Vật để nhận Sao!)`,
          };
        }
      } else if (!this.state.sandboxMode && this.state.galleons < item.cost) {
        return { ok: false, reason: `Thiếu Vàng Galleon (${item.cost}G)` };
      }
    }

    const { bw, bh } = this.getBuildingFootprint(item, rotation);
    if (gx < 0 || gy < 0 || gx + bw > GRID_SIZE || gy + bh > GRID_SIZE) {
      return { ok: false, reason: 'Ngoài ranh giới bản đồ' };
    }

    const unlockedSet = new Set(this.state.unlockedZones);
    const baseElev = this.grid[gy][gx].elevation;

    for (let dy = 0; dy < bh; dy++) {
      for (let dx = 0; dx < bw; dx++) {
        const cell = this.grid[gy + dy][gx + dx];
        if (!this.state.sandboxMode && !unlockedSet.has(cell.zoneId)) {
          const z = getZoneById(cell.zoneId);
          return { ok: false, reason: `Vùng "${z.name}" đang phủ sương mù` };
        }

        if (item.elevationDelta) {
          const nextE = cell.elevation + item.elevationDelta;
          if (nextE < 0 || nextE > 3) {
            return { ok: false, reason: item.elevationDelta > 0 ? 'Đã đạt đỉnh đồi +3' : 'Đã ở mặt đất 0' };
          }
          if (cell.terrain === 'water' && nextE > 0) {
            return { ok: false, reason: 'Hãy lấp mặt nước trước khi nâng đồi' };
          }
          continue;
        }

        if (item.isCoasterTrackPiece) {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          continue;
        }

        if (item.isZooFence) {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          continue;
        }

        if (item.category === 'terrain') {
          if (item.terrainType === 'water' && cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Không thể đào nước dưới công trình' };
          }
          continue;
        }

        if (item.category === 'path') {
          if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
            return { ok: false, reason: 'Vướng công trình' };
          }
          // All paths can cross water (auto-builds an arched wooden bridge!)
          continue;
        }

        // Multi-tile building checks
        if (cell.buildingUid && cell.buildingUid !== ignoreBuildingUid) {
          return { ok: false, reason: 'Ô đất đã có công trình' };
        }
        if (cell.coasterTrack) {
          return { ok: false, reason: 'Ô đất đang có Đường Ray Tàu Lượn' };
        }
        if (cell.terrain === 'water' && item.id !== 'black_lake_boats') {
          return { ok: false, reason: 'Không thể xây trên mặt nước' };
        }
        if (cell.elevation !== baseElev) {
          return { ok: false, reason: 'Cần mặt bằng cùng độ cao để đặt công trình lớn' };
        }
      }
    }

    return { ok: true };
  }

  public placeItem(item: CatalogItem, gx: number, gy: number, rotation: 0 | 1 | 2 | 3): boolean {
    const check = this.canPlaceItem(item, gx, gy, rotation);
    if (!check.ok) return false;

    const key = `${gx},${gy}`;
    const cell = this.grid[gy][gx];

    // 1. Terrain Elevation Raise / Lower
    if (item.elevationDelta) {
      const nextE = Math.max(0, Math.min(3, cell.elevation + item.elevationDelta));
      if (nextE === cell.elevation) return false;
      if (!this.state.sandboxMode) {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
      cell.elevation = nextE;
      this.state.tileOverrides[key] = { ...this.state.tileOverrides[key], elevation: nextE };
      this.recomputeAllCoastersAndBiomes();
      this.addXp(item.xpPerCollect);
      this.audio.playPlace();
      this.spawnFloatingText(gx, gy, `Độ cao +${nextE}`, '#cbd5e1');
      this.onUiChange?.();
      return true;
    }

    // 2. Custom Coaster Track Piece
    if (item.isCoasterTrackPiece) {
      if (cell.coasterTrack) return false;
      if (!this.state.sandboxMode) {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
      cell.coasterTrack = true;
      this.state.tileOverrides[key] = { ...this.state.tileOverrides[key], coasterTrack: true };
      this.recomputeAllCoastersAndBiomes();
      this.addXp(item.xpPerCollect);
      this.audio.playPlace();
      this.spawnFloatingText(gx, gy, `🛤️ +${item.xpPerCollect} ⭐`, '#fde047');
      this.onUiChange?.();
      return true;
    }

    // 3. Zoo Sanctuary Fence
    if (item.isZooFence) {
      if (cell.zooFence) return false;
      if (!this.state.sandboxMode) {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
      cell.zooFence = true;
      this.state.tileOverrides[key] = { ...this.state.tileOverrides[key], zooFence: true };
      this.recomputeAllCoastersAndBiomes();
      this.addXp(item.xpPerCollect);
      this.audio.playPlace();
      this.onUiChange?.();
      return true;
    }

    // 4. Terrain Brush
    if (item.category === 'terrain' && item.terrainType) {
      if (cell.terrain === item.terrainType) return false;
      if (!this.state.sandboxMode) {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
      if (item.terrainType === 'water') {
        cell.elevation = 0;
      }
      cell.terrain = item.terrainType;
      this.state.tileOverrides[key] = {
        ...this.state.tileOverrides[key],
        terrain: item.terrainType,
        elevation: cell.elevation,
      };
      this.recomputeAllCoastersAndBiomes();
      this.addXp(item.xpPerCollect);
      this.state.stats.pathsPlaced++;
      this.recordQuestProgress('place_paths', item.id, 1);
      this.audio.playPlace();
      this.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
      this.onUiChange?.();
      return true;
    }

    // 5. Footpath / Queue / Bridge Brush
    if (item.category === 'path' && item.pathType) {
      if (cell.path === item.pathType) return false;
      if (!this.state.sandboxMode) {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
      this.state.tileOverrides[key] = {
        ...this.state.tileOverrides[key],
        path: item.pathType,
      };
      cell.path = item.pathType;
      this.recomputeAllCoastersAndBiomes();
      this.addXp(item.xpPerCollect);
      this.state.stats.pathsPlaced++;
      this.recordQuestProgress('place_paths', item.id, 1);
      this.audio.playPlace();
      this.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
      this.onUiChange?.();
      return true;
    }

    // 6. Regular Building / Ride / Creature / Decor (Star-only instant build for major blueprints; Gold-only for plots & expandable connectable yards!)
    const starCost = this.getEffectiveItemStarCost(item);
    if (!this.state.sandboxMode) {
      if (starCost > 0) {
        if (this.state.match3) {
          this.state.match3.stars = Math.max(0, this.state.match3.stars - starCost);
        }
      } else {
        this.state.galleons -= item.cost;
        this.state.finance.constructionSpent += item.cost;
      }
    }

    const now = Date.now();
    const baseBuildSec = Math.max(item.buildDurationSec, computeRealTimeBuildSeconds(item));
    const durMs = this.state.sandboxMode ? 0 : Math.round(baseBuildSec * 1000);
    const durSecActual = Math.ceil(durMs / 1000);
    const uid = `b_${now}_${Math.floor(Math.random() * 9999)}`;

    // New Thửa Đất Canh Tác always starts as freshly-tilled soil ready for the player to sow seeds!
    const newBuilding: PlacedBuilding = {
      uid,
      itemId: item.id,
      gx,
      gy,
      rotation,
      stars: 1,
      placedAt: now,
      constructEndsAt: now + durMs,
      lastTickAt: now + durMs,
      storedGalleons: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      cropId: undefined,
      cropPlantedAt: undefined,
      cropReadyAt: undefined,
      cropWateredBoost: false,
      creatureStage: item.isCreatureHabitat
        ? durMs > 0
          ? 'egg'
          : item.id === 'burrow_chicken_coop' || item.id === 'burrow_puffskein_pasture'
            ? 'adult'
            : 'baby'
        : undefined,
      creatureHunger: item.isCreatureHabitat ? 98 : undefined,
      creatureHappiness: item.isCreatureHabitat ? 98 : undefined,
      feedCount: item.isCreatureHabitat ? 0 : undefined,
      creatureBondLevel: item.isCreatureHabitat ? 1 : undefined,
      creatureBondXp: item.isCreatureHabitat ? 0 : undefined,
      creatureMorph: item.isCreatureHabitat ? 'normal' : undefined,
      isEscaped: false,
      builtInSandbox: this.state.sandboxMode ? true : undefined,
      constructionNotified: durMs <= 0,
    };

    if (item.isCreatureHabitat) {
      this.registerDiscoveredMorph(item.id, 'normal');
    }

    this.state.buildings.push(newBuilding);
    this.rebuildGrid();
    this.audio.playPlace();
    this.onBuildingTactile?.(newBuilding.uid);
    if (durMs <= 0 && starCost > 0) {
      this.audio.playSpell();
      this.onBuildingCompleted?.(newBuilding.uid);
    }

    if (durMs > 0) {
      const waitLabel = formatDurationCompactVi(durSecActual);
      this.spawnFloatingText(
        gx + item.width * 0.5,
        gy + item.height * 0.5,
        item.isCreatureHabitat ? `🥚 Ấp trứng (${waitLabel})` : `🔨 Xây dựng (${waitLabel})`,
        '#93c5fd'
      );
    } else if (starCost > 0) {
      if (item.xpPerCollect > 0) {
        this.addXp(item.xpPerCollect);
      }
      this.spawnFloatingText(
        gx + item.width * 0.5,
        gy + item.height * 0.5,
        `✨ Xây xong! -${starCost} 🌟`,
        '#fde047'
      );
    } else if (item.xpPerCollect > 0) {
      this.addXp(item.xpPerCollect);
      this.spawnFloatingText(gx, gy, `+${item.xpPerCollect} ⭐`, '#fde047');
    }

    this.recordQuestProgress('build_item', item.id, 1);
    if (
      starCost > 0 ||
      item.category === 'shop' ||
      item.id === 'burrow_house_canon' ||
      item.id === 'molly_apple_bakery'
    ) {
      this.advanceTutorialStep('build_and_owl_order');
    }
    if (item.category === 'decor') {
      this.recordQuestProgress('place_paths', item.id, 1);
    }
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public removeAtTile(gx: number, gy: number): boolean {
    if (this.isVisitingNeighbor) {
      this.onToast?.('Chế độ Khách Tham Quan — không thể ủi/dọn vườn bạn bè!', '🛡️');
      return false;
    }
    if (gx < 0 || gy < 0 || gx >= GRID_SIZE || gy >= GRID_SIZE) return false;
    const cell = this.grid[gy][gx];
    const key = `${gx},${gy}`;

    if (cell.hasLitter) {
      cell.hasLitter = false;
      this.stateRevision++;
      if (this.state.tileOverrides[key]) {
        this.state.tileOverrides[key].hasLitter = false;
      }
      this.addXp(4);
      this.audio.playSpell();
      this.spawnFloatingText(gx, gy, 'Scourgify! +4 ⭐', '#67e8f9');
      this.onUiChange?.();
      return true;
    }

    if (cell.coasterTrack) {
      cell.coasterTrack = false;
      if (this.state.tileOverrides[key]) {
        this.state.tileOverrides[key].coasterTrack = false;
      }
      if (!this.state.sandboxMode) this.state.galleons += 8;
      this.recomputeAllCoastersAndBiomes();
      this.audio.playPlace();
      this.spawnFloatingText(gx, gy, 'Tháo ray +8 🪙', '#fcd34d');
      this.onUiChange?.();
      return true;
    }

    if (cell.zooFence) {
      cell.zooFence = false;
      if (this.state.tileOverrides[key]) {
        this.state.tileOverrides[key].zooFence = false;
      }
      if (!this.state.sandboxMode) this.state.galleons += 5;
      this.recomputeAllCoastersAndBiomes();
      this.audio.playPlace();
      this.onUiChange?.();
      return true;
    }

    if (cell.buildingUid) {
      const idx = this.state.buildings.findIndex((b) => b.uid === cell.buildingUid);
      if (idx === -1) return false;
      const b = this.state.buildings[idx];
      if (b.isIndestructible) {
        this.onToast?.('Nhà Hang Sóc 6 Tầng là tổ ấm trung tâm của gia đình Weasley!', '🏠');
        return false;
      }
      const item = getCatalogItem(b.itemId);
      let refund = 0;
      let starRefund = 0;
      if (!b.builtInSandbox) {
        if (item) {
          const sameItemCount = this.state.buildings.filter((x) => x.itemId === b.itemId).length;
          const baseStars =
            item.connectableGroup && sameItemCount > 1 ? 0 : getItemPuzzleStarCost(item);
          let totalGoldInvested = baseStars > 0 ? 0 : item.cost;
          let totalStarsInvested = baseStars;
          for (let s = 1; s < b.stars; s++) {
            totalGoldInvested += getUpgradeCost(item, s);
            totalStarsInvested += getUpgradePuzzleStarCost(s, item);
          }
          refund = Math.round(totalGoldInvested * 0.65);
          starRefund = totalStarsInvested;
        } else {
          refund = 15;
        }
      }
      this.state.buildings.splice(idx, 1);
      this.rideQueues.delete(b.uid);
      this.escapedCreatures = this.escapedCreatures.filter((e) => e.buildingUid !== b.uid);
      if (this.state.suitcase?.activeIncubation?.habitatUid === b.uid) {
        this.state.suitcase.activeIncubation = null;
      }
      if (this.state.suitcase?.activeExpedition?.habitatUid === b.uid) {
        this.state.suitcase.activeExpedition = null;
      }
      if (!this.state.sandboxMode && !b.builtInSandbox) {
        this.state.galleons += refund;
        if (starRefund > 0 && this.state.match3) {
          this.state.match3.stars += starRefund;
        }
      }
      this.rebuildGrid();
      this.audio.playPlace();
      this.spawnFloatingText(
        gx,
        gy,
        b.builtInSandbox
          ? 'Đã dọn công trình Sandbox'
          : starRefund > 0 && refund > 0
            ? `Hoàn +${starRefund} 🌟 +${refund} 🪙`
            : starRefund > 0
              ? `Hoàn +${starRefund} 🌟 Sao`
              : `Hoàn +${refund} 🪙`,
        '#fcd34d'
      );
      this.saveToStorage();
      this.onUiChange?.();
      return true;
    }

    if (cell.path !== 'none') {
      cell.path = 'none';
      if (this.state.tileOverrides[key]) {
        this.state.tileOverrides[key].path = 'none';
      }
      if (!this.state.sandboxMode) this.state.galleons += 3;
      this.recomputeAllCoastersAndBiomes();
      this.audio.playPlace();
      this.onUiChange?.();
      return true;
    }

    return false;
  }

  public tryDropWizardCard(_gx: number, _gy: number, _baseChance = 0.08): void {
    // Chocolate Frog Wizard Card collection removed per design update.
  }

  public awardHousePoints(house: HouseName, pts: number): void {
    this.state.housePoints[house] = (this.state.housePoints[house] ?? 0) + pts;
  }

  public claimHouseCupReward(): boolean {
    const totalPts = Object.values(this.state.housePoints).reduce((a, b) => a + b, 0);
    const target = this.state.houseCupMilestoneTier * 300;
    if (totalPts < target) return false;

    const entries = Object.entries(this.state.housePoints) as Array<[HouseName, number]>;
    entries.sort((a, b) => b[1] - a[1]);
    const winner = entries[0][0];
    const rewardGold = 180 + this.state.houseCupMilestoneTier * 140;
    const rewardXp = 90 + this.state.houseCupMilestoneTier * 65;

    this.state.galleons += rewardGold;
    this.state.timeSand += 1;
    this.state.houseCupMilestoneTier += 1;
    this.addXp(rewardXp);
    this.audio.playLevelUp();
    this.onToast?.(
      `🏆 Nhà ${winner} dẫn đầu Cúp Nhà! Thưởng Quản Lý +${rewardGold}G, +${rewardXp} XP & +1 ⏳!`,
      '🏆'
    );
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  private grantBuildingIngredientDrop(
    b: PlacedBuilding,
    item: CatalogItem | undefined,
    showFloat = true
  ): void {
    if (!item?.producesIngredient || !this.state.supply) return;
    const ing = item.producesIngredient;
    const qty =
      item.id === 'burrow_greenhouse_canon' ||
      item.id === 'molly_apple_bakery' ||
      item.id === 'burrow_cider_apiary'
        ? 2
        : 1;
    this.state.supply.ingredients[ing] = Math.min(
      99,
      (this.state.supply.ingredients[ing] ?? 0) + qty
    );
    if (item.id === 'burrow_greenhouse_canon') {
      this.state.supply.ingredients.sweet_pumpkin = Math.min(
        99,
        (this.state.supply.ingredients.sweet_pumpkin ?? 0) + 1
      );
    }
    if (showFloat) {
      const info = RAW_INGREDIENTS_INFO[ing];
      this.spawnFloatingText(b.gx + 0.5, b.gy, `+${qty} ${info.emoji}`, '#86efac');
    }
  }

  public harvestBuildingBubble(uid: string): boolean {
    if (this.isVisitingNeighbor) return false;
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || b.itemId === 'burrow_honeydukes_canon') return false;
    const item = getCatalogItem(b.itemId);

    if (item?.isFarmlandPlot) {
      if (b.cropId && b.cropReadyAt && Date.now() >= b.cropReadyAt) {
        return this.harvestCropPlot(uid).ok;
      }
      return false;
    }

    if (item?.isAnimalPasturePlot) {
      if (b.pastureAnimalId && b.pastureReadyAt && Date.now() >= b.pastureReadyAt) {
        return this.harvestAnimalPasture(uid).ok;
      }
      return false;
    }

    const hasGoods = Boolean(b.readyFarmGoods && b.readyFarmGoods.length > 0);
    if (b.storedGalleons <= 0 && !hasGoods) return false;

    const g = b.storedGalleons;
    const x = b.storedXp;
    b.storedGalleons = 0;
    b.storedXp = 0;
    b.readyBubbles = 0;

    let goodsLabel = '';
    if (b.readyFarmGoods && b.readyFarmGoods.length > 0) {
      const counts = new Map<FarmGoodId, number>();
      for (const gid of b.readyFarmGoods) {
        const added = this.addFarmItemToBarn(gid, 1);
        if (added > 0) {
          counts.set(gid, (counts.get(gid) ?? 0) + added);
        }
      }
      b.readyFarmGoods = [];
      const parts: string[] = [];
      for (const [gid, qty] of counts.entries()) {
        parts.push(`+${qty} ${FARM_GOODS[gid].emoji}`);
      }
      if (parts.length > 0) {
        goodsLabel = `  ${parts.join(' ')}`;
      }
    }

    this.state.galleons += g;
    this.state.finance.harvestRevenue += g;
    this.state.stats.totalGalleonsHarvested += g;
    this.addXp(x);
    this.addHarvestFeastPoints(hasGoods ? 10 : 4);
    if (g > 0) {
      this.recordQuestProgress('harvest_galleons', undefined, g);
    }
    if (item?.grantsButterbeer) {
      this.state.stats.butterbeerServed++;
      this.recordQuestProgress('serve_butterbeer', undefined, 1);
    }
    this.grantBuildingIngredientDrop(b, item, true);

    this.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 0.5);
    const cy = b.gy + (item ? item.height * 0.5 : 0.5);
    this.spawnFloatingText(
      cx,
      cy,
      g > 0 ? `+${g} 🪙  +${x} ⭐${goodsLabel}` : `📦 Thu kho:${goodsLabel}`,
      '#fde047'
    );
    if (g > 0) {
      this.onRewardFly?.('galleons', g, cx, cy);
    }
    this.tryDropWizardCard(cx, cy, this.getCurrentWeather().kind === 'fog' ? 0.12 : 0.09);
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public upgradeBuildingStar(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể nâng cấp công trình vườn bạn!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy công trình' };
    if (Date.now() < b.constructEndsAt) return { ok: false, msg: 'Công trình đang xây/ấp trứng' };
    if (b.stars >= 5) return { ok: false, msg: 'Đã đạt tối đa 5 Sao Huyền Thoại!' };

    const item = getCatalogItem(b.itemId);
    if (!item) return { ok: false, msg: 'Dữ liệu không hợp lệ' };

    const cost = getUpgradeCost(item, b.stars);
    const starCost = getUpgradePuzzleStarCost(b.stars, item);
    if (!this.state.sandboxMode && (this.state.match3?.stars ?? 0) < starCost) {
      return {
        ok: false,
        msg: `Cần ${starCost} 🌟 Sao Phép Thuật để nâng lên ${b.stars + 1}★ — Hãy vượt thêm các màn Giải Đố (1–${MAX_MINIGAME_STAGE})!`,
      };
    }
    if (!this.state.sandboxMode && this.state.galleons < cost) {
      return { ok: false, msg: `Cần ${cost} Galleon để nâng lên ${b.stars + 1}★` };
    }

    if (!this.state.sandboxMode) {
      this.state.galleons -= cost;
      this.state.finance.constructionSpent += cost;
      this.state.match3.stars = Math.max(0, this.state.match3.stars - starCost);
    }
    b.stars += 1;
    if (item.isCreatureHabitat) {
      if (b.stars >= 4) b.creatureStage = 'legendary';
      else if (b.stars >= 2) b.creatureStage = 'adult';
      b.creatureHunger = 100;
      b.creatureHappiness = 100;
    }
    b.durability = 100;

    const bonusXp = Math.round(25 * b.stars + item.xpPerCollect);
    this.addXp(bonusXp);
    this.state.stats.starUpgradesDone++;
    this.recordQuestProgress('upgrade_star', item.id, 1);
    this.audio.playSpell();
    this.spawnFloatingText(b.gx + 1, b.gy + 1, `Kiến trúc ${b.stars}★! +${bonusXp} ⭐`, '#f59e0b');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Đã nâng cấp lên ${b.stars}★!` };
  }

  public getBuildingMinFloorSec(b: PlacedBuilding): number {
    const item = getCatalogItem(b.itemId);
    const baseSec = Math.max(
      item?.buildDurationSec ?? 0,
      Math.round((b.constructEndsAt - (b.placedAt || b.constructEndsAt)) / 1000) +
        (b.buildReducedSec ?? 0)
    );
    return getMinRemainingBuildFloorSec(baseSec);
  }

  /**
   * Rút ngắn thời gian xây dựng công trình tự động khi người chơi thắng Minigame
   * (Match-3, Caro, Sudoku, Cờ Phù Thủy, Xếp Khối) hoặc trả lời đúng Quiz Ngoại Ngữ:
   * - Giảm tối đa xuống mức sàn còn lại tối thiểu (1 tiếng đối với công trình >= 1 tiếng; 5–10 phút với công trình cấp đầu).
   * - Nếu công trình đầu tiên chạm mức sàn mà vẫn dư số giây thưởng, phần dư tự động chuyển sang công trình đang xây kế tiếp!
   */
  public applyConstructionReductionFromGameplay(
    rawReduceSec: number,
    sourceLabelVi = 'Giải Đố',
    preferredUid?: string
  ): BuildReductionResult {
    const budgetSec = Math.max(0, Math.round(rawReduceSec));
    const targetBuildings = (this.homeStateWhileVisiting ?? this.state).buildings;
    const now = Date.now();
    const actives = targetBuildings
      .filter((x) => now < x.constructEndsAt)
      .sort((a, b) => {
        if (preferredUid) {
          if (a.uid === preferredUid) return -1;
          if (b.uid === preferredUid) return 1;
        }
        return (a.placedAt || 0) - (b.placedAt || 0) || a.constructEndsAt - b.constructEndsAt;
      });

    if (actives.length === 0 || budgetSec <= 0) {
      return { reducedSec: 0, activeCount: actives.length };
    }

    let remainingMs = budgetSec * 1000;
    let totalAppliedMs = 0;
    let primaryTarget: PlacedBuilding | undefined;
    let primaryFloorSec = 0;
    let primaryHitFloor = false;
    let atFloorCount = 0;

    for (const b of actives) {
      const floorSec = this.getBuildingMinFloorSec(b);
      const floorEndsAt = now + floorSec * 1000;
      const reducibleMs = Math.max(0, b.constructEndsAt - floorEndsAt);
      if (reducibleMs <= 0) {
        atFloorCount++;
        continue;
      }
      if (remainingMs <= 0) break;

      const shaveMs = Math.min(remainingMs, reducibleMs);
      b.constructEndsAt -= shaveMs;
      b.lastTickAt = b.constructEndsAt;
      const shaveSec = Math.max(1, Math.round(shaveMs / 1000));
      b.buildReducedSec = (b.buildReducedSec ?? 0) + shaveSec;
      remainingMs -= shaveMs;
      totalAppliedMs += shaveMs;

      if (!primaryTarget) {
        primaryTarget = b;
        primaryFloorSec = floorSec;
        primaryHitFloor = b.constructEndsAt <= floorEndsAt + 500;
      }

      if (!this.isVisitingNeighbor) {
        const item = getCatalogItem(b.itemId);
        this.onBuildingTactile?.(b.uid);
        this.spawnFloatingText(
          b.gx + (item?.width ?? 2) * 0.5,
          b.gy + (item?.height ?? 2) * 0.5,
          `🔨 -${formatDurationCompactVi(shaveSec)} (${sourceLabelVi})!`,
          '#34d399'
        );
      }
    }

    if (totalAppliedMs <= 0) {
      const firstB = actives[0];
      const fItem = firstB ? getCatalogItem(firstB.itemId) : undefined;
      return {
        reducedSec: 0,
        targetUid: firstB?.uid,
        targetName: fItem?.name,
        remainAfterSec: firstB ? Math.max(1, Math.ceil((firstB.constructEndsAt - now) / 1000)) : undefined,
        floorSec: firstB ? this.getBuildingMinFloorSec(firstB) : undefined,
        allActiveAtFloor: atFloorCount === actives.length,
        activeCount: actives.length,
      };
    }

    const totalReducedSec = Math.max(1, Math.round(totalAppliedMs / 1000));
    const pItem = primaryTarget ? getCatalogItem(primaryTarget.itemId) : undefined;
    const remainAfterSec = primaryTarget
      ? Math.max(1, Math.ceil((primaryTarget.constructEndsAt - now) / 1000))
      : undefined;

    return {
      reducedSec: totalReducedSec,
      targetUid: primaryTarget?.uid,
      targetName: pItem?.name,
      remainAfterSec,
      floorSec: primaryFloorSec,
      hitMinFloor: primaryHitFloor,
      allActiveAtFloor: false,
      activeCount: actives.length,
    };
  }

  public speedUpWithTimeSand(uid: string, finishAll = false): boolean {
    if (this.isVisitingNeighbor) return false;
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const now = Date.now();
    if (now >= b.constructEndsAt) return false;

    if (!this.state.sandboxMode) {
      const floorLabel = formatDurationCompactVi(this.getBuildingMinFloorSec(b));
      this.onToast?.(
        `🔨 Công trình không dùng Cát ⏳ để bỏ qua trắng — hãy vượt Khảo Thí Pháp Thuật hoặc niệm Thần Chú Đa Ngữ để giảm giờ xây (tối đa còn ${floorLabel} để hoàn thành)!`,
        '🔨'
      );
      return false;
    }

    const remainSec = Math.max(1, Math.ceil((b.constructEndsAt - now) / 1000));
    const sandNeeded = finishAll ? Math.max(1, Math.ceil(remainSec / TIME_SAND_SKIP_SECONDS)) : 1;
    b.constructEndsAt = finishAll
      ? now
      : Math.max(now, b.constructEndsAt - sandNeeded * TIME_SAND_SKIP_SECONDS * 1000);
    b.lastTickAt = b.constructEndsAt;
    if (now >= b.constructEndsAt) {
      this.tickProductionToTimestamp(now, false);
    } else {
      this.saveToStorage();
    }
    this.audio.playSpell();
    this.onUiChange?.();
    return true;
  }

  public feedCreature(uid: string): boolean {
    if (this.isVisitingNeighbor) return false;
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const item = getCatalogItem(b.itemId);
    if (!item || !item.isCreatureHabitat || Date.now() < b.constructEndsAt) return false;

    const feedCost = Math.max(8, Math.round(item.cost * 0.04));
    if (!this.state.sandboxMode && this.state.galleons < feedCost) {
      this.onToast?.(`Cần ${feedCost} Galleon mua khẩu phần thức ăn phép thuật!`, '🥩');
      return false;
    }
    if (!this.state.sandboxMode) this.state.galleons -= feedCost;

    b.creatureHunger = 100;
    b.creatureHappiness = 100;
    b.durability = 100;
    b.feedCount = (b.feedCount ?? 0) + 1;
    if (b.creatureStage === 'baby' && b.feedCount >= 3) {
      b.creatureStage = 'adult';
      this.onToast?.(`🎉 ${item.creatureName} đã lớn thành Trưởng Thành khỏe mạnh!`, '🦄');
    }

    const xpGain = Math.max(12, Math.round(item.xpPerCollect * 0.6));
    this.addXp(xpGain);
    this.addCreatureBondXp(b, item, 22);
    this.registerDiscoveredMorph(item.id, b.creatureMorph ?? 'normal');
    this.state.stats.creaturesFed++;
    this.recordQuestProgress('feed_creatures', item.id, 1);
    this.recordQuestProgress('serve_butterbeer', item.id, 1);
    this.audio.playSpell();
    this.spawnFloatingText(b.gx + 1, b.gy + 1, `💖 Măm măm! +${xpGain} ⭐`, '#f472b6');
    this.tryDropWizardCard(b.gx + 1, b.gy + 1, 0.12);
    this.onUiChange?.();
    return true;
  }

  public unlockZone(zoneId: ZoneId): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể mở khóa đất của bạn bè!' };
    }
    if (this.state.unlockedZones.includes(zoneId)) {
      return { ok: false, msg: 'Vùng đất này đã mở khóa rồi!' };
    }
    const z = getZoneById(zoneId);
    const zoneStars = getZonePuzzleStarCost(z);
    if (!this.state.sandboxMode && this.state.level < z.unlockLevel) {
      return { ok: false, msg: `Cần đạt Cấp ${z.unlockLevel} để phá phong ấn vùng "${z.name}"` };
    }
    if (!this.state.sandboxMode && (this.state.match3?.stars ?? 0) < zoneStars) {
      return {
        ok: false,
        msg: `Cần ${zoneStars} 🌟 Sao Phép Thuật để phá phong ấn "${z.name}" (Hãy chơi Màn ${this.state.match3?.currentLevel ?? 1}!)`,
      };
    }
    if (!this.state.sandboxMode && this.state.galleons < z.unlockCost) {
      return { ok: false, msg: `Cần ${z.unlockCost} Vàng Galleon để mở "${z.name}"` };
    }

    if (!this.state.sandboxMode) {
      this.state.galleons -= z.unlockCost;
      this.state.finance.constructionSpent += z.unlockCost;
      this.state.match3.stars = Math.max(0, this.state.match3.stars - zoneStars);
    }
    this.state.unlockedZones.push(zoneId);
    this.stateRevision++;
    const bonusXp = Math.round(80 + z.unlockLevel * 35);
    this.addXp(bonusXp);
    this.recordQuestProgress('unlock_zone', zoneId, 1);
    this.audio.playLevelUp();

    const cx = (z.x1 + z.x2) * 0.5;
    const cy = (z.y1 + z.y2) * 0.5;
    this.spawnFloatingText(cx, cy, `✨ Đã mở ${z.name}! +${bonusXp} ⭐`, '#fbbf24');
    this.onToast?.(`Sương mù tan biến! Chào mừng tới ${z.name}!`, '🗺️');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Đã mở khóa ${z.name}!` };
  }

  public catchEscapedCreature(escId: string): boolean {
    const idx = this.escapedCreatures.findIndex((e) => e.id === escId);
    if (idx === -1) return false;
    const esc = this.escapedCreatures[idx];
    this.escapedCreatures.splice(idx, 1);

    const home = this.state.buildings.find((b) => b.uid === esc.buildingUid);
    if (home) {
      home.isEscaped = false;
      home.creatureHunger = 85;
      home.durability = 95;
    }

    const reward = esc.stolenCoins + 25;
    this.state.galleons += reward;
    this.addXp(22);
    this.state.stats.nifflersCaught++;
    this.audio.playSpell();
    this.spawnFloatingText(esc.gx, esc.gy, `Accio! Thu hồi +${reward} 🪙`, '#60a5fa');
    this.onRewardFly?.('galleons', reward, esc.gx, esc.gy);
    this.tryDropWizardCard(esc.gx, esc.gy, 0.25);
    this.onToast?.(`Đã đưa ${esc.name} về chuồng an toàn và thu hồi ${reward} Galleon!`, '🐾');
    this.onUiChange?.();
    return true;
  }

  public triggerPlayfulEscape(): void {
    const hab = this.state.buildings.find((b) => {
      const it = getCatalogItem(b.itemId);
      return it?.canEscape && !b.isEscaped && Date.now() >= b.constructEndsAt;
    });
    if (!hab) {
      this.onToast?.('Hãy xây Khu Bảo Tồn Đào Mỏ (Niffler) ở Cấp 4 để xem thú tinh nghịch nhé!', '🐾');
      return;
    }
    this.spawnEscapedFromHabitat(hab);
  }

  private spawnEscapedFromHabitat(hab: PlacedBuilding): void {
    const item = getCatalogItem(hab.itemId);
    if (!item) return;
    hab.isEscaped = true;
    const species =
      item.id === 'dragon_lair'
        ? 'dragon'
        : item.id === 'hippogriff_glade'
          ? 'hippogriff'
          : 'niffler';

    const pathSpot = getRandomUnlockedPathTile(this.grid, new Set(this.state.unlockedZones)) ?? {
      gx: hab.gx + 1,
      gy: hab.gy + 1,
    };

    this.escapedCreatures.push({
      id: `esc_${Date.now()}_${Math.random()}`,
      buildingUid: hab.uid,
      species,
      name: item.creatureName ?? 'Niffler',
      gx: pathSpot.gx,
      gy: pathSpot.gy,
      vx: 0.8,
      vy: 0.6,
      stolenCoins: 12,
    });

    this.audio.playCheekyAlert();
    this.onToast?.(
      `${item.creatureName} vừa lách qua Bùa Chắn ra đường dạo chơi! Bấm vào nó (hoặc chờ Thần Sáng) để đưa về nhé!`,
      '🚨'
    );
    this.onUiChange?.();
  }

  public castAccioHarvestAll(): void {
    let count = 0;
    let sumG = 0;
    let sumX = 0;
    const now = Date.now();
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (it?.isFarmlandPlot) {
        if (b.cropId && b.cropReadyAt && now >= b.cropReadyAt) {
          if (this.harvestCropPlot(b.uid).ok) {
            count++;
          }
        }
        continue;
      }
      if (b.readyFarmGoods && b.readyFarmGoods.length > 0) {
        for (const gid of b.readyFarmGoods) {
          this.addFarmItemToBarn(gid, 1);
        }
        b.readyFarmGoods = [];
      }
      if (b.storedGalleons > 0) {
        sumG += b.storedGalleons;
        sumX += b.storedXp;
        b.storedGalleons = 0;
        b.storedXp = 0;
        b.readyBubbles = 0;
        if (it?.grantsButterbeer) {
          this.state.stats.butterbeerServed++;
          this.recordQuestProgress('serve_butterbeer', undefined, 1);
        }
        this.grantBuildingIngredientDrop(b, it, false);
        count++;
      }
    }
    for (const esc of [...this.escapedCreatures]) {
      this.catchEscapedCreature(esc.id);
    }
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        if (this.grid[y][x].hasLitter) {
          this.grid[y][x].hasLitter = false;
          this.stateRevision++;
          if (this.state.tileOverrides[`${x},${y}`]) {
            this.state.tileOverrides[`${x},${y}`].hasLitter = false;
          }
          sumX += 3;
        }
      }
    }

    if (count > 0 || sumX > 0) {
      this.state.galleons += sumG;
      this.state.finance.harvestRevenue += sumG;
      this.state.stats.totalGalleonsHarvested += sumG;
      this.addXp(sumX);
      if (sumG > 0) {
        this.recordQuestProgress('harvest_galleons', undefined, sumG);
        this.onRewardFly?.('galleons', sumG);
      }
      this.audio.playSpell();
      this.onToast?.(`⚡ Accio! Đã gom sạch ${sumG} Galleon & ${sumX} XP từ ${count} công trình!`, '🪄');
      this.onUiChange?.();
    } else {
      this.onToast?.('Hiện các mái nhà đang tích lũy vàng, chờ thêm chút xíu nhé!', '✨');
    }
  }

  public getDisciplineStageInfo(kind: MinigameTrialKind): {
    currentStage: number;
    clearedStages: number;
    maxStage: number;
    isMaxed: boolean;
  } {
    const pa = this.state.puzzleArcade;
    const m3 = this.state.match3;
    let currentStage = 1;
    let clearedStages = 0;
    if (kind === 'match3') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, m3.currentLevel ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'sudoku') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.sudokuStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.sudokuCleared ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'caro') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.caroStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.caroCleared ?? Math.max(0, currentStage - 1))
      );
    } else if (kind === 'chess') {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.chessStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.chessCleared ?? Math.max(0, currentStage - 1))
      );
    } else {
      currentStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, pa.blockStage ?? 1));
      clearedStages = Math.max(
        0,
        Math.min(MAX_MINIGAME_STAGE, pa.blockCleared ?? Math.max(0, currentStage - 1))
      );
    }
    return {
      currentStage,
      clearedStages,
      maxStage: MAX_MINIGAME_STAGE,
      isMaxed: clearedStages >= MAX_MINIGAME_STAGE,
    };
  }

  public getTotalTowerClearedStages(): { cleared: number; total: number } {
    const kinds: MinigameTrialKind[] = ['match3', 'caro', 'sudoku', 'chess', 'blocks'];
    let cleared = 0;
    for (const k of kinds) {
      cleared += this.getDisciplineStageInfo(k).clearedStages;
    }
    return { cleared, total: TOTAL_MINIGAME_STAGES };
  }

  public getWinsProgressForCurrentLevel(): { current: number; required: number } {
    if (this.state.level >= MAX_LEVEL) {
      const reqMax = getWinsRequiredForNextLevel(MAX_LEVEL - 1);
      return { current: reqMax, required: reqMax };
    }
    const required = getWinsRequiredForNextLevel(this.state.level);
    const current = Math.max(
      0,
      Math.min(required, Math.round(this.state.puzzleLevelWinsProgress ?? 0))
    );
    return { current, required };
  }

  public getRequiredLevelTrial(): LevelTrialRequirement | null {
    if (this.state.level >= MAX_LEVEL) return null;
    const maxedKinds = new Set<MinigameTrialKind>();
    for (const k of ['match3', 'caro', 'sudoku', 'chess', 'blocks'] as const) {
      if (this.getDisciplineStageInfo(k).isMaxed) {
        maxedKinds.add(k);
      }
    }
    return getLevelTrialRequirement(this.state.level, maxedKinds);
  }

  public isCurrentLevelTrialPassed(): boolean {
    return this.state.level >= MAX_LEVEL || this.state.sandboxMode || this.isHeadmasterPreview;
  }

  public isWaitingOnLevelTrial(): boolean {
    return false;
  }

  /**
   * Vòng lặp Tháp Giải Đố 5×777 Màn (200+ giờ):
   * Thắng màn mới (1..777) của bất kỳ môn giải đố nào sẽ tích lũy tiến trình Cấp Giải Đố Tổng (3.435 trận -> Cấp 100),
   * mở khóa bản vẽ công trình, cây trồng & vùng đất mới!
   * Nếu chơi lại Màn 777 đã phá đảo (countWinProgress = false), chỉ cộng thống kê & nhiệm vụ, không cày vô hạn Cấp.
   */
  private advanceMasterPuzzleLevel(
    modeOrKind: MinigameTrialKind,
    countWinProgress = true
  ): {
    leveledUp: boolean;
    newLevel: number;
    wasFeatured: boolean;
  } {
    const req = this.getRequiredLevelTrial();
    const wasFeatured = Boolean(
      countWinProgress &&
        req &&
        req.kind === modeOrKind &&
        !this.state.sandboxMode &&
        !this.isHeadmasterPreview
    );

    this.state.stats.minigamesWon = (this.state.stats.minigamesWon ?? 0) + 1;
    this.recordQuestProgress('win_minigame', modeOrKind, 1);

    if (!countWinProgress || this.state.level >= MAX_LEVEL || this.isHeadmasterPreview) {
      return { leveledUp: false, newLevel: this.state.level, wasFeatured };
    }

    let wins = Math.max(0, Math.round(this.state.puzzleLevelWinsProgress ?? 0)) + 1;
    let leveledUp = false;
    while (this.state.level < MAX_LEVEL) {
      const reqWins = getWinsRequiredForNextLevel(this.state.level);
      if (wins < reqWins) break;
      wins -= reqWins;
      this.state.level += 1;
      this.state.levelUpTrialCompletedLevel = this.state.level;
      const info = getLevelInfo(this.state.level);
      this.state.galleons += info.rewardGalleons;
      this.state.timeSand += info.rewardTimeSand;
      this.recordQuestProgress('reach_level', undefined, this.state.level);
      leveledUp = true;
    }
    this.state.puzzleLevelWinsProgress = this.state.level >= MAX_LEVEL ? 0 : wins;
    if (leveledUp) {
      this.syncValleyVillagers();
      this.onLevelUp?.(this.state.level);
    }

    return { leveledUp, newLevel: this.state.level, wasFeatured };
  }

  public tryAdvancePendingLevels(_silentGateToast = false): boolean {
    return false;
  }

  /**
   * XP Điền Trang (từ thu hoạch nông sản, làm bánh, Đơn Hàng Cú, Quiz ngôn ngữ) tích lũy vào
   * Rương Mùa Gặt Điền Trang (mỗi 200 XP tặng ngay +65 🪙 Galleon + 1 ⏳ Cát Thời Gian + định kỳ Bùa Trợ Lực),
   * hoàn toàn không thay thế Cấp Giải Đố Tổng để giữ đúng vòng lặp cày Mini-game mở khóa Nhà!
   */
  public addXp(amount: number): void {
    if (amount <= 0) return;
    const prevTier = Math.floor(Math.max(0, this.state.xp) / FARM_HARVEST_CHEST_XP);
    this.state.xp += amount;
    const nextTier = Math.floor(Math.max(0, this.state.xp) / FARM_HARVEST_CHEST_XP);
    const chestsEarned = nextTier - prevTier;
    if (chestsEarned > 0 && !this.state.sandboxMode && !this.isHeadmasterPreview) {
      const bonusGold = chestsEarned * 65;
      const bonusSand = chestsEarned;
      this.state.galleons += bonusGold;
      this.state.finance.harvestRevenue += bonusGold;
      this.state.timeSand += bonusSand;
      let boosterGiftTag = '';
      if (nextTier % 3 === 0 && this.state.match3) {
        const cycle: Match3BoosterId[] = ['reparo_hammer', 'row_col_cannon', 'alohomora_shuffle'];
        const pick = cycle[nextTier % cycle.length];
        this.state.match3.boosters[pick] = (this.state.match3.boosters[pick] ?? 0) + 1;
        const bMeta = MATCH3_BOOSTERS.find((b) => b.id === pick);
        if (bMeta) boosterGiftTag = ` +1 ${bMeta.emoji} ${bMeta.shortLabel}`;
      }
      this.onRewardFly?.('galleons', bonusGold);
      this.onRewardFly?.('sand', bonusSand);
      this.onToast?.(
        `🎁 Rương Mùa Gặt Điền Trang! Nhận +${bonusGold}G +${bonusSand} ⏳ Cát${boosterGiftTag} hỗ trợ Giải Đố!`,
        '🎁'
      );
      this.saveToStorage();
    }
  }

  public getActiveStoryQuest(): QuestDef | null {
    const raw = STORY_QUESTS[this.state.storyQuestIndex];
    if (!raw) return null;
    const progress = this.computeObjectiveSnapshot(raw.objectiveType, raw.targetId, raw.id, true);
    return {
      ...raw,
      progress,
      completed: progress >= raw.targetAmount,
      claimed: false,
    };
  }

  private computeObjectiveSnapshot(
    type: QuestObjectiveType,
    targetId: string | undefined,
    questId: string,
    isStory: boolean
  ): number {
    if (type === 'build_item' && targetId) {
      return this.state.buildings.filter((b) => b.itemId === targetId).length;
    }
    if (type === 'unlock_zone' && targetId) {
      return this.state.unlockedZones.includes(targetId as ZoneId) ? 1 : 0;
    }
    if (type === 'reach_level') {
      return this.state.level;
    }
    if (isStory) {
      const tracked = this.state.storyQuestProgress[questId] ?? 0;
      if (type === 'place_paths') return Math.max(tracked, this.state.stats.pathsPlaced);
      if (type === 'serve_butterbeer') return Math.max(tracked, this.state.stats.butterbeerServed);
      if (type === 'sell_wands') return Math.max(tracked, this.state.stats.wandsSold);
      if (type === 'cast_spells') return Math.max(tracked, this.state.stats.spellsCastByGuests);
      if (type === 'feed_creatures') return Math.max(tracked, this.state.stats.creaturesFed);
      if (type === 'upgrade_star') return Math.max(tracked, this.state.stats.starUpgradesDone);
      if (type === 'harvest_galleons') return Math.max(tracked, this.state.stats.totalGalleonsHarvested);
      if (type === 'win_minigame' && !targetId) return Math.max(tracked, this.state.stats.minigamesWon ?? 0);
      return tracked;
    }
    return 0;
  }

  public recordQuestProgress(type: QuestObjectiveType, targetId: string | undefined, delta: number): void {
    const storyRaw = STORY_QUESTS[this.state.storyQuestIndex];
    if (storyRaw && storyRaw.objectiveType === type) {
      if (!storyRaw.targetId || storyRaw.targetId === targetId) {
        this.state.storyQuestProgress[storyRaw.id] =
          (this.state.storyQuestProgress[storyRaw.id] ?? 0) + delta;
      }
    }

    for (const q of [...this.state.owlQuests, ...this.state.dailyQuests]) {
      if (q.claimed) continue;
      if (q.objectiveType === type && (!q.targetId || q.targetId === targetId)) {
        q.progress = Math.min(q.targetAmount, q.progress + delta);
        if (q.progress >= q.targetAmount) {
          q.completed = true;
        }
      }
    }
  }

  public claimQuest(questId: string): boolean {
    const story = this.getActiveStoryQuest();
    if (story && story.id === questId && story.completed) {
      this.state.galleons += story.rewardGalleons;
      this.state.timeSand += story.rewardTimeSand;
      this.state.storyClaimedIds.push(story.id);
      this.state.storyQuestIndex += 1;
      this.addXp(story.rewardXp);
      this.audio.playLevelUp();
      this.onRewardFly?.('galleons', story.rewardGalleons);
      if (story.rewardTimeSand > 0) this.onRewardFly?.('sand', story.rewardTimeSand);
      this.onToast?.(
        `Hoàn thành ${story.title}! Nhận +${story.rewardGalleons}G & +${story.rewardXp} XP!`,
        '🦉'
      );
      this.saveToStorage();
      this.onUiChange?.();
      return true;
    }

    const owlIdx = this.state.owlQuests.findIndex((q) => q.id === questId && q.completed && !q.claimed);
    if (owlIdx !== -1) {
      const q = this.state.owlQuests[owlIdx];
      q.claimed = true;
      this.state.galleons += q.rewardGalleons;
      this.state.timeSand += q.rewardTimeSand;
      this.addXp(q.rewardXp);
      this.owlSeedCounter++;
      this.state.owlQuests[owlIdx] = createOwlOrderQuest(this.state.level, this.owlSeedCounter);
      this.audio.playHarvestBubble();
      this.onRewardFly?.('galleons', q.rewardGalleons);
      if (q.rewardTimeSand > 0) this.onRewardFly?.('sand', q.rewardTimeSand);
      this.onToast?.(`Đã giao thư Cú! +${q.rewardGalleons}G & +${q.rewardXp} XP`, '✉️');
      this.saveToStorage();
      this.onUiChange?.();
      return true;
    }

    const daily = this.state.dailyQuests.find((q) => q.id === questId && q.completed && !q.claimed);
    if (daily) {
      daily.claimed = true;
      this.state.galleons += daily.rewardGalleons;
      this.state.timeSand += daily.rewardTimeSand;
      this.addXp(daily.rewardXp);
      this.audio.playSpell();
      this.onRewardFly?.('galleons', daily.rewardGalleons);
      if (daily.rewardTimeSand > 0) this.onRewardFly?.('sand', daily.rewardTimeSand);
      this.onToast?.(`Nhận thưởng Nhiệm Vụ Hàng Ngày! +${daily.rewardGalleons}G`, '📰');
      this.saveToStorage();
      this.onUiChange?.();
      return true;
    }

    return false;
  }

  public hireStaff(role: keyof GameState['staffHired']): boolean {
    if (this.state.staffHired[role] >= MAX_STAFF_PER_ROLE) {
      this.onToast?.(`Đã tuyển tối đa ${MAX_STAFF_PER_ROLE}/${MAX_STAFF_PER_ROLE} nhân sự cho vị trí này!`, '🧙');
      return false;
    }
    const costs: Record<keyof GameState['staffHired'], number> = {
      caretaker: 90,
      artificer: 140,
      magizoologist: 220,
      auror: 320,
      house_elf: 480,
    };
    const cost = costs[role] * (1 + this.state.staffHired[role]);
    if (!this.state.sandboxMode && this.state.galleons < cost) {
      this.onToast?.(`Cần ${cost} Galleon để tuyển thêm nhân sự này!`, '🧙');
      return false;
    }
    if (!this.state.sandboxMode) {
      this.state.galleons -= cost;
      this.state.finance.staffWagesPaid += Math.round(cost * 0.25);
    }
    this.state.staffHired[role] += 1;
    this.syncStaffEntities();
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public getHourlyStaffWage(): number {
    const s = this.state.staffHired;
    return s.caretaker * 4 + s.artificer * 6 + s.magizoologist * 9 + s.auror * 12 + s.house_elf * 3;
  }

  public syncStaffEntities(): void {
    if (this.isVisitingNeighbor) {
      this.staff = [];
      return;
    }
    const roles: Array<{ role: StaffEntity['role']; label: string; count: number; maxCap: number }> = [
      { role: 'caretaker', label: 'Lao Công Phép Thuật', count: this.state.staffHired.caretaker, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'artificer', label: 'Phù Thủy Bảo Trì', count: this.state.staffHired.artificer, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'magizoologist', label: 'Nhà Sinh Vật Học', count: this.state.staffHired.magizoologist, maxCap: MAX_STAFF_PER_ROLE },
      { role: 'auror', label: 'Thần Sáng Bảo An', count: this.state.staffHired.auror, maxCap: MAX_STAFF_PER_ROLE },
      {
        role: 'house_elf',
        label: 'Gia Tinh Tình Nguyện',
        count:
          this.state.staffHired.house_elf +
          this.state.buildings.filter((b) => b.itemId === 'owlery_elf_hut').length,
        maxCap: MAX_STAFF_PER_ROLE + 4,
      },
    ];

    const nextStaff: StaffEntity[] = [];
    for (const r of roles) {
      for (let i = 0; i < Math.min(r.count, r.maxCap); i++) {
        const sid = `${r.role}_${i}`;
        const patrolZoneId = this.state.staffPatrolZones?.[sid] ?? 'all';
        const existing = this.staff.find((s) => s.id === sid);
        if (existing) {
          existing.patrolZoneId = patrolZoneId;
          nextStaff.push(existing);
        } else {
          const isMolly = r.role === 'caretaker' && i === 0;
          const isArthur = r.role === 'artificer' && i === 0;
          const isHagrid = r.role === 'magizoologist' && i === 0;
          nextStaff.push({
            id: sid,
            role: r.role,
            name: isMolly
              ? 'Bà Molly Weasley'
              : isArthur
                ? 'Ông Arthur Weasley'
                : isHagrid
                  ? 'Bác Rubeus Hagrid'
                  : `${r.label} #${i + 1}`,
            gx: isMolly ? 13.4 : isArthur ? 14.6 : isHagrid ? 23.4 : 13 + (i % 3),
            gy: isMolly ? 23.5 : isArthur ? 22.9 : isHagrid ? 18.2 : 22,
            targetGx: isMolly ? 13.4 : isArthur ? 14.6 : isHagrid ? 23.4 : 14,
            targetGy: isMolly ? 23.5 : isArthur ? 22.9 : isHagrid ? 18.2 : 22,
            facing: isHagrid ? 'sw' : 'se',
            actionText: isMolly
              ? 'Đang nướng bánh táo & đan áo len'
              : isArthur
                ? 'Đang tinh chỉnh chiếc Ford Anglia'
                : isHagrid
                  ? 'Đang chăm vườn thảo dược & bí ngô'
                  : 'Đang tuần tra trang trại',
            busyTimer: 1.5,
            patrolZoneId,
            patrolCenter: isMolly
              ? { gx: 13.4, gy: 23.5, radius: 0.35 }
              : isArthur
                ? { gx: 14.6, gy: 22.9, radius: 0.35 }
                : isHagrid
                  ? { gx: 23.4, gy: 18.2, radius: 0.38 }
                  : undefined,
          });
        }
      }
    }
    const ronZoneId = this.state.staffPatrolZones?.['ron_gnome_burrow'] ?? 'all';
    const existingRon = this.staff.find((s) => s.id === 'ron_gnome_burrow');
    if (existingRon) {
      existingRon.patrolZoneId = ronZoneId;
      nextStaff.push(existingRon);
    } else {
      nextStaff.push({
        id: 'ron_gnome_burrow',
        role: 'caretaker',
        name: 'Ron Weasley',
        gx: 17.1,
        gy: 23.8,
        targetGx: 17.5,
        targetGy: 23.5,
        facing: 'se',
        actionText: 'Đang chăm sóc vườn bí ngô & đàn gà Hang Sóc',
        busyTimer: 1.5,
        patrolZoneId: ronZoneId,
        patrolCenter: { gx: 17.2, gy: 23.7, radius: 0.45 },
      });
    }

    this.staff = nextStaff;
  }

  public setStaffPatrolZone(staffId: string, zone: ZoneId | 'all'): void {
    this.state.staffPatrolZones[staffId] = zone;
    const st = this.staff.find((s) => s.id === staffId);
    if (st) st.patrolZoneId = zone;
    this.saveToStorage();
    this.onUiChange?.();
  }

  public repairBuilding(uid: string, byStaffName?: string): boolean {
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return false;
    const it = getCatalogItem(b.itemId);
    b.durability = 100;
    b.isBrokenDown = false;
    b.breakdownReason = undefined;
    this.state.stats.repairsDone = (this.state.stats.repairsDone ?? 0) + 1;
    this.addXp(10);
    this.audio.playSpell();
    this.spawnFloatingText(b.gx + 1, b.gy + 1, '🪄 Reparo! 100%', '#67e8f9');
    if (byStaffName) {
      this.onToast?.(`🔧 ${byStaffName} vừa niệm Reparo sửa xong ${it?.name ?? 'trò chơi'}!`, '🪄');
    } else {
      this.onToast?.(`🪄 Đã niệm Reparo khôi phục 100% độ bền cho ${it?.name ?? 'công trình'}!`, '✨');
    }
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public dropPickedEntity(
    kind: 'staff',
    id: string,
    gx: number,
    gy: number
  ): boolean {
    const clampedX = Math.max(0, Math.min(GRID_SIZE - 1, gx));
    const clampedY = Math.max(0, Math.min(GRID_SIZE - 1, gy));
    if (kind === 'staff') {
      const s = this.staff.find((x) => x.id === id);
      if (!s) return false;
      s.gx = clampedX + 0.5;
      s.gy = clampedY + 0.5;
      s.targetGx = clampedX + 0.5;
      s.targetGy = clampedY + 0.5;
      s.busyTimer = 0;

      // Context-sensitive instant RCT Pincer action!
      const cell = this.grid[clampedY]?.[clampedX];
      if (s.role === 'caretaker') {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const c = this.grid[clampedY + dy]?.[clampedX + dx];
            if (c?.hasLitter) {
              c.hasLitter = false;
              const k = `${clampedX + dx},${clampedY + dy}`;
              if (this.state.tileOverrides[k]) this.state.tileOverrides[k].hasLitter = false;
              s.actionText = 'Vừa dọn sạch vũng bùa lỗi tại điểm thả!';
            }
          }
        }
      } else if (s.role === 'artificer') {
        const nearRide = this.state.buildings.find(
          (b) => (b.isBrokenDown || b.durability < 95) && Math.hypot(b.gx + 1 - clampedX, b.gy + 1 - clampedY) <= 3.5
        );
        if (nearRide) {
          this.repairBuilding(nearRide.uid, s.name);
          s.actionText = 'Vừa sửa chữa ngay khi được gắp tới!';
        }
      } else if (s.role === 'auror' && this.escapedCreatures.length > 0) {
        const nearEsc = this.escapedCreatures.find(
          (e) => Math.hypot(e.gx - clampedX, e.gy - clampedY) <= 3.5
        );
        if (nearEsc) {
          this.catchEscapedCreature(nearEsc.id);
          s.actionText = 'Vừa tóm gọn thú sổng chuồng!';
        }
      } else if (s.role === 'magizoologist') {
        const nearHab = this.state.buildings.find(
          (b) =>
            getCatalogItem(b.itemId)?.isCreatureHabitat &&
            Math.hypot(b.gx + 1 - clampedX, b.gy + 1 - clampedY) <= 3.5
        );
        if (nearHab) {
          nearHab.creatureHunger = 100;
          nearHab.creatureHappiness = 100;
          s.actionText = 'Vừa bồi bổ thức ăn cho chuồng thú!';
        }
      } else if (s.role === 'house_elf' && cell?.buildingUid) {
        this.harvestBuildingBubble(cell.buildingUid);
      }

      this.audio.playPlace();
      this.spawnFloatingText(clampedX + 0.5, clampedY + 0.5, `🤏 Đã thả ${s.name}!`, '#fde047');
      this.onUiChange?.();
      return true;
    }
    return false;
  }

  // ==================== HỆ THỐNG #4: XƯỞNG CHẾ BIẾN & TÀU HÀNG TỐC HÀNH ====================

  public getBrewDurationSec(recipe: CraftRecipeDef): number {
    const hasWorkshop = this.state.buildings.some(
      (b) => getCatalogItem(b.itemId)?.isWorkshopBrewery && Date.now() >= b.constructEndsAt
    );
    const hasSynergy = this.activeSynergies.activeIds.has('combo_herb_brewery');
    let sec = recipe.brewSec;
    if (hasWorkshop) sec *= 0.55;
    if (hasSynergy) sec *= 0.78;
    return Math.max(4, Math.round(sec));
  }

  public quickHarvestHerbs(): { ok: boolean; msg: string } {
    const now = Date.now();
    const waitMs = 20_000;
    const elapsed = now - (this.state.supply.lastHerbPlotHarvestAt || 0);
    if (!this.state.sandboxMode && elapsed < waitMs) {
      const left = Math.ceil((waitMs - elapsed) / 1000);
      return { ok: false, msg: `Luống thảo dược đang mọc mầm mới (${left}s nữa)!` };
    }
    this.state.supply.lastHerbPlotHarvestAt = now;
    const bonus = this.state.buildings.some(
      (b) => b.itemId === 'burrow_greenhouse_canon' && now >= b.constructEndsAt
    )
      ? 2
      : 1;
    this.state.supply.ingredients.mandrake_leaf = Math.min(
      99,
      (this.state.supply.ingredients.mandrake_leaf ?? 0) + 2 * bonus
    );
    this.state.supply.ingredients.sweet_pumpkin = Math.min(
      99,
      (this.state.supply.ingredients.sweet_pumpkin ?? 0) + 2 * bonus
    );
    this.state.supply.ingredients.starlight_dust = Math.min(
      99,
      (this.state.supply.ingredients.starlight_dust ?? 0) + 1 * bonus
    );
    this.state.supply.ingredients.magic_cacao = Math.min(
      99,
      (this.state.supply.ingredients.magic_cacao ?? 0) + 1 * bonus
    );
    this.addXp(14);
    this.audio.playHarvestBubble();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🌿 Đã thu hoạch rổ Thảo Dược tươi (+${2 * bonus}🌿 +${2 * bonus}🎃 +${bonus}✨ +${bonus}🍫)!`,
    };
  }

  public startBrewing(goodId: CraftedGoodId): { ok: boolean; msg: string } {
    if (this.state.supply.activeBrew) {
      return { ok: false, msg: 'Vạc phép thuật đang bận ủ mẻ hiện tại!' };
    }
    const recipe = CRAFT_RECIPES.find((r) => r.id === goodId);
    if (!recipe) return { ok: false, msg: 'Không tìm thấy công thức' };

    if (!this.state.sandboxMode) {
      for (const [ingKey, reqQty] of Object.entries(recipe.inputs)) {
        const k = ingKey as keyof GameState['supply']['ingredients'];
        if ((this.state.supply.ingredients[k] ?? 0) < (reqQty ?? 0)) {
          return {
            ok: false,
            msg: `Thiếu ${RAW_INGREDIENTS_INFO[k].emoji} ${RAW_INGREDIENTS_INFO[k].name}!`,
          };
        }
      }
      for (const [ingKey, reqQty] of Object.entries(recipe.inputs)) {
        const k = ingKey as keyof GameState['supply']['ingredients'];
        this.state.supply.ingredients[k] -= reqQty ?? 0;
      }
    }

    const durSec = this.state.sandboxMode ? 1 : this.getBrewDurationSec(recipe);
    this.state.supply.activeBrew = {
      goodId,
      endsAt: Date.now() + durSec * 1000,
    };
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `🧪 Bắt đầu ủ ${recipe.name} (${durSec}s)!` };
  }

  public speedUpBrewing(): boolean {
    if (!this.state.supply.activeBrew) return false;
    if (!this.state.sandboxMode && this.state.timeSand < 1) {
      this.onToast?.('Cần 1 ⏳ Cát Xoay Thời Gian để hoàn tất mẻ ủ ngay lập tức!', '⏳');
      return false;
    }
    if (!this.state.sandboxMode) this.state.timeSand -= 1;
    this.state.supply.activeBrew.endsAt = Date.now() - 1;
    this.tickProductionToTimestamp(Date.now());
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public useCraftedGood(goodId: CraftedGoodId): { ok: boolean; msg: string } {
    if ((this.state.supply.goods[goodId] ?? 0) < 1 && !this.state.sandboxMode) {
      return { ok: false, msg: 'Chưa có thành phẩm trong kho — hãy nấu ở Vạc Chế Biến trước nhé!' };
    }
    if (!this.state.sandboxMode) {
      this.state.supply.goods[goodId] -= 1;
    }
    const now = Date.now();
    let msg = '';
    if (goodId === 'aged_butterbeer') {
      this.state.supply.butterbeerBoostEndsAt =
        Math.max(now, this.state.supply.butterbeerBoostEndsAt || 0) + 240_000;
      if (this.state.match3) {
        this.state.match3.hearts = MAX_MATCH3_HEARTS;
        this.state.match3.nextHeartAt = 0;
      }
      msg = '🍻 Đã cấp Thùng Bia Bơ Ủ Tuyết: +85% doanh thu Cửa Tiệm (4p) & hồi đầy 5 ❤️ Tim Bùa Gặt Honeydukes!';
    } else if (goodId === 'felix_potion') {
      this.state.supply.felixBoostEndsAt =
        Math.max(now, this.state.supply.felixBoostEndsAt || 0) + 240_000;
      msg = '✨ Phúc Lạc Dược phát huy: +35% Sao XP toàn trang trại trong 4 phút!';
    } else if (goodId === 'golden_choc_box') {
      const gold = Math.round(180 + this.state.level * 35);
      this.state.galleons += gold;
      this.state.finance.shopRevenue += gold;
      this.addXp(65);
      msg = `🎁 Mở Hộp Quà Hoàng Kim nhận +${gold} Galleon & +65 XP!`;
    } else if (goodId === 'dragon_firework') {
      this.launchFireworksShow(12);
      for (const h of HOUSES) this.awardHousePoints(h, 15);
      msg = '🎆 ĐẠI TIỆC PHÁO HOA RỒNG LỬA RỰC SÁNG BẦU TRỜI (+15 Điểm mỗi Nhà & Khách cực vui)!';
    }
    this.audio.playLevelUp();
    this.onToast?.(msg, '✨');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public fulfillCargoCrate(crateId: string): { ok: boolean; msg: string } {
    const crate = this.state.supply.cargoCrates.find((c) => c.id === crateId);
    if (!crate || crate.fulfilled) {
      return { ok: false, msg: 'Kiện hàng này đã đóng xong rồi!' };
    }
    if (!this.state.sandboxMode && (this.state.supply.goods[crate.goodId] ?? 0) < crate.qtyRequired) {
      return { ok: false, msg: 'Chưa đủ thành phẩm yêu cầu trong kho Xưởng!' };
    }
    if (!this.state.sandboxMode) {
      this.state.supply.goods[crate.goodId] -= crate.qtyRequired;
    }
    crate.fulfilled = true;
    this.state.galleons += crate.rewardGalleons;
    this.state.finance.harvestRevenue += crate.rewardGalleons;
    this.state.timeSand += crate.rewardTimeSand;
    this.addXp(crate.rewardXp);
    this.recordQuestProgress('harvest_galleons', undefined, crate.rewardGalleons);
    this.audio.playHarvestBubble();

    const allDone = this.state.supply.cargoCrates.every((c) => c.fulfilled);
    if (allDone) {
      const bonusG = Math.round(240 + this.state.level * 40);
      const bonusXp = Math.round(160 + this.state.level * 25);
      this.state.galleons += bonusG;
      this.state.timeSand += 2;
      this.addXp(bonusXp);
      this.state.stats.cargoTrainsSent = (this.state.stats.cargoTrainsSent ?? 0) + 1;
      this.state.supply.cargoTrainIndex += 1;
      this.state.supply.cargoCrates = createCargoCrates(
        this.state.level,
        this.state.supply.cargoTrainIndex
      );
      this.audio.playTrainWhistle();
      this.launchFireworksShow(6);
      const msg = `🚂 Tuuu!! Tàu Hàng Tốc Hành xuất bến! Thưởng trọn chuyến +${bonusG}G, +${bonusXp} XP & +2⏳ Cát Thời Gian!`;
      this.onToast?.(msg, '🚂');
      this.saveToStorage();
      this.onUiChange?.();
      return { ok: true, msg };
    }

    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `📦 Đã chất kiện hàng lên tàu (+${crate.rewardGalleons}G, +${crate.rewardXp} XP, +${crate.rewardTimeSand}⏳)!`,
    };
  }

  // ==================== HỆ THỐNG #5: PHÁO HOA BẦU TRỜI & KHÁCH VIP NHẬT BÁO TIÊN TRI ====================

  public launchFireworksShow(burstCount = 8): void {
    const launchers = this.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFireworksLauncher && Date.now() >= b.constructEndsAt
    );
    for (let i = 0; i < burstCount; i++) {
      const anchor =
        launchers.length > 0
          ? launchers[i % launchers.length]
          : this.state.buildings[i % Math.max(1, this.state.buildings.length)];
      const gx = (anchor ? anchor.gx + 1 : 10) + (Math.random() - 0.5) * 6;
      const gy = (anchor ? anchor.gy + 1 : 16) + (Math.random() - 0.5) * 6;
      this.fireworks.push({
        id: `fw_${Date.now()}_${i}_${Math.random()}`,
        gx,
        gy,
        zHeight: 55 + Math.random() * 55,
        color: FIREWORK_COLORS[i % FIREWORK_COLORS.length],
        life: -i * 0.18, // Staggered burst sequence!
        maxLife: 1.9 + Math.random() * 0.6,
      });
    }
    this.audio.playSpell();
  }

  public spawnFloatingText(gx: number, gy: number, text: string, color: string): void {
    this.effects.push({
      id: `fx_${Math.random()}`,
      gx,
      gy,
      text,
      color,
      life: 0,
      maxLife: 1.65,
    });
  }

  public getParkWonderScore(): number {
    let sum = 4.0;
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it || Date.now() < b.constructEndsAt) continue;
      if (it.isBackstage) {
        const sh = this.backstageCache.get(b.uid);
        sum += sh?.isShielded ? 0.15 : -0.35;
      } else {
        const morphWonder = it.isCreatureHabitat ? MORPH_INFO[b.creatureMorph ?? 'normal'].wonderBonus : 0;
        const bondWonder = it.isCreatureHabitat ? ((b.creatureBondLevel ?? 1) - 1) * 0.08 : 0;
        sum += (it.wonder + morphWonder + bondWonder) * 0.08 * b.stars;
      }
    }
    const restoredBonus = (this.state.puzzleArcade?.restoredPaintings?.length ?? 0) * 0.05;
    return Math.max(1.0, Math.min(5.0, Math.round((sum + restoredBonus) * 10) / 10));
  }

  public update(dt: number): void {
    const clampedDt = Math.min(0.1, dt) * this.simSpeed;
    const now = Date.now();

    this.tickProductionToTimestamp(now);

    this.autoSaveAcc += clampedDt;
    if (this.autoSaveAcc >= 15) {
      this.autoSaveAcc = 0;
      this.checkDailyReset(new Date(now));
      this.saveToStorage();
      this.onUiChange?.();
    }

    this.socialSimAcc += clampedDt;
    if (this.socialSimAcc >= 3) {
      this.socialSimAcc = 0;
      this.tickNeighborSocialBackground(now);
    }

    // Periodic gentle staff wage accounting every 45s
    this.wageTickAcc += clampedDt;
    if (this.wageTickAcc >= 45) {
      this.wageTickAcc = 0;
      const wage = this.getHourlyStaffWage();
      if (!this.state.sandboxMode && this.state.galleons > wage * 3) {
        this.state.galleons -= wage;
      }
      this.state.finance.staffWagesPaid += wage;
    }

    const unlockedSet = new Set(this.state.unlockedZones);

    // Update Contraption Wear & Breakdowns!
    this.updateRideQueues(clampedDt, now);

    // Automatic nighttime fireworks when Fireworks Pavilion is built!
    const period = this.getRealTimePeriod();
    if (period === 'dusk' || period === 'night') {
      const hasPavilion = this.state.buildings.some(
        (b) => getCatalogItem(b.itemId)?.isFireworksLauncher && now >= b.constructEndsAt
      );
      if (hasPavilion) {
        this.nightFireworkAcc += clampedDt;
        if (this.nightFireworkAcc >= 3.2) {
          this.nightFireworkAcc = 0;
          this.launchFireworksShow(2);
        }
      }
    }

    // Creature hunger (slowed down if a Creature Feeder is nearby; rural farmstead coops/pastures are auto-tended!)
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it || !it.isCreatureHabitat || now < b.constructEndsAt || b.isEscaped) continue;
      if (it.isRuralFarmstead) {
        b.creatureHunger = 96;
        b.creatureHappiness = 98;
        continue;
      }
      const bio = this.biomeCache.get(b.uid);
      const decayRate = bio?.hasFeeder ? 0.08 : 0.18;
      b.creatureHunger = Math.max(5, (b.creatureHunger ?? 90) - clampedDt * decayRate);
      if (it.canEscape && (b.creatureHunger ?? 90) < 16 && this.escapedCreatures.length < 2) {
        if (Math.random() < clampedDt * 0.08) {
          this.spawnEscapedFromHabitat(b);
        }
      }
    }

    for (const esc of this.escapedCreatures) {
      esc.gx += esc.vx * clampedDt;
      esc.gy += esc.vy * clampedDt;
      const cell = this.grid[Math.floor(esc.gy)]?.[Math.floor(esc.gx)];
      if (!cell || !unlockedSet.has(cell.zoneId) || Math.random() < 0.03) {
        const spot = getRandomUnlockedPathTile(this.grid, unlockedSet);
        if (spot) {
          const angle = Math.atan2(spot.gy - esc.gy, spot.gx - esc.gx);
          esc.vx = Math.cos(angle) * 1.35;
          esc.vy = Math.sin(angle) * 1.35;
        } else {
          esc.vx *= -1;
          esc.vy *= -1;
        }
      }
      if (Math.random() < clampedDt * 0.35) {
        esc.stolenCoins += 1;
      }
    }

    this.updateStaff(clampedDt, unlockedSet);
    this.updateValleyVillagers(clampedDt, unlockedSet);

    for (let i = this.effects.length - 1; i >= 0; i--) {
      this.effects[i].life += clampedDt;
      if (this.effects[i].life >= this.effects[i].maxLife) {
        this.effects.splice(i, 1);
      }
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.fireworks[i].life += clampedDt;
      if (this.fireworks[i].life >= this.fireworks[i].maxLife) {
        this.fireworks.splice(i, 1);
      }
    }
  }

  private updateRideQueues(dt: number, now: number): void {
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (
        !it ||
        it.category !== 'ride' ||
        it.isThemeParkLegacy ||
        it.isCoasterTrackPiece ||
        it.isFlooPortal
      ) {
        continue;
      }
      if (now < b.constructEndsAt) continue;

      // Gentle ambient wear & playful breakdown check!
      if (!b.isBrokenDown) {
        b.durability = Math.max(15, (b.durability ?? 100) - dt * 0.14);
        if (b.durability <= 22) {
          b.isBrokenDown = true;
          b.breakdownReason =
            PLAYFUL_BREAKDOWNS[Math.floor(Math.random() * PLAYFUL_BREAKDOWNS.length)];
          this.spawnFloatingText(b.gx + 1, b.gy + 1, '⚙️ Cần Reparo!', '#c084fc');
          if (!this.isHeadmasterPreview) {
            this.onToast?.(
              `🔧 ${it.name} tạm dừng: "${b.breakdownReason}" — Phù Thủy Bảo Trì đang tới hoặc bấm Reparo!`,
              '🪄'
            );
          }
          this.onUiChange?.();
        }
      }
    }
  }

  private updateStaff(dt: number, unlockedSet: Set<string>): void {
    const hasBackstageBoost = this.state.buildings.some(
      (b) => Boolean(getCatalogItem(b.itemId)?.isBackstage) && Date.now() >= b.constructEndsAt
    );
    const staffSpeed = hasBackstageBoost ? 2.15 : 1.72;

    for (const s of this.staff) {
      const patrolZone = this.state.staffPatrolZones?.[s.id] ?? s.patrolZoneId ?? 'all';
      const inPatrol = (gx: number, gy: number): boolean =>
        patrolZone === 'all' ||
        getZoneAt(Math.max(0, Math.floor(gx)), Math.max(0, Math.floor(gy))).id === patrolZone;

      const dist = Math.hypot(s.targetGx - s.gx, s.targetGy - s.gy);
      if (dist > 0.15) {
        const dx = s.targetGx - s.gx;
        const dy = s.targetGy - s.gy;
        s.facing = s.patrolCenter ? s.facing : deltaToFacing(dx, dy, s.facing);
        const curSpd = s.patrolCenter ? 0.28 : staffSpeed;
        s.gx += (dx / dist) * curSpd * dt;
        s.gy += (dy / dist) * curSpd * dt;
        continue;
      }

      if (s.busyTimer > 0) {
        s.busyTimer -= dt;
        continue;
      }
      if (s.patrolCenter) {
        s.busyTimer = 3.2;
        s.targetGx = s.patrolCenter.gx + (Math.random() - 0.5) * s.patrolCenter.radius * 1.4;
        s.targetGy = s.patrolCenter.gy + (Math.random() - 0.5) * s.patrolCenter.radius * 1.4;
        continue;
      }
      s.busyTimer = 1.9;

      // 1. Auror: catch escaped creatures!
      if (s.role === 'auror' && this.escapedCreatures.length > 0) {
        const targetEsc =
          this.escapedCreatures.find((e) => inPatrol(e.gx, e.gy)) ?? this.escapedCreatures[0];
        if (Math.hypot(targetEsc.gx - s.gx, targetEsc.gy - s.gy) < 1.9) {
          this.catchEscapedCreature(targetEsc.id);
          s.actionText = 'Vừa bắt thú sổng chuồng!';
        } else {
          s.targetGx = targetEsc.gx;
          s.targetGy = targetEsc.gy;
          s.actionText = `Đang đuổi bắt ${targetEsc.name}!`;
        }
        continue;
      }

      // 2. Artificer: repair broken or worn contraptions!
      if (s.role === 'artificer') {
        const brokenList = this.state.buildings.filter((b) => {
          const it = getCatalogItem(b.itemId);
          return (
            it?.category === 'ride' &&
            !it.isCoasterTrackPiece &&
            Date.now() >= b.constructEndsAt &&
            (b.isBrokenDown || (b.durability ?? 100) < 68)
          );
        });
        brokenList.sort((a, b) => Number(Boolean(b.isBrokenDown)) - Number(Boolean(a.isBrokenDown)) || a.durability - b.durability);
        const targetRide =
          brokenList.find((b) => inPatrol(b.gx, b.gy)) ?? brokenList[0];
        if (targetRide) {
          if (Math.hypot(targetRide.gx + 1 - s.gx, targetRide.gy + 1 - s.gy) < 2.5) {
            this.repairBuilding(targetRide.uid, targetRide.isBrokenDown ? s.name : undefined);
            s.actionText = `Vừa niệm Reparo bảo trì ${getCatalogItem(targetRide.itemId)?.name ?? 'trò chơi'}!`;
          } else {
            s.targetGx = targetRide.gx + 1;
            s.targetGy = targetRide.gy + 1;
            s.actionText = `Đang chạy tới sửa ${getCatalogItem(targetRide.itemId)?.name ?? 'trò chơi'}!`;
          }
          continue;
        }
      }

      // 3. House Elf: auto-harvest bubbles!
      if (s.role === 'house_elf') {
        const readyB = this.state.buildings.find(
          (b) => b.readyBubbles >= 2 && inPatrol(b.gx, b.gy)
        );
        if (readyB) {
          if (Math.hypot(readyB.gx - s.gx, readyB.gy - s.gy) < 2.5) {
            this.harvestBuildingBubble(readyB.uid);
            s.actionText = 'Gia tinh vừa gom vàng giúp bạn!';
          } else {
            s.targetGx = readyB.gx;
            s.targetGy = readyB.gy;
            s.actionText = 'Chạy đi gom bong bóng vàng';
          }
          continue;
        }
      }

      // 4. Magizoologist: feed hungry creatures!
      if (s.role === 'magizoologist') {
        const hungry = this.state.buildings.find(
          (b) => (b.creatureHunger ?? 100) < 65 && inPatrol(b.gx, b.gy)
        );
        if (hungry) {
          hungry.creatureHunger = 100;
          hungry.creatureHappiness = 100;
          s.targetGx = hungry.gx;
          s.targetGy = hungry.gy;
          s.actionText = 'Đang chăm sóc thú huyền bí';
          continue;
        }
      }

      // 5. Caretaker: clean litter in patrol zone!
      if (s.role === 'caretaker') {
        let cleaned = false;
        for (let y = 0; y < GRID_SIZE && !cleaned; y++) {
          for (let x = 0; x < GRID_SIZE && !cleaned; x++) {
            if (this.grid[y][x].hasLitter && inPatrol(x, y)) {
              this.grid[y][x].hasLitter = false;
              const k = `${x},${y}`;
              if (this.state.tileOverrides[k]) this.state.tileOverrides[k].hasLitter = false;
              s.targetGx = x;
              s.targetGy = y;
              s.actionText = 'Vừa hóa giải vũng bùa chú lỗi';
              cleaned = true;
            }
          }
        }
        if (cleaned) continue;
      }

      // Patrol within assigned zone if set!
      if (patrolZone !== 'all') {
        const z = getZoneById(patrolZone);
        s.targetGx = z.x1 + 1 + Math.floor(Math.random() * Math.max(1, z.x2 - z.x1 - 1));
        s.targetGy = z.y1 + 1 + Math.floor(Math.random() * Math.max(1, z.y2 - z.y1 - 1));
        s.actionText = `Tuần tra vùng ${z.name}`;
        continue;
      }

      const spot = getRandomUnlockedPathTile(this.grid, unlockedSet);
      if (spot) {
        s.targetGx = spot.gx;
        s.targetGy = spot.gy;
      }
    }
  }

  // ==================== HỆ THỐNG VALI BẢO TỒN SINH VẬT HUYỀN BÍ (SUITCASE SANCTUARY) ====================

  public getBuiltCreatureHabitats(): Array<{ building: PlacedBuilding; item: CatalogItem }> {
    const now = Date.now();
    const list: Array<{ building: PlacedBuilding; item: CatalogItem }> = [];
    for (const b of this.state.buildings) {
      if (now < b.constructEndsAt) continue;
      const item = getCatalogItem(b.itemId);
      if (item?.isCreatureHabitat) {
        list.push({ building: b, item });
      }
    }
    return list;
  }

  public getSuitcaseReadySummary(now = Date.now()): {
    incubationReady: boolean;
    expeditionReady: boolean;
    hungryCount: number;
    badgeCount: number;
  } {
    const inc = this.state.suitcase.activeIncubation;
    const exp = this.state.suitcase.activeExpedition;
    const incubationReady = Boolean(inc && now >= inc.endsAt);
    const expeditionReady = Boolean(exp && now >= exp.endsAt);
    let hungryCount = 0;
    for (const { building, item } of this.getBuiltCreatureHabitats()) {
      if (!item.isRuralFarmstead && (building.creatureHunger ?? 100) < 40) hungryCount++;
    }
    const badgeCount = (incubationReady ? 1 : 0) + (expeditionReady ? 1 : 0) + hungryCount;
    return { incubationReady, expeditionReady, hungryCount, badgeCount };
  }

  public registerDiscoveredMorph(itemId: string, morph: CreatureMorphVariant): boolean {
    if (!CREATURE_SPECIES_PROFILES.some((p) => p.habitatItemId === itemId)) return false;
    const key = `${itemId}:${morph}`;
    if (!this.state.suitcase.discoveredMorphs.includes(key)) {
      this.state.suitcase.discoveredMorphs.push(key);
      return true;
    }
    return false;
  }

  public addCreatureBondXp(b: PlacedBuilding, item: CatalogItem, amount: number): void {
    b.creatureBondLevel = Math.max(1, Math.min(MAX_BOND_LEVEL, b.creatureBondLevel ?? 1));
    b.creatureBondXp = Math.max(0, b.creatureBondXp ?? 0);
    if (b.creatureBondLevel >= MAX_BOND_LEVEL) {
      b.creatureBondXp = 0;
      return;
    }
    b.creatureBondXp += amount;
    let leveledUp = false;
    while (b.creatureBondLevel < MAX_BOND_LEVEL) {
      const req = getBondXpRequiredForNext(b.creatureBondLevel);
      if (b.creatureBondXp < req) break;
      b.creatureBondXp -= req;
      b.creatureBondLevel += 1;
      leveledUp = true;
      this.addXp(25 * b.creatureBondLevel);
    }
    if (b.creatureBondLevel >= MAX_BOND_LEVEL) {
      b.creatureBondXp = 0;
    }
    if (leveledUp) {
      const petLabel = b.creatureNickname || item.creatureName || item.name;
      const pct = Math.round((getBondIncomeMultiplier(b.creatureBondLevel) - 1) * 100);
      this.audio.playLevelUp();
      this.onToast?.(
        `💝 Độ gắn kết của "${petLabel}" đạt Cấp ${b.creatureBondLevel}! (+${pct}% sản lượng chuồng)`,
        '🐾'
      );
    }
  }

  public renameCreature(uid: string, rawName: string): { ok: boolean; name: string; msg: string } {
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, name: '', msg: 'Không tìm thấy sinh vật này.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat) {
      return { ok: false, name: '', msg: 'Công trình này không phải Khu Bảo Tồn Sinh Vật.' };
    }
    const cleaned = rawName.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, 28);
    b.creatureNickname = cleaned || undefined;
    const finalDisplay = cleaned || item.creatureName || item.name;
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      name: finalDisplay,
      msg: cleaned
        ? `🏷️ Đã đặt tên thân mật cho thú cưng là "${cleaned}"!`
        : `🏷️ Đã khôi phục tên loài mặc định "${finalDisplay}".`,
    };
  }

  public groomCreature(uid: string): { ok: boolean; msg: string } {
    const now = Date.now();
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy chuồng thú.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    const elapsed = now - (b.lastGroomedAt ?? 0);
    if (!this.state.sandboxMode && elapsed < GROOM_COOLDOWN_MS) {
      const waitSec = Math.ceil((GROOM_COOLDOWN_MS - elapsed) / 1000);
      return { ok: false, msg: `Thú cưng đang lim dim tận hưởng — chờ ${waitSec}s nữa nhé!` };
    }

    b.lastGroomedAt = now;
    b.creatureHappiness = 100;
    b.creatureHunger = Math.min(100, (b.creatureHunger ?? 80) + 12);
    this.state.suitcase.totalGrooms += 1;
    this.registerDiscoveredMorph(item.id, b.creatureMorph ?? 'normal');
    this.addCreatureBondXp(b, item, 30);
    this.addXp(18);

    const petLabel = b.creatureNickname || item.creatureName || item.name;
    let giftSuffix = '';
    if (Math.random() < 0.35) {
      if (Math.random() < 0.5) {
        const giftGold = Math.round(25 + this.state.level * 1.2);
        this.state.galleons += giftGold;
        this.state.finance.harvestRevenue += giftGold;
        giftSuffix = ` Nó dụi đầu tặng lại bạn +${giftGold}🪙 lấp lánh!`;
      } else {
        this.state.supply.ingredients.starlight_dust = Math.min(
          99,
          (this.state.supply.ingredients.starlight_dust ?? 0) + 1
        );
        giftSuffix = ' Bộ lông rũ ra +1 ✨ Bụi Ánh Sao quý hiếm!';
      }
    }

    this.audio.playHarvestBubble();
    this.spawnFloatingText(b.gx + 1, b.gy + 1, `🪮 Chải lông êm ái! +30 💝`, '#f9a8d4');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🪮 Bạn chải mượt bộ lông của ${petLabel} (+30 Điểm Gắn Kết, Vui vẻ 100%).${giftSuffix}`,
    };
  }

  public trainCreatureTrick(uid: string): { ok: boolean; msg: string } {
    const now = Date.now();
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy chuồng thú.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    const elapsed = now - (b.lastTrainedAt ?? 0);
    if (!this.state.sandboxMode && elapsed < TRAIN_COOLDOWN_MS) {
      const waitSec = Math.ceil((TRAIN_COOLDOWN_MS - elapsed) / 1000);
      return { ok: false, msg: `Thú cưng vừa biểu diễn xong — nghỉ ngơi ${waitSec}s nữa nhé!` };
    }
    const trainCost = 20;
    if (!this.state.sandboxMode && this.state.galleons < trainCost) {
      return { ok: false, msg: `Cần ${trainCost}G mua bánh thưởng huấn luyện tiết mục!` };
    }
    if (!this.state.sandboxMode) {
      this.state.galleons -= trainCost;
    }

    b.lastTrainedAt = now;
    b.creatureHappiness = 100;
    this.registerDiscoveredMorph(item.id, b.creatureMorph ?? 'normal');
    this.addCreatureBondXp(b, item, 45);
    this.addXp(38);
    this.recordQuestProgress('feed_creatures', item.id, 1);

    const profile = getSpeciesProfile(item.id);
    const trickLabel = profile?.trickName ?? 'Vũ Điệu Phép Thuật';
    const petLabel = b.creatureNickname || item.creatureName || item.name;
    this.audio.playSpell();
    this.spawnFloatingText(b.gx + 1, b.gy + 1, `🎾 ${trickLabel}! +45 💝`, '#fde047');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🎾 ${petLabel} trình diễn tiết mục "${trickLabel}" tuyệt đẹp! (+45 Điểm Gắn Kết & +38 ⭐)`,
    };
  }

  public getMorphIncubationCost(item: CatalogItem): number {
    return Math.max(85, Math.round(item.cost * 0.14));
  }

  public startMorphIncubation(habitatUid: string, useStarlight: boolean): { ok: boolean; msg: string } {
    const now = Date.now();
    if (this.state.suitcase.activeIncubation) {
      return { ok: false, msg: 'Lồng Ấp Cổ Ngữ đang ấp một quả trứng khác rồi!' };
    }
    const b = this.state.buildings.find((x) => x.uid === habitatUid);
    if (!b) return { ok: false, msg: 'Không tìm thấy sinh vật để kết tinh trứng cổ ngữ.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn phải xây xong mới có thể ấp biến thể.' };
    }

    const goldCost = this.getMorphIncubationCost(item);
    if (!this.state.sandboxMode) {
      if (this.state.galleons < goldCost) {
        return { ok: false, msg: `Cần ${goldCost}G để thắp Lồng Ấp Cổ Ngữ cho loài này!` };
      }
      if (useStarlight && (this.state.supply.ingredients.starlight_dust ?? 0) < 1) {
        return { ok: false, msg: 'Chưa có ✨ Bụi Ánh Sao trong kho nguyên liệu!' };
      }
      this.state.galleons -= goldCost;
      if (useStarlight) {
        this.state.supply.ingredients.starlight_dust -= 1;
      }
    }

    this.state.suitcase.activeIncubation = {
      habitatUid: b.uid,
      itemId: item.id,
      startedAt: now,
      endsAt: now + INCUBATION_DURATION_MS,
      boostedWithStarlight: useStarlight,
    };
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🥚 Đã đặt Trứng Cổ Ngữ của ${item.creatureName ?? item.name} vào Lồng Ấp (${Math.round(INCUBATION_DURATION_MS / 1000)}s)!`,
    };
  }

  public speedUpIncubationWithSand(): { ok: boolean; msg: string } {
    const inc = this.state.suitcase.activeIncubation;
    const now = Date.now();
    if (!inc || now >= inc.endsAt) {
      return { ok: false, msg: 'Trứng đã sẵn sàng nở rồi!' };
    }
    if (!this.state.sandboxMode && this.state.timeSand < 1) {
      return { ok: false, msg: 'Cần 1 ⏳ Cát Thời Gian để ấp nở tức thì!' };
    }
    if (!this.state.sandboxMode) {
      this.state.timeSand -= 1;
    }
    inc.endsAt = now;
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '⏳ Cát Thời Gian lấp lánh — Trứng Cổ Ngữ đã nứt vỏ sẵn sàng!' };
  }

  public claimMorphIncubation(): {
    ok: boolean;
    morph?: CreatureMorphVariant;
    isNew?: boolean;
    msg: string;
  } {
    const inc = this.state.suitcase.activeIncubation;
    const now = Date.now();
    if (!inc) return { ok: false, msg: 'Không có trứng nào trong Lồng Ấp.' };
    if (now < inc.endsAt) {
      const left = Math.ceil((inc.endsAt - now) / 1000);
      return { ok: false, msg: `Trứng đang kết tinh phép thuật (${left}s nữa)!` };
    }

    const b = this.state.buildings.find((x) => x.uid === inc.habitatUid);
    const item = getCatalogItem(inc.itemId);
    const roll = Math.random();
    let hatchedMorph: CreatureMorphVariant = 'normal';
    if (inc.boostedWithStarlight) {
      if (roll < 0.36) hatchedMorph = 'radiant';
      else if (roll < 0.9) hatchedMorph = 'mystic';
      else hatchedMorph = 'normal';
      if (hatchedMorph === 'normal' && (!b?.creatureMorph || b.creatureMorph === 'normal')) {
        hatchedMorph = 'mystic';
      }
    } else {
      if (roll < 0.16) hatchedMorph = 'radiant';
      else if (roll < 0.62) hatchedMorph = 'mystic';
      else hatchedMorph = 'normal';
    }

    const isNew = this.registerDiscoveredMorph(inc.itemId, hatchedMorph);
    this.state.suitcase.totalMorphsHatched += 1;
    this.state.suitcase.activeIncubation = null;

    const rank: Record<CreatureMorphVariant, number> = { normal: 0, mystic: 1, radiant: 2 };
    if (b && item) {
      const cur = b.creatureMorph ?? 'normal';
      if (rank[hatchedMorph] >= rank[cur]) {
        b.creatureMorph = hatchedMorph;
      }
      b.creatureHappiness = 100;
      this.addCreatureBondXp(b, item, 40);
      this.spawnFloatingText(
        b.gx + 1,
        b.gy + 1,
        `${MORPH_INFO[hatchedMorph].badge}!`,
        hatchedMorph === 'radiant' ? '#fde047' : '#38bdf8'
      );
    }

    const profile = getSpeciesProfile(inc.itemId);
    const variantTitle = profile ? profile.morphNames[hatchedMorph] : MORPH_INFO[hatchedMorph].badge;
    this.addXp(hatchedMorph === 'radiant' ? 140 : hatchedMorph === 'mystic' ? 85 : 45);
    this.audio.playLevelUp();
    this.saveToStorage();
    this.onUiChange?.();

    const msg = `🐣 Trứng nở thành công: ${variantTitle} (${MORPH_INFO[hatchedMorph].badge})${isNew ? ' — Mở khóa mục mới trong Sổ Tay Newt (+2% sản lượng toàn bộ thú)!' : '!'}`;
    this.onToast?.(msg, hatchedMorph === 'radiant' ? '✨' : '🌙');
    return { ok: true, morph: hatchedMorph, isNew, msg };
  }

  public startSuitcaseExpedition(
    habitatUid: string,
    expeditionId: SuitcaseExpeditionId
  ): { ok: boolean; msg: string } {
    const now = Date.now();
    if (this.state.suitcase.activeExpedition) {
      return { ok: false, msg: 'Đội thám hiểm thú cưng đang trên đường đi rồi!' };
    }
    const exp = SUITCASE_EXPEDITIONS.find((e) => e.id === expeditionId);
    if (!exp) return { ok: false, msg: 'Không tìm thấy tuyến thám hiểm.' };
    if (!this.state.sandboxMode && this.state.level < exp.minParkLevel) {
      return { ok: false, msg: `Cần Công viên đạt Cấp ${exp.minParkLevel} để mở tuyến "${exp.name}"!` };
    }

    const b = this.state.buildings.find((x) => x.uid === habitatUid);
    if (!b) return { ok: false, msg: 'Hãy chọn một sinh vật khỏe mạnh để cử đi thám hiểm.' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isCreatureHabitat || now < b.constructEndsAt) {
      return { ok: false, msg: 'Khu bảo tồn vẫn đang xây dựng.' };
    }
    if (!this.state.sandboxMode && (b.creatureHunger ?? 80) < 30) {
      return { ok: false, msg: 'Thú cưng đang đói bụng (<30%) — hãy cho ăn trước khi lên đường nhé!' };
    }

    this.state.suitcase.activeExpedition = {
      expeditionId: exp.id,
      habitatUid: b.uid,
      startedAt: now,
      endsAt: now + exp.durationSec * 1000,
    };
    const petLabel = b.creatureNickname || item.creatureName || item.name;
    this.audio.playPlace();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🧭 ${petLabel} đã phóng khỏi Vali tiến vào "${exp.name}" (${exp.durationSec}s)!`,
    };
  }

  public speedUpExpeditionWithSand(): { ok: boolean; msg: string } {
    const act = this.state.suitcase.activeExpedition;
    const now = Date.now();
    if (!act || now >= act.endsAt) {
      return { ok: false, msg: 'Thú cưng đã mang chiến lợi phẩm về tới cửa Vali rồi!' };
    }
    if (!this.state.sandboxMode && this.state.timeSand < 1) {
      return { ok: false, msg: 'Cần 1 ⏳ Cát Thời Gian để đón thú về tức thì!' };
    }
    if (!this.state.sandboxMode) {
      this.state.timeSand -= 1;
    }
    act.endsAt = now;
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '⏳ Thú cưng đã vượt thời gian trở về cùng túi quà đầy ắp!' };
  }

  public claimSuitcaseExpedition(): { ok: boolean; msg: string } {
    const act = this.state.suitcase.activeExpedition;
    const now = Date.now();
    if (!act) return { ok: false, msg: 'Hiện không có chuyến thám hiểm nào.' };
    if (now < act.endsAt) {
      const left = Math.ceil((act.endsAt - now) / 1000);
      return { ok: false, msg: `Thú cưng đang thám hiểm (${left}s nữa sẽ về)!` };
    }

    const exp = SUITCASE_EXPEDITIONS.find((e) => e.id === act.expeditionId) ?? SUITCASE_EXPEDITIONS[0];
    const b = this.state.buildings.find((x) => x.uid === act.habitatUid);
    const item = b ? getCatalogItem(b.itemId) : undefined;

    const bondMult = getBondIncomeMultiplier(b?.creatureBondLevel ?? 1);
    const morphMult = MORPH_INFO[b?.creatureMorph ?? 'normal'].incomeMult;
    const totalMult = bondMult * morphMult;

    const rewardGold = Math.round(exp.baseGold * totalMult);
    const rewardXp = Math.round(exp.baseXp * totalMult);
    const bonusHerb = (b?.creatureBondLevel ?? 1) >= 5 ? 1 : 0;

    this.state.galleons += rewardGold;
    this.state.finance.harvestRevenue += rewardGold;
    this.addXp(rewardXp);

    const herbParts: string[] = [];
    for (const ing of exp.guaranteedIngredients) {
      const qty = ing.qty + bonusHerb;
      this.state.supply.ingredients[ing.id] = Math.min(
        99,
        (this.state.supply.ingredients[ing.id] ?? 0) + qty
      );
      herbParts.push(`+${qty} ${RAW_INGREDIENTS_INFO[ing.id].emoji}`);
    }

    this.state.suitcase.totalExpeditions += 1;
    this.state.suitcase.activeExpedition = null;

    if (b && item) {
      this.addCreatureBondXp(b, item, 35);
      this.tryDropWizardCard(b.gx + 1, b.gy + 1, exp.cardDropChance);
      this.spawnFloatingText(b.gx + 1, b.gy + 1, `🧭 +${rewardGold}G ${herbParts.join(' ')}`, '#fde047');
    } else {
      this.tryDropWizardCard(24, 24, exp.cardDropChance);
    }

    this.audio.playHarvestBubble();
    this.saveToStorage();
    this.onUiChange?.();

    const petLabel = b?.creatureNickname || item?.creatureName || 'Thú cưng';
    const msg = `🎒 ${petLabel} trở về từ "${exp.name}": +${rewardGold}G, +${rewardXp} ⭐ & ${herbParts.join(', ')}!`;
    this.onToast?.(msg, '🧭');
    return { ok: true, msg };
  }

  // ==================== HỆ THỐNG LEO THÁP MATCH-3 & SAO PHÉP THUẬT (ROYAL MATCH / GARDENSCAPES) ====================

  public tickMatch3Hearts(now = Date.now()): void {
    const m3 = this.state.match3;
    if (!m3) return;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      m3.hearts = MAX_MATCH3_HEARTS;
      m3.nextHeartAt = 0;
      return;
    }
    if (!m3.nextHeartAt || m3.nextHeartAt <= 0) {
      m3.nextHeartAt = now + HEART_REGEN_MS;
      return;
    }
    while (m3.hearts < MAX_MATCH3_HEARTS && now >= m3.nextHeartAt) {
      m3.hearts += 1;
      if (m3.hearts >= MAX_MATCH3_HEARTS) {
        m3.nextHeartAt = 0;
      } else {
        m3.nextHeartAt += HEART_REGEN_MS;
      }
    }
  }

  public getStoryAutoActionPreview(): {
    kind: 'claim_free' | 'auto_paths' | 'auto_build' | 'auto_unlock_zone' | 'open_match3' | 'none';
    shortLabel: string;
    longLabel: string;
    starCost: number;
    goldCost: number;
  } {
    const story = this.getActiveStoryQuest();
    if (!story) {
      return { kind: 'none', shortLabel: '', longLabel: '', starCost: 0, goldCost: 0 };
    }
    if (story.completed) {
      return {
        kind: 'claim_free',
        shortLabel: `🎁 Nhận +${story.rewardGalleons}G`,
        longLabel: '🎁 Nhận Phần Thưởng Nhiệm Vụ Cốt Truyện!',
        starCost: 0,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'place_paths') {
      return {
        kind: 'auto_paths',
        shortLabel: '🌟 1 Sao Lát Ngay',
        longLabel: '🌟 Dùng 1 Sao Phép Thuật Lát Đường Đá Tự Động & Hoàn Tất Ngay!',
        starCost: 1,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'unlock_zone' && story.targetId) {
      const z = getZoneById(story.targetId as ZoneId);
      const zStars = getZonePuzzleStarCost(z);
      if (!this.state.sandboxMode && this.state.level < z.unlockLevel) {
        return {
          kind: 'open_match3',
          shortLabel: `▶️ Cày lên Cấp ${z.unlockLevel}`,
          longLabel: `🔒 Cần đạt Cấp Giải Đố ${z.unlockLevel} để mở "${z.name}" — Chơi Giải Đố tăng cấp & nhận x2 🌟 Sao!`,
          starCost: zStars,
          goldCost: 0,
        };
      }
      return {
        kind: 'auto_unlock_zone',
        shortLabel: `🔓 Mở Khu (${zStars} 🌟)`,
        longLabel: `🔓 Phá Phong Ấn "${z.name}" (${zStars} 🌟 Sao Phép Thuật) & Nhận Thưởng!`,
        starCost: zStars,
        goldCost: 0,
      };
    }
    if (story.objectiveType === 'build_item' && story.targetId) {
      const item = getCatalogItem(story.targetId);
      if (item) {
        const starCost = getItemPuzzleStarCost(item);
        const effStar = Math.max(1, starCost);
        const effGold = starCost > 0 ? 0 : item.cost;
        if (!this.state.sandboxMode && this.state.level < item.unlockLevel) {
          return {
            kind: 'open_match3',
            shortLabel: `▶️ Cày lên Cấp ${item.unlockLevel}`,
            longLabel: `🔒 Bản vẽ "${item.name}" mở ở Cấp Giải Đố ${item.unlockLevel} — Bấm Chơi Giải Đố Lên Cấp Ngay!`,
            starCost: effStar,
            goldCost: effGold,
          };
        }
        return {
          kind: 'auto_build',
          shortLabel: effGold > 0 ? `🌟 Xây (${effStar}🌟 + ${effGold}🪙)` : `🌟 Xây Ngay (${effStar} 🌟)`,
          longLabel:
            effGold > 0
              ? `🌟 Xây Tự Động "${item.name}" (${effStar}🌟 + ${effGold.toLocaleString('vi-VN')}🪙) & Hoàn Tất Ngay!`
              : `🌟 Dùng ${effStar} Sao Khởi Công "${item.name}" & Nhận Thưởng!`,
          starCost: effStar,
          goldCost: effGold,
        };
      }
    }
    return {
      kind: 'open_match3',
      shortLabel: '🧩 Giải Đố Tăng Cấp',
      longLabel: '🧩 Chơi Tháp Giải Đố Kiếm Thêm XP & Sao Phép Thuật!',
      starCost: 0,
      goldCost: 0,
    };
  }

  private bridgeZoneWithCobblePath(zoneId: ZoneId): void {
    const z = getZoneById(zoneId);
    let bestPair: { px: number; py: number; zx: number; zy: number; dist: number } | null = null;
    for (const pk of this.connectedPathTiles) {
      const [px, py] = pk.split(',').map(Number);
      for (let zy = z.y1; zy <= z.y2; zy++) {
        for (let zx = z.x1; zx <= z.x2; zx++) {
          const cell = this.grid[zy]?.[zx];
          if (!cell || cell.buildingUid || cell.coasterTrack) continue;
          const dist = Math.abs(zx - px) + Math.abs(zy - py);
          if (dist >= 1 && dist <= 5 && (!bestPair || dist < bestPair.dist)) {
            bestPair = { px, py, zx, zy, dist };
          }
        }
      }
    }
    if (!bestPair) return;
    let cx = bestPair.px;
    let cy = bestPair.py;
    const unlockedSet = new Set(this.state.unlockedZones);
    while (cx !== bestPair.zx || cy !== bestPair.zy) {
      if (cx !== bestPair.zx) cx += bestPair.zx > cx ? 1 : -1;
      else cy += bestPair.zy > cy ? 1 : -1;
      const cell = this.grid[cy]?.[cx];
      if (!cell || (!this.state.sandboxMode && !unlockedSet.has(cell.zoneId))) break;
      if (!cell.buildingUid && !cell.coasterTrack && cell.path === 'none') {
        cell.path = 'cobble';
        this.state.tileOverrides[`${cx},${cy}`] = {
          ...this.state.tileOverrides[`${cx},${cy}`],
          path: 'cobble',
        };
      }
    }
    this.recomputeAllCoastersAndBiomes();
  }

  private findSmartSpotForStoryBuilding(item: CatalogItem): { gx: number; gy: number } | null {
    const unlockedSet = new Set(this.state.unlockedZones);
    const { bw, bh } = this.getBuildingFootprint(item, 0);

    // Find synergy partner coordinates if already built
    const partnerCenters: Array<{ gx: number; gy: number; maxRadius: number }> = [];
    for (const syn of DISTRICT_SYNERGIES) {
      if (!syn.requiredItems.includes(item.id)) continue;
      const otherId = syn.requiredItems.find((id) => id !== item.id);
      if (!otherId) continue;
      for (const b of this.state.buildings) {
        if (b.itemId === otherId) {
          partnerCenters.push({ gx: b.gx, gy: b.gy, maxRadius: syn.maxRadius });
        }
      }
    }

    let best: { gx: number; gy: number; score: number; roadAnchor?: [number, number] } | null = null;

    for (let gy = 0; gy <= GRID_SIZE - bh; gy++) {
      for (let gx = 0; gx <= GRID_SIZE - bw; gx++) {
        // Check footprint cells are unlocked, empty, flat, and not overwriting existing paths
        const baseElev = this.grid[gy][gx].elevation;
        let footprintOk = true;
        for (let dy = 0; dy < bh && footprintOk; dy++) {
          for (let dx = 0; dx < bw; dx++) {
            const c = this.grid[gy + dy][gx + dx];
            if (!c || (!this.state.sandboxMode && !unlockedSet.has(c.zoneId))) {
              footprintOk = false;
              break;
            }
            if (
              c.buildingUid ||
              c.coasterTrack ||
              c.zooFence ||
              (c.path !== 'none' && !item.isBench) ||
              c.elevation !== baseElev ||
              (c.terrain === 'water' && item.id !== 'black_lake_boats')
            ) {
              footprintOk = false;
              break;
            }
          }
        }
        if (!footprintOk) continue;

        // Check orthogonal adjacency or short 1..3 tile bridge to connectedPathTiles
        let touchingRoad = false;
        let nearestRoad: [number, number] | undefined;
        let nearestRoadDist = 999;

        for (let dy = -1; dy <= bh; dy++) {
          for (let dx = -1; dx <= bw; dx++) {
            const isCorner = (dx === -1 || dx === bw) && (dy === -1 || dy === bh);
            if (isCorner) continue;
            const isInside = dx >= 0 && dx < bw && dy >= 0 && dy < bh;
            if (isInside) continue;
            const nx = gx + dx;
            const ny = gy + dy;
            if (this.connectedPathTiles.has(`${nx},${ny}`)) {
              touchingRoad = true;
            }
          }
        }

        if (!touchingRoad) {
          for (const pk of this.connectedPathTiles) {
            const [px, py] = pk.split(',').map(Number);
            const clX = Math.max(gx, Math.min(gx + bw - 1, px));
            const clY = Math.max(gy, Math.min(gy + bh - 1, py));
            const d = Math.abs(px - clX) + Math.abs(py - clY);
            if (d < nearestRoadDist) {
              nearestRoadDist = d;
              nearestRoad = [px, py];
            }
          }
        }

        if (!touchingRoad && nearestRoadDist > 4) continue;

        let score = touchingRoad ? 1000 : 500 - nearestRoadDist * 60;
        for (const p of partnerCenters) {
          const dist = Math.hypot(gx - p.gx, gy - p.gy);
          if (dist <= p.maxRadius) score += 380;
        }
        // Prefer staying cozy near park roads rather than edge corners
        score -= Math.hypot(gx - 12, gy - 17) * 2;

        if (!best || score > best.score) {
          best = { gx, gy, score, roadAnchor: touchingRoad ? undefined : nearestRoad };
        }
      }
    }

    if (!best) return null;

    // Auto-lay short cobble connector if building is 2-4 tiles off an existing connected road
    if (best.roadAnchor) {
      let [rx, ry] = best.roadAnchor;
      const goalX = best.gx;
      const goalY = best.gy + bh < GRID_SIZE ? best.gy + bh : Math.max(0, best.gy - 1);
      let guard = 0;
      while ((rx !== goalX || ry !== goalY) && guard++ < 8) {
        if (rx !== goalX) rx += goalX > rx ? 1 : -1;
        else ry += goalY > ry ? 1 : -1;
        const c = this.grid[ry]?.[rx];
        if (!c || (!this.state.sandboxMode && !unlockedSet.has(c.zoneId))) break;
        if (!c.buildingUid && !c.coasterTrack && c.path === 'none') {
          c.path = 'cobble';
          this.state.tileOverrides[`${rx},${ry}`] = {
            ...this.state.tileOverrides[`${rx},${ry}`],
            path: 'cobble',
          };
        }
      }
      this.recomputeAllCoastersAndBiomes();
    }

    return { gx: best.gx, gy: best.gy };
  }

  public completeStoryStepWithStar(): {
    ok: boolean;
    msg: string;
    reason?: 'missing_stars' | 'missing_gold' | 'locked_level' | 'no_space' | 'open_match3';
    placedGx?: number;
    placedGy?: number;
  } {
    const story = this.getActiveStoryQuest();
    if (!story) {
      return { ok: false, msg: 'Bạn đã hoàn thành trọn vẹn toàn bộ Cốt Truyện Công Viên!' };
    }

    // 0. Already completed naturally -> claim for FREE (0 Stars wasted)!
    if (story.completed) {
      this.claimQuest(story.id);
      return { ok: true, msg: `🎁 Đã nhận thưởng "${story.title}"!` };
    }

    // 1. Auto-lay cobblestone paths (`place_paths`) for 1 Puzzle Star!
    if (story.objectiveType === 'place_paths') {
      const starCost = 1;
      if (!this.state.sandboxMode && this.state.match3.stars < starCost) {
        return {
          ok: false,
          reason: 'missing_stars',
          msg: `Cần 1 🌟 Sao Phép Thuật để lát đường tự động — Hãy vượt Màn ${this.state.match3.currentLevel}!`,
        };
      }
      const needed = Math.max(1, story.targetAmount - story.progress);
      const unlockedSet = new Set(this.state.unlockedZones);
      let laid = 0;
      let lastGx = 7;
      let lastGy = 17;

      while (laid < needed) {
        let bestTile: [number, number] | null = null;
        let bestScore = -9999;
        for (const pk of this.connectedPathTiles) {
          const [px, py] = pk.split(',').map(Number);
          for (const [dx, dy] of [
            [1, 0],
            [0, 1],
            [0, -1],
            [-1, 0],
          ]) {
            const nx = px + dx;
            const ny = py + dy;
            const cell = this.grid[ny]?.[nx];
            if (!cell || (!this.state.sandboxMode && !unlockedSet.has(cell.zoneId))) continue;
            if (cell.path !== 'none' || cell.buildingUid || cell.coasterTrack) continue;
            // Prefer extending the main Hogsmeade avenue (y = 17..18) eastward cleanly
            const sc = (ny === 17 ? 50 : ny === 18 ? 35 : 10) + nx * 2;
            if (sc > bestScore) {
              bestScore = sc;
              bestTile = [nx, ny];
            }
          }
        }
        if (!bestTile) break;
        const [tx, ty] = bestTile;
        this.grid[ty][tx].path = 'cobble';
        this.state.tileOverrides[`${tx},${ty}`] = {
          ...this.state.tileOverrides[`${tx},${ty}`],
          path: 'cobble',
        };
        this.connectedPathTiles.add(`${tx},${ty}`);
        this.state.stats.pathsPlaced += 1;
        this.recordQuestProgress('place_paths', 'path_cobble', 1);
        this.spawnFloatingText(tx, ty, '🌟 Lát đá!', '#fde047');
        lastGx = tx;
        lastGy = ty;
        laid++;
      }

      if (!this.state.sandboxMode) {
        this.state.match3.stars -= starCost;
      }
      this.recomputeAllCoastersAndBiomes();
      this.claimQuest(story.id);
      this.launchFireworksShow(4);
      const msg = `🌟 Đã dùng 1 Sao lát tự động ${laid} ô Đường Đá & hoàn thành "${story.title}" (+${story.rewardGalleons}G)!`;
      this.onToast?.(msg, '🌟');
      return { ok: true, msg, placedGx: lastGx, placedGy: lastGy };
    }

    // 2. Unlock fogged zone (`unlock_zone`) cleanly respecting level, Star, and Gold costs!
    if (story.objectiveType === 'unlock_zone' && story.targetId) {
      const z = getZoneById(story.targetId as ZoneId);
      const zStars = getZonePuzzleStarCost(z);
      if (!this.state.sandboxMode && this.state.level < z.unlockLevel) {
        return {
          ok: false,
          reason: 'locked_level',
          msg: `🔒 Cần đạt Cấp ${z.unlockLevel} để mở "${z.name}" — Hãy chơi Giải Đố & thu hoạch Vàng tích XP!`,
        };
      }
      if (!this.state.sandboxMode && this.state.match3.stars < zStars) {
        return {
          ok: false,
          reason: 'missing_stars',
          msg: `Cần ${zStars} 🌟 Sao Phép Thuật để phá phong ấn "${z.name}" — Vào Màn ${this.state.match3.currentLevel} ngay!`,
        };
      }
      if (!this.state.sandboxMode && this.state.galleons < z.unlockCost) {
        return {
          ok: false,
          reason: 'missing_gold',
          msg: `Cần ${z.unlockCost.toLocaleString('vi-VN')} 🪙 Galleon để phá phong ấn "${z.name}"!`,
        };
      }
      const uRes = this.unlockZone(z.id);
      if (!uRes.ok) {
        return { ok: false, msg: uRes.msg };
      }
      this.bridgeZoneWithCobblePath(z.id);
      this.claimQuest(story.id);
      this.launchFireworksShow(6);
      const cx = (z.x1 + z.x2) * 0.5;
      const cy = (z.y1 + z.y2) * 0.5;
      return {
        ok: true,
        msg: `🗺️ Đã phá phong ấn "${z.name}" & nhận thưởng "${story.title}" (+${story.rewardGalleons}G)!`,
        placedGx: cx,
        placedGy: cy,
      };
    }

    // 3. Auto-construct Story Building (`build_item`) right onto the park map!
    if (story.objectiveType === 'build_item' && story.targetId) {
      const item = getCatalogItem(story.targetId);
      if (!item) {
        return { ok: false, msg: 'Không tìm thấy công trình nhiệm vụ.' };
      }
      if (!this.state.sandboxMode && this.state.level < item.unlockLevel) {
        return {
          ok: false,
          reason: 'locked_level',
          msg: `🔒 "${item.name}" mở khóa ở Cấp ${item.unlockLevel} — Hãy chơi Giải Đố kiếm thêm XP!`,
        };
      }

      const baseItemStars = getItemPuzzleStarCost(item);
      const requiredStars = Math.max(1, baseItemStars);
      if (!this.state.sandboxMode && this.state.match3.stars < requiredStars) {
        return {
          ok: false,
          reason: 'missing_stars',
          msg: `Cần ${requiredStars} 🌟 Sao Phép Thuật để kiến tạo "${item.name}" — Hãy chơi Giải Đố nhận thêm Sao!`,
        };
      }
      if (!this.state.sandboxMode && baseItemStars === 0 && this.state.galleons < item.cost) {
        return {
          ok: false,
          reason: 'missing_gold',
          msg: `Cần ${item.cost.toLocaleString('vi-VN')} 🪙 Galleon để xây "${item.name}"!`,
        };
      }

      const spot = this.findSmartSpotForStoryBuilding(item);
      if (!spot) {
        return {
          ok: false,
          reason: 'no_space',
          msg: `Chưa có ô đất trống phù hợp cạnh đường đi để đặt "${item.name}" — Hãy mở thêm khu đất mới hoặc dọn chỗ nhé!`,
        };
      }

      const placedOk = this.placeItem(item, spot.gx, spot.gy, 0);
      if (!placedOk) {
        return {
          ok: false,
          reason: 'no_space',
          msg: `Hãy chọn vị trí trên bản đồ để đặt "${item.name}" nhé!`,
        };
      }

      // Deduct 1 Puzzle Star if the item was a 0-star landmark decor auto-built via Story
      if (!this.state.sandboxMode && baseItemStars === 0) {
        this.state.match3.stars = Math.max(0, this.state.match3.stars - 1);
      }

      const built = this.state.buildings[this.state.buildings.length - 1];
      const waitSec =
        built && built.constructEndsAt > Date.now()
          ? Math.ceil((built.constructEndsAt - Date.now()) / 1000)
          : 0;
      const waitTag = waitSec > 0 ? ` (⏳ hoàn tất sau ${formatDurationCompactVi(waitSec)} thực tế)` : '';

      this.claimQuest(story.id);
      this.launchFireworksShow(4);
      const msg = `🔨 Đã khởi công "${item.name}"${waitTag} & hoàn thành "${story.title}" (+${story.rewardGalleons}G)!`;
      this.onToast?.(msg, '🔨');
      return {
        ok: true,
        msg,
        placedGx: spot.gx + item.width * 0.5,
        placedGy: spot.gy + item.height * 0.5,
      };
    }

    return {
      ok: false,
      reason: 'open_match3',
      msg: `🧩 Hãy tích lũy XP từ Công Viên & Tháp Giải Đố để hoàn thành "${story.title}"!`,
    };
  }

  public canStartMatch3Level(): { ok: boolean; msg?: string } {
    this.tickMatch3Hearts(Date.now());
    if (this.state.sandboxMode || this.state.match3.hearts > 0) {
      return { ok: true };
    }
    const leftSec = Math.max(1, Math.ceil((this.state.match3.nextHeartAt - Date.now()) / 1000));
    const mins = Math.floor(leftSec / 60);
    const secs = String(leftSec % 60).padStart(2, '0');
    return {
      ok: false,
      msg: `Đã hết ❤️ Tim! Tự hồi 1 Tim sau ${mins}:${secs}, hoặc dùng ${REFILL_HEARTS_GOLD_COST}G / Bia Bơ để hồi đầy ngay!`,
    };
  }

  public loseMatch3Heart(): void {
    if (this.state.sandboxMode) return;
    const m3 = this.state.match3;
    const now = Date.now();
    this.tickMatch3Hearts(now);
    if (m3.hearts > 0) {
      m3.hearts -= 1;
      if (m3.hearts < MAX_MATCH3_HEARTS && !m3.nextHeartAt) {
        m3.nextHeartAt = now + HEART_REGEN_MS;
      }
    }
    m3.winStreak = 0;
    this.saveToStorage();
    this.onUiChange?.();
  }

  public refillMatch3Hearts(): { ok: boolean; msg: string } {
    this.tickMatch3Hearts(Date.now());
    const m3 = this.state.match3;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      return { ok: false, msg: 'Tim của bạn đang đầy 5/5 ❤️ rồi!' };
    }
    // Check if player has Aged Butterbeer in stock first (free heart refill!)
    if ((this.state.supply.goods.aged_butterbeer ?? 0) >= 1) {
      return this.useCraftedGood('aged_butterbeer');
    }
    if (!this.state.sandboxMode && this.state.galleons < REFILL_HEARTS_GOLD_COST) {
      return {
        ok: false,
        msg: `Cần ${REFILL_HEARTS_GOLD_COST} Galleon (hoặc 1 Thùng Bia Bơ Ủ Tuyết) để hồi đầy 5 ❤️ Tim!`,
      };
    }
    if (!this.state.sandboxMode) {
      this.state.galleons -= REFILL_HEARTS_GOLD_COST;
    }
    m3.hearts = MAX_MATCH3_HEARTS;
    m3.nextHeartAt = 0;
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '❤️ Đã hồi đầy 5/5 Tim Phép Thuật — Sẵn sàng chinh phục tháp!' };
  }

  public buyMatch3ExtraMoves(levelOverride?: number): { ok: boolean; msg: string; cost: number } {
    const lv = levelOverride ?? this.state.match3.currentLevel;
    const cost = getExtraMovesGoldCost(lv);
    if (!this.state.sandboxMode && this.state.galleons < cost) {
      return {
        ok: false,
        cost,
        msg: `Cần ${cost} Galleon từ Điền Trang để mua thêm +5 Lượt Đi!`,
      };
    }
    if (!this.state.sandboxMode) {
      this.state.galleons -= cost;
    }
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, cost, msg: `🪄 Đã cộng thêm +5 Lượt Đi (-${cost}G) & giữ vững Chuỗi Thắng!` };
  }

  public spendOrBuyMatch3Booster(boosterId: Match3BoosterId): { ok: boolean; msg: string } {
    const def = MATCH3_BOOSTERS.find((b) => b.id === boosterId);
    if (!def) return { ok: false, msg: 'Bùa không hợp lệ.' };

    const curQty = this.state.match3.boosters[boosterId] ?? 0;
    if (this.state.sandboxMode) {
      return { ok: true, msg: `Đã kích hoạt ${def.name}!` };
    }
    if (curQty > 0) {
      this.state.match3.boosters[boosterId] = curQty - 1;
      this.saveToStorage();
      this.onUiChange?.();
      return { ok: true, msg: `Đã dùng 1 ${def.emoji} ${def.name}!` };
    }
    if (this.state.galleons < def.goldCost) {
      return {
        ok: false,
        msg: `Hết ${def.shortLabel} — Cần ${def.goldCost}G từ Công Viên để mua & dùng ngay!`,
      };
    }
    this.state.galleons -= def.goldCost;
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Đã mua & kích hoạt ${def.emoji} ${def.name} (-${def.goldCost}G)!` };
  }

  public ensureMinigameLeaderboard(): MinigameLeaderboardState {
    this.ensureNeighborSocial();
    return ensureMinigameLeaderboardState(this.state);
  }

  public getPlayerHouse(): HouseName {
    this.ensureMinigameLeaderboard();
    return getPlayerHogwartsHouse(this.state);
  }

  public setPlayerHouse(house: HouseName, activeGameId?: LeaderboardGameId): HouseName {
    this.ensureMinigameLeaderboard();
    const chosen = setPlayerHogwartsHouse(this.state, house);
    const meta = HOGWARTS_HOUSE_META[chosen];
    this.audio.playSpell();
    this.onToast?.(
      `${meta.mascotEmoji} Đã gia nhập ${meta.vnTitle} (${chosen}) — Đồng Hồ Cát ${meta.gemNameVi}!`,
      meta.mascotEmoji
    );
    this.saveToStorage();
    this.onUiChange?.();
    if (activeGameId && isScoredLeaderboardGame(activeGameId)) {
      void submitPlayerCloudLeaderboardEntry(this.state, activeGameId);
    }
    return chosen;
  }

  public rollPlayerSortingHat(activeGameId?: LeaderboardGameId): HouseName {
    this.ensureMinigameLeaderboard();
    const chosen = rollSortingHatHouse(this.state);
    const meta = HOGWARTS_HOUSE_META[chosen];
    this.audio.playLevelUp();
    this.onToast?.(
      `🎩 Chiếc Nón Phân Loại hô vang: "${chosen.toUpperCase()} — ${meta.vnTitle}!" ${meta.quoteVi}`,
      '🎩'
    );
    this.saveToStorage();
    this.onUiChange?.();
    if (activeGameId && isScoredLeaderboardGame(activeGameId)) {
      void submitPlayerCloudLeaderboardEntry(this.state, activeGameId);
    }
    return chosen;
  }

  public getMinigameLeaderboard(
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley',
    houseFilter: 'all' | HouseName = 'all'
  ): LeaderboardStandingResult {
    this.ensureNeighborSocial();
    const scoredGameId = normalizeScoredLeaderboardGame(gameId);
    return buildMinigameLeaderboard(
      this.state,
      scoredGameId,
      scope,
      getCachedCloudLeaderboardEntries(scoredGameId),
      houseFilter
    );
  }

  public getPlayerMinigameRank(
    gameId: LeaderboardGameId,
    scope: Exclude<LeaderboardScope, 'personal'> = 'valley'
  ): number {
    return this.getMinigameLeaderboard(gameId, scope).playerRank;
  }

  public getAllPersonalLeaderboardSummaries(): PersonalDisciplineSummaryRow[] {
    this.ensureNeighborSocial();
    return buildAllPersonalRecordsSummary(this.state, getAllCachedCloudLeaderboards());
  }

  public completeMatch3LevelVictory(
    bonusCoinsFromMoves = 0,
    sessionMetrics?: { sessionScore?: number }
  ): {
    starsEarned: number;
    goldEarned: number;
    xpEarned: number;
    sandEarned: number;
    boosterReward?: Match3BoosterId;
    nextLevel: number;
    featuredBonusApplied: boolean;
    newMasterLevel: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
  } {
    const prevLbRank = this.getPlayerMinigameRank('match3', 'valley');
    const m3 = this.state.match3;
    const pa = this.state.puzzleArcade;
    const playedStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, m3.currentLevel ?? 1));
    const prevCleared = Math.max(
      0,
      Math.min(MAX_MINIGAME_STAGE, m3.maxClearedLevel ?? Math.max(0, playedStage - 1))
    );
    const isFirstClear = prevCleared < MAX_MINIGAME_STAGE && playedStage > prevCleared;

    const def = getMatch3LevelDef(playedStage);
    const reqBefore = this.getRequiredLevelTrial();
    const featuredBonusApplied = Boolean(
      isFirstClear &&
        reqBefore &&
        reqBefore.kind === 'match3' &&
        !this.state.sandboxMode &&
        !this.isHeadmasterPreview
    );

    const streakMult = 1 + Math.min(3, m3.winStreak ?? 0) * 0.15;
    let starsEarned = 0;
    let sandEarned = 0;
    let goldEarned = 0;
    let xpEarned = 0;
    let boosterReward: Match3BoosterId | undefined;

    if (isFirstClear) {
      let featuredBonusStars = 0;
      if (featuredBonusApplied) {
        pa.featuredWinsCount = (pa.featuredWinsCount ?? 0) + 1;
        if ((this.state.featuredStarClaimedLevel ?? 0) < this.state.level) {
          featuredBonusStars += 1;
          this.state.featuredStarClaimedLevel = this.state.level;
        }
        if (pa.featuredWinsCount % 5 === 0) {
          featuredBonusStars += 1;
        }
      }
      starsEarned = def.starReward + featuredBonusStars;
      sandEarned = def.bonusSandReward + (featuredBonusApplied ? 1 : 0);
      goldEarned = Math.round(
        (def.goldReward + Math.max(0, Math.round(bonusCoinsFromMoves))) *
          streakMult *
          (featuredBonusApplied ? 1.35 : 1)
      );
      xpEarned = def.xpReward;
      boosterReward = def.bonusBoosterReward;

      m3.maxClearedLevel = Math.min(MAX_MINIGAME_STAGE, playedStage);
      m3.currentLevel = Math.min(MAX_MINIGAME_STAGE, playedStage + 1);
      m3.stars += starsEarned;
      m3.totalStarsEarned += starsEarned;
      if (boosterReward) {
        m3.boosters[boosterReward] = (m3.boosters[boosterReward] ?? 0) + 1;
      }
    } else {
      m3.currentLevel = MAX_MINIGAME_STAGE;
      m3.maxClearedLevel = MAX_MINIGAME_STAGE;
      goldEarned = Math.max(
        20,
        Math.round((def.goldReward + Math.max(0, Math.round(bonusCoinsFromMoves))) * 0.5)
      );
      xpEarned = Math.max(10, Math.round(def.xpReward * 0.5));
    }

    m3.levelsWon += 1;
    m3.winStreak += 1;

    this.state.galleons += goldEarned;
    this.state.finance.harvestRevenue += goldEarned;
    this.state.timeSand += sandEarned;

    const lvRes = this.advanceMasterPuzzleLevel('match3', isFirstClear);
    this.addXp(xpEarned);
    this.addHarvestFeastPoints(isFirstClear ? (def.difficulty === 'boss' ? 40 : 28) : 14);
    this.recordQuestProgress('cast_spells', undefined, 3);
    if (isFirstClear && (def.difficulty === 'boss' || playedStage === MAX_MINIGAME_STAGE)) {
      this.launchFireworksShow(playedStage === MAX_MINIGAME_STAGE ? 18 : 10);
    }

    const rawReduceSec = isFirstClear
      ? (def.difficulty === 'boss' ? 3600 : def.difficulty === 'hard' ? 2700 : 1800) +
        (featuredBonusApplied ? 900 : 0)
      : 1200;
    const buildReduction = this.applyConstructionReductionFromGameplay(
      rawReduceSec,
      'Bùa Gặt Honeydukes'
    );

    const sessionPts = Math.max(
      1200 + playedStage * 95 + Math.max(0, Math.round(bonusCoinsFromMoves)) * 12,
      Math.round(sessionMetrics?.sessionScore ?? 0)
    );
    const leaderboardRankUp = recordMinigameSessionResult(this.state, 'match3', {
      clearedStage: m3.maxClearedLevel,
      sessionScore: sessionPts,
      efficiency: sessionPts,
      streak: m3.winStreak,
      previousRankOverride: prevLbRank,
    });
    void submitPlayerCloudLeaderboardEntry(this.state, 'match3');

    this.audio.playLevelUp();
    if (starsEarned > 0) this.onRewardFly?.('stars', starsEarned);
    if (goldEarned > 0) this.onRewardFly?.('galleons', goldEarned);
    if (sandEarned > 0) this.onRewardFly?.('sand', sandEarned);
    this.advanceTutorialStep('earn_magic_star');
    this.saveToStorage();
    this.onUiChange?.();

    return {
      starsEarned,
      goldEarned,
      xpEarned,
      sandEarned,
      boosterReward,
      nextLevel: m3.currentLevel,
      featuredBonusApplied,
      newMasterLevel: lvRes.newLevel,
      isMasterReplay: !isFirstClear,
      buildReduction,
      leaderboardRankUp,
    };
  }

  public spendPuzzleHelperGold(goldCost: number): { ok: boolean; msg: string } {
    const cost = Math.max(0, Math.round(goldCost));
    if (this.state.sandboxMode || cost === 0) {
      return { ok: true, msg: 'Đã kích hoạt trợ giúp phép thuật!' };
    }
    if (this.state.galleons < cost) {
      return {
        ok: false,
        msg: `Cần ${cost}G từ Trang Trại (Đơn Hàng Cú & Thu Hoạch) để dùng thêm trợ giúp!`,
      };
    }
    this.state.galleons -= cost;
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: `Đã dùng ${cost}G kích hoạt trợ giúp phép thuật!` };
  }

  public getPhoenixTalismanCount(): number {
    return Math.max(
      0,
      Math.min(MAX_PHOENIX_TALISMANS, Math.floor(this.state.phoenixTalismans ?? 0))
    );
  }

  public grantPhoenixTalisman(qty = 1): number {
    const cur = this.getPhoenixTalismanCount();
    const next = Math.max(cur, Math.min(MAX_PHOENIX_TALISMANS, cur + Math.max(0, Math.floor(qty))));
    const added = next - cur;
    this.state.phoenixTalismans = next;
    return added;
  }

  public consumePhoenixTalisman(): { ok: boolean; msg: string } {
    if (this.state.sandboxMode) {
      return { ok: true, msg: '🔥 Đã kích hoạt Bùa Trợ Chiến Phượng Hoàng!' };
    }
    const cur = this.getPhoenixTalismanCount();
    if (cur <= 0) {
      return {
        ok: false,
        msg: 'Chưa có 🔥 Bùa Phượng Hoàng — hãy niệm đúng 8 câu Thần Chú Đa Ngữ, giao Đơn Cú hoặc rèn tại Kho Nông Sản!',
      };
    }
    this.state.phoenixTalismans = cur - 1;
    if (typeof this.audio.playTalismanBlast === 'function') {
      this.audio.playTalismanBlast();
    } else {
      this.audio.playSpell();
    }
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '🔥 Đã kích hoạt Bùa Trợ Chiến Phượng Hoàng!' };
  }

  public getCraftablePhoenixBarnGood(): FarmGoodId | null {
    for (const gid of PHOENIX_FORGE_ELIGIBLE_GOODS) {
      if (this.getFarmItemCount(gid) >= 1) return gid;
    }
    return null;
  }

  public craftPhoenixTalismanFromBarn(): { ok: boolean; msg: string } {
    const cur = this.getPhoenixTalismanCount();
    if (cur >= MAX_PHOENIX_TALISMANS) {
      return {
        ok: false,
        msg: `Túi Bùa Phượng Hoàng đã đầy tối đa (${MAX_PHOENIX_TALISMANS}/${MAX_PHOENIX_TALISMANS} 🔥)!`,
      };
    }
    const gid = this.getCraftablePhoenixBarnGood();
    if (!this.state.sandboxMode) {
      if (!gid) {
        return {
          ok: false,
          msg: 'Cần ít nhất 1 thành phẩm Xưởng (Bánh Táo, Bánh Bí Ngô, Mật Ong, Bia Bơ...) trong Kho Nông Sản để rèn Bùa Phượng Hoàng!',
        };
      }
      if (this.state.galleons < PHOENIX_FORGE_GOLD_COST) {
        return {
          ok: false,
          msg: `Cần ${PHOENIX_FORGE_GOLD_COST}G + 1 thành phẩm Xưởng để rèn 1 🔥 Bùa Phượng Hoàng!`,
        };
      }
      this.consumeFarmItemFromBarn(gid, 1);
      this.state.galleons -= PHOENIX_FORGE_GOLD_COST;
      this.state.finance.constructionSpent += PHOENIX_FORGE_GOLD_COST;
    }

    const usedMeta = gid ? FARM_GOODS[gid] : null;
    this.grantPhoenixTalisman(1);
    this.addXp(18);
    this.audio.playLevelUp();
    const msg = usedMeta
      ? `🔥 Đã rèn +1 Bùa Trợ Chiến Phượng Hoàng từ 1 ${usedMeta.emoji} ${usedMeta.name} & ${PHOENIX_FORGE_GOLD_COST}G (Đang có: ${this.getPhoenixTalismanCount()}/${MAX_PHOENIX_TALISMANS})!`
      : `🔥 Đã rèn +1 Bùa Trợ Chiến Phượng Hoàng (Đang có: ${this.getPhoenixTalismanCount()}/${MAX_PHOENIX_TALISMANS})!`;
    this.onToast?.(msg, '🔥');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public completePuzzleArcadeVictory(
    mode: PuzzleArcadeMode,
    reward: PuzzleRewardSpec,
    sessionMetrics?: { sessionScore?: number; efficiency?: number }
  ): {
    starsEarned: number;
    sandEarned: number;
    goldEarned: number;
    xpEarned: number;
    newlyRestoredPainting: boolean;
    nextStage: number;
    featuredBonusApplied: boolean;
    newMasterLevel: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
  } {
    const isScoredMode = isScoredLeaderboardGame(mode);
    const prevLbRank = isScoredMode ? this.getPlayerMinigameRank(mode, 'valley') : 0;
    const pa = this.state.puzzleArcade;
    const m3 = this.state.match3;

    const infoBefore = this.getDisciplineStageInfo(mode);
    const playedStage = infoBefore.currentStage;
    const prevCleared = infoBefore.clearedStages;
    const isFirstClear = prevCleared < MAX_MINIGAME_STAGE && playedStage > prevCleared;

    const reqBefore = this.getRequiredLevelTrial();
    const featuredBonusApplied = Boolean(
      isFirstClear &&
        reqBefore &&
        reqBefore.kind === mode &&
        !this.state.sandboxMode &&
        !this.isHeadmasterPreview
    );

    const streakMult = 1 + Math.min(3, m3.winStreak ?? 0) * 0.15;
    let starsEarned = 0;
    let sandEarned = 0;
    let goldEarned = 0;
    let xpEarned = 0;

    if (isFirstClear) {
      const baseStars = Math.max(1, Math.round(reward.stars));
      let featuredBonusStars = 0;
      if (featuredBonusApplied) {
        pa.featuredWinsCount = (pa.featuredWinsCount ?? 0) + 1;
        if ((this.state.featuredStarClaimedLevel ?? 0) < this.state.level) {
          featuredBonusStars += 1;
          this.state.featuredStarClaimedLevel = this.state.level;
        }
        if (pa.featuredWinsCount % 5 === 0) {
          featuredBonusStars += 1;
        }
      }
      starsEarned = baseStars + featuredBonusStars;
      sandEarned = Math.max(0, Math.round(reward.sand)) + (featuredBonusApplied ? 1 : 0);
      goldEarned = Math.round(
        Math.max(0, reward.gold) * streakMult * (featuredBonusApplied ? 1.35 : 1)
      );
      xpEarned = Math.max(0, Math.round(reward.xp));

      m3.stars += starsEarned;
      m3.totalStarsEarned += starsEarned;
    } else {
      goldEarned = Math.max(18, Math.round(Math.max(0, reward.gold) * 0.5));
      xpEarned = Math.max(10, Math.round(Math.max(0, reward.xp) * 0.5));
    }

    m3.winStreak = (m3.winStreak ?? 0) + 1;
    this.state.timeSand += sandEarned;
    this.state.galleons += goldEarned;
    this.state.finance.harvestRevenue += goldEarned;

    pa.activeMode = mode;
    pa.totalPuzzlesSolved += 1;

    const nextStage = isFirstClear
      ? Math.min(MAX_MINIGAME_STAGE, playedStage + 1)
      : MAX_MINIGAME_STAGE;
    const newCleared = isFirstClear
      ? Math.min(MAX_MINIGAME_STAGE, playedStage)
      : MAX_MINIGAME_STAGE;

    if (mode === 'sudoku') {
      pa.sudokuStage = nextStage;
      pa.sudokuCleared = newCleared;
    } else if (mode === 'caro') {
      pa.caroStage = nextStage;
      pa.caroCleared = newCleared;
    } else if (mode === 'chess') {
      pa.chessStage = nextStage;
      pa.chessCleared = newCleared;
    } else {
      pa.blockStage = nextStage;
      pa.blockCleared = newCleared;
    }

    let newlyRestoredPainting = false;
    if (isFirstClear && reward.paintingId && !pa.restoredPaintings.includes(reward.paintingId)) {
      pa.restoredPaintings.push(reward.paintingId);
      newlyRestoredPainting = true;
    }

    const lvRes = this.advanceMasterPuzzleLevel(mode, isFirstClear);
    this.addXp(xpEarned);
    this.addHarvestFeastPoints(isFirstClear ? (playedStage % 25 === 0 ? 40 : 28) : 14);
    this.recordQuestProgress('cast_spells', undefined, 2);
    if (isFirstClear && playedStage === MAX_MINIGAME_STAGE) {
      this.launchFireworksShow(18);
    }

    const rawReduceSec = isFirstClear
      ? (playedStage % 10 === 0 ? 3600 : playedStage % 5 === 0 ? 2700 : 1800) +
        (featuredBonusApplied ? 900 : 0)
      : 1200;
    const buildReduction = this.applyConstructionReductionFromGameplay(
      rawReduceSec,
      'Đại Sảnh Khảo Thí'
    );

    let leaderboardRankUp: LeaderboardRankChange | undefined;
    if (isScoredMode) {
      const sessionPts = Math.max(
        950 + playedStage * 80,
        Math.round(sessionMetrics?.sessionScore ?? 0)
      );
      leaderboardRankUp = recordMinigameSessionResult(this.state, mode, {
        clearedStage: newCleared,
        sessionScore: sessionPts,
        efficiency: sessionMetrics?.efficiency,
        streak: m3.winStreak,
        previousRankOverride: prevLbRank,
      });
      void submitPlayerCloudLeaderboardEntry(this.state, mode);
    }

    this.audio.playLevelUp();
    if (starsEarned > 0) this.onRewardFly?.('stars', starsEarned);
    if (goldEarned > 0) this.onRewardFly?.('galleons', goldEarned);
    if (sandEarned > 0) this.onRewardFly?.('sand', sandEarned);
    this.advanceTutorialStep('earn_magic_star');
    this.saveToStorage();
    this.onUiChange?.();

    return {
      starsEarned,
      sandEarned,
      goldEarned,
      xpEarned,
      newlyRestoredPainting,
      nextStage,
      featuredBonusApplied,
      newMasterLevel: lvRes.newLevel,
      isMasterReplay: !isFirstClear,
      buildReduction,
      leaderboardRankUp,
    };
  }

  public claimOwlPostDelivery(gx: number, gy: number): void {
    const gold = Math.round(28 + Math.min(60, this.state.level * 2.5));
    const xp = Math.round(8 + Math.min(24, this.state.level * 1.2));
    if (!this.state.sandboxMode) {
      this.state.galleons += gold;
      this.state.finance.harvestRevenue += gold;
    }
    this.addXp(xp);
    this.audio.playOwlHoot(0.036);
    this.audio.playCardFound();
    this.onRewardFly?.('galleons', gold, gx, gy);
    this.spawnFloatingText(gx, gy, `🦉 Bưu kiện Cú +${gold}G +${xp}⭐`, '#fde047');
    this.onToast?.(
      `🦉 Cú Tuyết vừa chuyển phát bưu kiện ấm áp từ Hogsmeade (+${gold} Vàng Galleon, +${xp} XP)!`,
      '🦉'
    );
    this.saveToStorage();
    this.onUiChange?.();
  }

  // ==================== HỆ THỐNG NÔNG TRẠI HANG SÓC (CANON PLAYRIX TOWNSHIP FARM LOOP) ====================

  public ensureFarmBarn(): FarmBarnState {
    if (!this.state.farmBarn) {
      this.state.farmBarn = createInitialFarmBarnState();
    }
    return this.state.farmBarn;
  }

  public getBarnTotalUsed(): number {
    const barn = this.ensureFarmBarn();
    const cropSum = Object.values(barn.crops).reduce((a, b) => a + (b || 0), 0);
    const goodSum = Object.values(barn.goods).reduce((a, b) => a + (b || 0), 0);
    return cropSum + goodSum;
  }

  public getFarmItemCount(itemId: FarmItemId): number {
    const barn = this.ensureFarmBarn();
    if (itemId in FARM_CROPS) {
      return barn.crops[itemId as FarmCropId] ?? 0;
    }
    return barn.goods[itemId as FarmGoodId] ?? 0;
  }

  public addFarmItemToBarn(itemId: FarmItemId, qty: number): number {
    if (qty <= 0) return 0;
    const barn = this.ensureFarmBarn();
    const used = this.getBarnTotalUsed();
    const space = Math.max(0, barn.capacity - used);
    const actual = Math.min(qty, Math.max(1, space)); // Always allow at least 1 if barn just hit cap, or clamp cleanly
    const safeAdd = space <= 0 ? 0 : actual;
    if (safeAdd <= 0) {
      return 0;
    }
    if (itemId in FARM_CROPS) {
      const cid = itemId as FarmCropId;
      barn.crops[cid] = (barn.crops[cid] ?? 0) + safeAdd;
    } else {
      const gid = itemId as FarmGoodId;
      barn.goods[gid] = (barn.goods[gid] ?? 0) + safeAdd;
    }
    return safeAdd;
  }

  private consumeFarmItemFromBarn(itemId: FarmItemId, qty: number): void {
    const barn = this.ensureFarmBarn();
    if (itemId in FARM_CROPS) {
      const cid = itemId as FarmCropId;
      barn.crops[cid] = Math.max(0, (barn.crops[cid] ?? 0) - qty);
    } else {
      const gid = itemId as FarmGoodId;
      barn.goods[gid] = Math.max(0, (barn.goods[gid] ?? 0) - qty);
    }
  }

  public upgradeFarmBarn(): { ok: boolean; msg: string } {
    const barn = this.ensureFarmBarn();
    const tier = Math.max(1, Math.round((barn.capacity - 40) / 20));
    const goldCost = 160 + tier * 90;
    const plugCost = 1;
    const curPlugs = barn.goods.muggle_plug_kit ?? 0;

    if (!this.state.sandboxMode) {
      if (curPlugs < plugCost && this.state.galleons < goldCost + 120) {
        return {
          ok: false,
          msg: `Cần ${plugCost} 🔌 Bộ Phích Cắm Muggle (từ Chòi Ông Arthur / Đơn Cú) & ${goldCost}G để nới rộng Kho!`,
        };
      }
      if (curPlugs >= plugCost) {
        if (this.state.galleons < goldCost) {
          return { ok: false, msg: `Cần ${goldCost} Galleon để nâng cấp Kho Nông Sản (+20 ô)!` };
        }
        barn.goods.muggle_plug_kit = Math.max(0, curPlugs - plugCost);
        this.state.galleons -= goldCost;
      } else {
        this.state.galleons -= goldCost + 120;
      }
    }

    barn.capacity += 20;
    this.addXp(45);
    this.audio.playLevelUp();
    const msg = `🏡 Kho Nông Sản Hang Sóc đã mở rộng lên ${barn.capacity} ô chứa (+45 ⭐)!`;
    this.onToast?.(msg, '🏡');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public sellFarmItemFromBarn(itemId: FarmItemId, qty = 1): { ok: boolean; msg: string } {
    const have = this.getFarmItemCount(itemId);
    const take = Math.min(have, Math.max(1, qty));
    if (take <= 0) {
      return { ok: false, msg: 'Không còn mặt hàng này trong Kho Nông Sản!' };
    }
    const meta = getFarmItemMeta(itemId);
    this.consumeFarmItemFromBarn(itemId, take);
    const gold = meta.sellValue * take;
    const xp = Math.max(2, Math.round(meta.sellValue * 0.25 * take));
    this.state.galleons += gold;
    this.state.finance.shopRevenue += gold;
    this.addXp(xp);
    this.audio.playHarvestBubble();
    const msg = `🪙 Đã bán ${take} ${meta.emoji} ${meta.name} thu về +${gold}G & +${xp} ⭐!`;
    this.onToast?.(msg, meta.emoji);
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public ensureLanguageQuiz(): LanguageQuizState {
    if (!this.state.languageQuiz) {
      this.state.languageQuiz = createInitialLanguageQuizState();
    }
    return this.state.languageQuiz;
  }

  public getSeedCount(cropId: FarmCropId): number {
    const barn = this.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    return Math.max(0, Math.floor(barn.seeds[cropId] ?? 0));
  }

  public addCropSeeds(cropId: FarmCropId, qty: number): number {
    const barn = this.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    const add = Math.max(0, Math.floor(qty));
    barn.seeds[cropId] = Math.max(0, (barn.seeds[cropId] ?? 0) + add);
    return barn.seeds[cropId] ?? 0;
  }

  public buyCropSeedWithGold(
    cropId: FarmCropId,
    qty = 1
  ): { ok: boolean; msg: string; newSeedCount: number } {
    const crop = FARM_CROPS[cropId];
    if (!this.state.sandboxMode && this.state.level < crop.unlockLevel) {
      return {
        ok: false,
        msg: `${crop.emoji} ${crop.name} mở khóa ở Cấp ${crop.unlockLevel}!`,
        newSeedCount: this.getSeedCount(cropId),
      };
    }
    const count = Math.max(1, Math.min(20, Math.floor(qty)));
    const totalCost = crop.seedCost * count;
    if (this.state.galleons < totalCost) {
      return {
        ok: false,
        msg: `Cần ${totalCost.toLocaleString('vi-VN')}G để mua ${count} hạt ${crop.name} — hãy niệm Thần Chú Đa Ngữ (0G) để nhận ngay 1–2 hạt miễn phí!`,
        newSeedCount: this.getSeedCount(cropId),
      };
    }

    this.state.galleons -= totalCost;
    this.state.finance.constructionSpent += totalCost;
    const newSeedCount = this.addCropSeeds(cropId, count);
    this.audio.playHarvestBubble();
    this.advanceTutorialStep('seed_quiz_or_buy');
    const msg = `🪙 Đã mua ${count} hạt giống ${crop.emoji} ${crop.name} (-${totalCost.toLocaleString('vi-VN')}G • Túi có: ${newSeedCount} hạt)!`;
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg, newSeedCount };
  }

  public completeSeedLanguageQuizAttempt(
    cropId: FarmCropId,
    challenge: ActiveQuizChallenge,
    correct: boolean
  ): QuizAttemptOutcome & { newSeedCount: number; cropName: string } {
    const quiz = this.ensureLanguageQuiz();
    const crop = FARM_CROPS[cropId];
    const outcome = recordQuizAttempt(quiz, challenge, correct);
    let newSeedCount = this.getSeedCount(cropId);
    if (outcome.seedsAwarded > 0) {
      newSeedCount = this.addCropSeeds(cropId, outcome.seedsAwarded);
    }
    if (outcome.xpAwarded > 0) {
      this.addXp(outcome.xpAwarded);
    }

    let phoenixTalismanAwarded = 0;
    let buildReduction: BuildReductionResult | undefined;
    const leaderboardRankUp: LeaderboardRankChange | undefined = undefined;
    let talismanProgress = Math.max(0, Math.min(7, Math.floor(this.state.quizTalismanProgress ?? 0)));
    if (correct) {
      const nextProg = talismanProgress + 1;
      if (nextProg >= 8) {
        talismanProgress = 0;
        this.state.quizTalismanProgress = 0;
        phoenixTalismanAwarded = this.grantPhoenixTalisman(1);
      } else {
        talismanProgress = nextProg;
        this.state.quizTalismanProgress = nextProg;
      }
      const quizReduceSec =
        (challenge.tier === 'advanced' ? 1200 : challenge.tier === 'intermediate' ? 900 : 600) +
        (outcome.newStreak >= 3 ? 300 : 0) +
        (challenge.isReview ? 300 : 0);
      buildReduction = this.applyConstructionReductionFromGameplay(
        quizReduceSec,
        'Học Viện Thần Chú'
      );
      this.addHarvestFeastPoints(challenge.tier === 'advanced' ? 12 : 9);
      if (outcome.tierAutoPromoted || phoenixTalismanAwarded > 0) {
        this.audio.playLevelUp();
      } else {
        this.audio.playMatchPop(outcome.seedsAwarded);
      }
      this.advanceTutorialStep('seed_quiz_or_buy');
    } else {
      this.audio.playClick();
    }
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ...outcome,
      phoenixTalismanAwarded,
      talismanProgress,
      buildReduction,
      leaderboardRankUp,
      newSeedCount,
      cropName: crop.name,
    };
  }

  public plantCropOnPlot(
    uid: string,
    cropId: FarmCropId
  ): { ok: boolean; needSeedAcquire?: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể gieo hạt trên ruộng của bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy thửa đất canh tác!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isFarmlandPlot) return { ok: false, msg: 'Công trình này không phải thửa đất canh tác!' };
    if (b.cropId) {
      return { ok: false, msg: 'Thửa đất đã có hạt giống đang mọc!' };
    }

    const crop = FARM_CROPS[cropId];
    if (!this.state.sandboxMode && this.state.level < crop.unlockLevel) {
      return { ok: false, msg: `${crop.emoji} ${crop.name} mở khóa ở Cấp ${crop.unlockLevel}!` };
    }

    const haveSeeds = this.getSeedCount(cropId);
    if (haveSeeds <= 0) {
      return {
        ok: false,
        needSeedAcquire: true,
        msg: `Túi chưa có hạt giống ${crop.emoji} ${crop.name} — hãy chọn Mua Vàng (${crop.seedCost.toLocaleString('vi-VN')}G/hạt) hoặc Niệm Thần Chú Đa Ngữ (0G)!`,
      };
    }

    const barn = this.ensureFarmBarn();
    if (!barn.seeds) barn.seeds = {};
    const leftSeeds = Math.max(0, haveSeeds - 1);
    barn.seeds[cropId] = leftSeeds;

    const now = Date.now();
    const growMs = this.state.sandboxMode ? 4000 : crop.growSec * 1000;
    b.cropId = cropId;
    b.cropPlantedAt = now;
    b.cropReadyAt = now + growMs;
    b.cropWateredBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    this.audio.playPlace();
    this.onBuildingTactile?.(b.uid);
    this.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🌱 Gieo ${crop.emoji} ${crop.name} (còn ${leftSeeds} hạt)!`,
      '#86efac'
    );
    this.advanceTutorialStep('sow_and_merge_plot');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🌱 Đã gieo 1 hạt ${crop.emoji} ${crop.name} (Túi còn ${leftSeeds} hạt • ${formatDurationCompactVi(crop.growSec)} chín)!`,
    };
  }

  public waterCropPlot(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return this.helpVisitedNeighborBuilding(uid);
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.cropId || !b.cropReadyAt) {
      return { ok: false, msg: 'Thửa ruộng chưa gieo hạt giống!' };
    }
    const now = Date.now();
    if (now >= b.cropReadyAt) {
      return { ok: false, msg: 'Nông sản đã chín vàng — hãy bấm Liềm Vàng để gặt ngay!' };
    }
    if (b.cropWateredBoost) {
      return { ok: false, msg: 'Luống cây này đã được tưới đẫm nước mát rồi!' };
    }
    const leftMs = b.cropReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.3));
    b.cropReadyAt = Math.max(now + 1000, b.cropReadyAt - savedMs);
    b.cropWateredBoost = true;
    this.addXp(4);
    if (typeof this.audio.playWaterSplash === 'function') {
      this.audio.playWaterSplash();
    } else {
      this.audio.playSpell();
    }
    this.onBuildingTactile?.(b.uid);
    this.spawnFloatingText(b.gx + 1, b.gy + 1, '💧 Aguamenti! Chín nhanh +30%!', '#38bdf8');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg: '💧 Đã tưới nước suối mát — cây lớn nhanh hơn 30% (+4 ⭐)!' };
  }

  public harvestCropPlot(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thu hoạch nông sản của bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.cropId || !b.cropReadyAt) {
      return { ok: false, msg: 'Thửa ruộng đang trống — hãy chọn hạt giống để gieo nhé!' };
    }
    const now = Date.now();
    if (now < b.cropReadyAt) {
      const left = Math.ceil((b.cropReadyAt - now) / 1000);
      return { ok: false, msg: `Cây đang lớn xanh tốt (${left}s nữa chín)!` };
    }

    const item = getCatalogItem(b.itemId);
    const crop = FARM_CROPS[b.cropId];
    const yieldQty = crop.yieldQty + (b.stars >= 3 ? 1 : 0);
    const added = this.addFarmItemToBarn(crop.id, yieldQty);
    const gold = crop.sellValue;
    const xp = crop.xp;

    // Clear plot to freshly-tilled dark loam ready for Seed Picker!
    b.cropId = undefined;
    b.cropPlantedAt = undefined;
    b.cropReadyAt = undefined;
    b.cropWateredBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    this.state.galleons += gold;
    this.state.finance.harvestRevenue += gold;
    this.state.stats.totalGalleonsHarvested += gold;
    this.addXp(xp);
    this.addHarvestFeastPoints(crop.isFlowerCrop ? 7 : 5);
    this.recordQuestProgress('harvest_galleons', undefined, gold);

    this.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 1);
    const cy = b.gy + (item ? item.height * 0.5 : 1);
    this.onRewardFly?.('galleons', gold, cx, cy);
    this.spawnFloatingText(
      cx,
      cy,
      added > 0
        ? `🌾 +${added} ${crop.emoji}  +${gold} 🪙  +${xp} ⭐`
        : `🏡 Kho đầy! Bán thẳng +${gold + 10} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (added === 0) {
      this.state.galleons += 10;
    }
    this.advanceTutorialStep('harvest_wheat');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg:
        added > 0
          ? `🌾 Đã gặt +${added} ${crop.emoji} ${crop.name} cất vào Kho Nông Sản (+${gold}G, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp thu +${gold + 10}G!`,
    };
  }

  public stockAnimalOnPasture(
    uid: string,
    animalId: PastureAnimalId
  ): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thả thú trên đồng cỏ bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy ô Đồng Cỏ Chăn Thả!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.isAnimalPasturePlot) {
      return { ok: false, msg: 'Công trình này không phải Đồng Cỏ Chăn Thả!' };
    }
    if (b.pastureAnimalId) {
      const cur = PASTURE_ANIMALS[b.pastureAnimalId];
      return {
        ok: false,
        msg: `Ô đồng cỏ này đang nuôi ${cur?.emoji ?? '🐾'} ${cur?.name ?? 'vật nuôi'} rồi!`,
      };
    }

    const animal = PASTURE_ANIMALS[animalId];
    if (!animal) return { ok: false, msg: 'Loài thú không hợp lệ!' };
    if (!this.state.sandboxMode && this.state.level < animal.unlockLevel) {
      return {
        ok: false,
        msg: `${animal.emoji} ${animal.name} mở khóa ở Cấp ${animal.unlockLevel}!`,
      };
    }
    if (!this.state.sandboxMode && this.state.galleons < animal.cost) {
      return {
        ok: false,
        msg: `Cần ${animal.cost.toLocaleString('vi-VN')} 🪙 Vàng để thả ${animal.emoji} ${animal.name} vào đồng cỏ!`,
      };
    }

    if (!this.state.sandboxMode) {
      this.state.galleons -= animal.cost;
    }

    const now = Date.now();
    const cycleMs = this.state.sandboxMode ? 5000 : animal.cycleSec * 1000;
    b.pastureAnimalId = animalId;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + cycleMs;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    this.audio.playPlace();
    this.onBuildingTactile?.(b.uid);
    this.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🐾 Thả ${animal.emoji} ${animal.name}!`,
      '#86efac'
    );
    this.advanceTutorialStep('pasture_harvest_and_stock');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🐾 Đã thả ${animal.emoji} ${animal.name} vào Đồng Cỏ Chăn Thả (${formatDurationCompactVi(animal.cycleSec)}/mẻ)!`,
    };
  }

  public feedAnimalPasture(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return this.helpVisitedNeighborBuilding(uid);
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId || !b.pastureReadyAt) {
      return { ok: false, msg: 'Đồng cỏ đang trống — hãy chọn thú để thả vào nhé!' };
    }
    const now = Date.now();
    if (now >= b.pastureReadyAt) {
      return { ok: false, msg: 'Sản vật đồng cỏ đã sẵn sàng — hãy bấm thu hoạch ngay!' };
    }
    if (b.pastureFedBoost) {
      return { ok: false, msg: 'Đàn thú trên đồng cỏ này đã được cho ăn no nê rồi!' };
    }
    const leftMs = b.pastureReadyAt - now;
    const savedMs = Math.max(3000, Math.round(leftMs * 0.35));
    b.pastureReadyAt = Math.max(now + 1000, b.pastureReadyAt - savedMs);
    b.pastureFedBoost = true;
    this.addXp(5);
    this.audio.playSpell();
    this.onBuildingTactile?.(b.uid);
    this.spawnFloatingText(b.gx + 1, b.gy + 1, '🌾 Cỏ Mật! Nhanh +35%!', '#86efac');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: '🌾 Đã cho đàn thú ăn cỏ ba lá mật — thu hoạch nhanh hơn 35% (+5 ⭐)!',
    };
  }

  public harvestAnimalPasture(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể thu hoạch đồng cỏ của bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId || !b.pastureReadyAt) {
      return { ok: false, msg: 'Đồng cỏ đang trống — hãy chọn thú để thả vào nhé!' };
    }
    const now = Date.now();
    if (now < b.pastureReadyAt) {
      const left = Math.ceil((b.pastureReadyAt - now) / 1000);
      return { ok: false, msg: `Đàn thú đang thong thả gặm cỏ (${left}s nữa thu hoạch)!` };
    }

    const item = getCatalogItem(b.itemId);
    const animal = PASTURE_ANIMALS[b.pastureAnimalId];
    const goodMeta = FARM_GOODS[animal.goodId];
    const yieldQty = animal.yieldQty + (b.stars >= 3 ? 1 : 0);
    const added = this.addFarmItemToBarn(animal.goodId, yieldQty);
    const gold = animal.sellValue;
    const xp = animal.xp;

    // Automatically restart the next grazing cycle so the animal stays happily on the pasture!
    const nextCycleMs = this.state.sandboxMode ? 5000 : animal.cycleSec * 1000;
    b.pastureStockedAt = now;
    b.pastureReadyAt = now + nextCycleMs;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;

    this.state.galleons += gold;
    this.state.finance.harvestRevenue += gold;
    this.state.stats.totalGalleonsHarvested += gold;
    this.addXp(xp);
    this.addHarvestFeastPoints(6);
    this.recordQuestProgress('harvest_galleons', undefined, gold);

    this.audio.playHarvestBubble();
    const cx = b.gx + (item ? item.width * 0.5 : 1);
    const cy = b.gy + (item ? item.height * 0.5 : 1);
    this.onRewardFly?.('galleons', gold, cx, cy);
    this.spawnFloatingText(
      cx,
      cy,
      added > 0
        ? `🐾 +${added} ${goodMeta.emoji}  +${gold} 🪙  +${xp} ⭐`
        : `🏡 Kho đầy! Bán thẳng +${gold + 12} 🪙  +${xp} ⭐`,
      '#fde047'
    );
    if (added === 0) {
      this.state.galleons += 12;
    }
    if (this.isTutorialActive() && this.state.tutorial?.stepId === 'pasture_harvest_and_stock') {
      this.state.tutorial.pastureHarvestedInStep3 = true;
      const hasEmptyPasture = this.state.buildings.some(
        (x) => getCatalogItem(x.itemId)?.isAnimalPasturePlot && !x.pastureAnimalId
      );
      if (!hasEmptyPasture) {
        this.advanceTutorialStep('pasture_harvest_and_stock');
      }
    }
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg:
        added > 0
          ? `🐾 Thu hoạch +${added} ${goodMeta.emoji} ${goodMeta.name} từ ${animal.name} (+${gold}G, +${xp} ⭐)!`
          : `🏡 Kho Nông Sản đã đầy — bán trực tiếp sản vật thu +${gold + 12}G!`,
    };
  }

  public clearAnimalFromPasture(uid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể đổi thú trên đồng cỏ bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.pastureAnimalId) {
      return { ok: false, msg: 'Đồng cỏ đang trống sẵn rồi!' };
    }
    const animal = PASTURE_ANIMALS[b.pastureAnimalId];
    const refund = Math.round((animal?.cost ?? 0) * 0.5);
    b.pastureAnimalId = null;
    b.pastureStockedAt = undefined;
    b.pastureReadyAt = undefined;
    b.pastureFedBoost = false;
    b.readyBubbles = 0;
    b.storedGalleons = 0;
    b.storedXp = 0;
    if (!this.state.sandboxMode && refund > 0) {
      this.state.galleons += refund;
    }
    this.audio.playClick();
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🐾 Đã đưa ${animal?.emoji ?? '🐾'} ${animal?.name ?? 'thú'} về chuồng nghỉ${refund > 0 ? ` (hoàn +${refund}G)` : ''} — có thể chọn thú mới!`,
    };
  }

  public getWorkshopRecipesForBuilding(item: CatalogItem): FarmWorkshopRecipe[] {
    if (!item.workshopGroupId) return [];
    return FARM_WORKSHOP_RECIPES.filter((r) => r.workshopGroupId === item.workshopGroupId);
  }

  public enqueueWorkshopRecipe(uid: string, recipeId: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Chế độ Khách Tham Quan — không thể đặt khay lò nhà bạn bè!' };
    }
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b) return { ok: false, msg: 'Không tìm thấy xưởng chế biến!' };
    const item = getCatalogItem(b.itemId);
    if (!item?.workshopGroupId) return { ok: false, msg: 'Công trình này không có lò chế biến!' };
    if (Date.now() < b.constructEndsAt) return { ok: false, msg: 'Xưởng đang hoàn thiện xây dựng!' };

    const recipe = FARM_WORKSHOP_RECIPES.find(
      (r) => r.id === recipeId && r.workshopGroupId === item.workshopGroupId
    );
    if (!recipe) return { ok: false, msg: 'Công thức không hợp lệ!' };

    const maxQueue = 3 + Math.min(2, Math.max(0, b.stars - 1));
    const curQueue = b.workshopQueue ?? [];
    if (curQueue.length >= maxQueue) {
      return { ok: false, msg: `Hàng đợi lò đã đầy (${maxQueue}/${maxQueue} khay)!` };
    }

    if (!this.state.sandboxMode) {
      if (this.state.level < recipe.unlockLevel) {
        return { ok: false, msg: `Công thức này mở khóa ở Cấp ${recipe.unlockLevel}!` };
      }
      for (const req of recipe.inputs) {
        const have = this.getFarmItemCount(req.itemId);
        if (have < req.qty) {
          const meta = getFarmItemMeta(req.itemId);
          return {
            ok: false,
            msg: `Thiếu ${req.qty - have} ${meta.emoji} ${meta.name} trong Kho Nông Sản!`,
          };
        }
      }
      for (const req of recipe.inputs) {
        this.consumeFarmItemFromBarn(req.itemId, req.qty);
      }
    }

    const now = Date.now();
    const starSpeed = Math.max(0.65, 1 - (b.stars - 1) * 0.08);
    const durMs = this.state.sandboxMode
      ? 3000
      : Math.max(5000, Math.round(recipe.craftSec * starSpeed * 1000));
    const startAt = curQueue.length > 0 ? Math.max(now, curQueue[curQueue.length - 1].endsAt) : now;
    const nextSlot = {
      goodId: recipe.goodId,
      startedAt: startAt,
      endsAt: startAt + durMs,
    };
    b.workshopQueue = [...curQueue, nextSlot];

    const outMeta = FARM_GOODS[recipe.goodId];
    this.audio.playPlace();
    this.onBuildingTactile?.(b.uid);
    this.spawnFloatingText(
      b.gx + item.width * 0.5,
      b.gy + item.height * 0.5,
      `🔥 Lên khay ${outMeta.emoji} ${outMeta.name}!`,
      '#fde047'
    );
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg: `🔥 Đã đưa ${outMeta.emoji} ${outMeta.name} vào lò (${Math.ceil(durMs / 1000)}s)!`,
    };
  }

  public speedUpWorkshopSlot(uid: string): boolean {
    if (this.isVisitingNeighbor) return false;
    const b = this.state.buildings.find((x) => x.uid === uid);
    if (!b || !b.workshopQueue || b.workshopQueue.length === 0) return false;
    if (!this.state.sandboxMode && this.state.timeSand < 1) {
      this.onToast?.('Cần 1 ⏳ Cát Xoay Thời Gian để ra lò ngay mẻ bánh hiện tại!', '⏳');
      return false;
    }
    if (!this.state.sandboxMode) {
      this.state.timeSand -= 1;
    }
    const now = Date.now();
    const savedMs = Math.max(0, b.workshopQueue[0].endsAt - now);
    b.workshopQueue[0].endsAt = now - 1;
    for (let i = 1; i < b.workshopQueue.length; i++) {
      b.workshopQueue[i].startedAt = Math.max(now, b.workshopQueue[i].startedAt - savedMs);
      b.workshopQueue[i].endsAt = Math.max(now + 1000, b.workshopQueue[i].endsAt - savedMs);
    }
    this.tickProductionToTimestamp(now, false);
    this.audio.playSpell();
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public getOwlRequirementHelpState(
    orderId: string,
    reqIndex: number
  ): NeighborSocialState['playerOwlHelpRequests'][number] | undefined {
    const social = this.ensureNeighborSocial();
    return social.playerOwlHelpRequests.find(
      (r) => r.orderId === orderId && r.reqIndex === reqIndex
    );
  }

  public canFulfillFarmOwlOrder(order: FarmOwlOrder): boolean {
    if (this.state.sandboxMode) return true;
    return order.requirements.every((req, reqIdx) => {
      const helped = this.getOwlRequirementHelpState(order.id, reqIdx);
      if (helped?.fulfilledAt) return true;
      return this.getFarmItemCount(req.itemId) >= req.qty;
    });
  }

  public getReadyOwlOrdersCount(): number {
    const barn = this.ensureFarmBarn();
    return barn.owlOrders.filter((o) => this.canFulfillFarmOwlOrder(o)).length;
  }

  public fulfillFarmOwlOrder(orderId: string): { ok: boolean; msg: string } {
    const barn = this.ensureFarmBarn();
    const idx = barn.owlOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return { ok: false, msg: 'Không tìm thấy đơn hàng Cú này!' };
    const order = barn.owlOrders[idx];

    if (!this.canFulfillFarmOwlOrder(order)) {
      const missing = order.requirements.find((r, reqIdx) => {
        const helped = this.getOwlRequirementHelpState(order.id, reqIdx);
        if (helped?.fulfilledAt) return false;
        return this.getFarmItemCount(r.itemId) < r.qty;
      });
      const mMeta = missing ? getFarmItemMeta(missing.itemId) : null;
      return {
        ok: false,
        msg: mMeta
          ? `Kho còn thiếu ${mMeta.emoji} ${mMeta.name} — hãy gieo trồng, nướng thêm hoặc bấm "🤝 Nhờ bạn" nhé!`
          : 'Chưa đủ nông sản trong Kho!',
      };
    }

    if (!this.state.sandboxMode) {
      for (let reqIdx = 0; reqIdx < order.requirements.length; reqIdx++) {
        const helped = this.getOwlRequirementHelpState(order.id, reqIdx);
        if (helped?.fulfilledAt) continue;
        const req = order.requirements[reqIdx];
        this.consumeFarmItemFromBarn(req.itemId, req.qty);
      }
    }

    const social = this.ensureNeighborSocial();
    social.playerOwlHelpRequests = social.playerOwlHelpRequests.filter(
      (r) => r.orderId !== order.id
    );

    this.state.galleons += order.rewardGalleons;
    this.state.finance.shopRevenue += order.rewardGalleons;
    this.state.stats.butterbeerServed += 1;
    if (order.rewardMugglePlug) {
      barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + order.rewardMugglePlug;
    }
    barn.ordersDelivered = (barn.ordersDelivered ?? 0) + 1;

    // Farm -> Mini-game Fuel: Feast Orders grant +1 Time Sand & every 2 Owl Orders gift +1 Booster!
    const sandBonus = order.isFeastMarquee ? 1 : 0;
    if (sandBonus > 0) {
      this.state.timeSand += sandBonus;
      this.onRewardFly?.('sand', sandBonus, 14.5, 19.5);
    }
    let boosterTag = '';
    if (barn.ordersDelivered % 2 === 0 && this.state.match3) {
      const cycle: Match3BoosterId[] = ['reparo_hammer', 'row_col_cannon', 'alohomora_shuffle'];
      const pick = cycle[(barn.ordersDelivered / 2) % cycle.length];
      this.state.match3.boosters[pick] = (this.state.match3.boosters[pick] ?? 0) + 1;
      const bMeta = MATCH3_BOOSTERS.find((b) => b.id === pick);
      if (bMeta) boosterTag = ` +1 ${bMeta.emoji} ${bMeta.shortLabel}`;
    }

    let talismanTag = '';
    if (order.isFeastMarquee || barn.ordersDelivered % 3 === 0) {
      if (this.grantPhoenixTalisman(1) > 0) {
        talismanTag = ' +1 🔥 Bùa Phượng Hoàng';
      }
    }

    this.addXp(order.rewardXp);
    this.addHarvestFeastPoints(order.isFeastMarquee ? 30 : 22);
    this.recordQuestProgress('serve_butterbeer', undefined, 1);
    this.recordQuestProgress('harvest_galleons', undefined, order.rewardGalleons);

    this.owlSeedCounter += 1;
    barn.owlOrders[idx] = createCanonFarmOwlOrder(this.state.level, this.owlSeedCounter + idx * 3);

    this.audio.playOwlHoot(0.045);
    this.audio.playHarvestBubble();
    this.onRewardFly?.('galleons', order.rewardGalleons, 14.5, 19.5);
    const plugTag = order.rewardMugglePlug ? ` +${order.rewardMugglePlug} 🔌 Phích Cắm` : '';
    const sandTag = sandBonus > 0 ? ` +${sandBonus} ⏳ Cát` : '';
    const msg = `🦉 Cú ${order.owlName} giao đơn cho ${order.senderName}! Nhận +${order.rewardGalleons}G${sandTag}${talismanTag}${boosterTag}${plugTag}!`;
    this.onToast?.(msg, '🦉');
    this.advanceTutorialStep('build_and_owl_order');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public refreshFarmOwlOrder(orderId: string): boolean {
    const barn = this.ensureFarmBarn();
    const idx = barn.owlOrders.findIndex((o) => o.id === orderId);
    if (idx === -1) return false;
    const social = this.ensureNeighborSocial();
    social.playerOwlHelpRequests = social.playerOwlHelpRequests.filter(
      (r) => r.orderId !== orderId
    );
    this.owlSeedCounter += 1;
    barn.owlOrders[idx] = createCanonFarmOwlOrder(this.state.level, this.owlSeedCounter + idx * 5);
    this.audio.playOwlHoot(0.03);
    this.onToast?.('🦉 Cú đưa thư vừa mang tới một mảnh giấy da cừu đặt hàng mới!', '✉️');
    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  // =========================================================================
  // HỆ THỐNG THAM QUAN, TƯƠNG TRỢ VƯỜN & GIẢI CỨU MÀN KHÓ (1 NGÀY 1 LẦN / BẠN)
  // =========================================================================

  public ensureNeighborSocial(): NeighborSocialState {
    if (!this.state.neighborSocial) {
      this.state.neighborSocial = createInitialNeighborSocialState();
    }
    if (Array.isArray(this.state.neighborSocial.neighbors)) {
      const filtered = this.state.neighborSocial.neighbors.filter((n) => !isNpcNeighborProfile(n));
      if (filtered.length !== this.state.neighborSocial.neighbors.length) {
        this.state.neighborSocial.neighbors = filtered;
      }
    } else {
      this.state.neighborSocial.neighbors = [];
    }
    if (Array.isArray(this.state.neighborSocial.homeLanternMarks)) {
      const cleanMarks = this.state.neighborSocial.homeLanternMarks.filter(
        (m) => Boolean(m && !CANON_NPC_NEIGHBOR_IDS.has(m.helperId))
      );
      if (cleanMarks.length !== this.state.neighborSocial.homeLanternMarks.length) {
        this.state.neighborSocial.homeLanternMarks = cleanMarks;
      }
    }
    syncNeighborSocialDailyReset(this.state.neighborSocial);
    if (this.homeStateWhileVisiting) {
      this.homeStateWhileVisiting.neighborSocial = this.state.neighborSocial;
    }
    return this.state.neighborSocial;
  }

  private pushSocialActivity(icon: string, textVi: string, now = Date.now()): void {
    const social = this.ensureNeighborSocial();
    social.activityLog = [
      {
        id: `slog_${now}_${Math.floor(Math.random() * 9999)}`,
        timestamp: now,
        icon,
        textVi,
      },
      ...social.activityLog,
    ].slice(0, 25);
  }

  public getActiveVisitingNeighbor(): NeighborProfileState | null {
    if (!this.activeVisitNeighborId) return null;
    const social = this.ensureNeighborSocial();
    return social.neighbors.find((n) => n.id === this.activeVisitNeighborId) ?? null;
  }

  public getHomeOwnerParkName(): string {
    return (this.homeStateWhileVisiting ?? this.state).parkName;
  }

  public enterNeighborVisit(neighborId: string): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    if (this.isHeadmasterPreview) {
      this.toggleHeadmasterPreview();
    }
    const social = this.ensureNeighborSocial();
    const neighbor = social.neighbors.find((n) => n.id === neighborId);
    if (!neighbor) {
      return { ok: false, msg: 'Không tìm thấy thung lũng của người bạn này!' };
    }

    if (this.homeStateWhileVisiting) {
      this.syncPlayerPrimitivesToHomeState();
    } else {
      this.homeStateWhileVisiting = this.state;
    }

    const now = Date.now();
    const snap = buildNeighborValleySnapshot(neighbor, now);
    const homeBase = this.homeStateWhileVisiting;

    this.activeVisitNeighborId = neighbor.id;
    this.state = {
      ...homeBase,
      parkName: snap.neighbor.parkName,
      unlockedZones: snap.unlockedZones,
      buildings: snap.buildings,
      tileOverrides: snap.tileOverrides,
    };
    this.escapedCreatures = [];
    this.fireworks = [];
    this.effects = [];
    this.rideQueues.clear();
    this.rebuildGrid();
    this.syncStaffEntities();
    this.syncValleyVillagers();
    this.stateRevision++;

    this.audio.playOwlHoot(0.035);
    const msg = `🚂 Đang ghé thăm "${neighbor.parkName}" của ${neighbor.avatarEmoji} ${neighbor.name} (Cấp ${neighbor.level})!`;
    this.onToast?.(msg, neighbor.avatarEmoji);
    this.onUiChange?.();
    return { ok: true, msg, focusGx: snap.focusGx, focusGy: snap.focusGy };
  }

  public exitNeighborVisit(silent = false): {
    ok: boolean;
    focusGx: number;
    focusGy: number;
  } {
    if (!this.homeStateWhileVisiting) {
      this.activeVisitNeighborId = null;
      return { ok: false, focusGx: 18, focusGy: 22 };
    }
    this.syncPlayerPrimitivesToHomeState();
    this.state = this.homeStateWhileVisiting;
    this.homeStateWhileVisiting = null;
    this.activeVisitNeighborId = null;

    this.escapedCreatures = [];
    this.fireworks = [];
    this.effects = [];
    this.rideQueues.clear();
    this.rebuildGrid();
    this.syncStaffEntities();
    this.syncValleyVillagers();
    this.stateRevision++;
    this.saveToStorage();
    if (!silent) {
      this.audio.playOwlHoot(0.03);
      this.onToast?.('🏡 Đã quay về Trang Trại Hang Sóc thân yêu của bạn!', '🏡');
    }
    this.onUiChange?.();
    return { ok: true, focusGx: 18, focusGy: 22 };
  }

  public cycleNextNeighborVisit(): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    const social = this.ensureNeighborSocial();
    if (social.neighbors.length === 0) {
      return { ok: false, msg: 'Chưa có hàng xóm trong danh bạ!' };
    }
    const curIdx = social.neighbors.findIndex((n) => n.id === this.activeVisitNeighborId);
    const nextIdx = (curIdx + 1) % social.neighbors.length;
    return this.enterNeighborVisit(social.neighbors[nextIdx].id);
  }

  public setNeighborPresetNote(noteId: NeighborPresetNoteId): void {
    const social = this.ensureNeighborSocial();
    social.selectedPresetNoteId = noteId;
    this.saveToStorage();
    this.onUiChange?.();
  }

  public addFriendByCode(
    rawCode: string,
    customName?: string,
    verifiedProfile?: VerifiedRealPlayerProfile
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } {
    const social = this.ensureNeighborSocial();
    const cleaned = (verifiedProfile?.friendCode || rawCode)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    if (cleaned.length < 4) {
      return { ok: false, msg: 'Mã Thung Lũng cần ít nhất 4 ký tự (ví dụ: HS-ABCD-12)!' };
    }
    if (cleaned === social.playerFriendCode.toUpperCase()) {
      return { ok: false, msg: 'Đây là Mã Thung Lũng của chính bạn rồi!' };
    }
    if (
      ['HS-HAGRID-01', 'HS-LUNA-02', 'HS-NEVILLE-03', 'HS-HERMIONE-04', 'HS-WEASLEY-05'].includes(
        cleaned
      )
    ) {
      return {
        ok: false,
        msg: 'Sổ Hàng Xóm chỉ kết nối với người chơi thật — không hỗ trợ thêm mã NPC!',
      };
    }
    const existing = social.neighbors.find(
      (n) =>
        n.friendCode.toUpperCase() === cleaned ||
        (Boolean(verifiedProfile?.userId) && n.remoteUserId === verifiedProfile?.userId)
    );
    if (existing) {
      if (verifiedProfile) {
        this.syncVerifiedFriendSnapshot(verifiedProfile);
      }
      return {
        ok: false,
        msg: `${existing.avatarEmoji} ${existing.name} (${existing.friendCode}) đã có trong Sổ Hàng Xóm rồi!`,
      };
    }
    if (social.neighbors.length >= 20) {
      return { ok: false, msg: 'Sổ Hàng Xóm hiện tối đa 20 người bạn thân thiết!' };
    }

    const now = Date.now();
    const created = createFriendNeighborFromCode(cleaned, customName, now, verifiedProfile);
    social.neighbors.push(created);
    this.pushSocialActivity(
      created.avatarEmoji,
      `Kết giao hàng xóm mới: ${created.name} (${created.friendCode})!`,
      now
    );
    this.audio.playLevelUp();
    const msg = `🦉 Đã kết bạn với ${created.avatarEmoji} ${created.name} (${created.friendCode}) — ghé thăm vườn ngay nhé!`;
    this.onToast?.(msg, '🤝');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg, neighbor: created };
  }

  public addVerifiedRealFriend(
    profile: VerifiedRealPlayerProfile,
    customName?: string
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } {
    return this.addFriendByCode(profile.friendCode, customName, profile);
  }

  public syncVerifiedFriendSnapshot(profile: VerifiedRealPlayerProfile): boolean {
    const social = this.ensureNeighborSocial();
    const norm = profile.friendCode.trim().toUpperCase();
    const nb = social.neighbors.find(
      (n) =>
        n.friendCode.toUpperCase() === norm ||
        (Boolean(profile.userId) && n.remoteUserId === profile.userId)
    );
    if (!nb) return false;
    nb.remoteUserId = profile.userId;
    nb.isVerifiedPlayer = true;
    nb.parkName = profile.parkName || nb.parkName;
    nb.level = Math.max(1, Math.min(100, Math.floor(profile.level || nb.level)));
    nb.house = profile.house || nb.house;
    if (profile.avatarEmoji) nb.avatarEmoji = profile.avatarEmoji;
    if (Array.isArray(profile.buildings) && profile.buildings.length > 0) {
      nb.valleyBuildings = profile.buildings;
    }
    if (profile.tileOverrides) {
      nb.valleyTileOverrides = profile.tileOverrides;
    }
    if (Array.isArray(profile.unlockedZones) && profile.unlockedZones.length > 0) {
      nb.valleyUnlockedZones = profile.unlockedZones;
    }
    this.saveToStorage();
    return true;
  }

  public removeNeighborFriend(neighborId: string): { ok: boolean; msg: string } {
    const social = this.ensureNeighborSocial();
    const idx = social.neighbors.findIndex((n) => n.id === neighborId);
    if (idx === -1) {
      return { ok: false, msg: 'Không tìm thấy người bạn này trong Sổ Hàng Xóm!' };
    }
    const removed = social.neighbors[idx];
    if (this.activeVisitNeighborId === removed.id) {
      this.exitNeighborVisit(true);
    }
    social.neighbors.splice(idx, 1);
    const msg = `Đã xoá ${removed.name} (${removed.friendCode}) khỏi Sổ Hàng Xóm.`;
    this.pushSocialActivity('📋', msg, Date.now());
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public getVisitedBuildingHelpStatus(
    b: PlacedBuilding,
    now = Date.now()
  ): {
    canHelp: boolean;
    kind: NeighborGardenHelpKind | null;
    existingMark?: NeighborProfileState['helpedMarksToday'][number];
  } {
    const nb = this.getActiveVisitingNeighbor();
    if (!nb) return { canHelp: false, kind: null };
    const existingMark = nb.helpedMarksToday.find((m) => m.buildingUid === b.uid);
    if (existingMark) {
      return { canHelp: false, kind: existingMark.kind, existingMark };
    }
    const item = getCatalogItem(b.itemId);
    const kind = classifyBuildingGardenHelpKind(item, b, now);
    if (!kind) return { canHelp: false, kind: null };
    return { canHelp: true, kind };
  }

  public helpVisitedNeighborBuilding(buildingUid: string): { ok: boolean; msg: string } {
    if (!this.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy sang thăm vườn hàng xóm để trợ giúp nhé!' };
    }
    const social = this.ensureNeighborSocial();
    const nb = this.getActiveVisitingNeighbor();
    if (!nb) return { ok: false, msg: 'Không tìm thấy thông tin vườn bạn!' };

    const b = this.state.buildings.find((x) => x.uid === buildingUid);
    if (!b) return { ok: false, msg: 'Không tìm thấy công trình để trợ giúp!' };
    if (nb.helpedMarksToday.some((m) => m.buildingUid === b.uid)) {
      return { ok: false, msg: 'Bạn đã để lại Dấu Ấn Cú Đưa Thư trên công trình này hôm nay rồi!' };
    }
    if (nb.helpedMarksToday.length >= 6) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã chăm giúp tối đa 6/6 điểm tại vườn của ${nb.name} rồi!`,
      };
    }

    const now = Date.now();
    const item = getCatalogItem(b.itemId);
    const kind = classifyBuildingGardenHelpKind(item, b, now);
    if (!kind || !item) {
      return { ok: false, msg: 'Công trình này hiện không cần chăm sóc thêm!' };
    }

    const meta = getGardenHelpMetaVi(kind);
    const note = getPresetNoteMeta(social.selectedPresetNoteId);
    nb.helpedMarksToday.push({
      buildingUid: b.uid,
      kind,
      helperName: 'Bạn',
      noteId: note.id,
      noteText: note.textVi,
      helpedAt: now,
    });

    if (kind === 'water_crop' && b.cropReadyAt) {
      b.cropWateredBoost = true;
      b.cropReadyAt = Math.max(now + 30_000, b.cropReadyAt - 300_000);
    } else if (kind === 'stoke_workshop' && b.workshopQueue && b.workshopQueue.length > 0) {
      b.workshopQueue[0].endsAt = Math.max(now + 20_000, b.workshopQueue[0].endsAt - 180_000);
    }

    this.state.galleons += meta.goldReward;
    this.state.finance.harvestRevenue += meta.goldReward;
    social.friendshipTokens += 1;
    this.addXp(meta.xpReward);
    this.addHarvestFeastPoints(10);

    const cx = b.gx + item.width * 0.5;
    const cy = b.gy + item.height * 0.5;
    this.audio.playHarvestBubble();
    this.onBuildingTactile?.(b.uid);
    this.onRewardFly?.('galleons', meta.goldReward, cx, cy);
    this.spawnFloatingText(
      cx,
      cy,
      `${meta.icon} +${meta.goldReward}G  +${meta.xpReward} ⭐  +1 🍀`,
      '#fde047'
    );

    this.pushSocialActivity(
      meta.icon,
      `${meta.actionVi} "${item.name}" tại vườn ${nb.name} (+1 🍀, +${meta.goldReward}G)`,
      now
    );
    const msg = `🏮 Đã ${meta.actionVi.toLowerCase()} cho ${nb.name} kèm lời chúc "${note.shortVi}"! Nhận +1 🍀, +${meta.goldReward}G, +${meta.xpReward} XP!`;
    this.onToast?.(msg, meta.icon);
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public likeVisitedNeighborFarm(targetNeighborId?: string): { ok: boolean; msg: string } {
    const social = this.ensureNeighborSocial();
    const nid = targetNeighborId ?? this.activeVisitNeighborId;
    if (!nid) return { ok: false, msg: 'Chưa chọn người bạn để thả tim!' };
    const nb = social.neighbors.find((n) => n.id === nid);
    if (!nb) return { ok: false, msg: 'Không tìm thấy hàng xóm này!' };
    if (social.dailyLikedNeighborIds.includes(nb.id)) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã thả ❤️ khen thung lũng của ${nb.name} rồi (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    social.dailyLikedNeighborIds.push(nb.id);
    nb.likesCount += 1;
    social.friendshipTokens += 1;
    this.state.galleons += 20;
    this.state.finance.harvestRevenue += 20;
    this.addXp(10);

    this.audio.playMatchPop(1);
    if (this.isVisitingNeighbor && this.activeVisitNeighborId === nb.id) {
      this.spawnFloatingText(15, 19, '❤️ Tuyệt đẹp! +20G +1 🍀', '#fb7185');
    }
    this.pushSocialActivity('❤️', `Thả tim khen "${nb.parkName}" của ${nb.name} (+1 🍀, +20G)`, now);
    const msg = `❤️ Đã gửi tim khen ngợi "${nb.parkName}"! Nhận +1 🍀 Huy Hiệu Tình Bạn, +20G & +10 XP!`;
    this.onToast?.(msg, '❤️');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public canClaimVisitedMysteryGift(): boolean {
    const social = this.ensureNeighborSocial();
    const nb = this.getActiveVisitingNeighbor();
    if (!nb) return false;
    return !social.dailyMysteryClaimedIds.includes(nb.id);
  }

  public claimVisitedNeighborMysteryGift(): { ok: boolean; msg: string } {
    if (!this.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy ghé thăm thung lũng hàng xóm để mở Giỏ Quà Bí Ẩn nhé!' };
    }
    const social = this.ensureNeighborSocial();
    const nb = this.getActiveVisitingNeighbor();
    if (!nb) return { ok: false, msg: 'Không tìm thấy vườn hàng xóm!' };
    if (social.dailyMysteryClaimedIds.includes(nb.id)) {
      return {
        ok: false,
        msg: `Bạn đã mở Giỏ Quà Bí Ẩn hôm nay tại vườn của ${nb.name} rồi (1 lần/ngày/bạn)!`,
      };
    }

    const now = Date.now();
    social.dailyMysteryClaimedIds.push(nb.id);
    const gold = 48;
    const xp = 18;
    this.state.galleons += gold;
    this.state.finance.harvestRevenue += gold;
    social.friendshipTokens += 1;
    this.addXp(xp);

    // Bonus seed or Time Sand!
    const giveSand = social.dailyMysteryClaimedIds.length % 3 === 0;
    let bonusLabel = '';
    if (giveSand) {
      this.state.timeSand += 1;
      bonusLabel = ' +1 ⏳ Cát Xoay';
      this.onRewardFly?.('sand', 1, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
    } else {
      const seedPool: FarmCropId[] = [
        'ruby_strawberry',
        'english_rose',
        'rainbow_tulip',
        'garden_pumpkin',
        'dried_lavender',
        'meadow_daisy',
      ];
      const pickSeed = seedPool[social.dailyMysteryClaimedIds.length % seedPool.length];
      this.addCropSeeds(pickSeed, 1);
      bonusLabel = ` +1 hạt ${FARM_CROPS[pickSeed].emoji} ${FARM_CROPS[pickSeed].name}`;
    }

    this.audio.playLevelUp();
    this.onRewardFly?.('galleons', gold, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
    this.spawnFloatingText(
      nb.mysteryGiftGx + 0.5,
      nb.mysteryGiftGy + 0.5,
      `🎁 +${gold}G +1 🍀${bonusLabel}`,
      '#fde047'
    );
    this.pushSocialActivity(
      '🎁',
      `Tìm thấy Giỏ Quà Bí Ẩn tại vườn ${nb.name} (+1 🍀, +${gold}G${bonusLabel})`,
      now
    );
    const msg = `🎁 Mở Giỏ Quà Bí Ẩn tại vườn ${nb.name}: Nhận +1 🍀, +${gold}G, +${xp} XP &${bonusLabel}!`;
    this.onToast?.(msg, '🎁');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public fulfillNeighborOwlCrate(
    neighborId: string,
    crateId: string
  ): { ok: boolean; msg: string } {
    const social = this.ensureNeighborSocial();
    const nb = social.neighbors.find((n) => n.id === neighborId);
    if (!nb) return { ok: false, msg: 'Không tìm thấy hàng xóm này!' };
    const crate = nb.owlHelpCrates.find((c) => c.id === crateId);
    if (!crate) return { ok: false, msg: 'Không tìm thấy kiện hàng Đơn Cú này!' };
    if (crate.fulfilledByPlayerToday) {
      return { ok: false, msg: 'Bạn đã đóng giúp kiện hàng này hôm nay rồi!' };
    }

    const meta = getFarmItemMeta(crate.itemId);
    if (!this.state.sandboxMode) {
      const have = this.getFarmItemCount(crate.itemId);
      if (have < crate.qty) {
        return {
          ok: false,
          msg: `Kho Nông Sản của bạn còn thiếu ${crate.qty - have} ${meta.emoji} ${meta.name} để đóng hộ ${nb.name}!`,
        };
      }
      this.consumeFarmItemFromBarn(crate.itemId, crate.qty);
    }

    const now = Date.now();
    crate.fulfilledByPlayerToday = true;
    this.state.galleons += crate.rewardGalleons;
    this.state.finance.shopRevenue += crate.rewardGalleons;
    social.friendshipTokens += crate.rewardTokens;
    this.addXp(crate.rewardXp);

    this.audio.playOwlHoot(0.04);
    this.audio.playHarvestBubble();
    this.onRewardFly?.('galleons', crate.rewardGalleons);
    this.pushSocialActivity(
      '📦',
      `Đóng hộ ${crate.qty} ${meta.emoji} ${meta.name} trên Đơn Cú của ${nb.name} (+${crate.rewardTokens} 🍀, +${crate.rewardGalleons}G)`,
      now
    );
    const msg = `📦 Đã đóng hộ ${crate.qty} ${meta.emoji} ${meta.name} giúp ${nb.name}! Nhận +${crate.rewardTokens} 🍀, +${crate.rewardGalleons}G & +${crate.rewardXp} XP!`;
    this.onToast?.(msg, '🦉');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public canRescueNeighborMinigame(neighborId: string): {
    ok: boolean;
    reason?: string;
    sos?: NeighborMinigameSos;
    neighbor?: NeighborProfileState;
  } {
    const social = this.ensureNeighborSocial();
    const nb = social.neighbors.find((n) => n.id === neighborId);
    if (!nb || !nb.minigameSos) {
      return { ok: false, reason: 'Người bạn này hiện không có màn khó cần giải cứu!' };
    }
    if (nb.minigameSos.rescuedToday || social.dailyRescuesGivenIds.includes(nb.id)) {
      return {
        ok: false,
        reason: `Bạn đã giải cứu khảo thí phép thuật cho ${nb.name} hôm nay rồi (1 lần/ngày/bạn — reset lúc 00:00)!`,
      };
    }
    if (social.dailyRescuesGivenIds.length >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        reason: `Hôm nay bạn đã dùng hết ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt Giải Cứu Bạn Bè (reset lúc 00:00)!`,
      };
    }
    return { ok: true, sos: nb.minigameSos, neighbor: nb };
  }

  public completeNeighborMinigameRescue(ctx: MinigameRescueContext): {
    ok: boolean;
    msg: string;
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } {
    const social = this.ensureNeighborSocial();
    const check = this.canRescueNeighborMinigame(ctx.neighborId);
    if (!check.ok || !check.neighbor || !check.sos) {
      return {
        ok: false,
        msg: check.reason ?? 'Lượt giải cứu này đã hoàn tất trước đó!',
        tokensEarned: 0,
        goldEarned: 0,
        xpEarned: 0,
      };
    }

    const now = Date.now();
    const nb = check.neighbor;
    check.sos.rescuedToday = true;
    if (!social.dailyRescuesGivenIds.includes(nb.id)) {
      social.dailyRescuesGivenIds.push(nb.id);
    }

    const tokensEarned = 3;
    const goldEarned = 95;
    const xpEarned = 45;
    social.friendshipTokens += tokensEarned;
    this.state.galleons += goldEarned;
    this.state.finance.harvestRevenue += goldEarned;
    this.addXp(xpEarned);
    const buildReduction = this.applyConstructionReductionFromGameplay(1800, 'Giải Cứu Bạn Bè');
    const buildMsg =
      buildReduction.reducedSec > 0
        ? ` • 🔨 -${formatDurationCompactVi(buildReduction.reducedSec)} xây ${buildReduction.targetName ?? 'công trình'}`
        : '';

    const kindMeta = getMinigameKindLabelVi(ctx.kind);
    this.audio.playLevelUp();
    this.onRewardFly?.('galleons', goldEarned);
    this.pushSocialActivity(
      '⚔️',
      `Giải cứu thành công ${kindMeta.icon} ${kindMeta.nameVi} (Màn ${ctx.stage}) cho ${nb.name} (+${tokensEarned} 🍀, +${goldEarned}G)`,
      now
    );
    const msg = `🏆 Tuyệt đỉnh! Bạn đã vượt hộ ${kindMeta.nameVi} Màn ${ctx.stage} giúp ${nb.avatarEmoji} ${nb.name}! Nhận +${tokensEarned} 🍀, +${goldEarned}G & +${xpEarned} XP${buildMsg}!`;
    this.onToast?.(msg, '🏆');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg, tokensEarned, goldEarned, xpEarned, buildReduction };
  }

  public openFriendshipChest(): {
    ok: boolean;
    msg: string;
    starsEarned: number;
    talismanEarned: number;
    sandEarned: number;
    goldEarned: number;
    seedCropId?: FarmCropId;
    seedQty?: number;
  } {
    const social = this.ensureNeighborSocial();
    if (social.friendshipTokens < FRIENDSHIP_CHEST_TOKEN_COST) {
      return {
        ok: false,
        msg: `Cần ${FRIENDSHIP_CHEST_TOKEN_COST} 🍀 Huy Hiệu Tình Bạn để mở Rương Quà (hiện có ${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)!`,
        starsEarned: 0,
        talismanEarned: 0,
        sandEarned: 0,
        goldEarned: 0,
      };
    }

    const now = Date.now();
    social.friendshipTokens -= FRIENDSHIP_CHEST_TOKEN_COST;
    social.chestsOpened += 1;

    const starsEarned = 2;
    const goldEarned = 150;
    const xpEarned = 40;
    this.state.match3.stars += starsEarned;
    this.state.match3.totalStarsEarned += starsEarned;
    this.state.galleons += goldEarned;
    this.state.finance.harvestRevenue += goldEarned;
    this.addXp(xpEarned);

    const talismanEarned = this.grantPhoenixTalisman(1);
    let sandEarned = 0;
    if (talismanEarned === 0) {
      sandEarned = 2;
      this.state.timeSand += sandEarned;
    }

    const rareSeeds: FarmCropId[] = [
      'baby_mandrake',
      'moonlight_flower',
      'phoenix_fireflower',
      'blush_peony',
      'glow_mushroom',
      'dried_lavender',
      'english_rose',
    ];
    const unlockedSeeds = rareSeeds.filter(
      (cid) => FARM_CROPS[cid].unlockLevel <= Math.max(5, this.state.level)
    );
    const seedCropId =
      (unlockedSeeds.length > 0 ? unlockedSeeds : (['ruby_strawberry'] as FarmCropId[]))[
        social.chestsOpened % Math.max(1, unlockedSeeds.length)
      ] ?? 'ruby_strawberry';
    const seedQty = 2;
    this.addCropSeeds(seedCropId, seedQty);
    const cropMeta = FARM_CROPS[seedCropId];

    this.audio.playLevelUp();
    this.launchFireworksShow(8);
    this.onRewardFly?.('stars', starsEarned);
    this.onRewardFly?.('galleons', goldEarned);

    const relicPart =
      talismanEarned > 0 ? `+${talismanEarned} 🔥 Bùa Phượng Hoàng` : `+${sandEarned} ⏳ Cát Xoay`;
    const msg = `🎁 Mở Rương Quà Tình Bạn #${social.chestsOpened}: Nhận +${starsEarned} 🌟 Sao Phép Thuật, ${relicPart}, +${seedQty} hạt ${cropMeta.emoji} ${cropMeta.name} & +${goldEarned}G!`;
    this.pushSocialActivity('🎁', msg, now);
    this.onToast?.(msg, '🎁');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg,
      starsEarned,
      talismanEarned,
      sandEarned,
      goldEarned,
      seedCropId,
      seedQty,
    };
  }

  public claimHomeLanternMark(markIdOrBuildingUid: string): { ok: boolean; msg: string } {
    if (this.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy quay về vườn nhà Hang Sóc để nhận quà Cú Đưa Thư nhé!' };
    }
    const social = this.ensureNeighborSocial();
    const idx = social.homeLanternMarks.findIndex(
      (m) => m.id === markIdOrBuildingUid || m.buildingUid === markIdOrBuildingUid
    );
    if (idx === -1) {
      return { ok: false, msg: 'Dấu ấn Cú Đưa Thư này đã được nhận rồi!' };
    }

    const now = Date.now();
    const mark = social.homeLanternMarks[idx];
    social.homeLanternMarks.splice(idx, 1);

    const b = this.state.buildings.find((x) => x.uid === mark.buildingUid);
    const item = b ? getCatalogItem(b.itemId) : undefined;
    let effectTag = '';

    if (b && item) {
      if (item.isFarmlandPlot && b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
        const left = b.cropReadyAt - now;
        b.cropReadyAt = Math.max(now + 1000, b.cropReadyAt - Math.max(8000, Math.round(left * 0.45)));
        b.cropWateredBoost = true;
        effectTag = ' • Cây lớn vọt +45%!';
      } else if (b.workshopQueue && b.workshopQueue.length > 0) {
        const left = Math.max(0, b.workshopQueue[0].endsAt - now);
        const cut = Math.max(10_000, Math.round(left * 0.4));
        b.workshopQueue[0].endsAt = Math.max(now + 500, b.workshopQueue[0].endsAt - cut);
        effectTag = ' • Lò nhanh hơn +40%!';
      } else if (item.cycleSec > 0 && item.baseIncome > 0) {
        const prod = this.getBuildingProductionPerCycle(b, item);
        b.readyBubbles = Math.min(8, b.readyBubbles + 1);
        b.storedGalleons += prod.galleons;
        b.storedXp += prod.xp;
        effectTag = ' • Tặng +1 mẻ thu hoạch sẵn!';
      }
      this.onBuildingTactile?.(b.uid);
      this.spawnFloatingText(
        b.gx + item.width * 0.5,
        b.gy + item.height * 0.5,
        `🏮 ${mark.helperEmoji} +22G +1 🍀`,
        '#fde047'
      );
    }

    this.state.galleons += 22;
    this.state.finance.harvestRevenue += 22;
    social.friendshipTokens += 1;
    this.addXp(12);
    this.tickProductionToTimestamp(now, true);

    this.audio.playHarvestBubble();
    const msg = `🏮 ${mark.helperEmoji} ${mark.helperName} nhắn: "${mark.noteVi}"${effectTag} (+1 🍀, +22G, +12 XP)`;
    this.pushSocialActivity(
      '🏮',
      `Nhận Dấu Ấn Cú Đưa Thư từ ${mark.helperName}${effectTag} (+1 🍀, +22G)`,
      now
    );
    this.onToast?.(msg, '🏮');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public requestPlayerOwlCrateHelp(
    orderId: string,
    reqIndex: number
  ): { ok: boolean; msg: string } {
    const social = this.ensureNeighborSocial();
    if (social.neighbors.length === 0) {
      return {
        ok: false,
        msg: 'Sổ Hàng Xóm chưa có người chơi nào! Hãy kết bạn với người chơi thật qua Mã Thung Lũng trước nhé.',
      };
    }
    const barn = this.ensureFarmBarn();
    const order = barn.owlOrders.find((o) => o.id === orderId);
    if (!order || !order.requirements[reqIndex]) {
      return { ok: false, msg: 'Không tìm thấy kiện hàng Đơn Cú cần nhờ giúp!' };
    }
    const existing = this.getOwlRequirementHelpState(orderId, reqIndex);
    if (existing) {
      return {
        ok: false,
        msg: existing.fulfilledAt
          ? `${existing.helperEmoji ?? '🦉'} ${existing.helperName ?? 'Hàng xóm'} đã đóng xong kiện này rồi!`
          : 'Kiện hàng này đang chờ Cú Đưa Thư gọi bạn bè tới đóng phụ!',
      };
    }
    if (social.dailyOwlHelpRequestedCount >= MAX_DAILY_OWL_HELP_REQUESTS) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã gửi tối đa ${MAX_DAILY_OWL_HELP_REQUESTS}/${MAX_DAILY_OWL_HELP_REQUESTS} thư nhờ đóng Đơn Cú (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    const req = order.requirements[reqIndex];
    const meta = getFarmItemMeta(req.itemId);
    social.dailyOwlHelpRequestedCount += 1;
    social.playerOwlHelpRequests.push({
      orderId,
      reqIndex,
      itemId: req.itemId,
      qty: req.qty,
      requestedAt: now,
    });

    this.audio.playOwlHoot(0.04);
    const msg = `🦉 Đã treo biển nhờ bạn bè đóng hộ ${req.qty} ${meta.emoji} ${meta.name} (${social.dailyOwlHelpRequestedCount}/${MAX_DAILY_OWL_HELP_REQUESTS} hôm nay)!`;
    this.pushSocialActivity('🦉', msg, now);
    this.onToast?.(msg, '🤝');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public requestPlayerMinigameSos(
    kind: MinigameTrialKind,
    stage: number
  ): { ok: boolean; msg: string } {
    const social = this.ensureNeighborSocial();
    if (social.neighbors.length === 0) {
      return {
        ok: false,
        msg: 'Sổ Hàng Xóm chưa có người chơi nào! Hãy kết bạn với người chơi thật qua Mã Thung Lũng trước nhé.',
      };
    }
    const cleanStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.round(stage)));

    if (social.playerMinigameSos && !social.playerMinigameSos.claimed) {
      if (
        social.playerMinigameSos.kind === kind &&
        social.playerMinigameSos.stage === cleanStage
      ) {
        return {
          ok: false,
          msg: social.playerMinigameSos.rescuedAt
            ? `🎉 ${social.playerMinigameSos.rescuerName ?? 'Hàng xóm'} đã vượt hộ màn này rồi — bấm "Nhận Qua Màn Ngay" nhé!`
            : '🦉 Thư cầu viện Cú Đưa Thư đang bay tới hội bạn bè, chờ vài giây nhé!',
        };
      }
      // Cho phép chuyển mục tiêu cầu viện nếu màn trước chưa nhận
      if (social.playerMinigameSos.rescuedAt) {
        return {
          ok: false,
          msg: `Bạn đang có Màn ${social.playerMinigameSos.stage} đã được bạn bè giải cứu sẵn — hãy bấm nhận trước khi gửi thư mới nhé!`,
        };
      }
    }

    if (social.dailyRescuesReceivedCount >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã nhận đủ ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt Bạn Bè Giải Cứu Màn Khó (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    const kindMeta = getMinigameKindLabelVi(kind);
    social.playerMinigameSos = {
      id: `psos_${now}`,
      kind,
      stage: cleanStage,
      requestedAt: now,
      claimed: false,
    };

    this.audio.playOwlHoot(0.045);
    const msg = `🆘 Đã bắn pháo hiệu Cú Đưa Thư nhờ bạn bè vượt hộ ${kindMeta.icon} ${kindMeta.nameVi} — Màn ${cleanStage} (${social.dailyRescuesReceivedCount}/${MAX_DAILY_MINIGAME_RESCUES} lượt nhận hôm nay)!`;
    this.pushSocialActivity('🆘', msg, now);
    this.onToast?.(msg, '🆘');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public claimPlayerMinigameSosRescue(): {
    ok: boolean;
    msg: string;
    kind?: MinigameTrialKind;
    clearedStage?: number;
    nextStage?: number;
  } {
    const social = this.ensureNeighborSocial();
    const sos = social.playerMinigameSos;
    if (!sos || sos.claimed) {
      return { ok: false, msg: 'Hiện không có màn cầu viện nào chờ nhận!' };
    }
    if (!sos.rescuedAt) {
      return { ok: false, msg: 'Hàng xóm đang vào bàn đấu giải cứu màn này cho bạn — chờ chút nhé!' };
    }
    if (social.dailyRescuesReceivedCount >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã nhận tối đa ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt giải cứu rồi!`,
      };
    }

    const now = Date.now();
    const kind = sos.kind;
    const stage = sos.stage;
    const rescuerLabel = `${sos.rescuerEmoji ?? '🦉'} ${sos.rescuerName ?? 'Hàng xóm'}`;
    const kindMeta = getMinigameKindLabelVi(kind);

    sos.claimed = true;
    social.playerMinigameSos = null;
    social.dailyRescuesReceivedCount += 1;

    let nextStage = stage + 1;
    if (kind === 'match3') {
      if ((this.state.match3.currentLevel ?? 1) === stage) {
        const res = this.completeMatch3LevelVictory(0);
        nextStage = res.nextLevel;
      } else {
        this.state.galleons += 35;
        this.addXp(15);
        nextStage = this.state.match3.currentLevel;
      }
    } else {
      const info = this.getDisciplineStageInfo(kind);
      if (info.currentStage === stage) {
        const res = this.completePuzzleArcadeVictory(kind, {
          stars: 1,
          gold: 48,
          xp: 24,
          sand: 0,
        });
        nextStage = res.nextStage;
      } else {
        this.state.galleons += 35;
        this.addXp(15);
        nextStage = info.currentStage;
      }
    }

    this.launchFireworksShow(6);
    const msg = `🎉 ${rescuerLabel} đã phá đảo hộ ${kindMeta.icon} ${kindMeta.nameVi} Màn ${stage} — mở khóa Màn ${nextStage} cho bạn!`;
    this.pushSocialActivity('🎉', msg, now);
    this.onToast?.(msg, '🎉');
    this.saveToStorage();
    this.onUiChange?.();
    return {
      ok: true,
      msg,
      kind,
      clearedStage: stage,
      nextStage,
    };
  }

  /**
   * Mô phỏng phản hồi hai chiều sống động từ hội bạn bè Canon/Mã Cú (sẵn sàng thay bằng WebSocket/REST sau này).
   */
  public tickNeighborSocialBackground(now = Date.now()): void {
    const social = this.ensureNeighborSocial();
    let changed = false;

    // 1. Hàng xóm phản hồi thư cầu viện "🆘 Nhờ Bạn Qua Màn" sau ~5.5 giây
    if (
      social.playerMinigameSos &&
      !social.playerMinigameSos.rescuedAt &&
      !social.playerMinigameSos.claimed &&
      now - social.playerMinigameSos.requestedAt >= 5500 &&
      social.neighbors.length > 0
    ) {
      const pickIdx = Math.abs(Math.floor(social.playerMinigameSos.requestedAt / 1000)) % social.neighbors.length;
      const helper = social.neighbors[pickIdx];
      const kindMeta = getMinigameKindLabelVi(social.playerMinigameSos.kind);
      social.playerMinigameSos.rescuedAt = now;
      social.playerMinigameSos.rescuerId = helper.id;
      social.playerMinigameSos.rescuerName = helper.name;
      social.playerMinigameSos.rescuerEmoji = helper.avatarEmoji;
      social.playerMinigameSos.rescuerNoteVi = `Mình vừa giải xong Màn ${social.playerMinigameSos.stage} (${kindMeta.nameVi}) giúp bồ rồi nè!`;
      this.audio.playOwlHoot(0.045);
      this.pushSocialActivity(
        helper.avatarEmoji,
        `${helper.name} vừa giải cứu xong ${kindMeta.icon} Màn ${social.playerMinigameSos.stage} giúp bạn — vào nhận ngay!`,
        now
      );
      this.onToast?.(
        `🦉 ${helper.avatarEmoji} ${helper.name} vừa vượt hộ ${kindMeta.nameVi} Màn ${social.playerMinigameSos.stage}! Bấm nhận qua màn ngay!`,
        '🎉'
      );
      changed = true;
    }

    // 2. Hàng xóm đóng hộ kiện hàng Đơn Cú sau ~5 giây
    for (const req of social.playerOwlHelpRequests) {
      if (!req.fulfilledAt && now - req.requestedAt >= 5000 && social.neighbors.length > 0) {
        const pickIdx = Math.abs(req.reqIndex + Math.floor(req.requestedAt / 1000)) % social.neighbors.length;
        const helper = social.neighbors[pickIdx];
        const meta = getFarmItemMeta(req.itemId);
        req.fulfilledAt = now;
        req.helperName = helper.name;
        req.helperEmoji = helper.avatarEmoji;
        this.audio.playOwlHoot(0.04);
        this.pushSocialActivity(
          helper.avatarEmoji,
          `${helper.name} đã đóng hộ ${req.qty} ${meta.emoji} ${meta.name} vào Đơn Cú giúp bạn!`,
          now
        );
        this.onToast?.(
          `🦉 ${helper.avatarEmoji} ${helper.name} vừa đóng hộ ${req.qty} ${meta.emoji} ${meta.name} cho Đơn Cú của bạn!`,
          '📦'
        );
        changed = true;
      }
    }

    // 3. Thỉnh thoảng bạn bè ghé thăm vườn nhà để lại Dấu Ấn Đèn Lồng Cú (tối đa 3 đèn tự động)
    if (!this.isVisitingNeighbor && social.homeLanternMarks.length < 3) {
      const youngestMarkAt = social.homeLanternMarks.reduce(
        (mx, m) => Math.max(mx, m.createdAt),
        0
      );
      if (now - youngestMarkAt >= 48_000) {
        const newMark = pickSimulatedHomeLanternMark(social, this.state.buildings, now);
        if (newMark) {
          social.homeLanternMarks.push(newMark);
          changed = true;
        }
      }
    }

    if (changed) {
      this.saveToStorage();
      this.onUiChange?.();
    }
  }

  public ensureTutorialState(): TutorialState {
    if (!this.state.tutorial) {
      this.state.tutorial = createInitialTutorialState(true);
    }
    return this.state.tutorial;
  }

  public isTutorialActive(): boolean {
    if (this.isHeadmasterPreview || this.isVisitingNeighbor) return false;
    const tut = this.state.tutorial;
    return Boolean(tut && tut.active && !tut.skipped && tut.stepId !== 'completed');
  }

  public getCurrentTutorialStep(): TutorialStepDef | null {
    if (!this.isTutorialActive()) return null;
    const tut = this.ensureTutorialState();
    return TUTORIAL_STEPS[tut.stepIndex] ?? null;
  }

  public getTutorialWorldTarget(): {
    uid: string;
    gx: number;
    gy: number;
    bw: number;
    bh: number;
    label: string;
  } | null {
    const step = this.getCurrentTutorialStep();
    if (!step) return null;
    const now = Date.now();

    if (step.id === 'harvest_wheat') {
      const ripePlot =
        this.state.buildings.find(
          (b) =>
            b.uid === 'burrow_plot_wheat' &&
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            b.cropId &&
            b.cropReadyAt &&
            now >= b.cropReadyAt
        ) ??
        this.state.buildings.find(
          (b) =>
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            b.cropId &&
            b.cropReadyAt &&
            now >= b.cropReadyAt
        ) ??
        this.state.buildings.find((b) => getCatalogItem(b.itemId)?.isFarmlandPlot && Boolean(b.cropId));
      if (!ripePlot) return null;
      const item = getCatalogItem(ripePlot.itemId)!;
      const { bw, bh } = this.getBuildingFootprint(item, ripePlot.rotation);
      return {
        uid: ripePlot.uid,
        gx: ripePlot.gx,
        gy: ripePlot.gy,
        bw,
        bh,
        label:
          ripePlot.cropReadyAt && now >= ripePlot.cropReadyAt
            ? '👆 Nhấp gặt Lúa Mì!'
            : '💧 Chờ chín & thu hoạch!',
      };
    }

    if (step.id === 'sow_and_merge_plot') {
      const emptyPlot =
        this.state.buildings.find(
          (b) =>
            b.uid === 'burrow_plot_empty' &&
            getCatalogItem(b.itemId)?.isFarmlandPlot &&
            !b.cropId
        ) ??
        this.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId
        );
      if (!emptyPlot) return null;
      const item = getCatalogItem(emptyPlot.itemId)!;
      const { bw, bh } = this.getBuildingFootprint(item, emptyPlot.rotation);
      return {
        uid: emptyPlot.uid,
        gx: emptyPlot.gx,
        gy: emptyPlot.gy,
        bw,
        bh,
        label: '🌱 Gieo hạt vào ô này!',
      };
    }

    if (step.id === 'pasture_harvest_and_stock') {
      const readyPasture = this.state.buildings.find(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (readyPasture && !this.state.tutorial?.pastureHarvestedInStep3) {
        const item = getCatalogItem(readyPasture.itemId)!;
        const { bw, bh } = this.getBuildingFootprint(item, readyPasture.rotation);
        return {
          uid: readyPasture.uid,
          gx: readyPasture.gx,
          gy: readyPasture.gy,
          bw,
          bh,
          label: '👆 Thu hoạch Trứng Gà!',
        };
      }
      const emptyPasture =
        this.state.buildings.find(
          (b) =>
            b.uid === 'burrow_pasture_empty' &&
            getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
            !b.pastureAnimalId
        ) ??
        this.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot && !b.pastureAnimalId
        );
      if (!emptyPasture) return null;
      const item = getCatalogItem(emptyPasture.itemId)!;
      const { bw, bh } = this.getBuildingFootprint(item, emptyPasture.rotation);
      return {
        uid: emptyPasture.uid,
        gx: emptyPasture.gx,
        gy: emptyPasture.gy,
        bw,
        bh,
        label: '🐾 Thả thú vào Đồng Cỏ!',
      };
    }

    return null;
  }

  public advanceTutorialStep(expectedStepId?: TutorialStepId): boolean {
    if (!this.isTutorialActive()) return false;
    const tut = this.ensureTutorialState();
    const curStep = TUTORIAL_STEPS[tut.stepIndex];
    if (!curStep) return false;
    if (expectedStepId && curStep.id !== expectedStepId) return false;

    const alreadyClaimed = tut.claimedSteps.includes(curStep.index);
    if (!alreadyClaimed) {
      tut.claimedSteps.push(curStep.index);
      if (curStep.rewardGalleons > 0) {
        this.state.galleons += curStep.rewardGalleons;
        this.state.finance.harvestRevenue += curStep.rewardGalleons;
        this.onRewardFly?.('galleons', curStep.rewardGalleons);
      }
      if (curStep.rewardXp > 0) {
        this.addXp(curStep.rewardXp);
      }
      if (curStep.rewardStars && curStep.rewardStars > 0) {
        this.state.match3.stars += curStep.rewardStars;
        this.state.match3.totalStarsEarned += curStep.rewardStars;
        this.onRewardFly?.('stars', curStep.rewardStars);
      }
      if (curStep.rewardTimeSand && curStep.rewardTimeSand > 0) {
        this.state.timeSand += curStep.rewardTimeSand;
        this.onRewardFly?.('sand', curStep.rewardTimeSand);
      }
      if (curStep.rewardTalismans && curStep.rewardTalismans > 0) {
        this.grantPhoenixTalisman(curStep.rewardTalismans);
      }
      if (curStep.rewardSeedCropId && (curStep.rewardSeedQty ?? 0) > 0) {
        this.addCropSeeds(curStep.rewardSeedCropId, curStep.rewardSeedQty!);
      }
      if (curStep.rewardGoodId && (curStep.rewardGoodQty ?? 0) > 0) {
        this.addFarmItemToBarn(curStep.rewardGoodId, curStep.rewardGoodQty!);
      }
    }

    const nextIdx = tut.stepIndex + 1;
    if (nextIdx >= TUTORIAL_STEPS.length) {
      tut.stepIndex = TUTORIAL_STEPS.length;
      tut.stepId = 'completed';
      tut.active = false;
      tut.skipped = false;
      tut.completedAt = Date.now();
      this.audio.playLevelUp();
      this.launchFireworksShow(8);
      this.onToast?.(
        alreadyClaimed
          ? '🎉 Bạn đã hoàn thành ôn tập Cẩm Nang Trang Trại Hang Sóc cùng Bà Molly!'
          : '🎉 Chúc mừng Tốt Nghiệp Tân Thủ Hang Sóc! Bà Molly tặng +150G, +2 🌟 Sao & +1 🔥 Bùa Phượng Hoàng!',
        '🥧'
      );
      this.onTutorialStepChanged?.('completed');
    } else {
      const nextStep = TUTORIAL_STEPS[nextIdx];
      tut.stepIndex = nextIdx;
      tut.stepId = nextStep.id;
      if (nextStep.id === 'pasture_harvest_and_stock') {
        tut.pastureHarvestedInStep3 = false;
      }
      this.audio.playMatchPop(2);
      if (!alreadyClaimed) {
        this.onToast?.(
          `✨ Xong Bước ${curStep.index + 1}/6! Bà Molly thưởng ${curStep.rewardLabel}`,
          '🥧'
        );
      }
      this.onTutorialStepChanged?.(nextStep.id);
    }

    this.saveToStorage();
    this.onUiChange?.();
    return true;
  }

  public skipTutorial(): void {
    const tut = this.ensureTutorialState();
    tut.active = false;
    tut.skipped = true;
    this.audio.playClick();
    this.onToast?.(
      '📖 Đã tạm ẩn hướng dẫn — bạn có thể mở lại bất cứ lúc nào trong ⚙️ Cài Đặt!',
      '📖'
    );
    this.onTutorialStepChanged?.(tut.stepId);
    this.saveToStorage();
    this.onUiChange?.();
  }

  public restartTutorial(): void {
    if (this.isHeadmasterPreview) {
      this.toggleHeadmasterPreview(100);
    }
    if (this.isVisitingNeighbor) {
      this.exitNeighborVisit(true);
    }
    const tut = this.ensureTutorialState();
    tut.active = true;
    tut.skipped = false;
    tut.stepIndex = 0;
    tut.stepId = TUTORIAL_STEPS[0].id;
    tut.pastureHarvestedInStep3 = false;

    // Ensure Step 1 always has at least one ripe farmland plot so replaying at any level never soft-locks!
    const now = Date.now();
    const hasRipePlot = this.state.buildings.some(
      (b) =>
        getCatalogItem(b.itemId)?.isFarmlandPlot &&
        b.cropId &&
        b.cropReadyAt &&
        now >= b.cropReadyAt
    );
    if (!hasRipePlot) {
      const growingPlot = this.state.buildings.find(
        (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && Boolean(b.cropId)
      );
      if (growingPlot) {
        growingPlot.cropReadyAt = now - 1000;
      } else {
        const emptyPlot = this.state.buildings.find(
          (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId
        );
        if (emptyPlot) {
          emptyPlot.cropId = 'ottery_wheat';
          emptyPlot.cropPlantedAt = now - 30_000;
          emptyPlot.cropReadyAt = now - 1000;
          emptyPlot.cropWateredBoost = false;
        }
      }
    }

    this.audio.playSpell();
    this.onTutorialStepChanged?.(tut.stepId);
    this.saveToStorage();
    this.onUiChange?.();
  }

  // ==================== DÂN LÀNG HANG SÓC DẠO BỘ, LỄ CẮT BĂNG & ĐẠI TIỆC MÙA GẶT 30 BẬC ====================

  private collectVillagerWalkSpots(): Array<{ gx: number; gy: number; isPoi: boolean }> {
    const unlockedSet = new Set(this.state.unlockedZones);
    const spots: Array<{ gx: number; gy: number; isPoi: boolean }> = [];
    const seen = new Set<string>();

    const pushSpot = (gx: number, gy: number, isPoi: boolean): void => {
      if (gx < 1 || gy < 1 || gx >= GRID_SIZE - 1 || gy >= GRID_SIZE - 1) return;
      const cell = this.grid[gy]?.[gx];
      if (!cell || !unlockedSet.has(cell.zoneId) || cell.terrain === 'water') return;
      if (cell.buildingUid) return;
      const k = `${gx},${gy}`;
      if (seen.has(k)) return;
      seen.add(k);
      spots.push({ gx: gx + 0.5, gy: gy + 0.5, isPoi });
    };

    // 1. Prefer connected cobblestone/dirt path tiles first
    for (let gy = 1; gy < GRID_SIZE - 1; gy++) {
      for (let gx = 1; gx < GRID_SIZE - 1; gx++) {
        const cell = this.grid[gy]?.[gx];
        if (cell && cell.path !== 'none' && unlockedSet.has(cell.zoneId) && !cell.buildingUid) {
          pushSpot(gx, gy, false);
        }
      }
    }

    // 2. Also include cozy doorstep grass/courtyard spots right around active farmstead buildings & plots
    for (const b of this.state.buildings) {
      const it = getCatalogItem(b.itemId);
      if (!it || it.category === 'decor' || it.isCoasterTrackPiece) continue;
      const { bw, bh } = this.getBuildingFootprint(it, b.rotation);
      pushSpot(b.gx + Math.floor(bw * 0.5), b.gy + bh, true);
      pushSpot(b.gx - 1, b.gy + Math.floor(bh * 0.5), true);
      pushSpot(b.gx + bw, b.gy + Math.floor(bh * 0.5), true);
    }

    if (spots.length === 0) {
      pushSpot(16, 24, true);
      pushSpot(18, 27, true);
      pushSpot(14, 24, true);
    }
    return spots;
  }

  public syncValleyVillagers(): void {
    const effLevel =
      this.isHeadmasterPreview || this.state.sandboxMode || this.isVisitingNeighbor
        ? 100
        : Math.max(1, this.state.level);
    const spots = this.collectVillagerWalkSpots();
    const existingById = new Map<ValleyVillagerId, ValleyVillagerEntity>(
      this.villagers.map((v) => [v.id, v])
    );

    const nextList: ValleyVillagerEntity[] = [];
    VALLEY_VILLAGER_PROFILES.forEach((prof, idx) => {
      if (prof.unlockLevel > effLevel) return;
      const prev = existingById.get(prof.id);
      if (prev) {
        const cell = this.grid[Math.floor(prev.gy)]?.[Math.floor(prev.gx)];
        if (cell && cell.terrain !== 'water' && !cell.buildingUid) {
          nextList.push(prev);
          return;
        }
      }
      const startSpot = spots[(idx * 3) % spots.length] ?? { gx: 16.5 + idx, gy: 24.5, isPoi: true };
      const targetSpot = spots[(idx * 3 + 2) % spots.length] ?? startSpot;
      nextList.push({
        id: prof.id,
        nameVi: prof.nameVi,
        titleVi: prof.titleVi,
        idleSprite: prof.idleSprite,
        walkSprite: prof.walkSprite,
        gx: startSpot.gx,
        gy: startSpot.gy,
        targetGx: targetSpot.gx,
        targetGy: targetSpot.gy,
        facingLeft: targetSpot.gx < startSpot.gx,
        state: 'walking',
        pauseTimer: 0.8 + (idx % 3) * 0.7,
        speed: 0.88 + (idx % 3) * 0.06,
        moodBubble: prof.moodBubble,
        bubbleTimer: idx === 0 ? 3.8 : 0,
        greetCooldownSec: 0,
        favoriteItemIds: [...prof.favoriteItemIds],
        walkPhase: idx * 1.35,
      });
    });

    this.villagers = nextList;
  }

  private updateValleyVillagers(dt: number, unlockedSet: Set<string>): void {
    if (this.villagers.length === 0) {
      this.syncValleyVillagers();
    }
    let cachedSpots: Array<{ gx: number; gy: number; isPoi: boolean }> | null = null;

    for (let i = 0; i < this.villagers.length; i++) {
      const v = this.villagers[i];
      if (v.bubbleTimer > 0) {
        v.bubbleTimer = Math.max(0, v.bubbleTimer - dt);
      }
      if (v.greetCooldownSec > 0) {
        v.greetCooldownSec = Math.max(0, v.greetCooldownSec - dt);
      }

      const dx = v.targetGx - v.gx;
      const dy = v.targetGy - v.gy;
      const dist = Math.hypot(dx, dy);

      if (dist > 0.12 && v.state === 'walking') {
        const isoScreenDx = dx - dy;
        if (Math.abs(isoScreenDx) > 0.04) {
          v.facingLeft = isoScreenDx < 0;
        }
        const step = Math.min(dist, v.speed * dt);
        const nx = v.gx + (dx / dist) * step;
        const ny = v.gy + (dy / dist) * step;
        const nextCell = this.grid[Math.floor(ny)]?.[Math.floor(nx)];
        if (nextCell && nextCell.terrain !== 'water') {
          v.gx = nx;
          v.gy = ny;
          v.walkPhase = (v.walkPhase + dt * 6.4) % (Math.PI * 20);
        } else {
          v.state = 'admiring';
          v.pauseTimer = 0.6;
        }
        continue;
      }

      v.state = 'admiring';
      if (v.pauseTimer > 0) {
        v.pauseTimer -= dt;
        continue;
      }

      // Pick next cozy stroll destination along paths or building doorsteps!
      const curGx = Math.floor(v.gx);
      const curGy = Math.floor(v.gy);
      const curCell = this.grid[curGy]?.[curGx];
      if (curCell && curCell.path !== 'none' && Math.random() < 0.72) {
        const adjPaths: Array<{ gx: number; gy: number }> = [];
        for (const [ox, oy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const ax = curGx + ox;
          const ay = curGy + oy;
          const ac = this.grid[ay]?.[ax];
          if (ac && ac.path !== 'none' && unlockedSet.has(ac.zoneId) && !ac.buildingUid) {
            adjPaths.push({ gx: ax, gy: ay });
          }
        }
        if (adjPaths.length > 0) {
          const pickAdj = adjPaths[Math.floor(Math.random() * adjPaths.length)];
          v.targetGx = pickAdj.gx + 0.5;
          v.targetGy = pickAdj.gy + 0.5;
          v.state = 'walking';
          v.pauseTimer = 1.6 + ((i * 7) % 5) * 0.45;
          continue;
        }
      }

      if (!cachedSpots) {
        cachedSpots = this.collectVillagerWalkSpots();
      }
      if (cachedSpots.length > 0) {
        const nearby = cachedSpots.filter(
          (s) => Math.hypot(s.gx - v.gx, s.gy - v.gy) >= 1.5 && Math.hypot(s.gx - v.gx, s.gy - v.gy) <= 9.5
        );
        const pool = nearby.length > 0 ? nearby : cachedSpots;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        v.targetGx = pick.gx;
        v.targetGy = pick.gy;
        v.state = 'walking';
        v.pauseTimer = pick.isPoi ? 2.8 + (i % 3) * 0.8 : 1.4;
        if (pick.isPoi && v.bubbleTimer <= 0 && Math.random() < 0.42) {
          v.bubbleTimer = 3.2;
        }
      } else {
        v.pauseTimer = 2.5;
      }
    }
  }

  public greetVillager(id: ValleyVillagerId): { ok: boolean; msg: string; bonusGalleons: number } {
    const v = this.villagers.find((x) => x.id === id);
    const prof = VALLEY_VILLAGER_PROFILES.find((p) => p.id === id);
    if (!v || !prof) {
      return { ok: false, msg: 'Không tìm thấy cư dân thung lũng!', bonusGalleons: 0 };
    }

    const now = Date.now();
    const nextReadyAt = this.villagerGreetCooldown.get(id) ?? 0;
    const canReward = now >= nextReadyAt && !this.isVisitingNeighbor;
    const quote = prof.greetingsVi[Math.floor(now / 5000) % prof.greetingsVi.length];

    v.state = 'admiring';
    v.pauseTimer = 3.6;
    v.moodBubble = prof.moodBubble;
    v.bubbleTimer = 4.8;

    let bonusGalleons = 0;
    if (canReward) {
      this.villagerGreetCooldown.set(id, now + 45_000);
      v.greetCooldownSec = 45;
      bonusGalleons = 8;
      this.state.galleons += bonusGalleons;
      this.state.finance.harvestRevenue += bonusGalleons;
      this.addXp(4);
      this.addHarvestFeastPoints(3);
      this.recordQuestProgress('cast_spells', undefined, 1);
      this.audio.playHarvestBubble();
      this.onRewardFly?.('galleons', bonusGalleons, v.gx, v.gy);
      this.spawnFloatingText(v.gx, v.gy, `${prof.moodBubble} +${bonusGalleons}G +4⭐`, '#fde047');
    } else {
      this.audio.playClick();
      this.spawnFloatingText(v.gx, v.gy, `${prof.moodBubble} ${prof.nameVi}`, '#fef08a');
    }

    const msg = canReward
      ? `${prof.moodBubble} ${prof.nameVi}: "${quote}" (+${bonusGalleons}G, +4 ⭐, +3 🍁)`
      : `${prof.moodBubble} ${prof.nameVi}: "${quote}"`;
    this.onToast?.(msg, prof.moodBubble);
    if (canReward) {
      this.saveToStorage();
      this.onUiChange?.();
    }
    return { ok: true, msg, bonusGalleons };
  }

  public unveilBuilding(uid: string): RibbonUnveilCelebration | null {
    if (this.isVisitingNeighbor) return null;
    const target = this.state.buildings.find((x) => x.uid === uid && Boolean(x.awaitingUnveil));
    if (!target) return null;

    const item = getCatalogItem(target.itemId);
    if (!item) {
      target.awaitingUnveil = undefined;
      return null;
    }

    target.awaitingUnveil = undefined;
    const bonusGalleons = Math.max(
      30,
      Math.round((item.baseIncome || 24) * 1.6 + Math.max(1, item.unlockLevel) * 4)
    );
    const bonusXp = Math.max(15, Math.round(Math.max(8, item.xpPerCollect) * 1.6));
    const feastPoints = 25;

    this.state.galleons += bonusGalleons;
    this.state.finance.harvestRevenue += bonusGalleons;
    this.addXp(bonusXp);
    const feast = this.ensureHarvestFeast();
    feast.unveilsCompleted = (feast.unveilsCompleted ?? 0) + 1;
    this.addHarvestFeastPoints(feastPoints);
    this.recordQuestProgress('harvest_galleons', undefined, bonusGalleons);

    const targetZoneId = getZoneAt(target.gx, target.gy).id;
    let speakerName = 'Bà Molly Weasley';
    let speakerEmoji = '🥧';
    let quoteVi = `Chúc mừng khánh thành "${item.name}"! Cả nhà Weasley mang bánh táo nóng hổi sang mừng tân gia đây!`;

    if (item.id.includes('arthur') || item.category === 'ride') {
      speakerName = 'Ông Arthur Weasley';
      speakerEmoji = '🔌';
      quoteVi = `Tuyệt vời! Cơ cấu bánh răng và bùa chú của "${item.name}" vận hành trơn tru không chê vào đâu được!`;
    } else if (item.id.includes('hagrid') || targetZoneId === 'bia_rung_cam' || targetZoneId === 'ho_den') {
      speakerName = 'Rubeus Hagrid';
      speakerEmoji = '🎃';
      quoteVi = `Hoành tráng hết sảy! "${item.name}" ấm cúng thế này thì cả Hogsmeade đều muốn ghé thăm mỗi ngày!`;
    } else if (item.id.includes('greenhouse') || item.id.includes('owl')) {
      speakerName = 'Hermione Granger';
      speakerEmoji = '📚';
      quoteVi = `Bố cục ánh sáng và thông gió của "${item.name}" đạt chuẩn xuất sắc theo sách Thảo Dược Học Hogwarts!`;
    } else if (item.id.includes('honeydukes') || item.id.includes('broomsticks')) {
      speakerName = 'Ron Weasley';
      speakerEmoji = '🍬';
      quoteVi = `Mơ ước thành sự thật rồi! "${item.name}" vừa cắt băng đã tỏa hương kẹo bơ ngọt lịm khắp con dốc!`;
    }

    const { bw, bh } = this.getBuildingFootprint(item, target.rotation);
    const cx = target.gx + bw * 0.5;
    const cy = target.gy + bh * 0.5;

    if (typeof this.audio.playRibbonCut === 'function') {
      this.audio.playRibbonCut();
    } else {
      this.audio.playBuildComplete();
    }
    this.onBuildingTactile?.(target.uid);
    this.onRewardFly?.('galleons', bonusGalleons, cx, cy);
    this.spawnFloatingText(
      cx,
      cy,
      `🎀 Khánh thành! +${bonusGalleons}G +${bonusXp}⭐ +${feastPoints}🍁`,
      '#fde047'
    );

    const celebration: RibbonUnveilCelebration = {
      uid: target.uid,
      itemId: item.id,
      buildingName: item.name,
      gx: cx,
      gy: cy,
      bonusGalleons,
      bonusXp,
      feastPoints,
      speakerName,
      speakerEmoji,
      quoteVi,
    };

    this.onRibbonUnveiled?.(celebration);
    this.saveToStorage();
    this.onUiChange?.();
    return celebration;
  }

  public ensureHarvestFeast(): HarvestFeastState {
    if (!this.state.harvestFeast) {
      this.state.harvestFeast = createInitialHarvestFeastState();
    }
    return this.state.harvestFeast;
  }

  public addHarvestFeastPoints(pts: number): { added: number; newlyUnlockedTiers: number[] } {
    if (pts <= 0 || this.isHeadmasterPreview) {
      return { added: 0, newlyUnlockedTiers: [] };
    }
    const feast = this.ensureHarvestFeast();
    const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1]?.pointsRequired ?? 5300;
    const before = feast.points;
    const after = Math.min(maxPts, before + Math.round(pts));
    const added = Math.max(0, after - before);
    feast.points = after;
    feast.totalPointsAllTime = (feast.totalPointsAllTime ?? 0) + Math.round(pts);

    const newlyUnlockedTiers: number[] = [];
    for (const def of HARVEST_FEAST_TIERS) {
      if (before < def.pointsRequired && after >= def.pointsRequired) {
        newlyUnlockedTiers.push(def.tier);
      }
    }

    if (newlyUnlockedTiers.length > 0) {
      const topTier = newlyUnlockedTiers[newlyUnlockedTiers.length - 1];
      const def = HARVEST_FEAST_TIERS.find((t) => t.tier === topTier);
      if (def) {
        this.onToast?.(
          `🍁 Đại Tiệc Mùa Gặt mở khóa Bậc ${def.tier}/${HARVEST_FEAST_TIERS.length}: "${def.titleVi}" (${formatHarvestFeastRewardVi(def)})!`,
          '🍁'
        );
      }
    }
    return { added, newlyUnlockedTiers };
  }

  public getClaimableHarvestFeastCount(): number {
    const feast = this.ensureHarvestFeast();
    const claimedSet = new Set(feast.claimedTiers);
    let count = 0;
    for (const def of HARVEST_FEAST_TIERS) {
      if (feast.points >= def.pointsRequired && !claimedSet.has(def.tier)) {
        count++;
      }
    }
    return count;
  }

  private grantHarvestFeastTierRewardInternal(tier: number): string | null {
    const feast = this.ensureHarvestFeast();
    const def = HARVEST_FEAST_TIERS.find((t) => t.tier === tier);
    if (!def) return null;
    if (feast.points < def.pointsRequired || feast.claimedTiers.includes(def.tier)) {
      return null;
    }

    feast.claimedTiers.push(def.tier);
    feast.claimedTiers.sort((a, b) => a - b);

    if (def.rewardGalleons && def.rewardGalleons > 0) {
      this.state.galleons += def.rewardGalleons;
      this.state.finance.harvestRevenue += def.rewardGalleons;
      this.onRewardFly?.('galleons', def.rewardGalleons);
    }
    if (def.rewardXp && def.rewardXp > 0) {
      this.addXp(def.rewardXp);
    }
    if (def.rewardTimeSand && def.rewardTimeSand > 0) {
      this.state.timeSand += def.rewardTimeSand;
      this.onRewardFly?.('sand', def.rewardTimeSand);
    }
    if (def.rewardMugglePlug && def.rewardMugglePlug > 0) {
      const barn = this.ensureFarmBarn();
      barn.goods.muggle_plug_kit = (barn.goods.muggle_plug_kit ?? 0) + def.rewardMugglePlug;
    }
    if (def.rewardPhoenixTalisman && def.rewardPhoenixTalisman > 0) {
      const addedTal = this.grantPhoenixTalisman(def.rewardPhoenixTalisman);
      if (addedTal < def.rewardPhoenixTalisman) {
        this.state.timeSand += def.rewardPhoenixTalisman - addedTal;
      }
    }
    if (def.rewardSeedCropId && (def.rewardSeedQty ?? 0) > 0) {
      this.addCropSeeds(def.rewardSeedCropId, def.rewardSeedQty!);
    }
    if (def.rewardGoodId && (def.rewardGoodQty ?? 0) > 0) {
      const addedGood = this.addFarmItemToBarn(def.rewardGoodId, def.rewardGoodQty!);
      if (addedGood < def.rewardGoodQty!) {
        const meta = getFarmItemMeta(def.rewardGoodId);
        this.state.galleons += meta.sellValue * (def.rewardGoodQty! - addedGood);
      }
    }
    return formatHarvestFeastRewardVi(def);
  }

  public claimHarvestFeastTier(tier: number): { ok: boolean; msg: string } {
    const label = this.grantHarvestFeastTierRewardInternal(tier);
    if (!label) {
      return { ok: false, msg: 'Bậc thưởng Đại Tiệc Mùa Gặt này chưa đủ điểm hoặc đã nhận rồi!' };
    }
    this.audio.playLevelUp();
    const msg = `🍁 Nhận quà Đại Tiệc Mùa Gặt Bậc ${tier}: ${label}!`;
    this.onToast?.(msg, '🍁');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }

  public claimAllHarvestFeastTiers(): { ok: boolean; claimedCount: number; msg: string } {
    const feast = this.ensureHarvestFeast();
    let claimedCount = 0;
    for (const def of HARVEST_FEAST_TIERS) {
      if (feast.points >= def.pointsRequired && !feast.claimedTiers.includes(def.tier)) {
        if (this.grantHarvestFeastTierRewardInternal(def.tier)) {
          claimedCount++;
        }
      }
    }
    if (claimedCount <= 0) {
      return { ok: false, claimedCount: 0, msg: 'Hiện chưa có bậc thưởng mới để nhận!' };
    }
    this.audio.playLevelUp();
    if (claimedCount >= 3) {
      this.launchFireworksShow(8);
    }
    const msg = `🍁 Đã nhận trọn ${claimedCount} bậc quà Đại Tiệc Mùa Gặt Hang Sóc!`;
    this.onToast?.(msg, '🍁');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, claimedCount, msg };
  }

  public startNextHarvestFeastCycle(): { ok: boolean; msg: string } {
    const feast = this.ensureHarvestFeast();
    if (feast.claimedTiers.length < HARVEST_FEAST_TIERS.length) {
      return {
        ok: false,
        msg: `Hãy hoàn thành và nhận đủ ${HARVEST_FEAST_TIERS.length}/${HARVEST_FEAST_TIERS.length} bậc của Mùa #${feast.seasonCycle} trước nhé!`,
      };
    }
    feast.seasonCycle += 1;
    feast.points = 0;
    feast.claimedTiers = [];
    this.audio.playLevelUp();
    this.launchFireworksShow(12);
    const msg = `🎉 Khai hội Đại Tiệc Mùa Gặt Chu Kỳ #${feast.seasonCycle}! Mọi hoạt động nông trại & giải đố tiếp tục tích điểm nhận 30 mốc quà mới!`;
    this.onToast?.(msg, '🎉');
    this.saveToStorage();
    this.onUiChange?.();
    return { ok: true, msg };
  }
}
