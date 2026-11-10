import {
  CATALOG,
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCompactVi,
  formatDurationCountdownVi,
  getCatalogItem,
  getFarmItemIconSrc,
  getFarmItemMeta,
  PASTURE_ANIMALS,
} from '../data/catalog';
import {
  getLevelInfo,
  getNextLevelXp,
  getPlayerTitle,
  getWinsRequiredForNextLevel,
  LEVELS,
  MAX_LEVEL,
} from '../data/levels';
import {
  HARVEST_FEAST_TIERS,
  STORY_CHAPTER_TITLES_VI,
  STORY_QUESTS,
  TUTORIAL_STEPS,
} from '../data/quests';
import {
  CRAFT_RECIPES,
  DISTRICT_SYNERGIES,
  RAW_INGREDIENTS_INFO,
} from '../data/synergiesAndSupply';
import {
  CREATURE_SPECIES_PROFILES,
  getBondIncomeMultiplier,
  getBondXpRequiredForNext,
  getCompendiumMasteryBonusPct,
  getSpeciesProfile,
  GROOM_COOLDOWN_MS,
  INCUBATION_DURATION_MS,
  MAX_BOND_LEVEL,
  MORPH_INFO,
  SUITCASE_EXPEDITIONS,
  TRAIN_COOLDOWN_MS,
} from '../data/suitcase';
import {
  getItemPuzzleStarCost,
  getUpgradePuzzleStarCost,
  getZonePuzzleStarCost,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
} from '../data/match3Levels';
import { getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import {
  Camera,
  centerCameraOnGrid,
  COMPASS_LABELS_VI,
  rotateCamera90,
  unrotateGridPoint,
} from '../engine/isometric';
import { SpriteRegistry } from '../engine/spriteLoader';
import {
  FARM_HARVEST_CHEST_XP,
  formatHarvestFeastRewardVi,
  getItemPriceBounds,
  getUpgradeCost,
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
} from '../sim/simulation';
import {
  FRIENDSHIP_CHEST_TOKEN_COST,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  NEIGHBOR_PRESET_NOTES,
} from '../sim/neighborSocial';
import {
  BuildingCategory,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  FarmCropId,
  FarmItemId,
  FestivalType,
  FlyRewardKind,
  HeatmapMode,
  HouseName,
  LeaderboardGameId,
  LeaderboardScope,
  MAX_RIDE_QUEUE,
  MAX_STAFF_PER_ROLE,
  MinigameRescueContext,
  MinigameTrialKind,
  NeighborPresetNoteId,
  OfflineReport,
  PastureAnimalId,
  PuzzleArcadeMode,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
  RawIngredientId,
  RibbonUnveilCelebration,
  SuitcaseExpeditionId,
  TimeOverride,
  WeatherOverride,
  ZoneId,
} from '../types/game';
import { LeaderboardModalController } from './leaderboardModal';
import {
  lookupRealPlayerByFriendCode,
  registerRealPlayerProfileOnline,
} from './cloudSave';
import type { Match3ModalController } from './match3Modal';
import type { PuzzleArcadeModalController } from './puzzleArcadeModal';
import { SeedQuizModalController } from './seedQuizModal';

import {
  BUILD_HUD_CATEGORIES,
  HEATMAP_CYCLE,
  InspectSelection,
  escapeHtml,
} from "./hudShared";
export {
  BUILD_HUD_CATEGORIES,
  HEATMAP_CYCLE,
  escapeHtml,
} from "./hudShared";
export type { InspectSelection } from "./hudShared";

import {
  shellMountDOM,
  shellBindEvents,
} from './hudShell';

import {
  headerTogglePhotoMode,
  headerIsBuildingFocusMode,
  headerToggleHudRollup,
  headerSyncHudFocusVisibility,
  headerCloseHudPopovers,
  headerCollapseBuildDock,
  headerHasOpenFloatingTray,
  headerHideOpenFloatingTrays,
  headerPositionFloatingPopover,
  headerToggleManagePopover,
  headerToggleWeatherPopover,
  headerRenderWeatherPopover,
  headerAnimateGalleonsTo,
  headerSpawnFlyReward,
  headerShowToast,
  headerShowOfflineModal,
  headerRefreshFloatingBanner,
  headerRefreshTouchConfirmBar,
  headerRefreshAll,
  headerRefreshHeaderClock,
  headerRefreshHeader,
  headerSyncProgressiveHudVisibility,
  headerRefreshQuestTracker,
  headerRefreshDock,
  headerRenderStaffDrawer,
  headerSyncContextualMapToolsBar,
} from './hudHeaderAndDock';

import {
  inspectorRenderInspector,
} from './hudInspector';

import {
  farmUiOpenWorkshopDialog,
  farmUiOpenSeedTray,
  farmUiCloseSeedTray,
  farmUiToggleSeedTray,
  farmUiOpenPastureTray,
  farmUiClosePastureTray,
  farmUiTogglePastureTray,
  farmUiRenderSeedTray,
  farmUiRenderPastureTray,
  farmUiUpdateWorkshopLiveTimers,
  farmUiRenderWorkshopDialog,
} from './hudFarmAndWorkshop';

import {
  questsUiOpenHarvestFeastDialog,
  questsUiRefreshHarvestFeastBadges,
  questsUiShowRibbonUnveilBanner,
  questsUiRenderHarvestFeastDialog,
  questsUiRenderFinanceDialog,
  questsUiRenderAlbumDialog,
  questsUiRenderQuestDialog,
  questsUiRenderRoadmapDialog,
  questsUiRenderSettingsDialog,
} from './hudQuestsAndSettings';

import {
  suitcaseUiOpenSuitcaseDialog,
  suitcaseUiRefreshSuitcaseBadge,
  suitcaseUiUpdateSuitcaseLiveTimers,
  suitcaseUiRenderSuitcaseDialog,
} from './hudSuitcase';

import {
  socialUiOpenNeighborDialog,
  socialUiOpenMinigameRescue,
  socialUiEnterVisitFromHud,
  socialUiExitVisitFromHud,
  socialUiSyncLiveNeighborSocialUI,
  socialUiRefreshNeighborBadges,
  socialUiRenderVisitorDockBar,
  socialUiRenderNeighborDialog,
  socialUiPanCameraToTutorialTarget,
  socialUiResolveTutorialHudTarget,
  socialUiUpdateTutorialHudSpotlight,
  socialUiHideTutorialPopover,
  socialUiShowTutorialPopover,
  socialUiRenderTutorialCoach,
  socialUiHandleTutorialPrimaryAction,
} from './hudSocialAndTutorial';

export class GameHUD {
  public sim: ParkSimulation;
  public cam: Camera;
  public gameCanvas: HTMLCanvasElement;
  public activeCategory: BuildingCategory | null = null;
  public selectedCatalogItem: CatalogItem | null = null;
  public rotation: 0 | 1 | 2 | 3 = 0;
  public bulldozerActive = false;
  public moveModeActive = false;
  public movingBuildingUid: string | null = null;
  public pincerActive = false;
  public pincerPicked: { kind: 'staff'; id: string; label: string } | null = null;
  public seedTrayOpen = false;
  public seedFilterMode: 'all' | 'flowers' | 'crops' = 'all';
  public activeSeedCropId: FarmCropId | null = null;
  public pendingSowPlotUid: string | null = null;
  public pastureTrayOpen = false;
  public activePastureAnimalId: PastureAnimalId | null = null;
  public pendingStockPastureUid: string | null = null;
  public rideCamUid: string | null = null;
  public rideCamSpeedText = '';
  public pendingTouchTile: { gx: number; gy: number; label: string } | null = null;
  public onTouchConfirmPlace: (() => void) | null = null;
  public onTouchCancelPlace: (() => void) | null = null;
  public onCameraJump: (() => void) | null = null;
  public photoModeActive = false;
  public inspectSelection: InspectSelection = null;
  public minimapCanvas!: HTMLCanvasElement;
  public questCollapsed = false;
  public minimapCollapsed = false;
  public manageMenuOpen = false;
  public weatherPopoverOpen = false;
  public mapToolsExpanded = false;
  public buildSheetOpen = false;
  public minimapHudVisible = false;
  public hudRolledUp = false;
  public inspectorCollapsed = false;
  public lastInspectedKey = '';
  public displayedGalleons = -1;
  public galleonRollRaf = 0;
  public activeWorkshopTab: 'barn' | 'brew' | 'cargo' | 'synergy' = 'barn';
  public activeQuestTab: 'orders' | 'quests' = 'orders';
  public selectedOwlOrderId: string | null = null;
  public lastWsBrewId: string | null = null;
  public activeSuitcaseTab: 'care' | 'morph' | 'expedition' = 'care';
  public selectedSuitcaseHabitatUid: string | null = null;
  public useStarlightForIncubation = true;
  public lastSuitcaseIncReady = false;
  public lastSuitcaseExpReady = false;
  public activeNeighborTab: 'friends' | 'chest' | 'log' = 'friends';
  public focusedNeighborId: string | null = null;
  public lastSocialLiveSig = '';
  public tutorialMinimized = false;
  public lastRenderedTutorialSig = '';
  public lastFocusedTutorialStepKey = '';
  public ribbonBannerTimer = 0;
  private dialogOpenObserver: MutationObserver | null = null;
  public match3Modal: Match3ModalController | null = null;
  public puzzleArcadeModal: PuzzleArcadeModalController | null = null;
  private match3ModalPromise: Promise<Match3ModalController> | null = null;
  private puzzleArcadeModalPromise: Promise<PuzzleArcadeModalController> | null = null;
  public seedQuizModal!: SeedQuizModalController;
  public leaderboardModal!: LeaderboardModalController;

  public root: HTMLElement;
  public sprites?: SpriteRegistry;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    cam: Camera,
    gameCanvas: HTMLCanvasElement,
    sprites?: SpriteRegistry
  ) {
    this.root = root;
    this.sim = sim;
    this.cam = cam;
    this.gameCanvas = gameCanvas;
    this.sprites = sprites;
    this.questCollapsed = window.innerHeight <= 520 || window.innerWidth <= 640;
    this.minimapCollapsed =
      !this.sim.isHeadmasterPreview && this.sim.state.unlockedZones.length < 3;

    // Load switch polyfill only when native HTML switch attribute is unsupported
    if (!('switch' in HTMLInputElement.prototype)) {
      import('input-switch-polyfill').catch(() => {});
    }

    this.mountDOM();
    this.installDialogLightDismissFallback();
    if (typeof MutationObserver !== 'undefined') {
      this.dialogOpenObserver = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.target instanceof HTMLDialogElement) {
            this.renderTutorialCoach();
            break;
          }
        }
      });
      this.dialogOpenObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['open'],
        subtree: true,
      });
    }
    window.addEventListener('resize', () => this.updateTutorialHudSpotlight());
    this.seedQuizModal = new SeedQuizModalController(
      this.root,
      this.sim,
      () => this.refreshAll(),
      (msg, icon) => this.showToast(msg, icon),
      (cropId, pendingPlotUid) => {
        this.activeSeedCropId = cropId;
        const c = FARM_CROPS[cropId];
        if (pendingPlotUid) {
          const selB = this.sim.state.buildings.find((x) => x.uid === pendingPlotUid);
          if (selB && getCatalogItem(selB.itemId)?.isFarmlandPlot && !selB.cropId) {
            const res = this.sim.plantCropOnPlot(selB.uid, cropId);
            this.seedTrayOpen = false;
            this.pendingSowPlotUid = null;
            this.inspectSelection = null;
            this.showToast(res.msg, res.ok ? '🌱' : '🪙');
            this.refreshAll();
            return;
          }
        }
        this.seedTrayOpen = false;
        this.pendingSowPlotUid = null;
        this.inspectSelection = null;
        this.refreshAll();
        this.showToast(
          `🌱 Đang cầm hạt ${c.emoji} ${c.name} (Túi còn ${this.sim.getSeedCount(cropId)} hạt) — Nhấp hoặc kéo lướt qua Thửa Đất trống để gieo!`,
          c.emoji
        );
      }
    );
    this.seedQuizModal.onOpenLeaderboard = () => this.openLeaderboardDialog('match3');
    this.leaderboardModal = new LeaderboardModalController(this.root, this.sim);
    this.leaderboardModal.onJumpToGame = (gid) => {
      const m3Dlg = this.root.querySelector('#match3Dialog') as HTMLDialogElement | null;
      const paDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
      const sqDlg = this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
      if (gid === 'match3') {
        paDlg?.close();
        sqDlg?.close();
        this.openMatch3Dialog();
      } else if (gid === 'seedquiz') {
        m3Dlg?.close();
        paDlg?.close();
        this.openSeedQuizDialog();
      } else {
        m3Dlg?.close();
        sqDlg?.close();
        this.openPuzzleArcadeDialog(gid);
      }
    };
    this.leaderboardModal.onVisitNeighbor = (nid) => {
      (this.root.querySelector('#match3Dialog') as HTMLDialogElement | null)?.close();
      (this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null)?.close();
      (this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null)?.close();
      (this.root.querySelector('#neighborDialog') as HTMLDialogElement | null)?.close();
      this.enterVisitFromHud(nid);
    };
    this.leaderboardModal.onOpenNeighborBook = () => {
      this.openNeighborDialog('chest');
    };
    this.wireDraggableBanner();
    this.bindEvents();
    this.refreshAll();

    // Update live 24h clock & active countdown timers cleanly without clobbering DOM or interrupting range sliders
    window.setInterval(() => {
      this.refreshHeaderClock();
      this.refreshFloatingBanner();
      this.match3Modal?.tickLiveHeaderTimer();
      const wsDialog = this.root.querySelector('#workshopDialog') as HTMLDialogElement | null;
      if (wsDialog?.open) {
        this.updateWorkshopLiveTimers();
      }
      const scDialog = this.root.querySelector('#suitcaseDialog') as HTMLDialogElement | null;
      if (scDialog?.open) {
        this.updateSuitcaseLiveTimers();
      }
      this.refreshSuitcaseBadge();
      this.syncLiveNeighborSocialUI();
      if (
        this.inspectSelection?.kind === 'building' &&
        document.activeElement?.id !== 'inpBuildingPrice'
      ) {
        const b = this.sim.state.buildings.find(
          (x) => this.inspectSelection?.kind === 'building' && x.uid === this.inspectSelection.uid
        );
        const bItem = b ? getCatalogItem(b.itemId) : undefined;
        const nowMs = Date.now();
        if (
          b &&
          (nowMs < b.constructEndsAt ||
            Boolean(b.workshopQueue && b.workshopQueue.length > 0) ||
            Boolean(b.cropId && b.cropReadyAt && nowMs < b.cropReadyAt + 1200) ||
            Boolean(b.pastureAnimalId && b.pastureReadyAt && nowMs < b.pastureReadyAt + 1200) ||
            Boolean(bItem && bItem.cycleSec > 0 && bItem.baseIncome > 0))
        ) {
          this.renderInspector();
        }
      }
    }, 1000);
  }

  private mountDOM(): void { return shellMountDOM(this); }

  private wireDraggableBanner(): void {
    const draggable = this.root.querySelector('#floatingModeBanner') as HTMLElement | null;
    const handle = this.root.querySelector('#floatingBannerGrip') as HTMLElement | null;
    if (!draggable || !handle) return;

    // Progressive enhancement: reveal standalone grip only after JS initializes
    handle.classList.remove('hidden');

    const moveTo = (left: number, top: number) => {
      draggable.classList.add('is-floating-dragged');
      const maxLeft = Math.max(0, window.innerWidth - draggable.offsetWidth);
      const maxTop = Math.max(0, window.innerHeight - draggable.offsetHeight);
      draggable.style.right = 'auto';
      draggable.style.left = `${Math.max(0, Math.min(left, maxLeft))}px`;
      draggable.style.top = `${Math.max(0, Math.min(top, maxTop))}px`;
    };

    let offsetX = 0;
    let offsetY = 0;
    let startX = 0;
    let startY = 0;

    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      const rect = draggable.getBoundingClientRect();
      offsetX = event.clientX - rect.left;
      offsetY = event.clientY - rect.top;
      startX = event.clientX;
      startY = event.clientY;
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener('pointermove', (event) => {
      if (!handle.hasPointerCapture(event.pointerId)) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) >= 4) {
        handle.classList.add('dragging');
      }
      moveTo(event.clientX - offsetX, event.clientY - offsetY);
    });

    handle.addEventListener('lostpointercapture', () => {
      handle.classList.remove('dragging');
    });

    handle.addEventListener('keydown', (event) => {
      const step = 15;
      let dx = 0;
      let dy = 0;
      if (event.key === 'ArrowLeft') dx = -step;
      else if (event.key === 'ArrowRight') dx = step;
      else if (event.key === 'ArrowUp') dy = -step;
      else if (event.key === 'ArrowDown') dy = step;
      else return;
      event.preventDefault();
      const rect = draggable.getBoundingClientRect();
      moveTo(rect.left + dx, rect.top + dy);
    });

    window.addEventListener('resize', () => {
      if (!draggable.classList.contains('hidden') && draggable.classList.contains('is-floating-dragged')) {
        const rect = draggable.getBoundingClientRect();
        moveTo(rect.left, rect.top);
      }
    });
  }

  private installDialogLightDismissFallback(): void {
    for (const dialog of Array.from(this.root.querySelectorAll<HTMLDialogElement>('dialog'))) {
      dialog.addEventListener('close', () => {
        dialog.returnValue = '';
      });
    }
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const outside = (e: PointerEvent, dialog: HTMLDialogElement) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      for (const dialog of Array.from(this.root.querySelectorAll<HTMLDialogElement>('dialog[closedby="any"]'))) {
        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => {
          pressedOutside = outside(e, dialog);
        });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && outside(e, dialog)) dialog.close();
        });
      }
    }
  }

  public wireRangeProgressFallback(slider: HTMLInputElement): void {
    const sync = () => {
      const min = Number(slider.min || 0);
      const max = Number(slider.max || 100);
      const val = Number(slider.value || 0);
      const pct = Math.round(((val - min) / Math.max(1, max - min)) * 100);
      slider.style.setProperty('--progress', `${pct}%`);
    };
    sync();
    if (!CSS.supports('accent-color: #b45309')) {
      slider.addEventListener('input', sync);
    }
  }

  public togglePhotoMode(force?: boolean): void { return headerTogglePhotoMode(this, force); }

  public openNeighborDialog(
    tab?: 'friends' | 'chest' | 'log',
    focusNeighborId?: string
  ): void { return socialUiOpenNeighborDialog(this, tab, focusNeighborId); }

  public openHarvestFeastDialog(): void { return questsUiOpenHarvestFeastDialog(this); }

  public refreshHarvestFeastBadges(): void { return questsUiRefreshHarvestFeastBadges(this); }

  public showRibbonUnveilBanner(info: RibbonUnveilCelebration): void { return questsUiShowRibbonUnveilBanner(this, info); }

  public renderHarvestFeastDialog(): void { return questsUiRenderHarvestFeastDialog(this); }

  public openMinigameRescue(ctx: MinigameRescueContext): void { return socialUiOpenMinigameRescue(this, ctx); }

  public enterVisitFromHud(neighborId: string): void { return socialUiEnterVisitFromHud(this, neighborId); }

  public exitVisitFromHud(): void { return socialUiExitVisitFromHud(this); }

  public isBuildingFocusMode(): boolean { return headerIsBuildingFocusMode(this); }

  public toggleHudRollup(force?: boolean): void { return headerToggleHudRollup(this, force); }

  public syncHudFocusVisibility(): void { return headerSyncHudFocusVisibility(this); }

  public openWorkshopDialog(tab?: 'barn' | 'brew' | 'cargo' | 'synergy'): void { return farmUiOpenWorkshopDialog(this, tab); }

  public openSuitcaseDialog(
    tab?: 'care' | 'morph' | 'expedition',
    focusHabitatUid?: string
  ): void { return suitcaseUiOpenSuitcaseDialog(this, tab, focusHabitatUid); }

  public async getMatch3Modal(): Promise<Match3ModalController> {
    if (this.match3Modal) return this.match3Modal;
    if (!this.match3ModalPromise) {
      this.match3ModalPromise = import('./match3Modal').then(({ Match3ModalController }) => {
        this.match3Modal = new Match3ModalController(
          this.root,
          this.sim,
          () => this.refreshAll(),
          (msg, icon) => this.showToast(msg, icon),
          this.sprites
        );
        this.match3Modal.onSwitchToPuzzleArcade = (mode) => this.openPuzzleArcadeDialog(mode);
        this.match3Modal.onOpenLeaderboard = () => this.openLeaderboardDialog('match3');
        return this.match3Modal;
      });
    }
    return this.match3ModalPromise;
  }

  public async getPuzzleArcadeModal(): Promise<PuzzleArcadeModalController> {
    if (this.puzzleArcadeModal) return this.puzzleArcadeModal;
    if (!this.puzzleArcadeModalPromise) {
      this.puzzleArcadeModalPromise = import('./puzzleArcadeModal').then(
        ({ PuzzleArcadeModalController }) => {
          this.puzzleArcadeModal = new PuzzleArcadeModalController(
            this.root,
            this.sim,
            () => this.refreshAll(),
            (msg, icon) => this.showToast(msg, icon),
            () => this.openMatch3Dialog(),
            this.sprites
          );
          this.puzzleArcadeModal.onOpenLeaderboard = (mode) => this.openLeaderboardDialog(mode);
          return this.puzzleArcadeModal;
        }
      );
    }
    return this.puzzleArcadeModalPromise;
  }

  public openLeaderboardDialog(gameId?: LeaderboardGameId, scope?: LeaderboardScope): void {
    this.closeHudPopovers();
    const fallbackGame: LeaderboardGameId =
      gameId ?? this.sim.getRequiredLevelTrial()?.kind ?? 'match3';
    this.leaderboardModal.open(fallbackGame, scope);
  }

  public openMatch3Dialog(overrideLevel?: number): void {
    void this.getMatch3Modal().then((m) => m.open(overrideLevel));
  }

  public openPuzzleArcadeDialog(mode?: PuzzleArcadeMode): void {
    void this.getPuzzleArcadeModal().then((m) => m.open(mode));
  }

  public openSeedQuizDialog(
    cropId?: FarmCropId,
    targetPlotUid?: string | null,
    lang?: QuizLanguageId,
    tier?: QuizProficiencyTier,
    format?: 'all' | QuizFormatKind,
    subView?: 'practice' | 'codex'
  ): void {
    this.closeHudPopovers();
    this.seedQuizModal.open(cropId, targetPlotUid, lang, tier, format, subView);
  }

  public openTrialMinigame(kind?: MinigameTrialKind): void {
    this.closeHudPopovers();
    const target = kind ?? this.sim.getRequiredLevelTrial()?.kind ?? 'caro';
    if (target === 'match3') {
      this.openMatch3Dialog();
    } else {
      this.openPuzzleArcadeDialog(target);
    }
  }

  public closeHudPopovers(): void { return headerCloseHudPopovers(this); }

  public collapseBuildDock(): void { return headerCollapseBuildDock(this); }

  public hasOpenFloatingTray(): boolean { return headerHasOpenFloatingTray(this); }

  public hideOpenFloatingTrays(): void { return headerHideOpenFloatingTrays(this); }

  public positionFloatingPopover(triggerEl: HTMLElement | null, popoverEl: HTMLElement | null): void { return headerPositionFloatingPopover(this, triggerEl, popoverEl); }

  public toggleManagePopover(force?: boolean): void { return headerToggleManagePopover(this, force); }

  public toggleWeatherPopover(force?: boolean): void { return headerToggleWeatherPopover(this, force); }

  private renderWeatherPopover(): void { return headerRenderWeatherPopover(this); }

  private animateGalleonsTo(target: number): void { return headerAnimateGalleonsTo(this, target); }

  public spawnFlyReward(
    kind: FlyRewardKind,
    amount: number,
    startSx?: number,
    startSy?: number
  ): void { return headerSpawnFlyReward(this, kind, amount, startSx, startSy); }

  private bindEvents(): void { return shellBindEvents(this); }

  public showToast(msg: string, icon = '🦉'): void { return headerShowToast(this, msg, icon); }

  public showOfflineModal(report: OfflineReport): void { return headerShowOfflineModal(this, report); }

  public refreshFloatingBanner(): void { return headerRefreshFloatingBanner(this); }

  public openSeedTray(preferredCropId?: FarmCropId, targetPlotUid?: string): void { return farmUiOpenSeedTray(this, preferredCropId, targetPlotUid); }

  public closeSeedTray(): void { return farmUiCloseSeedTray(this); }

  public toggleSeedTray(): void { return farmUiToggleSeedTray(this); }

  public openPastureTray(preferredAnimalId?: PastureAnimalId, targetPastureUid?: string): void { return farmUiOpenPastureTray(this, preferredAnimalId, targetPastureUid); }

  public closePastureTray(): void { return farmUiClosePastureTray(this); }

  public togglePastureTray(): void { return farmUiTogglePastureTray(this); }

  public renderSeedTray(): void { return farmUiRenderSeedTray(this); }

  public renderPastureTray(): void { return farmUiRenderPastureTray(this); }

  public refreshTouchConfirmBar(): void { return headerRefreshTouchConfirmBar(this); }

  public refreshAll(): void { return headerRefreshAll(this); }

  private refreshHeaderClock(): void { return headerRefreshHeaderClock(this); }

  public refreshHeader(): void { return headerRefreshHeader(this); }

  private syncProgressiveHudVisibility(): void { return headerSyncProgressiveHudVisibility(this); }

  public refreshQuestTracker(): void { return headerRefreshQuestTracker(this); }

  public refreshDock(): void { return headerRefreshDock(this); }

  private renderStaffDrawer(drawer: HTMLElement): void { return headerRenderStaffDrawer(this, drawer); }

  public syncContextualMapToolsBar(): void { return headerSyncContextualMapToolsBar(this); }

  public renderInspector(): void { return inspectorRenderInspector(this); }

  public renderFinanceDialog(): void { return questsUiRenderFinanceDialog(this); }

  public renderAlbumDialog(): void { return questsUiRenderAlbumDialog(this); }

  public renderQuestDialog(): void { return questsUiRenderQuestDialog(this); }

  public renderRoadmapDialog(): void { return questsUiRenderRoadmapDialog(this); }

  private updateWorkshopLiveTimers(): void { return farmUiUpdateWorkshopLiveTimers(this); }

  private renderWorkshopDialog(): void { return farmUiRenderWorkshopDialog(this); }

  public renderSettingsDialog(): void { return questsUiRenderSettingsDialog(this); }

  public refreshSuitcaseBadge(): void { return suitcaseUiRefreshSuitcaseBadge(this); }

  private updateSuitcaseLiveTimers(): void { return suitcaseUiUpdateSuitcaseLiveTimers(this); }

  private renderSuitcaseDialog(): void { return suitcaseUiRenderSuitcaseDialog(this); }

  private syncLiveNeighborSocialUI(): void { return socialUiSyncLiveNeighborSocialUI(this); }

  public refreshNeighborBadges(): void { return socialUiRefreshNeighborBadges(this); }

  public renderVisitorDockBar(): void { return socialUiRenderVisitorDockBar(this); }

  private renderNeighborDialog(): void { return socialUiRenderNeighborDialog(this); }

  public panCameraToTutorialTarget(): void { return socialUiPanCameraToTutorialTarget(this); }

  private resolveTutorialHudTarget(): { el: HTMLElement | null; label: string } { return socialUiResolveTutorialHudTarget(this); }

  public updateTutorialHudSpotlight(): void { return socialUiUpdateTutorialHudSpotlight(this); }

  private hideTutorialPopover(card: HTMLElement): void { return socialUiHideTutorialPopover(this, card); }

  private showTutorialPopover(card: HTMLElement): void { return socialUiShowTutorialPopover(this, card); }

  public renderTutorialCoach(): void { return socialUiRenderTutorialCoach(this); }

  private handleTutorialPrimaryAction(stepId: string): void { return socialUiHandleTutorialPrimaryAction(this, stepId); }
}
