import {
  JIGSAW_PAINTINGS,
  JigsawPaintingDef,
  MAX_MINIGAME_STAGE,
  isArcadeSubModeLocked,
  mulberry32,
} from './puzzleShared';

export type JigsawArtStyle =
  | 'oil_masterpiece'
  | 'diorama_capture'
  | 'stained_glass'
  | 'potions_apothecary'
  | 'marauder_astronomy'
  | 'quidditch_skies'
  | 'patronus_forest'
  | 'castle_window';

export interface JigsawStageArtworkSpec {
  stage: number;
  paintingId: string;
  artStyle: JigsawArtStyle;
  styleBadgeVi: string;
  titleVi: string;
  subtitleVi: string;
  accentColor: string;
  basePainting?: JigsawPaintingDef;
  spriteKeys: string[];
  skyIndex: number;
  horizonKind: 'hogwarts' | 'viaduct_train' | 'quidditch' | 'hogsmeade_peaks' | 'burrow_hills';
  weatherMotif: 'starlight' | 'autumn_leaves' | 'snowfall' | 'fireflies' | 'lanterns' | 'sunbeams';
  houseThemeIdx: number; // 0: Gryffindor, 1: Slytherin, 2: Ravenclaw, 3: Hufflepuff
  signatureKey: string;
}

export interface JigsawArtAssetProvider {
  getPaintingImage(url: string): HTMLImageElement | null;
  getSpriteImage(spriteKey: string): HTMLImageElement | null;
}

interface SkyPalette {
  nameVi: string;
  stops: [string, string, string, string];
  celestial: 'sun' | 'full_moon' | 'crescent' | 'aurora' | 'twin_lanterns';
  celestialColor: string;
  cloudTint: string;
  waterTint: [string, string];
  groundStops: [string, string, string];
  accent: string;
}

const WIZARDING_SKIES: readonly SkyPalette[] = [
  {
    nameVi: 'Hoàng Hôn Đỏ Thẫm',
    stops: ['#31102f', '#7c2d12', '#ea580c', '#fde047'],
    celestial: 'sun',
    celestialColor: '#fef08a',
    cloudTint: 'rgba(251, 146, 60, 0.34)',
    waterTint: ['#7c2d12', '#f59e0b'],
    groundStops: ['#3f6212', '#365314', '#1a2e05'],
    accent: '#ea580c',
  },
  {
    nameVi: 'Đêm Trăng Tròn Hồ Đen',
    stops: ['#090d24', '#1e1b4b', '#312e81', '#4338ca'],
    celestial: 'full_moon',
    celestialColor: '#fef9c3',
    cloudTint: 'rgba(129, 140, 248, 0.25)',
    waterTint: ['#1e1b4b', '#38bdf8'],
    groundStops: ['#134e4a', '#115e59', '#042f2e'],
    accent: '#818cf8',
  },
  {
    nameVi: 'Bình Minh Sương Hồng Scotland',
    stops: ['#3b0764', '#831843', '#db2777', '#fbcfe8'],
    celestial: 'sun',
    celestialColor: '#fffbeb',
    cloudTint: 'rgba(244, 114, 182, 0.32)',
    waterTint: ['#831843', '#f472b6'],
    groundStops: ['#3f6212', '#4d7c0f', '#1e3a1e'],
    accent: '#ec4899',
  },
  {
    nameVi: 'Nắng Mật Ong Thung Lũng Ottery',
    stops: ['#0284c7', '#38bdf8', '#bae6fd', '#fef3c7'],
    celestial: 'sun',
    celestialColor: '#fde047',
    cloudTint: 'rgba(255, 255, 255, 0.45)',
    waterTint: ['#0369a1', '#7dd3fc'],
    groundStops: ['#65a30d', '#4d7c0f', '#365314'],
    accent: '#eab308',
  },
  {
    nameVi: 'Cực Quang Lục Bảo Phương Bắc',
    stops: ['#022c22', '#064e3b', '#0f766e', '#2dd4bf'],
    celestial: 'aurora',
    celestialColor: '#5eead4',
    cloudTint: 'rgba(45, 212, 191, 0.28)',
    waterTint: ['#064e3b', '#2dd4bf'],
    groundStops: ['#065f46', '#047857', '#022c22'],
    accent: '#10b981',
  },
  {
    nameVi: 'Đêm Tuyết Giáng Sinh Hogsmeade',
    stops: ['#0f172a', '#1e3a8a', '#2563eb', '#93c5fd'],
    celestial: 'crescent',
    celestialColor: '#fef08a',
    cloudTint: 'rgba(219, 234, 254, 0.35)',
    waterTint: ['#1e3a8a', '#93c5fd'],
    groundStops: ['#e2e8f0', '#cbd5e1', '#94a3b8'],
    accent: '#38bdf8',
  },
  {
    nameVi: 'Chiều Thu Lá Phong Vàng Rực',
    stops: ['#451a03', '#9a3412', '#d97706', '#fcd34d'],
    celestial: 'sun',
    celestialColor: '#fef3c7',
    cloudTint: 'rgba(253, 186, 116, 0.36)',
    waterTint: ['#78350f', '#fbbf24'],
    groundStops: ['#b45309', '#92400e', '#451a03'],
    accent: '#f59e0b',
  },
  {
    nameVi: 'Đêm Ngàn Sao Tháp Thiên Văn',
    stops: ['#17092b', '#2e1065', '#581c87', '#9333ea'],
    celestial: 'crescent',
    celestialColor: '#fde68a',
    cloudTint: 'rgba(192, 132, 252, 0.28)',
    waterTint: ['#3b0764', '#c084fc'],
    groundStops: ['#1e293b', '#334155', '#0f172a'],
    accent: '#a855f7',
  },
  {
    nameVi: 'Sương Lam Huyền Ảo Rừng Cấm',
    stops: ['#082f49', '#0e7490', '#06b6d4', '#a5f3fc'],
    celestial: 'aurora',
    celestialColor: '#cffafe',
    cloudTint: 'rgba(103, 232, 249, 0.3)',
    waterTint: ['#155e75', '#67e8f9'],
    groundStops: ['#115e59', '#0f766e', '#134e4a'],
    accent: '#06b6d4',
  },
  {
    nameVi: 'Lửa Phượng Hoàng Rực Cháy',
    stops: ['#450a0a', '#991b1b', '#dc2626', '#fb923c'],
    celestial: 'sun',
    celestialColor: '#fef08a',
    cloudTint: 'rgba(252, 165, 165, 0.32)',
    waterTint: ['#7f1d1d', '#f97316'],
    groundStops: ['#713f12', '#854d0e', '#422006'],
    accent: '#f43f5e',
  },
  {
    nameVi: ' Nắng Xuân Hoa Nở Nhà Kính',
    stops: ['#0369a1', '#0ea5e9', '#7dd3fc', '#dcfce7'],
    celestial: 'sun',
    celestialColor: '#fef9c3',
    cloudTint: 'rgba(255, 255, 255, 0.42)',
    waterTint: ['#0284c7', '#86efac'],
    groundStops: ['#16a34a', '#15803d', '#14532d'],
    accent: '#22c55e',
  },
  {
    nameVi: 'Chạng Vạng Hổ Phách Cầu Đá',
    stops: ['#1c1917', '#57534e', '#b45309', '#fde68a'],
    celestial: 'twin_lanterns',
    celestialColor: '#fcd34d',
    cloudTint: 'rgba(253, 230, 138, 0.3)',
    waterTint: ['#44403c', '#f59e0b'],
    groundStops: ['#3f6212', '#44403c', '#1c1917'],
    accent: '#d97706',
  },
];

interface DioramaSubjectGroup {
  tagVi: string;
  landmarkSprites: string[];
  characterOrBeastSprites: string[];
  propSprites: string[];
}

const DIORAMA_SUBJECT_GROUPS: readonly DioramaSubjectGroup[] = [
  {
    tagVi: 'Trang Trại Hang Sóc & Gia Đình Weasley',
    landmarkSprites: ['burrow_house_canon', 'molly_apple_bakery', 'burrow_windmill_canon'],
    characterOrBeastSprites: ['villager_molly_idle', 'villager_arthur_idle', 'villager_ron_idle', 'villager_ginny_idle'],
    propSprites: ['env_tree_oak', 'burrow_pumpkin_gnomes', 'ui_icon_pie_ready'],
  },
  {
    tagVi: 'Lều Bí Ngô Bác Hagrid & Bằng Mã Buckbeak',
    landmarkSprites: ['hagrid_pumpkin_hut', 'hippogriff_glade', 'burrow_pumpkin_gnomes'],
    characterOrBeastSprites: ['villager_hagrid_idle', 'beast_hippogriff_bow', 'hagrid_bowtruckle'],
    propSprites: ['env_tree_magic', 'env_tree_oak', 'm3_farm_pumpkin'],
  },
  {
    tagVi: 'Phố Tuyết Hogsmeade & Xe Bia Bơ Nóng',
    landmarkSprites: ['burrow_honeydukes_canon', 'butterbeer_cart', 'hogsmeade_stone_bridge'],
    characterOrBeastSprites: ['villager_hermione_idle', 'villager_ron_idle', 'beast_puffskein_bounce'],
    propSprites: ['snowy_pines', 'ui_icon_butterbeer', 'ui_icon_frog_choc'],
  },
  {
    tagVi: 'Bến Thuyền Hồ Đen & Ngọn Đèn Đầu Năm',
    landmarkSprites: ['black_lake_boats', 'hogsmeade_stone_bridge', 'floo_fireplace_gate'],
    characterOrBeastSprites: ['vehicle_lake_boat', 'villager_hagrid_idle', 'villager_hermione_idle'],
    propSprites: ['env_tree_pine', 'm3_sp_snitch', 'ui_icon_crop_moonlight_flower'],
  },
  {
    tagVi: 'Cây Liễu Roi & Nhà Kho Xe Bay Ông Arthur',
    landmarkSprites: ['whomping_willow', 'arthur_ford_shed', 'burrow_apple_orchard'],
    characterOrBeastSprites: ['villager_arthur_idle', 'villager_ron_idle', 'guest_ron_gnome'],
    propSprites: ['env_tree_oak', 'ui_icon_muggle_plug', 'm3_farm_pear'],
  },
  {
    tagVi: 'Tháp Cú Đưa Thư & Tiệm Cú Eeylops',
    landmarkSprites: ['eeylops_owl_emporium', 'burrow_owl_post', 'owlery_elf_hut'],
    characterOrBeastSprites: ['villager_ginny_idle', 'villager_hermione_idle', 'beast_niffler_play'],
    propSprites: ['env_tree_pine', 'ui_icon_owl_orders', 'm3_piece_scroll'],
  },
  {
    tagVi: 'Nhà Kính Thảo Dược & Vườn Mandrake',
    landmarkSprites: ['burrow_greenhouse_canon', 'burrow_flower_garden', 'hogsmeade_harvest_fountain'],
    characterOrBeastSprites: ['villager_molly_idle', 'hagrid_bowtruckle', 'beast_puffskein_bounce'],
    propSprites: ['ui_icon_crop_baby_mandrake', 'ui_icon_crop_phoenix_fireflower', 'env_bush_flowers'],
  },
  {
    tagVi: 'Đài Phượng Hoàng Lửa & Tháp Cổ',
    landmarkSprites: ['phoenix_perch', 'floo_fireplace_gate', 'hogsmeade_harvest_fountain'],
    characterOrBeastSprites: ['beast_phoenix_soar', 'villager_hermione_idle', 'beast_unicorn_prance'],
    propSprites: ['env_tree_magic', 'ui_icon_crop_phoenix_fireflower', 'm3_icon_star'],
  },
  {
    tagVi: 'Thung Lũng Rồng Lửa & Kho Báu Niffler',
    landmarkSprites: ['dragon_lair', 'niffler_den', 'hogsmeade_stone_bridge'],
    characterOrBeastSprites: ['beast_dragon_roar', 'beast_niffler_play', 'villager_hagrid_idle'],
    propSprites: ['env_mossy_rock', 'ui_icon_golden_sickle', 'm3_gem_ruby'],
  },
  {
    tagVi: 'Trảng Rừng Độc Giác Thú & Vong Mã',
    landmarkSprites: ['unicorn_glade', 'thestral_grove', 'burrow_reed_pond_mill'],
    characterOrBeastSprites: ['beast_unicorn_prance', 'beast_thestral_wings', 'hagrid_bowtruckle'],
    propSprites: ['env_tree_magic', 'ui_icon_crop_glow_mushroom', 'ui_icon_crop_moonlight_flower'],
  },
  {
    tagVi: 'Đại Tiệc Mùa Gặt Lều Lụa & Guồng Nước',
    landmarkSprites: ['burrow_feast_marquee', 'burrow_reed_pond_mill', 'burrow_cider_apiary'],
    characterOrBeastSprites: ['villager_molly_idle', 'villager_arthur_idle', 'villager_ginny_idle', 'beast_hen_peck'],
    propSprites: ['halloween_arch', 'ui_icon_honey_jar', 'ui_icon_cider'],
  },
];

const HOUSE_PALETTES: ReadonlyArray<{
  houseVi: string;
  mascotVi: string;
  primary: string;
  secondary: string;
  dark: string;
  glow: string;
}> = [
  {
    houseVi: 'Sư Tử Đỏ Gryffindor',
    mascotVi: 'Hùng Sư Hoàng Kim',
    primary: '#dc2626',
    secondary: '#facc15',
    dark: '#450a0a',
    glow: '#fde047',
  },
  {
    houseVi: ' Xà Vương Slytherin',
    mascotVi: 'Thanh Xà Lục Bảo',
    primary: '#059669',
    secondary: '#cbd5e1',
    dark: '#022c22',
    glow: '#34d399',
  },
  {
    houseVi: 'Đại Bàng Ravenclaw',
    mascotVi: 'Ưng Lam Tinh Tú',
    primary: '#2563eb',
    secondary: '#d97706',
    dark: '#172554',
    glow: '#60a5fa',
  },
  {
    houseVi: 'Lửng Vàng Hufflepuff',
    mascotVi: 'Kim Hoàng Đôn Hậu',
    primary: '#eab308',
    secondary: '#292524',
    dark: '#422006',
    glow: '#fef08a',
  },
];

const MILESTONE_BOSS_STAGE_SET = new Set<number>([
  25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 777,
]);

const WEATHER_MOTIFS: readonly JigsawStageArtworkSpec['weatherMotif'][] = [
  'starlight',
  'autumn_leaves',
  'snowfall',
  'fireflies',
  'lanterns',
  'sunbeams',
];

const HORIZON_KINDS: readonly JigsawStageArtworkSpec['horizonKind'][] = [
  'hogwarts',
  'viaduct_train',
  'quidditch',
  'hogsmeade_peaks',
  'burrow_hills',
];

const CHAPTER_EPITHETS_VI: readonly string[] = [
  'Khúc Dạo Đầu Nắng Sớm',
  'Ánh Đuốc Mùa Tựu Trường',
  'Làn Khói Sao Cầu Cạn',
  'Bí Mật Hành Lang Đá',
  'Hơi Ấm Lò Sưởi Quế',
  'Vũ Điệu Lá Phong Đỏ',
  'Khúc Hát Đêm Tuyết Trắng',
  'Hào Quang Bạc Hồ Đen',
  'Lời Thì Thầm Cổ Ngữ',
  'Mùa Gặt Vàng Thung Lũng',
  'Đôi Cánh Lửa Bất Tử',
  'Huyền Thoại Đỉnh Tháp Cao',
];

const specCache = new Map<number, JigsawStageArtworkSpec>();

/**
 * Tạo đặc tả bức tranh độc bản cho từng màn `1..777`.
 * Cam kết 777/777 màn có `paintingId`, `titleVi` và `signatureKey` khác biệt hoàn toàn.
 */
export function getJigsawStageArtworkSpec(rawStage: number): JigsawStageArtworkSpec {
  const stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(Number(rawStage) || 1)));
  const cached = specCache.get(stage);
  if (cached) return cached;

  const paintingId = `hp_painting_s${String(stage).padStart(3, '0')}`;
  const rng = mulberry32(stage * 92821 + 31337);
  const skyIndex = (stage * 7 + Math.floor(rng() * 5)) % WIZARDING_SKIES.length;
  const sky = WIZARDING_SKIES[skyIndex];
  const houseThemeIdx = (stage + Math.floor(stage / 7)) % HOUSE_PALETTES.length;
  const house = HOUSE_PALETTES[houseThemeIdx];
  const horizonKind = HORIZON_KINDS[(stage * 3 + Math.floor(stage / 11)) % HORIZON_KINDS.length];
  const weatherMotif = WEATHER_MOTIFS[(stage * 5 + Math.floor(stage / 9)) % WEATHER_MOTIFS.length];
  const chapterEpithet = CHAPTER_EPITHETS_VI[Math.floor((stage - 1) / 65) % CHAPTER_EPITHETS_VI.length];

  // 19 màn mở đầu (1..19) dùng trực tiếp 19 bức tranh sơn dầu nguyên bản không trùng nhau
  if (stage <= JIGSAW_PAINTINGS.length) {
    const base = JIGSAW_PAINTINGS[stage - 1];
    const spec: JigsawStageArtworkSpec = {
      stage,
      paintingId,
      artStyle: 'oil_masterpiece',
      styleBadgeVi: '🎨 Tranh Sơn Dầu Phép Thuật',
      titleVi: base.title,
      subtitleVi: base.subtitle,
      accentColor: base.accentColor,
      basePainting: base,
      spriteKeys: ['m3_sp_snitch', 'm3_icon_star'],
      skyIndex,
      horizonKind,
      weatherMotif,
      houseThemeIdx,
      signatureKey: `oil_origin_${stage}_${base.id}`,
    };
    specCache.set(stage, spec);
    return spec;
  }

  // Các màn Đại Trùm Mốc (25, 50, 100, ..., 777) là bức Khung Vòm Đại Kiệt Tác Hoàng Kim độc bản
  if (MILESTONE_BOSS_STAGE_SET.has(stage)) {
    const bossOrd = Array.from(MILESTONE_BOSS_STAGE_SET).indexOf(stage);
    const base = JIGSAW_PAINTINGS[(bossOrd * 3 + 8) % JIGSAW_PAINTINGS.length];
    const dio = DIORAMA_SUBJECT_GROUPS[bossOrd % DIORAMA_SUBJECT_GROUPS.length];
    const spec: JigsawStageArtworkSpec = {
      stage,
      paintingId,
      artStyle: 'castle_window',
      styleBadgeVi: '👑 Đại Kiệt Tác Trùm Mốc',
      titleVi: `Đại Kiệt Tác Mốc ${stage}: ${base.title} (${house.houseVi.trim()})`,
      subtitleVi: `Bức đại bích hoạ khảo thí bậc cao kết hợp vòm đá Hogwarts và ấn ký ${house.mascotVi}.`,
      accentColor: base.accentColor,
      basePainting: base,
      spriteKeys: [...dio.landmarkSprites.slice(0, 2), ...dio.characterOrBeastSprites.slice(0, 2), 'm3_sp_snitch'],
      skyIndex,
      horizonKind,
      weatherMotif: 'starlight',
      houseThemeIdx,
      signatureKey: `boss_arch_${stage}_${base.id}_${houseThemeIdx}`,
    };
    specCache.set(stage, spec);
    return spec;
  }

  // Từ màn 20..776: đan xen 7 trường phái "Chụp Cảnh Diorama" & "Tự Vẽ Thế Giới Harry Potter"
  const styleCycle: readonly JigsawArtStyle[] = [
    'diorama_capture',
    'stained_glass',
    'diorama_capture',
    'potions_apothecary',
    'castle_window',
    'marauder_astronomy',
    'diorama_capture',
    'quidditch_skies',
    'patronus_forest',
  ];
  const artStyle = styleCycle[(stage - 20) % styleCycle.length];
  const dioIdx = (stage * 3 + Math.floor(stage / 5)) % DIORAMA_SUBJECT_GROUPS.length;
  const dio = DIORAMA_SUBJECT_GROUPS[dioIdx];
  const base = JIGSAW_PAINTINGS[(stage * 5 + 3) % JIGSAW_PAINTINGS.length];

  let styleBadgeVi = '📸 Chụp Cảnh Thế Giới Phù Thủy';
  let titleVi = '';
  let subtitleVi = '';
  let accentColor = sky.accent;
  let spriteKeys: string[] = [
    ...dio.landmarkSprites,
    ...dio.characterOrBeastSprites,
    ...dio.propSprites,
  ];

  switch (artStyle) {
    case 'diorama_capture': {
      styleBadgeVi = '📸 Chụp Cảnh Thế Giới Phù Thủy';
      titleVi = `${dio.tagVi} — ${sky.nameVi} (Bức #${stage})`;
      subtitleVi = `Ảnh chụp ống kính phép thuật ghi lại khoảnh khắc ${sky.nameVi.toLowerCase()} trên thung lũng (${chapterEpithet}).`;
      break;
    }
    case 'stained_glass': {
      styleBadgeVi = '🪟 Tranh Kính Màu Hogwarts';
      titleVi = `Kính Màu Đại Sảnh: ${house.houseVi.trim()} & ${sky.nameVi} (#${stage})`;
      subtitleVi = `Hàng trăm mảnh kính ngọc cẩn chì khắc hoạ biểu tượng ${house.mascotVi} rực sáng dưới nắng lâu đài.`;
      accentColor = house.primary;
      spriteKeys = [dio.characterOrBeastSprites[0] ?? 'beast_phoenix_soar', 'm3_sp_snitch'];
      break;
    }
    case 'potions_apothecary': {
      styleBadgeVi = '🧪 Tranh Vẽ Hầm Độc Dược';
      titleVi = `Tủ Độc Dược Cổ Ngữ & Phúc Lạc Dược — ${chapterEpithet} (#${stage})`;
      subtitleVi = `Những bình pha lê lấp lánh sắc ngọc bên vạc đồng sủi bọt khói sao và sách phép gáy da cổ.`;
      accentColor = '#10b981';
      spriteKeys = ['m3_piece_scroll', 'ui_icon_crop_baby_mandrake', 'ui_icon_herb_elixir'];
      break;
    }
    case 'marauder_astronomy': {
      styleBadgeVi = '🗺️ Bản Đồ Đạo Tặc & Tinh Đồ';
      titleVi = `Tinh Đồ Thiên Văn & Lối Đi Bí Mật Lâu Đài — ${sky.nameVi} (#${stage})`;
      subtitleVi = `Giấy da cổ khắc dấu chân tuần tra, vòng hoàng đạo đồng thau và chòm sao hộ mệnh đêm khuya.`;
      accentColor = '#d97706';
      spriteKeys = ['m3_piece_scroll', 'm3_sp_snitch'];
      break;
    }
    case 'quidditch_skies': {
      styleBadgeVi = '🧹 Tranh Bầu Trời Quidditch';
      titleVi = `Đấu Trường Quidditch: ${house.houseVi.trim()} Săn Snitch Vàng (#${stage})`;
      subtitleVi = `Cờ hiệu bốn Nhà tung bay trên tháp cao giữa đường lượn chổi phép dưới ${sky.nameVi.toLowerCase()}.`;
      accentColor = house.secondary === '#292524' ? house.primary : house.secondary;
      spriteKeys = ['m3_sp_snitch', 'burrow_broomsticks_canon', dio.characterOrBeastSprites[0] ?? 'beast_phoenix_soar'];
      break;
    }
    case 'patronus_forest': {
      styleBadgeVi = '🦌 Tranh Thần Hộ Mệnh Rừng Đêm';
      titleVi = `Hào Quang Thần Hộ Mệnh & ${dio.tagVi.split('&')[0].trim()} (#${stage})`;
      subtitleVi = `Dải bạc Expecto Patronum xoắn ốc toả sáng giữa rừng cổ thụ và mặt hồ phản chiếu ánh trăng.`;
      accentColor = '#38bdf8';
      spriteKeys = ['beast_unicorn_prance', 'beast_phoenix_soar', 'env_tree_magic', 'ui_icon_crop_glow_mushroom'];
      break;
    }
    case 'castle_window':
    default: {
      styleBadgeVi = '🏰 Ô Cửa Vòm Lâu Đài';
      titleVi = `Khung Cửa Tháp Cổ Nhìn Ra ${base.title} (#${stage})`;
      subtitleVi = `Góc nhìn qua vòm đá Gothic cẩn kính màu ${house.houseVi.trim()} hướng về đại cảnh phép thuật.`;
      accentColor = base.accentColor;
      spriteKeys = [dio.characterOrBeastSprites[0] ?? 'beast_phoenix_soar', ...dio.propSprites.slice(0, 2)];
      break;
    }
  }

  const spec: JigsawStageArtworkSpec = {
    stage,
    paintingId,
    artStyle,
    styleBadgeVi,
    titleVi,
    subtitleVi,
    accentColor,
    basePainting: base,
    spriteKeys,
    skyIndex,
    horizonKind,
    weatherMotif,
    houseThemeIdx,
    signatureKey: `${artStyle}_s${stage}_sky${skyIndex}_d${dioIdx}_h${houseThemeIdx}_${horizonKind}_${weatherMotif}`,
  };
  specCache.set(stage, spec);
  return spec;
}

// ============================================================================
// BỘ CỌ VẼ & DÀN DỰNG NHIẾP ẢNH CANVAS 2D ĐỘ PHÂN GIẢI CAO (777 BỨC ĐỘC BẢN)
// ============================================================================

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  panU = 0.5,
  panV = 0.5,
  zoom = 1
): void {
  const iw = Math.max(1, img.naturalWidth || img.width);
  const ih = Math.max(1, img.naturalHeight || img.height);
  const scale = Math.max(w / iw, h / ih) * Math.max(1, zoom);
  const sw = w / scale;
  const sh = h / scale;
  const sx = Math.max(0, Math.min(iw - sw, (iw - sw) * panU));
  const sy = Math.max(0, Math.min(ih - sh, (ih - sh) * panV));
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawSkyAndCelestial(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sky: SkyPalette,
  rng: () => number
): void {
  const skyH = h * 0.68;
  const grad = ctx.createLinearGradient(0, 0, 0, skyH);
  grad.addColorStop(0, sky.stops[0]);
  grad.addColorStop(0.36, sky.stops[1]);
  grad.addColorStop(0.72, sky.stops[2]);
  grad.addColorStop(1, sky.stops[3]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Stars & nebula micro-texture across upper sky so no two sky pieces look blank
  const starCount = 110;
  for (let i = 0; i < starCount; i++) {
    const sx = rng() * w;
    const sy = rng() * skyH * 0.85;
    const r = 0.8 + rng() * 2.2;
    ctx.fillStyle =
      i % 5 === 0
        ? 'rgba(254, 240, 138, 0.85)'
        : i % 3 === 0
          ? 'rgba(186, 230, 253, 0.78)'
          : 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    if (i % 9 === 0) {
      ctx.strokeStyle = 'rgba(254, 249, 195, 0.45)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(sx - r * 3.2, sy);
      ctx.lineTo(sx + r * 3.2, sy);
      ctx.moveTo(sx, sy - r * 3.2);
      ctx.lineTo(sx, sy + r * 3.2);
      ctx.stroke();
    }
  }

  // Celestial body (sun / full moon / crescent / aurora ribbons)
  const cx = w * (0.2 + rng() * 0.6);
  const cy = h * (0.14 + rng() * 0.18);
  const rad = Math.min(w, h) * (0.065 + rng() * 0.035);

  if (sky.celestial === 'aurora') {
    for (let band = 0; band < 4; band++) {
      ctx.save();
      ctx.strokeStyle =
        band % 2 === 0 ? 'rgba(94, 234, 212, 0.34)' : 'rgba(167, 139, 250, 0.3)';
      ctx.lineWidth = h * (0.035 + band * 0.012);
      ctx.lineCap = 'round';
      ctx.beginPath();
      const baseY = h * (0.12 + band * 0.07);
      ctx.moveTo(-20, baseY);
      for (let x = 0; x <= w + 40; x += w / 6) {
        const wy = baseY + Math.sin(x * 0.008 + band * 1.4 + rng() * 0.5) * (h * 0.055);
        ctx.lineTo(x, wy);
      }
      ctx.stroke();
      ctx.restore();
    }
  } else {
    const halo = ctx.createRadialGradient(cx, cy, rad * 0.2, cx, cy, rad * 3.2);
    halo.addColorStop(0, sky.celestialColor);
    halo.addColorStop(0.35, 'rgba(253, 224, 71, 0.36)');
    halo.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 3.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = sky.celestialColor;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    if (sky.celestial === 'crescent') {
      ctx.fillStyle = sky.stops[1];
      ctx.beginPath();
      ctx.arc(cx + rad * 0.38, cy - rad * 0.16, rad * 0.86, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Layered painterly oil clouds
  for (let c = 0; c < 11; c++) {
    const clX = rng() * w;
    const clY = h * (0.08 + rng() * 0.42);
    const clW = w * (0.14 + rng() * 0.2);
    const clH = h * (0.035 + rng() * 0.045);
    ctx.fillStyle = sky.cloudTint;
    for (let puff = 0; puff < 4; puff++) {
      ctx.beginPath();
      ctx.ellipse(
        clX + (puff - 1.5) * clW * 0.24,
        clY + (puff % 2 === 0 ? -clH * 0.18 : clH * 0.12),
        clW * 0.34,
        clH * 0.65,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}

function drawWizardingHorizon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  horizonKind: JigsawStageArtworkSpec['horizonKind'],
  sky: SkyPalette,
  rng: () => number
): void {
  const horizonY = h * 0.54;

  // Distant Scottish highlands mountain ridge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, horizonY);
  const segs = 12;
  for (let i = 1; i <= segs; i++) {
    const px = (w * i) / segs;
    const py = horizonY - Math.abs(Math.sin(i * 1.15 + rng() * 0.7)) * (h * 0.16);
    ctx.lineTo(px, py);
  }
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  if (horizonKind === 'hogwarts') {
    // Iconic multi-turret Hogwarts Castle silhouette on cliffside with glowing windows
    const baseX = w * (0.18 + rng() * 0.35);
    const baseY = horizonY - h * 0.02;
    const cw = w * 0.38;
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(baseX, baseY - h * 0.11, cw, h * 0.16);
    const towers = 7;
    for (let t = 0; t < towers; t++) {
      const tx = baseX + (t / (towers - 1)) * (cw * 0.9) - cw * 0.04;
      const tw = cw * (t === 3 ? 0.15 : 0.095);
      const th = h * (t === 3 ? 0.26 : 0.15 + (t % 3) * 0.04);
      ctx.fillStyle = '#1e1b2e';
      ctx.fillRect(tx, baseY - th, tw, th + h * 0.05);
      ctx.fillStyle = '#312e81';
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.18, baseY - th);
      ctx.lineTo(tx + tw * 0.5, baseY - th - h * 0.075);
      ctx.lineTo(tx + tw * 1.18, baseY - th);
      ctx.closePath();
      ctx.fill();
      // Warm glowing castle windows
      ctx.fillStyle = '#fde047';
      for (let wy = baseY - th + 10; wy < baseY - 6; wy += 12) {
        ctx.fillRect(tx + tw * 0.36, wy, Math.max(2.5, tw * 0.26), 5);
      }
    }
  } else if (horizonKind === 'viaduct_train') {
    // Glenfinnan stone viaduct + scarlet Hogwarts Express puffing starry smoke
    const bridgeY = horizonY - h * 0.03;
    ctx.fillStyle = '#44403c';
    ctx.fillRect(w * 0.06, bridgeY, w * 0.88, h * 0.13);
    ctx.fillStyle = sky.stops[2];
    const arches = 9;
    const archSpan = (w * 0.82) / arches;
    for (let a = 0; a < arches; a++) {
      const ax = w * 0.09 + a * archSpan + archSpan * 0.5;
      ctx.beginPath();
      ctx.arc(ax, bridgeY + h * 0.13, archSpan * 0.34, Math.PI, 0);
      ctx.fill();
    }
    // Scarlet steam train & carriages
    const trainX = w * (0.22 + rng() * 0.28);
    const trainY = bridgeY - h * 0.038;
    for (let car = 0; car < 4; car++) {
      const cx = trainX + car * (w * 0.085);
      ctx.fillStyle = car === 0 ? '#b91c1c' : '#991b1b';
      ctx.fillRect(cx, trainY, w * 0.075, h * 0.036);
      ctx.fillStyle = '#fef08a';
      for (let win = 0; win < 3; win++) {
        ctx.fillRect(cx + w * 0.01 + win * (w * 0.022), trainY + h * 0.008, w * 0.014, h * 0.014);
      }
    }
    // Billowing golden-white steam puffs
    for (let p = 0; p < 7; p++) {
      ctx.fillStyle = `rgba(254, 243, 199, ${0.68 - p * 0.07})`;
      ctx.beginPath();
      ctx.arc(
        trainX + p * (w * 0.032),
        trainY - h * (0.018 + p * 0.014),
        h * (0.016 + p * 0.006),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  } else if (horizonKind === 'quidditch') {
    // 6 Striped House Quidditch towers + 3 golden goal hoops
    const colors = ['#dc2626', '#eab308', '#059669', '#2563eb'];
    for (let t = 0; t < 6; t++) {
      const tx = w * (0.12 + t * 0.15);
      const tw = w * 0.042;
      const th = h * (0.18 + (t % 2) * 0.04);
      for (let stripe = 0; stripe < 5; stripe++) {
        ctx.fillStyle = stripe % 2 === 0 ? colors[t % 4] : '#fde68a';
        ctx.fillRect(tx, horizonY - th + (stripe * th) / 5, tw, th / 5 + 1);
      }
      ctx.fillStyle = colors[(t + 1) % 4];
      ctx.beginPath();
      ctx.moveTo(tx - tw * 0.2, horizonY - th);
      ctx.lineTo(tx + tw * 0.5, horizonY - th - h * 0.055);
      ctx.lineTo(tx + tw * 1.2, horizonY - th);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = Math.max(2, w * 0.004);
    for (let g = -1; g <= 1; g++) {
      const gx = w * 0.5 + g * w * 0.055;
      const gy = horizonY - h * (g === 0 ? 0.16 : 0.13);
      ctx.beginPath();
      ctx.moveTo(gx, horizonY);
      ctx.lineTo(gx, gy + h * 0.022);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(gx, gy, h * 0.022, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

function drawRollingValleyAndRiver(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  sky: SkyPalette,
  rng: () => number
): void {
  const groundTop = h * 0.52;
  const gGrad = ctx.createLinearGradient(0, groundTop, 0, h);
  gGrad.addColorStop(0, sky.groundStops[0]);
  gGrad.addColorStop(0.5, sky.groundStops[1]);
  gGrad.addColorStop(1, sky.groundStops[2]);
  ctx.fillStyle = gGrad;

  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, groundTop + Math.sin(rng() * 3) * (h * 0.03));
  ctx.bezierCurveTo(
    w * 0.32,
    groundTop - h * 0.045,
    w * 0.68,
    groundTop + h * 0.045,
    w,
    groundTop - h * 0.015
  );
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Winding River Ottery / Black Lake reflection ribbon
  const rGrad = ctx.createLinearGradient(0, groundTop, 0, h);
  rGrad.addColorStop(0, sky.waterTint[0]);
  rGrad.addColorStop(1, sky.waterTint[1]);
  ctx.fillStyle = rGrad;
  const riverStart = w * (0.28 + rng() * 0.44);
  const riverEnd = w * (0.18 + rng() * 0.64);
  ctx.beginPath();
  ctx.moveTo(riverStart - w * 0.03, groundTop + h * 0.01);
  ctx.bezierCurveTo(
    riverStart - w * 0.14,
    h * 0.72,
    riverEnd + w * 0.06,
    h * 0.85,
    riverEnd - w * 0.14,
    h
  );
  ctx.lineTo(riverEnd + w * 0.14, h);
  ctx.bezierCurveTo(
    riverEnd + w * 0.22,
    h * 0.84,
    riverStart + w * 0.02,
    h * 0.7,
    riverStart + w * 0.03,
    groundTop + h * 0.01
  );
  ctx.closePath();
  ctx.fill();

  // Shimmering water ripples & meadow wildflowers across all lower quadrants
  for (let i = 0; i < 95; i++) {
    const fx = rng() * w;
    const fy = groundTop + rng() * (h - groundTop);
    ctx.fillStyle =
      i % 4 === 0
        ? 'rgba(253, 224, 71, 0.72)'
        : i % 4 === 1
          ? 'rgba(244, 114, 182, 0.68)'
          : i % 4 === 2
            ? 'rgba(125, 211, 252, 0.65)'
            : 'rgba(251, 146, 60, 0.68)';
    ctx.beginPath();
    ctx.arc(fx, fy, 1.5 + rng() * 3.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWeatherMotifParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  motif: JigsawStageArtworkSpec['weatherMotif'],
  rng: () => number
): void {
  const count = 44;
  for (let i = 0; i < count; i++) {
    const px = rng() * w;
    const py = rng() * h;
    if (motif === 'lanterns') {
      const lw = 8 + rng() * 8;
      const lh = lw * 1.35;
      const glow = ctx.createRadialGradient(px, py, 1, px, py, lw * 2.2);
      glow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, lw * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px - lw * 0.5, py - lh * 0.5, lw, lh);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(px - lw * 0.3, py - lh * 0.32, lw * 0.6, lh * 0.64);
    } else if (motif === 'autumn_leaves') {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rng() * Math.PI * 2);
      ctx.fillStyle = i % 3 === 0 ? '#ea580c' : i % 3 === 1 ? '#eab308' : '#dc2626';
      ctx.beginPath();
      ctx.ellipse(0, 0, 5 + rng() * 5, 2.5 + rng() * 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (motif === 'snowfall') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(px, py, 1.8 + rng() * 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const r = 2 + rng() * 4;
      const glow = ctx.createRadialGradient(px, py, 0.5, px, py, r * 3);
      glow.addColorStop(0, 'rgba(254, 249, 195, 0.9)');
      glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, r * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawDioramaSprites(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spec: JigsawStageArtworkSpec,
  assets: JigsawArtAssetProvider | undefined,
  rng: () => number
): void {
  if (!assets) return;
  const loadedSprites = spec.spriteKeys
    .map((key) => ({ key, img: assets.getSpriteImage(key) }))
    .filter((entry): entry is { key: string; img: HTMLImageElement } =>
      Boolean(entry.img && entry.img.complete && (entry.img.naturalWidth || entry.img.width) > 0)
    );
  if (loadedSprites.length === 0) return;

  const slots = [
    { x: 0.27, y: 0.66, scale: 0.34 },
    { x: 0.72, y: 0.65, scale: 0.32 },
    { x: 0.5, y: 0.73, scale: 0.38 },
    { x: 0.16, y: 0.8, scale: 0.22 },
    { x: 0.84, y: 0.81, scale: 0.22 },
    { x: 0.39, y: 0.84, scale: 0.19 },
    { x: 0.62, y: 0.85, scale: 0.19 },
  ];

  const count = Math.min(slots.length, Math.max(3, loadedSprites.length));
  for (let i = 0; i < count; i++) {
    const item = loadedSprites[(i + spec.stage) % loadedSprites.length];
    const slot = slots[i];
    const iw = item.img.naturalWidth || item.img.width;
    const ih = item.img.naturalHeight || item.img.height;
    const targetH = h * slot.scale * (0.9 + rng() * 0.2);
    const targetW = targetH * (iw / Math.max(1, ih));
    const cx = w * (slot.x + (rng() - 0.5) * 0.06);
    const cy = h * (slot.y + (rng() - 0.5) * 0.04);

    // Warm ground contact shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.34)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + targetH * 0.42, targetW * 0.38, targetH * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(item.img, cx - targetW * 0.5, cy - targetH * 0.5, targetW, targetH);
  }
}

function drawStainedGlassMasterpiece(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spec: JigsawStageArtworkSpec,
  assets: JigsawArtAssetProvider | undefined,
  rng: () => number
): void {
  const house = HOUSE_PALETTES[spec.houseThemeIdx];
  const jewels = [
    house.primary,
    house.secondary === '#292524' ? '#f59e0b' : house.secondary,
    '#dc2626',
    '#059669',
    '#2563eb',
    '#eab308',
    '#9333ea',
    '#06b6d4',
    '#f97316',
  ];

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Stained glass mosaic grid with diagonal facets so every piece has distinct jewel colors + lead lines
  const cols = 16;
  const rows = 12;
  const cw = w / cols;
  const ch = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw;
      const y = r * ch;
      const c1 = jewels[(r * 3 + c * 5 + spec.stage) % jewels.length];
      const c2 = jewels[(r * 7 + c * 2 + spec.stage + 3) % jewels.length];

      ctx.fillStyle = c1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cw, y);
      ctx.lineTo(x, y + ch);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.moveTo(x + cw, y);
      ctx.lineTo(x + cw, y + ch);
      ctx.lineTo(x, y + ch);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#1e1b24';
      ctx.lineWidth = Math.max(2, Math.min(cw, ch) * 0.06);
      ctx.strokeRect(x, y, cw, ch);
    }
  }

  // Central Cathedral Rose Window
  const cx = w * 0.5;
  const cy = h * 0.5;
  const maxR = Math.min(w, h) * 0.42;
  const petals = 12 + (spec.stage % 5) * 2;
  for (let ring = 3; ring >= 1; ring--) {
    const rr = (maxR * ring) / 3;
    for (let p = 0; p < petals; p++) {
      const a0 = (p * Math.PI * 2) / petals + ring * 0.12;
      const a1 = ((p + 1) * Math.PI * 2) / petals + ring * 0.12;
      ctx.fillStyle = jewels[(p + ring * 2 + spec.stage) % jewels.length];
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rr, a0, a1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = Math.max(2.5, maxR * 0.018);
      ctx.stroke();
    }
  }

  // Golden Deathly Hallows / Crest geometric centerpiece
  ctx.save();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = Math.max(4, maxR * 0.035);
  const triR = maxR * 0.34;
  ctx.beginPath();
  ctx.moveTo(cx, cy - triR);
  ctx.lineTo(cx + triR * 0.88, cy + triR * 0.72);
  ctx.lineTo(cx - triR * 0.88, cy + triR * 0.72);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy + triR * 0.16, triR * 0.48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy - triR);
  ctx.lineTo(cx, cy + triR * 0.72);
  ctx.stroke();
  ctx.restore();

  drawDioramaSprites(ctx, w, h, spec, assets, rng);
}

function drawPotionsApothecaryArt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spec: JigsawStageArtworkSpec,
  rng: () => number
): void {
  // Deep warm emerald-stone apothecary wall
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#132a24');
  bg.addColorStop(0.5, '#1f2937');
  bg.addColorStop(1, '#291d14');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const shelfRows = 4;
  const rowH = h / shelfRows;
  const potionColors = [
    ['#fef08a', '#eab308'], // Felix Felicis
    ['#a7f3d0', '#10b981'], // Polyjuice
    ['#fbcfe8', '#ec4899'], // Amortentia
    ['#bae6fd', '#0284c7'], // Draught of Peace
    ['#ddd6fe', '#7c3aed'], // Wolfsbane
    ['#fed7aa', '#ea580c'], // Pepperup
    ['#fecdd3', '#e11d48'], // Skele-Gro
  ];

  for (let r = 0; r < shelfRows; r++) {
    const shelfY = (r + 1) * rowH - rowH * 0.14;
    // Carved oak shelf plank
    const wood = ctx.createLinearGradient(0, shelfY, 0, shelfY + rowH * 0.12);
    wood.addColorStop(0, '#92400e');
    wood.addColorStop(1, '#451a03');
    ctx.fillStyle = wood;
    ctx.fillRect(0, shelfY, w, rowH * 0.11);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, shelfY, w - 2, rowH * 0.11);

    const bottles = 8 + (r % 2);
    const slotW = w / bottles;
    for (let b = 0; b < bottles; b++) {
      const bx = (b + 0.5) * slotW;
      const bw = slotW * (0.48 + rng() * 0.24);
      const bh = rowH * (0.45 + rng() * 0.25);
      const by = shelfY - bh * 0.5;
      const pal = potionColors[(r * 5 + b * 3 + spec.stage) % potionColors.length];
      const shape = (b + r + spec.stage) % 3;

      // Magical potion aura
      const glow = ctx.createRadialGradient(bx, by, 2, bx, by, bw * 0.95);
      glow.addColorStop(0, pal[0]);
      glow.addColorStop(0.5, `${pal[1]}66`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(bx, by, bw * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Bottle liquid & glass highlight
      const liq = ctx.createLinearGradient(bx - bw * 0.4, by - bh * 0.4, bx + bw * 0.4, by + bh * 0.5);
      liq.addColorStop(0, pal[0]);
      liq.addColorStop(1, pal[1]);
      ctx.fillStyle = liq;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.78)';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      if (shape === 0) {
        ctx.arc(bx, by + bh * 0.12, bw * 0.38, 0, Math.PI * 2);
      } else if (shape === 1) {
        ctx.moveTo(bx - bw * 0.14, by - bh * 0.28);
        ctx.lineTo(bx + bw * 0.14, by - bh * 0.28);
        ctx.lineTo(bx + bw * 0.42, by + bh * 0.45);
        ctx.lineTo(bx - bw * 0.42, by + bh * 0.45);
        ctx.closePath();
      } else {
        ctx.roundRect(bx - bw * 0.32, by - bh * 0.18, bw * 0.64, bh * 0.64, 8);
      }
      ctx.fill();
      ctx.stroke();

      // Neck + Cork + Parchment Rune Label
      ctx.fillStyle = '#b45309';
      ctx.fillRect(bx - bw * 0.11, by - bh * 0.44, bw * 0.22, bh * 0.16);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(bx - bw * 0.22, by + bh * 0.04, bw * 0.44, bh * 0.18);
    }
  }
}

function drawMarauderAstronomyArt(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spec: JigsawStageArtworkSpec,
  rng: () => number
): void {
  const isParchment = spec.stage % 2 === 0;
  const bg = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, Math.max(w, h) * 0.7);
  if (isParchment) {
    bg.addColorStop(0, '#fef3c7');
    bg.addColorStop(0.6, '#e7cba0');
    bg.addColorStop(1, '#b4834b');
  } else {
    bg.addColorStop(0, '#1e1b4b');
    bg.addColorStop(0.6, '#172554');
    bg.addColorStop(1, '#090d24');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const ink = isParchment ? '#5c2415' : '#fde68a';
  const subInk = isParchment ? 'rgba(124, 45, 18, 0.38)' : 'rgba(125, 211, 252, 0.36)';

  // Castle blueprint grid corridors
  ctx.strokeStyle = subInk;
  ctx.lineWidth = 1.6;
  const gx = 10;
  const gy = 8;
  for (let i = 1; i < gx; i++) {
    ctx.beginPath();
    ctx.moveTo((w * i) / gx, 24);
    ctx.lineTo((w * i) / gx, h - 24);
    ctx.stroke();
  }
  for (let j = 1; j < gy; j++) {
    ctx.beginPath();
    ctx.moveTo(24, (h * j) / gy);
    ctx.lineTo(w - 24, (h * j) / gy);
    ctx.stroke();
  }

  // Concentric astrolabe & zodiac rings
  const cx = w * 0.5;
  const cy = h * 0.5;
  const maxR = Math.min(w, h) * 0.42;
  ctx.strokeStyle = ink;
  for (let r = 1; r <= 4; r++) {
    ctx.lineWidth = r === 4 ? 3.5 : 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, (maxR * r) / 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  for (let spoke = 0; spoke < 16; spoke++) {
    const ang = (spoke * Math.PI * 2) / 16 + spec.stage * 0.1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(ang) * (maxR * 0.22), cy + Math.sin(ang) * (maxR * 0.22));
    ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR);
    ctx.stroke();
  }

  // Footsteps trail & constellation nodes across quadrants
  let fx = w * 0.14;
  let fy = h * (0.2 + rng() * 0.6);
  for (let step = 0; step < 26; step++) {
    fx += w * 0.028;
    fy += Math.sin(step * 0.7 + spec.stage) * (h * 0.035);
    ctx.fillStyle = step % 3 === 0 ? '#dc2626' : ink;
    ctx.beginPath();
    ctx.ellipse(
      fx,
      fy + (step % 2 === 0 ? -5 : 5),
      5.5,
      3,
      0.25,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Crimson Hogwarts Wax Seals in the 4 corners
  const corners = [
    [w * 0.1, h * 0.14],
    [w * 0.9, h * 0.14],
    [w * 0.1, h * 0.86],
    [w * 0.9, h * 0.86],
  ];
  const sealColors = ['#dc2626', '#059669', '#2563eb', '#d97706'];
  corners.forEach(([sx, sy], idx) => {
    ctx.fillStyle = sealColors[(idx + spec.houseThemeIdx) % 4];
    ctx.beginPath();
    ctx.arc(sx, sy, Math.min(w, h) * 0.055, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2.4;
    ctx.stroke();
  });
}

/**
 * Vẽ hoàn chỉnh bức tranh Harry Potter của màn `stage` (`1..777`) lên `ctx` ở kích thước `(w, h)`.
 * Hàm trả về `usedFallbackForPendingImage = true` nếu có ảnh sơn dầu mạng đang tải dở để UI tự re-bake khi tải xong.
 */
export function renderJigsawStagePainting(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rawStage: number,
  assets?: JigsawArtAssetProvider
): { spec: JigsawStageArtworkSpec; waitingOnExternalImage: boolean } {
  const spec = getJigsawStageArtworkSpec(rawStage);
  const rng = mulberry32(spec.stage * 104729 + 777);
  const sky = WIZARDING_SKIES[spec.skyIndex];
  const house = HOUSE_PALETTES[spec.houseThemeIdx];
  let waitingOnExternalImage = false;

  ctx.save();
  ctx.clearRect(0, 0, w, h);

  if (spec.artStyle === 'oil_masterpiece' && spec.basePainting) {
    const img = assets?.getPaintingImage(spec.basePainting.imageUrl) ?? null;
    if (img && img.complete && (img.naturalWidth || img.width) > 0) {
      drawCoverImage(ctx, img, 0, 0, w, h, 0.5, 0.5, 1);
    } else {
      waitingOnExternalImage = Boolean(spec.basePainting.imageUrl);
      drawSkyAndCelestial(ctx, w, h, sky, rng);
      drawWizardingHorizon(ctx, w, h, spec.horizonKind, sky, rng);
      drawRollingValleyAndRiver(ctx, w, h, sky, rng);
      drawDioramaSprites(ctx, w, h, spec, assets, rng);
    }
  } else if (spec.artStyle === 'castle_window' && spec.basePainting) {
    const img = assets?.getPaintingImage(spec.basePainting.imageUrl) ?? null;
    const panU = 0.2 + ((spec.stage * 17) % 61) / 100;
    const panV = 0.2 + ((spec.stage * 29) % 61) / 100;
    if (img && img.complete && (img.naturalWidth || img.width) > 0) {
      drawCoverImage(ctx, img, 0, 0, w, h, panU, panV, 1.12);
    } else {
      waitingOnExternalImage = Boolean(spec.basePainting.imageUrl);
      drawSkyAndCelestial(ctx, w, h, sky, rng);
      drawWizardingHorizon(ctx, w, h, spec.horizonKind, sky, rng);
      drawRollingValleyAndRiver(ctx, w, h, sky, rng);
    }
    // Ornate Gothic Castle Archway & Stained Glass Spandrels framing the view
    ctx.save();
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = Math.max(12, w * 0.032);
    ctx.strokeRect(0, 0, w, h);
    ctx.strokeStyle = house.secondary === '#292524' ? house.primary : house.secondary;
    ctx.lineWidth = Math.max(4, w * 0.008);
    ctx.beginPath();
    ctx.moveTo(w * 0.04, h * 0.96);
    ctx.lineTo(w * 0.04, h * 0.28);
    ctx.quadraticCurveTo(w * 0.5, -h * 0.08, w * 0.96, h * 0.28);
    ctx.lineTo(w * 0.96, h * 0.96);
    ctx.stroke();
    ctx.restore();
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
    drawWeatherMotifParticles(ctx, w, h, spec.weatherMotif, rng);
  } else if (spec.artStyle === 'stained_glass') {
    drawStainedGlassMasterpiece(ctx, w, h, spec, assets, rng);
  } else if (spec.artStyle === 'potions_apothecary') {
    drawPotionsApothecaryArt(ctx, w, h, spec, rng);
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
    drawWeatherMotifParticles(ctx, w, h, 'starlight', rng);
  } else if (spec.artStyle === 'marauder_astronomy') {
    drawMarauderAstronomyArt(ctx, w, h, spec, rng);
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
  } else if (spec.artStyle === 'quidditch_skies') {
    drawSkyAndCelestial(ctx, w, h, sky, rng);
    drawWizardingHorizon(ctx, w, h, 'quidditch', sky, rng);
    drawRollingValleyAndRiver(ctx, w, h, sky, rng);
    // Golden Snitch & broomstick contrails
    ctx.strokeStyle = house.glow;
    ctx.lineWidth = Math.max(3, h * 0.007);
    ctx.beginPath();
    ctx.moveTo(w * 0.08, h * 0.62);
    ctx.bezierCurveTo(w * 0.35, h * 0.14, w * 0.66, h * 0.72, w * 0.88, h * 0.26);
    ctx.stroke();
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
    drawWeatherMotifParticles(ctx, w, h, spec.weatherMotif, rng);
  } else if (spec.artStyle === 'patronus_forest') {
    drawSkyAndCelestial(ctx, w, h, WIZARDING_SKIES[4], rng);
    drawWizardingHorizon(ctx, w, h, 'hogwarts', WIZARDING_SKIES[4], rng);
    drawRollingValleyAndRiver(ctx, w, h, WIZARDING_SKIES[4], rng);
    // Swirling Expecto Patronum silver-cyan ribbons
    for (let ring = 0; ring < 5; ring++) {
      ctx.strokeStyle = `rgba(186, 230, 253, ${0.58 - ring * 0.09})`;
      ctx.lineWidth = Math.max(2, (5 - ring) * 2.4);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.52, Math.min(w, h) * (0.09 + ring * 0.065), ring * 0.5, ring * 0.5 + Math.PI * 1.45);
      ctx.stroke();
    }
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
    drawWeatherMotifParticles(ctx, w, h, 'fireflies', rng);
  } else {
    // diorama_capture ("Chụp Cảnh Thế Giới Phù Thủy")
    drawSkyAndCelestial(ctx, w, h, sky, rng);
    drawWizardingHorizon(ctx, w, h, spec.horizonKind, sky, rng);
    drawRollingValleyAndRiver(ctx, w, h, sky, rng);
    drawDioramaSprites(ctx, w, h, spec, assets, rng);
    drawWeatherMotifParticles(ctx, w, h, spec.weatherMotif, rng);
  }

  // Subtle gilded inner collector border so edge pieces have crisp recognizable trim!
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)';
  ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.006);
  ctx.strokeRect(ctx.lineWidth, ctx.lineWidth, w - ctx.lineWidth * 2, h - ctx.lineWidth * 2);

  ctx.restore();
  return { spec, waitingOnExternalImage };
}

export { isArcadeSubModeLocked };
