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
}

export interface ActiveQuizChallenge {
  qId: string;
  lang: QuizLanguageId;
  tier: QuizProficiencyTier;
  levelBand: number; // 1..10 -> Level 1..100
  chapterTitleVi: string;
  format: QuizFormatKind;
  isReview: boolean;
  srsBox?: number; // 1..5 Leitner box if tracked in SRS
  promptVi: string;
  stemText: string;
  stemPhonetic?: string;
  ttsPromptText: string;
  // Multiple-choice payload (vocab_context, grammar_cloze, dialogue_reply)
  choices?: string[];
  choicePhonetics?: string[];
  correctIndex?: number;
  // Sentence builder payload (sentence_builder)
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

const LEITNER_INTERVALS: Record<number, number> = {
  1: 2,
  2: 5,
  3: 12,
  4: 28,
  5: 65,
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
      recentIds: Array.isArray(p.recentIds) ? p.recentIds.slice(-24).map(String) : [],
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
                .slice(0, 800)
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

function buildFromCurated(item: CuratedQuizItem, isReview: boolean): ActiveQuizChallenge {
  const base: ActiveQuizChallenge = {
    qId: item.id,
    lang: item.lang,
    tier: item.tier,
    levelBand: item.levelBand,
    chapterTitleVi: getChapterTitle(item.levelBand),
    format: item.format,
    isReview,
    promptVi: item.promptVi,
    stemText: item.stemText,
    stemPhonetic: item.stemPhonetic,
    ttsPromptText: item.format === 'dialogue_reply' ? item.stemText.replace(/^[^:：]+[:：]\s*[“"「]?|[”"」]$/g, '') : item.fullSentence,
    fullSentence: item.fullSentence,
    fullPhonetic: item.fullPhonetic,
    translationVi: item.translationVi,
    grammarTitleVi: item.grammarTitleVi,
    grammarExplainVi: item.grammarExplainVi,
    vocabNotes: item.vocabNotes,
  };

  if (item.format === 'sentence_builder' && item.orderedTokens) {
    const pool = [...item.orderedTokens, ...(item.distractorTokens ?? [])];
    const indexed = pool.map((text, idx) => ({ idx, text }));
    let shuffled = shuffleArray(indexed);
    // Avoid accidentally matching exact solved order
    if (
      shuffled.length > 1 &&
      shuffled.slice(0, item.orderedTokens.length).every((t, i) => t.text === item.orderedTokens![i])
    ) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    base.shuffledTokens = shuffled;
    base.expectedSentenceTokens = [...item.orderedTokens];
    return base;
  }

  // Shuffle multiple-choice order while tracking correctIndex so memorizing position never works!
  const rawChoices = item.choices ?? [];
  const rawPh = item.choicePhonetics ?? [];
  const tagged = rawChoices.map((c, idx) => ({
    text: c,
    ph: rawPh[idx],
    isCorrect: idx === (item.correctIndex ?? 0),
  }));
  const mixed = shuffleArray(tagged);
  base.choices = mixed.map((m) => m.text);
  if (rawPh.length > 0) {
    base.choicePhonetics = mixed.map((m) => m.ph ?? '');
  }
  base.correctIndex = Math.max(0, mixed.findIndex((m) => m.isCorrect));
  return base;
}

function buildVocabContextChallenge(
  target: QuizLexiconEntry,
  langPool: QuizLexiconEntry[],
  isReview: boolean
): ActiveQuizChallenge {
  const others = shuffleArray(
    langPool.filter((e) => e.id !== target.id && e.meaningVi !== target.meaningVi)
  ).slice(0, 3);

  const askForeignWord = target.id.charCodeAt(target.id.length - 1) % 2 === 0;
  if (askForeignWord) {
    // Give Vietnamese meaning + cloze example -> pick the right foreign word!
    const options = shuffleArray([target, ...others]);
    const escapedWord = target.word.replace(/\s*\([^)]*\)/g, '');
    const maskedExample = target.exampleSentence.includes(escapedWord)
      ? target.exampleSentence.replace(escapedWord, '____')
      : target.exampleSentence;
    return {
      qId: `vocab:${target.id}`,
      lang: target.lang,
      tier: target.tier,
      levelBand: target.levelBand,
      chapterTitleVi: getChapterTitle(target.levelBand),
      format: 'vocab_context',
      isReview,
      promptVi: `Chọn từ ${QUIZ_LANGUAGES[target.lang].nameVi} mang nghĩa "${target.meaningVi}" (${target.posVi}):`,
      stemText: `${maskedExample}  —  (${target.exampleVi})`,
      stemPhonetic: target.examplePhonetic,
      ttsPromptText: target.exampleSentence,
      choices: options.map((o) => o.word),
      choicePhonetics: options.map((o) => o.phonetic),
      correctIndex: Math.max(0, options.findIndex((o) => o.id === target.id)),
      fullSentence: target.exampleSentence,
      fullPhonetic: target.examplePhonetic,
      translationVi: target.exampleVi,
      grammarTitleVi: `Từ vựng ngữ cảnh: ${target.word} (${target.phonetic}) = ${target.meaningVi}`,
      grammarExplainVi: target.grammarNoteVi,
      vocabNotes: [
        {
          word: target.word,
          phonetic: target.phonetic,
          posVi: target.posVi,
          meaningVi: target.meaningVi,
        },
        ...others.slice(0, 2).map((o) => ({
          word: o.word,
          phonetic: o.phonetic,
          posVi: o.posVi,
          meaningVi: o.meaningVi,
        })),
      ],
    };
  }

  // Listen & read native word in example sentence -> choose Vietnamese meaning!
  const options = shuffleArray([target, ...others]);
  return {
    qId: `vocab:${target.id}`,
    lang: target.lang,
    tier: target.tier,
    levelBand: target.levelBand,
    chapterTitleVi: getChapterTitle(target.levelBand),
    format: 'vocab_context',
    isReview,
    promptVi: `Nghe phát âm 🔊 và chọn nghĩa tiếng Việt chính xác của "${target.word}":`,
    stemText: `${target.word}  •  “${target.exampleSentence}”`,
    stemPhonetic: `${target.phonetic}  •  ${target.examplePhonetic}`,
    ttsPromptText: target.exampleSentence,
    choices: options.map((o) => `${o.meaningVi} (${o.posVi})`),
    correctIndex: Math.max(0, options.findIndex((o) => o.id === target.id)),
    fullSentence: target.exampleSentence,
    fullPhonetic: target.examplePhonetic,
    translationVi: target.exampleVi,
    grammarTitleVi: `Ghi nhớ từ vựng: ${target.word} (${target.phonetic}) — ${target.meaningVi}`,
    grammarExplainVi: target.grammarNoteVi,
    vocabNotes: [
      {
        word: target.word,
        phonetic: target.phonetic,
        posVi: target.posVi,
        meaningVi: target.meaningVi,
      },
      ...others.slice(0, 2).map((o) => ({
        word: o.word,
        phonetic: o.phonetic,
        posVi: o.posVi,
        meaningVi: o.meaningVi,
      })),
    ],
  };
}

function buildMatchPairsChallenge(
  anchor: QuizLexiconEntry,
  langPool: QuizLexiconEntry[],
  isReview: boolean
): ActiveQuizChallenge {
  const peers = shuffleArray(
    langPool
      .filter((e) => e.id !== anchor.id && e.meaningVi !== anchor.meaningVi)
      .sort((a, b) => Math.abs(a.levelBand - anchor.levelBand) - Math.abs(b.levelBand - anchor.levelBand))
      .slice(0, 6)
  ).slice(0, 2);

  const trio = [anchor, ...peers];
  const cards: QuizMatchPairCard[] = trio.map((e) => ({
    pairId: e.id,
    word: e.word,
    phonetic: e.phonetic,
    meaningVi: e.meaningVi,
  }));

  const leftCards = shuffleArray(cards);
  let rightCards = shuffleArray(cards);
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
    isReview,
    promptVi: 'Nhấp chọn 1 thẻ Từ bên trái rồi nối với đúng thẻ Nghĩa tiếng Việt bên phải (3 cặp):',
    stemText: anchor.exampleSentence,
    stemPhonetic: anchor.examplePhonetic,
    ttsPromptText: anchor.exampleSentence,
    leftCards,
    rightCards,
    fullSentence: anchor.exampleSentence,
    fullPhonetic: anchor.examplePhonetic,
    translationVi: anchor.exampleVi,
    grammarTitleVi: `Cụm từ vựng ${QUIZ_LANGUAGES[anchor.lang].tierLabels[anchor.tier]}`,
    grammarExplainVi: anchor.grammarNoteVi,
    vocabNotes: trio.map((e) => ({
      word: e.word,
      phonetic: e.phonetic,
      posVi: e.posVi,
      meaningVi: e.meaningVi,
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
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId);
    if (!entry) return null;
    const pool = QUIZ_LEXICON_BANK.filter((e) => e.lang === entry.lang);
    return buildVocabContextChallenge(entry, pool, isReview);
  }
  if (qId.startsWith('pairs:')) {
    const lexId = qId.slice('pairs:'.length);
    const entry = QUIZ_LEXICON_BANK.find((e) => e.id === lexId);
    if (!entry) return null;
    const pool = QUIZ_LEXICON_BANK.filter((e) => e.lang === entry.lang);
    return buildMatchPairsChallenge(entry, pool, isReview);
  }
  const curated = CURATED_QUIZ_BANK.find((c) => c.id === qId && c.lang === lang);
  return curated ? buildFromCurated(curated, isReview) : null;
}

export function generateNextQuizChallenge(
  quizState: LanguageQuizState,
  parkLevel: number
): ActiveQuizChallenge {
  const lang = quizState.activeLang;
  const profile = quizState.profiles[lang];
  const pref = quizState.preferredFormat;
  if (!profile.srsBoxes) profile.srsBoxes = {};

  // 1. Urgent Box 1 Lapses: Check due reviewQueue items first!
  const dueReview = profile.reviewQueue.find((r) => r.dueAtTurn <= profile.totalAnswered);
  if (dueReview) {
    const rebuilt = reconstructChallengeById(dueReview.qId, lang, true);
    if (rebuilt && (pref === 'all' || rebuilt.format === pref)) {
      rebuilt.srsBox = profile.srsBoxes[dueReview.qId]?.box ?? dueReview.box ?? 1;
      return rebuilt;
    }
  }

  // 1b. Leitner 5-Box SRS (~30% cadence: every 3rd turn, surface due SRS Box 1..4 items!)
  if (profile.totalAnswered % 3 === 2) {
    const dueSrsEntries = Object.entries(profile.srsBoxes)
      .filter(([qId, e]) => e.box < 5 && e.dueAtTurn <= profile.totalAnswered && !profile.recentIds.slice(-3).includes(qId))
      .sort((a, b) => a[1].box - b[1].box || a[1].dueAtTurn - b[1].dueAtTurn);
    for (const [qId, srs] of dueSrsEntries) {
      const rebuilt = reconstructChallengeById(qId, lang, true);
      if (rebuilt && (pref === 'all' || rebuilt.format === pref)) {
        rebuilt.srsBox = srs.box;
        return rebuilt;
      }
    }
  }

  const targetBand = computeTargetBand(profile, parkLevel);
  const desiredFormat: QuizFormatKind =
    pref !== 'all'
      ? pref
      : ROTATING_FORMATS[profile.totalAnswered % ROTATING_FORMATS.length];

  const langLexicon = QUIZ_LEXICON_BANK.filter((e) => e.lang === lang);
  const langCurated = CURATED_QUIZ_BANK.filter((c) => c.lang === lang);

  // 2. Fresh 70% Pool: Prioritize unseen items (!srsBoxes[qId]) near targetBand, then non-recent items!
  if (desiredFormat === 'vocab_context' || desiredFormat === 'match_pairs') {
    const prefix = desiredFormat === 'vocab_context' ? 'vocab:' : 'pairs:';
    const candidates = [...langLexicon].sort((a, b) => {
      const aQid = `${prefix}${a.id}`;
      const bQid = `${prefix}${b.id}`;
      const aRecent = profile.recentIds.includes(aQid) ? 120 : 0;
      const bRecent = profile.recentIds.includes(bQid) ? 120 : 0;
      const aSeenPenalty = profile.srsBoxes![aQid] ? profile.srsBoxes![aQid].box * 3.5 : 0;
      const bSeenPenalty = profile.srsBoxes![bQid] ? profile.srsBoxes![bQid].box * 3.5 : 0;
      const aDist = Math.abs(a.levelBand - targetBand) * 2.2 + (a.tier === profile.tier ? 0 : 2.5) + aSeenPenalty + aRecent;
      const bDist = Math.abs(b.levelBand - targetBand) * 2.2 + (b.tier === profile.tier ? 0 : 2.5) + bSeenPenalty + bRecent;
      return aDist - bDist + (Math.random() - 0.5) * 0.9;
    });
    const chosen = candidates[0] ?? langLexicon[0];
    const qId = `${prefix}${chosen.id}`;
    const built =
      desiredFormat === 'vocab_context'
        ? buildVocabContextChallenge(chosen, langLexicon, false)
        : buildMatchPairsChallenge(chosen, langLexicon, false);
    if (profile.srsBoxes[qId]) built.srsBox = profile.srsBoxes[qId].box;
    return built;
  }

  // 3. Curated format (grammar_cloze, dialogue_reply, sentence_builder)
  const formatMatches = langCurated.filter((c) => c.format === desiredFormat);
  const pool = formatMatches.length > 0 ? formatMatches : langCurated;
  const sorted = [...pool].sort((a, b) => {
    const aRecent = profile.recentIds.includes(a.id) ? 120 : 0;
    const bRecent = profile.recentIds.includes(b.id) ? 120 : 0;
    const aSeenPenalty = profile.srsBoxes![a.id] ? profile.srsBoxes![a.id].box * 3.5 : 0;
    const bSeenPenalty = profile.srsBoxes![b.id] ? profile.srsBoxes![b.id].box * 3.5 : 0;
    const aDist = Math.abs(a.levelBand - targetBand) * 2.2 + (a.tier === profile.tier ? 0 : 2.5) + aSeenPenalty + aRecent;
    const bDist = Math.abs(b.levelBand - targetBand) * 2.2 + (b.tier === profile.tier ? 0 : 2.5) + bSeenPenalty + bRecent;
    return aDist - bDist + (Math.random() - 0.5) * 0.9;
  });

  const built = buildFromCurated(sorted[0], false);
  if (profile.srsBoxes[built.qId]) built.srsBox = profile.srsBoxes[built.qId].box;
  return built;
}

export function recordQuizAttempt(
  quizState: LanguageQuizState,
  challenge: ActiveQuizChallenge,
  correct: boolean
): QuizAttemptOutcome {
  const prof = quizState.profiles[challenge.lang];
  if (!prof.srsBoxes) prof.srsBoxes = {};
  prof.totalAnswered += 1;
  prof.recentIds = [...prof.recentIds.filter((id) => id !== challenge.qId), challenge.qId].slice(-24);

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
