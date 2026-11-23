import {
  QUIZ_LANGUAGES,
  QUIZ_TOPIC_LABELS_VI,
  CuratedQuizItem,
  QuizLexiconEntry,
  QuizTopicId,
} from '../languageQuizBank';
import { QuizLanguageId, QuizProficiencyTier } from '../../types/game';

export type CompactLexTuple = [
  idSuffix: string,
  word: string,
  phonetic: string,
  posVi: string,
  meaningVi: string,
  exampleSentence: string,
  examplePhonetic: string,
  exampleVi: string,
];

export function buildPackLexicon(
  lang: QuizLanguageId,
  band: number,
  tier: QuizProficiencyTier,
  rows: CompactLexTuple[],
  topic: QuizTopicId = 'farm'
): QuizLexiconEntry[] {
  const tierLbl = QUIZ_LANGUAGES[lang].tierLabels[tier];
  const topicLbl = QUIZ_TOPIC_LABELS_VI[topic];
  return rows.map(([idSuffix, word, phonetic, posVi, meaningVi, exampleSentence, examplePhonetic, exampleVi]) => ({
    id: `${lang}_pk_${band}_${idSuffix}`,
    lang,
    tier,
    levelBand: band,
    topic,
    word,
    phonetic,
    posVi,
    meaningVi,
    exampleSentence,
    examplePhonetic,
    exampleVi,
    grammarNoteVi: `${topicLbl} · ${tierLbl} — ghi nhớ sắc thái "${word}" (${posVi}: ${meaningVi}) qua câu ngữ cảnh.`,
  }));
}

export interface LanguageQuizPackModule {
  EXTRA_LEXICON: QuizLexiconEntry[];
  EXTRA_CURATED: CuratedQuizItem[];
}
