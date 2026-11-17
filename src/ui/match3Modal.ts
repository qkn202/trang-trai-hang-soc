import { formatDurationCompactVi } from '../data/catalog';
import {
  CANDY_ASSET_REV,
  CANDY_HOGWARTS_TOTAL_CHAPTERS,
  CANDY_OBSTACLE_ICONS,
  CANDY_TILE_TYPES,
  CandyHogwartsLevel,
  getCandyAscensionRank,
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
  MAX_MATCH3_STAGE,
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
import {
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  ParkSimulation,
} from '../sim/simulation';
import {
  ProofOfPlayRecorder,
  verifyProofOfPlayEnvelope,
} from '../sim/proofOfPlay';
import { MinigameGpuFxBatcher } from '../render/fx/minigameGpuFx';
import {
  ActiveMinigameResumeRecord,
  BuildReductionResult,
  LeaderboardRankChange,
  Match3BoosterId,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';
import { MINIGAME_ZOOM_STEP, sharedMinigameViewport } from './minigameViewControls';
import { compactSickle, liftToolIcon, liftToolIcons } from '../hpvn/toolIcons';
import { levelBarHtml, lvStat } from '../hpvn/levelBar';

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
    webp: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-lollipop.webp?v=${CANDY_ASSET_REV}`,
    png: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-lollipop.webp?v=${CANDY_ASSET_REV}`,
  },
  row_col_cannon: {
    engineKind: 'swap',
    webp: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-swap.webp?v=${CANDY_ASSET_REV}`,
    png: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-swap.webp?v=${CANDY_ASSET_REV}`,
  },
  alohomora_shuffle: {
    engineKind: 'shuffle',
    webp: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-shuffle.webp?v=${CANDY_ASSET_REV}`,
    png: `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-shuffle.webp?v=${CANDY_ASSET_REV}`,
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

function formatCandyObjectiveCountText(g: CandyObjectiveProgress): string {
  if (g.completed) return '✓';
  if (g.type === 'special_order') return `${g.current}/${g.target ?? 1}`;
  if (g.type === 'boss') return `${g.remaining.toLocaleString('vi-VN')} HP`;
  if (g.type === 'fiendfyre' || g.type === 'chocolate') return `Còn ${g.remaining}`;
  if (g.type === 'score') {
    return `${formatCompactScore(g.current)}/${formatCompactScore(g.target ?? 0)}`;
  }
  return `${g.current}/${g.target ?? 0}`;
}

function describeCandyObjective(g: CandyObjectiveProgress): {
  visualHtml: string;
  label: string;
  accent: string;
  countText: string;
} {
  const countText = formatCandyObjectiveCountText(g);
  if (g.type === 'collect') {
    const tile = CANDY_TILE_TYPES[g.tileId ?? 0] ?? CANDY_TILE_TYPES[0];
    return {
      visualHtml: pictureSpriteHtml(tile.webp, tile.png, 'm3-goal-sprite'),
      label: tile.shortName,
      accent: tile.color,
      countText,
    };
  }
  if (g.type === 'special_order') {
    if (g.specialKind === 'color_bomb') {
      return {
        visualHtml: pictureSpriteHtml(
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`,
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Quả Cầu Vồng',
        accent: '#b45309',
        countText,
      };
    }
    if (g.specialKind === 'wrapped') {
      return {
        visualHtml: pictureSpriteHtml(
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-bomb.webp?v=${CANDY_ASSET_REV}`,
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-bomb.webp?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Bom & Thuốc Nổ',
        accent: '#f97316',
        countText,
      };
    }
    if (g.specialKind === 'striped') {
      return {
        visualHtml: pictureSpriteHtml(
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-firecracker.webp?v=${CANDY_ASSET_REV}`,
          `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-firecracker.webp?v=${CANDY_ASSET_REV}`,
          'm3-goal-sprite'
        ),
        label: g.label || 'Pháo Hoa Nổ',
        accent: '#ef4444',
        countText,
      };
    }
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.special_seeker,
      label: g.label || 'Chong Chóng Snitch',
      accent: '#eab308',
      countText,
    };
  }
  if (g.type === 'boss') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.boss,
      label: 'Hạ Đại Trùm',
      accent: '#9333ea',
      countText,
    };
  }
  if (g.type === 'horcrux') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.horcrux,
      label: 'Linh Giá',
      accent: '#a855f7',
      countText,
    };
  }
  if (g.type === 'fiendfyre') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.fiendfyre,
      label: 'Lửa Địa Ngục',
      accent: '#ea580c',
      countText,
    };
  }
  if (g.type === 'decree') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.decree,
      label: 'Bia Sắc Lệnh',
      accent: '#ec4899',
      countText,
    };
  }
  if (g.type === 'dementor') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.dementor,
      label: 'Giám Ngục',
      accent: '#38bdf8',
      countText,
    };
  }
  if (g.type === 'petrify') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.petrify,
      label: 'Hoá Đá Tử Xà',
      accent: '#10b981',
      countText,
    };
  }
  if (g.type === 'cauldron') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.cauldron,
      label: 'Vạc Độc Dược',
      accent: '#10b981',
      countText,
    };
  }
  if (g.type === 'key_lock') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.key_lock,
      label: 'Khoá Gringotts',
      accent: '#d97706',
      countText,
    };
  }
  if (g.type === 'ingredient') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.ingredient,
      label: 'Đá Phù Thủy',
      accent: '#dc2626',
      countText,
    };
  }
  if (g.type === 'chocolate') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.chocolate,
      label: 'Sô-cô-la Lan',
      accent: '#92400e',
      countText,
    };
  }
  if (g.type === 'frosting') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.frosting,
      label: 'Bánh Quế Kem',
      accent: '#d97706',
      countText,
    };
  }
  if (g.type === 'ice') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.ice,
      label: 'Băng Đường',
      accent: '#0284c7',
      countText,
    };
  }
  if (g.type === 'jelly') {
    return {
      visualHtml: CANDY_OBSTACLE_ICONS.jelly,
      label: 'Mứt Dâu Phép',
      accent: '#be185d',
      countText,
    };
  }
  return {
    visualHtml: CANDY_OBSTACLE_ICONS.score,
    label: 'Điểm Phép',
    accent: '#f59e0b',
    countText,
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
  private devJumpReturnLevel: number | null = null;
  private popRecorder: ProofOfPlayRecorder | null = null;
  private gpuFx: MinigameGpuFxBatcher | null = null;
  private deferredSaveTimer: ReturnType<typeof setTimeout> | null = null;
  private pulseTimers: Record<number, ReturnType<typeof setTimeout>> = {};
  private lastHudMovesSig = '';
  private lastHudScore = -1;
  private lastHudStarPct = -1;
  private lastHudStarsEarned = -1;
  private lastTalismanSig = '';
  private lastBossSig = '';
  private lastActionHintHtml = '';
  private lastRainbowSig = '';
  private lastGoalCounts: string[] = [];
  private lastGoalDone: boolean[] = [];
  private lastBoosterSig: Record<string, string> = {};

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
        if (dlg.open) return;
        const _returnAction = dlg.returnValue;
        void _returnAction;
        dlg.returnValue = '';
        this.clearLiveAnnouncement();
        this.clearPulseTimers();
        this.gpuFx?.clear();
        this.engine?.cancelBoosterMode();
        const wasBusyOnClose = Boolean(this.engine?.hasAnyAsyncActivity());
        this.engine?.stopLoop();
        if (this.rescueContext) {
          this.cancelDeferredSave();
          this.rescueContext = null;
          this.rescueVictoryOutcome = null;
          this.engine?.destroy();
          this.engine = null;
        } else if (this.devJumpReturnLevel !== null) {
          this.cancelDeferredSave();
          const maxNormal = Math.min(
            MAX_MATCH3_STAGE,
            (this.sim.state.match3.maxClearedLevel ?? 0) + 1
          );
          if (this.sim.state.match3.currentLevel > maxNormal) {
            this.sim.state.match3.currentLevel = Math.min(maxNormal, this.devJumpReturnLevel);
            this.sim.state.match3.activeSession = null;
            this.engine?.destroy();
            this.engine = null;
          }
          this.devJumpReturnLevel = null;
          this.sim.saveToStorage();
        } else if (wasBusyOnClose) {
          this.cancelDeferredSave();
          // Bàn chơi bị ngắt ngang giữa chuỗi rơi/nổ kẹo: huỷ engine dở dang và giữ nguyên activeSession sạch ở cuối nước đi trước.
          this.engine?.destroy();
          this.engine = null;
          this.sim.saveToStorage();
        } else {
          this.persistMatch3Session(true);
          this.flushDeferredSave();
        }
        if (typeof document === 'undefined' || !document.hidden) {
          this.clearActiveModalResumeMarker();
        }
        const modalInner =
          typeof dlg.querySelector === 'function'
            ? (dlg.querySelector('.m3-modal-inner') as HTMLElement | null)
            : null;
        sharedMinigameViewport.unbindStageInteractions('match3');
        sharedMinigameViewport.clearDialogOrientation(dlg, modalInner);
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
      const handleMatch3ViewportResize = () => {
        if (!this.isOpen()) return;
        const openDlg = this.getDialog();
        const modalInner =
          typeof openDlg?.querySelector === 'function'
            ? (openDlg.querySelector('.m3-modal-inner') as HTMLElement | null)
            : null;
        const prevLayout = openDlg?.dataset?.mgLayout;
        const res = sharedMinigameViewport.applyDialogOrientation(openDlg, modalInner, false);
        if (prevLayout && prevLayout !== res.effectiveLayout) {
          this.renderDOM();
          return;
        }
        this.syncMatch3ViewportTransform();
      };
      window.addEventListener('resize', handleMatch3ViewportResize);
      window.visualViewport?.addEventListener('resize', handleMatch3ViewportResize);
      window.addEventListener('keydown', (ev) => {
        if (!this.isOpen()) return;
        const tag = (ev.target as HTMLElement | null)?.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (ev.key === '+' || ev.key === '=') {
          ev.preventDefault();
          sharedMinigameViewport.stepZoom('match3', MINIGAME_ZOOM_STEP);
          this.syncMatch3ViewportTransform();
        } else if (ev.key === '-' || ev.key === '_') {
          ev.preventDefault();
          sharedMinigameViewport.stepZoom('match3', -MINIGAME_ZOOM_STEP);
          this.syncMatch3ViewportTransform();
        } else if (ev.key === '0' && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          sharedMinigameViewport.resetView('match3');
          this.syncMatch3ViewportTransform();
        }
      });
    }
  }

  private syncMatch3ViewportTransform(): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box) return;
    const panArea = box.querySelector('.mg-stage-pan-area') as HTMLElement | null;
    const shell = box.querySelector('.pa-canvas-shell') as HTMLElement | null;
    const { effectiveScale, netQuarterTurns } = sharedMinigameViewport.applyCanvasStageTransform(
      'match3',
      panArea,
      shell
    );
    sharedMinigameViewport.syncToolbarDOM(box, 'match3');
    this.engine?.syncViewTransform(effectiveScale, netQuarterTurns);
  }

  private persistActiveModalResumeMarker(): void {
    if (this.rescueContext || this.victoryClaimed) return;
    // HPVN: the marker rides in the farm save (no browser storage in the frame), so F5 reopens this run
    this.sim.state.activeMinigameResume = {
        dialog: 'match3',
        mode: 'match3',
        stage: this.engine?.level?.id ?? this.sim.state.match3.currentLevel,
      savedAt: Date.now(),
    };
  }


  private clearActiveModalResumeMarker(): void {
    delete this.sim.state.activeMinigameResume;
  }


  private scheduleDeferredSave(delayMs = 1800): void {
    this.cancelDeferredSave();
    this.deferredSaveTimer = setTimeout(() => {
      this.deferredSaveTimer = null;
      this.sim.saveToStorage();
    }, delayMs);
  }

  private cancelDeferredSave(): void {
    if (this.deferredSaveTimer !== null) {
      clearTimeout(this.deferredSaveTimer);
      this.deferredSaveTimer = null;
    }
  }

  private flushDeferredSave(): void {
    if (this.deferredSaveTimer !== null) {
      clearTimeout(this.deferredSaveTimer);
      this.deferredSaveTimer = null;
      this.sim.saveToStorage();
    }
  }

  private clearPulseTimers(): void {
    for (const k of Object.keys(this.pulseTimers)) {
      const idx = Number(k);
      clearTimeout(this.pulseTimers[idx]);
      delete this.pulseTimers[idx];
    }
  }

  private resetHudSyncCache(): void {
    this.clearPulseTimers();
    this.lastHudMovesSig = '';
    this.lastHudScore = -1;
    this.lastHudStarPct = -1;
    this.lastHudStarsEarned = -1;
    this.lastTalismanSig = '';
    this.lastBossSig = '';
    this.lastActionHintHtml = '';
    this.lastRainbowSig = '';
    this.lastGoalCounts = [];
    this.lastGoalDone = [];
    this.lastBoosterSig = {};
  }

  private persistMatch3Session(saveToDisk = true): void {
    if (this.rescueContext) return;
    const m3 = this.sim.state.match3;
    if (!this.engine || !this.engine.level || this.engine.level.id !== m3.currentLevel) return;
    if (this.engine.status === 'won' || this.victoryClaimed) {
      if (m3.activeSession) {
        m3.activeSession = null;
        if (saveToDisk) {
          this.cancelDeferredSave();
          this.sim.saveToStorage();
        }
      }
      return;
    }
    if (this.engine.hasAnyAsyncActivity()) return;
    const snap = this.engine.exportSession({
      movesMadeThisAttempt: this.movesMadeThisAttempt,
      companionCharge: this.companionCharge,
      snackPieUsed: this.snackPieUsedThisAttempt,
    });
    if (!snap) return;
    m3.activeSession = snap;
    if (saveToDisk) {
      this.cancelDeferredSave();
      this.sim.saveToStorage();
    }
  }

  private flushMatch3AndModalBeforeHide(): void {
    if (!this.rescueContext) {
      this.persistMatch3Session(true);
      this.flushDeferredSave();
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
    this.cancelDeferredSave();
    this.clearPulseTimers();
    this.gpuFx?.clear();
    this.engine?.destroy();
    this.engine = null;
    this.movesMadeThisAttempt = 0;
    this.companionCharge = 0;
    this.snackPieUsedThisAttempt = false;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.lastGameEndPayload = null;
    this.prevObjectiveRemaining = [];
    this.popRecorder = null;
    const dlg = this.getDialog();
    if (dlg?.open) dlg.close();
  }

  public open(overrideLevel?: number, allowDevJump = false): void {
    const dlg = this.getDialog();
    if (!dlg) return;

    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    this.devJumpReturnLevel = null;
    this.sim.setLastPlayedMinigame('match3');
    this.sim.tickMatch3Hearts(Date.now());
    const safeDevJump = Boolean(
      allowDevJump && IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
    );
    if (typeof overrideLevel === 'number' && Number.isFinite(overrideLevel) && overrideLevel >= 1) {
      const normalMaxAllowed = Math.min(
        MAX_MATCH3_STAGE,
        (this.sim.state.match3.maxClearedLevel ?? 0) + 1
      );
      const maxAllowed =
        this.sim.state.sandboxMode || this.sim.isHeadmasterPreview || safeDevJump
          ? MAX_MATCH3_STAGE
          : normalMaxAllowed;
      const clampedLv = Math.min(maxAllowed, Math.floor(overrideLevel));
      if (
        safeDevJump &&
        !this.sim.state.sandboxMode &&
        !this.sim.isHeadmasterPreview &&
        clampedLv > normalMaxAllowed
      ) {
        this.devJumpReturnLevel = Math.min(normalMaxAllowed, this.sim.state.match3.currentLevel);
      }
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
      onPlayerMoveCommitted: (movesUsed, maxCascade, specialUsed) => {
        const wasZero = this.movesMadeThisAttempt === 0;
        this.movesMadeThisAttempt = movesUsed;
        this.popRecorder?.recordMove(
          ((movesUsed & 0xff) << 8) ^ ((maxCascade & 0x3f) << 2) ^ (specialUsed ? 3 : 1)
        );
        if (specialUsed || maxCascade >= 2) {
          const dlg = this.getDialog();
          if (dlg) {
            if (!this.gpuFx) {
              this.gpuFx = new MinigameGpuFxBatcher(dlg);
            }
            const stageEl = dlg.querySelector('.m3-stage-board-host') as HTMLElement | null;
            const rect = stageEl?.getBoundingClientRect();
            const cx = rect ? rect.left + rect.width * 0.5 : (window.innerWidth || 800) * 0.5;
            const cy = rect ? rect.top + rect.height * 0.5 : (window.innerHeight || 600) * 0.5;
            this.gpuFx.spawnStarburst(
              cx,
              cy,
              specialUsed ? 38 : Math.min(44, 18 + maxCascade * 6),
              specialUsed ? 2 : 0,
              specialUsed ? 1.25 : 1.0
            );
          }
        }
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
        this.persistMatch3Session(false);
        this.scheduleDeferredSave(1800);
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
    this.popRecorder = new ProofOfPlayRecorder('match3', levelNum);

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
      this.cancelDeferredSave();
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
          const sealedPop =
            this.popRecorder && this.popRecorder.recordedMoves >= 1
              ? this.popRecorder.seal(payload.score)
              : undefined;
          const validPop =
            sealedPop && verifyProofOfPlayEnvelope(sealedPop, { expectedGameId: 'match3' }).ok
              ? sealedPop
              : undefined;
          this.victorySummary = this.sim.completeMatch3LevelVictory(
            payload.bonusCoinsFromLeftoverMoves,
            { sessionScore: payload.score, proofOfPlay: validPop }
          );
        }
        this.onParentRefresh();
      }
      this.announceInDialog(`Chiến thắng màn ${payload.levelId}! Đạt ${payload.stars} sao.`);
      this.mountOverlayOnly();
      this.syncHudSnapshot(this.engine?.getHudSnapshot() ?? null);
      return;
    }

    this.flushDeferredSave();
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
    if (this.pulseTimers[goalIdx] !== undefined) {
      clearTimeout(this.pulseTimers[goalIdx]);
    }
    if (!pill.classList.contains('bump')) {
      pill.classList.add('bump');
    }
    this.pulseTimers[goalIdx] = setTimeout(() => {
      delete this.pulseTimers[goalIdx];
      if (pill.isConnected) {
        pill.classList.remove('bump');
      }
    }, 350);
  }

  private setTextIfChanged(el: HTMLElement | null, text: string): void {
    if (el && el.textContent !== text) {
      el.textContent = text;
    }
  }

  private refreshRestartButtonLabel(): void {
    const btn = this.root.querySelector('#btnM3RestartStage') as HTMLButtonElement | null;
    if (btn) {
      btn.textContent = this.rescueContext
        ? '🔄 Ván Mới'
        : this.movesMadeThisAttempt === 0
          ? '🔄 Ván Mới'
          : '🔄 Lại (-1❤️)';
      liftToolIcon(btn);
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
    const rainbowPct = Math.max(0, Math.min(100, Math.round(snap.rainbowCharge || 0)));
    const rainbowTag = snap.superRainbow
      ? `⚡🌈 <strong>Siêu Cầu Vồng ${rainbowPct}%</strong>`
      : `🌈 Cầu Vồng ${rainbowPct}%`;
    if (snap.level.seasonId === 7) {
      return `<span>💀 Linh Giá Khiên Hồn: Phá khiên bằng Pháo/Bom/TNT hoặc Búa Kẹo • ${rainbowTag}</span>`;
    }
    return `<span>🧨 4=Pháo • 5=Bom • 6=Thuốc Nổ • 7+=TNT (Chạm đúp/Tráo nổ ngay) • ${rainbowTag}</span>`;
  }

  private syncHudSnapshot(snap: CandyHudStateSnapshot | null): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box || !snap) return;

    const st = this.sim.state;
    const isLowMoves = snap.movesLeft <= 5;
    const movesSig = `${snap.movesLeft}|${isLowMoves ? 1 : 0}`;
    if (movesSig !== this.lastHudMovesSig) {
      this.lastHudMovesSig = movesSig;
      const movesEl = box.querySelector('#m3MovesLeftVal') as HTMLElement | null;
      if (movesEl) {
        this.setTextIfChanged(movesEl, String(snap.movesLeft));
        movesEl.classList.toggle('low-moves', isLowMoves);
      }
    }

    if (snap.score !== this.lastHudScore) {
      this.lastHudScore = snap.score;
      this.setTextIfChanged(
        box.querySelector('#m3ScoreVal') as HTMLElement | null,
        snap.score.toLocaleString('vi-VN')
      );
    }

    const s3 = Math.max(1, snap.level.stars[2] || 1);
    const starPct = Math.min(100, Math.round((snap.score / s3) * 100));
    if (starPct !== this.lastHudStarPct) {
      this.lastHudStarPct = starPct;
      const starFill = box.querySelector('#m3StarFillBar') as HTMLElement | null;
      if (starFill) {
        starFill.style.width = `${starPct}%`;
      }
    }
    if (snap.starsEarned !== this.lastHudStarsEarned) {
      this.lastHudStarsEarned = snap.starsEarned;
      for (let idx = 1; idx <= 3; idx++) {
        const starMark = box.querySelector(`#m3StarMark${idx}`) as HTMLElement | null;
        if (starMark) {
          starMark.classList.toggle('earned', snap.starsEarned >= idx);
        }
      }
    }

    this.setTextIfChanged(
      box.querySelector('#m3ModalGoldText') as HTMLElement | null,
      st.sandboxMode ? '∞' : compactSickle(st.galleons)
    );
    this.setTextIfChanged(
      box.querySelector('#m3ModalStarsText') as HTMLElement | null,
      st.sandboxMode ? '∞' : compactSickle(st.match3.stars)
    );
    this.setTextIfChanged(
      box.querySelector('#m3ModalHeartsText') as HTMLElement | null,
      this.formatHeartsLabel()
    );

    const talismanQty = this.sim.getPhoenixTalismanCount();
    this.setTextIfChanged(
      box.querySelector('#m3ModalTalismanText') as HTMLElement | null,
      st.sandboxMode ? '∞' : String(talismanQty)
    );

    const talismanBtn = box.querySelector('#btnM3PhoenixTalisman') as HTMLButtonElement | null;
    if (talismanBtn) {
      const talismanDaily = this.sim.getPhoenixTalismanDailyStatus();
      const talismanLocked = snap.talismanUsed || talismanDaily.usedByGame.match3 === true;
      const talismanDisabled =
        talismanLocked || snap.status === 'won' || (!st.sandboxMode && talismanQty <= 0);
      const talismanSig = `${talismanLocked ? 1 : 0}|${talismanDisabled ? 1 : 0}|${st.sandboxMode ? 1 : 0}|${talismanQty}|${talismanDaily.usedCount}|${talismanDaily.maxDaily}`;
      if (talismanSig !== this.lastTalismanSig) {
        this.lastTalismanSig = talismanSig;
        talismanBtn.disabled = talismanDisabled;
        talismanBtn.title = talismanLocked
          ? `Bùa Phượng Hoàng — Đã dùng 1/1 lượt hôm nay ở môn này (${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay, mở lại sau 00:00)`
          : `Bùa Phượng Hoàng — Tối đa 1 lần/môn/ngày (Đã dùng ${talismanDaily.usedCount}/${talismanDaily.maxDaily} môn hôm nay)`;
        talismanBtn.innerHTML = talismanLocked
          ? '<span>🔥 Bùa</span><span class="pa-cost-pill">✓ 1/1</span>'
          : `<span>🔥 Bùa</span><span class="pa-cost-pill">${st.sandboxMode ? '∞' : `×${talismanQty}`}</span>`;
        liftToolIcon(talismanBtn);
      }
    }

    // Live 2-Phase Boss HP strip
    if (snap.bossState) {
      const bs = snap.bossState;
      const bossHpPct =
        bs.maxHp > 0 ? Math.max(0, Math.min(100, Math.round((bs.hp / bs.maxHp) * 100))) : 0;
      const bossSig = `${bs.hp}|${bs.maxHp}|${bs.enraged ? 1 : 0}|${bs.defeated ? 1 : 0}|${bs.turnsUntilHex}`;
      if (bossSig !== this.lastBossSig) {
        this.lastBossSig = bossSig;
        const bossStrip = box.querySelector('#m3BossLiveStrip') as HTMLElement | null;
        if (bossStrip) {
          bossStrip.dataset.enraged = String(bs.enraged && !bs.defeated);
          bossStrip.dataset.defeated = String(bs.defeated);
        }
        const bossFill = box.querySelector('#m3BossHpFill') as HTMLElement | null;
        if (bossFill) {
          bossFill.style.width = `${bossHpPct}%`;
        }
        this.setTextIfChanged(
          box.querySelector('#m3BossHpText') as HTMLElement | null,
          bs.defeated
            ? '✓ ĐÃ HẠ GỤC'
            : `${bs.hp.toLocaleString('vi-VN')} / ${bs.maxHp.toLocaleString('vi-VN')} HP`
        );
        this.setTextIfChanged(
          box.querySelector('#m3BossPhaseBadge') as HTMLElement | null,
          bs.defeated ? '✓ Toàn Thắng' : bs.enraged ? '🔥 CUỒNG NỘ PHA 2' : 'Pha 1'
        );
        this.setTextIfChanged(
          box.querySelector('#m3BossHexText') as HTMLElement | null,
          bs.defeated ? '✓ Bùa tan biến' : `⚡ ${bs.hexName} (${bs.turnsUntilHex} lượt)`
        );
      }
    }

    // Action Hint Bar (when present)
    const hintBanner = box.querySelector('#m3ActionHintBar') as HTMLElement | null;
    if (hintBanner) {
      const nextHintHtml = this.buildActionHintHtml(snap);
      if (nextHintHtml !== this.lastActionHintHtml) {
        this.lastActionHintHtml = nextHintHtml;
        hintBanner.innerHTML = nextHintHtml;
      }
    }

    // Gardenscapes Rainbow Blast Energy Meter
    const rainbowPct = Math.max(0, Math.min(100, Math.round(snap.rainbowCharge || 0)));
    const isSuperRainbow = Boolean(snap.superRainbow);
    const rainbowSig = `${isSuperRainbow ? 1 : 0}|${rainbowPct}`;
    if (rainbowSig !== this.lastRainbowSig) {
      this.lastRainbowSig = rainbowSig;
      const rainbowBtn = box.querySelector('#btnM3RainbowMeter') as HTMLButtonElement | null;
      if (rainbowBtn) {
        rainbowBtn.dataset.super = String(isSuperRainbow);
        rainbowBtn.dataset.hot = String(rainbowPct >= 75);
        rainbowBtn.title = `${
          isSuperRainbow
            ? 'Siêu Cầu Vồng đang bật (quét sạch 2 màu cùng lúc)!'
            : 'Thanh năng lượng Bom Cầu Vồng'
        } (${rainbowPct}/100%) — Nổ Chong Chóng (+22%), Pháo (+28%), Bom (+45%), Thuốc Nổ (+68%), TNT (+95%). Đủ 100% tự thả 1 Quả Cầu Vồng lên bàn!`;
      }
      const rainbowSuperBadge = box.querySelector('#m3RainbowSuperBadge') as HTMLElement | null;
      if (rainbowSuperBadge) {
        rainbowSuperBadge.hidden = !isSuperRainbow;
      }
      this.setTextIfChanged(
        box.querySelector('#m3RainbowLabelText') as HTMLElement | null,
        isSuperRainbow ? 'Siêu Cầu Vồng' : 'Cầu Vồng'
      );
      const rainbowProgress = box.querySelector('#m3RainbowProgressBar') as HTMLElement | null;
      if (rainbowProgress) {
        rainbowProgress.setAttribute('aria-valuenow', String(rainbowPct));
      }
      const rainbowFill = box.querySelector('#m3RainbowFill') as HTMLElement | null;
      if (rainbowFill) {
        rainbowFill.style.width = `${rainbowPct}%`;
      }
      this.setTextIfChanged(
        box.querySelector('#m3RainbowPctVal') as HTMLElement | null,
        `${rainbowPct}%`
      );
    }

    // Update goal cards & pulse when progress advances
    snap.objectives.forEach((g, idx) => {
      const countText = formatCandyObjectiveCountText(g);
      const doneChanged = this.lastGoalDone[idx] !== g.completed;
      const countChanged = this.lastGoalCounts[idx] !== countText;
      const prevRem = this.prevObjectiveRemaining[idx];
      const advanced = prevRem !== undefined && g.remaining < prevRem;
      if (doneChanged || countChanged || advanced) {
        const pill = box.querySelector(`[data-m3-goal-idx="${idx}"]`) as HTMLElement | null;
        if (pill) {
          if (doneChanged) {
            pill.classList.toggle('done', g.completed);
            this.lastGoalDone[idx] = g.completed;
          }
          if (countChanged) {
            const countSpan = pill.querySelector('.m3-goal-count') as HTMLElement | null;
            this.setTextIfChanged(countSpan, countText);
            this.lastGoalCounts[idx] = countText;
          }
          if (advanced) {
            this.pulseGoalPill(idx);
          }
        }
      }
      this.prevObjectiveRemaining[idx] = g.remaining;
    });

    // Update booster buttons only when qty / sandbox / armed state actually changes
    MATCH3_BOOSTERS.forEach((bDef) => {
      const qty = st.match3.boosters[bDef.id] ?? 0;
      const media = BOOSTER_MEDIA[bDef.id];
      const armed = snap.activeBooster === media.engineKind;
      const sig = `${st.sandboxMode ? 1 : 0}|${qty}|${armed ? 1 : 0}`;
      if (this.lastBoosterSig[bDef.id] === sig) return;
      this.lastBoosterSig[bDef.id] = sig;

      const btn = box.querySelector(`[data-m3-booster="${bDef.id}"]`) as HTMLButtonElement | null;
      if (!btn) return;
      btn.setAttribute('data-active', String(armed));
      btn.setAttribute('aria-pressed', String(armed));
      const badge = btn.querySelector('.m3-booster-qty') as HTMLElement | null;
      if (badge) {
        const label = st.sandboxMode ? '∞' : qty > 0 ? `×${qty}` : `🪙${bDef.goldCost}`;
        if (badge.textContent !== label) {
          badge.textContent = label;
        }
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
            <div class="pa-victory-title">Cứu <span class="hs-raw">${escapeHtml(this.rescueContext.neighborName)}</span> · Xong</div>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} Huy hiệu</span>
              <span class="m3-reward-chip">+${rv.goldEarned} Sickle</span>
              <span class="m3-reward-chip">+${rv.xpEarned} XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">Xây −${formatDurationCompactVi(rv.buildReduction.reducedSec)}</span>`
                  : ''
              }
            </div>
            <div class="pa-victory-actions">
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn gold-cta">Về vườn</button>
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
        return `<img src="/game/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="m3-victory-star-img ${isCenter ? 'center' : ''}" />`;
      }).join('');

      return `
        <div class="m3-board-overlay" role="region" aria-label="Chiến thắng màn giải đố">
          <div class="m3-overlay-card victory">
            <div class="m3-victory-stars-row">${starIconsHtml}</div>
            <div class="pa-victory-title">${
              vs.isMasterReplay
                ? `${MAX_MATCH3_STAGE}/${MAX_MATCH3_STAGE} · ${escapeHtml(lv.title)}`
                : lv.id >= MAX_MATCH3_STAGE
                  ? `${MAX_MATCH3_STAGE}/${MAX_MATCH3_STAGE} · Xong`
                  : `Màn ${lv.id} · Xong`
            }</div>
            <div class="m3-reward-badges">
              ${
                vs.starsEarned > 0
                  ? `<span class="m3-reward-chip star">+${vs.starsEarned} ★</span>`
                  : `<span class="m3-reward-chip star">${MAX_MATCH3_STAGE}/${MAX_MATCH3_STAGE}</span>`
              }
              ${vs.goldEarned > 0 ? `<span class="m3-reward-chip">+${vs.goldEarned} Sickle</span>` : ''} <!-- HPVN: Sickle reward -->
            </div>
            <div class="pa-victory-actions">
              <button id="btnM3NextLevel" type="button" class="brass-btn gold-cta">
                ${vs.isMasterReplay || lv.id >= MAX_MATCH3_STAGE ? `Chơi lại` : `Màn ${vs.nextLevel}`}
              </button>
              <button id="btnM3VictoryLeaderboard" type="button" class="brass-btn">Hạng ${m3Rank}</button>
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn">Về vườn · ${st.sandboxMode ? '∞' : m3.stars} ★</button>
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
              ${pictureSpriteHtml(`/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-extramoves.webp?v=${CANDY_ASSET_REV}`, `/game/trang-trai-hang-soc/paintings/candy-hogwarts/booster-extramoves.webp?v=${CANDY_ASSET_REV}`, 'm3-rescue-booster-img')}
            </div>
            <div class="pa-victory-title">${isBombFail ? 'Bom Hắc Ám nổ' : 'Hết lượt'}</div>
            ${isBombFail ? '<p>Tiếp sức sẽ lùi nhịp đếm Bom</p>' : ''}
            <div class="pa-victory-actions">
              <button id="btnM3BuyExtraMoves" type="button" class="brass-btn${!this.rescueContext && mySosMatch3?.rescuedAt ? '' : ' gold-cta'}">
                +${EXTRA_MOVES_COUNT} lượt · ${st.sandboxMode ? '0' : extraMovesCost} Sickle
              </button>
              ${
                canRescueTalisman
                  ? `<button id="btnM3RescuePhoenixTalisman" type="button" class="brass-btn pa-tool-btn talisman">
                      ${isBombFail ? 'Bùa · gỡ Bom' : 'Bùa +5 lượt'} · ${st.sandboxMode ? '∞' : `×${talismanQty}`}
                    </button>`
                  : ''
              }
              <button id="btnM3GiveUpRetry" type="button" class="brass-btn">
                ${this.rescueContext ? 'Thử lại' : 'Thử lại · −1 ♥\uFE0E'}
              </button>
              ${
                !this.rescueContext
                  ? mySosMatch3?.rescuedAt
                    ? `<button id="btnM3OverlayClaimSos" type="button" class="brass-btn gold-cta">Qua màn</button>`
                    : `<button id="btnM3OverlayAskFriend" type="button" class="brass-btn" ${rescuesReceivedLeft <= 0 && !mySosMatch3 ? 'disabled' : ''}>
                        ${mySosMatch3 ? 'Đang chờ cứu' : `Nhờ cứu · ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}`}
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
    this.resetHudSyncCache();
    const dlg = this.getDialog();
    const modalInner =
      typeof dlg?.querySelector === 'function'
        ? (dlg.querySelector('.m3-modal-inner') as HTMLElement | null)
        : null;
    sharedMinigameViewport.applyDialogOrientation(dlg, modalInner, false);

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
      return `<span class="pa-tab-trial" role="img" aria-label="Môn Đề Cử"></span>`; // HPVN: a red dot; the stage line names it
    };

    const fmtTabLv = (kind: PuzzleArcadeMode | 'match3'): string => {
      const inf = this.sim.getDisciplineStageInfo(kind);
      return inf.isMaxed ? `👑${inf.maxStage}` : `${inf.currentStage}/${inf.maxStage}`;
    };

    // the level bar (hpvn/levelBar.ts): the level's title with its difficulty when not plain (its icon was an emoji the filter
    // dropped), a milestone's guardian instead; school year and chapter as the figures
    const ascRank = getCandyAscensionRank(lv.id);
    const ascRomans = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    const stageSub =
      milestoneMeta && !bossState
        ? `${escapeHtml(milestoneMeta.bossGuardianVi)} · ${escapeHtml(milestoneMeta.mechanicTagVi)}`
        : `${diffMeta.pillClass === 'normal' ? '' : `${escapeHtml(diffMeta.label)} · `}${escapeHtml(lv.title)}`;
    const stageStats =
      lvStat(
        ascRank > 0 ? 'Bậc tinh thông' : 'Năm học',
        `<span class="hs-lv-k">${ascRank > 0 ? 'Bậc' : 'Năm'}</span><strong>${ascRank > 0 ? `${season.id}·${ascRomans[ascRank] || ascRank}` : season.id}</strong>`
      ) +
      lvStat('Chương', `<span class="hs-lv-k">Chương</span><strong>${chapter.globalChapterId}/${CANDY_HOGWARTS_TOTAL_CHAPTERS}</strong>`);

    const topStripHtml = `
      <div class="pa-top-bar">
        <div class="pa-dock-head-row">
          <div class="pa-currencies">
            <span class="m3-res-chip" title="Sao Phép Thuật">
              <img src="/game/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="Sao" class="m3-res-icon" />
              <strong id="m3ModalStarsText">${st.sandboxMode ? '∞' : compactSickle(m3.stars)}</strong>
            </span>
            <span class="m3-res-chip" title="Tim giải đố">
              <img src="/game/trang-trai-hang-soc/sprites/m3_icon_heart.webp" alt="Tim" class="m3-res-icon" />
              <strong id="m3ModalHeartsText">${this.formatHeartsLabel()}</strong>
            </span>
            <span class="m3-res-chip" title="Sickle">
              <span class="g-coin" style="font-size:11px;">S</span>
              <strong id="m3ModalGoldText">${st.sandboxMode ? '∞' : compactSickle(st.galleons)}</strong>
            </span>
            <span class="m3-res-chip" title="Bùa Phượng Hoàng">
              <img src="/game/trang-trai-hang-soc/sprites/beast_phoenix.webp" alt="" class="m3-res-icon" /><!-- HPVN: no emoji -->
              <strong id="m3ModalTalismanText">${st.sandboxMode ? '∞' : this.sim.getPhoenixTalismanCount()}</strong>
            </span>
            <button id="btnM3ToggleYuleSkin" type="button" class="m3-res-chip yule-skin-toggle-pill ${this.sim.isYuleVisualThemeActive() ? 'is-yule-active' : ''}" aria-pressed="${this.sim.isYuleVisualThemeActive()}" title="Bật/Tắt giao diện Giáng Sinh">
              <span>Noel</span>
            </button>
          </div>
          <button id="btnM3OpenLeaderboard" type="button" class="minigame-lb-chip" title="Bảng Xếp Hạng (#${m3Rank})">
            <img src="/game/trang-trai-hang-soc/sprites/ui_trophy_cup.webp" alt="" class="m3-res-icon" />
            <strong id="m3ModalRankText">#${compactSickle(m3Rank)}</strong>
          </button>
          <form method="dialog" class="pa-inline-close-form">
            <button type="submit" value="close" class="brass-btn pa-inline-close-btn" title="Đóng (Esc)" aria-label="Đóng">✕</button>
          </form>
        </div>

        <div class="pa-mode-tabs" role="tablist"${globalThis.matchMedia?.('(min-width: 980px)').matches ? ' aria-orientation="vertical"' : ''} aria-label="Chọn môn khảo thí phép thuật Hogwarts" ${this.rescueContext ? 'style="opacity:0.65;pointer-events:none;"' : ''}>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="caro" class="pa-mode-tab" title="Ngũ Ấn Đạo Tặc">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🗺️ Ngũ Ấn Đạo Tặc</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🗺️</span> Ngũ Ấn</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('caro')}</span>${trialBadgeFor('caro')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="sudoku" class="pa-mode-tab" title="Số Học Huyền Bí">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🔢 Số Học Huyền Bí</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🔢</span> Số Học</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('sudoku')}</span>${trialBadgeFor('sudoku')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="chess" class="pa-mode-tab" title="Cờ Phù Thủy">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🏰 Cờ Phù Thủy</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🏰</span> Cờ</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('chess')}</span>${trialBadgeFor('chess')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="blocks" class="pa-mode-tab" title="Sinh Vật Huyền Bí">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🦄 Sinh Vật Huyền Bí</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🦄</span> Sinh Vật</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('blocks')}</span>${trialBadgeFor('blocks')}</span>
          </button>
          <button type="button" role="tab" aria-selected="false" data-m3-jump-arcade="jigsaw" class="pa-mode-tab" title="Tranh Ghép Phép Thuật">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🧩 Tranh Ghép Phép Thuật</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🧩</span> Tranh Ghép</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('jigsaw')}</span>${trialBadgeFor('jigsaw')}</span>
          </button>
          <button type="button" role="tab" aria-selected="true" class="pa-mode-tab active" title="Bùa Gặt Honeydukes">
            <span class="pa-tab-name"><span class="pa-tab-name-full">🍬 Bùa Gặt Honeydukes</span><span class="pa-tab-name-short"><span class="pa-tab-ico">🍬</span> Bùa Gặt</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv">${fmtTabLv('match3')}</span>${trialBadgeFor('match3')}</span>
          </button>
        </div>
      </div>

      ${levelBarHtml({
        stage: `Màn ${lv.id}/${MAX_MATCH3_STAGE}`,
        sub: `${trialBadgeFor('match3') ? 'Đề cử · ' : ''}${stageSub}`,
        stats: stageStats,
      })}
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
            <span>⚔️ <strong>CỨU MÀN ${this.rescueContext.stage}</strong> (${escapeHtml(this.rescueContext.neighborEmoji)} <strong class="hs-raw">${escapeHtml(this.rescueContext.neighborName)}</strong>) • <strong>+3 🍀 + 95 Sickle</strong></span>
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
            <div class="mg-stage-pan-area">
              <div class="m3-empty-hearts-card m3-overlay-card rescue">
                <img src="/game/trang-trai-hang-soc/sprites/m3_icon_heart.webp" alt="" class="m3-empty-hearts-img" />
                <div class="pa-victory-title">Hết tim</div>
                <p>+1 ♥\uFE0E sau <strong id="m3NoHeartsCountdown">${mm}:${ss}</strong></p>
                <div class="pa-victory-actions">
                  <button id="btnM3RefillHeartsNow" type="button" class="brass-btn gold-cta">
                    ${butterbeerQty > 0 ? `Bia Bơ · 5 ♥\uFE0E · ×${butterbeerQty}` : `5 ♥\uFE0E · ${REFILL_HEARTS_GOLD_COST} Sickle`}
                  </button>
                  <button id="btnM3EmptyGoArcade" type="button" class="brass-btn">4 Môn Khảo Thí</button>
                  <button id="btnM3BackToPark" type="button" class="brass-btn">Về vườn</button>
                </div>
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
      sharedMinigameViewport.bindCanvasStageInteractions({
        gameId: 'match3',
        rootScope: box,
        panAreaEl: box.querySelector('.mg-stage-pan-area') as HTMLElement | null,
        canvasShellEl: box.querySelector('.m3-empty-hearts-card') as HTMLElement | null,
        canvasEl: null,
        onTransformUpdated: () => {},
        onOrientationToggled: () => {
          this.renderDOM();
        },
        onPlayClick: () => this.sim.audio.playClick(),
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

    const pieQty = this.sim.getFarmItemCount('cinnamon_apple_pie');
    const rainbowPct = Math.max(0, Math.min(100, Math.round(snap.rainbowCharge || 0)));
    const isSuperRainbow = Boolean(snap.superRainbow);

    const rainbowMeterHtml = `
      <button
        id="btnM3RainbowMeter"
        type="button"
        class="m3-rainbow-meter"
        data-super="${isSuperRainbow}"
        data-hot="${rainbowPct >= 75}"
        title="${
          isSuperRainbow
            ? 'Siêu Cầu Vồng đang bật (quét sạch 2 màu cùng lúc)!'
            : 'Thanh năng lượng Bom Cầu Vồng'
        } (${rainbowPct}/100%) — Nổ Chong Chóng (+22%), Pháo (+28%), Bom (+45%), Thuốc Nổ (+68%), TNT (+95%). Đủ 100% tự thả 1 Quả Cầu Vồng lên bàn!"
      >
        <span class="m3-rainbow-orb-wrap">
          ${pictureSpriteHtml(
            this.sim.isYuleVisualThemeActive()
              ? `/game/trang-trai-hang-soc/paintings/candy-yule/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`
              : `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`,
            this.sim.isYuleVisualThemeActive()
              ? `/game/trang-trai-hang-soc/paintings/candy-yule/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`
              : `/game/trang-trai-hang-soc/paintings/candy-hogwarts/powerup-rainbow.webp?v=${CANDY_ASSET_REV}`,
            'm3-rainbow-orb-icon'
          )}
          <span id="m3RainbowSuperBadge" class="m3-rainbow-super-badge" ${isSuperRainbow ? '' : 'hidden'}>⚡</span>
        </span>
        <span id="m3RainbowLabelText" class="m3-rainbow-lbl">${isSuperRainbow ? 'Siêu Cầu Vồng' : 'Cầu Vồng'}</span>
        <span
          id="m3RainbowProgressBar"
          class="m3-rainbow-track"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${rainbowPct}"
          aria-label="Thanh năng lượng Bom Cầu Vồng"
        >
          <span id="m3RainbowFill" class="m3-rainbow-fill" style="width:${rainbowPct}%"></span>
        </span>
        <strong id="m3RainbowPctVal" class="m3-rainbow-pct">${rainbowPct}%</strong>
      </button>
    `;

    const synergyDockHtml = `
      <div class="aaa-synergy-dock" role="region" aria-label="Bánh Táo Quế tiếp sức">
        <button
          id="btnM3SnackApplePie"
          type="button"
          class="aaa-snack-btn"
          ${this.snackPieUsedThisAttempt || snap.status === 'won' || (!st.sandboxMode && pieQty <= 0) ? 'disabled' : ''}
          title="Dùng 1 Bánh Táo Quế từ Kho Đỏ (+3 Lượt đi & lùi +3 nhịp Bom)"
        >
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_pie_ready.webp" alt="" width="20" height="20" class="aaa-synergy-sprite" />
          <span><span class="aaa-lbl-full">Bánh Táo </span><strong data-m3-pie-qty="1">${this.snackPieUsedThisAttempt ? '✓' : st.sandboxMode ? '∞' : `×${pieQty}`}</strong></span>
        </button>
      </div>
    `;

    // HPVN: portrait = pie and companion join the tool row under the board, so the board gets their row
    // HPVN: portrait and desktop (≥980px, the dock needs the row for the game list) = pie and companion join the tool row
    const synergyInControls =
      this.getDialog()?.dataset?.mgLayout === 'portrait' ||
      globalThis.matchMedia?.('(min-width: 980px)').matches ||
      globalThis.matchMedia?.('(max-height: 450px) and (orientation: landscape)').matches;

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
            ${rainbowMeterHtml}
          </div>

          ${synergyInControls ? '' : synergyDockHtml}
        </aside>

        <div class="pa-stage-viewport">
          <div class="mg-stage-pan-area">
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
          ${synergyInControls ? synergyDockHtml : ''}
        </div>
      </div>
      <div id="m3OverlayMount">${this.renderOverlayHtml(lv)}</div>
    `;

    liftToolIcons(box);
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
        'Bùa Phượng Hoàng: mỗi môn 1 lần/ngày, hôm nay đã dùng',
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
    const panArea = box.querySelector('.mg-stage-pan-area') as HTMLElement | null;
    const shell = box.querySelector('.pa-canvas-shell') as HTMLElement | null;
    sharedMinigameViewport.bindCanvasStageInteractions({
      gameId: 'match3',
      rootScope: box,
      panAreaEl: panArea,
      canvasShellEl: shell,
      canvasEl: canvas,
      canSingleFingerPanAt: (clientX, clientY) => {
        if (!this.engine) return true;
        return !this.engine.hasPlayableCellAtScreen(clientX, clientY);
      },
      onTransformUpdated: () => {
        if (!this.engine) return;
        const { effectiveScale, netQuarterTurns } =
          sharedMinigameViewport.applyCanvasStageTransform('match3', panArea, shell);
        this.engine.syncViewTransform(effectiveScale, netQuarterTurns);
      },
      onOrientationToggled: () => {
        this.renderDOM();
      },
      onPlayClick: () => this.sim.audio.playClick(),
    });
    this.syncMatch3ViewportTransform();

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
          this.showToast(`Cần ${bDef.goldCost} Sickle để mua ${bDef.name}!`, '🪙');
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
    box.querySelector('#btnM3ToggleYuleSkin')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      const active = this.sim.toggleYuleVisualTheme();
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.yuleTheme = active ? 'true' : 'false';
      }
      this.onParentRefresh();
      this.renderDOM();
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

    // Rainbow Blast Energy Meter
    box.querySelector('#btnM3RainbowMeter')?.addEventListener('click', () => {
      if (!this.engine) return;
      this.sim.audio.playClick();
      const snap = this.engine.getHudSnapshot();
      const pct = Math.max(0, Math.min(100, Math.round(snap?.rainbowCharge || 0)));
      if (snap?.superRainbow) {
        this.showToast(
          `⚡🌈 Siêu Cầu Vồng: ${pct}/100% — Nổ Chong Chóng (+22%), Pháo (+28%), Bom (+45%), Thuốc Nổ (+68%), TNT (+95%) để tự thả Siêu Cầu Vồng quét 2 màu!`,
          '🌈'
        );
      } else {
        this.showToast(
          `🌈 Năng lượng Cầu Vồng: ${pct}/100% — Nổ Chong Chóng (+22%), Pháo (+28%), Bom (+45%), Thuốc Nổ (+68%), TNT (+95%). Đủ 100% tự thả 1 Bom Cầu Vồng!`,
          '🌈'
        );
      }
    });

    // Farm Synergy Dock
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
