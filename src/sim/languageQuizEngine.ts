import {
  CURATED_QUIZ_BANK,
  CURRICULUM_CHAPTERS,
  CuratedQuizItem,
  QUIZ_LANGUAGES,
  QUIZ_LEXICON_BANK,
  QuizLexiconEntry,
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
  | 'pic_pairs';

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
  ];
  const preferredFormat = validFormats.includes(raw.preferredFormat as 'all' | QuizFormatKind)
    ? (raw.preferredFormat as 'all' | QuizFormatKind)
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
  { pattern: /táo|apple|ringo|사과|苹果|manzana/i, sprite: '/sprites/ui_icon_crop_burrow_apple.png' },
  { pattern: /dâu|strawberry|fresa|苺|いちご|딸기|草莓/i, sprite: '/sprites/ui_icon_crop_ruby_strawberry.png' },
  { pattern: /bí ngô|pumpkin|kabocha|calabaza|南瓜|호박/i, sprite: '/sprites/ui_icon_crop_garden_pumpkin.png' },
  { pattern: /cà rốt|carrot|húluóbo|胡萝卜|당근|zanahoria/i, sprite: '/sprites/ui_icon_crop_honey_carrot.png' },
  { pattern: /khoai tây|potato|감자|patata|土豆/i, sprite: '/sprites/ui_icon_crop_burrow_potato.png' },
  { pattern: /lúa mì|wheat|trigo|밀|小麦|こむぎ/i, sprite: '/sprites/ui_icon_crop_ottery_wheat.png' },
  { pattern: /bắp cải|cabbage|배추|col/i, sprite: '/sprites/ui_icon_crop_crisp_cabbage.png' },
  { pattern: /bắp|ngô|corn|maíz|옥수수|玉米/i, sprite: '/sprites/ui_icon_crop_golden_corn.png' },
  { pattern: /cà chua|tomato|토마토|tomate|番茄/i, sprite: '/sprites/ui_icon_crop_ruby_tomato.png' },
  { pattern: /việt quất|blueberry|quả mọng|berry/i, sprite: '/sprites/ui_icon_crop_dew_blueberry.png' },
  { pattern: /súp|canh|soup|スープ/i, sprite: '/sprites/ui_icon_mushroom_soup.png' },
  { pattern: /nấm|mushroom|버섯|蘑菇|seta/i, sprite: '/sprites/ui_icon_crop_glow_mushroom.png' },
  { pattern: /mandrake|nhân sâm/i, sprite: '/sprites/ui_icon_crop_baby_mandrake.png' },
  { pattern: /oải hương|lavender|라벤더|ラベンダー|lavanda|hương thơm|thơm|aroma|fragrant|향기|香味|香り/i, sprite: '/sprites/ui_icon_crop_dried_lavender.png' },
  { pattern: /hoa hồng|rose|장미|バラ|rosa/i, sprite: '/sprites/ui_icon_crop_english_rose.png' },
  { pattern: /hướng dương|sunflower|mặt trời|bình minh|sunrise|nắng|sunlit|해바라기|태양|일출/i, sprite: '/sprites/ui_icon_crop_hedge_sunflower.png' },
  { pattern: /tulip|uất kim hương/i, sprite: '/sprites/ui_icon_crop_rainbow_tulip.png' },
  { pattern: /hoa cúc|daisy/i, sprite: '/sprites/ui_icon_crop_meadow_daisy.png' },
  { pattern: /chuông xanh|bluebell/i, sprite: '/sprites/ui_icon_crop_forest_bluebell.png' },
  { pattern: /mẫu đơn|peony/i, sprite: '/sprites/ui_icon_crop_blush_peony.png' },
  { pattern: /thủy tiên|daffodil/i, sprite: '/sprites/ui_icon_crop_golden_daffodil.png' },
  { pattern: /trăng|đêm|moon|night|달|밤|月/i, sprite: '/sprites/ui_icon_crop_moonlight_flower.png' },
  { pattern: /lửa|phượng hoàng|phoenix|fire/i, sprite: '/sprites/beast_phoenix.png' },
  { pattern: /mật ong|honey|miel|꿀|蜂蜜|はちみつ/i, sprite: '/sprites/ui_icon_honey_jar.png' },
  { pattern: /bột mì|flour|harina|밀가루|面粉|小麦粉/i, sprite: '/sprites/ui_icon_flour_sack.png' },
  { pattern: /bánh|nướng|bread|pie|bake|빵|面包|pan|パイ/i, sprite: '/sprites/ui_icon_pie_ready.png' },
  { pattern: /trứng|giỏ|egg|basket|cesta|달걀|바구니|卵|篮/i, sprite: '/sprites/ui_icon_egg_basket.png' },
  { pattern: /hạt giống|gieo|seed|semilla|sembrar|씨앗|种子|種|たね|nảy mầm|brotar/i, sprite: '/sprites/ui_icon_seed_sack.png' },
  { pattern: /nước|tưới|mưa|sương|water|rain|dew|じょうろ|물|水|agua/i, sprite: '/sprites/ui_icon_watering_can.png' },
  { pattern: /thu hoạch|gặt|mùa|bội thu|harvest|수확|풍년|收获|収穫|豊穣|bountiful|abundancia/i, sprite: '/sprites/ui_icon_golden_sickle.png' },
  { pattern: /cầu|bridge|puente|다리|桥/i, sprite: '/sprites/hogsmeade_stone_bridge.png' },
  { pattern: /thuyền|sông|hồ|boat|river|lake|강|河|río/i, sprite: '/sprites/vehicle_lake_boat.png' },
  { pattern: /gà|chicken|hen|닭/i, sprite: '/sprites/beast_hen.png' },
  { pattern: /cừu|len|sheep|wool|양/i, sprite: '/sprites/beast_sheep.png' },
  { pattern: /bò|sữa|cow|milk|소|우유/i, sprite: '/sprites/beast_cow.png' },
  { pattern: /cú|thư|bưu điện|owl|letter|mail|手紙|편지/i, sprite: '/sprites/ui_icon_owl_orders.png' },
  { pattern: /rồng|dragon/i, sprite: '/sprites/beast_dragon.png' },
  { pattern: /kỳ lân|unicorn/i, sprite: '/sprites/beast_unicorn.png' },
  { pattern: /bằng mã|hippogriff|ngựa/i, sprite: '/sprites/beast_hippogriff.png' },
  { pattern: /kho báu|vàng|niffler|gold/i, sprite: '/sprites/beast_niffler.png' },
  { pattern: /trà|bia bơ|butterbeer|tea|차|茶|té/i, sprite: '/sprites/ui_icon_butterbeer.png' },
  { pattern: /rượu táo|cider|mứt|jam|lọ|preserve/i, sprite: '/sprites/ui_icon_cider.png' },
  { pattern: /thảo dược|dược|thuốc|herb|potion|薬草|약초|hierba/i, sprite: '/sprites/ui_icon_herb_elixir.png' },
  { pattern: /áo|đan|chụp tai|wear|sweater|earmuff/i, sprite: '/sprites/ui_icon_sweater_ready.png' },
  { pattern: /tuyết|đông|lạnh|băng|snow|winter|frost|helar|invierno|겨울|冬/i, sprite: '/sprites/snowy_pines.png' },
  { pattern: /cây|rừng|thông|tree|pine|forest|orchard|vườn cây|果樹園|果树/i, sprite: '/sprites/burrow_apple_orchard.png' },
  { pattern: /nhà kính|greenhouse|invernadero|온실/i, sprite: '/sprites/burrow_greenhouse_canon.png' },
  { pattern: /cối xay|gió|breeze|wind|바람|风/i, sprite: '/sprites/burrow_windmill_canon.png' },
  { pattern: /kho|bảo quản|cất trữ|barn|store|보관|储存/i, sprite: '/sprites/burrow_house_canon.png' },
  { pattern: /ruộng|đất|soil|earth|fertile|fértil|비옥|肥沃|畑|cày/i, sprite: '/sprites/crop_plot_sprouts.png' },
  { pattern: /hoa|vườn|flower|garden|花|꽃|jardín/i, sprite: '/sprites/ui_icon_rose_bouquet.png' },
  { pattern: /sửa|rào|công cụ|repair|fence|dụng cụ|hammer/i, sprite: '/sprites/ui_icon_hammer_wand.png' },
];

const FALLBACK_VISUAL_SPRITES: readonly string[] = [
  '/sprites/ui_icon_crop_burrow_apple.png',
  '/sprites/ui_icon_crop_ruby_strawberry.png',
  '/sprites/ui_icon_crop_garden_pumpkin.png',
  '/sprites/ui_icon_crop_honey_carrot.png',
  '/sprites/ui_icon_crop_ottery_wheat.png',
  '/sprites/ui_icon_crop_golden_corn.png',
  '/sprites/ui_icon_crop_dew_blueberry.png',
  '/sprites/ui_icon_crop_glow_mushroom.png',
  '/sprites/ui_icon_crop_dried_lavender.png',
  '/sprites/ui_icon_crop_english_rose.png',
  '/sprites/ui_icon_crop_hedge_sunflower.png',
  '/sprites/ui_icon_crop_rainbow_tulip.png',
  '/sprites/ui_icon_honey_jar.png',
  '/sprites/ui_icon_pie_ready.png',
  '/sprites/ui_icon_flour_sack.png',
  '/sprites/ui_icon_egg_basket.png',
  '/sprites/ui_icon_seed_sack.png',
  '/sprites/ui_icon_watering_can.png',
  '/sprites/ui_icon_golden_sickle.png',
  '/sprites/beast_hen.png',
  '/sprites/beast_sheep.png',
  '/sprites/beast_cow.png',
  '/sprites/beast_puffskein.png',
  '/sprites/beast_phoenix.png',
  '/sprites/beast_unicorn.png',
  '/sprites/beast_niffler.png',
  '/sprites/ui_icon_butterbeer.png',
  '/sprites/ui_icon_cider.png',
  '/sprites/ui_icon_herb_elixir.png',
  '/sprites/ui_icon_mushroom_soup.png',
  '/sprites/ui_icon_owl_orders.png',
  '/sprites/ui_icon_sweater_ready.png',
  '/sprites/ui_icon_rose_bouquet.png',
  '/sprites/ui_icon_tulip_bluebell.png',
  '/sprites/ui_icon_magic_blossom.png',
  '/sprites/ui_icon_frog_choc.png',
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
    if (parts.length >= 2 && parts.length <= 6) {
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
  excludeId?: string
): QuizLexiconEntry[] {
  const targetShortVi = formatShortKidMeaningVi(excludeMeaningVi).toLowerCase();
  const targetWordLower = excludeWord.trim().toLowerCase();
  const sameLang = QUIZ_LEXICON_BANK.filter(
    (e) =>
      e.lang === lang &&
      e.id !== excludeId &&
      e.word.trim().toLowerCase() !== targetWordLower
  );
  const strictPool = sameLang
    .filter((e) => formatShortKidMeaningVi(e.meaningVi).toLowerCase() !== targetShortVi)
    .sort((a, b) => Math.abs(a.levelBand - levelBand) - Math.abs(b.levelBand - levelBand));

  const picked = shuffleArray(strictPool.slice(0, Math.max(count * 4, 12))).slice(0, count);
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
    let expectedTiles = splitWordIntoKidTiles(primaryNote.word, item.lang);
    if (expectedTiles.length < 2) {
      const sentenceParts = Array.isArray(item.orderedTokens)
        ? item.orderedTokens.filter((tok: string) => Boolean(tok && tok.trim().length > 0))
        : [];
      expectedTiles =
        sentenceParts.length >= 2 && sentenceParts.length <= 6
          ? sentenceParts
          : splitWordIntoKidTiles(item.fullSentence, item.lang);
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
    3
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
    target.id
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
    target.id
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

  let expectedTiles = splitWordIntoKidTiles(target.word, target.lang);
  let promptVi = `🧩 Nhìn tranh "${heroVisual.shortVi}" và ghép các mảnh chữ:`;
  let stemText = heroVisual.shortVi;
  let stemPhonetic = target.phonetic;
  let fullSentence = target.word;
  let fullPhonetic = target.phonetic;
  let ttsPromptText = target.word;
  let translationVi = heroVisual.shortVi;

  if (expectedTiles.length < 2) {
    expectedTiles = splitWordIntoKidTiles(target.exampleSentence, target.lang);
    if (expectedTiles.length < 2) {
      expectedTiles = [target.word, target.exampleSentence];
    }
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
  const peers = getDistractorLexiconEntries(
    anchor.lang,
    anchor.word,
    anchor.meaningVi,
    anchor.levelBand,
    2,
    anchor.id
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
  // Blend user's adaptive masteryScore (80% weight) with park progression level 1..100 (20% weight)
  const clampedPark = Math.max(1, Math.min(100, parkLevel));
  let blended = profile.masteryScore * 0.8 + clampedPark * 0.2;
  if (profile.tier === 'beginner') {
    blended = Math.max(1, Math.min(38, blended));
  } else if (profile.tier === 'intermediate') {
    blended = Math.max(31, Math.min(75, blended));
  } else {
    blended = Math.max(71, Math.min(100, blended));
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
      conceptKey,
      build: (isReview) => buildFromCurated(item, isReview),
    });
  }

  // Expand with full lexicon bank so every format has 80..150+ unique words without repetition
  for (const entry of langLexicon) {
    const conceptKey = normalizeQuizConceptKey(lang, entry.word);
    if (usedConcepts.has(conceptKey)) continue;
    usedConcepts.add(conceptKey);
    if (format === 'grammar_cloze') {
      candidates.push({
        qId: `cloze:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        conceptKey,
        build: (isReview) => buildLexiconWordChoiceChallenge(entry, 'grammar_cloze', isReview),
      });
    } else if (format === 'dialogue_reply') {
      candidates.push({
        qId: `bubble:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        conceptKey,
        build: (isReview) => buildLexiconWordChoiceChallenge(entry, 'dialogue_reply', isReview),
      });
    } else {
      candidates.push({
        qId: `tiles:${entry.id}`,
        format,
        levelBand: entry.levelBand,
        tier: entry.tier,
        conceptKey,
        build: (isReview) => buildLexiconTilesChallenge(entry, isReview),
      });
    }
  }

  return candidates;
}

function resolveQidConceptKey(
  qId: string,
  lang: QuizLanguageId,
  lexById: Map<string, QuizLexiconEntry>,
  curById: Map<string, CuratedQuizItem>
): string | null {
  for (const prefix of ['vocab:', 'pairs:', 'cloze:', 'bubble:', 'tiles:'] as const) {
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

  const candidatesByFormat = new Map<QuizFormatKind, QuizChallengeCandidate[]>();
  for (const fmt of orderedFormats) {
    candidatesByFormat.set(fmt, buildCandidatesForFormat(lang, fmt, langLexicon, langCurated));
  }

  const pickBestFresh = (list: QuizChallengeCandidate[]): QuizChallengeCandidate => {
    const scored = list.map((c) => ({
      c,
      score:
        Math.abs(c.levelBand - targetBand) * 2.2 +
        (c.tier === profile.tier ? 0 : 2.5) +
        Math.random() * 1.35,
    }));
    scored.sort((a, b) => a.score - b.score);
    return scored[0].c;
  };

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
  const wrapScored = wrapPool.map((c) => {
    const recentIdx = recentIndexMap.get(c.qId) ?? -1;
    const srs = srsBoxes[c.qId];
    const isDue =
      reviewMap.has(c.qId) || Boolean(srs && srs.box < 5 && srs.dueAtTurn <= profile.totalAnswered);
    const dueBonus = isDue && recentIdx < minCooldownIdx ? -8 : 0;
    const recencyScore = recentIdx < 0 ? -1000 + Math.random() * 6 : recentIdx * 10;
    const bandScore = Math.abs(c.levelBand - targetBand) * 0.6;
    return {
      c,
      isReview: Boolean(srs || reviewMap.has(c.qId)),
      score: recencyScore + dueBonus + bandScore,
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
  correct: boolean
): QuizAttemptOutcome {
  const prof = quizState.profiles[challenge.lang];
  if (!prof.srsBoxes) prof.srsBoxes = {};
  prof.totalAnswered += 1;
  prof.recentIds = [
    ...prof.recentIds.filter((id) => id !== challenge.qId),
    challenge.qId,
  ].slice(-MAX_RECENT_QUIZ_IDS);

  if (correct) {
    prof.totalCorrect += 1;
    prof.streak += 1;
    prof.bestStreak = Math.max(prof.bestStreak, prof.streak);

    const gain = prof.streak >= 3 ? 6 : 4;
    prof.masteryScore = Math.min(100, prof.masteryScore + gain);

    let tierAutoPromoted: QuizProficiencyTier | undefined;
    if (prof.tier === 'beginner' && prof.masteryScore >= 38 && prof.streak >= 3) {
      prof.tier = 'intermediate';
      tierAutoPromoted = 'intermediate';
    } else if (prof.tier === 'intermediate' && prof.masteryScore >= 75 && prof.streak >= 3) {
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
      prof.streak >= 2 ||
      wasReviewCleared;
    const seedsAwarded = bonusSeed ? 2 : 1;
    const xpAwarded = challenge.tier === 'advanced' ? 18 : challenge.tier === 'intermediate' ? 14 : 10;
    prof.seedsEarned += seedsAwarded;

    return {
      correct: true,
      seedsAwarded,
      xpAwarded,
      newStreak: prof.streak,
      newMasteryScore: prof.masteryScore,
      tierAutoPromoted,
      wasReviewCleared,
      newSrsBox: nextBox,
    };
  }

  // Wrong answer -> gentle adaptive step down + drop to Leitner Box 1 (review in 2 turns)!
  prof.streak = 0;
  prof.masteryScore = Math.max(1, prof.masteryScore - 4);

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
    xpAwarded: 2, // Small encouragement XP for studying the grammar explanation!
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
