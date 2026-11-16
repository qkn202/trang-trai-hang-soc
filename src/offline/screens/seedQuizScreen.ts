import {
  loadLanguageQuizPack,
  QUIZ_LANGUAGES,
  QUIZ_LEXICON_BANK,
} from '../../data/languageQuizBank';
import {
  generateNextQuizChallenge,
  getProfileSrsSummary,
  markQuizChallengeSkipped,
  recordQuizAttempt,
  setProfileTier,
  speakQuizText,
  type ActiveQuizChallenge,
  type QuizAttemptOutcome,
} from '../../sim/languageQuizEngine';
import type {
  QuizLanguageId,
  QuizProficiencyTier,
} from '../../types/game';
import { resolveOfflineAssetUrl } from '../offlineAssets';
import {
  escapeHtml,
  type OfflineScreenController,
  type OfflineScreenHost,
} from './screenContext';

const LANG_ORDER: ReadonlyArray<QuizLanguageId> = ['en', 'ko', 'zh', 'es', 'ja'];
const TIER_ORDER: ReadonlyArray<QuizProficiencyTier> = ['beginner', 'intermediate', 'advanced'];

export class SeedQuizOfflineScreen implements OfflineScreenController {
  private readonly host: OfflineScreenHost;
  private container: HTMLElement | null = null;
  private mounted = false;

  private challenge: ActiveQuizChallenge | null = null;
  private outcome: QuizAttemptOutcome | null = null;
  private selectedChoiceIdx: number | null = null;
  private placedTokenIndices: number[] = [];
  private selectedLeftPairId: string | null = null;
  private matchedPairIds = new Set<string>();
  private pairMistakes = 0;
  private subView: 'practice' | 'codex' = 'practice';
  private sessionShownIds = new Set<string>();
  private formatOffset = 0;

  constructor(host: OfflineScreenHost) {
    this.host = host;
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    this.mounted = true;
    this.nextQuestion();
    this.render();

    // Tải trước toàn bộ 5 gói ngôn ngữ từ các chunk đã được Service Worker precache
    const activeLang = this.host.state.seedQuiz.quizState.activeLang;
    void loadLanguageQuizPack(activeLang)
      .then(() => {
        if (this.mounted && !this.outcome) {
          this.render();
        }
        return Promise.all(LANG_ORDER.map((lid) => loadLanguageQuizPack(lid)));
      })
      .catch(() => {
        // Core bank in languageQuizBank.ts is always available synchronously even if chunk load fails
      });
  }

  public flushCheckpoint(): void {
    this.host.saveCheckpoint();
  }

  public destroy(): void {
    this.mounted = false;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // SpeechSynthesis guard
    }
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  private computeVirtualParkLevel(): number {
    return Math.max(1, Math.min(100, 1 + Math.floor(this.host.state.seedQuiz.totalCorrect / 4)));
  }

  private nextQuestion(): void {
    const sq = this.host.state.seedQuiz;
    this.outcome = null;
    this.selectedChoiceIdx = null;
    this.placedTokenIndices = [];
    this.selectedLeftPairId = null;
    this.matchedPairIds.clear();
    this.pairMistakes = 0;

    this.challenge = generateNextQuizChallenge(sq.quizState, this.computeVirtualParkLevel(), {
      excludeIds: this.sessionShownIds,
      formatOffset: this.formatOffset++,
    });
    this.sessionShownIds.add(this.challenge.qId);
    if (this.sessionShownIds.size > 160) {
      this.sessionShownIds.clear();
    }
  }

  private finalizeAttempt(correct: boolean): void {
    if (!this.challenge || this.outcome) return;
    const sq = this.host.state.seedQuiz;
    const res = recordQuizAttempt(sq.quizState, this.challenge, correct);
    this.outcome = res;

    sq.totalAnswered += 1;
    if (correct) {
      sq.totalCorrect += 1;
      sq.currentStreak += 1;
      if (sq.currentStreak > sq.bestStreak) {
        sq.bestStreak = sq.currentStreak;
      }
      const gainedScore = 100 + Math.min(250, sq.currentStreak * 20);
      sq.highScore += gainedScore;
      this.host.state.coins += 20 + Math.min(30, sq.currentStreak * 3);
      this.host.state.xp += res.xpAwarded;
      this.host.feedback.success();
    } else {
      sq.currentStreak = 0;
      this.host.feedback.error();
    }

    this.host.saveCheckpoint();
    this.render();
  }

  private renderPracticeBody(): string {
    const ch = this.challenge;
    if (!ch) return '';
    const isEn = this.host.state.settings.language === 'en';
    const answered = Boolean(this.outcome);

    const heroImgHtml = ch.heroSpriteSrc
      ? `<img src="${escapeHtml(resolveOfflineAssetUrl(ch.heroSpriteSrc))}" alt="" class="off-sq-hero-img" />`
      : '';

    let interactiveHtml = '';
    if (ch.choices && ch.choices.length > 0) {
      interactiveHtml = `
        <div class="off-sq-choices">
          ${ch.choices
            .map((choiceText, idx) => {
              const isCorrect = idx === ch.correctIndex;
              const isPicked = this.selectedChoiceIdx === idx;
              const stateCls = answered
                ? isCorrect
                  ? 'correct'
                  : isPicked
                    ? 'wrong'
                    : ''
                : '';
              const sp = ch.choiceSprites?.[idx];
              const sub = ch.choiceSubtitles?.[idx] || ch.choicePhonetics?.[idx] || '';
              return `
                <button
                  type="button"
                  class="off-sq-choice-btn ${stateCls}"
                  data-choice-idx="${idx}"
                  ${answered ? 'disabled' : ''}
                >
                  ${sp ? `<img src="${escapeHtml(resolveOfflineAssetUrl(sp))}" alt="" class="off-sq-choice-img" />` : ''}
                  <span class="off-sq-choice-text">
                    <strong>${escapeHtml(choiceText)}</strong>
                    ${sub ? `<small>${escapeHtml(sub)}</small>` : ''}
                  </span>
                </button>
              `;
            })
            .join('')}
        </div>
      `;
    } else if (ch.shuffledTokens && ch.expectedSentenceTokens) {
      const assembled = this.placedTokenIndices
        .map((tIdx) => ch.shuffledTokens!.find((t) => t.idx === tIdx))
        .filter((x): x is { idx: number; text: string } => Boolean(x));

      interactiveHtml = `
        <div class="off-sq-sentence-slot" aria-label="${isEn ? 'Assembled answer' : 'Câu đang ghép'}">
          ${
            assembled.length === 0
              ? `<span class="off-muted">${isEn ? 'Tap word tiles below in order…' : 'Chạm các thẻ từ bên dưới theo đúng thứ tự…'}</span>`
              : assembled
                  .map(
                    (tok, pos) => `
                    <button type="button" class="off-sq-token placed" data-remove-pos="${pos}" ${answered ? 'disabled' : ''}>
                      ${escapeHtml(tok.text)}
                    </button>
                  `
                  )
                  .join('')
          }
        </div>
        <div class="off-sq-token-bank">
          ${ch.shuffledTokens
            .map((tok) => {
              const used = this.placedTokenIndices.includes(tok.idx);
              return `
                <button
                  type="button"
                  class="off-sq-token"
                  data-add-token="${tok.idx}"
                  ${used || answered ? 'disabled' : ''}
                >${escapeHtml(tok.text)}</button>
              `;
            })
            .join('')}
        </div>
        ${
          !answered
            ? `<button type="button" class="off-ctrl-btn off-ctrl-primary off-sq-submit-btn" id="btnOffSqCheckSentence" ${
                this.placedTokenIndices.length === 0 ? 'disabled' : ''
              }>✓ ${isEn ? 'Check Answer' : 'Kiểm tra đáp án'}</button>`
            : ''
        }
      `;
    } else if (ch.leftCards && ch.rightCards) {
      interactiveHtml = `
        <div class="off-sq-pairs-grid">
          <div class="off-sq-pairs-col">
            ${ch.leftCards
              .map((card) => {
                const done = this.matchedPairIds.has(card.pairId);
                const sel = this.selectedLeftPairId === card.pairId;
                return `
                  <button
                    type="button"
                    class="off-sq-pair-btn ${done ? 'matched' : ''} ${sel ? 'selected' : ''}"
                    data-left-pair="${escapeHtml(card.pairId)}"
                    ${done || answered ? 'disabled' : ''}
                  >
                    <strong>${escapeHtml(card.word)}</strong>
                    ${card.phonetic ? `<small>${escapeHtml(card.phonetic)}</small>` : ''}
                  </button>
                `;
              })
              .join('')}
          </div>
          <div class="off-sq-pairs-col">
            ${ch.rightCards
              .map((card) => {
                const done = this.matchedPairIds.has(card.pairId);
                return `
                  <button
                    type="button"
                    class="off-sq-pair-btn ${done ? 'matched' : ''}"
                    data-right-pair="${escapeHtml(card.pairId)}"
                    ${done || answered ? 'disabled' : ''}
                  >
                    <span>${escapeHtml(card.shortVi || card.meaningVi)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    }

    const explanationHtml = this.outcome
      ? `
        <div class="off-sq-feedback ${this.outcome.correct ? 'ok' : 'err'}">
          <div class="off-sq-feedback-head">
            <strong>${
              this.outcome.correct
                ? isEn
                  ? '🌟 Correct! Saved to SRS Box'
                  : '🌟 Chính xác! Đã nâng bậc Hộp nhớ SRS'
                : isEn
                  ? '💡 Review Note'
                  : '💡 Ghi chú ôn tập'
            }</strong>
            <button type="button" class="off-ctrl-btn off-ctrl-primary" id="btnOffSqNext">
              ${isEn ? 'Next Question →' : 'Câu tiếp theo →'}
            </button>
          </div>
          <p class="off-sq-full">${escapeHtml(ch.fullSentence)} ${ch.fullPhonetic ? `<em>(${escapeHtml(ch.fullPhonetic)})</em>` : ''}</p>
          <p>${escapeHtml(ch.translationVi)}</p>
          <p class="off-muted">${escapeHtml(ch.grammarTitleVi)} — ${escapeHtml(ch.grammarExplainVi)}</p>
        </div>
      `
      : '';

    return `
      <article class="off-sq-card">
        <div class="off-sq-prompt-row">
          ${heroImgHtml}
          <div class="off-sq-prompt-copy">
            <small class="off-sq-chapter">${escapeHtml(ch.chapterTitleVi)}${ch.isReview ? ' • 🔄 SRS' : ''}</small>
            <h2>${escapeHtml(ch.promptVi)}</h2>
            <p class="off-sq-stem">${escapeHtml(ch.stemText)}</p>
            ${ch.stemPhonetic ? `<small class="off-muted">${escapeHtml(ch.stemPhonetic)}</small>` : ''}
          </div>
          <button type="button" class="off-icon-btn" id="btnOffSqSpeak" aria-label="${isEn ? 'Listen pronunciation' : 'Nghe phát âm'}">🔊</button>
        </div>

        ${interactiveHtml}
        ${explanationHtml}
      </article>
    `;
  }

  private renderCodexBody(): string {
    const sq = this.host.state.seedQuiz;
    const lang = sq.quizState.activeLang;
    const prof = sq.quizState.profiles[lang];
    const srs = getProfileSrsSummary(prof);
    const isEn = this.host.state.settings.language === 'en';
    const lexicon = QUIZ_LEXICON_BANK.filter((e) => e.lang === lang).slice(0, 60);

    return `
      <div class="off-sq-codex">
        <div class="off-sq-srs-strip">
          <span>📦 ${isEn ? 'Learning' : 'Đang học'}: <b>${srs.learningCount}</b></span>
          <span>⏰ ${isEn ? 'Due review' : 'Đến hạn ôn'}: <b>${srs.dueCount}</b></span>
          <span>👑 ${isEn ? 'Mastered (Box 5)' : 'Thuộc lòng (Hộp 5)'}: <b>${srs.masteredCount}</b></span>
        </div>
        <div class="off-sq-lex-list">
          ${lexicon
            .map(
              (entry) => `
              <div class="off-sq-lex-row">
                <div>
                  <strong>${escapeHtml(entry.word)}</strong>
                  <small class="off-muted">${escapeHtml(entry.phonetic)}</small>
                </div>
                <span>${escapeHtml(entry.meaningVi)}</span>
              </div>
            `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  public render(): void {
    if (!this.container) return;
    const { state } = this.host;
    const isEn = state.settings.language === 'en';
    const sq = state.seedQuiz;
    const activeLang = sq.quizState.activeLang;
    const prof = sq.quizState.profiles[activeLang];
    const langMeta = QUIZ_LANGUAGES[activeLang];

    this.container.innerHTML = `
      <section class="off-screen off-sq-screen" aria-label="${isEn ? 'Polyglot Spell Academy' : 'Học Viện Thần Chú Đa Ngữ'}">
        <header class="off-game-topbar">
          <button type="button" class="off-back-btn" id="btnOffSqBack">
            ← ${isEn ? 'Games' : 'Menu'}
          </button>
          <strong class="off-sq-title">${escapeHtml(langMeta.flag)} ${escapeHtml(isEn ? langMeta.nativeName : langMeta.nameVi)}</strong>
          <div class="off-topbar-right">
            <span class="off-coin-pill">🔥 <b>×${sq.currentStreak}</b></span>
            <button type="button" class="off-icon-btn" id="btnOffSqRecords" aria-label="Records">🏆</button>
          </div>
        </header>

        <div class="off-sq-toolbar toolbar">
          <div class="off-lang-pills" role="tablist">
            ${LANG_ORDER.map((lid) => {
              const m = QUIZ_LANGUAGES[lid];
              return `
                <button
                  type="button"
                  role="tab"
                  aria-selected="${activeLang === lid ? 'true' : 'false'}"
                  class="off-tab-btn ${activeLang === lid ? 'active' : ''}"
                  data-quiz-lang="${lid}"
                >${escapeHtml(m.flag)} ${lid.toUpperCase()}</button>
              `;
            }).join('')}
          </div>

          <div class="off-sq-subcontrols">
            <select id="selOffSqTier" class="off-select" aria-label="${isEn ? 'Proficiency tier' : 'Trình độ'}">
              ${TIER_ORDER.map(
                (t) =>
                  `<option value="${t}" ${prof.tier === t ? 'selected' : ''}>${escapeHtml(langMeta.tierLabels[t])}</option>`
              ).join('')}
            </select>
            <button type="button" class="off-ctrl-btn" id="btnOffSqToggleCodex">
              ${this.subView === 'codex' ? (isEn ? '✍️ Practice' : '✍️ Luyện câu') : isEn ? '📖 Lexicon' : '📖 Sổ tay SRS'}
            </button>
            ${
              this.subView === 'practice' && !this.outcome
                ? `<button type="button" class="off-ctrl-btn" id="btnOffSqSkip">⏭️ ${isEn ? 'Skip' : 'Đổi câu'}</button>`
                : ''
            }
          </div>
        </div>

        <div class="off-sq-body">
          ${this.subView === 'codex' ? this.renderCodexBody() : this.renderPracticeBody()}
        </div>
      </section>
    `;

    this.container.querySelector('#btnOffSqBack')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.navigateTo('home');
    });
    this.container.querySelector('#btnOffSqRecords')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openRecordsModal('seedQuiz');
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-quiz-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.quizLang as QuizLanguageId | undefined;
        if (!lid || lid === sq.quizState.activeLang) return;
        this.host.feedback.tap();
        sq.quizState.activeLang = lid;
        this.nextQuestion();
        this.host.saveCheckpoint();
        this.render();
      });
    });

    this.container.querySelector<HTMLSelectElement>('#selOffSqTier')?.addEventListener('change', (ev) => {
      const nextTier = (ev.currentTarget as HTMLSelectElement).value as QuizProficiencyTier;
      setProfileTier(sq.quizState, sq.quizState.activeLang, nextTier);
      this.nextQuestion();
      this.host.saveCheckpoint();
      this.render();
    });

    this.container.querySelector('#btnOffSqToggleCodex')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.subView = this.subView === 'codex' ? 'practice' : 'codex';
      this.render();
    });

    this.container.querySelector('#btnOffSqSkip')?.addEventListener('click', () => {
      if (this.challenge) {
        markQuizChallengeSkipped(sq.quizState, this.challenge);
      }
      this.host.feedback.tap();
      this.nextQuestion();
      this.host.saveCheckpoint();
      this.render();
    });

    this.container.querySelector('#btnOffSqSpeak')?.addEventListener('click', () => {
      if (!this.challenge) return;
      const ok = speakQuizText(
        this.challenge.ttsPromptText || this.challenge.fullSentence,
        this.challenge.lang
      );
      if (!ok) {
        this.host.feedback.tap();
      }
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-choice-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.outcome) return;
        const idx = Number(btn.dataset.choiceIdx);
        this.selectedChoiceIdx = idx;
        this.finalizeAttempt(idx === this.challenge.correctIndex);
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-add-token]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.outcome) return;
        const idx = Number(btn.dataset.addToken);
        if (!this.placedTokenIndices.includes(idx)) {
          this.host.feedback.tap();
          this.placedTokenIndices.push(idx);
          this.render();
        }
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-remove-pos]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.outcome) return;
        const pos = Number(btn.dataset.removePos);
        this.host.feedback.tap();
        this.placedTokenIndices.splice(pos, 1);
        this.render();
      });
    });

    this.container.querySelector('#btnOffSqCheckSentence')?.addEventListener('click', () => {
      if (!this.challenge?.shuffledTokens || !this.challenge.expectedSentenceTokens) return;
      const chosenWords = this.placedTokenIndices.map(
        (idx) => this.challenge!.shuffledTokens!.find((t) => t.idx === idx)?.text ?? ''
      );
      const isRight =
        chosenWords.join(' ').trim() === this.challenge.expectedSentenceTokens.join(' ').trim();
      this.finalizeAttempt(isRight);
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-left-pair]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.outcome) return;
        this.host.feedback.tap();
        this.selectedLeftPairId = btn.dataset.leftPair ?? null;
        this.render();
      });
    });

    this.container.querySelectorAll<HTMLButtonElement>('[data-right-pair]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge?.leftCards || this.outcome || !this.selectedLeftPairId) return;
        const rightId = btn.dataset.rightPair ?? '';
        if (rightId === this.selectedLeftPairId) {
          this.host.feedback.tap();
          this.matchedPairIds.add(rightId);
          this.selectedLeftPairId = null;
          if (this.matchedPairIds.size >= this.challenge.leftCards.length) {
            this.finalizeAttempt(this.pairMistakes <= 2);
            return;
          }
        } else {
          this.pairMistakes += 1;
          this.host.feedback.error();
          this.selectedLeftPairId = null;
        }
        this.render();
      });
    });

    this.container.querySelector('#btnOffSqNext')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.nextQuestion();
      this.render();
    });
  }
}
