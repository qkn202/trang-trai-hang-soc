import { formatDurationCompactVi } from '../data/catalog';
import {
  CANDY_ASSET_REV,
  CANDY_HOGWARTS_TOTAL_CHAPTERS,
  CANDY_OBSTACLE_ICONS,
  CANDY_TILE_TYPES,
  CandyHogwartsLevel,
  getCandyChapterForLevel,
  getCandyLevelById,
  getCandySeasonByLevel,
  toCandyHouseId,
} from '../data/candyHogwartsLevels';
import {
  EXTRA_MOVES_COUNT,
  getExtraMovesGoldCost,
  getMilestoneBossMeta,
  MATCH3_BOOSTERS,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
  REFILL_HEARTS_GOLD_COST,
} from '../data/match3Levels';
import { SpriteRegistry } from '../engine/spriteLoader';
import {
  CandyAudioAdapter,
  CandyBossRuntimeState,
  CandyGameEndPayload,
  CandyHogwartsEngine,
  CandyHudStateSnapshot,
  CandyObjectiveProgress,
} from '../sim/candyHogwartsEngine';
import { MAX_DAILY_MINIGAME_RESCUES } from '../sim/neighborSocial';
import { ParkSimulation } from '../sim/simulation';
import {
  ACTIVE_MINIGAME_RESUME_KEY,
  ActiveMinigameResumeRecord,
  BuildReductionResult,
  LeaderboardRankChange,
  Match3BoosterId,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';

const VIRTUAL_W = 468;

const BOOSTER_MEDIA: Record<
  Match3BoosterId,
  {
    engineKind: 'hammer' | 'swap' | 'shuffle';
    webp: string;
    png: string;
  }
> = {
  reparo_hammer: {
    engineKind: 'hammer',
    webp: `/paintings/candy-hogwarts/booster-lollipop.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/booster-lollipop.png?v=${CANDY_ASSET_REV}`,
  },
  row_col_cannon: {
    engineKind: 'swap',
    webp: `/paintings/candy-hogwarts/booster-swap.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/booster-swap.png?v=${CANDY_ASSET_REV}`,
  },
  alohomora_shuffle: {
    engineKind: 'shuffle',
    webp: `/paintings/candy-hogwarts/booster-shuffle.webp?v=${CANDY_ASSET_REV}`,
    png: `/paintings/candy-hogwarts/booster-shuffle.png?v=${CANDY_ASSET_REV}`,
  },
};

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCompactScore(val: number): string {
  if (val >= 10000) {
    return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1).replace('.', ',')}k`;
  }
  return val.toLocaleString('vi-VN');
}

function pictureSpriteHtml(webp: string, png: string, className: string): string {
  return `<picture><source srcset="${webp}" type="image/webp" /><img src="${png}" alt="" class="${className}" /></picture>`;
}

function describeCandyObjective(g: CandyObjectiveProgress): {
  visualHtml: string;
  label: string;
  accent: string;
  countText: string;
} {
  if (g.type === 'collect') {
    const tile = CANDY_TILE_TYPES[g.tileId ?? 0] ?? CANDY_TILE_TYPES[0];
    return {
      visualHtml: pictureSpriteHtml(tile.webp, tile.png, 'm3-goal-sprite'),
      label: tile.shortName,
      accent: tile.color,
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'special_order') {
    if (g.specialKind === 'color_bomb') {
      return {
        visualHtml: pictureSpriteHtml(
          `/paintings/candy-hogwarts/candy-colorbomb.webp?v=${CANDY_ASSET_REV}`,
          `/paintings/candy-hogwarts/candy-colorbomb.png?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Kẹo Nấm Truffle',
        accent: '#b45309',
        countText: g.completed ? '✓' : `${g.current}/${g.target ?? 1}`,
      };
    }
    if (g.specialKind === 'wrapped') {
      return {
        visualHtml: pictureSpriteHtml(
          `/paintings/candy-hogwarts/candy-0-wrapped.webp?v=${CANDY_ASSET_REV}`,
          `/paintings/candy-hogwarts/candy-0-wrapped.png?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Kẹo Gói Nổ',
        accent: '#f97316',
        countText: g.completed ? '✓' : `${g.current}/${g.target ?? 1}`,
      };
    }
    if (g.specialKind === 'striped') {
      return {
        visualHtml: pictureSpriteHtml(
          `/paintings/candy-hogwarts/candy-3-sh.webp?v=${CANDY_ASSET_REV}`,
          `/paintings/candy-hogwarts/candy-3-sh.png?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Kẹo Sọc Kem',
        accent: '#0ea5e9',
        countText: g.completed ? '✓' : `${g.current}/${g.target ?? 1}`,
      };
    }
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.special_seeker,
      label: g.label || 'Cánh Vàng Snitch',
      accent: '#eab308',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 1}`,
    };
  }
  if (g.type === 'boss') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.boss,
      label: 'Hạ Đại Trùm',
      accent: '#9333ea',
      countText: g.completed ? '✓' : `${g.remaining.toLocaleString('vi-VN')} HP`,
    };
  }
  if (g.type === 'horcrux') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.horcrux,
      label: 'Linh Giá',
      accent: '#a855f7',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'fiendfyre') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.fiendfyre,
      label: 'Lửa Địa Ngục',
      accent: '#ea580c',
      countText: g.completed ? '✓' : `Còn ${g.remaining}`,
    };
  }
  if (g.type === 'decree') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.decree,
      label: 'Bia Sắc Lệnh',
      accent: '#ec4899',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'dementor') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.dementor,
      label: 'Giám Ngục',
      accent: '#38bdf8',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'petrify') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.petrify,
      label: 'Hoá Đá Tử Xà',
      accent: '#10b981',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'cauldron') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.cauldron,
      label: 'Vạc Độc Dược',
      accent: '#10b981',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'key_lock') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.key_lock,
      label: 'Khoá Gringotts',
      accent: '#d97706',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'ingredient') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.ingredient,
      label: 'Đá Phù Thủy',
      accent: '#dc2626',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'chocolate') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.chocolate,
      label: 'Sô-cô-la Lan',
      accent: '#92400e',
      countText: g.completed ? '✓' : `Còn ${g.remaining}`,
    };
  }
  if (g.type === 'frosting') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.frosting,
      label: 'Bánh Quế Kem',
      accent: '#d97706',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'ice') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.ice,
      label: 'Băng Đường',
      accent: '#0284c7',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  if (g.type === 'jelly') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.jelly,
      label: 'Mứt Dâu Phép',
      accent: '#be185d',
      countText: g.completed ? '✓' : `${g.current}/${g.target ?? 0}`,
    };
  }
  return {
    visualHtml: CANDY_OBSTACLE_ICONS.score,
    label: 'Điểm Phép',
    accent: '#f59e0b',
    countText: g.completed
      ? '✓'
      : `${formatCompactScore(g.current)}/${formatCompactScore(g.target ?? 0)}`,
  };
}

function formatDifficultyMeta(lv: CandyHogwartsLevel): {
  pillClass: 'normal' | 'hard' | 'boss';
  icon: string;
  label: string;
} {
  if (lv.difficultyTier === 'finale') {
    return { pillClass: 'boss', icon: '👑', label: `Đại Kết Năm ${lv.seasonId}` };
  }
  if (lv.difficultyTier === 'boss') {
    return { pillClass: 'boss', icon: '👑', label: 'Trùm 2 Pha' };
  }
  if (lv.difficultyTier === 'exam') {
    return { pillClass: 'hard', icon: '🎓', label: 'Khảo Hạch Năm' };
  }
  if (lv.difficultyTier === 'nightmare') {
    return { pillClass: 'hard', icon: '💀', label: 'Ác Mộng' };
  }
  if (lv.difficultyTier === 'hard') {
    return { pillClass: 'hard', icon: '🔮', label: 'Khó' };
  }
  return { pillClass: 'normal', icon: '🍬', label: 'Thường' };
}

export class Match3ModalController {
  private root: HTMLElement;
  private sim: ParkSimulation;
  private onParentRefresh: () => void;
  private showToast: (msg: string, icon?: string) => void;
  public onSwitchToPuzzleArcade?: (mode?: PuzzleArcadeMode) => void;
  public onOpenLeaderboard?: () => void;
  public sprites?: SpriteRegistry;

  public engine: CandyHogwartsEngine | null = null;
  public rescueContext: MinigameRescueContext | null = null;
  private rescueVictoryOutcome: {
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } | null = null;
  private lastSeenSosRescuedAt = 0;
  private movesMadeThisAttempt = 0;
  private victoryClaimed = false;
  private victorySummary: {
    starsEarned: number;
    goldEarned: number;
    xpEarned: number;
    sandEarned: number;
    boosterReward?: Match3BoosterId;
    nextLevel: number;
    featuredBonusApplied?: boolean;
    newMasterLevel?: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
  } | null = null;
  private lastGameEndPayload: CandyGameEndPayload | null = null;

  private prevObjectiveRemaining: number[] = [];
  private companionCharge = 0;
  private snackPieUsedThisAttempt = false;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    onParentRefresh: () => void,
    showToast: (msg: string, icon?: string) => void,
    sprites?: SpriteRegistry
  ) {
    this.root = root;
    this.sim = sim;
    this.onParentRefresh = onParentRefresh;
    this.showToast = showToast;
    this.sprites = sprites;

    const dlg = this.getDialog();
    if (dlg) {
      dlg.addEventListener('close', () => {
        const _returnAction = dlg.returnValue;
        void _returnAction;
        dlg.returnValue = '';
        this.clearLiveAnnouncement();
        this.engine?.cancelBoosterMode();
        this.engine?.stopLoop();
        if (this.rescueContext) {
          this.rescueContext = null;
          this.rescueVictoryOutcome = null;
          this.engine?.destroy();
          this.engine = null;
        } else {
          this.persistMatch3Session(true);
        }
        if (typeof document === 'undefined' || !document.hidden) {
          this.clearActiveModalResumeMarker();
        }
        this.onParentRefresh();
      });
    }

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flushMatch3AndModalBeforeHide();
        } else if (this.isOpen() && this.engine?.level) {
          if (this.engine.status === 'playing') {
            this.engine.startLoop();
          }
          this.renderDOM();
        }
      });
    }

    if (typeof window !== 'undefined') {
      const flushOnHide = () => {
        this.flushMatch3AndModalBeforeHide();
      };
      window.addEventListener('pagehide', flushOnHide);
      window.addEventListener('beforeunload', flushOnHide);
      window.addEventListener('hangsoc:before-sw-reload', flushOnHide);
      window.addEventListener('pageshow', () => {
        if (this.isOpen() && this.engine?.level) {
          if (this.engine.status === 'playing') {
            this.engine.startLoop();
          }
          this.renderDOM();
        }
      });
    }
  }

  private persistActiveModalResumeMarker(): void {
    if (typeof localStorage === 'undefined' || this.rescueContext || this.victoryClaimed) return;
    try {
      const rec: ActiveMinigameResumeRecord = {
        dialog: 'match3',
        mode: 'match3',
        stage: this.engine?.level?.id ?? this.sim.state.match3.currentLevel,
        savedAt: Date.now(),
      };
      localStorage.setItem(ACTIVE_MINIGAME_RESUME_KEY, JSON.stringify(rec));
    } catch {
      // Ignore storage quota errors
    }
  }

  private clearActiveModalResumeMarker(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.removeItem(ACTIVE_MINIGAME_RESUME_KEY);
    } catch {
      // Ignore storage errors
    }
  }

  private persistMatch3Session(saveToDisk = true): void {
    if (this.rescueContext) return;
    const m3 = this.sim.state.match3;
    if (!this.engine || !this.engine.level || this.engine.level.id !== m3.currentLevel) return;
    if (this.engine.status === 'won' || this.victoryClaimed) {
      if (m3.activeSession) {
        m3.activeSession = null;
        if (saveToDisk) this.sim.saveToStorage();
      }
      return;
    }
    if (this.engine.busy) return;
    const snap = this.engine.exportSession({
      movesMadeThisAttempt: this.movesMadeThisAttempt,
      companionCharge: this.companionCharge,
      snackPieUsed: this.snackPieUsedThisAttempt,
    });
    if (!snap) return;
    m3.activeSession = snap;
    if (saveToDisk) {
      this.sim.saveToStorage();
    }
  }

  private flushMatch3AndModalBeforeHide(): void {
    if (!this.rescueContext) {
      this.persistMatch3Session(true);
    }
    if (this.isOpen() && !this.rescueContext && !this.victoryClaimed) {
      this.persistActiveModalResumeMarker();
    }
  }

  private buildAudioAdapter(): CandyAudioAdapter {
    return {
      onSelect: () => this.sim.audio.playClick(),
      onSwap: () => this.sim.audio.playPlace(),
      onInvalid: () => this.sim.audio.playCheekyAlert(),
      onMatch: (comboStep) => this.sim.audio.playMatchPop(comboStep),
      onBeam: () => this.sim.audio.playPowerupBlast(),
      onBomb: () => this.sim.audio.playPowerupBlast(),
      onColorBomb: () => this.sim.audio.playTalismanBlast(),
      onSeeker: () => this.sim.audio.playSpell(),
      onIceBreak: () => this.sim.audio.playCrateCrack(),
      onKeyUnlock: () => this.sim.audio.playCardFound(),
      onPortal: () => this.sim.audio.playSpell(),
      onConveyor: () => this.sim.audio.playClick(),
      onChocolateSpread: () => this.sim.audio.playCheekyAlert(),
      onMazeShift: () => this.sim.audio.playSpell(),
      onPatronus: () => this.sim.audio.playTalismanBlast(),
      onSortingHat: () => this.sim.audio.playCardFound(),
      onBossHex: () => this.sim.audio.playCheekyAlert(),
      onBossEnrage: () => this.sim.audio.playTalismanBlast(),
      onHorcruxShatter: () => this.sim.audio.playTalismanBlast(),
      onVictory: () => this.sim.audio.playLevelUp(),
      onDefeat: () => this.sim.audio.playCheekyAlert(),
    };
  }

  private getDialog(): HTMLDialogElement | null {
    return this.root.querySelector('#match3Dialog') as HTMLDialogElement | null;
  }

  public isOpen(): boolean {
    return Boolean(this.getDialog()?.open);
  }

  private announceInDialog(message: string): void {
    if (!this.isOpen()) return;
    const region = this.root.querySelector('#m3LiveAnnouncer') as HTMLElement | null;
    if (!region) return;
    region.textContent = '';
    requestAnimationFrame(() => {
      if (this.isOpen() && region.isConnected) {
        region.textContent = message;
      }
    });
  }

  private clearLiveAnnouncement(): void {
    const region = this.root.querySelector('#m3LiveAnnouncer') as HTMLElement | null;
    if (region) {
      region.textContent = '';
    }
  }

  public resetSession(): void {
    this.clearLiveAnnouncement();
    this.engine?.destroy();
    this.engine = null;
    this.movesMadeThisAttempt = 0;
    this.companionCharge = 0;
    this.snackPieUsedThisAttempt = false;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.lastGameEndPayload = null;
    this.prevObjectiveRemaining = [];
    const dlg = this.getDialog();
    if (dlg?.open) dlg.close();
  }

  public open(overrideLevel?: number): void {
    const dlg = this.getDialog();
    if (!dlg) return;

    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    this.sim.setLastPlayedMinigame('match3');
    this.sim.tickMatch3Hearts(Date.now());
    if (typeof overrideLevel === 'number' && Number.isFinite(overrideLevel) && overrideLevel >= 1) {
      const maxAllowed =
        this.sim.state.sandboxMode || this.sim.isHeadmasterPreview
          ? MAX_MINIGAME_STAGE
          : Math.min(MAX_MINIGAME_STAGE, (this.sim.state.match3.maxClearedLevel ?? 0) + 1);
      const clampedLv = Math.min(maxAllowed, Math.floor(overrideLevel));
      if (clampedLv !== this.sim.state.match3.currentLevel) {
        this.sim.state.match3.activeSession = null;
      }
      this.sim.state.match3.currentLevel = clampedLv;
      this.engine?.destroy();
      this.engine = null;
    }

    const targetLv = this.sim.state.match3.currentLevel;
    const hasSavedForTarget = this.sim.state.match3.activeSession?.levelId === targetLv;
    if (
      !this.engine ||
      this.engine.level?.id !== targetLv ||
      this.engine.status === 'won' ||
      this.engine.busy
    ) {
      this.startFreshStage(targetLv, hasSavedForTarget, true);
    } else {
      const syncedHouse = toCandyHouseId(this.sim.getPlayerHouse());
      this.engine.setHouse(syncedHouse);
      this.engine.startLoop();
    }

    this.lastSeenSosRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
    if (!dlg.open) {
      dlg.showModal();
    }
    this.persistMatch3Session(true);
    this.persistActiveModalResumeMarker();
    this.renderDOM();
    this.onParentRefresh();
  }

  public openRescue(ctx: MinigameRescueContext): void {
    const dlg = this.getDialog();
    if (!dlg) return;
    const check = this.sim.canRescueNeighborMinigame(ctx.neighborId);
    if (!check.ok) {
      this.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
      return;
    }
    this.clearActiveModalResumeMarker();
    this.rescueContext = { ...ctx };
    this.rescueVictoryOutcome = null;
    this.startFreshStage(ctx.stage, true, false);
    if (!dlg.open) {
      dlg.showModal();
    }
    this.renderDOM();
    this.onParentRefresh();
  }

  public tickLiveHeaderTimer(): void {
    if (!this.isOpen()) return;
    this.sim.tickMatch3Hearts(Date.now());
    const m3 = this.sim.state.match3;

    const curRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
    if (!this.rescueContext && curRescuedAt !== this.lastSeenSosRescuedAt) {
      this.lastSeenSosRescuedAt = curRescuedAt;
      this.renderDOM();
      return;
    }

    const heartBadge = this.root.querySelector('#m3ModalHeartsText') as HTMLElement | null;
    if (heartBadge) {
      heartBadge.textContent = this.formatHeartsLabel();
    }

    if (!this.engine && (this.sim.state.sandboxMode || m3.hearts > 0)) {
      this.startFreshStage(m3.currentLevel);
      this.renderDOM();
      return;
    }

    const noHeartCountdown = this.root.querySelector('#m3NoHeartsCountdown') as HTMLElement | null;
    if (noHeartCountdown && m3.hearts < MAX_MATCH3_HEARTS && m3.nextHeartAt > 0) {
      const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
      const mm = Math.floor(leftSec / 60);
      const ss = String(leftSec % 60).padStart(2, '0');
      noHeartCountdown.textContent = `${mm}:${ss}`;
    }
  }

  private formatHeartsLabel(): string {
    if (this.sim.state.sandboxMode) return '∞';
    const m3 = this.sim.state.match3;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      return `${m3.hearts}/${MAX_MATCH3_HEARTS}`;
    }
    const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
    const mm = Math.floor(leftSec / 60);
    const ss = String(leftSec % 60).padStart(2, '0');
    return `${m3.hearts}/${MAX_MATCH3_HEARTS} (${mm}:${ss})`;
  }

  private ensureEngineInstance(): CandyHogwartsEngine {
    if (this.engine) return this.engine;
    this.engine = new CandyHogwartsEngine(null, {
      audio: this.buildAudioAdapter(),
      onToast: (msg, icon) => this.showToast(msg, icon ?? '🍬'),
      onBoosterConsumed: (boosterKind) => {
        const simId: Match3BoosterId =
          boosterKind === 'hammer'
            ? 'reparo_hammer'
            : boosterKind === 'swap'
              ? 'row_col_cannon'
              : 'alohomora_shuffle';
        const pay = this.sim.spendOrBuyMatch3Booster(simId);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return false;
        }
        this.onParentRefresh();
        return true;
      },
      onPlayerMoveCommitted: (movesUsed) => {
        const wasZero = this.movesMadeThisAttempt === 0;
        this.movesMadeThisAttempt = movesUsed;
        const comp = this.sim.getActiveMinigameCompanion();
        this.companionCharge = Math.min(comp.chargeEveryMoves, this.companionCharge + 1);
        if (wasZero) {
          this.refreshRestartButtonLabel();
        }
        this.syncHudSnapshot(this.engine?.getHudSnapshot() ?? null);
      },
      onBossEnraged: (boss: CandyBossRuntimeState) => {
        this.showToast(
          `${boss.emoji} ${boss.name} nổi cơn CUỒNG NỘ PHA 2 — niệm ${boss.hexName} dồn dập!`,
          '🔥'
        );
        this.announceInDialog(
          `Cảnh báo: ${boss.name} bước vào Cuồng Nộ Pha 2!`
        );
      },
      onStateChange: (snapshot) => {
        this.syncHudSnapshot(snapshot);
      },
      onSettled: () => {
        this.persistMatch3Session(true);
      },
      onGameEnd: (payload) => {
        this.handleEngineGameEnd(payload);
      },
    });
    return this.engine;
  }

  private startFreshStage(
    levelNum: number,
    bypassHeartCheck = false,
    allowRestore = false
  ): void {
    if (!allowRestore && !this.rescueContext && this.sim.state.match3.activeSession) {
      this.sim.state.match3.activeSession = null;
    }

    if (!bypassHeartCheck && !this.rescueContext) {
      const check = this.sim.canStartMatch3Level();
      if (!check.ok) {
        this.engine?.destroy();
        this.engine = null;
        this.movesMadeThisAttempt = 0;
        this.victoryClaimed = false;
        this.victorySummary = null;
        this.lastGameEndPayload = null;
        return;
      }
    }

    const levelData = getCandyLevelById(levelNum);
    const houseId = toCandyHouseId(this.sim.getPlayerHouse());
    const eng = this.ensureEngineInstance();

    this.movesMadeThisAttempt = 0;
    this.companionCharge = 0;
    this.snackPieUsedThisAttempt = false;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.lastGameEndPayload = null;
    this.prevObjectiveRemaining = [];

    eng.loadLevel(levelData, {
      house: houseId,
      winStreak: this.sim.state.match3.winStreak,
    });

    const saved =
      allowRestore && !this.rescueContext && this.sim.state.match3.activeSession?.levelId === levelNum
        ? this.sim.state.match3.activeSession
        : null;
    if (saved && eng.restoreSession(saved)) {
      this.movesMadeThisAttempt = Math.max(
        0,
        Math.round(saved.movesMadeThisAttempt ?? eng.movesUsed)
      );
      this.companionCharge = Math.max(0, Math.round(saved.companionCharge ?? 0));
      this.snackPieUsedThisAttempt = Boolean(saved.snackPieUsed);
    }

    const snap = eng.getHudSnapshot();
    if (snap) {
      this.prevObjectiveRemaining = snap.objectives.map((o) => o.remaining);
    }
    if (!this.rescueContext) {
      this.persistMatch3Session(true);
    }
  }

  private handleEngineGameEnd(payload: CandyGameEndPayload): void {
    this.lastGameEndPayload = payload;
    if (payload.won) {
      if (!this.victoryClaimed) {
        this.victoryClaimed = true;
        if (this.rescueContext) {
          const out = this.sim.completeNeighborMinigameRescue(this.rescueContext);
          this.rescueVictoryOutcome = {
            tokensEarned: out.tokensEarned,
            goldEarned: out.goldEarned,
            xpEarned: out.xpEarned,
            buildReduction: out.buildReduction,
          };
        } else {
          this.sim.state.match3.activeSession = null;
          this.clearActiveModalResumeMarker();
          this.victorySummary = this.sim.completeMatch3LevelVictory(
            payload.bonusCoinsFromLeftoverMoves,
            { sessionScore: payload.score }
          );
        }
        this.onParentRefresh();
      }
      this.announceInDialog(`Chiến thắng màn ${payload.levelId}! Đạt ${payload.stars} sao.`);
      this.mountOverlayOnly();
      this.syncHudSnapshot(this.engine?.getHudSnapshot() ?? null);
      return;
    }

    this.announceInDialog(
      payload.failReason === 'bomb'
        ? 'Bom Hắc Ám đã phát nổ! Chọn Bùa Phượng Hoàng hoặc cộng thêm lượt để gỡ ngòi.'
        : 'Hết lượt đi! Chọn tiếp sức hoặc thử lại màn.'
    );
    this.mountOverlayOnly();
    this.syncHudSnapshot(this.engine?.getHudSnapshot() ?? null);
  }

  private pulseGoalPill(goalIdx: number): void {
    const pill = this.root.querySelector(`[data-m3-goal-idx="${goalIdx}"]`) as HTMLElement | null;
    if (!pill) return;
    pill.classList.remove('bump');
    void pill.offsetWidth;
    pill.classList.add('bump');
  }

  private refreshRestartButtonLabel(): void {
    const btn = this.root.querySelector('#btnM3RestartStage') as HTMLButtonElement | null;
    if (btn) {
      btn.textContent = this.rescueContext
        ? '🔄 Ván Mới'
        : this.movesMadeThisAttempt === 0
          ? '🔄 Ván Mới'
          : '🔄 Lại (-1❤️)';
    }
  }

  private buildActionHintHtml(snap: CandyHudStateSnapshot | null): string {
    if (!snap) return '';
    if (snap.activeBooster === 'hammer') {
      return `<span class="m3-hint-accent">🍭 <strong>Búa Kẹo Đũa Phép</strong>: Chạm 1 ô để đập vỡ ngay!</span>`;
    }
    if (snap.activeBooster === 'swap') {
      return snap.swapFirstCell
        ? `<span class="m3-hint-accent">🪄 <strong>Đổi Kẹo</strong>: Chọn ô kề bên thứ 2 để tráo tự do!</span>`
        : `<span class="m3-hint-accent">🪄 <strong>Đổi Kẹo</strong>: Chọn viên kẹo thứ 1</span>`;
    }
    if (snap.level.seasonId === 7) {
      return `<span>💀 Linh Giá Khiên Hồn: Phá khiên bằng Kẹo Phép hoặc Búa Kẹo!</span>`;
    }
    return `<span>✨ Ghép 4 tạo Kẹo Sọc • Vuông 2×2 tạo Cánh Vàng Snitch</span>`;
  }

  private syncHudSnapshot(snap: CandyHudStateSnapshot | null): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box || !snap) return;

    const st = this.sim.state;
    const movesEl = box.querySelector('#m3MovesLeftVal') as HTMLElement | null;
    if (movesEl) {
      movesEl.textContent = String(snap.movesLeft);
      movesEl.classList.toggle('low-moves', snap.movesLeft <= 5);
    }

    const scoreEl = box.querySelector('#m3ScoreVal') as HTMLElement | null;
    if (scoreEl) {
      scoreEl.textContent = snap.score.toLocaleString('vi-VN');
    }

    const s3 = Math.max(1, snap.level.stars[2] || 1);
    const starPct = Math.min(100, Math.round((snap.score / s3) * 100));
    const starFill = box.querySelector('#m3StarFillBar') as HTMLElement | null;
    if (starFill) {
      starFill.style.width = `${starPct}%`;
    }
    for (let idx = 1; idx <= 3; idx++) {
      const starMark = box.querySelector(`#m3StarMark${idx}`) as HTMLElement | null;
      if (starMark) {
        starMark.classList.toggle('earned', snap.starsEarned >= idx);
      }
    }

    const goldEl = box.querySelector('#m3ModalGoldText') as HTMLElement | null;
    if (goldEl) {
      goldEl.textContent = st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN');
    }

    const starsEl = box.querySelector('#m3ModalStarsText') as HTMLElement | null;
    if (starsEl) {
      starsEl.textContent = st.sandboxMode ? '∞' : String(st.match3.stars);
    }

    const heartsEl = box.querySelector('#m3ModalHeartsText') as HTMLElement | null;
    if (heartsEl) {
      heartsEl.textContent = this.formatHeartsLabel();
    }

    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanEl = box.querySelector('#m3ModalTalismanText') as HTMLElement | null;
    if (talismanEl) {
      talismanEl.textContent = st.sandboxMode ? '∞' : String(talismanQty);
    }

    const talismanBtn = box.querySelector('#btnM3PhoenixTalisman') as HTMLButtonElement | null;
    if (talismanBtn) {
      const talismanDaily = this.sim.getPhoenixTalismanDailyStatus();
      const talismanLocked = snap.talismanUsed || talismanDaily.usedByGame.match3 === true;
      talismanBtn.disabled =
        talismanLocked || snap.status === 'won' || (!st.sandboxMode && talismanQty <= 0);
      talismanBtn.title = talismanLocked
        ? `Bùa Phượng Hoàng — Đã dùng 1/1 lượt hôm nay ở môn này (${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay, mở lại sau 00:00)`
        : `Bùa Phượng Hoàng — Tối đa 1 lần/môn/ngày (Đã dùng ${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay)`;
      talismanBtn.innerHTML = talismanLocked
        ? '<span>🔥 Bùa</span><span class="pa-cost-pill">✓ 1/1</span>'
        : `<span>🔥 Bùa</span><span class="pa-cost-pill">${st.sandboxMode ? '∞' : `×${talismanQty}`}</span>`;
    }

    // Live 2-Phase Boss HP strip
    if (snap.bossState) {
      const bs = snap.bossState;
      const bossHpPct = bs.maxHp > 0 ? Math.max(0, Math.min(100, Math.round((bs.hp / bs.maxHp) * 100))) : 0;
      const bossStrip = box.querySelector('#m3BossLiveStrip') as HTMLElement | null;
      if (bossStrip) {
        bossStrip.dataset.enraged = String(bs.enraged && !bs.defeated);
        bossStrip.dataset.defeated = String(bs.defeated);
      }
      const bossFill = box.querySelector('#m3BossHpFill') as HTMLElement | null;
      if (bossFill) {
        bossFill.style.width = `${bossHpPct}%`;
      }
      const bossHpText = box.querySelector('#m3BossHpText') as HTMLElement | null;
      if (bossHpText) {
        bossHpText.textContent = bs.defeated
          ? '✓ ĐÃ HẠ GỤC'
          : `${bs.hp.toLocaleString('vi-VN')} / ${bs.maxHp.toLocaleString('vi-VN')} HP`;
      }
      const bossPhaseBadge = box.querySelector('#m3BossPhaseBadge') as HTMLElement | null;
      if (bossPhaseBadge) {
        bossPhaseBadge.textContent = bs.defeated
          ? '✓ Toàn Thắng'
          : bs.enraged
            ? '🔥 CUỒNG NỘ PHA 2'
            : 'Pha 1';
      }
      const bossHexText = box.querySelector('#m3BossHexText') as HTMLElement | null;
      if (bossHexText) {
        bossHexText.textContent = bs.defeated
          ? '✓ Bùa tan biến'
          : `⚡ ${bs.hexName} (${bs.turnsUntilHex} lượt)`;
      }
    }

    // Action Hint Bar
    const hintBanner = box.querySelector('#m3ActionHintBar') as HTMLElement | null;
    if (hintBanner) {
      hintBanner.innerHTML = this.buildActionHintHtml(snap);
    }

    // Companion button
    const compBtn = box.querySelector('#btnM3TriggerCompanion') as HTMLButtonElement | null;
    if (compBtn) {
      const comp = this.sim.getActiveMinigameCompanion();
      const compReady = this.companionCharge >= comp.chargeEveryMoves;
      compBtn.dataset.ready = String(compReady);
      compBtn.disabled = !compReady || snap.status === 'won';
      const chargeLbl = compBtn.querySelector('[data-m3-comp-charge]');
      if (chargeLbl) {
        chargeLbl.textContent = compReady
          ? '⚡'
          : `${this.companionCharge}/${comp.chargeEveryMoves}`;
      }
      const meterFill = compBtn.querySelector('[data-m3-comp-meter]') as HTMLElement | null;
      if (meterFill) {
        const pct = Math.min(
          100,
          Math.round((this.companionCharge / Math.max(1, comp.chargeEveryMoves)) * 100)
        );
        meterFill.style.width = `${pct}%`;
      }
    }

    // Update goal cards & pulse when progress advances
    snap.objectives.forEach((g, idx) => {
      const pill = box.querySelector(`[data-m3-goal-idx="${idx}"]`) as HTMLElement | null;
      if (!pill) return;
      const meta = describeCandyObjective(g);
      pill.classList.toggle('done', g.completed);
      const countSpan = pill.querySelector('.m3-goal-count') as HTMLElement | null;
      if (countSpan) {
        countSpan.textContent = meta.countText;
      }
      const prevRem = this.prevObjectiveRemaining[idx];
      if (prevRem !== undefined && g.remaining < prevRem) {
        this.pulseGoalPill(idx);
      }
      this.prevObjectiveRemaining[idx] = g.remaining;
    });

    // Update booster buttons
    MATCH3_BOOSTERS.forEach((bDef) => {
      const btn = box.querySelector(`[data-m3-booster="${bDef.id}"]`) as HTMLButtonElement | null;
      if (!btn) return;
      const qty = st.match3.boosters[bDef.id] ?? 0;
      const media = BOOSTER_MEDIA[bDef.id];
      const armed = snap.activeBooster === media.engineKind;
      btn.setAttribute('data-active', String(armed));
      btn.setAttribute('aria-pressed', String(armed));
      const badge = btn.querySelector('.m3-booster-qty') as HTMLElement | null;
      if (badge) {
        badge.textContent = st.sandboxMode ? '∞' : qty > 0 ? `×${qty}` : `🪙${bDef.goldCost}`;
        badge.classList.toggle('buy', !st.sandboxMode && qty <= 0);
      }
    });
  }

  private renderOverlayHtml(lv: CandyHogwartsLevel): string {
    if (!this.engine) return '';
    const st = this.sim.state;
    const m3 = st.match3;
    const m3Rank = this.sim.getPlayerMinigameRank('match3', 'valley');
    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanUsed = this.engine.talismanUsed || this.sim.isPhoenixTalismanUsedToday('match3');
    const extraMovesCost = getExtraMovesGoldCost(lv.id);

    const socialState = this.sim.ensureNeighborSocial();
    const mySosMatch3 =
      !this.rescueContext &&
      socialState.playerMinigameSos &&
      !socialState.playerMinigameSos.claimed &&
      socialState.playerMinigameSos.kind === 'match3' &&
      socialState.playerMinigameSos.stage === lv.id
        ? socialState.playerMinigameSos
        : null;
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - socialState.dailyRescuesReceivedCount
    );

    if (this.engine.status === 'won' && this.rescueContext && this.rescueVictoryOutcome) {
      const rv = this.rescueVictoryOutcome;
      return `
        <div class="m3-board-overlay" role="region" aria-label="Giải cứu thành công">
          <div class="m3-overlay-card victory">
            <div style="font-size:38px;line-height:1;">🏆🍀</div>
            <h3 style="font-size:20px;font-weight:900;color:#451a03;">
              Cứu Thành Công (${escapeHtml(this.rescueContext.neighborName)})!
            </h3>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} 🍀</span>
              <span class="m3-reward-chip">+${rv.goldEarned} 🪙</span>
              <span class="m3-reward-chip">+${rv.xpEarned} ⭐ XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(rv.buildReduction.reducedSec)}</span>`
                  : ''
              }
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn gold-cta" style="flex:1;min-width:190px;padding:9px 14px;font-size:13.5px;">
                🏡 Về Vườn
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.engine.status === 'won' && this.victorySummary) {
      const vs = this.victorySummary;
      const boardStars = Math.max(1, Math.min(3, this.lastGameEndPayload?.stars ?? 3));
      const starIconsHtml = Array.from({ length: boardStars }, (_, idx) => {
        const isCenter = boardStars === 3 && idx === 1;
        return `<img src="/sprites/m3_icon_star.png" alt="" class="m3-victory-star-img ${isCenter ? 'center' : ''}" />`;
      }).join('');

      return `
        <div class="m3-board-overlay" role="region" aria-label="Chiến thắng màn giải đố">
          <div class="m3-overlay-card victory">
            <div class="m3-victory-stars-row">${starIconsHtml}</div>
            <h3 style="font-size:20px;font-weight:900;color:#451a03;">${
              vs.isMasterReplay
                ? `👑 777/777 — ${escapeHtml(lv.title)}!`
                : lv.id >= MAX_MINIGAME_STAGE
                  ? `👑 ĐẠI THẮNG VOLDEMORT 777/777!`
                  : `🎉 Thắng Màn ${lv.id}/${MAX_MINIGAME_STAGE}!`
            }</h3>
            <div class="m3-reward-badges">
              ${
                vs.starsEarned > 0
                  ? `<span class="m3-reward-chip star">
                      <img src="/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" />
                      +${vs.starsEarned} 🌟
                    </span>`
                  : `<span class="m3-reward-chip star">👑 777/777</span>`
              }
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              <button id="btnM3NextLevel" type="button" class="brass-btn gold-cta" style="flex:1;min-width:140px;padding:9px 14px;font-size:13.5px;">
                ${vs.isMasterReplay || lv.id >= MAX_MINIGAME_STAGE ? `👑 Chơi Lại` : `▶️ Màn ${vs.nextLevel}`}
              </button>
              <button id="btnM3VictoryLeaderboard" type="button" class="brass-btn" style="flex:0.85;min-width:110px;padding:9px 12px;font-size:13px;">
                🏆 #${m3Rank}
              </button>
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn" style="flex:1;min-width:130px;padding:9px 14px;font-size:13px;">
                🏡 Về Vườn (${st.sandboxMode ? '∞' : m3.stars} 🌟)
              </button>
            </div>
          </div>
        </div>
      `;
    }

    if (this.engine.status === 'out_of_moves') {
      const canRescueTalisman = !talismanUsed && (st.sandboxMode || talismanQty > 0);
      const isBombFail = this.engine.failReason === 'bomb';
      return `
        <div class="m3-board-overlay" role="region" aria-label="${isBombFail ? 'Bom Hắc Ám phát nổ' : 'Hết lượt đi'}">
          <div class="m3-overlay-card rescue">
            <div class="m3-rescue-hero-icon">
              ${pictureSpriteHtml(`/paintings/candy-hogwarts/booster-extramoves.webp?v=${CANDY_ASSET_REV}`, `/paintings/candy-hogwarts/booster-extramoves.png?v=${CANDY_ASSET_REV}`, 'm3-rescue-booster-img')}
            </div>
            <h3 style="font-size:19px;font-weight:900;color:#451a03;">
              ${isBombFail ? '💣 Bom Hắc Ám Phát Nổ!' : 'Hết Lượt Phép Thuật!'}
            </h3>
            <p style="font-size:12.4px;color:#78350f;max-width:360px;line-height:1.42;margin:0;">
              ${
                isBombFail
                  ? 'Ngòi nổ chạm 0! Tiếp sức ngay sẽ tự động lùi thêm nhịp đếm Bom trên bàn cờ.'
                  : 'Chỉ còn vài bước nữa là phá giải màn kẹo phép — tiếp sức ngay để giữ chuỗi thắng!'
              }
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              ${
                canRescueTalisman
                  ? `<button id="btnM3RescuePhoenixTalisman" type="button" class="brass-btn pa-tool-btn talisman" style="flex:1.4;min-width:170px;padding:9px 14px;">
                      🔥 Bùa (+5 Lượt &amp; Gỡ Bom • ${st.sandboxMode ? '∞' : `×${talismanQty}`})
                    </button>`
                  : ''
              }
              <button id="btnM3BuyExtraMoves" type="button" class="brass-btn gold-cta" style="flex:1.2;min-width:150px;padding:9px 14px;">
                🪄 +${EXTRA_MOVES_COUNT} Lượt (${st.sandboxMode ? '0G' : `🪙 ${extraMovesCost}G`})
              </button>
              <button id="btnM3GiveUpRetry" type="button" class="brass-btn" style="flex:0.8;min-width:110px;padding:9px 12px;">
                ${this.rescueContext ? '🔄 Thử Lại' : '💔 Thử Lại (-1 ❤️)'}
              </button>
              ${
                !this.rescueContext
                  ? mySosMatch3?.rescuedAt
                    ? `<button id="btnM3OverlayClaimSos" type="button" class="brass-btn gold-cta" style="flex:1.4;min-width:160px;padding:9px 14px;">
                        🎉 Qua Màn Ngay!
                      </button>`
                    : `<button id="btnM3OverlayAskFriend" type="button" class="brass-btn" style="flex:1.2;min-width:150px;padding:9px 12px;" ${rescuesReceivedLeft <= 0 && !mySosMatch3 ? 'disabled' : ''}>
                        ${mySosMatch3 ? '🦉 Đang chờ...' : `🆘 Cứu (${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES})`}
                      </button>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }

    return '';
  }

  private mountOverlayOnly(): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    const mount = box?.querySelector('#m3OverlayMount') as HTMLElement | null;
    const lv = this.engine?.level;
    if (!box || !mount || !lv) {
      this.renderDOM();
      return;
    }
    mount.innerHTML = this.renderOverlayHtml(lv);
    this.bindOverlayEvents(box);
  }

  public renderDOM(): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box) return;

    const st = this.sim.state;
    const m3 = st.match3;
    const lv = this.engine?.level ?? getCandyLevelById(m3.currentLevel);
    const season = getCandySeasonByLevel(lv.id);
    const chapter = getCandyChapterForLevel(lv.id);
    const m3Info = this.sim.getDisciplineStageInfo('match3');
    const m3Rank = this.sim.getPlayerMinigameRank('match3', 'valley');
    const diffMeta = formatDifficultyMeta(lv);

    const bossState = this.engine?.buildBossRuntimeState() ?? null;
    const milestoneMeta = getMilestoneBossMeta(lv.id);
    const reqTrial = this.sim.getRequiredLevelTrial();

    const trialBadgeFor = (kind: PuzzleArcadeMode | 'match3'): string => {
      if (!reqTrial || st.sandboxMode || this.sim.isHeadmasterPreview) return '';
      if (reqTrial.kind !== kind) return '';
      return `<span class="pa-tab-trial" title="Môn Đề Cử">🔥</span>`;
    };

    const fmtTabLv = (kind: PuzzleArcadeMode | 'match3'): string => {
      const inf = this.sim.getDisciplineStageInfo(kind);
      return inf.isMaxed ? `👑777` : `${inf.currentStage}/777`;
    };

    const stageHeadline = `${m3Info.isMaxed ? '👑 ' : ''}Màn ${lv.id}/${MAX_MINIGAME_STAGE} • ${diffMeta.icon} ${escapeHtml(lv.title)}`;
    const stageSubtitle =
      milestoneMeta && !bossState
        ? `👑 ${escapeHtml(milestoneMeta.bossGuardianVi)} • ${escapeHtml(milestoneMeta.mechanicTagVi)}`
        : `${escapeHtml(season.signatureIcon)} ${escapeHtml(season.yearLabel)} • Chương ${chapter.globalChapterId}/${CANDY_HOGWARTS_TOTAL_CHAPTERS}`;

    const topStripHtml = `
      <div class="pa-top-bar">
        <div class="pa-dock-head-row">
          <div class="pa-currencies">
            <span class="m3-res-chip" title="Sao Phép Thuật">
              <img src="/sprites/m3_icon_star.png" alt="Sao" class="m3-res-icon" />
              <strong id="m3ModalStarsText">${st.sandboxMode ? '∞' : m3.stars}</strong>
            </span>
            <span class="m3-res-chip" title="Tim giải đố">
              <img src="/sprites/m3_icon_heart.png" alt="Tim" class="m3-res-icon" />
              <strong id="m3ModalHeartsText">${this.formatHeartsLabel()}</strong>
            </span>
            <span class="m3-res-chip" title="Vàng Galleon">
              <span class="g-coin" style="width:17px;height:17px;font-size:10.5px;">G</span>
              <strong id="m3ModalGoldText">${st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN')}</strong>
            </span>
            <span class="m3-res-chip" title="Bùa Phượng Hoàng">
              <span>🔥</span>
              <strong id="m3ModalTalismanText">${st.sandboxMode ? '∞' : this.sim.getPhoenixTalismanCount()}</strong>
            </span>
            <button id="btnM3OpenLeaderboard" type="button" class="m3-res-chip minigame-lb-chip" title="Bảng Xếp Hạng (#${m3Rank})">
              <span>🏆</span>
              <strong id="m3ModalRankText">#${m3Rank}</strong>
            </button>
          </div>
          <form method="dialog" class="pa-inline-close-form">
            <button type="submit" value="close" class="brass-btn pa-inline-close-btn" title="Đóng (Esc)" aria-label="Đóng">✕</button>
          </form>
        </div>

        <div class="pa-mode-tabs" role="tablist" aria-label="Chọn môn khảo thí phép thuật Hogwarts" ${this.rescueContext ? 'style="opacity:0.65;pointer-events:none;"' : ''}>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="caro" class="pa-mode-tab" title="Ngũ Ấn Đạo Tặc">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🗺️ Ngũ Ấn Đạo Tặc</span><span class="pa-tab-name-short">🗺️ Ngũ Ấn</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('caro')}</span>${trialBadgeFor('caro')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="sudoku" class="pa-mode-tab" title="Số Học Huyền Bí">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🔢 Số Học Huyền Bí</span><span class="pa-tab-name-short">🔢 Số Học</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('sudoku')}</span>${trialBadgeFor('sudoku')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="chess" class="pa-mode-tab" title="Cờ Phù Thủy">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🏰 Cờ Phù Thủy</span><span class="pa-tab-name-short">🏰 Cờ Phù Thủy</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('chess')}</span>${trialBadgeFor('chess')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="blocks" class="pa-mode-tab" title="Sinh Vật Huyền Bí">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🦄 Sinh Vật Huyền Bí</span><span class="pa-tab-name-short">🦄 Sinh Vật</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('blocks')}</span>${trialBadgeFor('blocks')}</span>
          </button>
          <button type="button" role="tab" aria-selected="true" class="pa-mode-tab active" title="Bùa Gặt Honeydukes">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🍬 Bùa Gặt Honeydukes</span><span class="pa-tab-name-short">🍬 Bùa Gặt</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('match3')}</span>${trialBadgeFor('match3')}</span>
          </button>
        </div>
      </div>

      <div class="pa-stage-banner">
        <div class="pa-stage-meta">
          <div class="pa-stage-title">${stageHeadline}</div>
          <div class="pa-stage-sub">${stageSubtitle}</div>
        </div>
      </div>
      ${(() => {
        if (bossState) {
          const hpPct =
            bossState.maxHp > 0
              ? Math.max(0, Math.min(100, Math.round((bossState.hp / bossState.maxHp) * 100)))
              : 0;
          return `<div id="m3BossLiveStrip" class="pa-boss-strip m3-boss-live-strip" data-enraged="${bossState.enraged && !bossState.defeated}" data-defeated="${bossState.defeated}">
            <div class="m3-boss-head-row">
              <span id="m3BossPhaseBadge" class="m3-boss-phase-pill">${
                bossState.defeated
                  ? '✓ Toàn Thắng'
                  : bossState.enraged
                    ? '🔥 CUỒNG NỘ PHA 2'
                    : 'Pha 1'
              }</span>
              <div class="m3-boss-hp-track" role="progressbar" aria-valuemin="0" aria-valuemax="${bossState.maxHp}" aria-valuenow="${bossState.hp}" aria-label="Máu Đại Trùm">
                <div id="m3BossHpFill" class="m3-boss-hp-fill" style="width:${hpPct}%"></div>
                <span id="m3BossHpText" class="m3-boss-hp-label">${
                  bossState.defeated
                    ? '✓ ĐÃ HẠ GỤC'
                    : `${bossState.hp.toLocaleString('vi-VN')} / ${bossState.maxHp.toLocaleString('vi-VN')} HP`
                }</span>
              </div>
              <span id="m3BossHexText" class="m3-boss-hex-tag">${
                bossState.defeated
                  ? '✓ Bùa tan biến'
                  : `⚡ ${escapeHtml(bossState.hexName)} (${bossState.turnsUntilHex} lượt)`
              }</span>
            </div>
          </div>`;
        }
        return '';
      })()}
      ${(() => {
        if (this.rescueContext) {
          return `<div class="pa-trial-strip urgent">
            <span>⚔️ <strong>CỨU MÀN ${this.rescueContext.stage}</strong> (${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong>) • <strong>+3 🍀 + 95G</strong></span>
          </div>`;
        }
        const social = this.sim.ensureNeighborSocial();
        const mySos = social.playerMinigameSos;
        let sosStrip = '';
        if (mySos && !mySos.claimed && mySos.kind === 'match3' && mySos.stage === lv.id) {
          if (mySos.rescuedAt) {
            sosStrip = `<div class="pa-trial-strip done">
              <span>🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Hàng xóm')}</strong> đã cứu Màn ${mySos.stage}!</span>
              <button type="button" id="btnM3ClaimSosRescue" class="brass-btn gold-cta pa-trial-jump-btn">🎉 Qua Màn</button>
            </div>`;
          } else {
            sosStrip = `<div class="pa-trial-strip">
              <span>🦉 Đang gọi cứu viện <strong>Màn ${mySos.stage}</strong>...</span>
            </div>`;
          }
        }
        return sosStrip;
      })()}
    `;

    // Case 1: Out of Hearts
    if (!this.engine) {
      const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
      const mm = Math.floor(leftSec / 60);
      const ss = String(leftSec % 60).padStart(2, '0');
      const butterbeerQty = st.supply.goods.aged_butterbeer ?? 0;

      box.innerHTML = `
        <div id="m3LiveAnnouncer" class="m3-sr-only" aria-live="polite" aria-atomic="true"></div>
        <div class="pa-layout-shell m3-empty-shell">
          <aside class="pa-side-dock" aria-label="Bảng chọn trò chơi">
            ${topStripHtml}
          </aside>
          <div class="pa-stage-viewport">
            <div class="m3-empty-hearts-card">
              <img src="/sprites/m3_icon_heart.png" alt="Tim" style="width:52px;height:52px;object-fit:contain;filter:grayscale(0.25) drop-shadow(0 6px 10px rgba(0,0,0,0.3));" />
              <h3 style="font-size:18px;font-weight:900;color:#451a03;">Hết Tim Giải Đố!</h3>
              <p style="font-size:12.5px;max-width:440px;line-height:1.45;color:#78350f;margin:0;">
                <strong>+1 ❤️</strong> sau <strong id="m3NoHeartsCountdown" style="color:#b45309;">${mm}:${ss}</strong>
              </p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:4px;">
                <button id="btnM3RefillHeartsNow" type="button" class="brass-btn gold-cta" style="padding:8px 16px;font-size:13px;">
                  ${
                    butterbeerQty > 0
                      ? `🍻 Hồi 5 ❤️ (×${butterbeerQty})`
                      : `❤️ Hồi 5/5 (🪙 ${REFILL_HEARTS_GOLD_COST}G)`
                  }
                </button>
                <button id="btnM3EmptyGoArcade" type="button" class="brass-btn pa-hud-cta" style="padding:8px 14px;font-size:12.5px;">
                  ♟️ 4 Môn Khảo Thí
                </button>
                <button id="btnM3BackToPark" type="button" class="brass-btn" style="padding:8px 14px;font-size:12.5px;">
                  🏡 Về Vườn
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      box.querySelector('#btnM3SwitchPuzzleArcade')?.addEventListener('click', () => {
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.();
      });
      box.querySelector('#btnM3OpenLeaderboard')?.addEventListener('click', () => {
        this.sim.audio.playClick();
        this.onOpenLeaderboard?.();
      });
      box.querySelector('#btnM3EmptyGoArcade')?.addEventListener('click', () => {
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.();
      });
      box.querySelectorAll('[data-m3-jump-arcade]').forEach((el) => {
        el.addEventListener('click', () => {
          const target = (el as HTMLElement).dataset.m3JumpArcade as PuzzleArcadeMode | undefined;
          this.getDialog()?.close();
          this.onSwitchToPuzzleArcade?.(target);
        });
      });
      box.querySelector('#btnM3RefillHeartsNow')?.addEventListener('click', () => {
        const res = this.sim.refillMatch3Hearts();
        this.showToast(res.msg, res.ok ? '❤️' : '🪙');
        if (res.ok) {
          this.startFreshStage(this.sim.state.match3.currentLevel);
          this.renderDOM();
        }
      });
      box.querySelector('#btnM3BackToPark')?.addEventListener('click', () => {
        this.getDialog()?.close();
      });
      return;
    }

    // Case 2: Active Board
    const snap = this.engine.getHudSnapshot()!;
    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanDaily = this.sim.getPhoenixTalismanDailyStatus();
    const talismanUsed = snap.talismanUsed || talismanDaily.usedByGame.match3 === true;
    const talismanTooltip = talismanUsed
      ? `Bùa Phượng Hoàng — Đã dùng 1/1 lượt hôm nay ở môn này (${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay, mở lại sau 00:00)`
      : `Bùa Phượng Hoàng — Tối đa 1 lần/môn/ngày (Đã dùng ${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay)`;

    const goalsHtml = snap.objectives
      .map((g, idx) => {
        const meta = describeCandyObjective(g);
        return `
          <div class="m3-goal-pill ${g.completed ? 'done' : ''}" data-m3-goal-idx="${idx}" style="border-left: 5px solid ${meta.accent};" title="${escapeHtml(meta.label)}">
            <div class="m3-goal-icon-well" style="position:relative;">${meta.visualHtml}</div>
            <div class="m3-goal-meta">
              <div class="m3-goal-name">${escapeHtml(meta.label)}</div>
              <div class="m3-goal-count">${escapeHtml(meta.countText)}</div>
            </div>
          </div>
        `;
      })
      .join('');

    const boostersHtml = MATCH3_BOOSTERS.map((bDef) => {
      const qty = m3.boosters[bDef.id] ?? 0;
      const media = BOOSTER_MEDIA[bDef.id];
      const armed = snap.activeBooster === media.engineKind;
      const isBuy = !st.sandboxMode && qty <= 0;
      return `
        <button
          type="button"
          class="brass-btn m3-booster-btn"
          data-m3-booster="${bDef.id}"
          data-active="${armed}"
          aria-pressed="${armed}"
          title="${escapeHtml(bDef.description)}"
        >
          ${pictureSpriteHtml(media.webp, media.png, 'm3-booster-sprite')}
          <span class="m3-booster-lbl">${escapeHtml(bDef.shortLabel)}</span>
          <span class="m3-booster-qty ${isBuy ? 'buy' : ''}">${st.sandboxMode ? '∞' : qty > 0 ? `×${qty}` : `🪙${bDef.goldCost}`}</span>
        </button>
      `;
    }).join('');

    const socialState = this.sim.ensureNeighborSocial();
    const mySosMatch3 =
      !this.rescueContext &&
      socialState.playerMinigameSos &&
      !socialState.playerMinigameSos.claimed &&
      socialState.playerMinigameSos.kind === 'match3' &&
      socialState.playerMinigameSos.stage === lv.id
        ? socialState.playerMinigameSos
        : null;
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - socialState.dailyRescuesReceivedCount
    );

    const restartLabel = this.rescueContext
      ? '🔄 Ván Mới'
      : this.movesMadeThisAttempt === 0
        ? '🔄 Ván Mới'
        : '🔄 Lại (-1❤️)';

    const comp = this.sim.getActiveMinigameCompanion();
    const compReady = this.companionCharge >= comp.chargeEveryMoves;
    const compPct = Math.min(
      100,
      Math.round((this.companionCharge / Math.max(1, comp.chargeEveryMoves)) * 100)
    );
    const compSpriteMap: Record<string, string> = {
      niffler_den: 'beast_niffler_play',
      hippogriff_glade: 'beast_hippogriff_bow',
      phoenix_perch: 'beast_phoenix_soar',
      dragon_lair: 'beast_dragon_roar',
      unicorn_glade: 'beast_unicorn_prance',
      thestral_grove: 'beast_thestral_wings',
      hagrid_bowtruckle: 'hagrid_bowtruckle',
    };
    const compShortMap: Record<string, string> = {
      niffler_den: 'Niffler',
      hippogriff_glade: 'Bằng Mã',
      phoenix_perch: 'Phượng',
      dragon_lair: 'Rồng Nhỏ',
      unicorn_glade: 'Kỳ Lân',
      thestral_grove: 'Vong Mã',
      hagrid_bowtruckle: 'Bowtruckle',
    };
    const compSpriteKey = compSpriteMap[comp.speciesId] ?? 'beast_niffler_play';
    const compShortName = compShortMap[comp.speciesId] ?? 'Niffler';
    const pieQty = this.sim.getFarmItemCount('cinnamon_apple_pie');

    const synergyDockHtml = `
      <div class="aaa-synergy-dock" role="region" aria-label="Bánh Táo và Đồng hành Niffler">
        <button
          id="btnM3SnackApplePie"
          type="button"
          class="aaa-snack-btn"
          ${this.snackPieUsedThisAttempt || snap.status === 'won' || (!st.sandboxMode && pieQty <= 0) ? 'disabled' : ''}
          title="Dùng 1 Bánh Táo Quế từ Kho Đỏ (+3 Lượt đi & lùi +3 nhịp Bom)"
        >
          <img src="/sprites/ui_icon_pie_ready.png" alt="" width="20" height="20" class="aaa-synergy-sprite" />
          <span><span class="aaa-lbl-full">Bánh Táo </span><strong data-m3-pie-qty="1">${this.snackPieUsedThisAttempt ? '✓' : st.sandboxMode ? '∞' : `×${pieQty}`}</strong></span>
        </button>
        <button
          id="btnM3TriggerCompanion"
          type="button"
          class="aaa-companion-pill"
          data-ready="${compReady}"
          ${!compReady || snap.status === 'won' ? 'disabled' : ''}
          title="${escapeHtml(comp.nameVi)} (Cấp ${comp.bondLevel}) — Đầy năng lượng nhận +2 Lượt, Cánh Vàng Snitch & +15G!"
        >
          <img src="/sprites/${compSpriteKey}.png" alt="" width="22" height="22" class="aaa-synergy-sprite" />
          <span class="aaa-comp-name">${escapeHtml(compShortName)}</span>
          <span class="aaa-comp-meter" aria-hidden="true"><span class="aaa-comp-meter-fill" data-m3-comp-meter="1" style="width:${compPct}%"></span></span>
          <span data-m3-comp-charge="1">${compReady ? '⚡' : `${this.companionCharge}/${comp.chargeEveryMoves}`}</span>
        </button>
      </div>
    `;

    box.innerHTML = `
      <div id="m3LiveAnnouncer" class="m3-sr-only" aria-live="polite" aria-atomic="true"></div>
      <div class="pa-layout-shell m3-unified-shell">
        <aside class="pa-side-dock" aria-label="Bảng chọn trò chơi và mục tiêu">
          ${topStripHtml}

          <div class="m3-dock-hud" title="Mốc 1★: ${lv.stars[0].toLocaleString('vi-VN')} • 2★: ${lv.stars[1].toLocaleString('vi-VN')} • 3★: ${lv.stars[2].toLocaleString('vi-VN')}">
            <div class="m3-moves-crest">
              <span class="m3-moves-lbl">LƯỢT</span>
              <strong id="m3MovesLeftVal" class="m3-moves-num ${snap.movesLeft <= 5 ? 'low-moves' : ''}">${snap.movesLeft}</strong>
              <span class="m3-score-sub"><strong id="m3ScoreVal">${snap.score.toLocaleString('vi-VN')}</strong> đ</span>
            </div>
            <div class="m3-goals-list">
              ${goalsHtml}
            </div>
          </div>

          ${synergyDockHtml}
        </aside>

        <div class="pa-stage-viewport">
          <div class="pa-canvas-shell" data-pa-board-mode="match3">
            <canvas
              id="match3Canvas"
              width="${VIRTUAL_W}"
              height="${VIRTUAL_W}"
              tabindex="0"
              aria-label="Bàn kẹo phép thuật Hang Sóc ${lv.size} nhân ${lv.size}, mũi tên di chuyển, Enter chọn"
            ></canvas>
          </div>
        </div>

        <div class="pa-controls-bar m3-dock-controls">
          <div class="m3-booster-row">
            ${boostersHtml}
          </div>
          <button
            id="btnM3PhoenixTalisman"
            type="button"
            class="pa-tool-btn talisman m3-talisman-btn"
            ${talismanUsed || snap.status === 'won' || (!st.sandboxMode && talismanQty <= 0) ? 'disabled' : ''}
            title="${talismanTooltip}"
          >
            <span>🔥 Bùa</span>
            <span class="pa-cost-pill">${talismanUsed ? '✓ 1/1' : `×${st.sandboxMode ? '∞' : talismanQty}`}</span>
          </button>
          <button id="btnM3RestartStage" type="button" class="pa-tool-btn">
            ${restartLabel}
          </button>
          ${
            !this.rescueContext
              ? mySosMatch3?.rescuedAt
                ? `<button id="btnM3SideClaimSos" type="button" class="pa-tool-btn active">
                    🎉 Qua Màn!
                  </button>`
                : `<button id="btnM3AskFriendSos" type="button" class="pa-tool-btn" ${rescuesReceivedLeft <= 0 && !mySosMatch3 ? 'disabled' : ''} title="Nhờ bạn bè giải cứu">
                    ${mySosMatch3 ? '🦉 Đang gọi' : `🆘 Cứu ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}`}
                  </button>`
              : ''
          }
        </div>
      </div>
      <div id="m3OverlayMount">${this.renderOverlayHtml(lv)}</div>
    `;

    this.bindStageDOMEvents(box);
  }

  private bindOverlayEvents(box: HTMLElement): void {
    box.querySelector('#btnM3NextLevel')?.addEventListener('click', () => {
      this.startFreshStage(this.sim.state.match3.currentLevel);
      this.renderDOM();
    });

    box.querySelector('#btnM3VictoryLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.();
    });

    box.querySelector('#btnM3UseStarsInPark')?.addEventListener('click', () => {
      this.getDialog()?.close();
    });

    box.querySelector('#btnM3RescuePhoenixTalisman')?.addEventListener('click', () => {
      void this.triggerMatch3Talisman();
    });

    box.querySelector('#btnM3BuyExtraMoves')?.addEventListener('click', () => {
      if (!this.engine || !this.engine.level) return;
      const res = this.sim.buyMatch3ExtraMoves(this.engine.level.id);
      this.showToast(res.msg, res.ok ? '🪄' : '🪙');
      if (res.ok) {
        this.engine.addExtraMoves(EXTRA_MOVES_COUNT);
        this.onParentRefresh();
        this.mountOverlayOnly();
        this.syncHudSnapshot(this.engine.getHudSnapshot());
      }
    });

    box.querySelector('#btnM3GiveUpRetry')?.addEventListener('click', () => {
      if (!this.rescueContext) {
        this.sim.loseMatch3Heart();
      }
      this.startFreshStage(
        this.rescueContext ? this.rescueContext.stage : this.sim.state.match3.currentLevel,
        Boolean(this.rescueContext)
      );
      this.renderDOM();
    });

    box.querySelector('#btnM3OverlayAskFriend')?.addEventListener('click', () => {
      this.handleAskFriendSos();
    });

    box.querySelector('#btnM3OverlayClaimSos')?.addEventListener('click', () => {
      this.handleClaimFriendSos();
    });
  }

  private handleAskFriendSos(): void {
    if (!this.engine?.level || this.rescueContext) return;
    this.sim.requestPlayerMinigameSos('match3', this.engine.level.id);
    this.lastSeenSosRescuedAt =
      this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
    this.renderDOM();
  }

  private handleClaimFriendSos(): void {
    const res = this.sim.claimPlayerMinigameSosRescue();
    if (res.ok) {
      this.lastSeenSosRescuedAt = 0;
      this.startFreshStage(this.sim.state.match3.currentLevel);
      this.renderDOM();
    } else {
      this.showToast(res.msg, '🦉');
    }
  }

  private async triggerMatch3Talisman(): Promise<void> {
    if (!this.engine || this.engine.status === 'won') return;
    const gate = this.sim.canUsePhoenixTalismanInGame('match3');
    if (!gate.ok) {
      this.showToast(gate.msg, '🔥');
      return;
    }
    if (this.engine.talismanUsed) {
      this.showToast(
        'Hôm nay bạn đã dùng 🔥 Bùa Phượng Hoàng ở môn này rồi (giới hạn 1 lần/môn/ngày)!',
        '🔥'
      );
      return;
    }
    const pay = this.sim.consumePhoenixTalisman('match3');
    if (!pay.ok) {
      this.showToast(pay.msg, '🔥');
      return;
    }
    const wasOutOfMoves = this.engine.status === 'out_of_moves';
    if (wasOutOfMoves) {
      const mount = this.root.querySelector('#m3OverlayMount') as HTMLElement | null;
      if (mount) mount.innerHTML = '';
    }
    const res = await this.engine.applyPhoenixTalisman();
    if (!res.ok) {
      this.sim.refundPhoenixTalismanAttempt('match3');
    }
    this.showToast(res.msg, '🔥');
    this.onParentRefresh();
    this.syncHudSnapshot(this.engine.getHudSnapshot());
  }

  private bindStageDOMEvents(box: HTMLElement): void {
    const canvas = box.querySelector('#match3Canvas') as HTMLCanvasElement | null;
    if (canvas && this.engine) {
      this.engine.attachCanvas(canvas);
    }

    // Booster buttons
    box.querySelectorAll<HTMLButtonElement>('[data-m3-booster]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.engine || this.engine.status !== 'playing') return;
        const bId = btn.dataset.m3Booster as Match3BoosterId;
        const bDef = MATCH3_BOOSTERS.find((b) => b.id === bId);
        if (!bDef) return;
        const media = BOOSTER_MEDIA[bId];

        const st = this.sim.state;
        const qty = st.match3.boosters[bId] ?? 0;
        const alreadyArmed = this.engine.activeBooster === media.engineKind;
        if (!alreadyArmed && !st.sandboxMode && qty <= 0 && st.galleons < bDef.goldCost) {
          this.sim.audio.playCheekyAlert();
          this.showToast(`Cần ${bDef.goldCost}G để mua ${bDef.name}!`, '🪙');
          return;
        }

        this.sim.audio.playClick();
        this.engine.setBoosterMode(media.engineKind);
      });
    });

    // Header & navigation buttons
    box.querySelector('#btnM3SwitchPuzzleArcade')?.addEventListener('click', () => {
      this.getDialog()?.close();
      this.onSwitchToPuzzleArcade?.();
    });
    box.querySelector('#btnM3OpenLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.();
    });
    box.querySelectorAll('[data-m3-jump-arcade]').forEach((el) => {
      el.addEventListener('click', () => {
        const target = (el as HTMLElement).dataset.m3JumpArcade as PuzzleArcadeMode | undefined;
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.(target);
      });
    });

    box.querySelector('#btnM3RestartStage')?.addEventListener('click', () => {
      if (!this.engine) return;
      if (!this.rescueContext && this.movesMadeThisAttempt > 0) {
        this.sim.loseMatch3Heart();
      }
      this.startFreshStage(
        this.rescueContext ? this.rescueContext.stage : this.sim.state.match3.currentLevel,
        Boolean(this.rescueContext)
      );
      this.renderDOM();
    });

    box.querySelector('#btnM3AskFriendSos')?.addEventListener('click', () => {
      this.handleAskFriendSos();
    });
    box.querySelector('#btnM3ClaimSosRescue')?.addEventListener('click', () => {
      this.handleClaimFriendSos();
    });
    box.querySelector('#btnM3SideClaimSos')?.addEventListener('click', () => {
      this.handleClaimFriendSos();
    });

    box.querySelector('#btnM3PhoenixTalisman')?.addEventListener('click', () => {
      void this.triggerMatch3Talisman();
    });

    // Farm Synergy Dock
    box.querySelector('#btnM3TriggerCompanion')?.addEventListener('click', () => {
      if (!this.engine || this.engine.status === 'won') return;
      const comp = this.sim.getActiveMinigameCompanion();
      if (this.companionCharge < comp.chargeEveryMoves) return;
      this.companionCharge = 0;
      const wasOut = this.engine.status === 'out_of_moves';
      this.engine.triggerFarmCompanion(comp.bondLevel);
      if (!this.sim.state.sandboxMode) {
        this.sim.state.galleons += 15;
      }
      this.sim.audio.playSpell();
      this.sim.saveToStorage();
      this.onParentRefresh();
      this.showToast(
        `${comp.emoji} ${comp.nameVi} trợ chiến: +2 Lượt, Cánh Vàng Snitch & +15G!`,
        comp.emoji
      );
      if (wasOut) {
        this.mountOverlayOnly();
      }
      this.persistMatch3Session(true);
      this.syncHudSnapshot(this.engine.getHudSnapshot());
    });

    box.querySelector('#btnM3SnackApplePie')?.addEventListener('click', () => {
      if (!this.engine || this.engine.status === 'won' || this.snackPieUsedThisAttempt) return;
      const res = this.sim.consumeMollyMinigameSnack('cinnamon_apple_pie');
      if (!res.ok) {
        this.showToast(res.msg, '🥧');
        return;
      }
      this.snackPieUsedThisAttempt = true;
      const wasOut = this.engine.status === 'out_of_moves';
      this.engine.addExtraMoves(3);
      this.persistMatch3Session(true);
      this.onParentRefresh();
      this.showToast('🥧 Bánh Táo Quế Bà Molly tiếp sức: +3 Lượt đi & lùi ngòi Bom!', '🥧');
      if (wasOut) {
        this.mountOverlayOnly();
      }
      this.syncHudSnapshot(this.engine.getHudSnapshot());
      const pieBtn = box.querySelector('#btnM3SnackApplePie') as HTMLButtonElement | null;
      if (pieBtn) {
        pieBtn.disabled = true;
        const qtyEl = pieBtn.querySelector('[data-m3-pie-qty]');
        if (qtyEl) qtyEl.textContent = '✓';
      }
    });

    this.bindOverlayEvents(box);
  }
}
