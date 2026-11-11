import { getCatalogItem } from '../data/catalog';
import { ZONES } from '../data/zones';
import {
  CatalogItem,
  FarmCropId,
  FarmItemId,
  FlooVisitDirectoryRow,
  HomeOwlLanternMark,
  HonorGardenTourDef,
  HouseName,
  MinigameTrialKind,
  NeighborGardenHelpKind,
  NeighborOwlHelpCrate,
  NeighborPresetNoteId,
  NeighborProfileState,
  NeighborSocialState,
  PlacedBuilding,
  TileOverrideData,
  TimeOverride,
  VerifiedRealPlayerProfile,
  WeatherOverride,
  ZoneId,
} from '../types/game';

export const MAX_DAILY_FRIEND_HELPS = 5;
export const MAX_DAILY_MINIGAME_RESCUES = 5;
export const MAX_DAILY_OWL_HELP_REQUESTS = 5;
export const FRIENDSHIP_CHEST_TOKEN_COST = 10;
export const MAX_HOME_LANTERN_MARKS = 5;
export const FLOO_VISIT_UNLOCK_LEVEL = 10;
export const MAX_DAILY_HOST_HELPS_RECEIVED = 10;

export interface NeighborPresetNoteMeta {
  id: NeighborPresetNoteId;
  emoji: string;
  shortVi: string;
  textVi: string;
}

export const NEIGHBOR_PRESET_NOTES: ReadonlyArray<NeighborPresetNoteMeta> = [
  {
    id: 'bountiful_harvest',
    emoji: '🌾',
    shortVi: 'Mùa màng bội thu',
    textVi: 'Chúc thung lũng bạn mùa màng bội thu, kho đầy ắp lúa vàng!',
  },
  {
    id: 'cozy_hearth',
    emoji: '🏮',
    shortVi: 'Bếp lửa ấm áp',
    textVi: 'Gửi chút nắng ấm Hang Sóc sang tiếp lửa xưởng nhà bạn!',
  },
  {
    id: 'sweet_bakery',
    emoji: '🥧',
    shortVi: 'Bánh thơm lừng',
    textVi: 'Hương bánh táo quế nhà bạn thơm nức cả bờ sông Ottery!',
  },
  {
    id: 'lucky_stars',
    emoji: '🌟',
    shortVi: 'Vượt tháp 777',
    textVi: 'Chúc bạn chinh phục đỉnh 777 màn và gom thật nhiều Sao!',
  },
  {
    id: 'owl_greetings',
    emoji: '🦉',
    shortVi: 'Cú đưa thư ghé thăm',
    textVi: 'Cú đưa thư ghé thăm — cần kíp màn khó cứ gọi mình nhé!',
  },
];

export function getPresetNoteMeta(id?: NeighborPresetNoteId): NeighborPresetNoteMeta {
  return NEIGHBOR_PRESET_NOTES.find((n) => n.id === id) ?? NEIGHBOR_PRESET_NOTES[0];
}

export function getMinigameKindLabelVi(kind: MinigameTrialKind): {
  icon: string;
  nameVi: string;
} {
  switch (kind) {
    case 'match3':
      return { icon: '🍬', nameVi: 'Bùa Gặt Honeydukes' };
    case 'caro':
      return { icon: '🗺️', nameVi: 'Ngũ Ấn Đạo Tặc' };
    case 'sudoku':
      return { icon: '🔢', nameVi: 'Số Học Huyền Bí' };
    case 'chess':
      return { icon: '🏰', nameVi: 'Cờ Phù Thủy' };
    case 'blocks':
      return { icon: '🦄', nameVi: 'Sinh Vật Huyền Bí' };
  }
}

export function getGardenHelpMetaVi(kind: NeighborGardenHelpKind): {
  icon: string;
  actionVi: string;
  badgeVi: string;
  goldReward: number;
  xpReward: number;
} {
  switch (kind) {
    case 'water_crop':
      return {
        icon: '💧',
        actionVi: 'Tưới Nước Chăm Ruộng',
        badgeVi: '💧 Tưới ruộng',
        goldReward: 5,
        xpReward: 12,
      };
    case 'tend_yard':
      return {
        icon: '🌾',
        actionVi: 'Chăm Sân Thú & Vườn',
        badgeVi: '🌾 Chăm vườn',
        goldReward: 6,
        xpReward: 14,
      };
    case 'stoke_workshop':
      return {
        icon: '🔥',
        actionVi: 'Tiếp Lửa Xưởng Chế Biến',
        badgeVi: '🔥 Tiếp lửa',
        goldReward: 6,
        xpReward: 16,
      };
  }
}

let serverDayKeyOverride: string | null = null;

/**
 * Kích hoạt khóa ngày lịch ủy quyền từ máy chủ (`Asia/Ho_Chi_Minh`, UTC+7) khi đang chơi trực tuyến.
 * Truyền `null` để quay về lịch thiết bị khi chơi ngoại tuyến.
 */
export function useServerCalendarDayKey(dayKey: string | null): void {
  serverDayKeyOverride = dayKey && /^\d{4}-\d{2}-\d{2}$/.test(dayKey) ? dayKey : null;
}

/**
 * Tính khóa ngày lịch chuẩn Việt Nam (`Asia/Ho_Chi_Minh`, UTC+7) không phụ thuộc múi giờ máy khách.
 */
export function getVietnamCalendarKey(nowMs = Date.now()): string {
  const vnDate = new Date(nowMs + 7 * 3600_000);
  const y = vnDate.getUTCFullYear();
  const m = String(vnDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(vnDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Chuẩn ngày lịch YYYY-MM-DD (ưu tiên khóa ngày máy chủ VN khi trực tuyến, fallback lịch địa phương khi ngoại tuyến).
 */
export function getLocalCalendarResetKey(nowMs?: number): string {
  if (serverDayKeyOverride) {
    return serverDayKeyOverride;
  }
  if (nowMs === undefined && 'Temporal' in globalThis) {
    try {
      const t = (globalThis as unknown as { Temporal: { Now: { plainDateISO: () => { toString: () => string } } } })
        .Temporal;
      return t.Now.plainDateISO().toString();
    } catch {
      // Fallback sang Date cục bộ bên dưới
    }
  }
  const d = new Date(nowMs ?? Date.now());
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function generatePlayerFriendCode(seedNum = Date.now()): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let h = Math.abs(Math.floor(seedNum)) || 777123;
  let part = '';
  for (let i = 0; i < 4; i++) {
    part += chars[h % chars.length];
    h = Math.floor(h / 7) + 31 * (i + 1);
  }
  const suffix = String((Math.abs(Math.floor(seedNum)) % 89) + 10);
  return `HS-${part}-${suffix}`;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const OWL_CRATE_POOL: ReadonlyArray<{
  itemId: FarmItemId;
  qty: number;
  rewardGalleons: number;
  rewardXp: number;
}> = [
  { itemId: 'ottery_wheat', qty: 3, rewardGalleons: 11, rewardXp: 20 },
  { itemId: 'honey_carrot', qty: 2, rewardGalleons: 12, rewardXp: 22 },
  { itemId: 'garden_pumpkin', qty: 2, rewardGalleons: 14, rewardXp: 24 },
  { itemId: 'golden_corn', qty: 2, rewardGalleons: 13, rewardXp: 22 },
  { itemId: 'ruby_strawberry', qty: 2, rewardGalleons: 15, rewardXp: 26 },
  { itemId: 'cinnamon_apple_pie', qty: 1, rewardGalleons: 19, rewardXp: 32 },
  { itemId: 'fine_wheat_flour', qty: 1, rewardGalleons: 16, rewardXp: 25 },
  { itemId: 'farm_egg_wool', qty: 1, rewardGalleons: 16, rewardXp: 28 },
  { itemId: 'blossom_honey_jar', qty: 1, rewardGalleons: 18, rewardXp: 30 },
  { itemId: 'frothy_butterbeer', qty: 1, rewardGalleons: 21, rewardXp: 35 },
];

const SOS_NOTES_BY_KIND: Record<MinigameTrialKind, string> = {
  match3: 'Màn Bùa Gặt Honeydukes này nhiều thùng gỗ quá, bồ vào ghép kẹo trái cây vượt giúp mình với!',
  caro: 'Ấn Đầu Lâu Xà vây kín bàn Ngũ Ấn Đạo Tặc 13×13 rồi, nhờ cao thủ kết 5 Ấn Phượng Hoàng giải vây!',
  sudoku: 'Bảng Số Học Huyền Bí 9×9 đang hóc ở vài ô cuối, nhờ bồ suy luận điền số vượt màn này giúp mình nhé!',
  chess: 'Thế Cờ Phù Thủy căng quá, nhờ bồ cầm quân Gryffindor chiếu thắng giúp mình!',
  blocks: 'Màn Sinh Vật Huyền Bí này đông quá làm mình hoa cả mắt, nhờ bồ nối cặp vượt màn này giúp mình nha!',
};

function buildDailyNeighborCrates(neighborId: string, name: string, daySeed: number): NeighborOwlHelpCrate[] {
  const base = hashSeed(`${neighborId}:${daySeed}`);
  const idxA = base % OWL_CRATE_POOL.length;
  const idxB = (base + 3 + (base % 5)) % OWL_CRATE_POOL.length;
  const pickA = OWL_CRATE_POOL[idxA];
  const pickB = OWL_CRATE_POOL[idxB === idxA ? (idxA + 1) % OWL_CRATE_POOL.length : idxB];

  return [pickA, pickB].map((p, idx) => ({
    id: `ncrate_${neighborId}_${daySeed}_${idx}`,
    senderName: name,
    itemId: p.itemId,
    qty: p.qty,
    rewardGalleons: p.rewardGalleons,
    rewardXp: p.rewardXp,
    rewardTokens: 2,
    fulfilledByPlayerToday: false,
  }));
}

function buildDailyMysterySpot(neighborId: string, daySeed: number): { gx: number; gy: number } {
  const spots: ReadonlyArray<{ gx: number; gy: number }> = [
    { gx: 11, gy: 18 },
    { gx: 29, gy: 17 },
    { gx: 12, gy: 32 },
    { gx: 28, gy: 29 },
    { gx: 15, gy: 31 },
    { gx: 9, gy: 28 },
  ];
  const idx = hashSeed(`gift:${neighborId}:${daySeed}`) % spots.length;
  return spots[idx];
}

export const CANON_NPC_NEIGHBOR_IDS = new Set<string>([
  'hagrid_valley',
  'luna_valley',
  'neville_valley',
  'hermione_valley',
  'twins_valley',
]);

export const CANON_NPC_FRIEND_CODES = new Set<string>([
  'HS-HAGRID-01',
  'HS-LUNA-02',
  'HS-NEVILLE-03',
  'HS-HERMIONE-04',
  'HS-WEASLEY-05',
]);

export function isNpcNeighborProfile(
  nb: Partial<NeighborProfileState> | null | undefined
): boolean {
  if (!nb || typeof nb !== 'object') return true;
  if (nb.isCanonPreset === true) return true;
  if (typeof nb.id === 'string' && CANON_NPC_NEIGHBOR_IDS.has(nb.id)) return true;
  if (
    typeof nb.friendCode === 'string' &&
    CANON_NPC_FRIEND_CODES.has(nb.friendCode.trim().toUpperCase())
  ) {
    return true;
  }
  return false;
}

export function createDefaultCanonNeighbors(_resetKey?: string): NeighborProfileState[] {
  return [];
}

export function createInitialNeighborSocialState(nowMs = Date.now()): NeighborSocialState {
  const resetKey = getLocalCalendarResetKey(nowMs);
  return {
    playerFriendCode: generatePlayerFriendCode(nowMs),
    selectedPresetNoteId: 'bountiful_harvest',
    friendshipTokens: 4, // Tặng sẵn 4/10 Huy Hiệu làm vốn khởi động thân thiện
    chestsOpened: 0,
    heartsReceivedCount: 0,
    lastSocialResetKey: resetKey,
    dailyRescuesGivenIds: [],
    dailyRescuesReceivedCount: 0,
    dailyLikedNeighborIds: [],
    dailyMysteryClaimedIds: [],
    dailyOwlHelpRequestedCount: 0,
    dailyGardenHelpsCount: 0,
    dailyHomeLanternsClaimedCount: 0,
    dailyHonorTourClaimed: false,
    dailyFlooShareClaimed: false,
    lastSeenHelperAt: 0,
    neighbors: [],
    homeLanternMarks: [],
    playerMinigameSos: null,
    playerOwlHelpRequests: [],
    activityLog: [
      {
        id: `slog_init_${nowMs}`,
        timestamp: nowMs,
        icon: '🔥',
        textVi:
          'Mạng Lưới Cổng Floo đã sẵn sàng! Tham quan Vườn Mẫu Danh Dự từ Cấp 1, mở Cổng Bay Floo Cộng Đồng ở Cấp 10 và gửi Bưu Thiếp rủ bạn trên Mạng Floo nhé!',
      },
    ],
  };
}

/**
 * Kiểm tra & làm mới toàn bộ giới hạn "1 ngày 1 lần" khi bước qua 00:00 giờ địa phương.
 */
export function syncNeighborSocialDailyReset(
  social: NeighborSocialState,
  nowMs = Date.now()
): boolean {
  const todayKey = getLocalCalendarResetKey(nowMs);
  if (social.lastSocialResetKey === todayKey) return false;

  const daySeed = hashSeed(todayKey);
  social.lastSocialResetKey = todayKey;
  social.dailyRescuesGivenIds = [];
  social.dailyRescuesReceivedCount = 0;
  social.dailyLikedNeighborIds = [];
  social.dailyMysteryClaimedIds = [];
  social.dailyOwlHelpRequestedCount = 0;
  social.dailyGardenHelpsCount = 0;
  social.dailyHomeLanternsClaimedCount = 0;
  social.dailyHonorTourClaimed = false;
  social.dailyFlooShareClaimed = false;

  const kinds: MinigameTrialKind[] = ['match3', 'sudoku', 'caro', 'chess', 'blocks'];
  social.neighbors = social.neighbors.map((nb, idx) => {
    const spot = buildDailyMysterySpot(nb.id, daySeed);
    const kind = nb.minigameSos?.kind ?? kinds[(daySeed + idx) % kinds.length];
    const baseStage = Math.max(8, Math.min(120, Math.round(nb.level * 0.7) + ((daySeed + idx * 5) % 12)));
    return {
      ...nb,
      helpedViaFlooToday: false,
      helpedMarksToday: [],
      owlHelpCrates: buildDailyNeighborCrates(nb.id, nb.name, daySeed),
      minigameSos: {
        kind,
        stage: baseStage,
        noteVi: SOS_NOTES_BY_KIND[kind],
        rescuedToday: false,
      },
      mysteryGiftGx: spot.gx,
      mysteryGiftGy: spot.gy,
    };
  });

  if (social.playerMinigameSos?.claimed) {
    social.playerMinigameSos = null;
  }

  return true;
}

export function createFriendNeighborFromCode(
  rawCode: string,
  customName: string | undefined,
  nowMs = Date.now(),
  verifiedProfile?: VerifiedRealPlayerProfile
): NeighborProfileState {
  const cleanCode =
    (verifiedProfile?.friendCode || rawCode)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 18) || 'HS-PLAYER-01';
  const seed = hashSeed(cleanCode);
  const houses: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
  const emojis = ['🧙‍♂️', '🧙‍♀️', '🦉', '🦊', '🦢', '🍀'];
  const kinds: MinigameTrialKind[] = ['match3', 'caro', 'sudoku', 'chess', 'blocks'];
  const resolvedName =
    (customName ?? '').trim() ||
    (verifiedProfile?.name ?? '').trim() ||
    (verifiedProfile?.parkName ?? '').trim() ||
    `Người chơi ${cleanCode}`;
  const resolvedParkName =
    (verifiedProfile?.parkName ?? '').trim() || `Thung Lũng Của ${resolvedName}`;
  const level = Math.max(1, Math.min(100, Math.floor(verifiedProfile?.level || 1 + (seed % 12))));
  const house = verifiedProfile?.house || houses[seed % houses.length];
  const avatarEmoji = verifiedProfile?.avatarEmoji || emojis[seed % emojis.length];
  const sosKind = kinds[seed % kinds.length];
  const resetKey = getLocalCalendarResetKey(nowMs);
  const daySeed = hashSeed(resetKey);
  const id = verifiedProfile?.userId
    ? `player_${verifiedProfile.userId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48)}`
    : `player_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const spot = buildDailyMysterySpot(id, daySeed);

  return {
    id,
    remoteUserId: verifiedProfile?.userId,
    isVerifiedPlayer: Boolean(verifiedProfile),
    friendCode: cleanCode,
    name: resolvedName,
    titleVi: 'Người Chơi Thật • Hàng Xóm Thung Lũng',
    parkName: resolvedParkName,
    avatarEmoji,
    house,
    level,
    likesCount: 1,
    isCanonPreset: false,
    bioVi:
      verifiedProfile?.bioVi ||
      `Người chơi thật kết nối qua Mã Thung Lũng ${cleanCode} — ghé thăm tưới cây & tương trợ mỗi ngày!`,
    valleyBuildings: verifiedProfile?.buildings,
    valleyTileOverrides: verifiedProfile?.tileOverrides,
    valleyUnlockedZones: verifiedProfile?.unlockedZones,
    helpedMarksToday: [],
    owlHelpCrates: buildDailyNeighborCrates(id, resolvedName, daySeed),
    minigameSos: {
      kind: sosKind,
      stage: Math.max(2, Math.min(120, Math.round(level * 0.8) + (seed % 8))),
      noteVi: SOS_NOTES_BY_KIND[sosKind],
      rescuedToday: false,
    },
    mysteryGiftGx: spot.gx,
    mysteryGiftGy: spot.gy,
  };
}

/**
 * Xác định loại hành động trợ giúp vườn khả dụng trên 1 công trình.
 */
export function classifyBuildingGardenHelpKind(
  item: CatalogItem | undefined,
  b: PlacedBuilding,
  nowMs = Date.now()
): NeighborGardenHelpKind | null {
  if (!item) return null;
  if (nowMs < b.constructEndsAt) return null;
  if (item.id === 'burrow_house_canon' || item.id === 'burrow_honeydukes_canon') return null;

  if (item.isFarmlandPlot) {
    if (b.cropId && b.cropReadyAt && nowMs < b.cropReadyAt) {
      return 'water_crop';
    }
    return null;
  }

  if (
    item.connectableGroup === 'pumpkin_patch' ||
    item.connectableGroup === 'flower_garden' ||
    item.connectableGroup === 'chicken_yard' ||
    item.connectableGroup === 'animal_pasture' ||
    item.isAnimalPasturePlot ||
    item.isCreatureHabitat ||
    item.id === 'burrow_puffskein_pasture' ||
    item.id === 'burrow_reed_pond_mill' ||
    item.id === 'burrow_apple_orchard'
  ) {
    return 'tend_yard';
  }

  if (
    Boolean(item.workshopGroupId) ||
    item.isWorkshopBrewery ||
    item.id === 'molly_apple_bakery' ||
    item.id === 'burrow_windmill_canon' ||
    item.id === 'burrow_self_knitting_loom' ||
    item.id === 'burrow_cider_apiary' ||
    item.id === 'arthur_ford_shed' ||
    item.id === 'burrow_greenhouse_canon' ||
    item.id === 'burrow_broomsticks_canon'
  ) {
    return 'stoke_workshop';
  }

  return null;
}

/**
 * Adapter chuẩn bị sẵn cho tầng Backend sau này (/api/social, Firebase, WebSocket...).
 * Hiện tại dùng LocalMockNeighborSocialAdapter lưu đồng bộ trong GameState.
 */
export interface NeighborValleySnapshot {
  neighbor: NeighborProfileState;
  unlockedZones: ZoneId[];
  buildings: PlacedBuilding[];
  tileOverrides: Record<string, TileOverrideData>;
  focusGx: number;
  focusGy: number;
}

function makePlaced(
  uid: string,
  itemId: string,
  gx: number,
  gy: number,
  nowMs: number,
  extra?: Partial<PlacedBuilding>
): PlacedBuilding {
  return {
    uid,
    itemId,
    gx,
    gy,
    rotation: 0,
    stars: 2,
    placedAt: nowMs - 86400_000,
    constructEndsAt: 0,
    lastTickAt: nowMs,
    storedGalleons: 0,
    storedXp: 0,
    readyBubbles: 0,
    durability: 100,
    visitorsServed: 25,
    ...extra,
  };
}

/**
 * Dựng bản đồ 72×72 từ snapshot thực tế của người chơi thật (hoặc khuôn viên khởi điểm nếu chưa đồng bộ bản đồ).
 */
export function buildNeighborValleySnapshot(
  neighbor: NeighborProfileState,
  nowMs = Date.now()
): NeighborValleySnapshot {
  const defaultZones: ZoneId[] = ZONES.filter(
    (z) => z.unlockLevel <= Math.max(1, neighbor.level)
  ).map((z) => z.id);
  if (!defaultZones.includes('ga_hogsmeade')) defaultZones.push('ga_hogsmeade');
  if (!defaultZones.includes('hem_xeo')) defaultZones.push('hem_xeo');

  if (Array.isArray(neighbor.valleyBuildings) && neighbor.valleyBuildings.length > 0) {
    const validReal = neighbor.valleyBuildings
      .filter((b) => b && typeof b.itemId === 'string' && Boolean(getCatalogItem(b.itemId)))
      .map((b) => {
        const isHelped = neighbor.helpedMarksToday.some((m) => m.buildingUid === b.uid);
        const cloned: PlacedBuilding = {
          ...b,
          constructEndsAt: 0,
          awaitingUnveil: false,
          readyBubbles: 0,
        };
        const item = getCatalogItem(cloned.itemId);
        if (item?.isFarmlandPlot && cloned.cropId) {
          cloned.cropReadyAt = isHelped
            ? Math.max(nowMs + 60_000, (cloned.cropReadyAt || nowMs + 600_000) - 300_000)
            : Math.max(nowMs + 300_000, cloned.cropReadyAt || nowMs + 600_000);
          cloned.cropWateredBoost = Boolean(cloned.cropWateredBoost || isHelped);
        }
        return cloned;
      });

    if (validReal.length > 0) {
      const realZones =
        Array.isArray(neighbor.valleyUnlockedZones) && neighbor.valleyUnlockedZones.length > 0
          ? [...neighbor.valleyUnlockedZones]
          : defaultZones;
      return {
        neighbor,
        unlockedZones: realZones,
        buildings: validReal,
        tileOverrides: neighbor.valleyTileOverrides ? { ...neighbor.valleyTileOverrides } : {},
        focusGx: 18.5,
        focusGy: 22.5,
      };
    }
  }

  const unlockedZones = defaultZones;
  const tileOverrides: Record<string, TileOverrideData> = {};
  for (let y = 14; y <= 43; y++) {
    for (let x = 3; x <= 5; x++) {
      tileOverrides[`${x},${y}`] = { terrain: 'water' };
    }
  }
  for (const bridgeY of [22, 34]) {
    for (let x = 3; x <= 5; x++) {
      tileOverrides[`${x},${bridgeY}`] = { terrain: 'grass', path: 'wood_pier' };
    }
  }
  for (let x = 6; x <= 30; x++) {
    tileOverrides[`${x},22`] = { ...(tileOverrides[`${x},22`] ?? {}), path: 'cobble' };
  }
  for (let y = 18; y <= 33; y++) {
    tileOverrides[`18,${y}`] = { ...(tileOverrides[`18,${y}`] ?? {}), path: 'cobble' };
  }

  const seed = hashSeed(neighbor.id);
  const buildings: PlacedBuilding[] = [
    makePlaced(`nb_${neighbor.id}_house`, 'burrow_house_canon', 13, 17, nowMs, {
      stars: 3,
      isIndestructible: true,
    }),
    makePlaced(`nb_${neighbor.id}_owlpost`, 'burrow_owl_post', 20, 18, nowMs, { stars: 2 }),
    makePlaced(`nb_${neighbor.id}_bakery`, 'molly_apple_bakery', 23, 17, nowMs, {
      workshopQueue: [
        { goodId: 'cinnamon_apple_pie', startedAt: nowMs - 20_000, endsAt: nowMs + 600_000 },
      ],
    }),
    makePlaced(
      `nb_${neighbor.id}_workshop2`,
      seed % 2 === 0 ? 'burrow_windmill_canon' : 'burrow_cider_apiary',
      9,
      24,
      nowMs
    ),
  ];

  const crops: FarmCropId[] = [
    'ottery_wheat',
    'honey_carrot',
    'ruby_strawberry',
    'golden_corn',
  ];
  let idx = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const uid = `nb_${neighbor.id}_plot_${r}_${c}`;
      const isHelped = neighbor.helpedMarksToday.some((m) => m.buildingUid === uid);
      buildings.push(
        makePlaced(uid, 'farmland_plot', 19 + c * 2, 28 + r * 2, nowMs, {
          cropId: crops[idx % crops.length],
          cropPlantedAt: nowMs - 45_000,
          cropReadyAt: isHelped ? nowMs + 120_000 : nowMs + 900_000,
          cropWateredBoost: isHelped,
        })
      );
      idx++;
    }
  }

  for (let c = 0; c < 2; c++) {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_coop_0_${c}`, 'burrow_chicken_coop', 19 + c * 2, 24, nowMs),
      makePlaced(`nb_${neighbor.id}_pump_0_${c}`, 'burrow_pumpkin_gnomes', 24 + c * 2, 24, nowMs)
    );
  }

  const validBuildings = buildings.filter((b) => Boolean(getCatalogItem(b.itemId)));

  return {
    neighbor,
    unlockedZones,
    buildings: validBuildings,
    tileOverrides,
    focusGx: 19.5,
    focusGy: 24.5,
  };
}

/**
 * Tạo ngẫu nhiên 1 dấu ấn Cú Đưa Thư từ bạn bè ghé giúp công trình trên chính vườn nhà người chơi.
 */
export function pickSimulatedHomeLanternMark(
  social: NeighborSocialState,
  homeBuildings: PlacedBuilding[],
  nowMs = Date.now()
): HomeOwlLanternMark | null {
  if (social.neighbors.length === 0) return null;
  const totalHomeHelpsToday =
    Math.max(0, social.dailyHomeLanternsClaimedCount ?? 0) + social.homeLanternMarks.length;
  if (
    social.homeLanternMarks.length >= MAX_HOME_LANTERN_MARKS ||
    totalHomeHelpsToday >= MAX_HOME_LANTERN_MARKS
  ) {
    return null;
  }

  const markedSet = new Set(social.homeLanternMarks.map((m) => m.buildingUid));
  const candidates: Array<{ b: PlacedBuilding; kind: NeighborGardenHelpKind }> = [];
  for (const b of homeBuildings) {
    if (markedSet.has(b.uid)) continue;
    const item = getCatalogItem(b.itemId);
    const kind = classifyBuildingGardenHelpKind(item, b, nowMs);
    if (kind) {
      candidates.push({ b, kind });
    } else if (item?.isFarmlandPlot && Date.now() >= b.constructEndsAt) {
      // Kể cả ruộng vừa thu hoạch cũng có thể được bạn ghé tưới ẩm đất màu mỡ!
      candidates.push({ b, kind: 'water_crop' });
    }
  }
  if (candidates.length === 0) return null;

  const seed = hashSeed(`${nowMs}:${social.homeLanternMarks.length}:${homeBuildings.length}`);
  const picked = candidates[seed % candidates.length];
  const helper = social.neighbors[seed % social.neighbors.length];
  const note = NEIGHBOR_PRESET_NOTES[seed % NEIGHBOR_PRESET_NOTES.length];

  return {
    id: `hmark_${nowMs}_${picked.b.uid}`,
    buildingUid: picked.b.uid,
    helperId: helper.id,
    helperName: helper.name,
    helperEmoji: helper.avatarEmoji,
    helperAvatarUrl: helper.avatarUrl,
    kind: picked.kind,
    noteVi: note.textVi,
    createdAt: nowMs,
  };
}

// ============================================================================
// HAGRIDFARM / HPVN FLOO PORTAL DIRECTORY, AVATAR RESOLVER & HONOR GARDENS
// ============================================================================

const HPVN_STORAGE_BUCKET_PREFIXES = [
  'https://firebasestorage.googleapis.com/v0/b/hpvnn-archive.firebasestorage.app/o',
  'https://firebasestorage.googleapis.com/v0/b/hpvnn-archive.appspot.com/o',
] as const;

function inferDefaultReferrerOrigin(): string {
  try {
    if (typeof document !== 'undefined' && document.referrer) {
      return new URL(document.referrer).origin;
    }
  } catch {
    // Bỏ qua referrer không hợp lệ
  }
  return '';
}

/**
 * Chuẩn hóa URL avatar thành viên diễn đàn HPVN giống hệt `avatarSrc()` trong `garden-visits-ui.mjs`:
 *  - Chặn mọi giao thức không an toàn (`javascript:`, `vbscript:`, ...).
 *  - Chuyển link Firebase Storage `hpvnn-archive` và `/forum-images/avatars/...` sang `/media/...` của site gốc.
 */
export function resolveHpvnAvatarSrc(
  url: string | undefined | null,
  siteOrigin = inferDefaultReferrerOrigin()
): string {
  if (typeof url !== 'string' || !url.trim()) return '';
  const trimmed = url.trim();
  if (!/^(\/|https?:\/\/|data:image\/)/i.test(trimmed)) return '';
  for (const prefix of HPVN_STORAGE_BUCKET_PREFIXES) {
    if (trimmed.startsWith(`${prefix}/`)) {
      return `${siteOrigin}/media${trimmed.slice(prefix.length)}`;
    }
  }
  if (trimmed.startsWith('/forum-images/avatars/')) {
    let decodedPath = trimmed.slice(1);
    try {
      decodedPath = decodeURIComponent(decodedPath);
    } catch {
      // Giữ nguyên nếu đã decode
    }
    return `${siteOrigin}/media/${encodeURIComponent(`archive-media/v1/${decodedPath}`)}?alt=media`;
  }
  return trimmed;
}

/**
 * Kiểm tra 1 thung lũng thành viên trên Cổng Floo có đang cần hỗ trợ không (`!helped` và đang có cây lớn hoặc đang cháy).
 */
export function canHelpFlooVisitRow(row: FlooVisitDirectoryRow, nowMs = Date.now()): boolean {
  if (row.helped) return false;
  if ((row.hostHelpsLeft ?? MAX_DAILY_HOST_HELPS_RECEIVED) <= 0) return false;
  const hasActiveFire = Boolean(row.fire && row.fire.until > nowMs);
  return hasActiveFire || row.growing > 0;
}

/**
 * Sắp xếp danh bạ Cổng Floo chuẩn `visitOrder` của `hagridfarm`:
 *  1. Thung lũng chưa giúp & đang cháy / có cây đang lớn lên đầu (nhiều cây đang lớn hơn xếp trước).
 *  2. Phần còn lại giữ nguyên thứ tự hoạt động gần nhất từ máy chủ.
 */
export function flooVisitOrder(
  rows: ReadonlyArray<FlooVisitDirectoryRow>,
  nowMs = Date.now()
): FlooVisitDirectoryRow[] {
  return rows
    .map((v, idx) => ({ v, idx }))
    .sort((a, b) => {
      const aHelp = Number(canHelpFlooVisitRow(a.v, nowMs));
      const bHelp = Number(canHelpFlooVisitRow(b.v, nowMs));
      if (bHelp !== aHelp) return bHelp - aHelp;
      if (aHelp > 0) {
        const aFire = Number(Boolean(a.v.fire && a.v.fire.until > nowMs));
        const bFire = Number(Boolean(b.v.fire && b.v.fire.until > nowMs));
        if (bFire !== aFire) return bFire - aFire;
        if (b.v.growing !== a.v.growing) return b.v.growing - a.v.growing;
      }
      return a.idx - b.idx;
    })
    .map((entry) => entry.v);
}

/**
 * Tìm thung lũng kế tiếp trong lượt Bay Floo liên hoàn (`dir = 1 | -1`), ưu tiên thung lũng vẫn còn có thể chăm giúp.
 */
export function nextFlooVisit(
  queue: ReadonlyArray<FlooVisitDirectoryRow>,
  currentUid: string,
  dir: 1 | -1 = 1,
  nowMs = Date.now()
): FlooVisitDirectoryRow | null {
  if (queue.length === 0) return null;
  const at = queue.findIndex((v) => v.uid === currentUid);
  const startIdx = at >= 0 ? at : 0;
  for (let step = 1; step <= queue.length; step += 1) {
    const candidate =
      queue[(startIdx + dir * step + queue.length * step) % queue.length];
    if (candidate && candidate.uid !== currentUid && canHelpFlooVisitRow(candidate, nowMs)) {
      return candidate;
    }
  }
  const fallback = queue[(startIdx + dir + queue.length) % queue.length];
  return fallback && fallback.uid !== currentUid ? fallback : null;
}

/**
 * Xác định hành động ưu tiên trên thanh điều hướng thu gọn khi thăm thành viên (`help` -> `next` -> `home`).
 */
export function quickFlooVisitStep(options: {
  helped: boolean;
  helpsLeft: number;
  hostHelpsLeft?: number;
  many: boolean;
}): 'help' | 'next' | 'home' {
  const hostLeft = options.hostHelpsLeft ?? MAX_DAILY_HOST_HELPS_RECEIVED;
  if (!options.helped && options.helpsLeft >= 1 && hostLeft >= 1) {
    return 'help';
  }
  return options.many ? 'next' : 'home';
}

/**
 * Ghép danh sách tên người chăm giúp hôm nay chuẩn `helperNames` của `hagridfarm`.
 */
export function formatFlooHelperNamesVi(
  helpers: ReadonlyArray<{ name: string }>
): string {
  const unique = Array.from(
    new Set(helpers.map((h) => (h.name || '').trim()).filter(Boolean))
  );
  if (unique.length === 0) return '';
  if (unique.length <= 2) return unique.join(' và ');
  return `${unique.slice(0, 2).join(', ')} và ${unique.length - 2} người khác`;
}

/**
 * Phát hiện người chăm giúp mới kể từ `seenAt` để hiện thông báo cảm ơn 1 lần (`newHelpers` từ `hagridfarm`).
 */
export function detectFreshFlooHelpersToast(
  helpers: ReadonlyArray<{ name: string; at: number }>,
  seenAt = 0
): { textVi: string; seenAt: number } | null {
  const fresh = helpers.filter((h) => Number(h.at) > seenAt);
  if (fresh.length === 0) return null;
  const minutes = fresh.length * 15;
  const maxAt = Math.max(...fresh.map((h) => Number(h.at) || 0));
  return {
    textVi: `🤝 ${formatFlooHelperNamesVi(fresh)} đã chăm giúp thung lũng bạn · mẻ sản xuất nhanh hơn ${minutes} phút!`,
    seenAt: maxAt,
  };
}

export function normalizeSceneWeatherOverride(raw?: string): WeatherOverride | undefined {
  if (
    raw === 'clear' ||
    raw === 'cloudy' ||
    raw === 'rain' ||
    raw === 'storm' ||
    raw === 'snow' ||
    raw === 'fog' ||
    raw === 'fireflies'
  ) {
    return raw;
  }
  return undefined;
}

export function normalizeSceneTimeOverride(raw?: string): TimeOverride | undefined {
  if (raw === 'dawn' || raw === 'day' || raw === 'dusk' || raw === 'night') {
    return raw;
  }
  return undefined;
}

/**
 * Đồng bộ 1 dòng thành viên thực từ `visitBurrowGarden` vào hồ sơ `NeighborProfileState` (không cần Mã Kết Bạn).
 */
export function upsertFlooMemberToNeighborProfile(
  existing: NeighborProfileState | undefined,
  row: FlooVisitDirectoryRow,
  nowMs = Date.now()
): NeighborProfileState {
  const cleanUid = String(row.uid || 'member').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 48);
  const id = existing?.id || `player_${cleanUid}`;
  const seed = hashSeed(cleanUid);
  const houses: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
  const emojis = ['🧙‍♂️', '🧙‍♀️', '🦉', '🦊', '🦢', '🍀'];
  const kinds: MinigameTrialKind[] = ['match3', 'caro', 'sudoku', 'chess', 'blocks'];
  const validHouses = new Set<HouseName>(houses);
  const house: HouseName =
    row.house && validHouses.has(row.house)
      ? row.house
      : existing?.house || houses[seed % houses.length];
  const resolvedName =
    (row.username || '').trim() || existing?.name || `Phù Thủy ${cleanUid.slice(0, 6)}`;
  const resolvedParkName =
    (row.parkName || '').trim() || existing?.parkName || `Thung Lũng Của ${resolvedName}`;
  const level = Math.max(1, Math.min(100, Math.floor(Number(row.level) || existing?.level || 10)));
  const avatarEmoji = row.avatarEmoji || existing?.avatarEmoji || emojis[seed % emojis.length];
  const resetKey = getLocalCalendarResetKey(nowMs);
  const daySeed = hashSeed(resetKey);
  const spot = existing
    ? { gx: existing.mysteryGiftGx, gy: existing.mysteryGiftGy }
    : buildDailyMysterySpot(id, daySeed);
  const sosKind = existing?.minigameSos?.kind ?? kinds[seed % kinds.length];

  const rawSave =
    row.rawClientSave && typeof row.rawClientSave === 'object' ? row.rawClientSave : null;
  const rawBuildings = Array.isArray(rawSave?.buildings)
    ? (rawSave.buildings as PlacedBuilding[])
    : existing?.valleyBuildings;
  const rawOverrides =
    rawSave?.tileOverrides && typeof rawSave.tileOverrides === 'object'
      ? (rawSave.tileOverrides as Record<string, TileOverrideData>)
      : existing?.valleyTileOverrides;
  const rawZones = Array.isArray(rawSave?.unlockedZones)
    ? (rawSave.unlockedZones as ZoneId[])
    : existing?.valleyUnlockedZones;

  return {
    id,
    remoteUserId: row.uid,
    isVerifiedPlayer: true,
    friendCode:
      row.friendCode ||
      existing?.friendCode ||
      `FLOO-${cleanUid.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) || 'HPVN'}`,
    name: resolvedName,
    titleVi: 'Thành Viên Mạng Floo HPVN',
    parkName: resolvedParkName,
    avatarEmoji,
    avatarUrl: row.avatarUrl ?? existing?.avatarUrl,
    house,
    level,
    likesCount: existing?.likesCount ?? 1 + (seed % 9),
    isCanonPreset: false,
    bioVi: `Thành viên cộng đồng Mạng Floo HPVN — bay Floo ghé thăm & chăm giúp 1 chạm!`,
    valleyBuildings: rawBuildings,
    valleyTileOverrides: rawOverrides,
    valleyUnlockedZones: rawZones,
    growingCount: Math.max(0, Math.floor(Number(row.growing ?? existing?.growingCount ?? 0))),
    helpedViaFlooToday: Boolean(row.helped || existing?.helpedViaFlooToday),
    hostHelpsLeft: Math.max(
      0,
      Math.floor(Number(row.hostHelpsLeft ?? existing?.hostHelpsLeft ?? MAX_DAILY_HOST_HELPS_RECEIVED))
    ),
    fireUntilMs:
      row.fire && row.fire.until > nowMs ? row.fire.until : existing?.fireUntilMs ?? null,
    scene: row.scene ?? existing?.scene,
    helpedMarksToday: existing?.helpedMarksToday ?? [],
    owlHelpCrates:
      existing?.owlHelpCrates && existing.owlHelpCrates.length > 0
        ? existing.owlHelpCrates
        : buildDailyNeighborCrates(id, resolvedName, daySeed),
    minigameSos:
      existing?.minigameSos ?? {
        kind: sosKind,
        stage: Math.max(4, Math.min(120, Math.round(level * 0.8) + (seed % 8))),
        noteVi: SOS_NOTES_BY_KIND[sosKind],
        rescuedToday: false,
      },
    mysteryGiftGx: spot.gx,
    mysteryGiftGy: spot.gy,
  };
}

/**
 * 5 Vườn Mẫu Danh Dự (`HONOR_GARDENS` chuẩn `hagridfarm`) — mở sẵn ngay từ Cấp 1 & chơi ngoại tuyến
 * để tân thủ luôn có khuôn viên mẫu tuyệt đẹp ghé thăm, học cách bài trí trước khi mở Cổng Bay Floo Cấp 10!
 */
export const HONOR_GARDENS: ReadonlyArray<HonorGardenTourDef> = [
  {
    id: 'tour_hagrid',
    ownerName: 'Rubeus Hagrid',
    titleVi: 'Vườn Bí Khổng Lồ Bìa Rừng Cấm',
    keeperTitleVi: 'Người Giữ Khóa & Rừng Cấm',
    avatarEmoji: '🧔',
    house: 'Gryffindor',
    level: 28,
    atmosphere: 'dusk',
    weather: 'fireflies',
    descVi: 'Hoàng hôn đom đóm bên luống bí ngô khổng lồ và đồng cỏ Bông Thoa ấm áp.',
  },
  {
    id: 'tour_sprout',
    ownerName: 'Giáo Sư Sprout',
    titleVi: 'Nhà Kính Thảo Dược Học Hogwarts',
    keeperTitleVi: 'Chủ Nhiệm Nhà Hufflepuff',
    avatarEmoji: '🌿',
    house: 'Hufflepuff',
    level: 36,
    atmosphere: 'dawn',
    weather: 'clear',
    descVi: 'Nắng sớm trong veo chiếu rọi vườn hoa cúc, oải hương và ruộng thảo dược thẳng tắp.',
  },
  {
    id: 'tour_luna',
    ownerName: 'Luna Lovegood',
    titleVi: 'Đồi Trăng Non & Suối Đom Đóm',
    keeperTitleVi: 'Nhà Thám Hiểm Sinh Vật Lạ',
    avatarEmoji: '🌙',
    house: 'Ravenclaw',
    level: 42,
    atmosphere: 'night',
    weather: 'fog',
    descVi: 'Đêm sương huyền ảo ôm trọn cối xay gió và thảm hoa tulip cầu vồng ven sông.',
  },
  {
    id: 'tour_molly',
    ownerName: 'Bà Molly Weasley',
    titleVi: 'Tổ Ấm Bánh Táo Quế Hang Sóc',
    keeperTitleVi: 'Bếp Trưởng Đại Tiệc Mùa Gặt',
    avatarEmoji: '🥧',
    house: 'Gryffindor',
    level: 55,
    atmosphere: 'day',
    weather: 'clear',
    descVi: 'Nắng vàng rực rỡ trên mái ngói Hang Sóc, lò bánh thơm lừng và đàn gà nhộn nhịp.',
  },
  {
    id: 'tour_twins',
    ownerName: 'Fred & George',
    titleVi: 'Quảng Trường Pháo Hoa Phù Thủy',
    keeperTitleVi: 'Ông Chủ Tiệm Giỡn Hogsmeade',
    avatarEmoji: '🎆',
    house: 'Gryffindor',
    level: 68,
    atmosphere: 'night',
    weather: 'fireflies',
    descVi: 'Đêm hội rực rỡ ánh đèn kẹo ngọt Honeydukes, quán Ba Cây Chổi và xưởng chế tác.',
  },
];

export interface HonorGardenValleySnapshot {
  tour: HonorGardenTourDef;
  unlockedZones: ZoneId[];
  buildings: PlacedBuilding[];
  tileOverrides: Record<string, TileOverrideData>;
  focusGx: number;
  focusGy: number;
}

export function getHonorGardenById(tourId: string): HonorGardenTourDef | null {
  return HONOR_GARDENS.find((g) => g.id === tourId) ?? null;
}

/**
 * Dựng bản đồ tham quan Read-Only cho 1 trong 5 Vườn Mẫu Danh Dự (`HONOR_GARDENS`).
 */
export function buildHonorGardenSnapshot(
  tourId: string,
  nowMs = Date.now()
): HonorGardenValleySnapshot | null {
  const tour = getHonorGardenById(tourId) ?? HONOR_GARDENS[0];
  if (!tour) return null;

  const unlockedZones: ZoneId[] = ZONES.filter((z) => z.unlockLevel <= tour.level).map(
    (z) => z.id
  );
  if (!unlockedZones.includes('ga_hogsmeade')) unlockedZones.push('ga_hogsmeade');
  if (!unlockedZones.includes('hem_xeo')) unlockedZones.push('hem_xeo');

  const tileOverrides: Record<string, TileOverrideData> = {};
  for (let y = 14; y <= 43; y++) {
    for (let x = 3; x <= 5; x++) {
      tileOverrides[`${x},${y}`] = { terrain: 'water' };
    }
  }
  for (const bridgeY of [22, 34]) {
    for (let x = 3; x <= 5; x++) {
      tileOverrides[`${x},${bridgeY}`] = { terrain: 'grass', path: 'wood_pier' };
    }
  }
  for (let x = 6; x <= 31; x++) {
    tileOverrides[`${x},22`] = { ...(tileOverrides[`${x},22`] ?? {}), path: 'cobble' };
    tileOverrides[`${x},27`] = { ...(tileOverrides[`${x},27`] ?? {}), path: 'cobble' };
  }
  for (let y = 17; y <= 35; y++) {
    tileOverrides[`18,${y}`] = { ...(tileOverrides[`18,${y}`] ?? {}), path: 'cobble' };
  }

  const buildings: PlacedBuilding[] = [
    makePlaced(`honor_${tour.id}_house`, 'burrow_house_canon', 13, 17, nowMs, {
      stars: 3,
      isIndestructible: true,
    }),
    makePlaced(`honor_${tour.id}_owl`, 'burrow_owl_post', 20, 18, nowMs, { stars: 3 }),
    makePlaced(`honor_${tour.id}_bakery`, 'molly_apple_bakery', 23, 17, nowMs, { stars: 3 }),
    makePlaced(`honor_${tour.id}_mill`, 'burrow_windmill_canon', 9, 23, nowMs, { stars: 3 }),
    makePlaced(`honor_${tour.id}_greenhouse`, 'burrow_greenhouse_canon', 28, 17, nowMs, {
      stars: 3,
    }),
    makePlaced(`honor_${tour.id}_apiary`, 'burrow_cider_apiary', 9, 29, nowMs, { stars: 3 }),
  ];

  if (tour.id === 'tour_twins') {
    buildings.push(
      makePlaced(`honor_${tour.id}_honey`, 'burrow_honeydukes_canon', 13, 29, nowMs, { stars: 3 }),
      makePlaced(`honor_${tour.id}_brooms`, 'burrow_broomsticks_canon', 28, 23, nowMs, { stars: 3 })
    );
  } else {
    buildings.push(
      makePlaced(`honor_${tour.id}_orchard`, 'burrow_apple_orchard', 13, 29, nowMs, { stars: 3 }),
      makePlaced(`honor_${tour.id}_puffskein`, 'burrow_puffskein_pasture', 28, 23, nowMs, {
        stars: 3,
      })
    );
  }

  const signatureCrops: Record<string, FarmCropId[]> = {
    tour_hagrid: ['garden_pumpkin', 'honey_carrot', 'golden_corn', 'ruby_strawberry'],
    tour_sprout: ['dried_lavender', 'meadow_daisy', 'english_rose', 'ottery_wheat'],
    tour_luna: ['rainbow_tulip', 'dried_lavender', 'english_rose', 'ruby_strawberry'],
    tour_molly: ['ottery_wheat', 'ruby_strawberry', 'golden_corn', 'honey_carrot'],
    tour_twins: ['garden_pumpkin', 'rainbow_tulip', 'ruby_strawberry', 'golden_corn'],
  };
  const crops = signatureCrops[tour.id] ?? signatureCrops.tour_hagrid;

  let plotIdx = 0;
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      buildings.push(
        makePlaced(`honor_${tour.id}_plot_${r}_${c}`, 'farmland_plot', 19 + c * 2, 29 + r * 2, nowMs, {
          cropId: crops[plotIdx % crops.length],
          cropPlantedAt: nowMs - 600_000,
          cropReadyAt: nowMs + 900_000,
          cropWateredBoost: true,
        })
      );
      plotIdx++;
    }
  }

  for (let c = 0; c < 2; c++) {
    buildings.push(
      makePlaced(`honor_${tour.id}_coop_${c}`, 'burrow_chicken_coop', 19 + c * 2, 24, nowMs),
      makePlaced(`honor_${tour.id}_pump_${c}`, 'burrow_pumpkin_gnomes', 24 + c * 2, 24, nowMs)
    );
  }

  return {
    tour,
    unlockedZones,
    buildings: buildings.filter((b) => Boolean(getCatalogItem(b.itemId))),
    tileOverrides,
    focusGx: 19.5,
    focusGy: 24.5,
  };
}
