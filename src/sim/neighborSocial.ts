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
      return { icon: '🧱', nameVi: 'Khảm Đá Cổ Ngữ Runes' };
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
  blocks: 'Bàn Khảm Đá Cổ Ngữ 8×8 chật cứng rồi, nhờ bồ dọn bàn vượt ải giúp mình nha!',
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

export function createDefaultCanonNeighbors(resetKey: string): NeighborProfileState[] {
  const daySeed = hashSeed(resetKey);
  const presets: Array<{
    id: string;
    friendCode: string;
    name: string;
    titleVi: string;
    parkName: string;
    avatarEmoji: string;
    house: HouseName;
    level: number;
    likesCount: number;
    bioVi: string;
    sosKind: MinigameTrialKind;
    sosBaseStage: number;
  }> = [
    {
      id: 'hagrid_valley',
      friendCode: 'HS-HAGRID-01',
      name: 'Bác Rubeus Hagrid',
      titleVi: 'Chòi Đá Bìa Rừng & Vườn Bí Khổng Lồ',
      parkName: 'Nông Trại Bí Ngô Bác Hagrid',
      avatarEmoji: '🎃',
      house: 'Gryffindor',
      level: 18,
      likesCount: 42,
      bioVi: 'Chuyên trồng bí ngô khổng lồ, nuôi gà mái và chăm đàn Puffskein béo tròn!',
      sosKind: 'match3',
      sosBaseStage: 14,
    },
    {
      id: 'luna_valley',
      friendCode: 'HS-LUNA-02',
      name: 'Luna Lovegood',
      titleVi: 'Đồi Rookery & Vườn Hoa Oải Hương',
      parkName: 'Thảo Nguyên Ánh Trăng Luna',
      avatarEmoji: '🌼',
      house: 'Ravenclaw',
      level: 26,
      likesCount: 58,
      bioVi: 'Ươm hoa oải hương, mật ong hoa táo và giải mật mã Cổ Ngữ mỗi chiều.',
      sosKind: 'sudoku',
      sosBaseStage: 18,
    },
    {
      id: 'neville_valley',
      friendCode: 'HS-NEVILLE-03',
      name: 'Neville Longbottom',
      titleVi: 'Nhà Kính Thảo Dược & Luống Mandrake',
      parkName: 'Khu Vườn Thảo Dược Neville',
      avatarEmoji: '🌿',
      house: 'Gryffindor',
      level: 32,
      likesCount: 51,
      bioVi: 'Luôn sẵn sàng đổi hạt giống quý và đóng phụ kiện hàng thảo dược cho bạn bè!',
      sosKind: 'caro',
      sosBaseStage: 16,
    },
    {
      id: 'hermione_valley',
      friendCode: 'HS-HERMIONE-04',
      name: 'Hermione Granger',
      titleVi: 'Thư Viện Hogsmeade & Ngõ Đá Cuội',
      parkName: 'Điền Trang Tri Thức Hermione',
      avatarEmoji: '📚',
      house: 'Gryffindor',
      level: 40,
      likesCount: 74,
      bioVi: 'Quy hoạch nông trang ngăn nắp, lò bánh hoạt động hết công suất sáng chiều.',
      sosKind: 'chess',
      sosBaseStage: 15,
    },
    {
      id: 'twins_valley',
      friendCode: 'HS-WEASLEY-05',
      name: 'Fred & George',
      titleVi: 'Quảng Trường Pháo Hoa & Xưởng Giỡn',
      parkName: 'Thung Lũng Pháo Hoa Weasley',
      avatarEmoji: '🎆',
      house: 'Gryffindor',
      level: 46,
      likesCount: 89,
      bioVi: 'Rộn ràng tiếng cười, pháo hoa rồng và những mẻ kẹo bơ thơm lừng!',
      sosKind: 'blocks',
      sosBaseStage: 19,
    },
  ];

  return presets.map((p, idx) => {
    const giftSpot = buildDailyMysterySpot(p.id, daySeed);
    const stageJitter = (daySeed + idx * 3) % 9;
    return {
      id: p.id,
      friendCode: p.friendCode,
      name: p.name,
      titleVi: p.titleVi,
      parkName: p.parkName,
      avatarEmoji: p.avatarEmoji,
      house: p.house,
      level: p.level,
      likesCount: p.likesCount,
      isCanonPreset: true,
      bioVi: p.bioVi,
      helpedMarksToday: [],
      owlHelpCrates: buildDailyNeighborCrates(p.id, p.name, daySeed),
      minigameSos: {
        kind: p.sosKind,
        stage: p.sosBaseStage + stageJitter,
        noteVi: SOS_NOTES_BY_KIND[p.sosKind],
        rescuedToday: false,
      },
      mysteryGiftGx: giftSpot.gx,
      mysteryGiftGy: giftSpot.gy,
    };
  });
}

export function createInitialNeighborSocialState(nowMs = Date.now()): NeighborSocialState {
  const resetKey = getLocalCalendarResetKey(nowMs);
  return {
    playerFriendCode: generatePlayerFriendCode(nowMs),
    selectedPresetNoteId: 'bountiful_harvest',
    friendshipTokens: 4, // Tặng sẵn 4/10 Huy Hiệu làm vốn khởi động thân thiện
    chestsOpened: 0,
    heartsReceivedCount: 3,
    lastSocialResetKey: resetKey,
    dailyRescuesGivenIds: [],
    dailyRescuesReceivedCount: 0,
    dailyLikedNeighborIds: [],
    dailyMysteryClaimedIds: [],
    dailyOwlHelpRequestedCount: 0,
    neighbors: createDefaultCanonNeighbors(resetKey),
    homeLanternMarks: [],
    playerMinigameSos: null,
    playerOwlHelpRequests: [],
    activityLog: [
      {
        id: `slog_init_${nowMs}`,
        timestamp: nowMs,
        icon: '🦉',
        textVi: 'Hội Tương Trợ Thung Lũng đã mở! Ghé thăm 5 hàng xóm để chăm vườn & giải cứu màn khó!',
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
  nowMs = Date.now()
): NeighborProfileState {
  const cleanCode = rawCode.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 18) || 'HS-FRIEND-88';
  const seed = hashSeed(cleanCode);
  const houses: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
  const emojis = ['🧙‍♀️', '🧙‍♂️', '🦊', '🦢', '🌻', '🍀'];
  const kinds: MinigameTrialKind[] = ['match3', 'caro', 'sudoku', 'chess', 'blocks'];
  const fallbackNames = [
    'Ginny Weasley',
    'Cedric Diggory',
    'Cho Chang',
    'Oliver Wood',
    'Fleur Delacour',
    'Nymphadora Tonks',
  ];
  const resolvedName = (customName ?? '').trim() || fallbackNames[seed % fallbackNames.length];
  const level = 12 + (seed % 34);
  const sosKind = kinds[seed % kinds.length];
  const resetKey = getLocalCalendarResetKey(nowMs);
  const daySeed = hashSeed(resetKey);
  const id = `friend_${cleanCode.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const spot = buildDailyMysterySpot(id, daySeed);

  return {
    id,
    friendCode: cleanCode,
    name: resolvedName,
    titleVi: 'Hàng Xóm Kết Nghĩa Qua Mã Cú',
    parkName: `Thung Lũng Của ${resolvedName}`,
    avatarEmoji: emojis[seed % emojis.length],
    house: houses[seed % houses.length],
    level,
    likesCount: 8 + (seed % 35),
    isCanonPreset: false,
    bioVi: `Kết nối qua mã ${cleanCode} — ghé thăm tưới cây và giải cứu màn khó mỗi ngày nhé!`,
    helpedMarksToday: [],
    owlHelpCrates: buildDailyNeighborCrates(id, resolvedName, daySeed),
    minigameSos: {
      kind: sosKind,
      stage: 10 + (seed % 25),
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
 * Dựng bản đồ 72×72 đặc trưng cho từng người bạn để chế độ Tham Quan luôn sống động, rộng rãi và đúng cấp độ.
 */
export function buildNeighborValleySnapshot(
  neighbor: NeighborProfileState,
  nowMs = Date.now()
): NeighborValleySnapshot {
  const unlockedZones: ZoneId[] = ZONES.filter((z) => z.unlockLevel <= Math.max(1, neighbor.level)).map(
    (z) => z.id
  );
  if (!unlockedZones.includes('ga_hogsmeade')) unlockedZones.push('ga_hogsmeade');
  if (!unlockedZones.includes('hem_xeo')) unlockedZones.push('hem_xeo');

  const tileOverrides: Record<string, TileOverrideData> = {};
  // Suối Rái Cá phía Tây giống thung lũng sông Ottery chuẩn 72×72
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
  // Đường đá cuội quê nối trung tâm trang trại hàng xóm
  for (let x = 6; x <= 30; x++) {
    tileOverrides[`${x},22`] = { ...(tileOverrides[`${x},22`] ?? {}), path: 'cobble' };
  }
  for (let y = 18; y <= 33; y++) {
    tileOverrides[`18,${y}`] = { ...(tileOverrides[`18,${y}`] ?? {}), path: 'cobble' };
  }

  const buildings: PlacedBuilding[] = [
    makePlaced(`nb_${neighbor.id}_house`, 'burrow_house_canon', 13, 17, nowMs, {
      stars: 3,
      isIndestructible: true,
    }),
    makePlaced(`nb_${neighbor.id}_owlpost`, 'burrow_owl_post', 20, 18, nowMs, { stars: 2 }),
  ];

  const addFarmlandBlock = (
    prefix: string,
    startX: number,
    startY: number,
    cols: number,
    rows: number,
    crops: FarmCropId[]
  ) => {
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cropId = crops[idx % crops.length];
        const isHelped = neighbor.helpedMarksToday.some(
          (m) => m.buildingUid === `nb_${neighbor.id}_${prefix}_${r}_${c}`
        );
        buildings.push(
          makePlaced(
            `nb_${neighbor.id}_${prefix}_${r}_${c}`,
            'farmland_plot',
            startX + c * 2,
            startY + r * 2,
            nowMs,
            {
              cropId,
              cropPlantedAt: nowMs - 45_000,
              cropReadyAt: isHelped ? nowMs + 120_000 : nowMs + 900_000,
              cropWateredBoost: isHelped,
            }
          )
        );
        idx++;
      }
    }
  };

  const addMergedConnectable2x2 = (
    prefix: string,
    itemId: 'burrow_pumpkin_gnomes' | 'burrow_chicken_coop' | 'burrow_flower_garden' | 'burrow_animal_pasture',
    startX: number,
    startY: number,
    cols: number,
    rows: number,
    extraFn?: (r: number, c: number) => Partial<PlacedBuilding>
  ) => {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        buildings.push(
          makePlaced(
            `nb_${neighbor.id}_${prefix}_${r}_${c}`,
            itemId,
            startX + c * 2,
            startY + r * 2,
            nowMs,
            extraFn ? extraFn(r, c) : undefined
          )
        );
      }
    }
  };

  if (neighbor.id === 'hagrid_valley') {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_hut`, 'hagrid_pumpkin_hut', 9, 24, nowMs, { stars: 3 }),
      makePlaced(`nb_${neighbor.id}_bakery`, 'molly_apple_bakery', 23, 18, nowMs, {
        workshopQueue: [
          { goodId: 'pumpkin_pie', startedAt: nowMs - 20_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_puffskein`, 'burrow_puffskein_pasture', 9, 30, nowMs),
      makePlaced(`nb_${neighbor.id}_pond`, 'burrow_reed_pond_mill', 14, 31, nowMs)
    );
    addMergedConnectable2x2('pump', 'burrow_pumpkin_gnomes', 20, 24, 2, 2);
    const hagridBeasts = ['daisy_cow', 'ottery_sheep', 'burrow_hen', 'golden_puffskein'] as const;
    addMergedConnectable2x2('pasture', 'burrow_animal_pasture', 26, 24, 2, 2, (r, c) => ({
      pastureAnimalId: hagridBeasts[(r * 2 + c) % hagridBeasts.length],
      pastureStockedAt: nowMs - 30_000,
      pastureReadyAt: nowMs + 600_000,
    }));
    addFarmlandBlock('plot', 20, 30, 3, 2, [
      'garden_pumpkin',
      'english_rose',
      'honey_carrot',
      'meadow_daisy',
    ]);
  } else if (neighbor.id === 'luna_valley') {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_apiary`, 'burrow_cider_apiary', 23, 17, nowMs, {
        workshopQueue: [
          { goodId: 'blossom_honey_jar', startedAt: nowMs - 30_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_orchard`, 'burrow_apple_orchard', 9, 24, nowMs),
      makePlaced(`nb_${neighbor.id}_greenhouse`, 'burrow_greenhouse_canon', 28, 18, nowMs),
      makePlaced(`nb_${neighbor.id}_bridge`, 'hogsmeade_stone_bridge', 25, 29, nowMs)
    );
    addMergedConnectable2x2('flowers', 'burrow_flower_garden', 20, 24, 2, 1);
    addFarmlandBlock('plot', 19, 28, 3, 2, [
      'moonlight_flower',
      'forest_bluebell',
      'dried_lavender',
      'hedge_sunflower',
    ]);
  } else if (neighbor.id === 'neville_valley') {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_greenhouse`, 'burrow_greenhouse_canon', 22, 16, nowMs, {
        workshopQueue: [
          { goodId: 'sprout_growth_elixir', startedAt: nowMs - 25_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_mill`, 'burrow_windmill_canon', 9, 24, nowMs, {
        workshopQueue: [
          { goodId: 'fine_wheat_flour', startedAt: nowMs - 15_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_loom`, 'burrow_self_knitting_loom', 28, 24, nowMs)
    );
    addMergedConnectable2x2('pump', 'burrow_pumpkin_gnomes', 20, 24, 2, 2);
    addFarmlandBlock('plot', 19, 30, 4, 2, [
      'baby_mandrake',
      'glow_mushroom',
      'dried_lavender',
      'honey_carrot',
    ]);
  } else if (neighbor.id === 'hermione_valley') {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_brooms`, 'burrow_broomsticks_canon', 23, 16, nowMs, {
        workshopQueue: [
          { goodId: 'frothy_butterbeer', startedAt: nowMs - 20_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_bakery`, 'molly_apple_bakery', 9, 24, nowMs, {
        workshopQueue: [
          { goodId: 'cinnamon_apple_pie', startedAt: nowMs - 20_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_fountain`, 'hogsmeade_harvest_fountain', 19, 24, nowMs)
    );
    addMergedConnectable2x2('coop', 'burrow_chicken_coop', 24, 24, 2, 2);
    addFarmlandBlock('plot', 19, 30, 4, 2, [
      'ruby_strawberry',
      'ottery_wheat',
      'burrow_apple',
      'dew_blueberry',
    ]);
  } else if (neighbor.id === 'twins_valley') {
    buildings.push(
      makePlaced(`nb_${neighbor.id}_shed`, 'arthur_ford_shed', 23, 17, nowMs, {
        workshopQueue: [
          { goodId: 'muggle_plug_kit', startedAt: nowMs - 15_000, endsAt: nowMs + 600_000 },
        ],
      }),
      makePlaced(`nb_${neighbor.id}_marquee`, 'burrow_feast_marquee', 8, 24, nowMs),
      makePlaced(`nb_${neighbor.id}_bakery`, 'molly_apple_bakery', 29, 18, nowMs)
    );
    addMergedConnectable2x2('pump', 'burrow_pumpkin_gnomes', 19, 24, 2, 2);
    addMergedConnectable2x2('coop', 'burrow_chicken_coop', 25, 24, 2, 2);
    addFarmlandBlock('plot', 19, 30, 4, 2, [
      'golden_corn',
      'garden_pumpkin',
      'ruby_tomato',
      'ottery_wheat',
    ]);
  } else {
    // Hàng xóm kết bạn qua Mã Thung Lũng bất kỳ
    const seed = hashSeed(neighbor.id);
    buildings.push(
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
      )
    );
    addMergedConnectable2x2('coop', 'burrow_chicken_coop', 19, 24, 2, 1);
    addMergedConnectable2x2('pump', 'burrow_pumpkin_gnomes', 24, 24, 2, 1);
    addFarmlandBlock('plot', 19, 28, 3, 2, [
      'ottery_wheat',
      'honey_carrot',
      'ruby_strawberry',
      'golden_corn',
    ]);
  }

  // Lọc an toàn chỉ giữ các công trình có thật trong Catalog
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
