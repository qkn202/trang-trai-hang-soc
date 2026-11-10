import {
  FARM_CROPS,
  formatDurationCompactVi,
  getCatalogItem,
  getFarmItemIconSrc,
} from '../data/catalog';
import {
  getLanguagePoolStats,
  isLanguageQuizPackLoaded,
  loadLanguageQuizPack,
  QUIZ_FORMAT_LABELS,
  QUIZ_LANGUAGES,
  QUIZ_LEXICON_BANK,
  QuizLexiconEntry,
} from '../data/languageQuizBank';
import {
  ActiveQuizChallenge,
  computeTargetBand,
  formatShortKidMeaningVi,
  generateNextQuizChallenge,
  getProfileSrsSummary,
  getQuizVisualCardMeta,
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
  private answeredOutcome: (QuizAttemptOutcome & { newSeedCount: number; cropName: string }) | null =
    null;

  // Interactive per-question UI state
  private selectedChoiceIdx: number | null = null;
  private placedTokenIndices: number[] = [];
  private selectedLeftPairId: string | null = null;
  private matchedPairIds = new Set<string>();
  private flashWrongPairKey: string | null = null;
  private pairMistakes = 0;
  private cropFilter: 'all' | 'flowers' | 'crops' = 'all';
  private activeSubView: 'practice' | 'codex' = 'practice';
  private codexQuery = '';
  private codexBoxFilter: 'all' | 'mastered' | 'learning' | 'unseen' = 'all';
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
      this.loadNextQuestion(true);
    } else {
      this.render();
    }
    this.ensureActiveLangPackLoaded(quiz.activeLang);

    const dlg = this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  }

  private ensureActiveLangPackLoaded(lang: QuizLanguageId): void {
    if (isLanguageQuizPackLoaded(lang)) return;
    void loadLanguageQuizPack(lang).then((loaded) => {
      if (!loaded) return;
      const quiz = this.sim.ensureLanguageQuiz();
      if (quiz.activeLang === lang && !this.answeredOutcome) {
        this.render();
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
    this.ensureActiveLangPackLoaded(quiz.activeLang);
    this.challenge = generateNextQuizChallenge(quiz, this.sim.state.level);
    this.sim.saveToStorage();
    this.render();
    const modalInner = this.root.querySelector(
      '#seedQuizDialog .sq-modal-inner'
    ) as HTMLElement | null;
    if (modalInner) {
      modalInner.scrollTop = 0;
    }

    if (autoSpeakIfEnabled && quiz.autoSpeak && this.challenge) {
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
    if (outcome.correct) {
      const promoNote = outcome.tierAutoPromoted
        ? ` • Thăng hạng ${QUIZ_LANGUAGES[this.challenge.lang].tierLabels[outcome.tierAutoPromoted]}!`
        : '';
      const talismanNote = outcome.phoenixTalismanAwarded
        ? ` • 🔥 +${outcome.phoenixTalismanAwarded} Bùa Trợ Chiến Phượng Hoàng!`
        : '';
      const buildNote =
        outcome.buildReduction && outcome.buildReduction.reducedSec > 0
          ? ` • 🔨 -${formatDurationCompactVi(outcome.buildReduction.reducedSec)} xây ${outcome.buildReduction.targetName ?? 'công trình'}!`
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
      this.onToast('Túi hạt đang trống — hãy mua bằng Vàng hoặc niệm 1 câu Thần Chú Đa Ngữ bên cạnh nhé!', '🌱');
      return;
    }
    const targetPlot = this.pendingPlotUid;
    this.pendingPlotUid = null;
    this.close();
    this.onEquipAndSow(this.targetCropId, targetPlot);
  }

  public render(): void {
    const container = this.root.querySelector('#seedQuizDialogContent') as HTMLElement | null;
    if (!container) return;

    const quiz = this.sim.ensureLanguageQuiz();
    const activeLang = quiz.activeLang;
    const langMeta = QUIZ_LANGUAGES[activeLang];
    const profile = quiz.profiles[activeLang];
    const crop = FARM_CROPS[this.targetCropId];
    const seedCount = this.sim.getSeedCount(this.targetCropId);
    const barnHarvestStock = this.sim.getFarmItemCount(this.targetCropId);
    const galleons = this.sim.state.galleons;

    const cost1 = crop.seedCost;
    const cost3 = crop.seedCost * 3;
    const canBuy1 = galleons >= cost1;
    const canBuy3 = galleons >= cost3;

    const targetBand = computeTargetBand(profile, this.sim.state.level);
    const accuracyPct =
      profile.totalAnswered > 0
        ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
        : 100;
    const srsSummary = getProfileSrsSummary(profile);
    const poolStats = getLanguagePoolStats(activeLang);
    const talismanCount = Math.max(0, Math.floor(this.sim.state.phoenixTalismans ?? 0));
    const talismanProg = Math.max(0, Math.floor(this.sim.state.quizTalismanProgress ?? 0)) % 8;

    // Pending plot hint if user clicked an empty plot
    let plotContextBanner = '';
    if (this.pendingPlotUid) {
      const pb = this.sim.state.buildings.find((b) => b.uid === this.pendingPlotUid);
      if (pb && getCatalogItem(pb.itemId)?.isFarmlandPlot && !pb.cropId) {
        plotContextBanner = `
          <div class="sq-plot-target-banner">
            <span>🌾 <strong>[${pb.gx}, ${pb.gy}]</strong></span>
            ${
              seedCount > 0
                ? `<button id="btnSqBannerSowNow" type="button" class="brass-btn sq-sow-cta">🌱 Gieo (×${seedCount})</button>`
                : ''
            }
          </div>
        `;
      }
    }

    // 1. Crop Strip (all 22 crops & flowers, filterable, unlocked clickable)
    const allCropList = Object.values(FARM_CROPS).sort(
      (a, b) => a.unlockLevel - b.unlockLevel || a.growSec - b.growSec
    );
    const flowerTotal = allCropList.filter((c) => c.isFlowerCrop).length;
    const harvestCropTotal = allCropList.length - flowerTotal;
    const filteredCrops = allCropList.filter((c) => {
      if (this.cropFilter === 'flowers') return Boolean(c.isFlowerCrop);
      if (this.cropFilter === 'crops') return !c.isFlowerCrop;
      return true;
    });
    const cropFilterPillsHtml = (
      [
        { id: 'all', label: `🌱 (${allCropList.length})` },
        { id: 'flowers', label: `🌸 Hoa (${flowerTotal})` },
        { id: 'crops', label: `🌾 Cây (${harvestCropTotal})` },
      ] as const
    )
      .map(
        (f) => `
          <button
            type="button"
            class="seed-filter-pill ${this.cropFilter === f.id ? 'active' : ''}"
            data-sq-crop-filter="${f.id}"
            aria-pressed="${this.cropFilter === f.id}"
          >${f.label}</button>
        `
      )
      .join('');
    const cropPillsHtml = filteredCrops
      .map((c) => {
        const locked = !this.sim.state.sandboxMode && this.sim.state.level < c.unlockLevel;
        const active = c.id === this.targetCropId;
        const sCount = this.sim.getSeedCount(c.id);
        const cGrowLabel = formatDurationCompactVi(c.growSec);
        return `
          <button
            type="button"
            class="sq-crop-pill ${active ? 'active' : ''} ${locked ? 'locked' : ''}"
            data-sq-crop="${c.id}"
            aria-pressed="${active}"
            ${locked ? 'disabled' : ''}
            title="${locked ? `Lv.${c.unlockLevel} (⏱️ ${cGrowLabel})` : `${c.name} • ⏱️ ${cGrowLabel} • 🪙 ${c.seedCost.toLocaleString('vi-VN')}G`}"
          >
            <img src="${getFarmItemIconSrc(c.id)}" alt="" class="sq-crop-pill-img" />
            <span class="sq-crop-pill-info">
              <span class="sq-crop-pill-name">${escapeHtml(c.name)}</span>
              <span class="sq-crop-pill-sub">
                ${locked ? `🔒 Lv.${c.unlockLevel}` : `🌱 ${sCount} • ⏱️${cGrowLabel}`}
              </span>
            </span>
          </button>
        `;
      })
      .join('');

    // 2. Language Tabs (EN / KO / ZH / ES / JA)
    const langTabsHtml = ALL_LANG_IDS.map((lid) => {
      const m = QUIZ_LANGUAGES[lid];
      const p = quiz.profiles[lid];
      const isAct = lid === activeLang;
      const shortTier =
        p.tier === 'beginner' ? 'Tập Sự' : p.tier === 'intermediate' ? 'O.W.L.' : 'N.E.W.T.';
      return `
        <button
          type="button"
          class="sq-lang-tab ${isAct ? 'active' : ''}"
          data-sq-lang="${lid}"
          aria-pressed="${isAct}"
          title="${m.flag} ${escapeHtml(m.academyVi)} — ${escapeHtml(m.tierLabels[p.tier])}"
        >
          <span class="sq-lang-flag">${m.flag}</span>
          <span class="sq-lang-text">
            <strong>${escapeHtml(m.nameVi)}</strong>
            <small>${escapeHtml(shortTier)} • Lv.${p.masteryScore}</small>
          </span>
        </button>
      `;
    }).join('');

    // 3. Tier Selector Buttons
    const tiers: Array<{ id: QuizProficiencyTier; icon: string; rewardTag: string }> = [
      { id: 'beginner', icon: '🪄', rewardTag: '+1–2 🌱' },
      { id: 'intermediate', icon: '🦉', rewardTag: '+2 🌱' },
      { id: 'advanced', icon: '👑', rewardTag: '+2 🌱' },
    ];
    const tierBtnsHtml = tiers
      .map((t) => {
        const isAct = profile.tier === t.id;
        return `
          <button
            type="button"
            class="sq-tier-btn ${isAct ? 'active' : ''}"
            data-sq-tier="${t.id}"
            aria-pressed="${isAct}"
          >
            <span>${t.icon} ${escapeHtml(langMeta.tierLabels[t.id])}</span>
            <small>${t.rewardTag}</small>
          </button>
        `;
      })
      .join('');

    // 4. Format Filter Chips
    const formatOptsHtml = ALL_FORMAT_KEYS.map((fk) => {
      const meta = QUIZ_FORMAT_LABELS[fk];
      const isAct = quiz.preferredFormat === fk;
      return `
        <button
          type="button"
          class="sq-format-chip ${isAct ? 'active' : ''}"
          data-sq-format="${fk}"
          aria-pressed="${isAct}"
        >
          ${meta.icon} ${escapeHtml(meta.labelVi)}
        </button>
      `;
    }).join('');

    // 5. Challenge Interactive Body
    const challengeHtml = this.challenge ? this.renderChallengeStage(this.challenge) : '';

    container.innerHTML = `
      <div class="sq-root">
        ${plotContextBanner}

        <!-- CROP SELECTOR BAR -->
        <div class="sq-top-strip">
          <div class="sq-top-strip-head">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="sq-strip-title">🌱 Hạt giống:</span>
              <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${cropFilterPillsHtml}</div>
            </div>
            <div class="sq-wallet-pills">
              <span class="sq-wallet-chip" title="Vàng Galleon">🪙 <strong>${galleons.toLocaleString('vi-VN')}G</strong></span>
              <span class="sq-wallet-chip sq-wallet-seed" title="Túi hạt ${escapeHtml(crop.name)}">
                🌱 ${escapeHtml(crop.name)}: <strong>×${seedCount}</strong>
              </span>
              <span class="sq-wallet-chip sq-wallet-talisman" title="Bùa Phượng Hoàng (${talismanProg}/8 câu)">
                🔥 <strong>${talismanCount}</strong> <small>(${talismanProg}/8)</small>
              </span>
              ${(() => {
                const nowMs = Date.now();
                const actives = this.sim.getActiveConstructions(nowMs);
                if (actives.length === 0) return '';
                const b0 = actives[0];
                const it0 = getCatalogItem(b0.itemId);
                const remSec = Math.max(1, Math.ceil((b0.constructEndsAt - nowMs) / 1000));
                const floorSec = this.sim.getBuildingMinFloorSec(b0);
                const atFloor = remSec <= floorSec;
                return `<span class="sq-wallet-chip" title="Giảm giờ xây công trình">
                  🔨 ${escapeHtml(it0?.name ?? 'Đang xây')}: <strong>${formatDurationCompactVi(remSec)}</strong> <small>${atFloor ? '🔒' : '⚡'}</small>
                </span>`;
              })()}
            </div>
          </div>
          <div class="sq-crop-strip" role="group" aria-label="Danh sách 22 loại hạt giống và hoa">${cropPillsHtml}</div>
        </div>

        <!-- TWO ACQUISITION OPTIONS -->
        <div class="sq-options-layout">
          <!-- OPTION 1: HIGH GOLD DIRECT PURCHASE -->
          <aside class="sq-option-card sq-option-gold">
            <div class="sq-option-ribbon sq-ribbon-gold">🪙 MUA HẠT</div>
            <div class="sq-gold-crop-hero">
              <img src="${getFarmItemIconSrc(crop.id)}" alt="${escapeHtml(crop.name)}" class="sq-gold-crop-img" />
              <div class="sq-gold-crop-meta">
                <h3>${escapeHtml(crop.name)}</h3>
                <p>⏱️ <strong>${formatDurationCompactVi(crop.growSec)}</strong> • 🌾 <strong>+${crop.yieldQty}</strong></p>
                <p>🏡 Kho: <strong>${barnHarvestStock}</strong></p>
              </div>
            </div>

            <div class="sq-price-callout">
              <div class="sq-price-val">🪙 ${cost1.toLocaleString('vi-VN')}G <small>/ hạt</small></div>
            </div>

            <div class="sq-gold-btn-stack">
              <button
                id="btnSqBuy1"
                type="button"
                class="brass-btn gold-cta sq-buy-btn"
                ${canBuy1 ? '' : 'disabled'}
              >
                🪙 +1 Hạt (-${cost1.toLocaleString('vi-VN')}G)
              </button>
              <button
                id="btnSqBuy3"
                type="button"
                class="brass-btn sq-buy-btn"
                ${canBuy3 ? '' : 'disabled'}
              >
                🪙 +3 Hạt (-${cost3.toLocaleString('vi-VN')}G)
              </button>
            </div>

            <div class="sq-seed-pocket-box ${seedCount > 0 ? 'has-seeds' : 'empty-seeds'}">
              <div class="sq-pocket-status">
                🌱 <strong>${escapeHtml(crop.name)}</strong>: <strong>×${seedCount}</strong>
              </div>
              <button
                id="btnSqSowNow"
                type="button"
                class="brass-btn sq-sow-cta"
                ${seedCount > 0 ? '' : 'disabled'}
              >
                🌱 Gieo (×${seedCount})
              </button>
            </div>
          </aside>

          <!-- OPTION 2: MULTI-LANGUAGE ADAPTIVE QUIZ -->
          <section class="sq-option-card sq-option-quiz">
            <div class="sq-quiz-top-header">
              <span class="sq-option-ribbon sq-ribbon-quiz">🪄 ĐỐ NHẬN HẠT (0G • +1–2 🌱)</span>
              <label class="sq-autospeak-toggle" title="Tự động phát âm bản xứ">
                <input id="chkSqAutoSpeak" type="checkbox" ${quiz.autoSpeak ? 'checked' : ''} />
                <span>🔊 Tự đọc</span>
              </label>
            </div>

            <!-- 5 LANGUAGE TABS -->
            <div class="sq-lang-tabs" role="tablist" aria-label="Chọn bộ môn thần chú đa ngữ">${langTabsHtml}</div>

            <!-- PRACTICE VS SRS LEXICON CODEX SWITCH -->
            <div class="sq-view-switch" role="tablist" aria-label="Chọn chế độ Luyện Thần Chú hoặc Sổ Tay Cổ Ngữ">
              <button
                type="button"
                class="sq-view-tab ${this.activeSubView === 'practice' ? 'active' : ''}"
                data-sq-subview="practice"
                aria-selected="${this.activeSubView === 'practice'}"
              >
                🪄 Luyện
              </button>
              <button
                type="button"
                class="sq-view-tab ${this.activeSubView === 'codex' ? 'active' : ''}"
                data-sq-subview="codex"
                aria-selected="${this.activeSubView === 'codex'}"
              >
                📖 Từ Điển (${srsSummary.masteredCount}/${poolStats.lexiconCount})
              </button>
              <button
                id="btnSqOpenLeaderboard"
                type="button"
                class="sq-view-tab minigame-lb-chip"
                title="Bảng Xếp Hạng 3 Môn Tính Điểm"
              >
                🏆 BXH
              </button>
            </div>

            ${
              this.activeSubView === 'codex'
                ? this.renderLexiconCodexPanel(activeLang, profile)
                : `
                  <!-- USER PROFICIENCY TIER + ADAPTIVE LEVEL 1..100 -->
                  <div class="sq-tier-panel">
                    <div class="sq-tier-row" role="group" aria-label="Chọn cấp bậc phù thủy O.W.L. và N.E.W.T.">${tierBtnsHtml}</div>
                    <div class="sq-mastery-strip">
                      <div class="sq-mastery-bar-wrap" title="Cấp ${profile.masteryScore}/100 (Quyển ${targetBand}/10)">
                        <div class="sq-mastery-labels">
                          <span>📈 ${langMeta.flag} <strong>Lv.${profile.masteryScore}/100</strong></span>
                          <span>🎯 <strong>${profile.totalCorrect}/${profile.totalAnswered}</strong> (${accuracyPct}%)</span>
                        </div>
                        <div class="sq-mastery-track">
                          <div class="sq-mastery-fill" style="width:${Math.max(4, profile.masteryScore)}%"></div>
                        </div>
                      </div>
                      <div class="sq-streak-pills">
                        <span class="sq-stat-pill" title="Chuỗi đúng liên tiếp">🔥 <strong>×${profile.streak}</strong></span>
                        <button
                          type="button"
                          class="sq-stat-pill sq-stat-pill-btn ${srsSummary.dueCount > 0 ? 'has-review' : ''}"
                          data-sq-subview="codex"
                          title="Sổ Tay Cổ Ngữ SRS"
                        >
                          📦 <strong>${srsSummary.masteredCount}</strong> • 🔄 <strong>${srsSummary.dueCount}</strong> 📖
                        </button>
                      </div>
                    </div>
                    <div class="sq-format-bar" role="group" aria-label="Chế độ bài tập Play-to-Learn">${formatOptsHtml}</div>
                  </div>

                  <!-- ACTIVE PLAY-TO-LEARN CHALLENGE & EXPLANATION -->
                  ${challengeHtml}
                `
            }
          </section>
        </div>
      </div>
    `;

    this.bindRenderedEvents(container);
  }

  private getLexiconEntrySrsInfo(
    profile: LanguageProfileState,
    entryId: string
  ): { box: number; due: boolean } {
    const boxes = profile.srsBoxes ?? {};
    const vRec = boxes[`vocab:${entryId}`];
    const pRec = boxes[`pairs:${entryId}`];
    const box = Math.max(vRec?.box ?? 0, pRec?.box ?? 0);
    const due = Boolean(
      (vRec && vRec.box < 5 && vRec.dueAtTurn <= profile.totalAnswered) ||
        (pRec && pRec.box < 5 && pRec.dueAtTurn <= profile.totalAnswered)
    );
    return { box, due };
  }

  private getLanguageLexiconEntries(lang: QuizLanguageId): QuizLexiconEntry[] {
    return QUIZ_LEXICON_BANK.filter((e) => e.lang === lang).sort(
      (a, b) => a.levelBand - b.levelBand || a.id.localeCompare(b.id)
    );
  }

  private renderLexiconCodexPanel(lang: QuizLanguageId, profile: LanguageProfileState): string {
    const langMeta = QUIZ_LANGUAGES[lang];
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
        { id: 'all', label: `📖 Tất cả (${allEntries.length})` },
        { id: 'mastered', label: `🏆 Thuộc (${masteredCount})` },
        { id: 'learning', label: `📚 Đang học (${learningCount})` },
        { id: 'unseen', label: `✨ Mới (${unseenCount})` },
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
        <div class="sq-codex-summary">
          <span>📜 <strong>${langMeta.flag} ${escapeHtml(langMeta.nameVi)}</strong></span>
          <span class="sq-codex-pack-tag">${isLanguageQuizPackLoaded(lang) ? `✅ ${allEntries.length} từ` : '⏳...'}</span>
        </div>
        <div class="sq-codex-toolbar">
          <input
            id="inpSqCodexSearch"
            type="search"
            class="sq-codex-search"
            placeholder="🔍 Tìm từ..."
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
          🪶 Không tìm thấy mục từ phù hợp bộ lọc hiện tại. Hãy thử từ khoá khác hoặc chuyển bộ lọc Hộp SRS nhé!
        </div>
      `;
    }

    const rowsHtml = filtered
      .map((entry) => {
        const { box, due } = this.getLexiconEntrySrsInfo(profile, entry.id);
        const vis = getQuizVisualCardMeta(entry.meaningVi, entry.word, entry.id);
        let badgeCls = 'is-unseen';
        let badgeText = `✨ Quyển ${entry.levelBand}`;
        if (box >= 5) {
          badgeCls = 'is-box5';
          badgeText = '🏆 Hộp 5/5 • Thuộc';
        } else if (box >= 1) {
          badgeCls = due ? 'is-due' : 'is-learning';
          badgeText = `📦 Hộp ${box}/5${due ? ' • Ôn' : ''}`;
        }
        return `
          <article class="sq-codex-row" role="listitem">
            <div class="sq-codex-tts">
              <img src="${vis.spriteSrc}" alt="" class="sq-codex-pic" />
              <button
                type="button"
                class="sq-vocab-speak"
                data-sq-codex-word="${escapeHtml(entry.id)}"
                title="Nghe phát âm từ ${escapeHtml(entry.word)}"
              >🔊</button>
            </div>
            <div class="sq-codex-body">
              <div class="sq-codex-head">
                <strong class="sq-codex-word">${escapeHtml(entry.word)}</strong>
                <span class="sq-vocab-ph">[${escapeHtml(entry.phonetic)}]</span>
                <span class="sq-codex-meaning">— ${escapeHtml(vis.shortVi)}</span>
              </div>
            </div>
            <div class="sq-codex-srs ${badgeCls}">${badgeText}</div>
          </article>
        `;
      })
      .join('');

    return `
      <div class="sq-codex-count">Hiển thị <strong>${filtered.length}</strong> / ${entries.length} mục từ</div>
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
    const langMeta = QUIZ_LANGUAGES[ch.lang];
    const fmtMeta = QUIZ_FORMAT_LABELS[ch.format];
    const crop = FARM_CROPS[this.targetCropId];
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

    const heroSprite = ch.heroSpriteSrc ?? '/sprites/ui_icon_seed_sack.png';
    const heroWord = ch.heroWord ?? ch.stemText;
    const heroPh = ch.heroPhonetic ?? ch.stemPhonetic ?? '';
    const heroShortVi = ch.heroShortVi ?? formatShortKidMeaningVi(ch.translationVi);

    let heroBannerHtml = '';
    if (gameKind === 'pic_flashcard') {
      heroBannerHtml = `
        <div class="sq-kid-hero-card is-audio-word">
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb" title="Chạm để nghe phát âm">
            🔊
          </button>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-word-giant">${escapeHtml(heroWord)}</div>
            ${heroPh ? `<div class="sq-kid-ph-pill">[${escapeHtml(heroPh)}]</div>` : ''}
          </div>
          <span class="sq-kid-hint-tag">🖼️ Chạm tranh đúng!</span>
        </div>
      `;
    } else if (gameKind !== 'pic_pairs') {
      heroBannerHtml = `
        <div class="sq-kid-hero-card is-picture-clue">
          <div class="sq-kid-pic-frame">
            <img src="${heroSprite}" alt="${escapeHtml(heroShortVi)}" class="sq-kid-hero-img" />
          </div>
          <div class="sq-kid-hero-text">
            <div class="sq-kid-meaning-giant">${escapeHtml(heroShortVi)}</div>
            ${heroPh ? `<div class="sq-kid-ph-pill">🔊 [${escapeHtml(heroPh)}]</div>` : ''}
          </div>
          <button id="btnSqHeroAudio" type="button" class="sq-kid-audio-orb small" title="Nghe phát âm gợi ý">
            🔊
          </button>
        </div>
      `;
    }

    let interactiveHtml = '';
    if (gameKind === 'pic_flashcard' || gameKind === 'word_flashcard') {
      const choices = ch.choices ?? [];
      const phs = ch.choicePhonetics ?? [];
      const sprites = ch.choiceSprites ?? [];
      const subs = ch.choiceSubtitles ?? [];
      interactiveHtml = `
        <div class="sq-choice-grid sq-kid-flashcard-grid">
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
                  class="sq-choice-btn sq-kid-flashcard ${gameKind === 'pic_flashcard' ? 'is-pic-mode' : 'is-word-mode'} ${stateCls}"
                  data-sq-choice="${idx}"
                  ${isAnswered ? 'disabled' : ''}
                >
                  <div class="sq-kid-card-art">
                    <img src="${spSrc}" alt="" class="sq-kid-card-img" />
                  </div>
                  <div class="sq-kid-card-caption">
                    <span class="sq-choice-main">${escapeHtml(cText)}</span>
                    ${
                      gameKind === 'word_flashcard' && phs[idx]
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
    } else if (gameKind === 'bubble_pop') {
      const choices = ch.choices ?? [];
      const phs = ch.choicePhonetics ?? [];
      const sprites = ch.choiceSprites ?? [];
      interactiveHtml = `
        <div class="sq-bubble-arena">
          ${choices
            .map((cText, idx) => {
              let stateCls = '';
              if (isAnswered) {
                if (idx === ch.correctIndex) stateCls = 'is-correct is-popped';
                else if (idx === this.selectedChoiceIdx) stateCls = 'is-wrong is-popped';
                else stateCls = 'is-dimmed';
              }
              const spSrc = sprites[idx] ?? heroSprite;
              return `
                <button
                  type="button"
                  class="sq-bubble-btn bubble-slot-${idx % 4} ${stateCls}"
                  data-sq-choice="${idx}"
                  ${isAnswered ? 'disabled' : ''}
                >
                  <span class="sq-bubble-shine"></span>
                  <img src="${spSrc}" alt="" class="sq-bubble-img" />
                  <span class="sq-bubble-word">${escapeHtml(cText)}</span>
                  ${phs[idx] ? `<small class="sq-bubble-ph">[${escapeHtml(phs[idx])}]</small>` : ''}
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
                  <button id="btnSqHintTile" type="button" class="brass-btn" title="Gợi ý 1 mảnh chữ">
                    💡 Gợi ý chữ
                  </button>
                  <button id="btnSqResetSentence" type="button" class="brass-btn" ${this.placedTokenIndices.length === 0 ? 'disabled' : ''}>
                    ↺ Xếp lại
                  </button>
                  <button id="btnSqCheckSentence" type="button" class="brass-btn gold-cta" ${this.placedTokenIndices.length === 0 ? 'disabled' : ''}>
                    ✨ Kiểm Tra
                  </button>
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
            <div class="sq-pairs-col-title">${langMeta.flag} 🔊 Thẻ Từ</div>
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
                    <span class="sq-pair-audio-tag">🔊</span>
                    <span class="sq-pair-word">${escapeHtml(card.word)}</span>
                    <small class="sq-pair-ph">[${escapeHtml(card.phonetic)}]</small>
                  </button>
                `;
              })
              .join('')}
          </div>
          <div class="sq-pairs-col">
            <div class="sq-pairs-col-title">🖼️ Thẻ Tranh 2.5D</div>
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
      <div class="sq-stage-card sq-kid-stage-card">
        <div class="sq-stage-meta-row">
          <div class="sq-stage-badges">
            <span class="sq-badge sq-badge-format">${fmtMeta.icon} ${escapeHtml(fmtMeta.labelVi)}</span>
            ${
              ch.isReview
                ? `<span class="sq-badge sq-badge-review">🔄 Ôn (${ch.srsBox ?? 1}/5) • +2 ${crop.emoji}</span>`
                : `<span class="sq-badge sq-badge-reward">🎁 +1–2 ${crop.emoji}</span>`
            }
          </div>
          <div class="sq-tts-btns">
            <button id="btnSqSpeakNormal" type="button" class="brass-btn sq-tts-btn" title="Nghe chuẩn (1.0x)">
              🔊 Nghe
            </button>
            <button id="btnSqSpeakSlow" type="button" class="brass-btn sq-tts-btn" title="Nghe chậm (0.72x)">
              🐢 Chậm
            </button>
            ${
              !isAnswered
                ? `<button id="btnSqSkipQuestion" type="button" class="brass-btn sq-tts-btn" title="Đổi câu">🔀 Đổi</button>`
                : ''
            }
          </div>
        </div>

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
    const heroSprite = ch.heroSpriteSrc ?? '/sprites/ui_icon_seed_sack.png';
    const heroWord = ch.heroWord ?? ch.fullSentence;
    const heroPh = ch.heroPhonetic ?? ch.fullPhonetic;
    const heroShortVi = ch.heroShortVi ?? formatShortKidMeaningVi(ch.translationVi);

    return `
      <div class="sq-explain-card sq-kid-explain-card ${outcome.correct ? 'is-pass' : 'is-review'}">
        <div class="sq-kid-result-row">
          <img src="${heroSprite}" alt="" class="sq-kid-result-img" />
          <div class="sq-kid-result-info">
            <div class="sq-explain-status">
              ${
                outcome.correct
                  ? `🎉 <strong>Giỏi lắm!</strong> +${outcome.seedsAwarded} 🌱 ${escapeHtml(outcome.cropName)} • +${outcome.xpAwarded} ⭐`
                  : `💡 <strong>Thử nhớ từ này nhé!</strong> (+${outcome.xpAwarded} ⭐)`
              }
            </div>
            <div class="sq-kid-result-word">
              <strong>${escapeHtml(heroWord)}</strong>
              <span class="sq-vocab-ph">[${escapeHtml(heroPh)}]</span>
              <span>= 🇻🇳 <strong>${escapeHtml(heroShortVi)}</strong></span>
            </div>
            ${
              outcome.buildReduction && outcome.buildReduction.reducedSec > 0
                ? `<div class="sq-promo-callout">🔨 -${formatDurationCompactVi(outcome.buildReduction.reducedSec)} (${escapeHtml(outcome.buildReduction.targetName ?? 'công trình')})</div>`
                : ''
            }
          </div>
          <div class="sq-explain-tts">
            <button id="btnSqSpeakFull" type="button" class="brass-btn sq-tts-btn">🔊</button>
            <button id="btnSqSpeakFullSlow" type="button" class="brass-btn sq-tts-btn">🐢</button>
          </div>
        </div>

        <div class="sq-explain-actions">
          ${
            seedCount > 0
              ? `
                <button id="btnSqExplainSow" type="button" class="brass-btn sq-sow-cta">
                  🌱 Gieo (×${seedCount})
                </button>
              `
              : ''
          }
          <button id="btnSqNextQuestion" type="button" class="brass-btn gold-cta">
            ➡️ Chơi Tiếp (+1–2 🌱)
          </button>
        </div>
      </div>
    `;
  }

  private bindRenderedEvents(container: HTMLElement): void {
    // Filter crop group (All / Flowers / Crops)
    container.querySelectorAll<HTMLButtonElement>('[data-sq-crop-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.sqCropFilter as 'all' | 'flowers' | 'crops';
        if (mode === 'all' || mode === 'flowers' || mode === 'crops') {
          this.cropFilter = mode;
          this.render();
        }
      });
    });

    // Select target crop
    container.querySelectorAll<HTMLButtonElement>('[data-sq-crop]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.sqCrop as FarmCropId;
        if (cid && FARM_CROPS[cid]) {
          this.targetCropId = cid;
          this.render();
        }
      });
    });

    // Option 1: Buy 1 or 3 seeds with high Gold
    container.querySelector('#btnSqBuy1')?.addEventListener('click', () => {
      const res = this.sim.buyCropSeedWithGold(this.targetCropId, 1);
      this.onToast(res.msg, res.ok ? '🌱' : '🪙');
      this.onRefreshHud();
      this.render();
    });

    container.querySelector('#btnSqBuy3')?.addEventListener('click', () => {
      const res = this.sim.buyCropSeedWithGold(this.targetCropId, 3);
      this.onToast(res.msg, res.ok ? '🌱' : '🪙');
      this.onRefreshHud();
      this.render();
    });

    // Sow equipped seed buttons
    container.querySelector('#btnSqSowNow')?.addEventListener('click', () => {
      this.handleSowEquippedSeed();
    });
    container.querySelector('#btnSqBannerSowNow')?.addEventListener('click', () => {
      this.handleSowEquippedSeed();
    });
    container.querySelector('#btnSqExplainSow')?.addEventListener('click', () => {
      this.handleSowEquippedSeed();
    });

    // Auto-speak checkbox
    const chkAuto = container.querySelector('#chkSqAutoSpeak') as HTMLInputElement | null;
    chkAuto?.addEventListener('change', () => {
      const quiz = this.sim.ensureLanguageQuiz();
      quiz.autoSpeak = chkAuto.checked;
      this.sim.saveToStorage();
    });

    // Language switch (EN / KO / ZH / ES / JA)
    container.querySelectorAll<HTMLButtonElement>('[data-sq-lang]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.sqLang as QuizLanguageId;
        const quiz = this.sim.ensureLanguageQuiz();
        if (lid && ALL_LANG_IDS.includes(lid) && quiz.activeLang !== lid) {
          quiz.activeLang = lid;
          if (this.activeSubView === 'codex') {
            this.ensureActiveLangPackLoaded(lid);
            this.sim.saveToStorage();
            this.render();
          } else {
            this.loadNextQuestion(true);
          }
        }
      });
    });

    // Sub-view switch (Practice vs SRS Lexicon Codex)
    container.querySelector('#btnSqOpenLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.();
    });
    container.querySelectorAll<HTMLButtonElement>('[data-sq-subview]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sv = btn.dataset.sqSubview as 'practice' | 'codex';
        if ((sv === 'practice' || sv === 'codex') && this.activeSubView !== sv) {
          this.activeSubView = sv;
          if (sv === 'codex') {
            const quiz = this.sim.ensureLanguageQuiz();
            this.ensureActiveLangPackLoaded(quiz.activeLang);
          }
          this.render();
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

    // Proficiency tier switch (Beginner / Intermediate / Advanced)
    container.querySelectorAll<HTMLButtonElement>('[data-sq-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.sqTier as QuizProficiencyTier;
        const quiz = this.sim.ensureLanguageQuiz();
        if (tier === 'beginner' || tier === 'intermediate' || tier === 'advanced') {
          setProfileTier(quiz, quiz.activeLang, tier);
          this.loadNextQuestion(true);
        }
      });
    });

    // Format switch
    container.querySelectorAll<HTMLButtonElement>('[data-sq-format]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const fk = btn.dataset.sqFormat as 'all' | QuizFormatKind;
        const quiz = this.sim.ensureLanguageQuiz();
        if (ALL_FORMAT_KEYS.includes(fk) && quiz.preferredFormat !== fk) {
          quiz.preferredFormat = fk;
          this.loadNextQuestion(true);
        }
      });
    });

    // TTS buttons
    container.querySelector('#btnSqHeroAudio')?.addEventListener('click', () => {
      if (!this.challenge) return;
      speakQuizText(this.challenge.ttsPromptText || this.challenge.fullSentence, this.challenge.lang, 0.94);
    });
    container.querySelector('#btnSqSpeakNormal')?.addEventListener('click', () => {
      if (!this.challenge) return;
      const txt = this.answeredOutcome ? this.challenge.fullSentence : this.challenge.ttsPromptText;
      speakQuizText(txt, this.challenge.lang, 0.96);
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
    container.querySelector('#btnSqSpeakFullSlow')?.addEventListener('click', () => {
      if (!this.challenge) return;
      speakQuizText(this.challenge.fullSentence, this.challenge.lang, 0.72);
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
          this.onToast('👆 Hãy chạm chọn 1 thẻ Từ bên trái trước rồi chạm Tranh 2.5D tương ứng nhé!', '🪄');
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
  }
}
