import { getCatalogItem } from '../data/catalog';
import { ZONES } from '../data/zones';
import {
  CatalogItem,
  FarmCropId,
  FarmItemId,
  HomeOwlLanternMark,
  HouseName,
  MinigameTrialKind,
  NeighborGardenHelpKind,
  NeighborOwlHelpCrate,
  NeighborPresetNoteId,
  NeighborProfileState,
  NeighborSocialState,
  PlacedBuilding,
  TileOverrideData,
  VerifiedRealPlayerProfile,
  ZoneId,
} from '../types/game';

export const MAX_DAILY_MINIGAME_RESCUES = 5;
export const MAX_DAILY_OWL_HELP_REQUESTS = 3;
export const FRIENDSHIP_CHEST_TOKEN_COST = 10;
export const MAX_HOME_LANTERN_MARKS = 5;

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
      return { icon: '🍓', nameVi: 'Gác Xép Bùa Gặt Honeydukes' };
    case 'caro':
      return { icon: '🗺️', nameVi: 'Trận Pháp Ngũ Ấn Đạo Tặc' };
    case 'sudoku':
      return { icon: '🔮', nameVi: 'Ma Trận Cửu Bảo Bối' };
    case 'chess':
      return { icon: '🏰', nameVi: 'Cờ Phù Thủy Đại Sảnh Đường' };
    case 'blocks':
      return { icon: '🦄', nameVi: 'Nối Hình Sinh Vật Huyền Bí' };
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
        goldReward: 25,
        xpReward: 12,
      };
    case 'tend_yard':
      return {
        icon: '🌾',
        actionVi: 'Chăm Sân Thú & Vườn',
        badgeVi: '🌾 Chăm vườn',
        goldReward: 28,
        xpReward: 14,
      };
    case 'stoke_workshop':
      return {
        icon: '🔥',
        actionVi: 'Tiếp Lửa Xưởng Chế Biến',
        badgeVi: '🔥 Tiếp lửa',
        goldReward: 32,
        xpReward: 16,
      };
  }
}

/**
 * Chuẩn ngày lịch địa phương YYYY-MM-DD để reset đúng 00:00 giờ máy người chơi.
 */
export function getLocalCalendarResetKey(nowMs?: number): string {
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
  { itemId: 'ottery_wheat', qty: 3, rewardGalleons: 55, rewardXp: 20 },
  { itemId: 'honey_carrot', qty: 2, rewardGalleons: 60, rewardXp: 22 },
  { itemId: 'garden_pumpkin', qty: 2, rewardGalleons: 68, rewardXp: 24 },
  { itemId: 'golden_corn', qty: 2, rewardGalleons: 64, rewardXp: 22 },
  { itemId: 'ruby_strawberry', qty: 2, rewardGalleons: 75, rewardXp: 26 },
  { itemId: 'cinnamon_apple_pie', qty: 1, rewardGalleons: 95, rewardXp: 32 },
  { itemId: 'fine_wheat_flour', qty: 1, rewardGalleons: 78, rewardXp: 25 },
  { itemId: 'farm_egg_wool', qty: 1, rewardGalleons: 82, rewardXp: 28 },
  { itemId: 'blossom_honey_jar', qty: 1, rewardGalleons: 92, rewardXp: 30 },
  { itemId: 'frothy_butterbeer', qty: 1, rewardGalleons: 105, rewardXp: 35 },
];

const SOS_NOTES_BY_KIND: Record<MinigameTrialKind, string> = {
  match3: 'Màn Bùa Gặt Honeydukes này nhiều thùng gỗ quá, bồ vào ghép kẹo trái cây vượt giúp mình với!',
  caro: 'Ấn Đầu Lâu Xà vây kín Bản Đồ Đạo Tặc 13×13 rồi, nhờ cao thủ kết 5 Ấn Phượng Hoàng giải vây!',
  sudoku: 'Ma Trận Cửu Bảo Bối 9×9 đang hóc ở cụm đường chéo vàng, soi giúp mình qua màn này nhé!',
  chess: 'Thế Cờ Phù Thủy Đại Sảnh Đường căng quá, nhờ bồ cầm quân Gryffindor chiếu thắng giúp mình!',
  blocks: 'Đàn Sinh Vật Huyền Bí đông quá làm mình hoa cả mắt, nhờ bồ nối cặp vượt màn này giúp mình nha!',
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
    neighbors: [],
    homeLanternMarks: [],
    playerMinigameSos: null,
    playerOwlHelpRequests: [],
    activityLog: [
      {
        id: `slog_init_${nowMs}`,
        timestamp: nowMs,
        icon: '🦉',
        textVi:
          'Sổ Hàng Xóm đã mở! Chia sẻ Mã Thung Lũng của bạn và nhập mã của người chơi thật để kết bạn nhé!',
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

  const kinds: MinigameTrialKind[] = ['match3', 'sudoku', 'caro', 'chess', 'blocks'];
  social.neighbors = social.neighbors.map((nb, idx) => {
    const spot = buildDailyMysterySpot(nb.id, daySeed);
    const kind = nb.minigameSos?.kind ?? kinds[(daySeed + idx) % kinds.length];
    const baseStage = Math.max(8, Math.min(120, Math.round(nb.level * 0.7) + ((daySeed + idx * 5) % 12)));
    return {
      ...nb,
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
  if (social.homeLanternMarks.length >= MAX_HOME_LANTERN_MARKS) return null;

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
    kind: picked.kind,
    noteVi: note.textVi,
    createdAt: nowMs,
  };
}
