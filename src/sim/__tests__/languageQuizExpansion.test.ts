import { beforeAll, describe, expect, it } from 'vitest';
import {
  CURATED_QUIZ_BANK,
  loadLanguageQuizPack,
  QUIZ_LEXICON_BANK,
  QuizTopicId,
} from '../../data/languageQuizBank';
import { EN_EXPANDED_CURATED, EN_EXPANDED_LEXICON } from '../../data/quizPacks/enExpanded';
import { ES_EXPANDED_CURATED, ES_EXPANDED_LEXICON } from '../../data/quizPacks/esExpanded';
import { JA_EXPANDED_CURATED, JA_EXPANDED_LEXICON } from '../../data/quizPacks/jaExpanded';
import { KO_EXPANDED_CURATED, KO_EXPANDED_LEXICON } from '../../data/quizPacks/koExpanded';
import { ZH_EXPANDED_CURATED, ZH_EXPANDED_LEXICON } from '../../data/quizPacks/zhExpanded';
import { SPRITE_KEYS } from '../../engine/spriteLoader';
import { QuizLanguageId, QuizProficiencyTier } from '../../types/game';
import {
  createInitialLanguageQuizState,
  generateNextQuizChallenge,
  recordQuizAttempt,
} from '../languageQuizEngine';

const ALL_LANGS: QuizLanguageId[] = ['en', 'ko', 'zh', 'ja', 'es'];
const EXPANDED_TOPICS: QuizTopicId[] = ['daily', 'travel', 'study_tech', 'health_hobby', 'magic'];
const ALL_TIERS: QuizProficiencyTier[] = ['beginner', 'intermediate', 'advanced'];

const EXPANDED_BY_LANG = {
  en: { lex: EN_EXPANDED_LEXICON, cur: EN_EXPANDED_CURATED },
  ko: { lex: KO_EXPANDED_LEXICON, cur: KO_EXPANDED_CURATED },
  zh: { lex: ZH_EXPANDED_LEXICON, cur: ZH_EXPANDED_CURATED },
  ja: { lex: JA_EXPANDED_LEXICON, cur: JA_EXPANDED_CURATED },
  es: { lex: ES_EXPANDED_LEXICON, cur: ES_EXPANDED_CURATED },
} as const;

describe('Language Quiz Vocabulary Expansion (+500 words across 5 languages x 5 topics)', () => {
  beforeAll(async () => {
    for (const lang of ALL_LANGS) {
      const ok = await loadLanguageQuizPack(lang);
      expect(ok).toBe(true);
    }
  });

  it('provides exactly 100 unique expanded words and 5 curated lessons per language with zero collisions', () => {
    for (const lang of ALL_LANGS) {
      const { lex, cur } = EXPANDED_BY_LANG[lang];
      expect(lex.length).toBe(100);
      expect(cur.length).toBe(5);

      // Verify every single expanded word actually survived deduplication inside QUIZ_LEXICON_BANK
      const bankIds = new Set(QUIZ_LEXICON_BANK.filter((e) => e.lang === lang).map((e) => e.id));
      const missingIds = lex.filter((e) => !bankIds.has(e.id)).map((e) => `${e.id}:${e.word}`);
      expect(missingIds, `Expanded words dropped/duplicated in ${lang}`).toEqual([]);

      const curatedIds = new Set(CURATED_QUIZ_BANK.filter((c) => c.lang === lang).map((c) => c.id));
      const missingCur = cur.filter((c) => !curatedIds.has(c.id)).map((c) => c.id);
      expect(missingCur, `Expanded curated dropped in ${lang}`).toEqual([]);

      // Verify zero duplicate IDs or normalized words across entire loaded bank for this language
      const langEntries = QUIZ_LEXICON_BANK.filter((e) => e.lang === lang);
      const idSet = new Set<string>();
      const wordSet = new Set<string>();
      for (const entry of langEntries) {
        expect(idSet.has(entry.id), `Duplicate ID ${entry.id}`).toBe(false);
        idSet.add(entry.id);
        const normWord = entry.word.trim().toLowerCase();
        expect(wordSet.has(normWord), `Duplicate word ${lang}:${entry.word}`).toBe(false);
        wordSet.add(normWord);
      }
    }
  });

  it('covers all 5 new topics (20 words each) and all 3 tiers cleanly for every language', () => {
    for (const lang of ALL_LANGS) {
      const { lex, cur } = EXPANDED_BY_LANG[lang];

      for (const topic of EXPANDED_TOPICS) {
        const topicWords = lex.filter((e) => e.topic === topic);
        expect(topicWords.length, `${lang} topic ${topic}`).toBe(20);
        for (const tier of ALL_TIERS) {
          const count = topicWords.filter((e) => e.tier === tier).length;
          expect(count, `${lang} ${topic} ${tier}`).toBeGreaterThanOrEqual(4);
        }
      }

      for (const entry of lex) {
        expect(entry.lang).toBe(lang);
        expect(entry.levelBand).toBeGreaterThanOrEqual(1);
        expect(entry.levelBand).toBeLessThanOrEqual(10);
        expect(entry.word.trim().length).toBeGreaterThan(0);
        expect(entry.phonetic.trim().length).toBeGreaterThan(0);
        expect(entry.posVi.trim().length).toBeGreaterThan(0);
        expect(entry.meaningVi.trim().length).toBeGreaterThan(0);
        expect(entry.exampleSentence.trim().length).toBeGreaterThan(0);
        expect(entry.examplePhonetic.trim().length).toBeGreaterThan(0);
        expect(entry.exampleVi.trim().length).toBeGreaterThan(0);
        expect(entry.grammarNoteVi.trim().length).toBeGreaterThan(0);
      }

      for (const item of cur) {
        expect(item.lang).toBe(lang);
        expect(item.topic).toBeDefined();
        expect(EXPANDED_TOPICS).toContain(item.topic);
        expect(item.levelBand).toBeGreaterThanOrEqual(1);
        expect(item.levelBand).toBeLessThanOrEqual(10);
        expect(item.vocabNotes.length).toBeGreaterThanOrEqual(1);
        if (item.format === 'sentence_builder') {
          expect(item.orderedTokens?.length ?? 0).toBeGreaterThanOrEqual(3);
        } else {
          expect(item.choices?.length).toBe(4);
          expect(item.correctIndex).toBeGreaterThanOrEqual(0);
          expect(item.correctIndex).toBeLessThan(4);
        }
      }
    }
  });

  it('prioritizes non-farm topics (~80% vs ~20% farm) and resolves valid existing sprites', () => {
    const validSpriteKeys = new Set<string>([
      ...SPRITE_KEYS,
      'crest-gryffindor',
      'crest-slytherin',
      'crest-ravenclaw',
      'crest-hufflepuff',
    ]);
    const lexById = new Map(QUIZ_LEXICON_BANK.map((e) => [e.id, e]));
    const curById = new Map(CURATED_QUIZ_BANK.map((c) => [c.id, c]));

    const resolveTopic = (qId: string): QuizTopicId => {
      for (const prefix of ['vocab:', 'pairs:', 'cloze:', 'bubble:', 'tiles:'] as const) {
        if (qId.startsWith(prefix)) {
          return lexById.get(qId.slice(prefix.length))?.topic ?? 'farm';
        }
      }
      return curById.get(qId)?.topic ?? 'farm';
    };

    const verifySprite = (src?: string) => {
      if (!src) return;
      const m = src.match(/^\/game\/trang-trai-hang-soc\/sprites\/([a-z0-9_-]+)\.webp$/);
      expect(m, `Unexpected sprite URL format: ${src}`).not.toBeNull();
      expect(validSpriteKeys.has(m![1]), `Unregistered sprite key for ${src}`).toBe(true);
    };

    let totalDraws = 0;
    let nonFarmDraws = 0;
    const seenTopics = new Set<QuizTopicId>();

    for (const lang of ALL_LANGS) {
      for (const tier of ALL_TIERS) {
        const state = createInitialLanguageQuizState();
        state.activeLang = lang;
        state.profiles[lang].tier = tier;
        state.profiles[lang].masteryScore =
          tier === 'beginner' ? 12 : tier === 'intermediate' ? 52 : 86;
        const parkLevel = tier === 'beginner' ? 8 : tier === 'intermediate' ? 45 : 85;

        for (let i = 0; i < 30; i += 1) {
          const ch = generateNextQuizChallenge(state, parkLevel);
          const topic = resolveTopic(ch.qId);
          seenTopics.add(topic);
          totalDraws += 1;
          if (topic !== 'farm') nonFarmDraws += 1;

          verifySprite(ch.heroSpriteSrc);
          for (const s of ch.choiceSprites ?? []) verifySprite(s);
          for (const c of ch.leftCards ?? []) verifySprite(c.spriteSrc);
          for (const c of ch.rightCards ?? []) verifySprite(c.spriteSrc);

          recordQuizAttempt(state, ch, true, true);
        }
      }
    }

    // 5 langs * 3 tiers * 30 draws = 450 draws
    const nonFarmRatio = nonFarmDraws / totalDraws;
    expect(nonFarmRatio).toBeGreaterThanOrEqual(0.68);
    expect(nonFarmRatio).toBeLessThanOrEqual(0.92);

    // Every single one of the 5 newly added topics must appear across draws
    for (const topic of EXPANDED_TOPICS) {
      expect(seenTopics.has(topic), `Topic ${topic} never sampled`).toBe(true);
    }
  });
});
