import {
  CURATED_QUIZ_BANK,
  CURRICULUM_CHAPTERS,
  CuratedQuizItem,
  QUIZ_LANGUAGES,
  QUIZ_LEXICON_BANK,
  QuizLexiconEntry,
  QuizTopicId,
  QuizVocabNote,
} from '../data/languageQuizBank';
import {
  BuildReductionResult,
  LanguageProfileState,
  LanguageQuizState,
  LeaderboardRankChange,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
} from '../types/game';

export interface QuizMatchPairCard {
  pairId: string;
  word: string;
  phonetic: string;
  meaningVi: string;
  spriteSrc?: string;
  shortVi?: string;
}

export type QuizVisualGameKind =
  | 'pic_flashcard'
  | 'word_flashcard'
  | 'bubble_pop'
  | 'word_tiles'
  | 'pic_pairs'
  | 'audio_listening';

export interface QuizStreakMilestoneDef {
  days: 3 | 7 | 14 | 30;
  labelVi: string;
  rewardSickle: number;
  rewardSand?: number;
  rewardCompost?: number;
  rewardStars?: number;
}

export const QUIZ_STREAK_MILESTONES: readonly QuizStreakMilestoneDef[] = [
  { days: 3, labelVi: 'Chuỗi 3 Ngày Chăm Chỉ', rewardSickle: 45, rewardCompost: 1 },
  { days: 7, labelVi: 'Chuỗi 7 Ngày Thông Thái', rewardSickle: 95, rewardSand: 1 },
  { days: 14, labelVi: 'Chuỗi 14 Ngày Học Giả', rewardSickle: 145, rewardSand: 2 },
  { days: 30, labelVi: 'Chuỗi 30 Ngày Đại Pháp Sư', rewardSickle: 190, rewardStars: 1 },
];

export const DAILY_QUIZ_STREAK_TARGET_ANSWERS = 3;

export function formatQuizDayKey(nowMs = Date.now()): string {
  const d = new Date(nowMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isYesterdayDayKey(prevKey: string | undefined, todayKey: string): boolean {
  if (!prevKey || !/^\d{4}-\d{2}-\d{2}$/.test(prevKey) || !/^\d{4}-\d{2}-\d{2}$/.test(todayKey)) {
    return false;
  }
  const [py, pm, pd] = prevKey.split('-').map(Number);
  const [ty, tm, td] = todayKey.split('-').map(Number);
  const prevUtc = Date.UTC(py, pm - 1, pd);
  const todayUtc = Date.UTC(ty, tm - 1, td);
  return Math.round((todayUtc - prevUtc) / 86_400_000) === 1;
}

export interface ActiveQuizChallenge {
  qId: string;
  lang: QuizLanguageId;
  tier: QuizProficiencyTier;
  levelBand: number; // 1..10 -> Level 1..100
  chapterTitleVi: string;
  format: QuizFormatKind;
  visualGameKind?: QuizVisualGameKind;
  isReview: boolean;
  srsBox?: number; // 1..5 Leitner box if tracked in SRS
  promptVi: string;
  stemText: string;
  stemPhonetic?: string;
  ttsPromptText: string;
  // Hero visual card metadata
  heroSpriteSrc?: string;
  heroWord?: string;
  heroPhonetic?: string;
  heroShortVi?: string;
  // Multiple-choice payload (vocab_context, grammar_cloze, dialogue_reply)
  choices?: string[];
  choicePhonetics?: string[];
  choiceSprites?: string[];
  choiceSubtitles?: string[];
  correctIndex?: number;
  // Sentence / Word tiles builder payload (sentence_builder)
  shuffledTokens?: Array<{ idx: number; text: string }>;
  expectedSentenceTokens?: string[];
  // Match pairs payload (match_pairs)
  leftCards?: QuizMatchPairCard[];
  rightCards?: QuizMatchPairCard[];
  // Post-answer Vietnamese learning card
  fullSentence: string;
  fullPhonetic: string;
  translationVi: string;
  grammarTitleVi: string;
  grammarExplainVi: string;
  vocabNotes: QuizVocabNote[];
}

export interface QuizAttemptOutcome {
  correct: boolean;
  seedsAwarded: number;
  xpAwarded: number;
  newStreak: number;
  newMasteryScore: number;
  tierAutoPromoted?: QuizProficiencyTier;
  wasReviewCleared: boolean;
  /** HPVN: correct answer past the daily reward cap (practice, nothing awarded) */
  practice?: boolean;
  capReached?: boolean;
  newSrsBox?: number;
  phoenixTalismanAwarded?: number;
  talismanProgress?: number;
  buildReduction?: BuildReductionResult;
  leaderboardRankUp?: LeaderboardRankChange;
}

const MAX_RECENT_QUIZ_IDS = 400;
const RECENT_CONCEPT_COOLDOWN = 35;

const LEITNER_INTERVALS: Record<number, number> = {
  1: 2,
  2: 30,
  3: 65,
  4: 110,
  5: 200,
};

export function getProfileSrsSummary(profile: LanguageProfileState): {
  learningCount: number;
  dueCount: number;
  masteredCount: number;
} {
  const boxes = profile.srsBoxes ?? {};
  let learningCount = 0;
  let dueCount = 0;
  let masteredCount = 0;
  for (const entry of Object.values(boxes)) {
    if (entry.box >= 5) masteredCount += 1;
    else learningCount += 1;
    if (entry.dueAtTurn <= profile.totalAnswered && entry.box < 5) {
      dueCount += 1;
    }
  }
  // Also count legacy reviewQueue items not yet in srsBoxes
  for (const r of profile.reviewQueue) {
    if (!boxes[r.qId]) {
      learningCount += 1;
      if (r.dueAtTurn <= profile.totalAnswered) dueCount += 1;
    }
  }
  return { learningCount, dueCount, masteredCount };
}

const ALL_LANGS: QuizLanguageId[] = ['en', 'ko', 'zh', 'es', 'ja'];
const ROTATING_FORMATS: QuizFormatKind[] = [
  'grammar_cloze',
  'vocab_context',
  'dialogue_reply',
  'match_pairs',
  'sentence_builder',
];

export function defaultMasteryForTier(tier: QuizProficiencyTier): number {
  if (tier === 'beginner') return 15;
  if (tier === 'intermediate') return 48;
  return 80;
}

export function createDefaultLanguageProfile(
  tier: QuizProficiencyTier = 'beginner'
): LanguageProfileState {
  return {
    tier,
    masteryScore: defaultMasteryForTier(tier),
    streak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    seedsEarned: 0,
    recentIds: [],
    reviewQueue: [],
    srsBoxes: {},
  };
}

export function createInitialLanguageQuizState(): LanguageQuizState {
  return {
    activeLang: 'en',
    autoSpeak: true,
    preferredFormat: 'all',
    preferredTopic: 'all',
    dailyStreakCount: 0,
    bestDailyStreakCount: 0,
    todayAnsweredCount: 0,
    claimedStreakMilestones: [],
    profiles: {
      en: createDefaultLanguageProfile('beginner'),
      ko: createDefaultLanguageProfile('beginner'),
      zh: createDefaultLanguageProfile('beginner'),
      es: createDefaultLanguageProfile('beginner'),
      ja: createDefaultLanguageProfile('beginner'),
    },
  };
}

export function sanitizeLanguageQuizState(
  raw: Partial<LanguageQuizState> | undefined
): LanguageQuizState {
  const base = createInitialLanguageQuizState();
  if (!raw || typeof raw !== 'object') return base;

  const activeLang: QuizLanguageId = ALL_LANGS.includes(raw.activeLang as QuizLanguageId)
    ? (raw.activeLang as QuizLanguageId)
    : 'en';

  const validFormats: Array<'all' | QuizFormatKind> = [
    'all',
    'vocab_context',
    'grammar_cloze',
    'dialogue_reply',
    'sentence_builder',
    'match_pairs',
    'listening_comprehension',
  ];
  const preferredFormat = validFormats.includes(raw.preferredFormat as 'all' | QuizFormatKind)
    ? (raw.preferredFormat as 'all' | QuizFormatKind)
    : 'all';

  const validTopics: Array<NonNullable<LanguageQuizState['preferredTopic']>> = [
    'all',
    'farm',
    'daily',
    'travel',
    'study_tech',
    'health_hobby',
    'magic',
  ];
  const preferredTopic = validTopics.includes(
    raw.preferredTopic as NonNullable<LanguageQuizState['preferredTopic']>
  )
    ? (raw.preferredTopic as NonNullable<LanguageQuizState['preferredTopic']>)
    : 'all';

  const profiles = { ...base.profiles };
  for (const lang of ALL_LANGS) {
    const p = raw.profiles?.[lang];
    if (!p || typeof p !== 'object') continue;
    const tier: QuizProficiencyTier =
      p.tier === 'beginner' || p.tier === 'intermediate' || p.tier === 'advanced'
        ? p.tier
        : 'beginner';
    profiles[lang] = {
      tier,
      masteryScore: Math.max(1, Math.min(100, Math.round(Number(p.masteryScore) || defaultMasteryForTier(tier)))),
      streak: Math.max(0, Math.round(Number(p.streak) || 0)),
      bestStreak: Math.max(0, Math.round(Number(p.bestStreak) || 0)),
      totalAnswered: Math.max(0, Math.round(Number(p.totalAnswered) || 0)),
      totalCorrect: Math.max(0, Math.round(Number(p.totalCorrect) || 0)),
      seedsEarned: Math.max(0, Math.round(Number(p.seedsEarned) || 0)),
      recentIds: Array.isArray(p.recentIds)
        ? p.recentIds.slice(-MAX_RECENT_QUIZ_IDS).map(String)
        : [],
      reviewQueue: Array.isArray(p.reviewQueue)
        ? p.reviewQueue
            .filter((r) => r && typeof r.qId === 'string')
            .slice(0, 30)
            .map((r) => ({
              qId: String(r.qId),
              dueAtTurn: Math.max(0, Math.round(Number(r.dueAtTurn) || 0)),
              misses: Math.max(1, Math.round(Number(r.misses) || 1)),
              box: r.box ? Math.max(1, Math.min(5, Math.round(Number(r.box)))) : 1,
            }))
        : [],
      srsBoxes:
        p.srsBoxes && typeof p.srsBoxes === 'object'
          ? Object.fromEntries(
              Object.entries(p.srsBoxes)
                .slice(0, 2500)
                .map(([k, v]) => [
                  String(k),
                  {
                    box: Math.max(1, Math.min(5, Math.round(Number(v?.box) || 1))),
                    dueAtTurn: Math.max(0, Math.round(Number(v?.dueAtTurn) || 0)),
                    lapses: Math.max(0, Math.round(Number(v?.lapses) || 0)),
                  },
                ])
            )
          : {},
    };
  }

  return {
    activeLang,
    autoSpeak: raw.autoSpeak !== false,
    preferredFormat,
    preferredTopic,
    dailyStreakCount: Math.max(0, Math.round(Number(raw.dailyStreakCount) || 0)),
    bestDailyStreakCount: Math.max(0, Math.round(Number(raw.bestDailyStreakCount) || 0)),
    lastStudyDayKey: typeof raw.lastStudyDayKey === 'string' ? raw.lastStudyDayKey.slice(0, 12) : undefined,
    todayAnsweredCount: Math.max(0, Math.round(Number(raw.todayAnsweredCount) || 0)),
    todayStudyDayKey: typeof raw.todayStudyDayKey === 'string' ? raw.todayStudyDayKey.slice(0, 12) : undefined,
    claimedStreakMilestones: Array.isArray(raw.claimedStreakMilestones)
      ? raw.claimedStreakMilestones
          .filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
          .map((n) => Math.round(n))
          .slice(0, 12)
      : [],
    profiles,
  };
}

export function setProfileTier(
  state: LanguageQuizState,
  lang: QuizLanguageId,
  tier: QuizProficiencyTier
): void {
  const prof = state.profiles[lang];
  prof.tier = tier;
  if (tier === 'beginner' && prof.masteryScore > 35) {
    prof.masteryScore = 18;
  } else if (tier === 'intermediate' && (prof.masteryScore < 31 || prof.masteryScore > 72)) {
    prof.masteryScore = 50;
  } else if (tier === 'advanced' && prof.masteryScore < 71) {
    prof.masteryScore = 82;
  }
}

function shuffleArray<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getChapterTitle(band: number): string {
  const clamped = Math.max(1, Math.min(10, band));
  return (
    CURRICULUM_CHAPTERS.find((c) => c.band === clamped)?.titleVi ??
    `Chương ${clamped} (Cấp ${(clamped - 1) * 10 + 1}–${clamped * 10})`
  );
}

const VISUAL_SPRITE_RULES: Array<{ pattern: RegExp; sprite: string }> = [
  { pattern: /táo|apple|ringo|사과|苹果|manzana/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_burrow_apple.webp' },
  { pattern: /dâu|strawberry|fresa|苺|いちご|딸기|草莓/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_ruby_strawberry.webp' },
  { pattern: /bí ngô|pumpkin|kabocha|calabaza|南瓜|호박/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_garden_pumpkin.webp' },
  { pattern: /cà rốt|carrot|húluóbo|胡萝卜|당근|zanahoria/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_honey_carrot.webp' },
  { pattern: /khoai tây|potato|감자|patata|土豆/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_burrow_potato.webp' },
  { pattern: /lúa mì|wheat|trigo|밀|小麦|こむぎ/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_ottery_wheat.webp' },
  { pattern: /bắp cải|cabbage|배추|col/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_crisp_cabbage.webp' },
  { pattern: /bắp|ngô|corn|maíz|옥수수|玉米/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_golden_corn.webp' },
  { pattern: /cà chua|tomato|토마토|tomate|番茄/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_ruby_tomato.webp' },
  { pattern: /việt quất|blueberry|quả mọng|berry/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_dew_blueberry.webp' },
  { pattern: /súp|canh|soup|スープ/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_mushroom_soup.webp' },
  { pattern: /nấm|mushroom|버섯|蘑菇|seta/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_glow_mushroom.webp' },
  { pattern: /mandrake|nhân sâm/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_baby_mandrake.webp' },
  { pattern: /oải hương|lavender|라벤더|ラベンダー|lavanda|hương thơm|thơm|aroma|fragrant|향기|香味|香り/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_dried_lavender.webp' },
  { pattern: /hoa hồng|rose|장미|バラ|rosa/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_english_rose.webp' },
  { pattern: /hướng dương|sunflower|mặt trời|bình minh|sunrise|nắng|sunlit|해바라기|태양|일출/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_hedge_sunflower.webp' },
  { pattern: /tulip|uất kim hương/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_rainbow_tulip.webp' },
  { pattern: /hoa cúc|daisy/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_meadow_daisy.webp' },
  { pattern: /chuông xanh|bluebell/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_forest_bluebell.webp' },
  { pattern: /mẫu đơn|peony/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_blush_peony.webp' },
  { pattern: /thủy tiên|daffodil/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_golden_daffodil.webp' },
  { pattern: /trăng|đêm|moon|night|달|밤|月/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_crop_moonlight_flower.webp' },
  { pattern: /lửa|phượng hoàng|phoenix|fire/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_phoenix.webp' },
  { pattern: /mật ong|honey|miel|꿀|蜂蜜|はちみつ/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_honey_jar.webp' },
  { pattern: /bột mì|flour|harina|밀가루|面粉|小麦粉/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_flour_sack.webp' },
  { pattern: /bánh|nướng|bread|pie|bake|빵|面包|pan|パイ/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_pie_ready.webp' },
  { pattern: /trứng|giỏ|egg|basket|cesta|달걀|바구니|卵|篮/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_egg_basket.webp' },
  { pattern: /hạt giống|gieo|seed|semilla|sembrar|씨앗|种子|種|たね|nảy mầm|brotar/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp' },
  { pattern: /nước|tưới|mưa|sương|water|rain|dew|じょうろ|물|水|agua/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp' },
  { pattern: /thu hoạch|gặt|mùa|bội thu|harvest|수확|풍년|收获|収穫|豊穣|bountiful|abundancia/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp' },
  { pattern: /cầu|bridge|puente|다리|桥/i, sprite: '/game/trang-trai-hang-soc/sprites/hogsmeade_stone_bridge.webp' },
  { pattern: /thuyền|sông|hồ|boat|river|lake|강|河|río/i, sprite: '/game/trang-trai-hang-soc/sprites/vehicle_lake_boat.webp' },
  { pattern: /gà|chicken|hen|닭/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_hen.webp' },
  { pattern: /cừu|len|sheep|wool|양/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_sheep.webp' },
  { pattern: /bò|sữa|cow|milk|소|우유/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_cow.webp' },
  { pattern: /cú|thư|bưu điện|owl|letter|mail|手紙|편지/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp' },
  { pattern: /rồng|dragon/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_dragon.webp' },
  { pattern: /kỳ lân|unicorn/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_unicorn.webp' },
  { pattern: /bằng mã|hippogriff|ngựa/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_hippogriff.webp' },
  { pattern: /kho báu|vàng|niffler|gold/i, sprite: '/game/trang-trai-hang-soc/sprites/beast_niffler.webp' },
  { pattern: /trà|bia bơ|butterbeer|tea|차|茶|té/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_butterbeer.webp' },
  { pattern: /rượu táo|cider|mứt|jam|lọ|preserve/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_cider.webp' },
  { pattern: /thảo dược|dược|thuốc|herb|potion|薬草|약초|hierba/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_herb_elixir.webp' },
  { pattern: /áo|đan|chụp tai|wear|sweater|earmuff/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_sweater_ready.webp' },
  { pattern: /tuyết|đông|lạnh|băng|snow|winter|frost|helar|invierno|겨울|冬/i, sprite: '/game/trang-trai-hang-soc/sprites/snowy_pines.webp' },
  { pattern: /cây|rừng|thông|tree|pine|forest|orchard|vườn cây|果樹園|果树/i, sprite: '/game/trang-trai-hang-soc/sprites/burrow_apple_orchard.webp' },
  { pattern: /nhà kính|greenhouse|invernadero|온실/i, sprite: '/game/trang-trai-hang-soc/sprites/burrow_greenhouse_canon.webp' },
  { pattern: /cối xay|gió|breeze|wind|바람|风/i, sprite: '/game/trang-trai-hang-soc/sprites/burrow_windmill_canon.webp' },
  { pattern: /kho|bảo quản|cất trữ|barn|store|보관|储存/i, sprite: '/game/trang-trai-hang-soc/sprites/burrow_house_canon.webp' },
  { pattern: /ruộng|đất|soil|earth|fertile|fértil|비옥|肥沃|畑|cày/i, sprite: '/game/trang-trai-hang-soc/sprites/crop_plot_sprouts.webp' },
  { pattern: /hoa|vườn|flower|garden|花|꽃|jardín/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_rose_bouquet.webp' },
  { pattern: /sửa|rào|công cụ|repair|fence|dụng cụ|hammer|đũa phép|thần chú|phép thuật|bùa|wand|spell|magic|sorcery|incantation|charm|마법|지팡이|주문|魔法|魔杖|咒语|杖|呪文|varita|hechizo|magia/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.webp' },
  { pattern: /chổi bay|quidditch|thể thao|chạy|bơi|marathon|tập luyện|stamina|swim|broom|빗자루|수영|마라톤|扫帚|游泳|马拉松|ほうき|水泳|escoba|natación|maratón/i, sprite: '/game/trang-trai-hang-soc/sprites/burrow_broomsticks_canon.webp' },
  { pattern: /bản đồ|sân bay|du lịch|đường|thành phố|tàu điện|giao thông|ngã tư|map|airport|subway|itinerary|travel|intersection|지도|공항|지하철|여행|地图|机场|地铁|旅行|地図|空港|地下鉄|mapa|aeropuerto|metro|viaje/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_world_map.webp' },
  { pattern: /hộ chiếu|hành lý|vali|khách sạn|đặt phòng|vé|passport|luggage|hotel|ticket|reservation|여권|짐|호텔|티켓|예약|护照|行李|酒店|机票|パスポート|荷物|ホテル|切符|pasaporte|equipaje|hotel|billete/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_suitcase.webp' },
  { pattern: /máy tính|bàn phím|mật khẩu|công nghệ|mạng|thuật toán|mã hóa|tự động|ứng dụng|thông báo|keyboard|password|algorithm|encryption|application|notification|innovation|automation|키보드|비밀번호|알고리즘|혁신|键盘|密码|算法|创新|キーボード|パスワード|技術|teclado|contraseña|algoritmo|innovación/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_muggle_plug.webp' },
  { pattern: /sách|thư viện|vở|bài tập|học bổng|tiên tri|học viện|sách phép|bài thuyết trình|book|library|notebook|homework|scholarship|prophecy|spellbook|presentation|도서관|공책|숙제|장학금|예언|图书馆|笔记本|作业|奖学金|预言|図書館|ノート|宿題|予言|biblioteca|cuaderno|beca|profecía/i, sprite: '/game/trang-trai-hang-soc/sprites/m3_piece_scroll.webp' },
  { pattern: /bệnh viện|bác sĩ|sốt|đơn thuốc|miễn dịch|dinh dưỡng|phục hồi|thiền|hospital|fever|medicine|prescription|nutrition|immunity|meditation|rehabilitation|병원|열|약|처방|영양|면역|医院|发烧|药|处方|营养|免疫|病院|熱|薬|処方|栄養|hospital|fiebre|medicina|receta|nutrición/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_herb_elixir.webp' },
  { pattern: /âm nhạc|giai điệu|đàn|buổi hòa nhạc|vũ đạo|music|guitar|concert|melody|choreography|기타|콘서트|멜로디|吉他|音乐会|旋律|ギター|コンサート|旋律|guitarra|concierto|melodía/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_pasture_bell.webp' },
  { pattern: /máy ảnh|phim|đạo diễn|triển lãm|kiệt tác|camera|director|exhibition|masterpiece|카메라|감독|전시회|걸작|相机|导演|展览|杰作|カメラ|監督|展覧会|傑作|cámara|director|exposición|obra maestra/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp' },
  { pattern: /cà phê|thực đơn|nhà hàng|đặt bàn|menu|coffee|restaurant|메뉴|식당|菜单|餐厅|メニュー|レストラン|menú|restaurante/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_vn_egg_coffee.webp' },
  { pattern: /hóa đơn|giảm giá|quà lưu niệm|tiền tệ|mua sắm|receipt|discount|souvenir|currency|영수증|할인|기념품|환율|收据|折扣|纪念品|货币|レシート|割引|お土産|recibo|descuento|recuerdo|moneda/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_shop.webp' },
  { pattern: /bạn bè|nụ cười|ôm|sinh nhật|đồng nghiệp|họp|cảm thông|hòa giải|hiệu trưởng|friend|smile|hug|birthday|colleague|meeting|empathy|reconcile|headmaster|친구|미소|생일|동료|회의|공감|교장|朋友|微笑|生日|同事|会议|共情|校長|友達|笑顔|誕生日|同僚|会議|amigo|sonrisa|cumpleaños|colega|reunión/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_staff.webp' },
  { pattern: /lâu đài|ký túc xá|hogwarts|castle|dormitory|성|기숙사|城堡|宿舍|城|寮|castillo|dormitorio/i, sprite: '/game/trang-trai-hang-soc/sprites/crest-gryffindor.webp' },
  { pattern: /biến hình|độn thổ|bay lơ lửng|thần hộ mệnh|đấu tay đôi|transfiguration|apparate|levitation|patronus|duel|변신|결투|수호령|变形|决斗|守护神|変身|決闘|守護霊|transformación|duelo|patrono/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_accio.webp' },
  { pattern: /bùa hộ mệnh|giả kim|nhãn thông|amulet|alchemy|clairvoyance|부적|연금술|护身符|炼金术|お守り|錬金術|amuleto|alquimia/i, sprite: '/game/trang-trai-hang-soc/sprites/m3_gem_amethyst.webp' },
  { pattern: /áo choàng|cloak|망토|斗篷|マント|capa/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_sweater_ready.webp' },
  { pattern: /tin nhắn|phản hồi|hạn chót|message|feedback|deadline|메시지|피드백|마감|消息|反馈|截止|メッセージ|締切|mensaje|plazo/i, sprite: '/game/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp' },
];

const FALLBACK_VISUAL_SPRITES: readonly string[] = [
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_burrow_apple.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_ruby_strawberry.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_garden_pumpkin.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_honey_carrot.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_ottery_wheat.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_golden_corn.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_dew_blueberry.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_glow_mushroom.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_dried_lavender.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_english_rose.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_hedge_sunflower.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_crop_rainbow_tulip.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_honey_jar.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_pie_ready.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_flour_sack.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_egg_basket.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp',
  '/game/trang-trai-hang-soc/sprites/beast_hen.webp',
  '/game/trang-trai-hang-soc/sprites/beast_sheep.webp',
  '/game/trang-trai-hang-soc/sprites/beast_cow.webp',
  '/game/trang-trai-hang-soc/sprites/beast_puffskein.webp',
  '/game/trang-trai-hang-soc/sprites/beast_phoenix.webp',
  '/game/trang-trai-hang-soc/sprites/beast_unicorn.webp',
  '/game/trang-trai-hang-soc/sprites/beast_niffler.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_butterbeer.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_cider.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_herb_elixir.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_mushroom_soup.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_sweater_ready.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_rose_bouquet.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_tulip_bluebell.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_magic_blossom.webp',
  '/game/trang-trai-hang-soc/sprites/ui_icon_frog_choc.webp',
];

export function formatShortKidMeaningVi(rawVi: string): string {
  const noParen = rawVi.replace(/\s*\([^)]*\)/g, '').trim();
  const firstSegment = noParen.split(/[,;/•—–]/)[0]?.trim() || noParen;
  if (!firstSegment) return 'Từ phép thuật';
  return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
}

export function getQuizVisualCardMeta(
  meaningVi: string,
  word: string,
  idSeed: string,
  avoidSprites?: Set<string>
): { spriteSrc: string; shortVi: string } {
  const combined = `${meaningVi} ${word} ${idSeed}`;
  let matchedSprite = '';
  for (const rule of VISUAL_SPRITE_RULES) {
    if (rule.pattern.test(combined)) {
      if (!avoidSprites || !avoidSprites.has(rule.sprite)) {
        matchedSprite = rule.sprite;
        break;
      }
      if (!matchedSprite) {
        matchedSprite = rule.sprite;
      }
    }
  }

  if (!matchedSprite || (avoidSprites && avoidSprites.has(matchedSprite))) {
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
    }
    for (let offset = 0; offset < FALLBACK_VISUAL_SPRITES.length; offset++) {
      const candidate = FALLBACK_VISUAL_SPRITES[(hash + offset) % FALLBACK_VISUAL_SPRITES.length];
      if (!avoidSprites || !avoidSprites.has(candidate)) {
        matchedSprite = candidate;
        break;
      }
    }
    if (!matchedSprite) {
      matchedSprite = FALLBACK_VISUAL_SPRITES[hash % FALLBACK_VISUAL_SPRITES.length];
    }
  }

  if (avoidSprites) {
    avoidSprites.add(matchedSprite);
  }
  return {
    spriteSrc: matchedSprite,
    shortVi: formatShortKidMeaningVi(meaningVi),
  };
}

export function cleanForeignWordDisplay(rawWord: string): string {
  return rawWord.trim();
}

export function splitWordIntoKidTiles(rawWord: string, lang: QuizLanguageId): string[] {
  // For Japanese with furigana like "林檎 (りんご)", prefer the kana inside parentheses or the main word
  const kanaMatch = lang === 'ja' ? rawWord.match(/\(([ぁ-んァ-ンー]+)\)/) : null;
  let core = kanaMatch
    ? kanaMatch[1]
    : rawWord
        .replace(/\s*\([^)]*\)/g, '')
        .replace(/^(el|la|los|las|un|una)\s+/i, '')
        .trim();

  if (!core) core = rawWord.trim();

  // If multi-word phrase (e.g. "every morning" or "bear fruit"), split by spaces or into syllable chunks
  if (core.includes(' ')) {
    const parts = core.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts.length <= 7) {
      return parts;
    }
  }

  const chars = Array.from(core);
  if (chars.length <= 1) {
    return chars.length === 1 ? [chars[0]] : [];
  }
  if (chars.length <= 6) {
    return chars;
  }
  // Group longer words into 4..5 friendly syllable-sized chunks (2-3 chars each) so kids don't tap 12 tiny letters
  const chunks: string[] = [];
  const step = Math.ceil(chars.length / 5);
  for (let i = 0; i < chars.length; i += step) {
    chunks.push(chars.slice(i, i + step).join(''));
  }
  return chunks.length >= 2 ? chunks : [chars[0], chars.slice(1).join('')];
}

function getDistractorLexiconEntries(
  lang: QuizLanguageId,
  excludeWord: string,
  excludeMeaningVi: string,
  levelBand: number,
  count = 3,
  excludeId?: string,
  preferPosVi?: string,
  preferTopic?: QuizTopicId
): QuizLexiconEntry[] {
  const targetShortVi = formatShortKidMeaningVi(excludeMeaningVi).toLowerCase();
  const targetWordLower = excludeWord.trim().toLowerCase();
  const targetLen = excludeWord.trim().length;
  const sameLang = shuffleArray(
    QUIZ_LEXICON_BANK.filter(
      (e) =>
        e.lang === lang &&
        e.id !== excludeId &&
        e.word.trim().toLowerCase() !== targetWordLower
    )
  );
  const topicRank = (entry: QuizLexiconEntry): number => {
    const t: QuizTopicId = entry.topic ?? 'farm';
    if (preferTopic && preferTopic !== 'farm') {
      if (t === preferTopic) return 0;
      if (t !== 'farm') return 1;
      return 2;
    }
    if (preferTopic === 'farm') {
      return t === 'farm' ? 0 : 1;
    }
    return t !== 'farm' ? 0 : 1;
  };
  const strictPool = sameLang
    .filter((e) => formatShortKidMeaningVi(e.meaningVi).toLowerCase() !== targetShortVi)
    .sort((a, b) => {
      const topDiff = topicRank(a) - topicRank(b);
      if (topDiff !== 0) return topDiff;
      const posDiffA = preferPosVi && a.posVi === preferPosVi ? 0 : preferPosVi ? 1 : 0;
      const posDiffB = preferPosVi && b.posVi === preferPosVi ? 0 : preferPosVi ? 1 : 0;
      if (posDiffA !== posDiffB) return posDiffA - posDiffB;
      const bandDiffA = Math.abs(a.levelBand - levelBand);
      const bandDiffB = Math.abs(b.levelBand - levelBand);
      if (bandDiffA !== bandDiffB) return bandDiffA - bandDiffB;
      return Math.abs(a.word.trim().length - targetLen) - Math.abs(b.word.trim().length - targetLen);
    });

  const picked = shuffleArray(strictPool.slice(0, Math.max(count + 8, 12))).slice(0, count);
  if (picked.length < count) {
    const pickedIds = new Set(picked.map((p) => p.id));
    for (const fallback of shuffleArray(sameLang)) {
      if (!pickedIds.has(fallback.id)) {
        picked.push(fallback);
        pickedIds.add(fallback.id);
        if (picked.length >= count) break;
      }
    }
  }
  return picked;
}

export function normalizeQuizConceptKey(lang: QuizLanguageId, rawWord: string): string {
  const cleaned = rawWord
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/^(to|a|an|the|el|la|los|las|un|una)\s+/i, '')
    .trim()
    .toLowerCase();
  return `${lang}:${cleaned || rawWord.trim().toLowerCase()}`;
}

function getCuratedPrimaryWord(item: CuratedQuizItem): string {
  return item.vocabNotes[0]?.word ?? item.choices?.[item.correctIndex ?? 0] ?? item.stemText;
}

function buildFromCurated(item: CuratedQuizItem, isReview: boolean): ActiveQuizChallenge {
  // Convert curated items into kid-friendly 1-word Visual + Audio mini-games!
  const primaryNote: QuizVocabNote = item.vocabNotes[0] ?? {
    word: item.choices?.[item.correctIndex ?? 0] ?? item.stemText,
    phonetic: item.choicePhonetics?.[item.correctIndex ?? 0] ?? item.fullPhonetic,
    posVi: 'từ vựng',
    meaningVi: item.translationVi,
  };
  const usedSprites = new Set<string>();
  const heroVisual = getQuizVisualCardMeta(
    primaryNote.meaningVi,
    primaryNote.word,
    item.id,
    usedSprites
  );

  const base: ActiveQuizChallenge = {
    qId: item.id,
    lang: item.lang,
    tier: item.tier,
    levelBand: item.levelBand,
    chapterTitleVi: getChapterTitle(item.levelBand),
    format: item.format,
    isReview,
    promptVi: '🔊 Nghe và chạm đúng thẻ:',
    stemText: primaryNote.word,
    stemPhonetic: primaryNote.phonetic,
    ttsPromptText: primaryNote.word,
    heroSpriteSrc: heroVisual.spriteSrc,
    heroWord: primaryNote.word,
    heroPhonetic: primaryNote.phonetic,
    heroShortVi: heroVisual.shortVi,
    fullSentence: primaryNote.word,
    fullPhonetic: primaryNote.phonetic,
    translationVi: heroVisual.shortVi,
    grammarTitleVi: `${primaryNote.word} = ${heroVisual.shortVi}`,
    grammarExplainVi: `${item.fullSentence} (${item.translationVi})`,
    vocabNotes: item.vocabNotes.slice(0, 3),
  };

  if (item.format === 'sentence_builder') {
    base.visualGameKind = 'word_tiles';
    base.promptVi = `🧩 Nhìn tranh "${heroVisual.shortVi}" và ghép các mảnh chữ:`;
    base.stemText = heroVisual.shortVi;
    base.stemPhonetic = primaryNote.phonetic;
    const sentenceParts = Array.isArray(item.orderedTokens)
      ? item.orderedTokens.filter((tok: string) => Boolean(tok && tok.trim().length > 0))
      : [];
    const preferFullSentence =
      (item.tier !== 'beginner' || item.levelBand >= 3) &&
      sentenceParts.length >= 2 &&
      sentenceParts.length <= 7;
    let expectedTiles = preferFullSentence
      ? sentenceParts
      : splitWordIntoKidTiles(primaryNote.word, item.lang);
    if (preferFullSentence || expectedTiles.length < 2) {
      if (expectedTiles.length < 2) {
        expectedTiles =
          sentenceParts.length >= 2 && sentenceParts.length <= 7
            ? sentenceParts
            : splitWordIntoKidTiles(item.fullSentence, item.lang);
      }
      base.promptVi = `🧩 Nhìn tranh "${heroVisual.shortVi}" và ghép câu "${item.translationVi}":`;
      base.stemText = item.translationVi;
      base.stemPhonetic = item.fullPhonetic;
      base.fullSentence = item.fullSentence;
      base.fullPhonetic = item.fullPhonetic;
      base.ttsPromptText = item.fullSentence;
      base.translationVi = item.translationVi;
    }
    const indexed = expectedTiles.map((text, idx) => ({ idx, text }));
    let shuffled = shuffleArray(indexed);
    if (
      shuffled.length > 1 &&
      shuffled.every((t, i) => t.text === expectedTiles[i])
    ) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    base.shuffledTokens = shuffled;
    base.expectedSentenceTokens = expectedTiles;
    return base;
  }

  // Build 4 visual/audio choices from primaryNote + 3 lexicon distractors
  const distractors = getDistractorLexiconEntries(
    item.lang,
    primaryNote.word,
    primaryNote.meaningVi,
    item.levelBand,
    3,
    undefined,
    primaryNote.posVi,
    item.topic ?? 'farm'
  );
  const tagged = [
    {
      word: primaryNote.word,
      ph: primaryNote.phonetic,
      shortVi: heroVisual.shortVi,
      sprite: heroVisual.spriteSrc,
      isCorrect: true,
    },
    ...distractors.map((d) => {
      const vis = getQuizVisualCardMeta(d.meaningVi, d.word, d.id, usedSprites);
      return {
        word: d.word,
        ph: d.phonetic,
        shortVi: vis.shortVi,
        sprite: vis.spriteSrc,
        isCorrect: false,
      };
    }),
  ];
  const mixed = shuffleArray(tagged);
  base.choices = mixed.map((m) => m.word);
  base.choicePhonetics = mixed.map((m) => m.ph);
  base.choiceSprites = mixed.map((m) => m.sprite);
  base.choiceSubtitles = mixed.map((m) => m.shortVi);
  base.correctIndex = Math.max(0, mixed.findIndex((m) => m.isCorrect));

  if (item.format === 'dialogue_reply') {
    base.visualGameKind = 'bubble_pop';
    base.promptVi = `🫧 Chạm nổ bong bóng mang từ "${heroVisual.shortVi}":`;
    base.stemText = heroVisual.shortVi;
    base.stemPhonetic = primaryNote.phonetic;
  } else {
    base.visualGameKind = 'word_flashcard';
    base.promptVi = `🔊 Nhìn tranh "${heroVisual.shortVi}" — chọn đúng từ:`;
    base.stemText = heroVisual.shortVi;
    base.stemPhonetic = primaryNote.phonetic;
  }
  return base;
}

function buildVocabContextChallenge(
  target: QuizLexiconEntry,
  isReview: boolean
): ActiveQuizChallenge {
  const usedSprites = new Set<string>();
  const heroVisual = getQuizVisualCardMeta(target.meaningVi, target.word, target.id, usedSprites);
  const others = getDistractorLexiconEntries(
    target.lang,
    target.word,
    target.meaningVi,
    target.levelBand,
    3,
    target.id,
    undefined,
    target.topic ?? 'farm'
  );

  const tagged = [
    {
      entry: target,
      shortVi: heroVisual.shortVi,
      sprite: heroVisual.spriteSrc,
      isCorrect: true,
    },
    ...others.map((o) => {
      const vis = getQuizVisualCardMeta(o.meaningVi, o.word, o.id, usedSprites);
      return {
        entry: o,
        shortVi: vis.shortVi,
        sprite: vis.spriteSrc,
        isCorrect: false,
      };
    }),
  ];
  const mixed = shuffleArray(tagged);

  return {
    qId: `vocab:${target.id}`,
    lang: target.lang,
    tier: target.tier,
    levelBand: target.levelBand,
    chapterTitleVi: getChapterTitle(target.levelBand),
    format: 'vocab_context',
    visualGameKind: 'pic_flashcard',
    isReview,
    promptVi: `🖼️ Nghe 🔊 "${target.word}" và chạm vào bức tranh đúng:`,
    stemText: target.word,
    stemPhonetic: target.phonetic,
    ttsPromptText: target.word,
    heroSpriteSrc: heroVisual.spriteSrc,
    heroWord: target.word,
    heroPhonetic: target.phonetic,
    heroShortVi: heroVisual.shortVi,
    choices: mixed.map((m) => m.shortVi),
    choicePhonetics: mixed.map((m) => m.entry.phonetic),
    choiceSprites: mixed.map((m) => m.sprite),
    choiceSubtitles: mixed.map((m) => m.entry.word),
    correctIndex: Math.max(0, mixed.findIndex((m) => m.isCorrect)),
    fullSentence: target.word,
    fullPhonetic: target.phonetic,
    translationVi: heroVisual.shortVi,
    grammarTitleVi: `${target.word} (${target.phonetic}) = ${heroVisual.shortVi}`,
    grammarExplainVi: `${target.exampleSentence} (${target.exampleVi})`,
    vocabNotes: [
      {
        word: target.word,
        phonetic: target.phonetic,
        posVi: target.posVi,
        meaningVi: heroVisual.shortVi,
      },
      ...others.slice(0, 2).map((o) => ({
        word: o.word,
        phonetic: o.phonetic,
        posVi: o.posVi,
        meaningVi: formatShortKidMeaningVi(o.meaningVi),
      })),
    ],
  };
}

function buildListeningComprehensionChallenge(
  target: QuizLexiconEntry,
  isReview: boolean
): ActiveQuizChallenge {
  const built = buildVocabContextChallenge(target, isReview);
  return {
    ...built,
    qId: `listen:${target.id}`,
    format: 'listening_comprehension',
    visualGameKind: 'audio_listening',
    promptVi: '🔊 Lắng nghe phát âm thần chú và chạm vào nghĩa đúng:',
    stemText: '🔊 Nghe phát âm để chọn đáp án',
  };
}

function buildLexiconWordChoiceChallenge(
  target: QuizLexiconEntry,
  format: 'grammar_cloze' | 'dialogue_reply',
  isReview: boolean
): ActiveQuizChallenge {
  const usedSprites = new Set<string>();
  const heroVisual = getQuizVisualCardMeta(target.meaningVi, target.word, target.id, usedSprites);
  const distractors = getDistractorLexiconEntries(
    target.lang,
    target.word,
    target.meaningVi,
    target.levelBand,
    3,
    target.id,
    undefined,
    target.topic ?? 'farm'
  );

  const tagged = [
    {
      word: target.word,
      ph: target.phonetic,
      shortVi: heroVisual.shortVi,
      sprite: heroVisual.spriteSrc,
      isCorrect: true,
    },
    ...distractors.map((d) => {
      const vis = getQuizVisualCardMeta(d.meaningVi, d.word, d.id, usedSprites);
      return {
        word: d.word,
        ph: d.phonetic,
        shortVi: vis.shortVi,
        sprite: vis.spriteSrc,
        isCorrect: false,
      };
    }),
  ];
  const mixed = shuffleArray(tagged);
  const isBubble = format === 'dialogue_reply';

  return {
    qId: `${isBubble ? 'bubble' : 'cloze'}:${target.id}`,
    lang: target.lang,
    tier: target.tier,
    levelBand: target.levelBand,
    chapterTitleVi: getChapterTitle(target.levelBand),
    format,
    visualGameKind: isBubble ? 'bubble_pop' : 'word_flashcard',
    isReview,
    promptVi: isBubble
      ? `🫧 Chạm nổ bong bóng mang từ "${heroVisual.shortVi}":`
      : `🔊 Nhìn tranh "${heroVisual.shortVi}" — chọn đúng từ:`,
    stemText: heroVisual.shortVi,
    stemPhonetic: target.phonetic,
    ttsPromptText: target.word,
    heroSpriteSrc: heroVisual.spriteSrc,
    heroWord: target.word,
    heroPhonetic: target.phonetic,
    heroShortVi: heroVisual.shortVi,
    choices: mixed.map((m) => m.word),
    choicePhonetics: mixed.map((m) => m.ph),
    choiceSprites: mixed.map((m) => m.sprite),
    choiceSubtitles: mixed.map((m) => m.shortVi),
    correctIndex: Math.max(0, mixed.findIndex((m) => m.isCorrect)),
    fullSentence: target.word,
    fullPhonetic: target.phonetic,
    translationVi: heroVisual.shortVi,
    grammarTitleVi: `${target.word} (${target.phonetic}) = ${heroVisual.shortVi}`,
    grammarExplainVi: `${target.exampleSentence} (${target.exampleVi})`,
    vocabNotes: [
      {
        word: target.word,
        phonetic: target.phonetic,
        posVi: target.posVi,
        meaningVi: heroVisual.shortVi,
      },
      ...distractors.slice(0, 2).map((d) => ({
        word: d.word,
        phonetic: d.phonetic,
        posVi: d.posVi,
        meaningVi: formatShortKidMeaningVi(d.meaningVi),
      })),
    ],
  };
}

function buildLexiconTilesChallenge(
  target: QuizLexiconEntry,
  isReview: boolean
): ActiveQuizChallenge {
  const usedSprites = new Set<string>();
  const heroVisual = getQuizVisualCardMeta(target.meaningVi, target.word, target.id, usedSprites);

  const wordTiles = splitWordIntoKidTiles(target.word, target.lang);
  const preferSentence = target.tier !== 'beginner' || target.levelBand >= 3;
  const sentenceTiles = splitWordIntoKidTiles(target.exampleSentence, target.lang);
  let expectedTiles =
    preferSentence && sentenceTiles.length >= 2 ? sentenceTiles : wordTiles;
  const usingSentence =
    (preferSentence && sentenceTiles.length >= 2) || wordTiles.length < 2;
  let promptVi = `🧩 Nhìn tranh "${heroVisual.shortVi}" và ghép các mảnh chữ:`;
  let stemText = heroVisual.shortVi;
  let stemPhonetic = target.phonetic;
  let fullSentence = target.word;
  let fullPhonetic = target.phonetic;
  let ttsPromptText = target.word;
  let translationVi = heroVisual.shortVi;

  if (usingSentence) {
    expectedTiles = sentenceTiles.length >= 2 ? sentenceTiles : [target.word, target.exampleSentence];
    promptVi = `🧩 Nhìn tranh "${heroVisual.shortVi}" và ghép câu "${target.exampleVi}":`;
    stemText = target.exampleVi;
    stemPhonetic = target.examplePhonetic;
    fullSentence = target.exampleSentence;
    fullPhonetic = target.examplePhonetic;
    ttsPromptText = target.exampleSentence;
    translationVi = target.exampleVi;
  }

  const indexed = expectedTiles.map((text, idx) => ({ idx, text }));
  const shuffled = shuffleArray(indexed);
  if (
    shuffled.length > 1 &&
    shuffled.every((t, i) => t.text === expectedTiles[i])
  ) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }

  return {
    qId: `tiles:${target.id}`,
    lang: target.lang,
    tier: target.tier,
    levelBand: target.levelBand,
    chapterTitleVi: getChapterTitle(target.levelBand),
    format: 'sentence_builder',
    visualGameKind: 'word_tiles',
    isReview,
    promptVi,
    stemText,
    stemPhonetic,
    ttsPromptText,
    heroSpriteSrc: heroVisual.spriteSrc,
    heroWord: target.word,
    heroPhonetic: target.phonetic,
    heroShortVi: heroVisual.shortVi,
    shuffledTokens: shuffled,
    expectedSentenceTokens: expectedTiles,
    fullSentence,
    fullPhonetic,
    translationVi,
    grammarTitleVi: `${target.word} (${target.phonetic}) = ${heroVisual.shortVi}`,
    grammarExplainVi: `${target.exampleSentence} (${target.exampleVi})`,
    vocabNotes: [
      {
        word: target.word,
        phonetic: target.phonetic,
        posVi: target.posVi,
        meaningVi: heroVisual.shortVi,
      },
    ],
  };
}

function buildMatchPairsChallenge(
  anchor: QuizLexiconEntry,
  isReview: boolean
): ActiveQuizChallenge {
  const usedSprites = new Set<string>();
  const anchorVis = getQuizVisualCardMeta(anchor.meaningVi, anchor.word, anchor.id, usedSprites);
  const peerCount = anchor.levelBand >= 2 || anchor.tier !== 'beginner' ? 3 : 2;
  const peers = getDistractorLexiconEntries(
    anchor.lang,
    anchor.word,
    anchor.meaningVi,
    anchor.levelBand,
    peerCount,
    anchor.id,
    anchor.posVi,
    anchor.topic ?? 'farm'
  );

  const trio = [anchor, ...peers];
  const cards: QuizMatchPairCard[] = trio.map((e, idx) => {
    const vis =
      idx === 0
        ? anchorVis
        : getQuizVisualCardMeta(e.meaningVi, e.word, e.id, usedSprites);
    return {
      pairId: e.id,
      word: e.word,
      phonetic: e.phonetic,
      meaningVi: vis.shortVi,
      spriteSrc: vis.spriteSrc,
      shortVi: vis.shortVi,
    };
  });

  const leftCards = shuffleArray(cards);
  const rightCards = shuffleArray(cards);
  if (rightCards.length > 1 && rightCards.every((c, idx) => c.pairId === leftCards[idx].pairId)) {
    [rightCards[0], rightCards[1]] = [rightCards[1], rightCards[0]];
  }

  return {
    qId: `pairs:${anchor.id}`,
    lang: anchor.lang,
    tier: anchor.tier,
    levelBand: anchor.levelBand,
    chapterTitleVi: getChapterTitle(anchor.levelBand),
    format: 'match_pairs',
    visualGameKind: 'pic_pairs',
    isReview,
    promptVi: '🃏 Chạm 1 thẻ Từ bên trái rồi nối với Tranh 2.5D tương ứng bên phải:',
    stemText: anchor.word,
    stemPhonetic: anchor.phonetic,
    ttsPromptText: anchor.word,
    heroSpriteSrc: anchorVis.spriteSrc,
    heroWord: anchor.word,
    heroPhonetic: anchor.phonetic,
    heroShortVi: anchorVis.shortVi,
    leftCards,
    rightCards,
    fullSentence: anchor.word,
    fullPhonetic: anchor.phonetic,
    translationVi: anchorVis.shortVi,
    grammarTitleVi: `${anchor.word} = ${anchorVis.shortVi}`,
    grammarExplainVi: `${anchor.exampleSentence} (${anchor.exampleVi})`,
    vocabNotes: trio.map((e, i) => ({
      word: e.word,
      phonetic: e.phonetic,
      posVi: e.posVi,
      meaningVi: cards[i].shortVi ?? formatShortKidMeaningVi(e.meaningVi),
    })),
  };
}

export function computeTargetBand(profile: LanguageProfileState, parkLevel: number): number {
  // Blend user's adaptive masteryScore with accelerated progression curve
  const clampedPark = Math.max(1, Math.min(100, parkLevel));
  let blended = profile.masteryScore * 0.8 + clampedPark * 0.25 + 6;
  if (profile.tier === 'beginner') {
    blended = Math.max(1, Math.min(45, blended));
  } else if (profile.tier === 'intermediate') {
    blended = Math.max(35, Math.min(80, blended));
  } else {
    blended = Math.max(75, Math.min(100, blended));
  }
  return Math.max(1, Math.min(10, Math.ceil(blended / 10)));
}

function reconstructChallengeById(
  qId: string,
  lang: QuizLanguageId,
  isReview: boolean
): ActiveQuizChallenge | null {
  if (qId.startsWith('vocab:')) {
    const lexId = qId.slice('vocab:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildVocabContextChallenge(entry, isReview) : null;
  }
  if (qId.startsWith('listen:')) {
    const lexId = qId.slice('listen:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildListeningComprehensionChallenge(entry, isReview) : null;
  }
  if (qId.startsWith('pairs:')) {
    const lexId = qId.slice('pairs:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildMatchPairsChallenge(entry, isReview) : null;
  }
  if (qId.startsWith('cloze:')) {
    const lexId = qId.slice('cloze:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildLexiconWordChoiceChallenge(entry, 'grammar_cloze', isReview) : null;
  }
  if (qId.startsWith('bubble:')) {
    const lexId = qId.slice('bubble:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildLexiconWordChoiceChallenge(entry, 'dialogue_reply', isReview) : null;
  }
  if (qId.startsWith('tiles:')) {
    const lexId = qId.slice('tiles:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId && e.lang === lang);
    return entry ? buildLexiconTilesChallenge(entry, isReview) : null;
  }
  const curated = CURATED_QUIZ_BANK.find((c) => c.id === qId && c.lang === lang);
  return curated ? buildFromCurated(curated, isReview) : null;
}

interface QuizChallengeCandidate {
  qId: string;
  format: QuizFormatKind;
  levelBand: number;
  tier: QuizProficiencyTier;
  topic: QuizTopicId;
  conceptKey: string;
  build: (isReview: boolean) => ActiveQuizChallenge;
}

function buildCandidatesForFormat(
  lang: QuizLanguageId,
  format: QuizFormatKind,
  langLexicon: QuizLexiconEntry[],
  langCurated: CuratedQuizItem[]
): QuizChallengeCandidate[] {
  const candidates: QuizChallengeCandidate[] = [];
  const usedConcepts = new Set<string>();

  if (format === 'listening_comprehension') {
    for (const entry of langLexicon) {
      const conceptKey = normalizeQuizConceptKey(lang, entry.word);
      if (usedConcepts.has(conceptKey)) continue;
      usedConcepts.add(conceptKey);
      candidates.push({
        qId: `listen:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic: entry.topic ?? 'farm',
        conceptKey,
        build: (isReview) => buildListeningComprehensionChallenge(entry, isReview),
      });
    }
    return candidates;
  }

  if (format === 'vocab_context') {
    for (const entry of langLexicon) {
      const conceptKey = normalizeQuizConceptKey(lang, entry.word);
      if (usedConcepts.has(conceptKey)) continue;
      usedConcepts.add(conceptKey);
      candidates.push({
        qId: `vocab:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic: entry.topic ?? 'farm',
        conceptKey,
        build: (isReview) => buildVocabContextChallenge(entry, isReview),
      });
    }
    return candidates;
  }

  if (format === 'match_pairs') {
    for (const entry of langLexicon) {
      const conceptKey = normalizeQuizConceptKey(lang, entry.word);
      if (usedConcepts.has(conceptKey)) continue;
      usedConcepts.add(conceptKey);
      candidates.push({
        qId: `pairs:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic: entry.topic ?? 'farm',
        conceptKey,
        build: (isReview) => buildMatchPairsChallenge(entry, isReview),
      });
    }
    return candidates;
  }

  // Curated items for grammar_cloze / dialogue_reply / sentence_builder first
  for (const item of langCurated) {
    if (item.format !== format) continue;
    const conceptKey = normalizeQuizConceptKey(lang, getCuratedPrimaryWord(item));
    if (usedConcepts.has(conceptKey)) continue;
    usedConcepts.add(conceptKey);
    candidates.push({
      qId: item.id,
      format,
      levelBand: item.levelBand,
      tier: item.tier,
      topic: item.topic ?? 'farm',
      conceptKey,
      build: (isReview) => buildFromCurated(item, isReview),
    });
  }

  // Expand with full lexicon bank so every format has 180..240+ unique words without repetition
  for (const entry of langLexicon) {
    const conceptKey = normalizeQuizConceptKey(lang, entry.word);
    if (usedConcepts.has(conceptKey)) continue;
    usedConcepts.add(conceptKey);
    const topic: QuizTopicId = entry.topic ?? 'farm';
    if (format === 'grammar_cloze') {
      candidates.push({
        qId: `cloze:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic,
        conceptKey,
        build: (isReview) => buildLexiconWordChoiceChallenge(entry, 'grammar_cloze', isReview),
      });
    } else if (format === 'dialogue_reply') {
      candidates.push({
        qId: `bubble:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic,
        conceptKey,
        build: (isReview) => buildLexiconWordChoiceChallenge(entry, 'dialogue_reply', isReview),
      });
    } else {
      candidates.push({
        qId: `tiles:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        topic,
        conceptKey,
        build: (isReview) => buildLexiconTilesChallenge(entry, isReview),
      });
    }
  }

  return candidates;
}

function resolveQidTopic(
  qId: string,
  lexById: Map<string, QuizLexiconEntry>,
  curById: Map<string, CuratedQuizItem>
): QuizTopicId | null {
  for (const prefix of ['vocab:', 'listen:', 'pairs:', 'cloze:', 'bubble:', 'tiles:'] as const) {
    if (qId.startsWith(prefix)) {
      const entry = lexById.get(qId.slice(prefix.length));
      return entry ? (entry.topic ?? 'farm') : null;
    }
  }
  const cur = curById.get(qId);
  return cur ? (cur.topic ?? 'farm') : null;
}

function resolveQidConceptKey(
  qId: string,
  lang: QuizLanguageId,
  lexById: Map<string, QuizLexiconEntry>,
  curById: Map<string, CuratedQuizItem>
): string | null {
  for (const prefix of ['vocab:', 'listen:', 'pairs:', 'cloze:', 'bubble:', 'tiles:'] as const) {
    if (qId.startsWith(prefix)) {
      const entry = lexById.get(qId.slice(prefix.length));
      return entry ? normalizeQuizConceptKey(lang, entry.word) : null;
    }
  }
  const cur = curById.get(qId);
  return cur ? normalizeQuizConceptKey(lang, getCuratedPrimaryWord(cur)) : null;
}

export interface NextQuizChallengeOptions {
  excludeIds?: Iterable<string>;
  formatOffset?: number;
}

export function generateNextQuizChallenge(
  quizState: LanguageQuizState,
  parkLevel: number,
  options?: NextQuizChallengeOptions
): ActiveQuizChallenge {
  const lang = quizState.activeLang;
  const profile = quizState.profiles[lang];
  const pref = quizState.preferredFormat;
  if (!profile.srsBoxes) profile.srsBoxes = {};

  const targetBand = computeTargetBand(profile, parkLevel);
  const langLexicon = QUIZ_LEXICON_BANK.filter((e) => e.lang === lang);
  const langCurated = CURATED_QUIZ_BANK.filter((c) => c.lang === lang);
  const lexById = new Map(langLexicon.map((e) => [e.id, e]));
  const curById = new Map(langCurated.map((c) => [c.id, c]));

  const sessionExcludedIds = new Set<string>(options?.excludeIds ?? []);
  const recentIndexMap = new Map<string, number>();
  profile.recentIds.forEach((id, idx) => {
    recentIndexMap.set(id, idx);
  });
  const srsBoxes = profile.srsBoxes;
  const reviewMap = new Map(profile.reviewQueue.map((r) => [r.qId, r]));

  const seenQids = new Set<string>(sessionExcludedIds);
  for (const id of profile.recentIds) seenQids.add(id);
  for (const id of Object.keys(srsBoxes)) seenQids.add(id);
  for (const r of profile.reviewQueue) seenQids.add(r.qId);

  const allSeenConcepts = new Set<string>();
  for (const qId of seenQids) {
    const ck = resolveQidConceptKey(qId, lang, lexById, curById);
    if (ck) allSeenConcepts.add(ck);
  }

  const recentConcepts = new Set<string>();
  for (const qId of profile.recentIds.slice(-RECENT_CONCEPT_COOLDOWN)) {
    const ck = resolveQidConceptKey(qId, lang, lexById, curById);
    if (ck) recentConcepts.add(ck);
  }
  const sessionTail = Array.from(sessionExcludedIds).slice(-3);
  for (const qId of sessionTail) {
    const ck = resolveQidConceptKey(qId, lang, lexById, curById);
    if (ck) recentConcepts.add(ck);
  }

  const orderedFormats: QuizFormatKind[] =
    pref !== 'all'
      ? [pref]
      : ROTATING_FORMATS.map(
          (_, i) =>
            ROTATING_FORMATS[
              (profile.totalAnswered + Math.max(0, options?.formatOffset ?? 0) + i) %
                ROTATING_FORMATS.length
            ]
        );

  const prefTopic = quizState.preferredTopic ?? 'all';
  const candidatesByFormat = new Map<QuizFormatKind, QuizChallengeCandidate[]>();
  for (const fmt of orderedFormats) {
    const rawList = buildCandidatesForFormat(lang, fmt, langLexicon, langCurated);
    if (prefTopic !== 'all') {
      const topicFiltered = rawList.filter((c) => c.topic === prefTopic);
      candidatesByFormat.set(fmt, topicFiltered.length > 0 ? topicFiltered : rawList);
    } else {
      candidatesByFormat.set(fmt, rawList);
    }
  }

  const recentTopics = new Set<QuizTopicId>();
  for (const qId of profile.recentIds.slice(-3)) {
    const t = resolveQidTopic(qId, lexById, curById);
    if (t) recentTopics.add(t);
  }
  for (const qId of sessionTail) {
    const t = resolveQidTopic(qId, lexById, curById);
    if (t) recentTopics.add(t);
  }

  const pickBestFresh = (list: QuizChallengeCandidate[]): QuizChallengeCandidate => {
    const expandedPool = list.filter((c) => c.topic !== 'farm');
    const farmPool = list.filter((c) => c.topic === 'farm');
    // Ưu tiên ~80% các chủ đề đời sống / du lịch / công nghệ / sức khỏe / phép thuật, ~20% từ nông trại cũ
    const chosenPool =
      expandedPool.length > 0 && farmPool.length > 0
        ? Math.random() < 0.8
          ? expandedPool
          : farmPool
        : expandedPool.length > 0
          ? expandedPool
          : list;

    const scored = chosenPool.map((c) => ({
      c,
      score:
        Math.abs(c.levelBand - targetBand) * 2.2 +
        (c.tier === profile.tier ? 0 : 2.5) +
        (recentTopics.has(c.topic) ? 0.9 : 0) +
        Math.random() * 1.35,
    }));
    scored.sort((a, b) => a.score - b.score);
    return scored[0].c;
  };

  // Due Leitner SRS / reviewQueue cards outside recentIds surface on schedule (respecting active format/topic filters without forcing early repeats)
  const dueReviewCandidates: Array<{ qId: string; priority: number }> = [];
  for (const rev of profile.reviewQueue) {
    if (
      rev.dueAtTurn <= profile.totalAnswered &&
      !recentIndexMap.has(rev.qId) &&
      !sessionExcludedIds.has(rev.qId)
    ) {
      dueReviewCandidates.push({ qId: rev.qId, priority: rev.dueAtTurn });
    }
  }
  for (const [qId, boxRec] of Object.entries(srsBoxes)) {
    if (
      boxRec.box <= 2 &&
      boxRec.dueAtTurn <= profile.totalAnswered &&
      !reviewMap.has(qId) &&
      !recentIndexMap.has(qId) &&
      !sessionExcludedIds.has(qId)
    ) {
      dueReviewCandidates.push({ qId, priority: boxRec.dueAtTurn + 1 });
    }
  }
  dueReviewCandidates.sort((a, b) => a.priority - b.priority);
  for (const due of dueReviewCandidates) {
    if (prefTopic !== 'all') {
      const dueTopic = resolveQidTopic(due.qId, lexById, curById);
      if (dueTopic && dueTopic !== prefTopic) continue;
    }
    const rebuilt = reconstructChallengeById(due.qId, lang, true);
    if (rebuilt && (pref === 'all' || rebuilt.format === pref)) {
      return rebuilt;
    }
  }

  // Bucket 0: Unseen qId AND unseen root word/concept across all formats
  for (const fmt of orderedFormats) {
    const bucket0 = (candidatesByFormat.get(fmt) ?? []).filter(
      (c) => !seenQids.has(c.qId) && !allSeenConcepts.has(c.conceptKey)
    );
    if (bucket0.length > 0) {
      return pickBestFresh(bucket0).build(false);
    }
  }

  // Bucket 1: Unseen qId whose root word/concept is outside the recent cooldown window
  for (const fmt of orderedFormats) {
    const bucket1 = (candidatesByFormat.get(fmt) ?? []).filter(
      (c) => !seenQids.has(c.qId) && !recentConcepts.has(c.conceptKey)
    );
    if (bucket1.length > 0) {
      return pickBestFresh(bucket1).build(false);
    }
  }

  // Bucket 2: Any remaining unseen qId before wrapping around
  for (const fmt of orderedFormats) {
    const bucket2 = (candidatesByFormat.get(fmt) ?? []).filter((c) => !seenQids.has(c.qId));
    if (bucket2.length > 0) {
      return pickBestFresh(bucket2).build(false);
    }
  }

  // Bucket 3: 100% of candidate qIds in active scope have been seen -> Least-Recently-Seen + SRS wrap-around
  const allCandidates: QuizChallengeCandidate[] = [];
  for (const fmt of orderedFormats) {
    allCandidates.push(...(candidatesByFormat.get(fmt) ?? []));
  }

  if (allCandidates.length === 0) {
    const fallbackCur = langCurated[0] ?? CURATED_QUIZ_BANK[0];
    return buildFromCurated(fallbackCur, false);
  }

  const lastRecentQid = profile.recentIds[profile.recentIds.length - 1] ?? null;
  let wrapPool = allCandidates.filter(
    (c) => !sessionExcludedIds.has(c.qId) && c.qId !== lastRecentQid
  );
  if (wrapPool.length === 0) {
    wrapPool = allCandidates.filter((c) => c.qId !== lastRecentQid);
  }
  if (wrapPool.length === 0) {
    wrapPool = allCandidates;
  }

  const minCooldownIdx = Math.max(
    0,
    profile.recentIds.length - Math.min(15, Math.floor(allCandidates.length / 2))
  );
  const preferExpandedWrap = Math.random() < 0.8;
  const wrapScored = wrapPool.map((c) => {
    const recentIdx = recentIndexMap.get(c.qId) ?? -1;
    const srs = srsBoxes[c.qId];
    const isDue =
      reviewMap.has(c.qId) || Boolean(srs && srs.box < 5 && srs.dueAtTurn <= profile.totalAnswered);
    const dueBonus = isDue && recentIdx < minCooldownIdx ? -8 : 0;
    const topicBias = preferExpandedWrap && c.topic !== 'farm' ? -3 : 0;
    const recencyScore = recentIdx < 0 ? -1000 + Math.random() * 6 : recentIdx * 10;
    const bandScore = Math.abs(c.levelBand - targetBand) * 0.6;
    return {
      c,
      isReview: Boolean(srs || reviewMap.has(c.qId)),
      score: recencyScore + dueBonus + topicBias + bandScore,
    };
  });
  wrapScored.sort((a, b) => a.score - b.score);

  const winner = wrapScored[0];
  const built = winner.c.build(winner.isReview);
  const existingBox = srsBoxes[built.qId]?.box ?? reviewMap.get(built.qId)?.box;
  if (existingBox) {
    built.srsBox = existingBox;
  }
  return built;
}

export function markQuizChallengeSkipped(
  quizState: LanguageQuizState,
  challenge: ActiveQuizChallenge | null | undefined
): void {
  if (!challenge) return;
  const prof = quizState.profiles[challenge.lang];
  if (!prof) return;
  prof.recentIds = [
    ...prof.recentIds.filter((id) => id !== challenge.qId),
    challenge.qId,
  ].slice(-MAX_RECENT_QUIZ_IDS);
}

export function recordQuizAttempt(
  quizState: LanguageQuizState,
  challenge: ActiveQuizChallenge,
  correct: boolean,
  rewarded = true, // HPVN: false = daily reward cap reached, the answer is practice only (no seeds / XP)
  customDayKey?: string
): QuizAttemptOutcome {
  const prof = quizState.profiles[challenge.lang];
  if (!prof.srsBoxes) prof.srsBoxes = {};
  const todayKey = customDayKey ?? formatQuizDayKey();
  if (quizState.todayStudyDayKey !== todayKey) {
    quizState.todayStudyDayKey = todayKey;
    quizState.todayAnsweredCount = 0;
  }
  prof.totalAnswered += 1;
  prof.recentIds = [
    ...prof.recentIds.filter((id) => id !== challenge.qId),
    challenge.qId,
  ].slice(-MAX_RECENT_QUIZ_IDS);

  if (correct) {
    prof.totalCorrect += 1;
    prof.streak += 1;
    prof.bestStreak = Math.max(prof.bestStreak, prof.streak);

    quizState.todayAnsweredCount = (quizState.todayAnsweredCount ?? 0) + 1;
    if (
      quizState.todayAnsweredCount >= DAILY_QUIZ_STREAK_TARGET_ANSWERS &&
      quizState.lastStudyDayKey !== todayKey
    ) {
      const consecutive = isYesterdayDayKey(quizState.lastStudyDayKey, todayKey);
      quizState.dailyStreakCount = consecutive ? (quizState.dailyStreakCount ?? 0) + 1 : 1;
      quizState.bestDailyStreakCount = Math.max(
        quizState.bestDailyStreakCount ?? 0,
        quizState.dailyStreakCount
      );
      quizState.lastStudyDayKey = todayKey;
    }

    const gain = prof.streak >= 5 ? 4 : 3;
    prof.masteryScore = Math.min(100, prof.masteryScore + gain);

    let tierAutoPromoted: QuizProficiencyTier | undefined;
    if (prof.tier === 'beginner' && prof.masteryScore >= 45 && prof.streak >= 5) {
      prof.tier = 'intermediate';
      tierAutoPromoted = 'intermediate';
    } else if (prof.tier === 'intermediate' && prof.masteryScore >= 82 && prof.streak >= 5) {
      prof.tier = 'advanced';
      tierAutoPromoted = 'advanced';
    }

    // Advance Leitner SRS Box (1 -> 2 -> 3 -> 4 -> 5 Mastered)
    const prevSrs = prof.srsBoxes[challenge.qId];
    const nextBox = prevSrs ? Math.min(5, prevSrs.box + 1) : 2;
    prof.srsBoxes[challenge.qId] = {
      box: nextBox,
      dueAtTurn: prof.totalAnswered + (LEITNER_INTERVALS[nextBox] ?? 12),
      lapses: prevSrs?.lapses ?? 0,
    };

    const beforeLen = prof.reviewQueue.length;
    prof.reviewQueue = prof.reviewQueue.filter((r) => r.qId !== challenge.qId);
    const wasReviewCleared = prof.reviewQueue.length < beforeLen || challenge.isReview;

    // 1 or 2 seeds per correct answer based on tier, interactive challenge depth, or streak!
    const bonusSeed =
      challenge.tier !== 'beginner' ||
      challenge.format === 'sentence_builder' ||
      challenge.format === 'match_pairs' ||
      challenge.format === 'listening_comprehension' ||
      prof.streak >= 2 ||
      wasReviewCleared;
    const seedsAwarded = bonusSeed ? 2 : 1;
    const xpAwarded = challenge.tier === 'advanced' ? 18 : challenge.tier === 'intermediate' ? 14 : 10;
    if (rewarded) prof.seedsEarned += seedsAwarded;

    return {
      correct: true,
      seedsAwarded: rewarded ? seedsAwarded : 0,
      xpAwarded: rewarded ? xpAwarded : 0,
      practice: rewarded ? undefined : true,
      newStreak: prof.streak,
      newMasteryScore: prof.masteryScore,
      tierAutoPromoted,
      wasReviewCleared,
      newSrsBox: nextBox,
    };
  }

  // Wrong answer -> steeper penalty + drop to Leitner Box 1 (review in 2 turns)!
  prof.streak = 0;
  prof.masteryScore = Math.max(1, prof.masteryScore - 7);

  const prevSrs = prof.srsBoxes[challenge.qId];
  prof.srsBoxes[challenge.qId] = {
    box: 1,
    dueAtTurn: prof.totalAnswered + LEITNER_INTERVALS[1],
    lapses: (prevSrs?.lapses ?? 0) + 1,
  };

  const existing = prof.reviewQueue.find((r) => r.qId === challenge.qId);
  if (existing) {
    existing.misses += 1;
    existing.box = 1;
    existing.dueAtTurn = prof.totalAnswered + 2;
  } else {
    prof.reviewQueue.push({
      qId: challenge.qId,
      dueAtTurn: prof.totalAnswered + 2,
      misses: 1,
      box: 1,
    });
    if (prof.reviewQueue.length > 30) {
      prof.reviewQueue.shift();
    }
  }

  return {
    correct: false,
    seedsAwarded: 0,
    xpAwarded: 0, // HPVN: wrong answers give no XP (was +2, farmable by random clicking)
    newStreak: 0,
    newMasteryScore: prof.masteryScore,
    wasReviewCleared: false,
    newSrsBox: 1,
  };
}

export function speakQuizText(text: string, lang: QuizLanguageId, rate = 0.96): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    // Strip furigana parentheses like "種 (たね)" -> "種" or Hangul/Chinese clean speech
    const cleanText =
      lang === 'ja' ? text.replace(/\s*\([ぁ-んァ-ンー]+\)/g, '') : text.replace(/____/g, '...');
    const utter = new SpeechSynthesisUtterance(cleanText);
    const targetBcp = QUIZ_LANGUAGES[lang].ttsLang;
    utter.lang = targetBcp;
    utter.rate = rate;
    utter.pitch = 1.0;

    const voices = synth.getVoices();
    const prefix = targetBcp.split('-')[0].toLowerCase();
    const matched =
      voices.find((v) => v.lang.toLowerCase() === targetBcp.toLowerCase() && v.localService) ??
      voices.find((v) => v.lang.toLowerCase() === targetBcp.toLowerCase()) ??
      voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (matched) {
      utter.voice = matched;
    }
    synth.speak(utter);
    return true;
  } catch {
    return false;
  }
}
