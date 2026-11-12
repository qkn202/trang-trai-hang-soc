export type TerrainType = 'grass' | 'snow' | 'stone' | 'forest' | 'water' | 'volcanic';

export type PathType = 'none' | 'cobble' | 'snow_brick' | 'queue_gold' | 'wood_pier';

export type HouseName = 'Gryffindor' | 'Slytherin' | 'Ravenclaw' | 'Hufflepuff';

export type HeatmapMode = 'none' | 'cleanliness' | 'wonder' | 'biome';

export type ZoneId =
  | 'ga_hogsmeade'
  | 'hem_xeo'
  | 'lang_tuyet'
  | 'vuon_thao_duoc'
  | 'bia_rung_cam'
  | 'ho_den'
  | 'ham_gringotts'
  | 'san_quidditch'
  | 'thung_lung_rong'
  | 'lau_dai_hogwarts';

export type BuildingCategory =
  | 'path'
  | 'terrain'
  | 'shop'
  | 'ride'
  | 'creature'
  | 'decor'
  | 'staff';

export type CreatureGrowthStage = 'egg' | 'baby' | 'adult' | 'legendary';

export type CreatureMorphVariant = 'normal' | 'mystic' | 'radiant';

export type SuitcaseExpeditionId =
  | 'glowing_mushroom_cave'
  | 'moonlit_black_lake'
  | 'ancient_dragon_ridge';

export type FestivalType = 'none' | 'halloween' | 'christmas' | 'quidditch_cup';

export type TimeOverride = 'realtime' | 'dawn' | 'day' | 'dusk' | 'night';

export type WeatherKind = 'sunny' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog';

export type WeatherOverride =
  | 'auto'
  | 'clear'
  | 'cloudy'
  | 'rain'
  | 'storm'
  | 'snow'
  | 'fog'
  | 'fireflies';

export type FlyRewardKind = 'galleons' | 'stars' | 'sand' | 'xp';

export interface WeatherForecastSlot {
  kind: WeatherKind;
  icon: string;
  labelVi: string;
  buffVi: string;
  startsInSec: number;
  isRainbow?: boolean;
}

export type IsoDirection = 'se' | 'sw' | 'ne' | 'nw';

export type RawIngredientId = 'mandrake_leaf' | 'sweet_pumpkin' | 'starlight_dust' | 'magic_cacao';

export type CraftedGoodId = 'aged_butterbeer' | 'felix_potion' | 'golden_choc_box' | 'dragon_firework';

export type FarmCropId =
  | 'ottery_wheat'
  | 'honey_carrot'
  | 'garden_pumpkin'
  | 'golden_corn'
  | 'crisp_cabbage'
  | 'ruby_strawberry'
  | 'burrow_apple'
  | 'burrow_potato'
  | 'baby_mandrake'
  | 'ruby_tomato'
  | 'dew_blueberry'
  | 'dried_lavender'
  | 'hedge_sunflower'
  | 'glow_mushroom'
  | 'meadow_daisy'
  | 'english_rose'
  | 'golden_daffodil'
  | 'rainbow_tulip'
  | 'forest_bluebell'
  | 'blush_peony'
  | 'moonlight_flower'
  | 'phoenix_fireflower';

export type FarmGoodId =
  | 'pumpkin_pie'
  | 'cinnamon_apple_pie'
  | 'cream_mushroom_soup'
  | 'weasley_sweater_w'
  | 'honey_apple_cider'
  | 'blossom_honey_jar'
  | 'fine_wheat_flour'
  | 'farm_egg_wool'
  | 'muggle_plug_kit'
  | 'frothy_butterbeer'
  | 'choc_frog_sweet'
  | 'sprout_growth_elixir'
  | 'floral_bouquet_gift'
  | 'creamy_dairy_milk';

export type PastureAnimalId =
  | 'burrow_hen'
  | 'ottery_sheep'
  | 'daisy_cow'
  | 'golden_puffskein'
  | 'treasure_niffler'
  | 'silver_hippogriff'
  | 'shadow_thestral'
  | 'moon_unicorn';

export type FarmItemId = FarmCropId | FarmGoodId;

export interface FarmOrderRequirement {
  itemId: FarmItemId;
  qty: number;
}

export interface FarmOwlOrder {
  id: string;
  senderId: string;
  senderName: string;
  senderTitle: string;
  portraitSprite?: string;
  portraitEmoji: string;
  owlName: 'Hedwig' | 'Errol' | 'Pigwidgeon';
  noteVi: string;
  requirements: FarmOrderRequirement[];
  rewardGalleons: number;
  rewardXp: number;
  rewardMugglePlug?: number;
  isFeastMarquee?: boolean;
}

export interface WorkshopQueueSlot {
  goodId: FarmGoodId;
  startedAt: number;
  endsAt: number;
}

export interface FarmBarnState {
  crops: Record<FarmCropId, number>;
  goods: Record<FarmGoodId, number>;
  seeds?: Partial<Record<FarmCropId, number>>;
  capacity: number;
  owlOrders: FarmOwlOrder[];
  ordersDelivered: number;
}

export type ConnectablePlotGroup =
  | 'farmland'
  | 'pumpkin_patch'
  | 'flower_garden'
  | 'chicken_yard'
  | 'animal_pasture';

export type QuizLanguageId = 'en' | 'ko' | 'zh' | 'es' | 'ja';

export type QuizProficiencyTier = 'beginner' | 'intermediate' | 'advanced';

export type QuizFormatKind =
  | 'vocab_context'
  | 'grammar_cloze'
  | 'dialogue_reply'
  | 'sentence_builder'
  | 'match_pairs';

export interface LanguageReviewItem {
  qId: string;
  dueAtTurn: number;
  misses: number;
  box?: number; // Leitner SRS Box 1..5
}

export interface LanguageSrsEntry {
  box: number; // 1..5 (5 = Mastered / Thuộc lòng)
  dueAtTurn: number;
  lapses: number;
}

export interface LanguageProfileState {
  tier: QuizProficiencyTier;
  masteryScore: number; // 1..100 adaptive difficulty mapped across Level 1 -> 100
  streak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  seedsEarned: number;
  recentIds: string[];
  reviewQueue: LanguageReviewItem[];
  srsBoxes?: Record<string, LanguageSrsEntry>;
}

export interface LanguageQuizState {
  activeLang: QuizLanguageId;
  autoSpeak: boolean;
  preferredFormat: 'all' | QuizFormatKind;
  profiles: Record<QuizLanguageId, LanguageProfileState>;
}

export interface ZoneDef {
  id: ZoneId;
  name: string;
  subtitle: string;
  x1: number;
  y1: number;
  x2: number; // inclusive
  y2: number; // inclusive
  defaultTerrain: TerrainType;
  unlockLevel: number;
  unlockCost: number;
  guardianName: string;
  guardianQuote: string;
  accentColor: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  category: BuildingCategory;
  description: string;
  loreTip: string;
  width: number;
  height: number;
  cost: number;
  unlockLevel: number;
  spriteKey?: string;
  terrainType?: TerrainType;
  pathType?: PathType;
  elevationDelta?: 1 | -1; // Terrain raise/lower tool
  isCoasterTrackPiece?: boolean; // Paintable coaster rail tile
  isZooFence?: boolean; // Paintable Zoo Tycoon sanctuary fence tile
  buildDurationSec: number; // Real-time construction or egg incubation duration
  baseIncome: number; // Galleons produced per cycle
  xpPerCollect: number; // XP earned when bubble is harvested
  cycleSec: number; // Seconds to generate a collectible bubble
  maxStorageCycles: number; // Offline storage cap (scales with stars)
  wonder: number; // Kỳ Diệu
  thrill: number; // Kịch Tính
  comfort: number; // Tiện Nghi
  ticketPrice?: number;
  grantsWand?: boolean;
  grantsButterbeer?: boolean;
  grantsHouseScarf?: boolean;
  causesCanaryPrank?: boolean;
  curesStatus?: boolean;
  isRestroom?: boolean;
  isBench?: boolean;
  isBackstage?: boolean;
  isPrivacyShield?: boolean;
  isCustomCoasterStation?: boolean;
  isCreatureFeeder?: boolean;
  isInteractiveSpellSpot?: boolean;
  isCreatureHabitat?: boolean;
  creatureName?: string;
  preferredTerrains?: TerrainType[];
  canEscape?: boolean;
  isHouseElfStation?: boolean;
  // V3 Essential Systems flags
  isFlooPortal?: boolean; // Instant Floo Network teleportation between distant zones
  isWorkshopBrewery?: boolean; // Speeds up supply-chain crafting
  producesIngredient?: RawIngredientId; // Yields raw magical ingredient upon harvest
  isFireworksLauncher?: boolean; // Launches nighttime dragon fireworks
  // V5 Playrix Township 2.5D Canon Farmstead flags
  productIconKey?: string; // Specific 3D product sprite inside floating harvest bubble
  spriteScale?: number; // Custom visual footprint multiplier for landmark fidelity
  isRuralFarmstead?: boolean; // Rural Burrow building (never shows urban road warning)
  isFarmlandPlot?: boolean; // Unified 4-stage interactive farmland plot (Swipe-to-Plant & Swipe-to-Harvest)
  isAnimalPasturePlot?: boolean; // Unified connectable 2x2 animal pasture plot (Swipe-to-Stock & Swipe-to-Harvest)
  connectableGroup?: ConnectablePlotGroup; // Auto-merges shared wooden borders with same-group 2x2 neighbors
  workshopGroupId?: string; // Canon workshop recipe family ('molly_kitchen', 'knitting_loom', etc.)
  isThemeParkLegacy?: boolean; // Hidden theme-park coaster/ride/restroom legacy item
}

export interface TileOverrideData {
  terrain?: TerrainType;
  path?: PathType;
  hasLitter?: boolean;
  elevation?: number; // 0..3
  coasterTrack?: boolean;
  zooFence?: boolean;
}

export interface TileCell {
  gx: number;
  gy: number;
  zoneId: ZoneId;
  terrain: TerrainType;
  path: PathType;
  elevation: number; // 0..3
  coasterTrack: boolean;
  zooFence: boolean;
  buildingUid: string | null;
  hasLitter: boolean; // Rác phép thuật / vũng bùa lỗi cần dọn
}

export interface CoasterTrackStats {
  tileCount: number;
  lengthMeters: number;
  maxDrop: number;
  turns: number;
  hasChainLift?: boolean;
  topSpeedKmh?: number;
  isClosedCircuit: boolean;
  excitement: number;
  intensity: number;
  nausea: number;
}

export interface PlacedBuilding {
  uid: string;
  itemId: string;
  gx: number;
  gy: number;
  rotation: 0 | 1 | 2 | 3;
  stars: number; // 1 to 5
  placedAt: number;
  constructEndsAt: number; // Date.now() timestamp when ready
  lastTickAt: number;
  storedGalleons: number;
  storedXp: number;
  readyBubbles: number; // Number of cycles ready to harvest
  durability: number; // 0..100 for rides / containment wards
  isBrokenDown?: boolean; // V3 RCT Breakdown requiring Artificer or Reparo
  breakdownReason?: string;
  visitorsServed: number;
  customPrice?: number; // Player micro-adjusted ticket / shop price
  coasterStats?: CoasterTrackStats;
  // Creature specific
  creatureStage?: CreatureGrowthStage;
  creatureHunger?: number; // 0..100
  creatureHappiness?: number; // 0..100
  biomeScore?: number; // 0..100 Zoo Tycoon habitat suitability
  hasBabyOffspring?: boolean; // Unlocked when biomeScore >= 80
  feedCount?: number;
  isEscaped?: boolean;
  creatureNickname?: string; // Custom pet name in Magical Suitcase
  creatureBondXp?: number; // Bonding closeness XP
  creatureBondLevel?: number; // 1..10 Bond Rank
  creatureMorph?: CreatureMorphVariant; // 'normal' | 'mystic' | 'radiant'
  lastGroomedAt?: number;
  lastTrainedAt?: number;
  isIndestructible?: boolean;
  builtInSandbox?: boolean;
  constructionNotified?: boolean;
  awaitingUnveil?: boolean; // Chờ Lễ Cắt Băng Khánh Thành công trình mới xây xong
  buildReducedSec?: number; // Tổng số giây đã rút ngắn xây dựng nhờ thắng Minigame & Quiz Ngoại Ngữ
  // V6 Canon Farmstead 4-Stage Crops, Connectable Pastures & Workshop Production Queue
  cropId?: FarmCropId | null;
  cropPlantedAt?: number;
  cropReadyAt?: number;
  cropWateredBoost?: boolean;
  cropRotatedBonus?: boolean; // Mùa Vụ Vàng Luân Canh (+100% sản lượng khi đổi họ cây trồng)
  pastureAnimalId?: PastureAnimalId | null;
  pastureStockedAt?: number;
  pastureReadyAt?: number;
  pastureFedBoost?: boolean;
  workshopQueue?: WorkshopQueueSlot[];
  readyFarmGoods?: FarmGoodId[];
  harvestCycleCount?: number; // Số lần đã thu hoạch / hoàn thành chu kỳ kinh tế (lần đầu = 1h, các lần sau nhân 2^n)
}

export interface BuildReductionResult {
  reducedSec: number;
  targetUid?: string;
  targetName?: string;
  remainAfterSec?: number;
  floorSec?: number;
  hitMinFloor?: boolean;
  allActiveAtFloor?: boolean;
  activeCount: number;
}

export interface GuestEntity {
  id: string;
  name: string;
  house: HouseName;
  gx: number;
  gy: number;
  targetGx: number;
  targetGy: number;
  facing: IsoDirection;
  speed: number;
  happiness: number;
  hunger: number;
  energy: number;
  bladder: number;
  galleons: number;
  hasWand: boolean;
  hasButterbeer: boolean;
  wearingHouseScarf: boolean;
  canaryTimer: number; // > 0 means transformed into a giant yellow canary!
  spellCooldown: number;
  flooCooldown?: number;
  isVip?: boolean;
  vipEmoji?: string;
  spellBeamTarget?: { gx: number; gy: number; timer: number };
  thought: string;
  thoughtIcon: string;
  state: 'walking' | 'queuing' | 'riding' | 'sitting';
  queueBuildingUid?: string;
  queueSlotIndex?: number;
  ridingTimer: number;
  sittingTimer: number;
  patrolCenter?: { gx: number; gy: number; radius: number };
}

export interface StaffEntity {
  id: string;
  role: 'caretaker' | 'artificer' | 'magizoologist' | 'auror' | 'house_elf';
  name: string;
  gx: number;
  gy: number;
  targetGx: number;
  targetGy: number;
  facing: IsoDirection;
  actionText: string;
  busyTimer: number;
  patrolZoneId?: ZoneId | 'all';
  patrolCenter?: { gx: number; gy: number; radius: number };
}

export type ValleyVillagerId = 'molly' | 'arthur' | 'ron' | 'ginny' | 'hagrid' | 'hermione';

export interface ValleyVillagerEntity {
  id: ValleyVillagerId;
  nameVi: string;
  titleVi: string;
  idleSprite: string;
  walkSprite: string;
  gx: number;
  gy: number;
  targetGx: number;
  targetGy: number;
  facingLeft: boolean;
  state: 'walking' | 'admiring';
  pauseTimer: number;
  speed: number;
  moodBubble: string;
  bubbleTimer: number;
  greetCooldownSec: number;
  favoriteItemIds: string[];
  walkPhase: number;
}

export interface RibbonUnveilCelebration {
  uid: string;
  itemId: string;
  buildingName: string;
  gx: number;
  gy: number;
  speakerName: string;
  speakerEmoji: string;
  quoteVi: string;
  bonusGalleons: number;
  bonusXp: number;
  feastPoints: number;
}

export interface HarvestFeastTierDef {
  tier: number; // 1..30
  pointsRequired: number;
  titleVi: string;
  icon: string;
  rewardGalleons?: number;
  rewardXp?: number;
  rewardTimeSand?: number;
  rewardSeedCropId?: FarmCropId;
  rewardSeedQty?: number;
  rewardGoodId?: FarmGoodId;
  rewardGoodQty?: number;
  rewardMugglePlug?: number;
  rewardPhoenixTalisman?: number;
}

export interface HarvestFeastState {
  seasonCycle: number; // 1+ (prestigeable after claiming all 30 tiers)
  points: number;
  claimedTiers: number[]; // 1..30
  totalPointsAllTime: number;
  unveilsCompleted: number;
}

export interface EscapedCreatureEntity {
  id: string;
  buildingUid: string;
  species: 'niffler' | 'dragon' | 'hippogriff';
  name: string;
  gx: number;
  gy: number;
  vx: number;
  vy: number;
  stolenCoins: number;
}

export interface FloatingEffect {
  id: string;
  gx: number;
  gy: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

export interface FireworkBurst {
  id: string;
  gx: number;
  gy: number;
  zHeight: number;
  color: string;
  life: number;
  maxLife: number;
}

export const MAX_STAFF_PER_ROLE = 6;
export const MAX_RIDE_QUEUE = 8;

export type QuestObjectiveType =
  | 'build_item'
  | 'harvest_galleons'
  | 'serve_butterbeer'
  | 'sell_wands'
  | 'cast_spells'
  | 'feed_creatures'
  | 'upgrade_star'
  | 'unlock_zone'
  | 'reach_level'
  | 'place_paths'
  | 'win_minigame';

export type MinigameTrialKind = 'match3' | 'sudoku' | 'caro' | 'chess' | 'blocks';

export interface PhoenixTalismanDailyUsageState {
  dayKey: string; // YYYY-MM-DD (không reset khi chơi lại/qua màn, chỉ mở lại khi sang ngày mới)
  usedByGame: Partial<Record<MinigameTrialKind, boolean>>;
}

export interface LevelTrialRequirement {
  kind: MinigameTrialKind;
  icon: string;
  shortVi: string;
  titleVi: string;
  descVi: string;
}

export interface QuestDef {
  id: string;
  kind: 'story' | 'owl_order' | 'daily';
  chapter?: number;
  giverName: string;
  giverTitle: string;
  giverEmoji: string;
  title: string;
  dialogue: string;
  objectiveType: QuestObjectiveType;
  targetId?: string;
  targetAmount: number;
  progress: number;
  rewardGalleons: number;
  rewardXp: number;
  rewardTimeSand: number;
  completed: boolean;
  claimed: boolean;
}

export interface LevelRewardInfo {
  level: number;
  xpRequired: number;
  rewardGalleons: number;
  rewardTimeSand: number;
  titleUnlock?: string;
  unlockedItemIds: string[];
  unlockedZoneId?: ZoneId;
  milestoneNote?: string;
  trialRequirement?: LevelTrialRequirement;
}

export interface OfflineReport {
  awaySeconds: number;
  galleonsEarned: number;
  xpEarned: number;
  buildingsFinished: number;
  houseElfAutoCollected: number;
}

export interface FinanceLedger {
  gateRevenue: number;
  ticketRevenue: number;
  shopRevenue: number;
  harvestRevenue: number;
  staffWagesPaid: number;
  constructionSpent: number;
}

export interface ExpressCargoCrate {
  id: string;
  goodId: CraftedGoodId;
  qtyRequired: number;
  fulfilled: boolean;
  rewardGalleons: number;
  rewardXp: number;
  rewardTimeSand: number;
}

export interface SupplyChainState {
  ingredients: Record<RawIngredientId, number>;
  goods: Record<CraftedGoodId, number>;
  activeBrew?: {
    goodId: CraftedGoodId;
    endsAt: number;
  } | null;
  butterbeerBoostEndsAt: number; // +100% shop income while active
  felixBoostEndsAt: number; // +35% card chance & +25% XP while active
  cargoTrainIndex: number;
  cargoCrates: ExpressCargoCrate[];
  lastHerbPlotHarvestAt: number;
  brewCompletedCount?: number; // Số mẻ nấu đã hoàn thành (lần đầu = 1h, các lần sau tăng theo cấp số nhân)
}

export interface ActiveVipVisit {
  vipId: string;
  name: string;
  title: string;
  emoji: string;
  guestId: string;
  goalLabel: string;
  endsAt: number;
  satisfiedScore: number; // 0..100
}

export interface SuitcaseSanctuaryState {
  discoveredMorphs: string[]; // Format: `${itemId}:${morph}`
  activeIncubation?: {
    habitatUid: string;
    itemId: string;
    boostedWithStarlight: boolean;
    startedAt: number;
    endsAt: number;
  } | null;
  activeExpedition?: {
    habitatUid: string;
    expeditionId: SuitcaseExpeditionId;
    startedAt: number;
    endsAt: number;
  } | null;
  totalGrooms: number;
  totalExpeditions: number;
  totalMorphsHatched: number;
}

export type Match3BoosterId = 'reparo_hammer' | 'row_col_cannon' | 'alohomora_shuffle';

export type PuzzleArcadeMode = 'sudoku' | 'caro' | 'chess' | 'blocks';

export const ACTIVE_MINIGAME_RESUME_KEY = 'hangsoc_active_minigame_modal_v1';

export interface ActiveMinigameResumeRecord {
  dialog: 'puzzleArcade' | 'match3';
  mode: PuzzleArcadeMode | 'match3';
  stage: number;
  savedAt: number;
}

export interface SavedSudokuUndoItem {
  grid: number[][];
  notes: number[][];
  selected: { r: number; c: number } | null;
}

export interface SavedSudokuSession {
  stage: number;
  solution: number[][];
  initialGiven: boolean[][];
  given: boolean[][];
  grid: number[][];
  notes: number[][];
  mistakesCount: number;
  maxMistakes: number;
  freeHintsLeft: number;
  paidHintsLeft: number;
  talismanUsed: boolean;
  pencilMode: boolean;
  eraseMode: boolean;
  selected: { r: number; c: number } | null;
  highlightDigit: number;
  elapsedSec: number;
  status: 'playing' | 'lost';
  editHistory: Array<{ r: number; c: number }>;
  undoStack: SavedSudokuUndoItem[];
  companionCharge?: number;
  snackPieUsed?: boolean;
  savedAt: number;
}

export interface SavedCaroSession {
  stage: number;
  grid: Array<Array<0 | 1 | 2 | 3>>;
  moveHistory: Array<{ r: number; c: number; stone: 1 | 2 }>;
  initialHistoryLen: number;
  runeSealCount: number;
  winningLine: Array<{ r: number; c: number }> | null;
  hintCell: { r: number; c: number } | null;
  freeUndosLeft: number;
  paidUndosLeft: number;
  freeHintsLeft: number;
  paidHintsLeft: number;
  talismanUsed: boolean;
  status: 'playing' | 'ai_thinking' | 'lost' | 'draw';
  companionCharge?: number;
  snackPieUsed?: boolean;
  savedAt: number;
}

export interface SavedChessPiece {
  color: 'w' | 'b';
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
}

export interface SavedChessCastling {
  wK: boolean;
  wQ: boolean;
  bK: boolean;
  bQ: boolean;
}

export interface SavedChessHistoryItem {
  board: Array<Array<SavedChessPiece | null>>;
  turn: 'w' | 'b';
  castling: SavedChessCastling;
  enPassant: { r: number; c: number } | null;
  capturedByWhite: Array<'p' | 'n' | 'b' | 'r' | 'q' | 'k'>;
  capturedByBlack: Array<'p' | 'n' | 'b' | 'r' | 'q' | 'k'>;
  lastMove: { fromR: number; fromC: number; toR: number; toC: number } | null;
  halfMoveClock: number;
}

export interface SavedChessSession {
  stage: number;
  subMode: 'tactics' | 'match';
  loadedFen: string;
  board: Array<Array<SavedChessPiece | null>>;
  turn: 'w' | 'b';
  castling: SavedChessCastling;
  enPassant: { r: number; c: number } | null;
  capturedByWhite: Array<'p' | 'n' | 'b' | 'r' | 'q' | 'k'>;
  capturedByBlack: Array<'p' | 'n' | 'b' | 'r' | 'q' | 'k'>;
  lastMove: { fromR: number; fromC: number; toR: number; toC: number } | null;
  hintMove: { fromR: number; fromC: number; toR: number; toC: number } | null;
  selected: { r: number; c: number } | null;
  halfMoveClock: number;
  moveCount: number;
  freeUndosLeft: number;
  paidUndosLeft: number;
  freeHintsLeft: number;
  paidAssistsLeft: number;
  talismanUsed: boolean;
  status: 'playing' | 'ai_thinking' | 'lost' | 'draw';
  history: SavedChessHistoryItem[];
  companionCharge?: number;
  snackPieUsed?: boolean;
  savedAt: number;
}

export interface SavedOnetSession {
  stage: number;
  rows: number;
  cols: number;
  grid: Array<Array<string | null>>;
  selected: { r: number; c: number } | null;
  hintPair: [{ r: number; c: number }, { r: number; c: number }] | null;
  hintPath: Array<{ r: number; c: number }> | null;
  matchedPairs: number;
  combo: number;
  maxCombo: number;
  score: number;
  movesAttempted: number;
  autoShufflesCount: number;
  lives: number;
  freeHintsLeft: number;
  paidHintsLeft: number;
  paidShufflesLeft: number;
  talismanUsed: boolean;
  timeLimitSec?: number;
  timeRemainingSec?: number;
  lossReason?: 'deadlock' | 'timeout' | null;
  status: 'playing' | 'lost';
  companionCharge?: number;
  snackPieUsed?: boolean;
  savedAt: number;
}

export interface SavedMatch3Piece {
  color: number;
  special: 'striped_h' | 'striped_v' | 'wrapped' | 'seeker' | 'color_bomb' | null;
  blocker: 'swirl' | null;
  isIngredient: boolean;
  bombTimer: number | null;
  hasKey: boolean;
  primedWrapped: boolean;
  primedMega: boolean;
}

export interface SavedMatch3Session {
  levelId: number;
  size: number;
  house: 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';
  mask: number[][];
  jelly: number[][];
  ice: number[][];
  frosting: number[][];
  chocolate: number[][];
  cauldron: number[][];
  cauldronCharge: number[][];
  lockGrid: number[][];
  petrify: number[][];
  dementor: number[][];
  dementorCharge: number[][];
  decree: number[][];
  fiendfyre: number[][];
  horcrux: number[][];
  grid: Array<Array<SavedMatch3Piece | null>>;
  ingredientsCollected: number;
  ingredientsSpawned: number;
  pendingBombSpawns: number;
  bossHp: number;
  bossDefeated: boolean;
  bossEnraged: boolean;
  pendingBossEnrageBurst: boolean;
  bossEffectiveCastInterval: number;
  patronusCharge: number;
  score: number;
  movesLeft: number;
  movesUsed: number;
  talismanUsed: boolean;
  status: 'playing' | 'out_of_moves';
  failReason: 'moves' | 'bomb' | null;
  collected: Record<string, number>;
  specialStats: {
    striped: number;
    wrapped: number;
    seeker: number;
    color_bomb: number;
  };
  movesMadeThisAttempt: number;
  companionCharge?: number;
  snackPieUsed?: boolean;
  savedAt: number;
}

export interface PuzzleArcadeState {
  activeMode: PuzzleArcadeMode;
  sudokuStage: number;
  caroStage: number;
  chessStage: number;
  jigsawStage: number;
  blockStage: number;
  tileStage: number;
  sudokuCleared?: number;
  caroCleared?: number;
  chessCleared?: number;
  blockCleared?: number;
  featuredWinsCount?: number;
  restoredPaintings: string[];
  totalPuzzlesSolved: number;
  sudokuSession?: SavedSudokuSession | null;
  caroSession?: SavedCaroSession | null;
  chessSession?: SavedChessSession | null;
  onetSession?: SavedOnetSession | null;
}

export interface Match3ProgressionState {
  stars: number; // 🌟 Sao Phép Thuật (Gardenscapes / Royal Match central progression currency)
  totalStarsEarned: number;
  currentLevel: number; // Tower Stage 1 -> 777
  maxClearedLevel?: number; // Highest cleared Match-3 stage (0 -> 777)
  winStreak: number; // 0..3+ Butler Gift pre-level power-up streak
  hearts: number; // 0..5 ❤️ Lives
  nextHeartAt: number; // Timestamp ms when next heart regenerates (0 when full)
  boosters: Record<Match3BoosterId, number>;
  levelsWon: number;
  activeSession?: SavedMatch3Session | null;
}

export type LeaderboardGameId = 'match3' | 'caro' | 'sudoku' | 'chess' | 'blocks' | 'seedquiz';

export type LeaderboardScope = 'valley' | 'friends' | 'personal';

export interface LeaderboardRankChange {
  gameId: LeaderboardGameId;
  previousRank: number;
  newRank: number;
  rankUpBy: number;
  totalEntries: number;
  housePointsAwarded?: number;
  playerHouse?: HouseName;
  houseRank?: number;
}

export interface MinigamePersonalRecord {
  bestStage: number; // Highest cleared stage (0..777), or combined mastery (0..500) for seedquiz
  highScore: number; // Best rating / cumulative score in this discipline
  bestSessionScore: number; // Best single-match score (or best streak score)
  totalWins: number; // Total victories / correct spell incantations in this discipline
  bestStreak: number; // Highest streak achieved in this discipline
  bestEfficiency?: number; // Fewest turns (caro/chess), fewest mistakes (sudoku), max lines (blocks), or mastered Box-5 words (seedquiz)
  lastRankValley?: number;
  updatedAt: number;
}

export interface MinigameLeaderboardState {
  playerHouse?: HouseName;
  records: Record<LeaderboardGameId, MinigamePersonalRecord>;
}

export type NeighborPresetNoteId =
  | 'bountiful_harvest'
  | 'cozy_hearth'
  | 'sweet_bakery'
  | 'lucky_stars'
  | 'owl_greetings';

export type NeighborGardenHelpKind = 'water_crop' | 'tend_yard' | 'stoke_workshop';

export interface NeighborOwlHelpCrate {
  id: string;
  senderName: string;
  itemId: FarmItemId;
  qty: number;
  rewardGalleons: number;
  rewardXp: number;
  rewardTokens: number;
  fulfilledByPlayerToday?: boolean;
}

export interface NeighborMinigameSos {
  kind: MinigameTrialKind;
  stage: number;
  noteVi: string;
  rescuedToday?: boolean;
}

export interface NeighborHelpedBuildingMark {
  buildingUid: string;
  kind: NeighborGardenHelpKind;
  helperName: string;
  noteId?: NeighborPresetNoteId;
  noteText: string;
  helpedAt: number;
}

export interface VerifiedRealPlayerProfile {
  userId: string;
  friendCode: string;
  name: string;
  parkName: string;
  level: number;
  house: HouseName;
  avatarEmoji?: string;
  avatarUrl?: string;
  bioVi?: string;
  buildings?: PlacedBuilding[];
  tileOverrides?: Record<string, TileOverrideData>;
  unlockedZones?: ZoneId[];
  scene?: {
    weather?: string;
    atmosphere?: string;
    event?: string;
  };
  updatedAt?: number;
}

export interface FlooVisitDirectoryRow {
  uid: string;
  friendCode?: string;
  username: string;
  parkName?: string;
  house?: HouseName;
  avatarEmoji?: string;
  avatarUrl?: string;
  level: number;
  growing: number;
  helped?: boolean;
  hostHelpsLeft?: number;
  fire?: {
    mode: string;
    since: number;
    until: number;
    burned?: number;
  } | null;
  scene?: {
    weather?: string;
    atmosphere?: string;
    event?: string;
  };
  rawClientSave?: Record<string, unknown>;
  updatedAt?: number;
}

export interface HonorGardenTourDef {
  id: string;
  ownerName: string;
  titleVi: string;
  keeperTitleVi: string;
  avatarEmoji: string;
  house: HouseName;
  level: number;
  atmosphere: TimeOverride;
  weather: WeatherOverride;
  descVi: string;
}

export interface NeighborProfileState {
  id: string;
  remoteUserId?: string;
  isVerifiedPlayer?: boolean;
  friendCode: string;
  name: string;
  titleVi: string;
  parkName: string;
  avatarEmoji: string;
  avatarUrl?: string;
  portraitSprite?: string;
  house: HouseName;
  level: number;
  likesCount: number;
  isCanonPreset?: boolean;
  bioVi: string;
  valleyBuildings?: PlacedBuilding[];
  valleyTileOverrides?: Record<string, TileOverrideData>;
  valleyUnlockedZones?: ZoneId[];
  // Floo Portal directory live metadata (`hagridfarm` style)
  growingCount?: number;
  helpedViaFlooToday?: boolean;
  hostHelpsLeft?: number;
  fireUntilMs?: number | null;
  scene?: {
    weather?: string;
    atmosphere?: string;
    event?: string;
  };
  // Daily interactive states on this neighbor's farm (reset at 00:00 local)
  helpedMarksToday: NeighborHelpedBuildingMark[];
  owlHelpCrates: NeighborOwlHelpCrate[];
  minigameSos: NeighborMinigameSos | null;
  mysteryGiftGx: number;
  mysteryGiftGy: number;
}

export interface HomeOwlLanternMark {
  id: string;
  buildingUid: string;
  helperId: string;
  helperName: string;
  helperEmoji: string;
  helperAvatarUrl?: string;
  kind: NeighborGardenHelpKind;
  noteVi: string;
  createdAt: number;
}

export interface PlayerMinigameSosState {
  id: string;
  kind: MinigameTrialKind;
  stage: number;
  requestedAt: number;
  rescuedAt?: number; // Timestamp when neighbor completes rescue (ready to claim!)
  rescuerId?: string;
  rescuerName?: string;
  rescuerEmoji?: string;
  rescuerNoteVi?: string;
  ghostReplaySummaryVi?: string;
  ghostReplayMoves?: string[];
  claimed?: boolean;
}

export type CropFamily = 'grain' | 'produce' | 'flower' | 'magical';

export interface PlotSoilStateEntry {
  lastFamily: CropFamily;
  fatigueStep: number;
  updatedAt: number;
}

export type LayoutPresetId = 'layout_1' | 'layout_2' | 'layout_3';

export interface LayoutPresetEntry {
  id: LayoutPresetId;
  label: string;
  savedAt: number;
  placements: Array<{
    uid: string;
    itemId: string;
    gx: number;
    gy: number;
    rotation: 0 | 1 | 2 | 3;
  }>;
}

export interface PlayerOwlCrateHelpRequest {
  orderId: string;
  reqIndex: number;
  itemId: FarmItemId;
  qty: number;
  requestedAt: number;
  fulfilledAt?: number;
  helperName?: string;
  helperEmoji?: string;
}

export interface NeighborSocialLogEntry {
  id: string;
  timestamp: number;
  icon: string;
  textVi: string;
}

export interface MinigameRescueContext {
  neighborId: string;
  neighborName: string;
  neighborEmoji: string;
  kind: MinigameTrialKind;
  stage: number;
}

export interface NeighborSocialState {
  playerFriendCode: string;
  playerDisplayName?: string;
  playerAvatarUrl?: string;
  selectedPresetNoteId: NeighborPresetNoteId;
  friendshipTokens: number; // 🍀 Huy Hiệu Tình Bạn (10 -> Mở Rương Quà Tình Bạn)
  chestsOpened: number;
  heartsReceivedCount: number;
  lastSocialResetKey: string; // YYYY-MM-DD local date (00:00 reset)
  dailyRescuesGivenIds: string[]; // Max 5 friends/day, strictly 1/friend/day
  dailyRescuesReceivedCount: number; // Max 5 rescues received/day
  dailyLikedNeighborIds: string[]; // 1 like/friend/day
  dailyMysteryClaimedIds: string[]; // 1 mystery basket/friend/day
  dailyOwlHelpRequestedCount: number; // Max 5 owl crate help calls/day
  dailyGardenHelpsCount?: number; // Max 5 garden helps/day across all friends
  dailyHomeLanternsClaimedCount?: number; // Max 5 home lantern helps received/claimed per day
  dailyHonorTourClaimed?: boolean; // 1x/day inspiration gift from touring an Honor Garden
  dailyFlooShareClaimed?: boolean; // 1x/day gift from sharing/saving a Valley Postcard to Floo
  lastSeenHelperAt?: number; // Latest helper notification timestamp shown as toast
  neighbors: NeighborProfileState[];
  homeLanternMarks: HomeOwlLanternMark[];
  playerMinigameSos: PlayerMinigameSosState | null;
  playerOwlHelpRequests: PlayerOwlCrateHelpRequest[];
  activityLog: NeighborSocialLogEntry[];
}

export type AchievementCategory =
  | 'farm'
  | 'building'
  | 'puzzle'
  | 'language'
  | 'social'
  | 'collection';

export interface AchievementProgressEntry {
  unlockedAt?: number;
  claimedAt?: number;
  notifiedAt?: number;
}

export interface NpcFriendshipEntry {
  villagerId: ValleyVillagerId;
  level: number; // 1..10
  xp: number;
  lastTalkedDayKey?: string;
}

export type SaveSlotId = 'slot_1' | 'slot_2' | 'slot_3' | 'autosave';

export interface RetentionNarrativeState {
  schemaVersion: number;
  achievements: Record<string, AchievementProgressEntry>;
  pendingToasts: string[];
  npcFriendship: Record<string, NpcFriendshipEntry>;
  unlockedStoryChapters: string[];
  claimedLoginDays: number[]; // [1..7]
  lastLoginClaimDayKey?: string;
  activeSaveSlotId: SaveSlotId;
}

export interface GameState {
  version: number;
  parkName: string;
  level: number;
  xp: number;
  galleons: number;
  timeSand: number; // Cát Xoay Thời Gian (Time-Turner charges)
  sandboxMode: boolean;
  sandboxTainted?: boolean; // Đánh dấu vĩnh viễn hồ sơ từng bật Sandbox (chặn đẩy lên Cloud/BXH)
  parkEntryFee: number; // 0..50 Galleons gate fee
  unlockedZones: ZoneId[];
  buildings: PlacedBuilding[];
  tileOverrides: Record<string, TileOverrideData>;
  storyQuestIndex: number;
  storyQuestProgress: Record<string, number>;
  storyClaimedIds: string[];
  owlQuests: QuestDef[];
  dailyQuests: QuestDef[];
  lastDailyResetKey: string; // YYYY-MM-DD local date
  collectedCards: Record<string, number>; // Chocolate Frog Wizard Cards id -> count
  housePoints: Record<HouseName, number>; // Hogwarts House Cup points
  houseCupMilestoneTier: number;
  supply: SupplyChainState;
  farmBarn?: FarmBarnState;
  languageQuiz?: LanguageQuizState;
  neighborSocial?: NeighborSocialState;
  tutorial?: TutorialState;
  harvestFeast?: HarvestFeastState;
  minigameLeaderboard?: MinigameLeaderboardState;
  suitcase: SuitcaseSanctuaryState;
  match3: Match3ProgressionState;
  puzzleArcade: PuzzleArcadeState;
  lastPlayedMinigame?: LeaderboardGameId;
  levelUpTrialCompletedLevel?: number;
  puzzleLevelWinsProgress?: number;
  featuredStarClaimedLevel?: number;
  phoenixTalismans?: number; // 🔥 Bùa Hộ Mệnh Phượng Hoàng (earned via Owl Orders & Language Quiz, never via losing!)
  phoenixTalismanDaily?: PhoenixTalismanDailyUsageState; // Khóa cứng 1 lần/môn/ngày (tối đa 5 lần/ngày trên 5 môn khảo thí)
  quizTalismanProgress?: number; // 0..7 correct quiz answers toward next Phoenix Talisman
  cropMastery?: Partial<Record<FarmCropId, number>>; // Account-bound harvests per crop (Tier I..V)
  plotSoilState?: Record<string, PlotSoilStateEntry>; // Persisted by "gx,gy" to prevent bulldoze-plot reset exploit
  morningDewPhials?: number; // 🧪 Bình Sương Mai (-15m targeted timer warp)
  examWinStreak?: number; // Consecutive minigame stage wins (x1 -> x3 timer reduction)
  stashedDecorInventory?: Record<string, number>; // Quick-stashed decor items ready to re-place for 0G
  stashedDecorStars?: Record<string, number[]>; // Preserves 1★–5★ upgrade tiers for stashed decor items
  unveiledItemIds?: string[]; // Building types that have already claimed their one-time Ribbon Unveil reward
  finishXpItemIds?: string[]; // Building types that have already claimed their one-time construction finish XP
  layoutPresets?: Partial<Record<LayoutPresetId, LayoutPresetEntry>>;
  a11ySettings?: {
    colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    fontScale: 100 | 125 | 150;
    highContrast: boolean;
    keyboardFocusVisible?: boolean;
    volumes: { master: number; music: number; sfx: number; ambience: number; voice: number };
  };
  weeklyHouseCupServerStandings?: {
    weekKey: string;
    totals: Record<HouseName, number>;
    playerContribution: number;
    updatedAt: number;
  };
  retention?: RetentionNarrativeState;
  staffPatrolZones: Record<string, ZoneId | 'all'>;
  lastProphetHeadline?: {
    title: string;
    subtitle: string;
    positive: boolean;
  };
  finance: FinanceLedger;
  stats: {
    totalGalleonsHarvested: number;
    farmHarvestsCount?: number;
    neighborHelpsDone?: number;
    butterbeerServed: number;
    wandsSold: number;
    spellsCastByGuests: number;
    creaturesFed: number;
    starUpgradesDone: number;
    pathsPlaced: number;
    nifflersCaught: number;
    coasterRiders: number;
    cardsFound: number;
    repairsDone?: number;
    cargoTrainsSent?: number;
    vipsHosted?: number;
    minigamesWon?: number;
  };
  staffHired: {
    caretaker: number;
    artificer: number;
    magizoologist: number;
    auror: number;
    house_elf: number;
  };
  settings: {
    showGrid: boolean;
    cutawayMode?: boolean;
    soundEnabled: boolean;
    bgmEnabled: boolean;
    weatherOverride: WeatherOverride;
    timeOverride: TimeOverride;
    activeFestival: 'auto' | FestivalType;
  };
  lastSavedAt: number;
}

export type TutorialStepId =
  | 'harvest_wheat'
  | 'sow_and_merge_plot'
  | 'pasture_harvest_and_stock'
  | 'seed_quiz_or_buy'
  | 'earn_magic_star'
  | 'build_and_owl_order'
  | 'completed';

export type TutorialNpcPose = 'npc_molly_welcome' | 'npc_molly_guide' | 'npc_molly_cheer';

export interface TutorialStepDef {
  index: number;
  id: Exclude<TutorialStepId, 'completed'>;
  pose: TutorialNpcPose;
  speakerName: string;
  speakerTitle: string;
  title: string;
  dialogue: string;
  hintVi: string;
  ctaLabel: string;
  rewardLabel: string;
  rewardGalleons: number;
  rewardXp: number;
  rewardStars?: number;
  rewardTimeSand?: number;
  rewardTalismans?: number;
  rewardSeedCropId?: FarmCropId;
  rewardSeedQty?: number;
  rewardGoodId?: FarmGoodId;
  rewardGoodQty?: number;
}

export interface TutorialState {
  active: boolean;
  stepIndex: number;
  stepId: TutorialStepId;
  skipped: boolean;
  minimized?: boolean;
  completedAt?: number;
  pastureHarvestedInStep3?: boolean;
  claimedSteps: number[];
}
