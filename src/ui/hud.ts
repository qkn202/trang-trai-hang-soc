import { shareFarmPhoto } from '../hpvn/bridge';
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
  STORY_CUTSCENE_CHAPTERS,
} from '../sim/simulation';
import {
  applyA11ySettingsToDocument,
  DEFAULT_PLATFORM_A11Y_SETTINGS,
  PlatformA11ySettings,
  syncA11yVolumesToAudio,
} from './platformAndA11y';
import {
  FRIENDSHIP_CHEST_TOKEN_COST,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  NEIGHBOR_PRESET_NOTES,
} from '../sim/neighborSocial';
import {
  AchievementCategory,
  BuildingCategory,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  FarmCropId,
  FarmItemId,
  FestivalType,
  FlooVisitDirectoryRow,
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
  YuleCollectionId,
  ZoneId,
} from '../types/game';
import type { LeaderboardModalController } from './leaderboardModal';
import {
  lookupRealPlayerByFriendCode,
  registerRealPlayerProfileOnline,
} from './cloudSave';
import type { Match3ModalController } from './match3Modal';
import type { PuzzleArcadeModalController } from './puzzleArcadeModal';
import type { SeedQuizModalController } from './seedQuizModal';

import {
  BUILD_HUD_CATEGORIES,
  HEATMAP_CYCLE,
  InspectSelection,
  clearBuildToolModes,
  escapeHtml,
  loadRecentDecorIds,
  pushRecentDecorId,
} from "./hudShared";
export {
  BUILD_HUD_CATEGORIES,
  HEATMAP_CYCLE,
  clearBuildToolModes,
  escapeHtml,
} from "./hudShared";
export { formatToastMessage };
export type { InspectSelection } from "./hudShared";

import {
  shellMountDOM,
  shellBindEvents,
} from './hudShell';

import {
  formatToastMessage,
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
  headerAnimateSickleTo,
  headerSpawnFlyReward,
  headerSyncToastStackHost,
  headerShowToast,
  headerShowOfflineModal,
  headerRefreshFloatingBanner,
  headerRefreshYuleBanner,
  headerYuleReadyToasts,
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
  questsUiOpenHouseCupIntroDialog,
  questsUiRefreshHarvestFeastBadges,
  questsUiShowRibbonUnveilBanner,
  questsUiRenderHarvestFeastDialog,
  questsUiRenderHouseCupIntroDialog,
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
  socialUiApplyAuthoritativeSnapshotIdentity,
  socialUiOpenNeighborDialog,
  socialUiOpenMinigameRescue,
  socialUiEnterVisitFromHud,
  socialUiEnterHonorTourFromHud,
  socialUiEnterFlooMemberVisitFromHud,
  socialUiExitVisitFromHud,
  socialUiRefreshFlooDirectory,
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
  public christmasTabActive = false;
  public activeChristmasFilter: 'all' | 'recent' | 'stashed' | YuleCollectionId = 'all';
  public selectedCatalogItem: CatalogItem | null = null;
  public rotation: 0 | 1 | 2 | 3 = 0;
  public activeDecorFilter:
    | 'all'
    | 'recent'
    | 'stashed'
    | 'nature'
    | 'fences'
    | 'lights'
    | 'landmarks'
    | 'yule_all'
    | 'classic'
    | YuleCollectionId = 'all';
  public recentDecorIds: string[] = [];
  public bulldozerActive = false;
  public moveModeActive = false;
  public moveKeepActiveAfterDrop = false;
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
  public onTouchStashActiveBuilding: (() => void) | null = null;
  public onSelectCatalogItem: ((item: CatalogItem) => void) | null = null;
  public onAutoPlaceSelected: (() => void) | null = null;
  public onBuildStateReset: (() => void) | null = null;
  public onRotateActivePlacement: (() => void) | null = null;
  public onStartMoveBuilding: ((uid: string) => void) | null = null;
  public onCameraJump: (() => void) | null = null;
  public onFocusGridSmooth: ((gx: number, gy: number, targetZoom?: number) => void) | null = null;
  public activeBuildCycleIdx = -1;
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
  public displayedSickle = -1;
  public galleonRollRaf = 0;
  public activeWorkshopTab: 'barn' | 'stand' | 'market' | 'brew' | 'cargo' | 'synergy' = 'barn';
  public selectedStandItemId: FarmItemId = 'ottery_wheat';
  public selectedStandPriceTier: 'bargain' | 'fair' | 'premium' = 'fair';
  public activeQuestTab: 'orders' | 'quests' = 'orders';
  public activeAlbumTab: 'profile' | 'cup' | 'leaderboard' = 'cup';
  public hasShownHouseCupIntro = false;
  public activeProfileSubTab: 'login7' | 'achievements' | 'friendship' | 'almanac' = 'login7';
  public activeAchievementFilterCat: AchievementCategory | 'all' = 'all';
  public selectedOwlOrderId: string | null = null;
  public lastWsBrewId: string | null = null;
  public activeSuitcaseTab: 'care' | 'morph' | 'expedition' = 'care';
  public selectedSuitcaseHabitatUid: string | null = null;
  public useStarlightForIncubation = true;
  public lastSuitcaseIncReady = false;
  public lastSuitcaseExpReady = false;
  public activeNeighborTab: 'friends' | 'postcard' | 'chest' | 'log' = 'friends';
  public focusedNeighborId: string | null = null;
  public flooDirectoryRows: FlooVisitDirectoryRow[] = [];
  public flooQueueRows: FlooVisitDirectoryRow[] = [];
  public flooHelpsLeft: number | null = null;
  public flooLoading = false;
  public flooLastLoadedAt = 0;
  public flooAutoAdvanceTimer = 0;
  public flooHelpersToday: Array<{
    uid: string;
    name: string;
    avatarEmoji?: string;
    avatarUrl?: string;
    at: number;
  }> = [];
  public lastSocialLiveSig = '';
  public tutorialMinimized = false;
  public lastRenderedTutorialSig = '';
  public lastFocusedTutorialStepKey = '';
  public ribbonBannerTimer = 0;
  public yuleReadySig = '';
  public drawerEdgeObserver: IntersectionObserver | null = null;
  private dialogOpenObserver: MutationObserver | null = null;
  public match3Modal: Match3ModalController | null = null;
  public puzzleArcadeModal: PuzzleArcadeModalController | null = null;
  public leaderboardModal: LeaderboardModalController | null = null;
  private match3ModalPromise: Promise<Match3ModalController> | null = null;
  private puzzleArcadeModalPromise: Promise<PuzzleArcadeModalController> | null = null;
  // HPVN: the quiz and leaderboard modals load on first open, like Match-3 and the puzzle arcade.
  private seedQuizModalPromise: Promise<SeedQuizModalController> | null = null;
  private leaderboardModalPromise: Promise<LeaderboardModalController> | null = null;

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
    this.recentDecorIds = loadRecentDecorIds();
    this.questCollapsed = window.innerHeight <= 520 || window.innerWidth <= 640;
    this.tutorialMinimized = Boolean(this.sim.state.tutorial?.minimized);
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
    this.wireDraggableBanner();
    this.bindEvents();
    this.applyStoredA11ySettings();
    this.refreshAll();

    // Update live 24h clock & active countdown timers cleanly without clobbering DOM or interrupting range sliders
    const match3Dlg = this.root.querySelector('#match3Dialog') as HTMLDialogElement | null;
    const arcadeDlg = this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null;
    const seedQuizDlg = this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null;
    window.setInterval(() => {
      this.match3Modal?.tickLiveHeaderTimer();
      if (match3Dlg?.open || arcadeDlg?.open || seedQuizDlg?.open) {
        return;
      }
      this.refreshHeaderClock();
      this.refreshFloatingBanner();
      headerRefreshYuleBanner(this);
      headerYuleReadyToasts(this);
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

  public clearBuildToolModes(): void {
    clearBuildToolModes(this);
  }

  public recordRecentDecorItem(itemId: string): void {
    const it = getCatalogItem(itemId);
    if (!it || it.category !== 'decor') return;
    this.recentDecorIds = pushRecentDecorId(this.recentDecorIds, itemId);
  }

  public triggerRotateAction(): void {
    if (this.sim.isVisitingNeighbor) {
      this.showToast('Chế độ Khách Tham Quan — không thể xoay công trình vườn bạn!', '🏡');
      return;
    }
    if (
      !this.selectedCatalogItem &&
      !(this.moveModeActive && this.movingBuildingUid) &&
      this.inspectSelection?.kind === 'building'
    ) {
      const targetUid = this.inspectSelection.uid;
      const b = this.sim.state.buildings.find((x) => x.uid === targetUid);
      const item = b ? getCatalogItem(b.itemId) : undefined;
      const res = this.sim.rotatePlacedBuilding(targetUid);
      if (!res.ok) {
        this.showToast(res.reason ?? 'Không thể xoay công trình tại vị trí này!', '⚠️');
        return;
      }
      this.rotation = res.newRotation ?? this.rotation;
      this.refreshAll();
      this.showToast(
        `🔄 Đã xoay "${item?.name ?? 'công trình'}" (${(res.newRotation ?? 0) * 90}°)`,
        '🔄'
      );
      return;
    }

    this.rotation = ((this.rotation + 1) % 4) as 0 | 1 | 2 | 3;
    this.onRotateActivePlacement?.();
    this.refreshDock();
    this.refreshFloatingBanner();
    this.refreshTouchConfirmBar();
    this.showToast(`🔄 Hướng đặt công trình: ${this.rotation * 90}°`, '🔄');
  }

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
    const syncDialogAudioMuffle = () => {
      const anyModalOpen = Boolean(this.root.querySelector('dialog[open]'));
      this.sim.audio?.setModalMuffle?.(anyModalOpen);
    };

    for (const dialog of Array.from(this.root.querySelectorAll<HTMLDialogElement>('dialog'))) {
      dialog.addEventListener('close', () => {
        dialog.returnValue = '';
        syncDialogAudioMuffle();
      });
    }

    if (typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => syncDialogAudioMuffle());
      observer.observe(this.root, {
        subtree: true,
        attributes: true,
        attributeFilter: ['open'],
      });
    }

    // Pause heavy background updates on off-screen .aaa-codex-scroll containers (capturing delegation)
    this.root.addEventListener(
      'contentvisibilityautostatechange',
      (event) => {
        const target = event.target as HTMLElement | null;
        if (target && typeof target.matches === 'function' && target.matches('.aaa-codex-scroll')) {
          const skipped = Boolean((event as Event & { skipped?: boolean }).skipped);
          target.dataset.cvSkipped = skipped ? 'true' : 'false';
        }
      },
      { capture: true }
    );

    if (
      typeof document !== 'undefined' &&
      !('contentVisibility' in document.documentElement.style) &&
      typeof IntersectionObserver !== 'undefined'
    ) {
      const cvFallbackObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            (entry.target as HTMLElement).dataset.cvSkipped = entry.isIntersecting ? 'false' : 'true';
          }
        },
        { rootMargin: '200px' }
      );
      for (const scroller of Array.from(this.root.querySelectorAll<HTMLElement>('.aaa-codex-scroll'))) {
        cvFallbackObserver.observe(scroller);
      }
    }

    if (typeof HTMLDialogElement !== 'undefined' && !('closedBy' in HTMLDialogElement.prototype)) {
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
    tab?: 'friends' | 'postcard' | 'chest' | 'log',
    focusNeighborId?: string
  ): void { return socialUiOpenNeighborDialog(this, tab, focusNeighborId); }

  public openHarvestFeastDialog(): void { return questsUiOpenHarvestFeastDialog(this); }

  public refreshHarvestFeastBadges(): void { return questsUiRefreshHarvestFeastBadges(this); }

  public showRibbonUnveilBanner(info: RibbonUnveilCelebration): void { return questsUiShowRibbonUnveilBanner(this, info); }

  public renderHarvestFeastDialog(): void { return questsUiRenderHarvestFeastDialog(this); }

  public openMinigameRescue(ctx: MinigameRescueContext): void { return socialUiOpenMinigameRescue(this, ctx); }

  public enterVisitFromHud(neighborId: string): void { return socialUiEnterVisitFromHud(this, neighborId); }

  public enterHonorTourFromHud(tourId: string): void { return socialUiEnterHonorTourFromHud(this, tourId); }

  public enterFlooMemberVisitFromHud(hostUid: string, queue?: FlooVisitDirectoryRow[]): void {
    return socialUiEnterFlooMemberVisitFromHud(this, hostUid, queue);
  }

  public refreshFlooDirectoryFromHud(force?: boolean): Promise<void> {
    return socialUiRefreshFlooDirectory(this, force);
  }

  public applyAuthoritativeSnapshot(snap: unknown): void {
    socialUiApplyAuthoritativeSnapshotIdentity(this, snap);
  }

  public exitVisitFromHud(): void { return socialUiExitVisitFromHud(this); }

  public isBuildingFocusMode(): boolean { return headerIsBuildingFocusMode(this); }

  public toggleHudRollup(force?: boolean): void { return headerToggleHudRollup(this, force); }

  public syncHudFocusVisibility(): void { return headerSyncHudFocusVisibility(this); }

  public openWorkshopDialog(tab?: 'barn' | 'stand' | 'market' | 'brew' | 'cargo' | 'synergy'): void { return farmUiOpenWorkshopDialog(this, tab); }

  public jumpToMissingFarmItem(itemId: FarmItemId): void {
    const loc = this.sim.locateItemSource(itemId);
    this.showToast(loc.msg, loc.kind === 'workshop' ? '🔥' : loc.kind === 'pasture' ? '🐾' : '🌱');
    if (typeof loc.gx === 'number' && typeof loc.gy === 'number') {
      if (this.onFocusGridSmooth) {
        this.onFocusGridSmooth(loc.gx, loc.gy, 1.05);
      } else {
        centerCameraOnGrid(this.cam, loc.gx, loc.gy);
      }
    }
    if (loc.kind === 'plot' && loc.cropId) {
      const plotB = loc.uid ? this.sim.state.buildings.find((x) => x.uid === loc.uid) : undefined;
      if (plotB && !plotB.cropId) {
        this.openSeedTray(loc.cropId, plotB.uid);
      } else if (plotB) {
        this.inspectSelection = { kind: 'building', uid: plotB.uid };
        this.refreshAll();
      }
    } else if (loc.kind === 'pasture' && loc.uid) {
      const pasB = this.sim.state.buildings.find((x) => x.uid === loc.uid);
      if (pasB && !pasB.pastureAnimalId && loc.animalId) {
        this.openPastureTray(loc.animalId, pasB.uid);
      } else if (pasB) {
        this.inspectSelection = { kind: 'building', uid: pasB.uid };
        this.refreshAll();
      }
    } else if (loc.kind === 'workshop' && loc.uid) {
      this.inspectSelection = { kind: 'building', uid: loc.uid };
      this.refreshAll();
    }
  }

  public openSuitcaseDialog(
    tab?: 'care' | 'morph' | 'expedition',
    focusHabitatUid?: string
  ): void { return suitcaseUiOpenSuitcaseDialog(this, tab, focusHabitatUid); }

  private getSeedQuizModal(): Promise<SeedQuizModalController> {
    this.seedQuizModalPromise ??= import('./seedQuizModal').then(({ SeedQuizModalController }) => {
      const modal = new SeedQuizModalController(
        this.root,
        this.sim,
        () => this.refreshAll(),
        (msg, icon) => this.showToast(msg, icon),
        (cropId, pendingPlotUid) => {
          const c = FARM_CROPS[cropId];
          if (pendingPlotUid) {
            const selB = this.sim.state.buildings.find((x) => x.uid === pendingPlotUid);
            if (selB && getCatalogItem(selB.itemId)?.isFarmlandPlot && !selB.cropId) {
              const res = this.sim.plantCropOnPlot(selB.uid, cropId);
              const hasMore =
                Boolean(this.sim.state.sandboxMode) || this.sim.getSeedCount(cropId) > 0;
              this.activeSeedCropId = res.ok && hasMore ? cropId : null;
              this.seedTrayOpen = false;
              this.pendingSowPlotUid = null;
              this.inspectSelection = null;
              this.showToast(res.msg, res.ok ? '🌱' : '🪙');
              this.refreshAll();
              return;
            }
          }
          const canSow =
            Boolean(this.sim.state.sandboxMode) || this.sim.getSeedCount(cropId) > 0;
          this.activeSeedCropId = canSow ? cropId : null;
          this.seedTrayOpen = false;
          this.pendingSowPlotUid = null;
          this.inspectSelection = null;
          this.refreshAll();
          if (this.activeSeedCropId) {
            this.showToast(
              `${c.name} · ${this.sim.getSeedCount(cropId)} hạt · chạm hoặc kéo qua ô đất trống để gieo`,
              c.emoji
            );
          }
        }
      );
      modal.onOpenLeaderboard = () => this.openLeaderboardDialog('match3');
      return modal;
    }).catch((err) => {
      this.seedQuizModalPromise = null;
      console.error(err);
      this.showToast('Chưa mở được Học Viện — hãy bấm lại nhé.');
      throw err;
    });
    return this.seedQuizModalPromise;
  }

  public getLeaderboardModal(): Promise<LeaderboardModalController> {
    this.leaderboardModalPromise ??= import('./leaderboardModal').then(({ LeaderboardModalController }) => {
      const modal = new LeaderboardModalController(this.root, this.sim);
      this.leaderboardModal = modal;
      modal.onJumpToGame = (gid) => {
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
      modal.onVisitNeighbor = (nid) => {
        (this.root.querySelector('#match3Dialog') as HTMLDialogElement | null)?.close();
        (this.root.querySelector('#puzzleArcadeDialog') as HTMLDialogElement | null)?.close();
        (this.root.querySelector('#seedQuizDialog') as HTMLDialogElement | null)?.close();
        (this.root.querySelector('#neighborDialog') as HTMLDialogElement | null)?.close();
        this.enterVisitFromHud(nid);
      };
      modal.onOpenNeighborBook = () => {
        this.openNeighborDialog('friends');
      };
      return modal;
    }).catch((err) => {
      this.leaderboardModalPromise = null;
      console.error(err);
      this.showToast('Chưa mở được Bảng Xếp Hạng — hãy bấm lại nhé.');
      throw err;
    });
    return this.leaderboardModalPromise;
  }

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
      }).catch((err) => {
        this.match3ModalPromise = null;
        console.error(err);
        this.showToast('Chưa mở được màn chơi — hãy bấm lại nhé.');
        throw err;
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
      ).catch((err) => {
        this.puzzleArcadeModalPromise = null;
        console.error(err);
        this.showToast('Chưa mở được màn chơi — hãy bấm lại nhé.');
        throw err;
      });
    }
    return this.puzzleArcadeModalPromise;
  }

  public openLeaderboardDialog(gameId?: LeaderboardGameId, scope?: LeaderboardScope): void {
    this.closeHudPopovers();
    (this.root.querySelector('#neighborDialog') as HTMLDialogElement | null)?.close();
    const fallbackGame: LeaderboardGameId = gameId ?? this.sim.getLastPlayedMinigame();
    this.activeAlbumTab = 'leaderboard';
    void this.getLeaderboardModal().then((m) => {
      m.configure(fallbackGame, scope);
      this.renderAlbumDialog();
      const dlg = this.root.querySelector('#albumDialog') as HTMLDialogElement | null;
      if (dlg && !dlg.open) {
        dlg.showModal();
      }
      m.syncCloud();
    }, () => {});
  }

  public openMatch3Dialog(overrideLevel?: number, allowDevJump = false): void {
    this.closeHudPopovers();
    this.hideOpenFloatingTrays();
    this.sim.setLastPlayedMinigame('match3');
    void this.getMatch3Modal().then((m) => {
      m.open(overrideLevel, allowDevJump);
      headerSyncToastStackHost(this);
    }, () => {});
  }

  public openPuzzleArcadeDialog(mode?: PuzzleArcadeMode): void {
    this.closeHudPopovers();
    this.hideOpenFloatingTrays();
    if (mode) {
      this.sim.setLastPlayedMinigame(mode);
    }
    void this.getPuzzleArcadeModal().then((m) => {
      m.open(mode);
      headerSyncToastStackHost(this);
    }, () => {});
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
    this.hideOpenFloatingTrays();
    if (!targetPlotUid) {
      this.sim.setLastPlayedMinigame('seedquiz');
    }
    void this.getSeedQuizModal().then((m) => {
      m.open(cropId, targetPlotUid, lang, tier, format, subView);
      headerSyncToastStackHost(this);
    }, () => {});
  }

  public openLastPlayedMinigame(): void {
    this.closeHudPopovers();
    const lastGame = this.sim.getLastPlayedMinigame();
    if (lastGame === 'match3') {
      this.openMatch3Dialog();
    } else if (lastGame === 'seedquiz') {
      this.openSeedQuizDialog();
    } else {
      this.openPuzzleArcadeDialog(lastGame);
    }
  }

  public openTrialMinigame(kind?: MinigameTrialKind): void {
    this.closeHudPopovers();
    if (!kind) {
      this.openLastPlayedMinigame();
      return;
    }
    if (kind === 'match3') {
      this.openMatch3Dialog();
    } else {
      this.openPuzzleArcadeDialog(kind);
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

  private animateSickleTo(target: number): void { return headerAnimateSickleTo(this, target); }

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

  /** HPVN: small confirm dialog (parchment style); resolves true only on «Vẫn xóa». */
  public askConfirm(text: string): Promise<boolean> {
    const dlg = this.root.querySelector('#confirmDialog') as HTMLDialogElement;
    (dlg.querySelector('#confirmDialogText') as HTMLElement).textContent = text;
    return new Promise((resolve) => {
      let ok = false;
      (dlg.querySelector('#btnConfirmDelete') as HTMLButtonElement).onclick = () => { ok = true; dlg.close(); };
      (dlg.querySelector('#btnConfirmKeep') as HTMLButtonElement).onclick = () => dlg.close();
      dlg.onclose = () => { dlg.onclose = null; resolve(ok); };
      dlg.showModal();
    });
  }

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

  public openHouseCupIntroDialog(): void { return questsUiOpenHouseCupIntroDialog(this); }

  public renderHouseCupIntroDialog(): void { return questsUiRenderHouseCupIntroDialog(this); }

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

  public getEffectiveA11ySettings(): PlatformA11ySettings {
    const saved = this.sim.state.a11ySettings;
    return {
      colorblindMode: saved?.colorblindMode ?? DEFAULT_PLATFORM_A11Y_SETTINGS.colorblindMode,
      fontScale: saved?.fontScale ?? DEFAULT_PLATFORM_A11Y_SETTINGS.fontScale,
      highContrast: saved?.highContrast ?? DEFAULT_PLATFORM_A11Y_SETTINGS.highContrast,
      keyboardFocusVisible: saved?.keyboardFocusVisible ?? true,
      volumes: {
        ...DEFAULT_PLATFORM_A11Y_SETTINGS.volumes,
        ...(saved?.volumes ?? {}),
      },
    };
  }

  public applyStoredA11ySettings(): void {
    const cfg = this.getEffectiveA11ySettings();
    applyA11ySettingsToDocument(cfg);
    if (this.sim.audio?.ceiling) {
      syncA11yVolumesToAudio(cfg, this.sim.audio);
    }
  }

  public playStoryCutscene(chapterId: string): void {
    const chap = STORY_CUTSCENE_CHAPTERS.find((c) => c.id === chapterId);
    if (!chap) return;
    if (this.sim.state.level < chap.unlockLevel && !this.sim.isHeadmasterPreview) {
      this.showToast(`Cần đạt Cấp ${chap.unlockLevel} để mở khoá ${chap.titleVi}!`, '🔒');
      return;
    }
    (this.root.querySelector('#albumDialog') as HTMLDialogElement | null)?.close();
    this.sim.audio.playSpell();
    this.showToast(`🎬 ${chap.titleVi}`, '🎬');

    let delayAcc = 120;
    chap.keyframes.forEach((kf, idx) => {
      window.setTimeout(() => {
        centerCameraOnGrid(this.cam, kf.cameraFocusGx, kf.cameraFocusGy);
        this.onCameraJump?.();
        this.showToast(`🎬 ${kf.captionVi}`, idx === chap.keyframes.length - 1 ? '✨' : '🕯️');
        if (chap.chapterNumber === 3 && idx === chap.keyframes.length - 1) {
          this.sim.launchFireworksShow(10);
        }
      }, delayAcc);
      delayAcc += kf.durationMs;
    });
  }
}
