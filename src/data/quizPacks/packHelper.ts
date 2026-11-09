import { QUIZ_LANGUAGES, CuratedQuizItem, QuizLexiconEntry } from '../languageQuizBank';
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
  rows: CompactLexTuple[]
): QuizLexiconEntry[] {
  const tierLbl = QUIZ_LANGUAGES[lang].tierLabels[tier];
  return rows.map(([idSuffix, word, phonetic, posVi, meaningVi, exampleSentence, examplePhonetic, exampleVi]) => ({
    id: `${lang}_pk_${band}_${idSuffix}`,
    lang,
    tier,
    levelBand: band,
    word,
    phonetic,
    posVi,
    meaningVi,
    exampleSentence,
    examplePhonetic,
    exampleVi,
    grammarNoteVi: `Từ vựng trọng tâm ${tierLbl} (Cấp ${(band - 1) * 10 + 1}–${band * 10}) — ghi nhớ sắc thái "${word}" (${posVi}: ${meaningVi}) qua câu ngữ cảnh.`,
  }));
}

export interface LanguageQuizPackModule {
  EXTRA_LEXICON: QuizLexiconEntry[];
  EXTRA_CURATED: CuratedQuizItem[];
}
