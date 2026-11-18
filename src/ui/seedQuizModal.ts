import '../styles/seedQuizModal.css';
import {
  FARM_CROPS,
  formatDurationCompactVi,
  getFarmItemIconSrc,
} from '../data/catalog';
import {
  isLanguageQuizPackLoaded,
  loadLanguageQuizPack,
  QUIZ_LANGUAGES,
  QUIZ_LEXICON_BANK,
  QuizLexiconEntry,
} from '../data/languageQuizBank';
import {
  ActiveQuizChallenge,
  formatShortKidMeaningVi,
  generateNextQuizChallenge,
  getQuizVisualCardMeta,
  markQuizChallengeSkipped,
  QuizAttemptOutcome,
  setProfileTier,
  speakQuizText,
} from '../sim/languageQuizEngine';
import { ParkSimulation } from '../sim/simulation';
import {
  FarmCropId,
  LanguageProfileState,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
} from '../types/game';
import { MINIGAME_ZOOM_STEP, sharedMinigameViewport } from './minigameViewControls';
import { compactSickle } from '../hpvn/toolIcons';

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ALL_LANG_IDS: QuizLanguageId[] = ['en', 'ko', 'zh', 'es', 'ja'];
const ALL_FORMAT_KEYS: Array<'all' | QuizFormatKind> = [
  'all',
  'grammar_cloze',
  'dialogue_reply',
  'sentence_builder',
  'match_pairs',
  'vocab_context',
];

export class SeedQuizModalController {
  private root: HTMLElement;
  private sim: ParkSimulation;
  private onRefreshHud: () => void;
  private onToast: (msg: string, icon?: string) => void;
  private onEquipAndSow: (cropId: FarmCropId, pendingPlotUid: string | null) => void;

  private targetCropId: FarmCropId = 'ottery_wheat';
  private pendingPlotUid: string | null = null;
  private challenge: ActiveQuizChallenge | null = null;
  private capNoticeShown = false; // HPVN: daily-cap notice shown once
  private answeredOutcome: (QuizAttemptOutcome & { newSeedCount: number; cropName: string }) | null =
    null;

  // Interactive per-question UI state
  private selectedChoiceIdx: number | null = null;
  private placedTokenIndices: number[] = [];
  private selectedLeftPairId: string | null = null;
  private matchedPairIds = new Set<string>();
  private flashWrongPairKey: string | null = null;
  private pairMistakes = 0;
  private activeSubView: 'practice' | 'codex' = 'practice';
  private codexQuery = '';
  private codexBoxFilter: 'all' | 'mastered' | 'learning' | 'unseen' = 'all';
  private sessionShownQids = new Set<string>();
  private skipFormatOffset = 0;
  private starterChallengePendingPack = false;
  private dialogCloseBound = false;
  public onOpenLeaderboard?: () => void;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    onRefreshHud: () => void,
    onToast: (msg: string, icon?: string) => void,
    onEquipAndSow: (cropId: FarmCropId, pendingPlotUid: string | null) => void
  ) {
    this.root = root;
    this.sim = sim;
    this.onRefreshHud = onRefreshHud;
    this.onToast = onToast;
    this.onEquipAndSow = onEquipAndSow;

    if (typeof window !== 'undefined') {
      const handleSeedQuizViewportResize = () => {
        if (!this.isOpen()) return;
        const dlg = this.getDialog();
        const modalInner =
          typeof dlg?.querySelector === 'function'
            ? (dlg.querySelector('.sq-modal-inner') as HTMLElement | null)
            : null;
        sharedMinigameViewport.applyDialogOrientation(dlg, modalInner, true);
        this.syncSeedQuizViewportTransform();
      };
      window.addEventListener('resize', handleSeedQuizViewportResize);
      window.visualViewport?.addEventListener('resize', handleSeedQuizViewportResize);

      window.addEventListener('keydown', (ev) => {
        if (!this.isOpen()) return;
        const tag = (ev.target as HTMLElement | null)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (ev.key === '+' || ev.key === '=') {
          ev.preventDefault();
          sharedMinigameViewport.stepZoom('seedquiz', MINIGAME_ZOOM_STEP);
          this.syncSeedQuizViewportTransform();
        } else if (ev.key === '-' || ev.key === '_') {
          ev.preventDefault();
          sharedMinigameViewport.stepZoom('seedquiz', -MINIGAME_ZOOM_STEP);
          this.syncSeedQuizViewportTransform();
        } else if (ev.key === '0' && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          sharedMinigameViewport.resetView('seedquiz');
          this.syncSeedQuizViewportTransform();
        }
      });
    }
  }

  private getDialog(): HTMLDialogElement | null {
    return this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
  }

  private isOpen(): boolean {
    return Boolean(this.getDialog()?.open);
  }

  private syncSeedQuizViewportTransform(): void {
    const container = this.root.querySelector('#seedQuizDialogContent') as HTMLElement | null;
    if (!container) return;
    const scrollViewportEl = container.querySelector('#sqScrollViewport') as HTMLElement | null;
    const sizerEl = container.querySelector('#sqZoomSizer') as HTMLElement | null;
    const contentStageEl = container.querySelector('#sqZoomStage') as HTMLElement | null;
    sharedMinigameViewport.applyDomScrollStageTransform(scrollViewportEl, sizerEl, contentStageEl);
    sharedMinigameViewport.syncToolbarDOM(container, 'seedquiz');
  }

  public open(
    cropId?: FarmCropId,
    pendingPlotUid?: string | null,
    overrideLang?: QuizLanguageId,
    overrideTier?: QuizProficiencyTier,
    overrideFormat?: 'all' | QuizFormatKind,
    overrideSubView?: 'practice' | 'codex'
  ): void {
    if (overrideSubView === 'practice' || overrideSubView === 'codex') {
      this.activeSubView = overrideSubView;
    }
    const unlockedCrops = Object.values(FARM_CROPS).filter(
      (c) => this.sim.state.sandboxMode || this.sim.state.level >= c.unlockLevel
    );
    if (cropId && FARM_CROPS[cropId]) {
      const c = FARM_CROPS[cropId];
      if (this.sim.state.sandboxMode || this.sim.state.level >= c.unlockLevel) {
        this.targetCropId = cropId;
      } else if (unlockedCrops.length > 0) {
        this.targetCropId = unlockedCrops[0].id;
      }
    } else if (!FARM_CROPS[this.targetCropId] && unlockedCrops.length > 0) {
      this.targetCropId = unlockedCrops[0].id;
    }

    this.pendingPlotUid = pendingPlotUid ?? null;
    if (!this.pendingPlotUid) {
      this.sim.setLastPlayedMinigame('seedquiz');
    }

    const quiz = this.sim.ensureLanguageQuiz();
    let needFreshChallenge = !this.challenge || this.answeredOutcome !== null;

    if (overrideLang && ALL_LANG_IDS.includes(overrideLang) && quiz.activeLang !== overrideLang) {
      quiz.activeLang = overrideLang;
      needFreshChallenge = true;
    }
    if (
      overrideTier &&
      (overrideTier === 'beginner' ||
        overrideTier === 'intermediate' ||
        overrideTier === 'advanced')
    ) {
      setProfileTier(quiz, quiz.activeLang, overrideTier);
      needFreshChallenge = true;
    }
    if (overrideFormat && ALL_FORMAT_KEYS.includes(overrideFormat)) {
      quiz.preferredFormat = overrideFormat;
      needFreshChallenge = true;
    }

    if (needFreshChallenge || this.challenge?.lang !== quiz.activeLang) {
      if (this.challenge && !this.answeredOutcome) {
        markQuizChallengeSkipped(quiz, this.challenge);
      }
      this.loadNextQuestion(true);
    } else {
      this.ensureActiveLangPackLoaded(quiz.activeLang, false);
      this.render();
    }

    const dlg = this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    this.onRefreshHud();
  }

  private recordSessionShownQid(qId: string): void {
    this.sessionShownQids.delete(qId);
    this.sessionShownQids.add(qId);
    while (this.sessionShownQids.size > 350) {
      const oldest = this.sessionShownQids.values().next().value;
      if (oldest === undefined) break;
      this.sessionShownQids.delete(oldest);
    }
  }

  private hasUserInteractedWithCurrentQuestion(): boolean {
    return (
      this.answeredOutcome !== null ||
      this.selectedChoiceIdx !== null ||
      this.placedTokenIndices.length > 0 ||
      this.matchedPairIds.size > 0 ||
      this.selectedLeftPairId !== null
    );
  }

  private ensureActiveLangPackLoaded(lang: QuizLanguageId, autoSpeakWhenReady = false): void {
    if (isLanguageQuizPackLoaded(lang)) return;
    void loadLanguageQuizPack(lang).then((loaded) => {
      const quiz = this.sim.ensureLanguageQuiz();
      if (quiz.activeLang !== lang) return;

      if (loaded) {
        if (this.starterChallengePendingPack && !this.hasUserInteractedWithCurrentQuestion()) {
          this.starterChallengePendingPack = false;
          this.challenge = generateNextQuizChallenge(quiz, this.sim.state.level, {
            excludeIds: this.sessionShownQids,
            formatOffset: this.skipFormatOffset,
          });
          this.recordSessionShownQid(this.challenge.qId);
          this.render();
          if (
            autoSpeakWhenReady &&
            quiz.autoSpeak &&
            this.challenge &&
            this.activeSubView === 'practice'
          ) {
            const textToRead = this.challenge.ttsPromptText || this.challenge.fullSentence;
            if (textToRead) {
              speakQuizText(textToRead, this.challenge.lang, 0.94);
            }
          }
          return;
        }
        this.starterChallengePendingPack = false;
        if (this.challenge) {
          this.recordSessionShownQid(this.challenge.qId);
        }
        if (!this.answeredOutcome) {
          this.render();
        }
        return;
      }

      // Offline fallback: keep starter challenge, record it, and speak if requested
      this.starterChallengePendingPack = false;
      if (this.challenge) {
        this.recordSessionShownQid(this.challenge.qId);
      }
      if (
        autoSpeakWhenReady &&
        quiz.autoSpeak &&
        this.challenge &&
        !this.answeredOutcome &&
        this.activeSubView === 'practice'
      ) {
        const textToRead = this.challenge.ttsPromptText || this.challenge.fullSentence;
        if (textToRead) {
          speakQuizText(textToRead, this.challenge.lang, 0.94);
        }
      }
    });
  }

  public close(): void {
    const dlg = this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
    if (dlg?.open) {
      dlg.close();
    }
  }

  private resetInteractiveQuestionState(): void {
    this.answeredOutcome = null;
    this.selectedChoiceIdx = null;
    this.placedTokenIndices = [];
    this.selectedLeftPairId = null;
    this.matchedPairIds.clear();
    this.flashWrongPairKey = null;
    this.pairMistakes = 0;
  }

  private loadNextQuestion(autoSpeakIfEnabled = true): void {
    this.resetInteractiveQuestionState();
    const quiz = this.sim.ensureLanguageQuiz();
    const packReady = isLanguageQuizPackLoaded(quiz.activeLang);

    this.challenge = generateNextQuizChallenge(quiz, this.sim.state.level, {
      excludeIds: this.sessionShownQids,
      formatOffset: this.skipFormatOffset,
    });

    if (packReady) {
      this.starterChallengePendingPack = false;
      this.recordSessionShownQid(this.challenge.qId);
    } else {
      this.starterChallengePendingPack = true;
      this.ensureActiveLangPackLoaded(quiz.activeLang, autoSpeakIfEnabled);
    }

    this.sim.saveToStorage();
    this.render();
    const modalInner = this.root.querySelector(
      '#seedQuizDialog .sq-modal-inner'
    ) as HTMLElement | null;
    if (modalInner) {
      modalInner.scrollTop = 0;
    }

    if (packReady && autoSpeakIfEnabled && quiz.autoSpeak && this.challenge) {
      const textToRead = this.challenge.ttsPromptText || this.challenge.fullSentence;
      if (textToRead) {
        speakQuizText(textToRead, this.challenge.lang, 0.94);
      }
    }
  }

  private submitAttempt(correct: boolean): void {
    if (!this.challenge || this.answeredOutcome) return;
    const outcome = this.sim.completeSeedLanguageQuizAttempt(
      this.targetCropId,
      this.challenge,
      correct
    );
    this.answeredOutcome = outcome;

    const quiz = this.sim.ensureLanguageQuiz();
    if (quiz.autoSpeak) {
      speakQuizText(this.challenge.fullSentence, this.challenge.lang, 0.95);
    }

    const crop = FARM_CROPS[this.targetCropId];
    if (outcome.correct && outcome.practice) {
      // HPVN: past the daily cap the answer is practice only; say so once
      if (!this.capNoticeShown) {
        this.capNoticeShown = true;
        this.onToast('Hôm nay đã nhận đủ 30 câu có thưởng, giờ là luyện tập', '📖');
      }
    } else if (outcome.correct) {
      const promoNote = outcome.tierAutoPromoted
        ? ` • Thăng hạng ${QUIZ_LANGUAGES[this.challenge.lang].tierLabels[outcome.tierAutoPromoted]}!`
        : '';
      const talismanNote = outcome.phoenixTalismanAwarded
        ? ` • 🔥 +${outcome.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`
        : '';
      const buildNote =
        outcome.buildReduction && outcome.buildReduction.reducedSec > 0
          ? outcome.buildReduction.ecoReduced
            ? ` • ⏱️ -${formatDurationCompactVi(outcome.buildReduction.reducedSec)} cho cây đang lớn, thú nuôi & xưởng${outcome.buildReduction.targetName ? `, xây ${outcome.buildReduction.targetName}` : ''}!`
            : ` • 🔨 -${formatDurationCompactVi(outcome.buildReduction.reducedSec)} xây ${outcome.buildReduction.targetName ?? 'công trình'}!`
          : '';
      const rankNote =
        outcome.leaderboardRankUp && outcome.leaderboardRankUp.rankUpBy > 0
          ? ` • 🏆 Lên Hạng #${outcome.leaderboardRankUp.newRank} (+${outcome.leaderboardRankUp.rankUpBy} bậc)!`
          : '';
      this.onToast(
        `🪄 Chuẩn xác thần chú! Nhận +${outcome.seedsAwarded} hạt ${crop.emoji} ${crop.name} (Túi: ${outcome.newSeedCount} hạt)${buildNote}${promoNote}${talismanNote}${rankNote}`,
        outcome.phoenixTalismanAwarded ? '🔥' : '🌱'
      );
    }

    this.onRefreshHud();
    this.render();
    requestAnimationFrame(() => {
      const expEl = this.root.querySelector(
        '#seedQuizDialog .sq-explain-card'
      ) as HTMLElement | null;
      expEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  private handleSowEquippedSeed(): void {
    const count = this.sim.getSeedCount(this.targetCropId);
    if (count <= 0) {
      this.onToast('Túi hạt đang trống — hãy mua bằng Sickle hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!', '🌱');
      return;
    }
    const targetPlot = this.pendingPlotUid;
    this.pendingPlotUid = null;
    this.close();
    this.onEquipAndSow(this.targetCropId, targetPlot);
  }

  private handleBuySeedsWithSickle(qty: number): void {
    const res = this.sim.buyCropSeedWithGold(this.targetCropId, qty);
    this.onToast(res.msg, res.ok ? '🌱' : '🪙');
    if (res.ok) {
      this.onRefreshHud();
      this.render();
    }
  }

  public render(): void {
    const container = this.root.querySelector('#seedQuizDialogContent') as HTMLElement | null;
    if (!container) return;

    const dlg = this.getDialog();
    const modalInner =
      typeof dlg?.querySelector === 'function'
        ? (dlg.querySelector('.sq-modal-inner') as HTMLElement | null)
        : null;
    if (dlg && typeof dlg.addEventListener === 'function' && !this.dialogCloseBound) {
      this.dialogCloseBound = true;
      dlg.addEventListener('close', () => {
        if (dlg.open) return;
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try {
            window.speechSynthesis.cancel();
          } catch {
            // Ignore TTS cancel errors
          }
        }
        const inner =
          typeof dlg.querySelector === 'function'
            ? (dlg.querySelector('.sq-modal-inner') as HTMLElement | null)
            : null;
        sharedMinigameViewport.clearDialogOrientation(dlg, inner);
      });
    }
    sharedMinigameViewport.applyDialogOrientation(dlg, modalInner, true);

    const prevScrollEl = container.querySelector('#sqScrollViewport') as HTMLElement | null;
    const prevScrollTop = prevScrollEl ? prevScrollEl.scrollTop : 0;
    const prevScrollLeft = prevScrollEl ? prevScrollEl.scrollLeft : 0;

    const quiz = this.sim.ensureLanguageQuiz();
    const activeLang = quiz.activeLang;
    const langMeta = QUIZ_LANGUAGES[activeLang];
    const profile = quiz.profiles[activeLang];
    const crop = FARM_CROPS[this.targetCropId];
    const seedCount = this.sim.getSeedCount(this.targetCropId);

    const headerSubBtn = dlg?.querySelector('#btnSqHeaderSubView') as HTMLButtonElement | null;
    if (headerSubBtn) {
      headerSubBtn.textContent = this.activeSubView === 'codex' ? 'Luyện tập' : 'Từ điển';
      headerSubBtn.setAttribute('aria-pressed', String(this.activeSubView === 'codex'));
      headerSubBtn.onclick = () => {
        this.sim.audio.playClick();
        this.activeSubView = this.activeSubView === 'codex' ? 'practice' : 'codex';
        if (this.activeSubView === 'codex') {
          const q = this.sim.ensureLanguageQuiz();
          this.ensureActiveLangPackLoaded(q.activeLang);
        }
        this.render();
      };
    }

    // 1. Compact Crop Target Select (grouped by Cây trồng / Hoa)
    const allCropList = Object.values(FARM_CROPS).sort(
      (a, b) => a.unlockLevel - b.unlockLevel || a.growSec - b.growSec
    );
    const renderCropOptions = (isFlowerGroup: boolean) =>
      allCropList
        .filter((c) => Boolean(c.isFlowerCrop) === isFlowerGroup)
        .map((c) => {
          const locked = !this.sim.state.sandboxMode && this.sim.state.level < c.unlockLevel;
          const active = c.id === this.targetCropId;
          const sCount = this.sim.getSeedCount(c.id);
          const label = locked
            ? `Cấp ${c.unlockLevel} · ${c.name}`
            : `${c.name} (×${sCount})`;
          return `<option value="${c.id}" ${active ? 'selected' : ''} ${locked ? 'disabled' : ''}>${escapeHtml(label)}</option>`;
        })
        .join('');

    // 2. Language Tabs (Anh · Hàn · Trung · TBN · Nhật)
    const langTabsHtml = ALL_LANG_IDS.map((lid) => {
      const m = QUIZ_LANGUAGES[lid];
      const p = quiz.profiles[lid];
      const isAct = lid === activeLang;
      const shortName = lid === 'es' ? 'TBN' : m.tabVi;
      return `
        <button
          type="button"
          role="tab"
          class="sq-lang-tab ${isAct ? 'active' : ''}"
          data-sq-lang="${lid}"
          aria-selected="${isAct}"
          title="${escapeHtml(m.nameVi)} · Cấp ${p.masteryScore}"
        >${escapeHtml(shortName)}</button>
      `;
    }).join('');

    // 3. Tier & Format Selects
    const tiers: Array<{ id: QuizProficiencyTier; label: string }> = [
      { id: 'beginner', label: 'Tập Sự' },
      { id: 'intermediate', label: 'O.W.L.' },
      { id: 'advanced', label: 'N.E.W.T.' },
    ];
    const tierOptionsHtml = tiers
      .map(
        (t) =>
          `<option value="${t.id}" ${profile.tier === t.id ? 'selected' : ''}>${escapeHtml(t.label)}</option>`
      )
      .join('');

    const formatNames: Record<'all' | QuizFormatKind, string> = {
      all: 'Đủ dạng',
      vocab_context: 'Nhìn tranh',
      dialogue_reply: 'Đập bóng',
      grammar_cloze: 'Điền từ',
      sentence_builder: 'Ghép chữ',
      match_pairs: 'Nối cặp',
    };
    const formatOptionsHtml = ALL_FORMAT_KEYS.map(
      (fk) =>
        `<option value="${fk}" ${quiz.preferredFormat === fk ? 'selected' : ''}>${escapeHtml(formatNames[fk])}</option>`
    ).join('');

    const challengeHtml = this.challenge ? this.renderChallengeStage(this.challenge) : '';
    const isAnswered = this.answeredOutcome !== null;
    const isSandbox = Boolean(this.sim.state.sandboxMode);
    const galleons = this.sim.state.galleons;
    const cost1 = crop.seedCost;
    const cost3 = crop.seedCost * 3;
    const buyCost1Label = isSandbox ? '0' : cost1.toLocaleString('vi-VN');
    const buyCost3Label = isSandbox ? '0' : cost3.toLocaleString('vi-VN');

    container.innerHTML = `
      <div class="sq-scroll-viewport" id="sqScrollViewport">
        <div class="sq-zoom-sizer" id="sqZoomSizer">
          <div class="sq-zoom-stage" id="sqZoomStage">
            <div class="sq-root">
              <div class="sq-lang-tabs" role="tablist" aria-label="Chọn ngôn ngữ">${langTabsHtml}</div>
              ${
                this.activeSubView === 'codex'
                  ? this.renderLexiconCodexPanel(activeLang, profile)
                  : `
                    <div class="sq-setup-row" title="${escapeHtml(langMeta.tierLabels[profile.tier])}">
                      <img src="${getFarmItemIconSrc(crop.id)}" alt="" width="22" height="22" class="sq-crop-pill-img" />
                      <select id="selSqTargetCrop" class="sq-select sq-crop-select" aria-label="Chọn hạt giống nhận thưởng">
                        <optgroup label="Cây trồng">${renderCropOptions(false)}</optgroup>
                        <optgroup label="Hoa">${renderCropOptions(true)}</optgroup>
                      </select>
                      ${
                        seedCount > 0
                          ? `<button id="btnSqSowNow" type="button" class="brass-btn gold-cta sq-sow-cta">Gieo ×${seedCount}</button>`
                          : ''
                      }
                      <select id="selSqTier" class="sq-select sq-tier-select" aria-label="Chọn cấp độ">${tierOptionsHtml}</select>
                    </div>
                    <div class="sq-buy-row" role="group" aria-label="Mua hạt giống bằng Sickle">
                      <button
                        id="btnSqBuy1"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!isSandbox && galleons < cost1}"
                        title="Mua 1 hạt ${escapeHtml(crop.name)} (${cost1.toLocaleString('vi-VN')} Sickle)"
                      >+1 hạt · 🪙${buyCost1Label}</button>
                      <button
                        id="btnSqBuy3"
                        type="button"
                        class="brass-btn sq-tool-pill sq-buy-pill"
                        data-unaffordable="${!isSandbox && galleons < cost3}"
                        title="Mua 3 hạt ${escapeHtml(crop.name)} (${cost3.toLocaleString('vi-VN')} Sickle)"
                      >+3 hạt · 🪙${buyCost3Label}</button>
                      <span class="sq-sickle-chip" title="Số dư Sickle hiện có">
                        <span class="g-coin">S</span>
                        <strong>${isSandbox ? '∞' : compactSickle(galleons)}</strong>
                      </span>
                    </div>
                    <div class="sq-tools-row">
                      <select id="selSqFormat" class="sq-select sq-format-select" aria-label="Chọn dạng câu hỏi">${formatOptionsHtml}</select>
                      <button id="btnSqAutoSpeak" type="button" class="brass-btn sq-tool-pill" aria-pressed="${quiz.autoSpeak}">Tự đọc</button>
                      <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tool-pill" title="Nghe chậm">Chậm</button>
                      ${
                        !isAnswered
                          ? `<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tool-pill" title="Đổi câu khác">Đổi</button>`
                          : ''
                      }
                    </div>
                    ${challengeHtml}
                  `
              }
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindRenderedEvents(container);

    const nextScrollEl = container.querySelector('#sqScrollViewport') as HTMLElement | null;
    if (nextScrollEl && (prevScrollTop > 0 || prevScrollLeft > 0)) {
      nextScrollEl.scrollTop = prevScrollTop;
      nextScrollEl.scrollLeft = prevScrollLeft;
    }
  }

  private getLexiconEntrySrsInfo(
    profile: LanguageProfileState,
    entryId: string
  ): { box: number; due: boolean } {
    const boxes = profile.srsBoxes ?? {};
    let box = 0;
    let due = false;
    for (const prefix of ['vocab:', 'pairs:', 'cloze:', 'bubble:', 'tiles:'] as const) {
      const rec = boxes[`${prefix}${entryId}`];
      if (!rec) continue;
      if (rec.box > box) box = rec.box;
      if (rec.box < 5 && rec.dueAtTurn <= profile.totalAnswered) {
        due = true;
      }
    }
    return { box, due };
  }

  private getLanguageLexiconEntries(lang: QuizLanguageId): QuizLexiconEntry[] {
    return QUIZ_LEXICON_BANK.filter((e) => e.lang === lang).sort(
      (a, b) => a.levelBand - b.levelBand || a.id.localeCompare(b.id)
    );
  }

  private renderLexiconCodexPanel(lang: QuizLanguageId, profile: LanguageProfileState): string {
    const allEntries = this.getLanguageLexiconEntries(lang);
    let masteredCount = 0;
    let learningCount = 0;
    let unseenCount = 0;
    for (const entry of allEntries) {
      const { box } = this.getLexiconEntrySrsInfo(profile, entry.id);
      if (box >= 5) masteredCount += 1;
      else if (box >= 1) learningCount += 1;
      else unseenCount += 1;
    }

    const filterBtns = (
      [
        { id: 'all', label: `Tất cả (${allEntries.length})` },
        { id: 'mastered', label: `Thuộc (${masteredCount})` },
        { id: 'learning', label: `Đang học (${learningCount})` },
        { id: 'unseen', label: `Mới (${unseenCount})` },
      ] as const
    )
      .map(
        (f) => `
          <button
            type="button"
            class="sq-format-chip ${this.codexBoxFilter === f.id ? 'active' : ''}"
            data-sq-codex-filter="${f.id}"
            aria-pressed="${this.codexBoxFilter === f.id}"
          >${f.label}</button>
        `
      )
      .join('');

    return `
      <div class="sq-codex-panel">
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="Tìm từ..."
            value="${escapeHtml(this.codexQuery)}"
            aria-label="Tra cứu Sổ Tay Cổ Ngữ"
          />
          <div class="sq-codex-filters" role="group" aria-label="Lọc theo Hộp SRS">${filterBtns}</div>
        </div>
        <div id="sqCodexResultsMount">
          ${this.renderLexiconCodexRowsHtml(lang, profile, allEntries)}
        </div>
      </div>
    `;
  }

  private renderLexiconCodexRowsHtml(
    lang: QuizLanguageId,
    profile: LanguageProfileState,
    allEntries?: QuizLexiconEntry[]
  ): string {
    const entries = allEntries ?? this.getLanguageLexiconEntries(lang);
    const q = this.codexQuery.trim().toLowerCase();
    const filtered = entries.filter((entry) => {
      const { box } = this.getLexiconEntrySrsInfo(profile, entry.id);
      if (this.codexBoxFilter === 'mastered' && box < 5) return false;
      if (this.codexBoxFilter === 'learning' && (box < 1 || box >= 5)) return false;
      if (this.codexBoxFilter === 'unseen' && box > 0) return false;
      if (!q) return true;
      return (
        entry.word.toLowerCase().includes(q) ||
        entry.phonetic.toLowerCase().includes(q) ||
        entry.meaningVi.toLowerCase().includes(q) ||
        entry.exampleSentence.toLowerCase().includes(q) ||
        entry.exampleVi.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      return `
        <div class="sq-codex-empty">
          Không có mục từ phù hợp.
        </div>
      `;
    }

    const rowsHtml = filtered
      .map((entry) => {
        const { box, due } = this.getLexiconEntrySrsInfo(profile, entry.id);
        const vis = getQuizVisualCardMeta(entry.meaningVi, entry.word, entry.id);
        let badgeCls = 'is-unseen';
        let badgeText = `Quyển ${entry.levelBand}`;
        if (box >= 5) {
          badgeCls = 'is-box5';
          badgeText = 'Thuộc';
        } else if (box >= 1) {
          badgeCls = due ? 'is-due' : 'is-learning';
          badgeText = `Hộp ${box}/5${due ? ' · Ôn' : ''}`;
        }
        return `
          <article class="sq-codex-row" role="listitem">
            <img src="${vis.spriteSrc}" alt="" class="sq-codex-pic" />
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${escapeHtml(entry.word)}</strong>
                <span class="sq-vocab-ph">[${escapeHtml(entry.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${escapeHtml(vis.shortVi)}</span>
              </div>
              <span class="sq-codex-srs ${badgeCls}">${badgeText}</span>
            </div>
            <button
              type="button"
              class="brass-btn sq-vocab-speak"
              data-sq-codex-word="${escapeHtml(entry.id)}"
              title="Nghe phát âm từ ${escapeHtml(entry.word)}"
            >Nghe</button>
          </article>
        `;
      })
      .join('');

    return `
      <div class="sq-codex-list" role="list">${rowsHtml}</div>
    `;
  }

  private bindCodexRowSpeakEvents(scope: ParentNode, lang: QuizLanguageId): void {
    scope.querySelectorAll<HTMLButtonElement>('[data-sq-codex-word]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const eid = btn.dataset.sqCodexWord ?? '';
        const entry = QUIZ_LEXICON_BANK.find((e) => e.id === eid);
        if (entry) {
          speakQuizText(entry.word, lang, 0.9);
        }
      });
    });
    scope.querySelectorAll<HTMLButtonElement>('[data-sq-codex-ex]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const eid = btn.dataset.sqCodexEx ?? '';
        const entry = QUIZ_LEXICON_BANK.find((e) => e.id === eid);
        if (entry) {
          speakQuizText(entry.exampleSentence, lang, 0.95);
        }
      });
    });
  }

  private renderChallengeStage(ch: ActiveQuizChallenge): string {
    const isAnswered = this.answeredOutcome !== null;
    const gameKind =
      ch.visualGameKind ??
      (ch.format === 'vocab_context'
        ? 'pic_flashcard'
        : ch.format === 'dialogue_reply'
          ? 'bubble_pop'
          : ch.format === 'sentence_builder'
            ? 'word_tiles'
            : ch.format === 'match_pairs'
              ? 'pic_pairs'
              : 'word_flashcard');

    const heroSprite = ch.heroSpriteSrc ?? '/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp';
    const heroWord = ch.heroWord ?? ch.stemText;
    const heroPh = ch.heroPhonetic ?? ch.stemPhonetic ?? '';
    const heroShortVi = ch.heroShortVi ?? formatShortKidMeaningVi(ch.translationVi);

    let heroBannerHtml = '';
    if (gameKind === 'pic_flashcard') {
      heroBannerHtml = `
        <div class="sq-prompt-row">
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${escapeHtml(heroWord)}</strong>
            ${heroPh ? `<span class="sq-prompt-ph">[${escapeHtml(heroPh)}]</span>` : ''}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `;
    } else if (gameKind !== 'pic_pairs') {
      heroBannerHtml = `
        <div class="sq-prompt-row">
          <img src="${heroSprite}" alt="" class="sq-prompt-img" />
          <div class="sq-prompt-copy">
            <strong class="sq-prompt-word">${escapeHtml(heroShortVi)}</strong>
            ${heroPh ? `<span class="sq-prompt-ph">[${escapeHtml(heroPh)}]</span>` : ''}
          </div>
          <button id="btnSqHeroAudio" type="button" class="brass-btn gold-cta sq-audio-btn">Nghe</button>
        </div>
      `;
    }

    let interactiveHtml = '';
    if (gameKind === 'pic_flashcard' || gameKind === 'word_flashcard' || gameKind === 'bubble_pop') {
      const choices = ch.choices ?? [];
      const phs = ch.choicePhonetics ?? [];
      const sprites = ch.choiceSprites ?? [];
      const subs = ch.choiceSubtitles ?? [];
      interactiveHtml = `
        <div class="sq-choice-grid">
          ${choices
            .map((cText, idx) => {
              let stateCls = '';
              if (isAnswered) {
                if (idx === ch.correctIndex) stateCls = 'is-correct';
                else if (idx === this.selectedChoiceIdx) stateCls = 'is-wrong';
                else stateCls = 'is-dimmed';
              }
              const spSrc = sprites[idx] ?? heroSprite;
              const subTxt = subs[idx] ?? '';
              return `
                <button
                  type="button"
                  class="sq-choice-btn ${stateCls}"
                  data-sq-choice="${idx}"
                  ${isAnswered ? 'disabled' : ''}
                >
                  <img src="${spSrc}" alt="" class="sq-kid-card-img" />
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${escapeHtml(cText)}</span>
                    ${
                      gameKind !== 'pic_flashcard' && phs[idx]
                        ? `<small class="sq-choice-ph">[${escapeHtml(phs[idx])}]</small>`
                        : isAnswered && subTxt
                          ? `<small class="sq-choice-ph">${escapeHtml(subTxt)}</small>`
                          : ''
                    }
                  </div>
                </button>
              `;
            })
            .join('')}
        </div>
      `;
    } else if (ch.format === 'sentence_builder') {
      const tokens = ch.shuffledTokens ?? [];
      const expected = ch.expectedSentenceTokens ?? [];
      const placedSet = new Set(this.placedTokenIndices);
      const slotBoxes = expected
        .map((_, slotIdx) => {
          const placedTIdx = this.placedTokenIndices[slotIdx];
          const tok = placedTIdx !== undefined ? tokens.find((t) => t.idx === placedTIdx) : undefined;
          if (tok) {
            return `
              <button
                type="button"
                class="sq-word-chip placed sq-kid-slot-filled"
                data-sq-unplace="${slotIdx}"
                ${isAnswered ? 'disabled' : ''}
                title="Bấm để bỏ mảnh chữ này xuống"
              >
                ${escapeHtml(tok.text)}
              </button>
            `;
          }
          return `<span class="sq-kid-slot-empty">?</span>`;
        })
        .join('');

      const bankChips = tokens
        .map((tok) => {
          const used = placedSet.has(tok.idx);
          return `
            <button
              type="button"
              class="sq-word-chip bank sq-kid-tile ${used ? 'used' : ''}"
              data-sq-place="${tok.idx}"
              ${used || isAnswered ? 'disabled' : ''}
            >
              ${escapeHtml(tok.text)}
            </button>
          `;
        })
        .join('');

      interactiveHtml = `
        <div class="sq-sentence-builder sq-kid-tile-builder">
          <div class="sq-sentence-slots sq-kid-tile-slots ${this.placedTokenIndices.length > 0 ? 'has-words' : ''}">
            ${slotBoxes}
          </div>
          <div class="sq-word-bank sq-kid-tile-bank">${bankChips}</div>
          ${
            !isAnswered
              ? `
                <div class="sq-sentence-actions">
                  <button id="btnSqHintTile" type="button" class="brass-btn" title="Gợi ý 1 mảnh chữ">Gợi ý</button>
                  <button id="btnSqResetSentence" type="button" class="brass-btn" ${this.placedTokenIndices.length === 0 ? 'disabled' : ''}>Xếp lại</button>
                  <button id="btnSqCheckSentence" type="button" class="brass-btn gold-cta" ${this.placedTokenIndices.length === 0 ? 'disabled' : ''}>Kiểm tra</button>
                </div>
              `
              : ''
          }
        </div>
      `;
    } else if (ch.format === 'match_pairs') {
      const lefts = ch.leftCards ?? [];
      const rights = ch.rightCards ?? [];
      interactiveHtml = `
        <div class="sq-pairs-wrap sq-kid-pairs-wrap">
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Từ vựng</div>
            ${lefts
              .map((card) => {
                const matched = this.matchedPairIds.has(card.pairId);
                const selected = this.selectedLeftPairId === card.pairId;
                return `
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-left sq-kid-pair-word ${matched ? 'matched' : ''} ${selected ? 'selected' : ''}"
                    data-sq-left-pair="${escapeHtml(card.pairId)}"
                    ${matched || isAnswered ? 'disabled' : ''}
                  >
                    <span class="sq-pair-word">${escapeHtml(card.word)}</span>
                    <small class="sq-pair-ph">[${escapeHtml(card.phonetic)}]</small>
                  </button>
                `;
              })
              .join('')}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">Nghĩa</div>
            ${rights
              .map((card) => {
                const matched = this.matchedPairIds.has(card.pairId);
                const wrongFlash = this.flashWrongPairKey === card.pairId;
                const spSrc =
                  card.spriteSrc ??
                  getQuizVisualCardMeta(card.meaningVi, card.word, card.pairId).spriteSrc;
                const shortLbl = card.shortVi ?? formatShortKidMeaningVi(card.meaningVi);
                return `
                  <button
                    type="button"
                    class="sq-pair-btn sq-pair-right sq-kid-pair-pic ${matched ? 'matched' : ''} ${wrongFlash ? 'wrong-flash' : ''}"
                    data-sq-right-pair="${escapeHtml(card.pairId)}"
                    ${matched || isAnswered ? 'disabled' : ''}
                  >
                    <img src="${spSrc}" alt="" class="sq-pair-pic-img" />
                    <span class="sq-pair-meaning">${escapeHtml(shortLbl)}</span>
                  </button>
                `;
              })
              .join('')}
          </div>
        </div>
      `;
    }

    const explanationHtml = this.answeredOutcome
      ? this.renderVietnameseExplanationCard(ch, this.answeredOutcome)
      : '';

    return `
      <div class="sq-stage-card">
        ${heroBannerHtml}
        ${interactiveHtml}
        ${explanationHtml}
      </div>
    `;
  }

  private renderVietnameseExplanationCard(
    ch: ActiveQuizChallenge,
    outcome: QuizAttemptOutcome & { newSeedCount: number; cropName: string }
  ): string {
    const seedCount = this.sim.getSeedCount(this.targetCropId);
    const heroWord = ch.heroWord ?? ch.fullSentence;
    const heroPh = ch.heroPhonetic ?? ch.fullPhonetic;
    const heroShortVi = ch.heroShortVi ?? formatShortKidMeaningVi(ch.translationVi);

    return `
      <div class="sq-explain-card ${outcome.correct ? 'is-pass' : 'is-review'}">
        <div class="sq-explain-copy">
          <div class="sq-explain-status">
            ${
              outcome.practice
                ? `<strong>Đúng</strong> · Đủ 30 câu thưởng hôm nay`
                : outcome.correct
                ? `<strong>Đúng</strong> · +${outcome.seedsAwarded} ${escapeHtml(outcome.cropName)} · +${outcome.xpAwarded} XP${
                    outcome.buildReduction && outcome.buildReduction.reducedSec > 0
                      ? ` · −${formatDurationCompactVi(outcome.buildReduction.reducedSec)}`
                      : ''
                  }`
                : `<strong>Đáp án:</strong> ${escapeHtml(heroWord)}${heroPh ? ` [${escapeHtml(heroPh)}]` : ''} — ${escapeHtml(heroShortVi)}`
            }
          </div>
          ${
            outcome.correct
              ? `<div class="sq-kid-result-word"><strong>${escapeHtml(heroWord)}</strong>${heroPh ? ` <span class="sq-vocab-ph">[${escapeHtml(heroPh)}]</span>` : ''} — ${escapeHtml(heroShortVi)}</div>`
              : ''
          }
        </div>
        <div class="sq-explain-actions">
          <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tool-pill">Nghe</button>
          ${
            seedCount > 0
              ? `<button id="btnSqExplainSow" type="button" class="brass-btn sq-tool-pill">Gieo ×${seedCount}</button>`
              : ''
          }
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta sq-next-btn">Câu tiếp</button>
        </div>
      </div>
    `;
  }

  private bindRenderedEvents(container: HTMLElement): void {
    const selTargetCrop = container.querySelector('#selSqTargetCrop') as HTMLSelectElement | null;
    selTargetCrop?.addEventListener('change', () => {
      const cid = selTargetCrop.value as FarmCropId;
      if (cid && FARM_CROPS[cid]) {
        this.targetCropId = cid;
        this.render();
      }
    });

    container.querySelector('#btnSqSowNow')?.addEventListener('click', () => {
      this.handleSowEquippedSeed();
    });
    container.querySelector('#btnSqExplainSow')?.addEventListener('click', () => {
      this.handleSowEquippedSeed();
    });
    container.querySelector('#btnSqBuy1')?.addEventListener('click', () => {
      this.handleBuySeedsWithSickle(1);
    });
    container.querySelector('#btnSqBuy3')?.addEventListener('click', () => {
      this.handleBuySeedsWithSickle(3);
    });

    const btnAuto = container.querySelector('#btnSqAutoSpeak') as HTMLButtonElement | null;
    btnAuto?.addEventListener('click', () => {
      const quiz = this.sim.ensureLanguageQuiz();
      quiz.autoSpeak = !quiz.autoSpeak;
      btnAuto.setAttribute('aria-pressed', String(quiz.autoSpeak));
      this.sim.saveToStorage();
    });

    const selTier = container.querySelector('#selSqTier') as HTMLSelectElement | null;
    selTier?.addEventListener('change', () => {
      const tier = selTier.value as QuizProficiencyTier;
      const quiz = this.sim.ensureLanguageQuiz();
      if (tier === 'beginner' || tier === 'intermediate' || tier === 'advanced') {
        if (this.challenge && !this.answeredOutcome) {
          markQuizChallengeSkipped(quiz, this.challenge);
        }
        setProfileTier(quiz, quiz.activeLang, tier);
        this.loadNextQuestion(true);
      }
    });

    const selFormat = container.querySelector('#selSqFormat') as HTMLSelectElement | null;
    selFormat?.addEventListener('change', () => {
      const fk = selFormat.value as 'all' | QuizFormatKind;
      const quiz = this.sim.ensureLanguageQuiz();
      if (ALL_FORMAT_KEYS.includes(fk) && quiz.preferredFormat !== fk) {
        if (this.challenge && !this.answeredOutcome) {
          markQuizChallengeSkipped(quiz, this.challenge);
        }
        quiz.preferredFormat = fk;
        this.loadNextQuestion(true);
      }
    });

    // Language switch (EN / KO / ZH / ES / JA)
    container.querySelectorAll<HTMLButtonElement>('[data-sq-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.sqLang as QuizLanguageId;
        const quiz = this.sim.ensureLanguageQuiz();
        if (lid && ALL_LANG_IDS.includes(lid) && quiz.activeLang !== lid) {
          if (this.challenge && !this.answeredOutcome) {
            markQuizChallengeSkipped(quiz, this.challenge);
          }
          quiz.activeLang = lid;
          if (this.activeSubView === 'codex') {
            this.ensureActiveLangPackLoaded(lid, false);
            this.sim.saveToStorage();
            this.render();
          } else {
            this.loadNextQuestion(true);
          }
        }
      });
    });

    // SRS Lexicon Codex live search (updates #sqCodexResultsMount only so Vietnamese Telex/VNI IME is uninterrupted)
    const codexSearchInp = container.querySelector('#inpSqCodexSearch') as HTMLInputElement | null;
    if (codexSearchInp) {
      codexSearchInp.addEventListener('input', () => {
        this.codexQuery = codexSearchInp.value;
        const mount = container.querySelector('#sqCodexResultsMount');
        if (mount) {
          const quiz = this.sim.ensureLanguageQuiz();
          const lang = quiz.activeLang;
          mount.innerHTML = this.renderLexiconCodexRowsHtml(lang, quiz.profiles[lang]);
          this.bindCodexRowSpeakEvents(mount, lang);
        }
      });
    }

    container.querySelectorAll<HTMLButtonElement>('[data-sq-codex-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.sqCodexFilter as 'all' | 'mastered' | 'learning' | 'unseen';
        if (f === 'all' || f === 'mastered' || f === 'learning' || f === 'unseen') {
          this.codexBoxFilter = f;
          this.render();
        }
      });
    });

    const codexMount = container.querySelector('#sqCodexResultsMount');
    if (codexMount) {
      const quiz = this.sim.ensureLanguageQuiz();
      this.bindCodexRowSpeakEvents(codexMount, quiz.activeLang);
    }

    // TTS buttons
    container.querySelector('#btnSqHeroAudio')?.addEventListener('click', () => {
      if (!this.challenge) return;
      speakQuizText(this.challenge.ttsPromptText || this.challenge.fullSentence, this.challenge.lang, 0.94);
    });
    container.querySelector('#btnSqSpeakSlow')?.addEventListener('click', () => {
      if (!this.challenge) return;
      const txt = this.answeredOutcome ? this.challenge.fullSentence : this.challenge.ttsPromptText;
      speakQuizText(txt, this.challenge.lang, 0.72);
    });
    container.querySelector('#btnSqSpeakFull')?.addEventListener('click', () => {
      if (!this.challenge) return;
      speakQuizText(this.challenge.fullSentence, this.challenge.lang, 0.96);
    });
    container.querySelectorAll<HTMLButtonElement>('[data-sq-speak-word]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge) return;
        const idx = Number(btn.dataset.sqSpeakWord ?? -1);
        const note = this.challenge.vocabNotes[idx];
        if (note) {
          speakQuizText(note.word, this.challenge.lang, 0.9);
        }
      });
    });

    // Skip / Next question
    container.querySelector('#btnSqSkipQuestion')?.addEventListener('click', () => {
      const quiz = this.sim.ensureLanguageQuiz();
      markQuizChallengeSkipped(quiz, this.challenge);
      this.skipFormatOffset += 1;
      this.loadNextQuestion(true);
    });
    container.querySelector('#btnSqNextQuestion')?.addEventListener('click', () => {
      this.loadNextQuestion(true);
    });

    // Multiple-choice click (pic_flashcard, word_flashcard, bubble_pop)
    container.querySelectorAll<HTMLButtonElement>('[data-sq-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.answeredOutcome) return;
        const idx = Number(btn.dataset.sqChoice ?? -1);
        this.selectedChoiceIdx = idx;
        const isCorrect = idx === (this.challenge.correctIndex ?? 0);
        if (isCorrect) {
          this.sim.audio.playMatchPop(2);
        } else {
          this.sim.audio.playClick();
        }
        this.submitAttempt(isCorrect);
      });
    });

    // Word Tiles / Sentence builder interactions
    const checkWordTilesIfComplete = () => {
      if (!this.challenge || this.answeredOutcome) return false;
      const expected = this.challenge.expectedSentenceTokens ?? [];
      const tokens = this.challenge.shuffledTokens ?? [];
      if (this.placedTokenIndices.length < expected.length) return false;
      const placedTexts = this.placedTokenIndices.map(
        (tIdx) => tokens.find((t) => t.idx === tIdx)?.text ?? ''
      );
      const isExact =
        placedTexts.length === expected.length &&
        placedTexts.every((txt, i) => txt === expected[i]);
      if (isExact) {
        this.sim.audio.playMatchPop(2);
      } else {
        this.sim.audio.playClick();
      }
      this.submitAttempt(isExact);
      return true;
    };

    container.querySelectorAll<HTMLButtonElement>('[data-sq-place]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.answeredOutcome) return;
        const tIdx = Number(btn.dataset.sqPlace ?? -1);
        if (tIdx >= 0 && !this.placedTokenIndices.includes(tIdx)) {
          this.placedTokenIndices.push(tIdx);
          this.sim.audio.playMatchPop(1);
          const tok = this.challenge.shuffledTokens?.find((t) => t.idx === tIdx);
          const quiz = this.sim.ensureLanguageQuiz();
          if (tok && quiz.autoSpeak) {
            speakQuizText(tok.text, this.challenge.lang, 0.95);
          }
          if (!checkWordTilesIfComplete()) {
            this.render();
          }
        }
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-sq-unplace]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.answeredOutcome) return;
        const pos = Number(btn.dataset.sqUnplace ?? -1);
        if (pos >= 0 && pos < this.placedTokenIndices.length) {
          this.placedTokenIndices.splice(pos, 1);
          this.sim.audio.playClick();
          this.render();
        }
      });
    });

    container.querySelector('#btnSqHintTile')?.addEventListener('click', () => {
      if (!this.challenge || this.answeredOutcome) return;
      const expected = this.challenge.expectedSentenceTokens ?? [];
      const tokens = this.challenge.shuffledTokens ?? [];
      // Remove any wrong trailing tiles first
      while (this.placedTokenIndices.length > 0) {
        const lastSlot = this.placedTokenIndices.length - 1;
        const lastTok = tokens.find((t) => t.idx === this.placedTokenIndices[lastSlot]);
        if (lastTok?.text === expected[lastSlot]) break;
        this.placedTokenIndices.pop();
      }
      const nextSlot = this.placedTokenIndices.length;
      if (nextSlot < expected.length) {
        const wantText = expected[nextSlot];
        const candidate = tokens.find(
          (t) => t.text === wantText && !this.placedTokenIndices.includes(t.idx)
        );
        if (candidate) {
          this.placedTokenIndices.push(candidate.idx);
          this.sim.audio.playMatchPop(1);
          if (!checkWordTilesIfComplete()) {
            this.render();
          }
        }
      }
    });

    container.querySelector('#btnSqResetSentence')?.addEventListener('click', () => {
      if (this.answeredOutcome) return;
      this.placedTokenIndices = [];
      this.sim.audio.playClick();
      this.render();
    });

    container.querySelector('#btnSqCheckSentence')?.addEventListener('click', () => {
      if (!this.challenge || this.answeredOutcome) return;
      const expected = this.challenge.expectedSentenceTokens ?? [];
      const tokens = this.challenge.shuffledTokens ?? [];
      const placedTexts = this.placedTokenIndices.map(
        (tIdx) => tokens.find((t) => t.idx === tIdx)?.text ?? ''
      );
      const isExact =
        placedTexts.length === expected.length &&
        placedTexts.every((txt, i) => txt === expected[i]);
      this.submitAttempt(isExact);
    });

    // Match pairs interactions
    container.querySelectorAll<HTMLButtonElement>('[data-sq-left-pair]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.answeredOutcome) return;
        const pid = btn.dataset.sqLeftPair ?? '';
        if (!pid || this.matchedPairIds.has(pid)) return;
        this.selectedLeftPairId = pid;
        this.flashWrongPairKey = null;
        this.sim.audio.playClick();
        const card = this.challenge.leftCards?.find((c) => c.pairId === pid);
        const quiz = this.sim.ensureLanguageQuiz();
        if (card && quiz.autoSpeak) {
          speakQuizText(card.word, this.challenge.lang, 0.92);
        }
        this.render();
      });
    });

    container.querySelectorAll<HTMLButtonElement>('[data-sq-right-pair]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.challenge || this.answeredOutcome) return;
        const rightPid = btn.dataset.sqRightPair ?? '';
        if (!rightPid || this.matchedPairIds.has(rightPid)) return;
        if (!this.selectedLeftPairId) {
          this.onToast('Chọn thẻ Từ bên trái trước.', '🪄');
          return;
        }
        if (this.selectedLeftPairId === rightPid) {
          this.matchedPairIds.add(rightPid);
          this.selectedLeftPairId = null;
          this.flashWrongPairKey = null;
          this.sim.audio.playMatchPop(2);
          const totalPairs = this.challenge.leftCards?.length ?? 3;
          if (this.matchedPairIds.size >= totalPairs) {
            this.submitAttempt(this.pairMistakes <= 1);
            return;
          }
          this.render();
        } else {
          this.pairMistakes += 1;
          this.flashWrongPairKey = rightPid;
          this.sim.audio.playClick();
          this.render();
        }
      });
    });

    const scrollViewportEl = container.querySelector('#sqScrollViewport') as HTMLElement | null;
    const sizerEl = container.querySelector('#sqZoomSizer') as HTMLElement | null;
    const contentStageEl = container.querySelector('#sqZoomStage') as HTMLElement | null;
    sharedMinigameViewport.bindDomScrollStageInteractions({
      rootScope: container,
      scrollViewportEl,
      sizerEl,
      contentStageEl,
      onOrientationToggled: () => this.render(),
      onPlayClick: () => this.sim.audio.playClick(),
    });
  }
}
