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

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export type InspectSelection =
  | { kind: 'building'; uid: string }
  | { kind: 'staff'; id: string }
  | { kind: 'zone'; zoneId: ZoneId }
  | null;

export const BUILD_HUD_CATEGORIES: ReadonlyArray<BuildingCategory> = [
  'path',
  'shop',
  'creature',
  'decor',
  'staff',
];

const HEATMAP_CYCLE: Array<{ mode: HeatmapMode; label: string }> = [
  { mode: 'none', label: '🌡️ Nhiệt' },
  { mode: 'cleanliness', label: '🧹 Vệ Sinh' },
  { mode: 'wonder', label: '✨ Kỳ Diệu' },
  { mode: 'biome', label: '🌿 Sinh Thái' },
];

export class GameHUD {
  private sim: ParkSimulation;
  private cam: Camera;
  private gameCanvas: HTMLCanvasElement;
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
  private questCollapsed = false;
  private minimapCollapsed = false;
  private manageMenuOpen = false;
  private weatherPopoverOpen = false;
  private mapToolsExpanded = false;
  private buildSheetOpen = false;
  private minimapHudVisible = false;
  private hudRolledUp = false;
  private inspectorCollapsed = false;
  private lastInspectedKey = '';
  private displayedGalleons = -1;
  private galleonRollRaf = 0;
  private activeWorkshopTab: 'barn' | 'brew' | 'cargo' | 'synergy' = 'barn';
  private activeQuestTab: 'orders' | 'quests' = 'orders';
  private selectedOwlOrderId: string | null = null;
  private lastWsBrewId: string | null = null;
  private activeSuitcaseTab: 'care' | 'morph' | 'expedition' = 'care';
  private selectedSuitcaseHabitatUid: string | null = null;
  private useStarlightForIncubation = true;
  private lastSuitcaseIncReady = false;
  private lastSuitcaseExpReady = false;
  private activeNeighborTab: 'friends' | 'chest' | 'log' = 'friends';
  private focusedNeighborId: string | null = null;
  private lastSocialLiveSig = '';
  private tutorialMinimized = false;
  private lastRenderedTutorialSig = '';
  private lastFocusedTutorialStepKey = '';
  private ribbonBannerTimer = 0;
  private dialogOpenObserver: MutationObserver | null = null;
  public match3Modal: Match3ModalController | null = null;
  public puzzleArcadeModal: PuzzleArcadeModalController | null = null;
  private match3ModalPromise: Promise<Match3ModalController> | null = null;
  private puzzleArcadeModalPromise: Promise<PuzzleArcadeModalController> | null = null;
  public seedQuizModal!: SeedQuizModalController;
  public leaderboardModal!: LeaderboardModalController;

  private root: HTMLElement;
  private sprites?: SpriteRegistry;

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

  private mountDOM(): void {
    const hudWrap = document.createElement('div');
    hudWrap.className = 'hud-shell-root';
    hudWrap.innerHTML = `
      <div id="hudFrameTop" class="hud-frame-top">
        <!-- STYLE #5 PLAYRIX TOWNSHIP 2026 TOP HUD -->
        <header class="ts-top-hud">
          <!-- 1. TOP-LEFT: Star Level Crest + Progress Bars + 2 Blue Utility Buttons -->
          <div class="ts-hud-topleft">
            <div class="ts-level-cluster">
              <button id="btnOpenRoadmap" type="button" class="ts-star-crest-btn" aria-label="Xem lộ trình 100 cấp và 10 vùng đất" title="Cấp Độ Trang Trại & Đại Bản Đồ">
                <svg class="ts-star-svg" viewBox="0 0 100 100" aria-hidden="true">
                  <defs>
                    <linearGradient id="tsStarRim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#f7da8c"/>
                      <stop offset="55%" stop-color="#cfa044"/>
                      <stop offset="100%" stop-color="#8c5c1d"/>
                    </linearGradient>
                    <linearGradient id="tsStarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#84e6ff"/>
                      <stop offset="52%" stop-color="#3aa2f0"/>
                      <stop offset="100%" stop-color="#1d6dc2"/>
                    </linearGradient>
                  </defs>
                  <path d="M50 5 C54 5 57 12 62 24 C74 25 89 27 91 32 C93 37 83 47 74 56 C77 69 81 84 77 88 C73 91 60 84 50 78 C40 84 27 91 23 88 C19 84 23 69 26 56 C17 47 7 37 9 32 C11 27 26 25 38 24 C43 12 46 5 50 5 Z" fill="url(#tsStarRim)" stroke="#3a2212" stroke-width="4.2" stroke-linejoin="round"/>
                  <path d="M50 12 C53 12 56 18 60 28 C70 29 82 31 84 35 C85 39 77 47 69 55 C72 66 75 78 72 81 C69 84 58 78 50 73 C42 78 31 84 28 81 C25 78 28 66 31 55 C23 47 15 39 16 35 C18 31 30 29 40 28 C44 18 47 12 50 12 Z" fill="url(#tsStarFill)" stroke="#174c87" stroke-width="2" stroke-linejoin="round"/>
                  <ellipse cx="45" cy="31" rx="14" ry="7" transform="rotate(-18 45 31)" fill="rgba(255,255,255,0.42)"/>
                </svg>
                <span id="lblLevelNum" data-fly-target="xp" class="ts-star-num">12</span>
                <span id="lblTitle" class="sr-only-hud">Kiến Trúc Sư Hẻm Xéo</span>
              </button>

              <div class="ts-bars-stack">
                <div class="ts-wood-bar ts-lvl-bar-shell">
                  <div id="barLevelTopFill" class="ts-lvl-bar-fill" style="width:42%"></div>
                </div>
                <div class="ts-xp-row">
                  <div class="ts-xp-shield" aria-hidden="true">
                    <svg viewBox="0 0 44 42">
                      <defs>
                        <linearGradient id="tsXpBadge" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#e88cff"/>
                          <stop offset="55%" stop-color="#b23fe3"/>
                          <stop offset="100%" stop-color="#761da8"/>
                        </linearGradient>
                      </defs>
                      <polygon points="22,3 39,12 39,30 22,39 5,30 5,12" fill="url(#tsXpBadge)" stroke="#3a2212" stroke-width="3.2" stroke-linejoin="round"/>
                      <polygon points="22,7 35,14 35,28 22,35 9,28 9,14" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.6"/>
                    </svg>
                    <span>XP</span>
                  </div>
                  <div id="xpBarShell" class="ts-wood-bar ts-xp-bar-shell" title="Tiến độ Rương Mùa Gặt Điền Trang (mỗi 200 XP tặng +65G +1⏳) — Nhấp xem Lộ trình Bản Vẽ Cấp 1 → 100">
                    <div id="barXpFill" class="ts-xp-fill" style="width:10%"></div>
                    <span id="lblXpFraction" class="ts-xp-fraction">🎁 0/200</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="ts-utility-row">
              <button id="btnOpenSettings" type="button" class="ts-blue-sq-btn" aria-label="Cài đặt, âm nhạc và quản lý file lưu" title="Cài đặt Âm nhạc, Thời tiết & Lưu Game">
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <path d="M15.4 4h5.2l.8 3.3a10.4 10.4 0 0 1 2.7 1.1l3-1.7 3.7 3.7-1.7 3a10.4 10.4 0 0 1 1.1 2.7l3.3.8v5.2l-3.3.8a10.4 10.4 0 0 1-1.1 2.7l1.7 3-3.7 3.7-3-1.7a10.4 10.4 0 0 1-2.7 1.1l-.8 3.3h-5.2l-.8-3.3a10.4 10.4 0 0 1-2.7-1.1l-3 1.7-3.7-3.7 1.7-3a10.4 10.4 0 0 1-1.1-2.7L2.5 20.6v-5.2l3.3-.8a10.4 10.4 0 0 1 1.1-2.7l-1.7-3 3.7-3.7 3 1.7a10.4 10.4 0 0 1 2.7-1.1L15.4 4Z" fill="#eef4fa" stroke="#3a2212" stroke-width="2.4" stroke-linejoin="round"/>
                  <circle cx="18" cy="18" r="5" fill="#428ad4" stroke="#3a2212" stroke-width="2.3"/>
                </svg>
              </button>
              <button id="btnToggleManageMenu" type="button" class="ts-blue-sq-btn" aria-label="Quản lý" aria-expanded="false" aria-controls="managePopoverMenu" title="Mở Hòm Quản Lý: Bùa Gặt Honeydukes, Đại Sảnh Khảo Thí Hogwarts, Vali Thú, Sổ Tài Chính &amp; Công Cụ">
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <path d="M6 14 L18 8 L30 14 L30 26 L18 31 L6 26 Z" fill="#c97b36" stroke="#3a2212" stroke-width="2.4" stroke-linejoin="round"/>
                  <path d="M6 14 L18 19 L30 14 L18 8 Z" fill="#e59c52" stroke="#3a2212" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M18 19 L18 31" stroke="#3a2212" stroke-width="2"/>
                  <rect x="15.5" y="16.5" width="5" height="6" rx="1.2" fill="#ffd966" stroke="#3a2212" stroke-width="1.8"/>
                </svg>
                <span id="badgeManageMenuDot" class="badge-dot hidden">!</span>
              </button>
              <button id="btnToggleHudRollup" type="button" class="ts-blue-sq-btn ts-hud-rollup-btn" aria-pressed="false" aria-label="Cuộn gọn hoặc mở rộng các thanh HUD" title="Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)">
                <svg viewBox="0 0 36 36" aria-hidden="true">
                  <rect x="5.5" y="7" width="25" height="6.5" rx="3.2" fill="#ffd966" stroke="#3a2212" stroke-width="2.2"/>
                  <path d="M8.5 13.5 H27.5 V24.5 C27.5 27.2 25.3 29.2 22.6 29.2 H13.4 C10.7 29.2 8.5 27.2 8.5 24.5 Z" fill="#fdf4dc" stroke="#3a2212" stroke-width="2.2" stroke-linejoin="round"/>
                  <path id="svgHudRollupChevron" d="M13.5 23 L18 18.5 L22.5 23" fill="none" stroke="#92400e" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <button id="btnHudMinigameHub" data-fly-target="stars" type="button" class="ts-minigame-hub-pill" title="Vượt Khảo Thí Pháp Thuật tăng trực tiếp Cấp Độ mở khóa bản vẽ nhà &amp; nhận x2 🌟 Sao ở Môn Đề Cử!">
                <img src="/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" />
                <strong id="lblHudHubStars">3</strong>
                <span class="ts-hub-sep">•</span>
                <span id="lblHudHubTrial">🔥 🍓</span>
              </button>
              <button id="btnHudActiveBuilds" type="button" class="stat-chip stat-chip-btn hidden" title="Các công trình đang xây theo thời gian thực">🔨 <span id="lblActiveBuilds">0</span></button>
            </div>
          </div>

          <!-- 2. TOP-CENTER: Warm Curved Parchment Scroll Ribbon -->
          <div id="tsParchmentBanner" class="ts-parchment-ribbon">
            <div class="ts-ribbon-tail ts-ribbon-tail-left" aria-hidden="true"></div>
            <div class="ts-ribbon-body">
              <div id="lblParkRibbonName" class="ts-ribbon-title">Hang Sóc</div>
            </div>
            <div class="ts-ribbon-tail ts-ribbon-tail-right" aria-hidden="true"></div>
          </div>

          <!-- 3. TOP-RIGHT: Galleon Bar, Emerald Gem Bar, Red Storage Barn & Smiley -->
          <div class="ts-hud-topright">
            <div class="ts-currency-row">
              <div id="chipHudGalleons" data-fly-target="galleons" class="ts-res-pill" title="Vàng Galleon hiện có">
                <span class="ts-res-medal" aria-hidden="true">
                  <svg viewBox="0 0 40 40">
                    <defs>
                      <radialGradient id="tsGoldCoin" cx="35%" cy="30%" r="70%">
                        <stop offset="0%" stop-color="#fff49c"/>
                        <stop offset="55%" stop-color="#f5b316"/>
                        <stop offset="100%" stop-color="#bd6e04"/>
                      </radialGradient>
                    </defs>
                    <circle cx="20" cy="20" r="16.5" fill="url(#tsGoldCoin)" stroke="#3a2212" stroke-width="2.8"/>
                    <circle cx="20" cy="20" r="12.2" fill="none" stroke="#fff3b0" stroke-width="1.6"/>
                    <text x="20" y="25.5" text-anchor="middle" font-size="16" font-weight="900" fill="#7c3f00" stroke="#fff6cc" stroke-width="0.6">G</text>
                  </svg>
                </span>
                <span id="lblGalleons" class="ts-res-val">1.450</span>
                <button id="btnPlusGalleons" type="button" class="ts-plus-btn" aria-label="Kiếm thêm Vàng" title="Chơi Giải Đố kiếm thêm Vàng Galleon">+</button>
              </div>

              <div id="btnHudSandChip" data-fly-target="sand" class="ts-res-pill ts-res-gem" title="Ngọc & Cát Thời Gian — Tăng tốc sản xuất & xây dựng">
                <span class="ts-res-medal" aria-hidden="true">
                  <svg viewBox="0 0 40 40">
                    <defs>
                      <linearGradient id="tsEmerald" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#8aff9e"/>
                        <stop offset="50%" stop-color="#22c55e"/>
                        <stop offset="100%" stop-color="#0d7a31"/>
                      </linearGradient>
                    </defs>
                    <polygon points="13,6 27,6 35,16 28,34 12,34 5,16" fill="url(#tsEmerald)" stroke="#3a2212" stroke-width="2.8" stroke-linejoin="round"/>
                    <polygon points="15,10 25,10 30,17 20,29 10,17" fill="rgba(255,255,255,0.28)"/>
                  </svg>
                </span>
                <span id="lblSand" class="ts-res-val">28</span>
                <button id="btnPlusSand" type="button" class="ts-plus-btn" aria-label="Kiếm thêm Ngọc Thời Gian" title="Mở Sảnh Bàn Cờ &amp; Cổ Ngữ kiếm thêm Ngọc Thời Gian">+</button>
              </div>
            </div>

            <div class="ts-barn-row">
              <div id="chipHudBarn" class="ts-res-pill ts-res-barn" title="Kho Nông Sản & Xưởng Chế Biến Hang Sóc">
                <span class="ts-res-medal" aria-hidden="true">
                  <svg viewBox="0 0 42 42">
                    <path d="M5 18 L21 6 L37 18 L34 18 L34 36 L8 36 L8 18 Z" fill="#d94632" stroke="#3a2212" stroke-width="2.6" stroke-linejoin="round"/>
                    <path d="M4 19 L21 6 L38 19" fill="none" stroke="#f7e6c4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <rect x="14" y="21" width="14" height="15" fill="#992315" stroke="#f7e6c4" stroke-width="1.8"/>
                    <path d="M14 21 L28 36 M28 21 L14 36" stroke="#f7e6c4" stroke-width="1.8"/>
                  </svg>
                </span>
                <span id="lblStorageBarn" class="ts-res-val">42/60</span>
                <button id="btnOpenStorageBarn" type="button" class="ts-plus-btn" aria-label="Mở Kho Nông Sản" title="Mở Kho Nông Sản & Tàu Hàng Tốc Hành">+</button>
              </div>
            </div>

            <button id="btnHappySmiley" type="button" class="ts-smiley-btn" aria-label="Sổ Cái Tài Chính" title="Chỉ Số Hạnh Phúc & Sổ Cái Trang Trại">
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <path d="M10.5 14.5 Q12.5 11.5 14.5 14.5" fill="none" stroke="#4a2810" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M21.5 14.5 Q23.5 11.5 25.5 14.5" fill="none" stroke="#4a2810" stroke-width="2.6" stroke-linecap="round"/>
                <path d="M10.5 21 Q18 28.5 25.5 21" fill="#7c2d12" stroke="#4a2810" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </header>

        <!-- COZY PROGRESSIVE-DISCLOSURE POPOVER 1: PARK MANAGEMENT & MINIGAMES DRAWER -->
        <div id="managePopoverMenu" class="hud-floating-popover hidden" role="region" aria-label="Hòm quản lý trang trại">
          <div class="hud-popover-title">
            <span>🧰 Quản Lý</span>
          </div>
          <div class="manage-status-strip">
            <button id="btnHudStarChip" type="button" class="stat-chip stat-chip-btn" title="Sao Phép Thuật"><img src="/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></button>
            <button id="btnHudHeartChip" type="button" class="stat-chip stat-chip-btn" title="Tim Giải Đố"><img src="/sprites/m3_icon_heart.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></button>
            <span class="stat-chip">★ <span id="lblWonder">4.5</span></span>
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">🕒 --:--</button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
          </div>
          <div class="manage-menu-grid">
            <button id="btnOpenMatch3" type="button" class="brass-btn m3-play-cta" title="Gác Xép Bùa Gặt Honeydukes — 777 Màn (Phím J)">
              <img src="/sprites/m3_farm_pinwheel.png" alt="" class="m3-inline-icon" /> Match-3 <span id="lblMatch3Lv">1/777</span>
            </button>
            <button id="btnOpenPuzzleArcade" type="button" class="brass-btn pa-hud-cta" title="Đại Sảnh Khảo Thí Hogwarts (Phím K)">
              <img src="/sprites/ui_icon_jigsaw.png" alt="" class="hud-3d-icon" /> Khảo Thí <span id="lblArcadeTowerLv">0/3108</span>
            </button>
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh & vàng">
              <img src="/sprites/ui_icon_accio.png" alt="" class="hud-3d-icon" /> Accio
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="brass-btn gold-cta" title="Sổ Hàng Xóm (Phím N)">
              🤝 Bạn Bè <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnManageOpenFeast" type="button" class="brass-btn gold-cta" title="Đại Tiệc Mùa Gặt Hang Sóc">
              🍁 Lễ Hội <span id="badgeManageFeastCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenLeaderboard" type="button" class="brass-btn gold-cta" title="Bảng Xếp Hạng &amp; Cúp 4 Nhà">
              🏆 BXH
            </button>
            <button id="btnOpenSuitcase" type="button" class="brass-btn" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <img src="/sprites/ui_icon_suitcase.png" alt="" class="hud-3d-icon" /> Vali <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="brass-btn" title="Kho Nông Sản Hang Sóc, Xưởng Chế Biến & Tàu Hàng">
              🏡 Kho <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenZones" type="button" class="brass-btn" title="Đại Bản Đồ 10 Phân Khu &amp; Lộ Trình 100 Cấp">
              🗺️ Bản Đồ
            </button>
            <button id="btnOpenFinance" type="button" class="brass-btn" title="Sổ Cái Tài Chính &amp; Giá Vé">
              📊 Sổ Cái
            </button>
            <button id="btnOpenAlbum" type="button" class="brass-btn" title="Cúp 4 Nhà Hogwarts &amp; Bảng Điểm Các Nhà">
              🏆 Cúp Nhà <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" title="Hiện hoặc ẩn Radar thu nhỏ">
              🧭 Radar
            </button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" title="Ghim bảng nhiệm vụ lên màn hình">
              📌 Nhiệm Vụ
            </button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn span-2" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">
              🌡️ Nhiệt
            </button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn span-2" title="Cuộn gọn các thanh HUD quanh màn hình (Phím H)">
              📜 Ẩn/Hiện HUD
            </button>
            <button id="btnPhotoMode" type="button" class="brass-btn span-2" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để ngắm cảnh &amp; chụp ảnh (Phím P)">
              📷 Chụp Ảnh
            </button>
          </div>
        </div>

        <!-- COZY PROGRESSIVE-DISCLOSURE POPOVER 2: LIVE WEATHER FORECAST & PARK SPEED -->
        <div id="weatherPopoverMenu" class="hud-floating-popover hidden" role="region" aria-label="Dự báo thời tiết và tốc độ công viên"></div>

        <!-- DRAGGABLE FLOATING BANNER -->
        <div id="floatingModeBanner" class="parchment-dark floating-action-banner hidden">
          <span
            id="floatingBannerGrip"
            class="drag-handle drag-grip hidden"
            tabindex="0"
            role="button"
            aria-label="Kéo hoặc nhấn phím mũi tên để di chuyển thanh điều khiển nổi"
            title="Kéo hoặc dùng phím mũi tên để di chuyển"
          >⠿</span>
          <span id="floatingBannerText" class="floating-banner-text"></span>
          <div class="floating-banner-btns">
            <button id="btnFloatingSecondary" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingSwap" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingExit" type="button" class="brass-btn gold-cta" aria-label="Thoát" style="padding:4px 8px;font-size:12px;">✕</button>
          </div>
        </div>

        <div class="hud-side-row">
          <!-- LEFT QUEST TRACKER (Hidden by default in clean Township view; toggleable) -->
          <aside id="questTrackerPanel" class="parchment-panel quest-tracker hidden" aria-label="Nhiệm vụ đang làm">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div style="font-weight:800;font-size:13.5px;color:#5c2d0c;">🦉 Nhiệm Vụ</div>
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!this.questCollapsed}" style="padding:3px 9px;font-size:12px;">${this.questCollapsed ? '+' : '–'}</button>
            </div>
            <div id="questTrackerBody" class="${this.questCollapsed ? 'hidden' : ''}"></div>
          </aside>

          <!-- RIGHT INSPECTOR -->
          <aside id="inspectorPanel" class="parchment-panel inspector-panel hidden" aria-label="Chi tiết đối tượng"></aside>
        </div>
      </div>

      <!-- TOUCH PLACEMENT CONFIRM BAR (App Store Mobile/Tablet UX) -->
      <div id="touchConfirmBar" class="parchment-dark touch-confirm-bar hidden">
        <span id="lblTouchConfirm" style="font-size:12.5px;font-weight:800;color:#fde68a;"></span>
        <button id="btnTouchConfirmOk" type="button" class="brass-btn gold-cta" aria-label="Đặt">✓</button>
        <button id="btnTouchRotate" type="button" class="brass-btn" aria-label="Xoay">↻</button>
        <button id="btnTouchCancel" type="button" class="brass-btn" aria-label="Hủy">✕</button>
      </div>

      <!-- INTERACTIVE ISOMETRIC MINIMAP (Tucked cleanly until requested) -->
      <div id="minimapWrap" class="parchment-dark minimap-wrap ts-minimap-docked hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="minimap-title">🧭 Radar</span>
          <button id="btnToggleMinimap" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng bản đồ thu nhỏ" aria-expanded="${!this.minimapCollapsed}" style="padding:2px 7px;font-size:12px;">${this.minimapCollapsed ? '+' : '–'}</button>
        </div>
        <canvas id="minimapCanvas" class="${this.minimapCollapsed ? 'hidden' : ''}" width="168" height="102" aria-label="Bản đồ thu nhỏ công viên"></canvas>
      </div>

      <!-- PHOTO MODE FLOATING BAR -->
      <div id="photoModeBar" class="parchment-dark photo-mode-bar hidden">
        <span style="font-size:12.5px;font-weight:800;color:#fde68a;">📷</span>
        <button id="btnSavePhotoPng" type="button" class="brass-btn gold-cta">💾 PNG</button>
        <button id="btnExitPhoto" type="button" class="brass-btn" aria-label="Thoát chế độ chụp ảnh">✕</button>
      </div>

      <!-- ROUND IN-GAME HUD ROLL-UP ORB ("NÚT CUỘN TRÒN INGAME" — TAP TO ROLL/UNROLL ALL HUDS, DRAG TO REPOSITION) -->
      <button
        id="btnHudRoundOrb"
        type="button"
        class="hud-round-orb-btn"
        aria-pressed="false"
        aria-label="Nút cuộn tròn thu gọn hoặc mở rộng toàn bộ HUD"
        title="Chạm để cuộn gọn / mở rộng toàn bộ HUD (Phím H) • Giữ kéo để dời vị trí nút"
      >
        <span class="hud-round-orb-disc" aria-hidden="true">
          <svg viewBox="0 0 40 40" class="hud-round-orb-svg" aria-hidden="true">
            <defs>
              <radialGradient id="hudOrbGold" cx="35%" cy="28%" r="72%">
                <stop offset="0%" stop-color="#fff7c2"/>
                <stop offset="52%" stop-color="#f6b922"/>
                <stop offset="100%" stop-color="#b86508"/>
              </radialGradient>
            </defs>
            <circle cx="20" cy="20" r="18" fill="url(#hudOrbGold)" stroke="#3a2212" stroke-width="2.6"/>
            <circle cx="20" cy="20" r="13.8" fill="#fdf4dc" stroke="#92400e" stroke-width="1.6"/>
            <rect x="11" y="10.5" width="18" height="4.6" rx="2.3" fill="#f59e0b" stroke="#3a2212" stroke-width="1.6"/>
            <path d="M13 15.1 H27 V24.5 C27 26.7 25.2 28.5 23 28.5 H17 C14.8 28.5 13 26.7 13 24.5 Z" fill="#fffdf6" stroke="#3a2212" stroke-width="1.6" stroke-linejoin="round"/>
            <path id="svgRoundOrbChevron" d="M16 23.2 L20 19.2 L24 23.2" fill="none" stroke="#92400e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span id="lblHudRoundOrbTag" class="hud-round-orb-tag visually-hidden">HUD</span>
      </button>

      <!-- TOAST STACK -->
      <div id="toastStack" class="owl-toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>

      <!-- RIBBON UNVEIL WEASLEY CELEBRATION BANNER -->
      <div id="ribbonUnveilToastCard" class="ribbon-unveil-banner hidden" role="status" aria-live="polite"></div>

      <!-- FLY-TO-HUD WEB ANIMATIONS LAYER -->
      <div id="flyRewardLayer" class="fly-reward-layer" aria-hidden="true"></div>

      <!-- 4. BOTTOM-LEFT TOWNSHIP CARDS: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Hàng Xóm & Tiệc Mùa Gặt -->
      <div id="tsCornerLeft" class="ts-corner-left">
        <button id="btnOpenQuests" type="button" class="ts-card-btn ts-card-lg" title="Sổ Đơn Hàng Cú Đưa Thư & Cốt Truyện Hang Sóc">
          <img src="/sprites/ui_icon_owl_orders.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Đơn Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn ts-card-md" title="Túi Hạt Giống &amp; Hoa Hang Sóc">
          <img src="/sprites/ui_icon_seed_sack.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn ts-card-md" title="Đồng Cỏ Chăn Thả">
          <img src="/sprites/ui_icon_pasture_bell.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Thú</span>
        </button>
        <button id="btnOpenNeighbors" data-fly-target="friendship" type="button" class="ts-card-btn ts-card-md" title="Sổ Hàng Xóm (Phím N)">
          <img src="/sprites/ui_icon_staff.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Bạn Bè</span>
          <span id="badgeNeighborCount" class="ts-red-badge hidden">1</span>
        </button>
        <button id="btnOpenHarvestFeast" type="button" class="ts-card-btn ts-card-md" title="Đại Tiệc Mùa Gặt Hang Sóc">
          <img src="/sprites/prop_ribbon_unveil.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Lễ Hội</span>
          <span id="badgeFeastCount" class="ts-red-badge hidden">1</span>
        </button>
      </div>

      <!-- 5. BOTTOM-RIGHT TOWNSHIP × GARDENSCAPES CARDS: Chơi Lên Cấp (Tháp 5×777), Xây Dựng & Bản Đồ -->
      <div id="tsCornerRight" class="ts-corner-right">
        <button id="btnCornerPlayPuzzle" type="button" class="ts-card-btn ts-card-lg ts-card-play-stage" title="Chinh phục Tháp 5 Môn × 777 Màn">
          <img src="/sprites/m3_farm_pinwheel.png" alt="" class="ts-card-art" />
          <span id="lblCornerPlayStage" class="ts-card-label">▶️ Cấp 2</span>
          <span id="badgeCornerPlayBonus" class="ts-red-badge ts-bonus-x2-badge">🔥 +🌟</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn ts-card-md-plus" title="Mở Kho Xây Dựng Bản Vẽ Công Trình">
          <img src="/sprites/ui_icon_hammer_wand.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Xây</span>
          <span id="badgeBuildReadyCount" class="ts-red-badge is-ready-green hidden">1</span>
        </button>
        <button id="btnOpenWorldMap" type="button" class="ts-card-btn ts-card-md" title="Mở Đại Bản Đồ 10 Vùng Đất">
          <img src="/sprites/ui_icon_world_map.png" alt="" class="ts-card-art" />
          <span class="ts-card-label">Bản Đồ</span>
        </button>
      </div>

      <!-- FLOATING SEED BRUSH TRAY (Swipe-to-Plant across unified Thửa Đất Canh Tác) -->
      <section id="seedBrushTray" class="parchment-panel seed-brush-tray hidden" aria-label="Túi hạt giống gieo nhanh"></section>

      <!-- FLOATING PASTURE ANIMAL BRUSH TRAY (Swipe-to-Stock across unified Đồng Cỏ Chăn Thả) -->
      <section id="pastureBrushTray" class="parchment-panel seed-brush-tray pasture-brush-tray hidden" aria-label="Khay chọn thú chăn thả"></section>

      <!-- VISITOR READ-ONLY & CO-OP DOCK BAR -->
      <section id="visitorDockBar" class="parchment-panel visitor-dock-bar hidden" aria-label="Thanh tham quan và trợ giúp vườn bạn bè"></section>

      <!-- BOTTOM BUILD DOCK SHEET (Pops open cleanly above corner cards when "Xây Dựng" is active) -->
      <section id="bottomDockWrap" class="bottom-dock-wrap ts-build-sheet" aria-label="Thanh công cụ xây dựng">
        <div id="buildDrawer" class="parchment-panel build-drawer hidden"></div>

        <div id="secondaryMapToolsBar" class="parchment-dark secondary-map-tools-bar hidden" role="region" aria-label="Công cụ chỉnh sửa và bản đồ">
          <button id="btnMoveTool" type="button" aria-pressed="false" class="brass-btn" title="Di dời công trình (Phím M)">✋ Dời</button>
          <button id="btnBulldoze" type="button" aria-pressed="false" class="brass-btn" title="Phá dỡ (Phím X)">🧹 Xóa</button>
          <button id="btnRotate" type="button" class="brass-btn" title="Xoay hướng công trình (Phím R)">🔄 90°</button>
          <button id="btnRotateCam" type="button" aria-pressed="false" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">🧭 Bắc</button>
          <button id="btnPincerTool" type="button" aria-pressed="false" class="brass-btn" title="Kẹp Gắp Nhân Sự (Phím G)">🤏 Gắp</button>
          <button id="btnCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">👁️ Xuyên</button>
          <button id="btnGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">✨ Lưới</button>
          <button id="btnHomeCam" type="button" class="brass-btn" title="Về Hang Sóc">🏡 Nhà</button>
        </div>

        <div class="parchment-dark bottom-bar">
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/sprites/ui_icon_path.png" alt="" class="hud-3d-icon" /> Đường</button>
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/sprites/ui_icon_shop.png" alt="" class="hud-3d-icon" /> Xưởng</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/sprites/ui_icon_creature.png" alt="" class="hud-3d-icon" /> Thú</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/sprites/ui_icon_decor.png" alt="" class="hud-3d-icon" /> Cảnh</button>
          <button type="button" data-cat="staff" aria-pressed="false" class="brass-btn"><img src="/sprites/ui_icon_staff.png" alt="" class="hud-3d-icon" /> Phụ Tá</button>

          <span class="dock-divider" aria-hidden="true">|</span>

          <button id="btnToggleMapTools" type="button" aria-pressed="false" aria-expanded="false" aria-controls="secondaryMapToolsBar" class="brass-btn" title="Công cụ Sửa &amp; Góc Nhìn">🛠️ Công Cụ</button>
        </div>
      </section>

      <!-- TOWNSHIP SOFT SPOTLIGHT RING FOR ACTIVE TUTORIAL HUD TARGET (Must follow HUD targets in tree order for CSS Anchor Positioning) -->
      <div id="tutorialHudSpotlight" class="tutorial-hud-spotlight hidden" aria-hidden="true">
        <span id="tutorialHudSpotlightLabel" class="tutorial-hud-spotlight-pill">👇</span>
      </div>

      <!-- BÀ MOLLY WEASLEY 2.5D PERSISTENT TUTORIAL COACH POPOVER -->
      <div
        id="tutorialCoachCard"
        class="tutorial-coach-card"
        popover="manual"
        role="dialog"
        aria-labelledby="tutorialCoachTitle"
      ></div>

      <!-- DIALOG 1: OWL ORDER BOARD & STORY JOURNAL -->
      <dialog id="questDialog" closedby="any" aria-labelledby="questDialogTitle">
        <div class="parchment-panel modal-inner owl-orders-modal-inner">
          <div class="modal-header">
            <h2 id="questDialogTitle" class="modal-title"><img src="/sprites/ui_icon_owl_orders.png" alt="" style="width:28px;height:28px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Đơn Cú &amp; Nhiệm Vụ</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="questDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 2: 100 LEVELS & 10 ZONES ROADMAP -->
      <dialog id="roadmapDialog" closedby="any" aria-labelledby="roadmapDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="roadmapDialogTitle" class="modal-title">🗺️ Bản Đồ &amp; Lộ Trình</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="roadmapDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 3: FINANCE & MICRO-PRICING -->
      <dialog id="financeDialog" closedby="any" aria-labelledby="financeDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="financeDialogTitle" class="modal-title">📊 Sổ Cái</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="financeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 4: HOUSE CUP -->
      <dialog id="albumDialog" closedby="any" aria-labelledby="albumDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="albumDialogTitle" class="modal-title">🏆 Cúp 4 Nhà</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="albumDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 5: SETTINGS, BGM, SAVE & HEADMASTER PREVIEW -->
      <dialog id="settingsDialog" closedby="any" aria-labelledby="settingsDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="settingsDialogTitle" class="modal-title">⚙️ Cài Đặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="settingsDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 6: OFFLINE WELCOME BACK -->
      <dialog id="offlineDialog" closedby="any" aria-labelledby="offlineDialogTitle">
        <div class="parchment-panel modal-inner" style="max-width:480px;">
          <div class="modal-header">
            <h2 id="offlineDialogTitle" class="modal-title">🧦 Thu Hoạch Offline</h2>
            <form method="dialog"><button type="submit" class="brass-btn gold-cta" aria-label="Nhận" autofocus>✓</button></form>
          </div>
          <div id="offlineDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 7: FARMSTEAD STORAGE BARN, WORKSHOP, CARGO TRAIN & SYNERGIES -->
      <dialog id="workshopDialog" closedby="any" aria-labelledby="workshopDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="workshopDialogTitle" class="modal-title">🏡 Kho &amp; Xưởng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="workshopDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 8: MAGICAL CREATURE SANCTUARY SUITCASE -->
      <dialog id="suitcaseDialog" closedby="any" aria-labelledby="suitcaseDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="suitcaseDialogTitle" class="modal-title">🧳 Vali Thú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="suitcaseDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 9: ATTIC HARVEST MATCH-3 -->
      <dialog id="match3Dialog" closedby="any" aria-labelledby="match3DialogTitle">
        <div class="parchment-panel modal-inner m3-modal-inner">
          <div class="modal-header">
            <h2 id="match3DialogTitle" class="modal-title"><img src="/sprites/m3_farm_pinwheel.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Match-3</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title"><img src="/sprites/m3_piece_scroll.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Khảo Thí</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">🪄 Học Viện</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">🤝 Bạn Bè</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="neighborDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 13: HARVEST FEAST 30-TIER ACTION SEASON PASS -->
      <dialog id="harvestFeastDialog" closedby="any" aria-labelledby="harvestFeastDialogTitle">
        <div class="parchment-panel modal-inner feast-modal-inner">
          <div class="modal-header">
            <h2 id="harvestFeastDialogTitle" class="modal-title"><img src="/sprites/prop_ribbon_unveil.png" alt="" class="feast-title-icon" />Lễ Hội Mùa Gặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="harvestFeastDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 14: PER-MINIGAME LEADERBOARDS (6 WIZARDING DISCIPLINES) -->
      <dialog id="leaderboardDialog" closedby="any" aria-labelledby="leaderboardDialogTitle">
        <div class="parchment-panel modal-inner lb-modal-inner">
          <div class="modal-header">
            <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="leaderboardDialogContent"></div>
        </div>
      </dialog>
    `;
    this.root.appendChild(hudWrap);
    this.minimapCanvas = this.root.querySelector('#minimapCanvas') as HTMLCanvasElement;
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

  private wireRangeProgressFallback(slider: HTMLInputElement): void {
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

  public togglePhotoMode(force?: boolean): void {
    this.photoModeActive = typeof force === 'boolean' ? force : !this.photoModeActive;
    const isVisiting = this.sim.isVisitingNeighbor;
    (this.root.querySelector('#hudFrameTop') as HTMLElement).classList.toggle('hidden', this.photoModeActive);
    (this.root.querySelector('#bottomDockWrap') as HTMLElement).classList.toggle(
      'hidden',
      this.photoModeActive || isVisiting
    );
    this.root.querySelector('#tsCornerLeft')?.classList.toggle('hidden', this.photoModeActive);
    this.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle('hidden', this.photoModeActive || isVisiting);
    this.root
      .querySelector('#visitorDockBar')
      ?.classList.toggle('hidden', this.photoModeActive || !isVisiting);
    (this.root.querySelector('#minimapWrap') as HTMLElement).classList.toggle(
      'hidden',
      this.photoModeActive || !this.minimapHudVisible
    );
    (this.root.querySelector('#photoModeBar') as HTMLElement).classList.toggle('hidden', !this.photoModeActive);
    this.refreshFloatingBanner();
    this.refreshTouchConfirmBar();
    this.syncHudFocusVisibility();
    this.renderTutorialCoach();
  }

  public openNeighborDialog(
    tab?: 'friends' | 'chest' | 'log',
    focusNeighborId?: string
  ): void {
    this.closeHudPopovers();
    if (tab) this.activeNeighborTab = tab;
    if (focusNeighborId) this.focusedNeighborId = focusNeighborId;
    registerRealPlayerProfileOnline(
      this.sim.state as unknown as Record<string, unknown>
    ).catch(() => {});
    this.renderNeighborDialog();
    const dlg = this.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    if (focusNeighborId) {
      requestAnimationFrame(() => {
        const card = this.root.querySelector(
          `[data-neighbor-card="${focusNeighborId}"]`
        ) as HTMLElement | null;
        card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }
  }

  public openHarvestFeastDialog(): void {
    this.closeHudPopovers();
    this.renderHarvestFeastDialog();
    const dlg = this.root.querySelector('#harvestFeastDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
  }

  public refreshHarvestFeastBadges(): void {
    const claimable = this.sim.getClaimableHarvestFeastCount();
    const cornerBadge = this.root.querySelector('#badgeFeastCount') as HTMLElement | null;
    if (cornerBadge) {
      if (claimable > 0) {
        cornerBadge.textContent = String(claimable);
        cornerBadge.classList.remove('hidden');
      } else {
        cornerBadge.classList.add('hidden');
      }
    }
    const manageBadge = this.root.querySelector('#badgeManageFeastCount') as HTMLElement | null;
    if (manageBadge) {
      if (claimable > 0) {
        manageBadge.textContent = String(claimable);
        manageBadge.classList.remove('hidden');
      } else {
        manageBadge.classList.add('hidden');
      }
    }
  }

  public showRibbonUnveilBanner(info: RibbonUnveilCelebration): void {
    const card = this.root.querySelector('#ribbonUnveilToastCard') as HTMLElement | null;
    if (!card) return;
    card.innerHTML = `
      <div class="ribbon-unveil-banner-inner">
        <img src="/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${escapeHtml(info.speakerEmoji)} ${escapeHtml(info.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${escapeHtml(info.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${info.bonusGalleons.toLocaleString('vi-VN')} 🪙 • +${info.bonusXp.toLocaleString('vi-VN')} ⭐ • +${info.feastPoints} 🍁</div>
        </div>
      </div>
    `;
    card.classList.remove('hidden');
    if (this.ribbonBannerTimer) {
      window.clearTimeout(this.ribbonBannerTimer);
    }
    this.ribbonBannerTimer = window.setTimeout(() => {
      card.classList.add('hidden');
      this.ribbonBannerTimer = 0;
    }, 5200);
  }

  public renderHarvestFeastDialog(): void {
    const box = this.root.querySelector('#harvestFeastDialogContent') as HTMLElement | null;
    if (!box) return;

    const feast = this.sim.ensureHarvestFeast();
    const claimedSet = new Set(feast.claimedTiers);
    const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1]?.pointsRequired ?? 3000;
    const pct = Math.min(100, Math.round((feast.points / Math.max(1, maxPts)) * 100));
    const claimableCount = this.sim.getClaimableHarvestFeastCount();
    const allClaimed = HARVEST_FEAST_TIERS.every((t) => claimedSet.has(t.tier));
    const nextUnclaimed = HARVEST_FEAST_TIERS.find((t) => !claimedSet.has(t.tier));

    const tiersHtml = HARVEST_FEAST_TIERS.map((tierDef) => {
      const isClaimed = claimedSet.has(tierDef.tier);
      const isUnlocked = feast.points >= tierDef.pointsRequired;
      const canClaim = isUnlocked && !isClaimed;
      const rewardLabel = formatHarvestFeastRewardVi(tierDef);
      const isGrand = tierDef.tier % 5 === 0;
      const stateClass = isClaimed
        ? 'is-claimed'
        : canClaim
          ? 'is-claimable'
          : 'is-locked';
      return `
        <article class="feast-tier-card ${stateClass} ${isGrand ? 'is-grand' : ''}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${tierDef.tier}</span>
            <span class="feast-tier-pts">🍁 ${tierDef.pointsRequired.toLocaleString('vi-VN')}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${escapeHtml(tierDef.icon)} ${escapeHtml(tierDef.titleVi)}</span>
              ${isGrand ? '<span class="feast-grand-pill">👑</span>' : ''}
            </div>
            <div class="feast-tier-reward">${escapeHtml(rewardLabel)}</div>
          </div>
          <div class="feast-tier-cta">
            ${
              isClaimed
                ? '<span class="feast-claimed-pill">✓</span>'
                : canClaim
                  ? `<button type="button" data-claim-feast-tier="${tierDef.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`
                  : `<span class="feast-need-pill">-${(tierDef.pointsRequired - feast.points).toLocaleString('vi-VN')} 🍁</span>`
            }
          </div>
        </article>
      `;
    }).join('');

    box.innerHTML = `
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${feast.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${feast.points.toLocaleString('vi-VN')} / ${maxPts.toLocaleString('vi-VN')}</div>
            <div class="feast-hero-sub">
              ${
                allClaimed
                  ? '🎉 30/30!'
                  : nextUnclaimed
                    ? ` Kế tiếp: #${nextUnclaimed.tier} (${nextUnclaimed.pointsRequired.toLocaleString('vi-VN')} 🍁)`
                    : ''
              }
            </div>
          </div>
          <div class="feast-hero-actions">
            ${
              claimableCount > 0
                ? `<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${claimableCount})</button>`
                : ''
            }
            ${
              allClaimed
                ? `<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${feast.seasonCycle + 1}</button>`
                : ''
            }
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${pct}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      <div class="feast-tier-list" role="list">
        ${tiersHtml}
      </div>
    `;

    box.querySelector('#btnFeastClaimAll')?.addEventListener('click', () => {
      const res = this.sim.claimAllHarvestFeastTiers();
      this.showToast(res.msg, res.ok ? '🍁' : '⏳');
      this.refreshAll();
    });

    box.querySelector('#btnFeastNextSeason')?.addEventListener('click', () => {
      const res = this.sim.startNextHarvestFeastCycle();
      this.showToast(res.msg, res.ok ? '✨' : '🍁');
      this.refreshAll();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-claim-feast-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tierNum = Number(btn.dataset.claimFeastTier);
        if (!Number.isFinite(tierNum)) return;
        const res = this.sim.claimHarvestFeastTier(tierNum);
        this.showToast(res.msg, res.ok ? '🎁' : '🍁');
        this.refreshAll();
      });
    });
  }

  public openMinigameRescue(ctx: MinigameRescueContext): void {
    this.closeHudPopovers();
    const nDlg = this.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (nDlg?.open) nDlg.close();
    if (ctx.kind === 'match3') {
      void this.getMatch3Modal().then((m) => m.openRescue(ctx));
    } else {
      void this.getPuzzleArcadeModal().then((m) => m.openRescue(ctx));
    }
  }

  public enterVisitFromHud(neighborId: string): void {
    this.selectedCatalogItem = null;
    this.moveModeActive = false;
    this.movingBuildingUid = null;
    this.bulldozerActive = false;
    this.pincerActive = false;
    this.pincerPicked = null;
    this.pendingTouchTile = null;
    this.inspectSelection = null;
    this.rideCamUid = null;
    this.closeSeedTray();
    this.closePastureTray();
    this.collapseBuildDock();
    this.closeHudPopovers();

    const nDlg = this.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (nDlg?.open) nDlg.close();

    const res = this.sim.enterNeighborVisit(neighborId);
    if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
      this.onCameraJump?.();
      centerCameraOnGrid(this.cam, res.focusGx, res.focusGy);
    } else if (!res.ok) {
      this.showToast(res.msg, '⚠️');
    }
    this.refreshAll();
  }

  public exitVisitFromHud(): void {
    const res = this.sim.exitNeighborVisit(false);
    if (res.ok) {
      this.inspectSelection = null;
      this.rideCamUid = null;
      this.onCameraJump?.();
      centerCameraOnGrid(this.cam, res.focusGx, res.focusGy);
    }
    this.refreshAll();
  }

  public isBuildingFocusMode(): boolean {
    if (this.photoModeActive) return false;
    return (
      (Boolean(this.inspectSelection) && !this.inspectorCollapsed) ||
      (this.seedTrayOpen && Boolean(this.pendingSowPlotUid)) ||
      (this.pastureTrayOpen && Boolean(this.pendingStockPastureUid))
    );
  }

  public toggleHudRollup(force?: boolean): void {
    this.hudRolledUp = force !== undefined ? force : !this.hudRolledUp;
    if (this.hudRolledUp) {
      this.closeHudPopovers();
      this.collapseBuildDock();
      this.closeSeedTray();
      this.closePastureTray();
    }
    this.syncHudFocusVisibility();
  }

  public syncHudFocusVisibility(): void {
    const shell = this.root.querySelector('.hud-shell-root') as HTMLElement | null;
    if (!shell) return;
    const focused = this.isBuildingFocusMode();
    const rolled = this.hudRolledUp && !this.photoModeActive && !focused;
    shell.classList.toggle('hud-building-focus', focused);
    shell.classList.toggle('hud-compact-rolled', rolled);
    const btnRoll = this.root.querySelector('#btnToggleHudRollup') as HTMLButtonElement | null;
    if (btnRoll) {
      btnRoll.setAttribute('aria-pressed', String(this.hudRolledUp));
      btnRoll.dataset.active = String(this.hudRolledUp);
      btnRoll.title = this.hudRolledUp
        ? 'Mở rộng lại các thanh HUD quanh màn hình (Phím H)'
        : 'Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)';
    }
    const chevron = this.root.querySelector('#svgHudRollupChevron') as SVGPathElement | null;
    if (chevron) {
      chevron.setAttribute(
        'd',
        this.hudRolledUp ? 'M13.5 19.5 L18 24 L22.5 19.5' : 'M13.5 23 L18 18.5 L22.5 23'
      );
    }
    const btnManageRoll = this.root.querySelector(
      '#btnManageToggleHudRollup'
    ) as HTMLButtonElement | null;
    if (btnManageRoll) {
      btnManageRoll.textContent = this.hudRolledUp
        ? '📜 Mở HUD'
        : '📜 Ẩn HUD';
    }
    const roundOrb = this.root.querySelector('#btnHudRoundOrb') as HTMLButtonElement | null;
    if (roundOrb) {
      roundOrb.classList.toggle('hidden', this.photoModeActive || focused);
      roundOrb.setAttribute('aria-pressed', String(this.hudRolledUp));
      roundOrb.dataset.rolled = String(this.hudRolledUp);
    }
    const orbLbl = this.root.querySelector('#lblHudRoundOrbTag');
    if (orbLbl) {
      orbLbl.textContent = this.hudRolledUp ? 'Mở HUD' : 'Thu HUD';
    }
    const orbChevron = this.root.querySelector('#svgRoundOrbChevron') as SVGPathElement | null;
    if (orbChevron) {
      orbChevron.setAttribute(
        'd',
        this.hudRolledUp ? 'M16 19.8 L20 23.8 L24 19.8' : 'M16 23.2 L20 19.2 L24 23.2'
      );
    }
    if (focused) {
      this.closeHudPopovers();
      this.collapseBuildDock();
      const dockWrap = this.root.querySelector('#bottomDockWrap') as HTMLElement | null;
      dockWrap?.classList.remove('ts-dock-open');
      const drawer = this.root.querySelector('#buildDrawer') as HTMLElement | null;
      drawer?.classList.add('hidden');
      const secBar = this.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
      secBar?.classList.add('hidden');
    }
  }

  public openWorkshopDialog(tab?: 'barn' | 'brew' | 'cargo' | 'synergy'): void {
    if (tab) this.activeWorkshopTab = tab;
    this.renderWorkshopDialog();
    const dlg = this.root.querySelector('#workshopDialog') as HTMLDialogElement;
    if (!dlg.open) dlg.showModal();
  }

  public openSuitcaseDialog(
    tab?: 'care' | 'morph' | 'expedition',
    focusHabitatUid?: string
  ): void {
    if (tab) this.activeSuitcaseTab = tab;
    if (focusHabitatUid) {
      this.selectedSuitcaseHabitatUid = focusHabitatUid;
    }
    this.renderSuitcaseDialog();
    const dlg = this.root.querySelector('#suitcaseDialog') as HTMLDialogElement;
    if (!dlg.open) dlg.showModal();
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

  public closeHudPopovers(): void {
    this.manageMenuOpen = false;
    this.weatherPopoverOpen = false;
    const managePop = this.root.querySelector('#managePopoverMenu') as HTMLElement | null;
    const weatherPop = this.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    const btnManage = this.root.querySelector('#btnToggleManageMenu') as HTMLElement | null;
    const btnClock = this.root.querySelector('#lblClock') as HTMLElement | null;
    managePop?.classList.add('hidden');
    weatherPop?.classList.add('hidden');
    if (btnManage) {
      btnManage.setAttribute('aria-expanded', 'false');
      btnManage.setAttribute('data-active', 'false');
    }
    if (btnClock) {
      btnClock.setAttribute('aria-expanded', 'false');
    }
  }

  public collapseBuildDock(): void {
    this.buildSheetOpen = false;
    this.activeCategory = null;
    this.mapToolsExpanded = false;
  }

  public hasOpenFloatingTray(): boolean {
    return (
      this.buildSheetOpen ||
      Boolean(this.activeCategory) ||
      this.mapToolsExpanded ||
      this.seedTrayOpen ||
      this.pastureTrayOpen
    );
  }

  public hideOpenFloatingTrays(): void {
    this.collapseBuildDock();
    this.seedTrayOpen = false;
    this.pendingSowPlotUid = null;
    this.pastureTrayOpen = false;
    this.pendingStockPastureUid = null;
  }

  private positionFloatingPopover(triggerEl: HTMLElement | null, popoverEl: HTMLElement | null): void {
    if (!triggerEl || !popoverEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const popW = Math.max(248, popoverEl.offsetWidth || 280);
    const preferredLeft = rect.left < window.innerWidth * 0.5 ? rect.left : rect.right - popW;
    const left = Math.max(10, Math.min(preferredLeft, window.innerWidth - popW - 10));
    const top = Math.min(rect.bottom + 8, window.innerHeight - 280);
    popoverEl.style.left = `${Math.round(left)}px`;
    popoverEl.style.top = `${Math.round(Math.max(8, top))}px`;
  }

  public toggleManagePopover(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.manageMenuOpen;
    this.closeHudPopovers();
    if (!next) return;
    this.manageMenuOpen = true;
    const pop = this.root.querySelector('#managePopoverMenu') as HTMLElement | null;
    const btn = this.root.querySelector('#btnToggleManageMenu') as HTMLElement | null;
    if (pop && btn) {
      pop.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('data-active', 'true');
      this.positionFloatingPopover(btn, pop);
    }
  }

  public toggleWeatherPopover(force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !this.weatherPopoverOpen;
    this.closeHudPopovers();
    if (!next) return;
    this.weatherPopoverOpen = true;
    const pop = this.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    const btn = this.root.querySelector('#lblClock') as HTMLElement | null;
    if (pop && btn) {
      this.renderWeatherPopover();
      pop.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      this.positionFloatingPopover(btn, pop);
    }
  }

  private renderWeatherPopover(): void {
    const pop = this.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    if (!pop) return;
    const nowMs = Date.now();
    const cur = this.sim.getCurrentWeather(nowMs);
    const slots = this.sim.getWeatherForecast(4, nowMs);
    const isAuto = this.sim.state.settings.weatherOverride === 'auto';

    pop.innerHTML = `
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${isAuto ? 'Tự động' : 'Khóa'}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${cur.icon} ${escapeHtml(cur.labelVi)}</div>
        <div class="weather-current-buff">✨ ${escapeHtml(cur.buffVi)}</div>
      </div>
      <div class="speed-toggle-row" role="group" aria-label="Tốc độ nhịp sống công viên">
        <button type="button" data-sim-speed="1" data-active="${this.sim.simSpeed === 1}" aria-pressed="${this.sim.simSpeed === 1}" class="brass-btn">
          🐢 1×
        </button>
        <button type="button" data-sim-speed="2" data-active="${this.sim.simSpeed === 2}" aria-pressed="${this.sim.simSpeed === 2}" class="brass-btn">
          ⚡ 2×
        </button>
      </div>
      <div class="weather-forecast-list">
        ${slots
          .map((s, idx) => {
            const timeTag =
              idx === 0
                ? 'Nay'
                : `+${formatDurationCountdownVi(Math.max(1, s.startsInSec))}`;
            return `
              <div class="weather-slot-row ${idx === 0 ? 'is-now' : ''}">
                <span>${s.icon} ${escapeHtml(s.labelVi)}</span>
                <span class="weather-slot-meta">${escapeHtml(timeTag)}</span>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

    pop.querySelectorAll<HTMLButtonElement>('[data-sim-speed]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const spd = btn.dataset.simSpeed === '2' ? 2 : 1;
        this.sim.simSpeed = spd;
        this.refreshHeaderClock();
        this.closeHudPopovers();
        this.showToast(
          spd === 2
            ? '⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!'
            : '🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.',
          spd === 2 ? '⚡' : '🌿'
        );
      });
    });
  }

  private animateGalleonsTo(target: number): void {
    const lbl = this.root.querySelector('#lblGalleons') as HTMLElement | null;
    if (!lbl) return;
    if (this.sim.state.sandboxMode) {
      if (this.galleonRollRaf) {
        cancelAnimationFrame(this.galleonRollRaf);
        this.galleonRollRaf = 0;
      }
      lbl.textContent = '∞';
      this.displayedGalleons = target;
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.displayedGalleons < 0 || reducedMotion || Math.abs(target - this.displayedGalleons) <= 1) {
      this.displayedGalleons = target;
      lbl.textContent = Math.round(target).toLocaleString('vi-VN');
      return;
    }

    if (this.galleonRollRaf) {
      cancelAnimationFrame(this.galleonRollRaf);
      this.galleonRollRaf = 0;
    }

    const startVal = this.displayedGalleons;
    const startAt = performance.now();
    const duration = 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(startVal + (target - startVal) * eased);
      this.displayedGalleons = cur;
      lbl.textContent = cur.toLocaleString('vi-VN');
      if (t < 1) {
        this.galleonRollRaf = requestAnimationFrame(step);
      } else {
        this.displayedGalleons = target;
        this.galleonRollRaf = 0;
      }
    };
    this.galleonRollRaf = requestAnimationFrame(step);
  }

  public spawnFlyReward(
    kind: FlyRewardKind,
    amount: number,
    startSx?: number,
    startSy?: number
  ): void {
    const targetEl = this.root.querySelector(`[data-fly-target="${kind}"]`) as HTMLElement | null;
    const layer = this.root.querySelector('#flyRewardLayer') as HTMLElement | null;
    if (!targetEl || !layer) return;

    const pulseTarget = () => {
      targetEl.classList.remove('hud-chip-pulse');
      void targetEl.offsetWidth;
      targetEl.classList.add('hud-chip-pulse');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || this.photoModeActive) {
      pulseTarget();
      this.sim.audio.playFlyTick(0);
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) return;
    const destX = rect.left + rect.width * 0.5;
    const destY = rect.top + rect.height * 0.5;

    const originX =
      typeof startSx === 'number' && Number.isFinite(startSx)
        ? Math.max(24, Math.min(window.innerWidth - 24, startSx))
        : window.innerWidth * 0.5;
    const originY =
      typeof startSy === 'number' && Number.isFinite(startSy)
        ? Math.max(24, Math.min(window.innerHeight - 24, startSy))
        : window.innerHeight * 0.54;

    const iconMap: Record<FlyRewardKind, string> = {
      galleons: '🪙',
      stars: '🌟',
      sand: '⏳',
      xp: '✨',
    };
    const count =
      kind === 'stars' || kind === 'sand'
        ? Math.min(5, Math.max(1, Math.round(amount)))
        : Math.min(7, Math.max(2, Math.ceil(Math.log2(Math.max(2, amount)))));

    for (let i = 0; i < count; i++) {
      const token = document.createElement('div');
      token.className = 'fly-reward-token';
      token.dataset.kind = kind;
      token.textContent = iconMap[kind];
      layer.appendChild(token);

      const spreadAngle = (i / Math.max(1, count)) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const scatterR = 14 + (i % 3) * 9;
      const sx0 = originX + Math.cos(spreadAngle) * scatterR;
      const sy0 = originY + Math.sin(spreadAngle) * scatterR * 0.7;

      const midX = (sx0 + destX) * 0.5 + (i % 2 === 0 ? -42 : 42);
      const midY = Math.min(sy0, destY) - (48 + (i % 3) * 18);

      const duration = 560 + i * 48;
      const delay = i * 52;

      const anim = token.animate(
        [
          {
            transform: `translate3d(${sx0}px, ${sy0}px, 0) scale(0.55)`,
            opacity: 0.25,
            offset: 0,
          },
          {
            transform: `translate3d(${sx0}px, ${sy0 - 12}px, 0) scale(1.14)`,
            opacity: 1,
            offset: 0.18,
          },
          {
            transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.04)`,
            opacity: 1,
            offset: 0.58,
          },
          {
            transform: `translate3d(${destX}px, ${destY}px, 0) scale(0.68)`,
            opacity: 0.92,
            offset: 1,
          },
        ],
        {
          duration,
          delay,
          easing: 'cubic-bezier(0.22, 0.88, 0.36, 1)',
          fill: 'forwards',
        }
      );

      anim.onfinish = () => {
        token.remove();
        pulseTarget();
        this.sim.audio.playFlyTick(i);
      };
    }
  }

  private bindEvents(): void {
    const handleOpenMatch3 = () => {
      this.closeHudPopovers();
      this.openMatch3Dialog();
    };
    const handleOpenTrialOrHub = () => {
      this.openTrialMinigame();
    };
    this.root.querySelector('#btnOpenMatch3')?.addEventListener('click', handleOpenMatch3);
    this.root.querySelector('#btnHudStarChip')?.addEventListener('click', handleOpenTrialOrHub);
    this.root.querySelector('#btnHudMinigameHub')?.addEventListener('click', handleOpenTrialOrHub);
    this.root.querySelector('#btnCornerPlayPuzzle')?.addEventListener('click', handleOpenTrialOrHub);
    this.root.querySelector('#xpBarShell')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderRoadmapDialog();
      (this.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.showModal();
    });
    this.root.querySelector('#btnHudHeartChip')?.addEventListener('click', handleOpenMatch3);
    this.root.querySelector('#btnPlusGalleons')?.addEventListener('click', handleOpenTrialOrHub);
    const handleOpenPuzzleArcade = () => {
      this.closeHudPopovers();
      this.openPuzzleArcadeDialog();
    };
    this.root.querySelector('#btnOpenPuzzleArcade')?.addEventListener('click', handleOpenPuzzleArcade);
    this.root.querySelector('#btnOpenLeaderboard')?.addEventListener('click', () => {
      this.openLeaderboardDialog();
    });
    this.root.querySelector('#btnPlusSand')?.addEventListener('click', handleOpenPuzzleArcade);
    const handleOpenBarn = (e?: Event) => {
      e?.stopPropagation();
      this.closeHudPopovers();
      this.openWorkshopDialog('barn');
    };
    this.root.querySelector('#btnOpenSeedSilo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeHudPopovers();
      this.toggleSeedTray();
    });
    this.root.querySelector('#btnOpenPastureTray')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeHudPopovers();
      this.togglePastureTray();
    });
    this.root.querySelector('#btnOpenStorageBarn')?.addEventListener('click', handleOpenBarn);
    this.root.querySelector('#chipHudBarn')?.addEventListener('click', handleOpenBarn);
    this.root.querySelector('#btnHappySmiley')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderFinanceDialog();
      (this.root.querySelector('#financeDialog') as HTMLDialogElement).showModal();
    });
    this.root.querySelector('#btnToggleBuildDock')?.addEventListener('click', () => {
      this.closeHudPopovers();
      const isDockOpen =
        this.buildSheetOpen || Boolean(this.activeCategory) || this.mapToolsExpanded;
      if (isDockOpen) {
        this.collapseBuildDock();
        this.selectedCatalogItem = null;
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.pendingTouchTile = null;
      } else {
        this.closeSeedTray();
        this.closePastureTray();
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.pendingTouchTile = null;
        this.inspectSelection = null;
        this.buildSheetOpen = true;
        const selCat = this.selectedCatalogItem?.category;
        this.activeCategory =
          selCat && BUILD_HUD_CATEGORIES.includes(selCat) ? selCat : 'shop';
      }
      this.refreshAll();
    });
    this.root.querySelector('#btnToggleMinimapHud')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.minimapHudVisible = !this.minimapHudVisible;
      if (this.minimapHudVisible) {
        this.minimapCollapsed = false;
        this.minimapCanvas.classList.remove('hidden');
      }
      this.refreshDock();
    });
    this.root.querySelector('#btnToggleQuestTrackerHud')?.addEventListener('click', () => {
      this.closeHudPopovers();
      const qPanel = this.root.querySelector('#questTrackerPanel') as HTMLElement | null;
      qPanel?.classList.toggle('hidden');
    });
    this.root.querySelector('#btnHudActiveBuilds')?.addEventListener('click', () => {
      this.closeHudPopovers();
      const actives = this.sim.getActiveConstructions(Date.now());
      if (actives.length === 0) return;
      const nextB = actives[0];
      const it = getCatalogItem(nextB.itemId);
      centerCameraOnGrid(
        this.cam,
        nextB.gx + (it?.width ?? 1) * 0.5,
        nextB.gy + (it?.height ?? 1) * 0.5
      );
      this.inspectSelection = { kind: 'building', uid: nextB.uid };
      this.renderInspector();
    });

    this.root.querySelector('#btnToggleManageMenu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleManagePopover();
    });

    this.root.querySelector('#btnToggleHudRollup')?.addEventListener('click', () => {
      this.toggleHudRollup();
    });

    this.root.querySelector('#btnManageToggleHudRollup')?.addEventListener('click', () => {
      this.toggleHudRollup();
    });

    const roundOrbBtn = this.root.querySelector('#btnHudRoundOrb') as HTMLButtonElement | null;
    if (roundOrbBtn) {
      let orbDragId: number | null = null;
      let orbStartX = 0;
      let orbStartY = 0;
      let orbOrigLeft = 0;
      let orbOrigTop = 0;
      let orbMoved = false;

      roundOrbBtn.addEventListener('pointerdown', (ev) => {
        if (ev.button !== 0 && ev.pointerType === 'mouse') return;
        const rect = roundOrbBtn.getBoundingClientRect();
        orbDragId = ev.pointerId;
        orbStartX = ev.clientX;
        orbStartY = ev.clientY;
        orbOrigLeft = rect.left;
        orbOrigTop = rect.top;
        orbMoved = false;
        try {
          roundOrbBtn.setPointerCapture(ev.pointerId);
        } catch {
          // Ignore synthetic pointer events in headless tests
        }
      });

      roundOrbBtn.addEventListener('pointermove', (ev) => {
        if (orbDragId !== ev.pointerId) return;
        const dx = ev.clientX - orbStartX;
        const dy = ev.clientY - orbStartY;
        if (!orbMoved && Math.hypot(dx, dy) > 7) {
          orbMoved = true;
        }
        if (orbMoved) {
          const w = roundOrbBtn.offsetWidth || 52;
          const h = roundOrbBtn.offsetHeight || 62;
          const nextLeft = Math.max(6, Math.min(window.innerWidth - w - 6, orbOrigLeft + dx));
          const nextTop = Math.max(6, Math.min(window.innerHeight - h - 6, orbOrigTop + dy));
          roundOrbBtn.style.left = `${Math.round(nextLeft)}px`;
          roundOrbBtn.style.top = `${Math.round(nextTop)}px`;
          roundOrbBtn.style.right = 'auto';
          roundOrbBtn.style.bottom = 'auto';
        }
      });

      const finishOrbPointer = (ev: PointerEvent) => {
        if (orbDragId !== ev.pointerId) return;
        orbDragId = null;
        try {
          if (roundOrbBtn.hasPointerCapture(ev.pointerId)) {
            roundOrbBtn.releasePointerCapture(ev.pointerId);
          }
        } catch {
          // Ignore
        }
      };

      roundOrbBtn.addEventListener('pointerup', finishOrbPointer);
      roundOrbBtn.addEventListener('pointercancel', finishOrbPointer);
      roundOrbBtn.addEventListener('click', (ev) => {
        if (orbMoved) {
          ev.preventDefault();
          ev.stopPropagation();
          orbMoved = false;
          return;
        }
        this.toggleHudRollup();
      });
    }

    this.root.querySelector('#lblClock')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleWeatherPopover();
    });

    this.root.querySelector('#btnToggleMapTools')?.addEventListener('click', () => {
      this.mapToolsExpanded = !this.mapToolsExpanded;
      this.refreshDock();
    });

    window.addEventListener('pointerdown', (e) => {
      if (!this.manageMenuOpen && !this.weatherPopoverOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      const managePop = this.root.querySelector('#managePopoverMenu');
      const weatherPop = this.root.querySelector('#weatherPopoverMenu');
      const btnManage = this.root.querySelector('#btnToggleManageMenu');
      const btnClock = this.root.querySelector('#lblClock');
      if (
        managePop?.contains(target) ||
        weatherPop?.contains(target) ||
        btnManage?.contains(target) ||
        btnClock?.contains(target)
      ) {
        return;
      }
      this.closeHudPopovers();
    });

    window.addEventListener('resize', () => {
      if (this.manageMenuOpen) {
        this.positionFloatingPopover(
          this.root.querySelector('#btnToggleManageMenu') as HTMLElement | null,
          this.root.querySelector('#managePopoverMenu') as HTMLElement | null
        );
      } else if (this.weatherPopoverOpen) {
        this.positionFloatingPopover(
          this.root.querySelector('#lblClock') as HTMLElement | null,
          this.root.querySelector('#weatherPopoverMenu') as HTMLElement | null
        );
      }
    });

    this.root.querySelector('#btnAccioAll')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.sim.castAccioHarvestAll();
    });

    this.root.querySelector('#btnOpenWorkshop')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.openWorkshopDialog();
    });

    this.root.querySelector('#btnOpenSuitcase')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.openSuitcaseDialog();
    });

    this.root.querySelector('#btnOpenQuests')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderQuestDialog();
      (this.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
    });

    const openNeighborsHandler = () => {
      this.openNeighborDialog();
    };
    this.root.querySelector('#btnOpenNeighbors')?.addEventListener('click', openNeighborsHandler);
    this.root
      .querySelector('#btnManageOpenNeighbors')
      ?.addEventListener('click', openNeighborsHandler);

    const openFeastHandler = () => {
      this.openHarvestFeastDialog();
    };
    this.root.querySelector('#btnOpenHarvestFeast')?.addEventListener('click', openFeastHandler);
    this.root.querySelector('#btnManageOpenFeast')?.addEventListener('click', openFeastHandler);

    this.root.querySelector('#ribbonUnveilToastCard')?.addEventListener('click', () => {
      const card = this.root.querySelector('#ribbonUnveilToastCard') as HTMLElement | null;
      if (card) card.classList.add('hidden');
      if (this.ribbonBannerTimer) {
        window.clearTimeout(this.ribbonBannerTimer);
        this.ribbonBannerTimer = 0;
      }
    });

    const openZones = () => {
      this.closeHudPopovers();
      this.renderRoadmapDialog();
      (this.root.querySelector('#roadmapDialog') as HTMLDialogElement).showModal();
    };
    this.root.querySelector('#btnOpenRoadmap')?.addEventListener('click', openZones);
    this.root.querySelector('#btnOpenZones')?.addEventListener('click', openZones);
    this.root.querySelector('#btnOpenWorldMap')?.addEventListener('click', openZones);

    this.root.querySelector('#btnOpenFinance')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderFinanceDialog();
      (this.root.querySelector('#financeDialog') as HTMLDialogElement).showModal();
    });

    this.root.querySelector('#btnOpenAlbum')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderAlbumDialog();
      (this.root.querySelector('#albumDialog') as HTMLDialogElement).showModal();
    });

    this.root.querySelector('#btnCycleHeatmap')?.addEventListener('click', () => {
      const idx = HEATMAP_CYCLE.findIndex((x) => x.mode === this.sim.heatmapMode);
      const next = HEATMAP_CYCLE[(idx + 1) % HEATMAP_CYCLE.length];
      this.sim.heatmapMode = next.mode;
      const btn = this.root.querySelector('#btnCycleHeatmap') as HTMLButtonElement;
      const isHmActive = next.mode !== 'none';
      btn.textContent = next.label;
      btn.setAttribute('data-active', String(isHmActive));
      btn.setAttribute('aria-pressed', String(isHmActive));
      if (isHmActive) {
        this.showToast(`Đã bật ${next.label}!`, '🌡️');
      }
    });

    this.root.querySelector('#btnPhotoMode')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.togglePhotoMode(true);
    });
    this.root.querySelector('#btnExitPhoto')?.addEventListener('click', () => {
      this.togglePhotoMode(false);
    });
    this.root.querySelector('#btnSavePhotoPng')?.addEventListener('click', () => {
      const url = this.gameCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `cong-vien-phep-thuat-lv${this.sim.state.level}.png`;
      a.click();
      this.showToast('Đã lưu ảnh kỷ niệm công viên (.png)!', '📸');
    });

    this.root.querySelector('#btnOpenSettings')?.addEventListener('click', () => {
      this.closeHudPopovers();
      this.renderSettingsDialog();
      (this.root.querySelector('#settingsDialog') as HTMLDialogElement).showModal();
    });

    this.root.querySelector('#btnToggleQuestCollapse')?.addEventListener('click', (e) => {
      this.questCollapsed = !this.questCollapsed;
      const body = this.root.querySelector('#questTrackerBody') as HTMLElement;
      body.classList.toggle('hidden', this.questCollapsed);
      const btn = e.currentTarget as HTMLButtonElement;
      btn.textContent = this.questCollapsed ? '+' : '–';
      btn.setAttribute('aria-expanded', String(!this.questCollapsed));
    });

    this.root.querySelector('#btnToggleMinimap')?.addEventListener('click', (e) => {
      this.minimapCollapsed = !this.minimapCollapsed;
      this.minimapCanvas.classList.toggle('hidden', this.minimapCollapsed);
      const btn = e.currentTarget as HTMLButtonElement;
      btn.textContent = this.minimapCollapsed ? '+' : '–';
      btn.setAttribute('aria-expanded', String(!this.minimapCollapsed));
    });

    // Floating Banner buttons (Ride Cam / Pincer / Move / Bulldoze / Build / Seed)
    this.root.querySelector('#btnFloatingSecondary')?.addEventListener('click', () => {
      if (this.rideCamUid) {
        rotateCamera90(this.cam, 1);
        this.refreshDock();
        this.showToast(`Đã xoay góc nhìn bản đồ sang ${COMPASS_LABELS_VI[this.cam.viewRot ?? 0]}!`, '🧭');
      } else if (
        (this.moveModeActive && this.movingBuildingUid) ||
        (this.selectedCatalogItem && !this.buildSheetOpen && !this.activeCategory)
      ) {
        this.rotation = ((this.rotation + 1) % 4) as 0 | 1 | 2 | 3;
        this.refreshFloatingBanner();
        this.refreshTouchConfirmBar();
        this.showToast(`Đã xoay hướng cửa công trình (${this.rotation * 90}°)`, '🔄');
      } else if (this.activeSeedCropId && !this.seedTrayOpen) {
        this.openSeedTray(this.activeSeedCropId);
      } else if (this.activePastureAnimalId && !this.pastureTrayOpen) {
        this.openPastureTray(this.activePastureAnimalId);
      }
    });

    this.root.querySelector('#btnFloatingSwap')?.addEventListener('click', () => {
      if (this.selectedCatalogItem) {
        this.buildSheetOpen = true;
        const selCat = this.selectedCatalogItem.category;
        this.activeCategory = BUILD_HUD_CATEGORIES.includes(selCat) ? selCat : 'shop';
        this.refreshAll();
      } else if (this.activeSeedCropId) {
        this.openSeedTray(this.activeSeedCropId);
      } else if (this.activePastureAnimalId) {
        this.openPastureTray(this.activePastureAnimalId);
      }
    });

    this.root.querySelector('#btnFloatingExit')?.addEventListener('click', () => {
      if (this.rideCamUid) {
        this.rideCamUid = null;
        this.refreshFloatingBanner();
      } else if (this.pincerActive) {
        this.pincerActive = false;
        this.pincerPicked = null;
        this.refreshAll();
      } else if (this.moveModeActive) {
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pendingTouchTile = null;
        this.refreshAll();
      } else if (this.bulldozerActive) {
        this.bulldozerActive = false;
        this.pendingTouchTile = null;
        this.refreshAll();
      } else if (this.selectedCatalogItem) {
        this.selectedCatalogItem = null;
        this.pendingTouchTile = null;
        this.refreshAll();
      } else if (this.activeSeedCropId || this.seedTrayOpen) {
        this.closeSeedTray();
        this.refreshAll();
      } else if (this.activePastureAnimalId || this.pastureTrayOpen) {
        this.closePastureTray();
        this.refreshAll();
      } else if (this.sim.state.settings.cutawayMode) {
        this.sim.state.settings.cutawayMode = false;
        this.sim.saveToStorage();
        this.refreshAll();
      }
    });

    // Touch Confirm Bar buttons
    this.root.querySelector('#btnTouchConfirmOk')?.addEventListener('click', () => {
      this.onTouchConfirmPlace?.();
    });
    this.root.querySelector('#btnTouchRotate')?.addEventListener('click', () => {
      this.rotation = ((this.rotation + 1) % 4) as 0 | 1 | 2 | 3;
      this.showToast(`Đã xoay hướng cửa công trình (${this.rotation * 90}°)`, '🔄');
      this.refreshTouchConfirmBar();
    });
    this.root.querySelector('#btnTouchCancel')?.addEventListener('click', () => {
      this.pendingTouchTile = null;
      this.onTouchCancelPlace?.();
      this.refreshTouchConfirmBar();
    });

    // Interactive Minimap Click & Drag Navigation (rotation-aware!)
    const jumpFromMinimap = (e: PointerEvent) => {
      const rect = this.minimapCanvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * this.minimapCanvas.width;
      const my = ((e.clientY - rect.top) / rect.height) * this.minimapCanvas.height;
      const scaleX = (this.minimapCanvas.width * 0.46) / GRID_SIZE;
      const scaleY = (this.minimapCanvas.height * 0.44) / GRID_SIZE;
      const u = (mx - this.minimapCanvas.width * 0.5) / scaleX;
      const v = (my - 8) / scaleY;
      const rx = (u + v) * 0.5;
      const ry = (v - u) * 0.5;
      const { fgx, fgy } = unrotateGridPoint(rx, ry, this.cam.viewRot ?? 0);
      const gx = Math.max(0, Math.min(GRID_SIZE - 1, fgx));
      const gy = Math.max(0, Math.min(GRID_SIZE - 1, fgy));
      this.rideCamUid = null;
      centerCameraOnGrid(this.cam, gx, gy);
    };
    let draggingMinimap = false;
    this.minimapCanvas.addEventListener('pointerdown', (e) => {
      draggingMinimap = true;
      jumpFromMinimap(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (draggingMinimap) jumpFromMinimap(e);
    });
    window.addEventListener('pointerup', () => {
      draggingMinimap = false;
    });

    // Category buttons
    this.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat as BuildingCategory;
        if (!BUILD_HUD_CATEGORIES.includes(cat)) return;
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.pendingTouchTile = null;
        if (this.activeCategory === cat) {
          this.activeCategory = null;
          this.selectedCatalogItem = null;
        } else {
          this.activeCategory = cat;
        }
        this.refreshDock();
        this.refreshFloatingBanner();
        this.refreshTouchConfirmBar();
      });
    });

    this.root.querySelector('#btnPincerTool')?.addEventListener('click', () => {
      this.pincerActive = !this.pincerActive;
      this.pincerPicked = null;
      if (this.pincerActive) {
        this.selectedCatalogItem = null;
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pendingTouchTile = null;
        this.inspectSelection = null;
        this.collapseBuildDock();
        const st0 = this.sim.staff[0];
        if (st0) {
          this.pincerPicked = { kind: 'staff', id: st0.id, label: st0.name };
        }
        this.showToast('Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!', '🤏');
      }
      this.refreshAll();
    });

    this.root.querySelector('#btnMoveTool')?.addEventListener('click', () => {
      this.moveModeActive = !this.moveModeActive;
      this.movingBuildingUid = null;
      this.pendingTouchTile = null;
      if (this.moveModeActive) {
        this.selectedCatalogItem = null;
        this.bulldozerActive = false;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.inspectSelection = null;
        this.collapseBuildDock();
        this.showToast('Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!', '✋');
      }
      this.refreshAll();
    });

    this.root.querySelector('#btnRotate')?.addEventListener('click', () => {
      this.rotation = ((this.rotation + 1) % 4) as 0 | 1 | 2 | 3;
      this.refreshFloatingBanner();
      this.refreshTouchConfirmBar();
      this.showToast(`Đã xoay hướng Cổng Vào/Ra (${this.rotation * 90}°)`, '🔄');
    });

    this.root.querySelector('#btnBulldoze')?.addEventListener('click', () => {
      this.bulldozerActive = !this.bulldozerActive;
      this.pendingTouchTile = null;
      if (this.bulldozerActive) {
        this.selectedCatalogItem = null;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.inspectSelection = null;
        this.collapseBuildDock();
      }
      this.refreshAll();
    });

    this.root.querySelector('#btnRotateCam')?.addEventListener('click', () => {
      rotateCamera90(this.cam, 1);
      this.refreshDock();
      this.showToast(`Góc nhìn bản đồ: ${COMPASS_LABELS_VI[this.cam.viewRot ?? 0]} (Phím Q/E)`, '🧭');
    });

    this.root.querySelector('#btnCutaway')?.addEventListener('click', () => {
      this.sim.state.settings.cutawayMode = !this.sim.state.settings.cutawayMode;
      this.collapseBuildDock();
      this.refreshAll();
      this.showToast(
        this.sim.state.settings.cutawayMode
          ? 'Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!'
          : 'Đã tắt chế độ Nhìn Xuyên Nhà Cao',
        '👁️'
      );
    });

    this.root.querySelector('#btnGrid')?.addEventListener('click', () => {
      this.sim.state.settings.showGrid = !this.sim.state.settings.showGrid;
      this.collapseBuildDock();
      this.refreshAll();
    });

    this.root.querySelector('#btnHomeCam')?.addEventListener('click', () => {
      this.rideCamUid = null;
      this.collapseBuildDock();
      const burrowB = this.sim.state.buildings.find((b) => b.itemId === 'burrow_house_canon');
      if (burrowB) {
        centerCameraOnGrid(this.cam, burrowB.gx + 1.5, burrowB.gy + 1.5);
      } else {
        centerCameraOnGrid(this.cam, 13.8, 18.2);
      }
      this.refreshAll();
    });

    window.addEventListener('keydown', (e) => {
      if (this.root.querySelector('dialog[open]') || document.querySelector('dialog[open]')) {
        return;
      }
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target instanceof HTMLElement && e.target.classList.contains('drag-handle'))
      ) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        this.openNeighborDialog();
      } else if (e.key === 'r' || e.key === 'R') {
        if (this.sim.isVisitingNeighbor) return;
        this.rotation = ((this.rotation + 1) % 4) as 0 | 1 | 2 | 3;
        this.refreshFloatingBanner();
        this.refreshTouchConfirmBar();
        this.showToast(`Đã xoay hướng cửa công trình (${this.rotation * 90}°)`, '🔄');
      } else if (e.key === 'q' || e.key === 'Q') {
        rotateCamera90(this.cam, -1);
        this.refreshDock();
        this.showToast(`Góc nhìn: ${COMPASS_LABELS_VI[this.cam.viewRot ?? 0]}`, '🧭');
      } else if (e.key === 'e' || e.key === 'E') {
        rotateCamera90(this.cam, 1);
        this.refreshDock();
        this.showToast(`Góc nhìn: ${COMPASS_LABELS_VI[this.cam.viewRot ?? 0]}`, '🧭');
      } else if (e.key === 'v' || e.key === 'V') {
        this.sim.state.settings.cutawayMode = !this.sim.state.settings.cutawayMode;
        this.refreshAll();
        this.showToast(
          this.sim.state.settings.cutawayMode ? 'Bật Nhìn Xuyên Nhà Cao (V)' : 'Tắt Nhìn Xuyên Nhà Cao',
          '👁️'
        );
      } else if (e.key === 'g' || e.key === 'G') {
        if (this.sim.isVisitingNeighbor) {
          this.showToast('Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!', '🏡');
          return;
        }
        this.pincerActive = !this.pincerActive;
        this.pincerPicked = null;
        if (this.pincerActive) {
          this.selectedCatalogItem = null;
          this.bulldozerActive = false;
          this.moveModeActive = false;
          this.movingBuildingUid = null;
          this.inspectSelection = null;
          this.closeSeedTray();
          this.collapseBuildDock();
          const st0 = this.sim.staff[0];
          if (st0) {
            this.pincerPicked = { kind: 'staff', id: st0.id, label: st0.name };
          }
          this.showToast('Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!', '🤏');
        }
        this.refreshAll();
      } else if (e.key === 'm' || e.key === 'M') {
        if (this.sim.isVisitingNeighbor) {
          this.showToast('Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!', '🏡');
          return;
        }
        this.moveModeActive = !this.moveModeActive;
        this.movingBuildingUid = null;
        if (this.moveModeActive) {
          this.selectedCatalogItem = null;
          this.bulldozerActive = false;
          this.pincerActive = false;
          this.pincerPicked = null;
          this.inspectSelection = null;
          this.closeSeedTray();
          this.collapseBuildDock();
          this.showToast('Nhấp chọn công trình để di dời miễn phí!', '✋');
        }
        this.refreshAll();
      } else if (e.key === 'b' || e.key === 'B') {
        this.openSuitcaseDialog();
      } else if (e.key === 'j' || e.key === 'J') {
        this.openMatch3Dialog();
      } else if (e.key === 'k' || e.key === 'K') {
        this.openPuzzleArcadeDialog();
      } else if (e.key === 'l' || e.key === 'L') {
        this.openLeaderboardDialog();
      } else if (e.key === 'h' || e.key === 'H') {
        this.toggleHudRollup();
      } else if (e.key === 'p' || e.key === 'P') {
        this.togglePhotoMode();
      } else if (e.key === 'x' || e.key === 'X') {
        if (this.sim.isVisitingNeighbor) {
          this.showToast('Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!', '🏡');
          return;
        }
        this.bulldozerActive = !this.bulldozerActive;
        if (this.bulldozerActive) {
          this.selectedCatalogItem = null;
          this.moveModeActive = false;
          this.movingBuildingUid = null;
          this.pincerActive = false;
          this.pincerPicked = null;
          this.inspectSelection = null;
          this.closeSeedTray();
          this.collapseBuildDock();
        }
        this.refreshAll();
      } else if (e.key === 'Escape') {
        if (this.manageMenuOpen || this.weatherPopoverOpen) {
          this.closeHudPopovers();
          return;
        }
        if (this.photoModeActive) {
          this.togglePhotoMode(false);
          return;
        }
        if (this.sim.isVisitingNeighbor) {
          this.exitVisitFromHud();
          return;
        }
        this.rideCamUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.closeSeedTray();
        this.closePastureTray();
        this.collapseBuildDock();
        this.pendingTouchTile = null;
        this.selectedCatalogItem = null;
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.inspectSelection = null;
        if (this.sim.state.settings.cutawayMode) {
          this.sim.state.settings.cutawayMode = false;
        }
        this.refreshAll();
      } else if (e.key === ' ') {
        this.rideCamUid = null;
        centerCameraOnGrid(this.cam, 16.0, 18.0);
        this.refreshFloatingBanner();
      }
    });
  }

  public showToast(msg: string, icon = '🦉'): void {
    const stack = this.root.querySelector('#toastStack');
    if (!stack) return;
    const item = document.createElement('div');
    item.className = 'parchment-dark owl-toast';
    item.textContent = `${icon} ${msg}`;
    stack.appendChild(item);
    window.setTimeout(() => item.remove(), 3500);
  }

  public showOfflineModal(report: OfflineReport): void {
    const mins = Math.max(1, Math.round(report.awaySeconds / 60));
    const content = this.root.querySelector('#offlineDialogContent')!;
    content.innerHTML = `
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${mins} phút</strong></div>
        <div>🪙 Vàng: <strong>+${report.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${report.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${report.buildingsFinished}</strong></div>
      </div>
    `;
    (this.root.querySelector('#offlineDialog') as HTMLDialogElement).showModal();
  }

  public refreshFloatingBanner(): void {
    const banner = this.root.querySelector('#floatingModeBanner') as HTMLElement | null;
    const txt = this.root.querySelector('#floatingBannerText') as HTMLElement | null;
    const btnSec = this.root.querySelector('#btnFloatingSecondary') as HTMLButtonElement | null;
    const btnSwap = this.root.querySelector('#btnFloatingSwap') as HTMLButtonElement | null;
    const btnExit = this.root.querySelector('#btnFloatingExit') as HTMLButtonElement | null;
    if (!banner || !txt || !btnSec || !btnSwap || !btnExit) return;

    btnSwap.classList.add('hidden');

    if (this.photoModeActive) {
      banner.classList.add('hidden');
      return;
    }

    if (this.rideCamUid) {
      const b = this.sim.state.buildings.find((x) => x.uid === this.rideCamUid);
      const it = b ? getCatalogItem(b.itemId) : undefined;
      if (!b || !it) {
        this.rideCamUid = null;
      } else {
        banner.classList.remove('hidden');
        txt.textContent = `🎥 ${it.name}${this.rideCamSpeedText ? ` • ${this.rideCamSpeedText}` : ''}`;
        btnSec.textContent = '🧭 90°';
        btnSec.classList.remove('hidden');
        btnExit.textContent = '✕';
        return;
      }
    }

    if (this.pincerActive) {
      banner.classList.remove('hidden');
      txt.textContent = this.pincerPicked
        ? `🤏 ${this.pincerPicked.label}`
        : '🤏 Gắp nhân sự';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (this.moveModeActive) {
      banner.classList.remove('hidden');
      if (this.movingBuildingUid) {
        const mb = this.sim.state.buildings.find((x) => x.uid === this.movingBuildingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        txt.textContent = `✋ ${mIt?.name ?? 'Dời chỗ'}`;
        btnSec.textContent = `🔄 ${this.rotation * 90}°`;
        btnSec.classList.remove('hidden');
        btnExit.textContent = '✕';
      } else {
        txt.textContent = '✋ Chọn công trình để dời';
        btnSec.classList.add('hidden');
        btnExit.textContent = '✕';
      }
      return;
    }

    if (this.bulldozerActive) {
      banner.classList.remove('hidden');
      txt.textContent = '🧹 Phá dỡ';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (this.selectedCatalogItem && !this.buildSheetOpen && !this.activeCategory) {
      const it = this.selectedCatalogItem;
      const canRotate =
        it.category !== 'path' &&
        it.category !== 'terrain' &&
        !it.isFarmlandPlot &&
        !it.connectableGroup &&
        !it.isZooFence;
      const effStars = this.sim.getEffectiveItemStarCost(it);
      const costTxt =
        effStars > 0
          ? `🌟 ${effStars}`
          : it.cost === 0
            ? '0G'
            : `${it.cost.toLocaleString('vi-VN')}G`;
      banner.classList.remove('hidden');
      txt.textContent = `🏗️ ${it.name} • ${costTxt}`;
      if (canRotate) {
        btnSec.textContent = `🔄 ${this.rotation * 90}°`;
        btnSec.classList.remove('hidden');
      } else {
        btnSec.classList.add('hidden');
      }
      btnSwap.textContent = '📦 Đổi';
      btnSwap.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (this.activeSeedCropId && !this.seedTrayOpen) {
      const c = FARM_CROPS[this.activeSeedCropId];
      const seedLeft = this.sim.getSeedCount(this.activeSeedCropId);
      banner.classList.remove('hidden');
      txt.textContent = `🌱 ${c.emoji} ${c.name} (${seedLeft})`;
      btnSec.textContent = '🌱 Đổi';
      btnSec.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (this.activePastureAnimalId && !this.pastureTrayOpen) {
      const a = PASTURE_ANIMALS[this.activePastureAnimalId];
      banner.classList.remove('hidden');
      txt.textContent = `🐾 ${a.emoji} ${a.name} (${a.cost.toLocaleString('vi-VN')}G)`;
      btnSec.textContent = '🐾 Đổi';
      btnSec.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (this.sim.state.settings.cutawayMode) {
      banner.classList.remove('hidden');
      txt.textContent = '👁️ Nhìn xuyên';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    banner.classList.add('hidden');
  }

  public openSeedTray(preferredCropId?: FarmCropId, targetPlotUid?: string): void {
    this.collapseBuildDock();
    this.closePastureTray();
    this.selectedCatalogItem = null;
    this.bulldozerActive = false;
    this.moveModeActive = false;
    this.movingBuildingUid = null;
    this.pincerActive = false;
    this.pincerPicked = null;
    this.pendingTouchTile = null;
    this.inspectSelection = null;
    this.pendingSowPlotUid = targetPlotUid ?? null;
    this.seedTrayOpen = true;
    if (preferredCropId) {
      this.activeSeedCropId = preferredCropId;
    }
    this.refreshAll();
  }

  public closeSeedTray(): void {
    this.seedTrayOpen = false;
    this.activeSeedCropId = null;
    this.pendingSowPlotUid = null;
  }

  public toggleSeedTray(): void {
    if (this.seedTrayOpen) {
      this.closeSeedTray();
      this.refreshAll();
    } else {
      this.openSeedTray(this.activeSeedCropId ?? undefined);
    }
  }

  public openPastureTray(preferredAnimalId?: PastureAnimalId, targetPastureUid?: string): void {
    this.collapseBuildDock();
    this.closeSeedTray();
    this.selectedCatalogItem = null;
    this.bulldozerActive = false;
    this.moveModeActive = false;
    this.movingBuildingUid = null;
    this.pincerActive = false;
    this.pincerPicked = null;
    this.pendingTouchTile = null;
    this.inspectSelection = null;
    this.pendingStockPastureUid = targetPastureUid ?? null;
    this.pastureTrayOpen = true;
    if (preferredAnimalId) {
      this.activePastureAnimalId = preferredAnimalId;
    }
    this.refreshAll();
  }

  public closePastureTray(): void {
    this.pastureTrayOpen = false;
    this.activePastureAnimalId = null;
    this.pendingStockPastureUid = null;
  }

  public togglePastureTray(): void {
    if (this.pastureTrayOpen) {
      this.closePastureTray();
      this.refreshAll();
    } else {
      this.openPastureTray(this.activePastureAnimalId ?? undefined);
    }
  }

  public renderSeedTray(): void {
    const tray = this.root.querySelector('#seedBrushTray') as HTMLElement | null;
    const seedBtn = this.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null;
    if (seedBtn) {
      const active = this.seedTrayOpen || Boolean(this.activeSeedCropId);
      seedBtn.dataset.active = String(active);
      seedBtn.setAttribute('aria-pressed', String(active));
    }
    if (!tray) return;

    if (this.photoModeActive || !this.seedTrayOpen) {
      tray.classList.add('hidden');
      this.syncHudFocusVisibility();
      return;
    }
    tray.classList.remove('hidden');
    this.syncHudFocusVisibility();

    const emptyPlotCount = this.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId && Date.now() >= b.constructEndsAt
    ).length;
    const totalPlotCount = this.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFarmlandPlot
    ).length;
    const activeCrop = this.activeSeedCropId ? FARM_CROPS[this.activeSeedCropId] : null;

    const allCrops = Object.values(FARM_CROPS).sort(
      (a, b) => a.unlockLevel - b.unlockLevel || a.growSec - b.growSec
    );
    const flowerCount = allCrops.filter((c) => c.isFlowerCrop).length;
    const harvestCropCount = allCrops.length - flowerCount;
    const filteredCrops = allCrops.filter((c) => {
      if (this.seedFilterMode === 'flowers') return Boolean(c.isFlowerCrop);
      if (this.seedFilterMode === 'crops') return !c.isFlowerCrop;
      return true;
    });
    const filterPillsHtml = (
      [
        { id: 'all', label: `🌱 (${allCrops.length})` },
        { id: 'flowers', label: `🌸 (${flowerCount})` },
        { id: 'crops', label: `🌾 (${harvestCropCount})` },
      ] as const
    )
      .map(
        (f) => `
          <button
            type="button"
            class="seed-filter-pill ${this.seedFilterMode === f.id ? 'active' : ''}"
            data-seed-filter="${f.id}"
            aria-pressed="${this.seedFilterMode === f.id}"
          >${f.label}</button>
        `
      )
      .join('');

    const cardsHtml = filteredCrops
      .map((crop) => {
        const locked = !this.sim.state.sandboxMode && this.sim.state.level < crop.unlockLevel;
        const selected = this.activeSeedCropId === crop.id;
        const seedCount = this.sim.getSeedCount(crop.id);
        const stock = this.sim.getFarmItemCount(crop.id);
        const growLabel = formatDurationCompactVi(crop.growSec);
        return `
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${locked ? 'locked' : ''} ${selected ? 'selected' : ''} ${!locked && seedCount <= 0 ? 'out-of-seeds' : ''}"
              data-seed-brush="${crop.id}"
              aria-pressed="${selected}"
              ${locked ? 'disabled' : ''}
            >
              <img src="${getFarmItemIconSrc(crop.id)}" alt="${escapeHtml(crop.name)}" class="seed-card-img" />
              <span class="seed-card-name">${escapeHtml(crop.name)}</span>
              <span class="seed-card-seed-badge ${seedCount > 0 ? 'has-seed' : 'no-seed'}">
                ${
                  locked
                    ? `🔒 Cấp ${crop.unlockLevel}`
                    : seedCount > 0
                      ? `🌱 ${seedCount}`
                      : `🪄 0G`
                }
              </span>
              <span class="seed-card-meta">
                ${locked ? `⏱️ ${growLabel}` : `⏱️ ${growLabel} • 🪙${crop.seedCost.toLocaleString('vi-VN')}G`}
              </span>
              <span class="seed-card-stock">📦 ${stock}</span>
            </button>
            ${
              !locked
                ? `<button type="button" class="seed-card-add-btn" data-acquire-seed="${crop.id}" aria-label="Nạp hạt ${escapeHtml(crop.name)}" title="Mua hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')}G) hoặc Đố 0G">+</button>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    tray.innerHTML = `
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${
              activeCrop
                ? `🌱 <strong>${escapeHtml(activeCrop.name)}</strong> (${this.sim.getSeedCount(activeCrop.id)})`
                : '🌱 Hạt Giống & Hoa'
            }
          </div>
          <div class="seed-tray-sub" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:3px;">
            <span>Ô trống: <strong>${emptyPlotCount}/${totalPlotCount}</strong></span>
            <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${filterPillsHtml}</div>
          </div>
        </div>
        <div class="seed-tray-actions">
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Mua Hạt hoặc Đố Ngoại Ngữ 0G">
            🪄 Hạt 0G
          </button>
          <button id="btnSeedTrayBuyPlot" type="button" class="brass-btn gold-cta" title="Đặt thêm Thửa Đất (30G)">
            + Đất 30G
          </button>
          <button id="btnSeedTrayBuyFlowerGarden" type="button" class="brass-btn" title="Đặt Ô Vườn Hoa (55G)">
            🌸 + Vườn 55G
          </button>
          <button id="btnSeedTrayOpenBarn" type="button" class="brass-btn" title="Mở Kho">
            📦 Kho
          </button>
          <button id="btnCloseSeedTray" type="button" class="brass-btn" aria-label="Đóng túi hạt giống">✕</button>
        </div>
      </div>
      <div class="seed-tray-scroll">${cardsHtml}</div>
    `;

    tray.querySelectorAll<HTMLButtonElement>('[data-seed-filter]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const f = btn.dataset.seedFilter as 'all' | 'flowers' | 'crops';
        if (f === 'all' || f === 'flowers' || f === 'crops') {
          this.seedFilterMode = f;
          this.renderSeedTray();
        }
      });
    });

    tray.querySelectorAll<HTMLButtonElement>('[data-acquire-seed]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const cid = btn.dataset.acquireSeed as FarmCropId;
        const targetPlotUid =
          this.pendingSowPlotUid ??
          (this.inspectSelection?.kind === 'building' ? this.inspectSelection.uid : null);
        this.seedTrayOpen = false;
        this.pendingSowPlotUid = null;
        this.inspectSelection = null;
        this.refreshAll();
        this.openSeedQuizDialog(cid, targetPlotUid);
      });
    });

    tray.querySelector('#btnSeedTrayOpenQuiz')?.addEventListener('click', () => {
      const targetPlotUid =
        this.pendingSowPlotUid ??
        (this.inspectSelection?.kind === 'building' ? this.inspectSelection.uid : null);
      const preferred = this.activeSeedCropId ?? 'ottery_wheat';
      this.seedTrayOpen = false;
      this.pendingSowPlotUid = null;
      this.inspectSelection = null;
      this.refreshAll();
      this.openSeedQuizDialog(preferred, targetPlotUid);
    });

    tray.querySelectorAll<HTMLButtonElement>('[data-seed-brush]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.seedBrush as FarmCropId;
        const c = FARM_CROPS[cid];

        const targetPlotUid =
          this.pendingSowPlotUid ??
          (this.inspectSelection?.kind === 'building' ? this.inspectSelection.uid : null);

        if (this.sim.getSeedCount(cid) <= 0) {
          this.activeSeedCropId = cid;
          this.pendingSowPlotUid = null;
          this.seedTrayOpen = false;
          this.inspectSelection = null;
          this.refreshAll();
          this.openSeedQuizDialog(cid, targetPlotUid);
          return;
        }

        this.activeSeedCropId = cid;
        this.pendingSowPlotUid = null;
        this.seedTrayOpen = false;
        this.inspectSelection = null;

        if (targetPlotUid) {
          const selB = this.sim.state.buildings.find((x) => x.uid === targetPlotUid);
          if (selB && getCatalogItem(selB.itemId)?.isFarmlandPlot && !selB.cropId) {
            const res = this.sim.plantCropOnPlot(selB.uid, cid);
            if (res.needSeedAcquire) {
              this.refreshAll();
              this.openSeedQuizDialog(cid, selB.uid);
              return;
            }
            this.showToast(res.msg, res.ok ? '🌱' : '🪙');
            this.refreshAll();
            return;
          }
        }

        this.refreshAll();
        this.showToast(
          `🌱 Đã chọn ${c.emoji} ${c.name} (Túi có ${this.sim.getSeedCount(cid)} hạt) — Nhấp hoặc kéo lướt qua các Thửa Đất trống để gieo!`,
          c.emoji
        );
      });
    });

    tray.querySelector('#btnSeedTrayBuyPlot')?.addEventListener('click', () => {
      const plotItem = getCatalogItem('farmland_plot');
      if (!plotItem) return;
      this.closeSeedTray();
      this.collapseBuildDock();
      this.inspectSelection = null;
      this.selectedCatalogItem = plotItem;
      this.refreshAll();
      this.showToast('🌾 Nhấp hoặc kéo trên bãi cỏ để đặt thêm Thửa Đất Canh Tác (30G)!', '🌱');
    });

    tray.querySelector('#btnSeedTrayBuyFlowerGarden')?.addEventListener('click', () => {
      const gardenItem = getCatalogItem('burrow_flower_garden');
      if (!gardenItem) return;
      this.closeSeedTray();
      this.collapseBuildDock();
      this.inspectSelection = null;
      this.selectedCatalogItem = gardenItem;
      this.refreshAll();
      this.showToast('🌸 Nhấp hoặc kéo cạnh nhau để ghép liền Ô Vườn Hoa Cảnh Hang Sóc (55G)!', '🌸');
    });

    tray.querySelector('#btnSeedTrayOpenBarn')?.addEventListener('click', () => {
      this.seedTrayOpen = false;
      this.pendingSowPlotUid = null;
      this.refreshAll();
      this.openWorkshopDialog('barn');
    });

    tray.querySelector('#btnCloseSeedTray')?.addEventListener('click', () => {
      this.closeSeedTray();
      this.refreshAll();
    });
  }

  public renderPastureTray(): void {
    const tray = this.root.querySelector('#pastureBrushTray') as HTMLElement | null;
    const pastureBtn = this.root.querySelector('#btnOpenPastureTray') as HTMLElement | null;
    if (pastureBtn) {
      const active = this.pastureTrayOpen || Boolean(this.activePastureAnimalId);
      pastureBtn.dataset.active = String(active);
      pastureBtn.setAttribute('aria-pressed', String(active));
    }
    if (!tray) return;

    if (this.photoModeActive || !this.pastureTrayOpen) {
      tray.classList.add('hidden');
      this.syncHudFocusVisibility();
      return;
    }
    tray.classList.remove('hidden');
    this.syncHudFocusVisibility();

    const emptyPastureCount = this.sim.state.buildings.filter(
      (b) =>
        getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
        !b.pastureAnimalId &&
        Date.now() >= b.constructEndsAt
    ).length;
    const totalPastureCount = this.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot
    ).length;
    const activeAnimal = this.activePastureAnimalId
      ? PASTURE_ANIMALS[this.activePastureAnimalId]
      : null;

    const cardsHtml = Object.values(PASTURE_ANIMALS)
      .map((animal) => {
        const locked = !this.sim.state.sandboxMode && this.sim.state.level < animal.unlockLevel;
        const selected = this.activePastureAnimalId === animal.id;
        const prodMeta = animal.goodId ? getFarmItemMeta(animal.goodId) : null;
        return `
          <div class="seed-card-slot">
            <button
              type="button"
              class="seed-card seed-tray-card ${locked ? 'locked' : ''} ${selected ? 'selected' : ''}"
              data-pasture-brush="${animal.id}"
              aria-pressed="${selected}"
              ${locked ? 'disabled' : ''}
            >
              <img src="/sprites/${animal.spritePair[0]}.png" alt="${escapeHtml(animal.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${escapeHtml(animal.name)}</span>
              <span class="seed-card-seed-badge ${locked ? 'no-seed' : 'has-seed'}">
                ${
                  locked
                    ? `🔒 Cấp ${animal.unlockLevel}`
                    : `🪙 ${animal.cost.toLocaleString('vi-VN')}G`
                }
              </span>
              <span class="seed-card-meta">
                ⏱️${formatDurationCompactVi(animal.cycleSec)} • +${animal.sellValue}G
              </span>
              <span class="seed-card-stock">
                ${prodMeta ? `+${animal.yieldQty} ${escapeHtml(prodMeta.name)}` : ''}
              </span>
            </button>
          </div>
        `;
      })
      .join('');

    tray.innerHTML = `
      <div class="seed-tray-header">
        <div class="seed-tray-title-wrap">
          <div class="seed-tray-title">
            ${
              activeAnimal
                ? `🐾 <strong>${escapeHtml(activeAnimal.name)}</strong> (${activeAnimal.cost.toLocaleString('vi-VN')}G)`
                : '🐾 Chăn Thả'
            }
          </div>
          <div class="seed-tray-sub">
            Ô trống: <strong>${emptyPastureCount}/${totalPastureCount}</strong>
          </div>
        </div>
        <div class="seed-tray-actions">
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn gold-cta" title="Đặt thêm Đồng Cỏ (45G)">
            🐾 + Đồng Cỏ 45G
          </button>
          <button id="btnPastureTrayOpenBarn" type="button" class="brass-btn" title="Mở Kho">
            📦 Kho
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${cardsHtml}</div>
    `;

    tray.querySelectorAll<HTMLButtonElement>('[data-pasture-brush]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const aid = btn.dataset.pastureBrush as PastureAnimalId;
        const a = PASTURE_ANIMALS[aid];
        if (!a) return;

        const targetPastureUid =
          this.pendingStockPastureUid ??
          (this.inspectSelection?.kind === 'building' ? this.inspectSelection.uid : null);

        this.activePastureAnimalId = aid;
        this.pendingStockPastureUid = null;
        this.pastureTrayOpen = false;
        this.inspectSelection = null;

        if (targetPastureUid) {
          const selB = this.sim.state.buildings.find((x) => x.uid === targetPastureUid);
          if (selB && getCatalogItem(selB.itemId)?.isAnimalPasturePlot && !selB.pastureAnimalId) {
            const res = this.sim.stockAnimalOnPasture(selB.uid, aid);
            this.showToast(res.msg, res.ok ? a.emoji : '🪙');
            this.refreshAll();
            return;
          }
        }

        this.refreshAll();
        this.showToast(
          `🐾 Đang dẫn ${a.emoji} ${a.name} (${a.cost.toLocaleString('vi-VN')}G/ô) — Nhấp hoặc kéo lướt qua Đồng Cỏ Chăn Thả trống để thả!`,
          a.emoji
        );
      });
    });

    tray.querySelector('#btnPastureTrayBuyPlot')?.addEventListener('click', () => {
      const pastureItem = getCatalogItem('burrow_animal_pasture');
      if (!pastureItem) return;
      this.closePastureTray();
      this.collapseBuildDock();
      this.inspectSelection = null;
      this.selectedCatalogItem = pastureItem;
      this.refreshAll();
      this.showToast('🐾 Nhấp hoặc kéo cạnh nhau trên bãi cỏ để ghép liền Đồng Cỏ Chăn Thả (45G)!', '🐾');
    });

    tray.querySelector('#btnPastureTrayOpenBarn')?.addEventListener('click', () => {
      this.pastureTrayOpen = false;
      this.pendingStockPastureUid = null;
      this.refreshAll();
      this.openWorkshopDialog('barn');
    });

    tray.querySelector('#btnClosePastureTray')?.addEventListener('click', () => {
      this.closePastureTray();
      this.refreshAll();
    });
  }

  public refreshTouchConfirmBar(): void {
    const bar = this.root.querySelector('#touchConfirmBar') as HTMLElement | null;
    const lbl = this.root.querySelector('#lblTouchConfirm') as HTMLElement | null;
    if (!bar || !lbl) return;
    if (this.photoModeActive || !this.pendingTouchTile) {
      bar.classList.add('hidden');
      return;
    }
    bar.classList.remove('hidden');
    lbl.textContent = `📍 ${this.pendingTouchTile.label}`;
  }

  public refreshAll(): void {
    const isVisiting = this.sim.isVisitingNeighbor;
    if (isVisiting) {
      this.inspectSelection = null;
      this.seedTrayOpen = false;
      this.activeSeedCropId = null;
      this.pendingSowPlotUid = null;
      this.pastureTrayOpen = false;
      this.activePastureAnimalId = null;
      this.pendingStockPastureUid = null;
    }
    this.refreshHeader();
    this.refreshQuestTracker();
    this.refreshDock();
    this.renderSeedTray();
    this.renderPastureTray();
    this.renderVisitorDockBar();
    this.root
      .querySelector('#bottomDockWrap')
      ?.classList.toggle('hidden', this.photoModeActive || isVisiting);
    this.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle('hidden', this.photoModeActive || isVisiting);
    this.root
      .querySelector('#btnOpenSeedSilo')
      ?.classList.toggle('hidden', isVisiting);
    this.root
      .querySelector('#btnOpenPastureTray')
      ?.classList.toggle('hidden', isVisiting);
    this.root
      .querySelector('#btnOpenHarvestFeast')
      ?.classList.toggle('hidden', isVisiting);
    this.refreshHarvestFeastBadges();
    const feastDlg = this.root.querySelector('#harvestFeastDialog') as HTMLDialogElement | null;
    if (feastDlg?.open) {
      this.renderHarvestFeastDialog();
    }
    if (document.activeElement?.id !== 'inpBuildingPrice') {
      this.renderInspector();
    }
    this.refreshFloatingBanner();
    this.refreshTouchConfirmBar();
    this.syncHudFocusVisibility();
    this.renderTutorialCoach();
  }

  private refreshHeaderClock(): void {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const period = this.sim.getRealTimePeriod(now);
    const weather = this.sim.getCurrentWeather(now.getTime());
    const periodNames: Record<string, string> = {
      dawn: 'Bình Minh',
      day: 'Ban Ngày',
      dusk: 'Hoàng Hôn',
      night: 'Đêm Sao',
    };
    const lblClock = this.root.querySelector('#lblClock') as HTMLElement | null;
    if (lblClock) {
      const speedBadge = this.sim.simSpeed === 2 ? ' <span class="speed-mini-tag">2×</span>' : '';
      lblClock.innerHTML = `${weather.icon} <span>${hh}:${mm}</span>${speedBadge}`;
    }
    if (this.weatherPopoverOpen) {
      this.renderWeatherPopover();
    }

    const fest = this.sim.getActiveFestival(now);
    const lblFest = this.root.querySelector('#lblFestival') as HTMLElement | null;
    if (lblFest) {
      if (fest === 'halloween') {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🎃 +35% XP';
      } else if (fest === 'christmas') {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🎄 +25% 🪙';
      } else if (fest === 'quidditch_cup') {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🏆 +Cúp';
      } else {
        lblFest.classList.add('hidden');
      }
    }

    // Live Match-3 Hearts regeneration readout in top HUD
    this.sim.tickMatch3Hearts(Date.now());
    const st = this.sim.state;
    const lblHearts = this.root.querySelector('#lblPuzzleHearts') as HTMLElement | null;
    if (lblHearts && st.match3) {
      if (st.sandboxMode) {
        lblHearts.textContent = '∞';
      } else if (st.match3.hearts >= MAX_MATCH3_HEARTS) {
        lblHearts.textContent = `${st.match3.hearts}/${MAX_MATCH3_HEARTS}`;
      } else {
        const leftSec = Math.max(0, Math.ceil((st.match3.nextHeartAt - Date.now()) / 1000));
        const m = Math.floor(leftSec / 60);
        const s = String(leftSec % 60).padStart(2, '0');
        lblHearts.textContent = `${st.match3.hearts} (${m}:${s})`;
      }
    }

    // Live Real-Time Construction Countdown Chip in Top HUD
    const btnBuilds = this.root.querySelector('#btnHudActiveBuilds') as HTMLElement | null;
    const lblBuilds = this.root.querySelector('#lblActiveBuilds') as HTMLElement | null;
    if (btnBuilds && lblBuilds) {
      const actives = this.sim.getActiveConstructions(Date.now());
      if (actives.length === 0) {
        btnBuilds.classList.add('hidden');
      } else {
        btnBuilds.classList.remove('hidden');
        const nextLeft = Math.max(1, Math.ceil((actives[0].constructEndsAt - Date.now()) / 1000));
        lblBuilds.textContent = `${actives.length} (${formatDurationCountdownVi(nextLeft)})`;
      }
    }
  }

  public refreshHeader(): void {
    const st = this.sim.state;
    const reqTrial = this.sim.getRequiredLevelTrial();
    const chestXp = Math.max(0, st.xp) % FARM_HARVEST_CHEST_XP;
    const pct = Math.max(6, Math.min(100, (chestXp / FARM_HARVEST_CHEST_XP) * 100));

    (this.root.querySelector('#lblLevelNum') as HTMLElement).textContent = String(st.level);
    (this.root.querySelector('#lblTitle') as HTMLElement).textContent =
      (this.sim.isHeadmasterPreview ? '🔮 [Xem Thử] ' : '') + getPlayerTitle(st.level);
    (this.root.querySelector('#barXpFill') as HTMLElement).style.width = `${pct}%`;
    const xpShell = this.root.querySelector('#xpBarShell') as HTMLElement | null;
    xpShell?.classList.remove('trial-waiting');

    const lblRibbon = this.root.querySelector('#lblParkRibbonName') as HTMLElement | null;
    if (lblRibbon) {
      const visitingNb = this.sim.getActiveVisitingNeighbor();
      lblRibbon.textContent = visitingNb
        ? `🚂 Thăm: ${visitingNb.avatarEmoji} ${visitingNb.parkName}`
        : st.parkName || 'Trang Trại Hang Sóc';
    }
    this.refreshNeighborBadges();
    const winsProg = this.sim.getWinsProgressForCurrentLevel();
    const towerProg = this.sim.getTotalTowerClearedStages();
    const barLvlTop = this.root.querySelector('#barLevelTopFill') as HTMLElement | null;
    if (barLvlTop) {
      const lvPct =
        st.level >= MAX_LEVEL
          ? 100
          : Math.min(
              100,
              Math.max(8, Math.round((winsProg.current / Math.max(1, winsProg.required)) * 100))
            );
      barLvlTop.style.width = `${lvPct}%`;
      if (barLvlTop.parentElement) {
        barLvlTop.parentElement.title =
          st.level >= MAX_LEVEL
            ? `👑 Đã đạt Cấp Tối Đa ${MAX_LEVEL} • Tháp 5 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`
            : `Cấp Giải Đố ${st.level} → ${st.level + 1}: Đã thắng ${winsProg.current}/${winsProg.required} màn mới • Tháp 5 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`;
      }
    }
    const lblXpFrac = this.root.querySelector('#lblXpFraction') as HTMLElement | null;
    if (lblXpFrac) {
      lblXpFrac.textContent = `🎁 ${chestXp}/${FARM_HARVEST_CHEST_XP}`;
    }
    const barn = this.sim.ensureFarmBarn();
    const barnUsed = this.sim.getBarnTotalUsed();
    const lblBarn = this.root.querySelector('#lblStorageBarn') as HTMLElement | null;
    if (lblBarn) {
      lblBarn.textContent = `${barnUsed}/${barn.capacity}`;
    }

    this.animateGalleonsTo(st.galleons);
    const starsStr = st.sandboxMode ? '∞' : String(st.match3?.stars ?? 0);
    const lblStars = this.root.querySelector('#lblPuzzleStars') as HTMLElement | null;
    if (lblStars && st.match3) {
      lblStars.textContent = starsStr;
    }
    const lblHubStars = this.root.querySelector('#lblHudHubStars') as HTMLElement | null;
    if (lblHubStars) {
      lblHubStars.textContent = starsStr;
    }
    const lblHubTrial = this.root.querySelector('#lblHudHubTrial') as HTMLElement | null;
    if (lblHubTrial) {
      if (st.level >= MAX_LEVEL || st.sandboxMode || this.sim.isHeadmasterPreview || !reqTrial) {
        lblHubTrial.textContent = `♟️ ${towerProg.cleared}/${towerProg.total}`;
      } else {
        lblHubTrial.textContent = `🔥 ${reqTrial.icon} ${winsProg.current}/${winsProg.required}`;
      }
    }
    this.root.querySelector('#btnHudMinigameHub')?.classList.remove('trial-urgent');

    // Update Bottom-Right Gardenscapes Play CTA + Build Ready Badge
    const lblCornerStage = this.root.querySelector('#lblCornerPlayStage') as HTMLElement | null;
    if (lblCornerStage) {
      lblCornerStage.textContent =
        st.level >= MAX_LEVEL
          ? `▶️ ${towerProg.cleared}/${towerProg.total}`
          : `▶️ Cấp ${st.level + 1}`;
    }
    const badgeCornerBonus = this.root.querySelector('#badgeCornerPlayBonus') as HTMLElement | null;
    if (badgeCornerBonus) {
      if (reqTrial && !st.sandboxMode && !this.sim.isHeadmasterPreview && st.level < MAX_LEVEL) {
        badgeCornerBonus.textContent = `🔥${reqTrial.icon}+🌟`;
        badgeCornerBonus.classList.remove('hidden');
      } else {
        badgeCornerBonus.classList.add('hidden');
      }
    }
    const badgeBuildReady = this.root.querySelector('#badgeBuildReadyCount') as HTMLElement | null;
    if (badgeBuildReady) {
      const builtSet = new Set(st.buildings.map((b) => b.itemId));
      const curStars = st.sandboxMode ? 999 : (st.match3?.stars ?? 0);
      const readyUnbuiltBlueprints = CATALOG.filter((c) => {
        if (c.isThemeParkLegacy) return false;
        const sc = getItemPuzzleStarCost(c);
        if (sc <= 0) return false;
        if (!st.sandboxMode && st.level < c.unlockLevel) return false;
        return !builtSet.has(c.id) && curStars >= sc;
      }).length;
      if (readyUnbuiltBlueprints > 0 && !this.sim.isHeadmasterPreview) {
        badgeBuildReady.textContent = String(readyUnbuiltBlueprints);
        badgeBuildReady.classList.remove('hidden');
      } else {
        badgeBuildReady.classList.add('hidden');
      }
    }
    const m3Info = this.sim.getDisciplineStageInfo('match3');
    const lblM3Lv = this.root.querySelector('#lblMatch3Lv') as HTMLElement | null;
    if (lblM3Lv && st.match3) {
      lblM3Lv.textContent = m3Info.isMaxed
        ? `👑${MAX_MINIGAME_STAGE}`
        : `${m3Info.currentStage}/${MAX_MINIGAME_STAGE}`;
    }
    const lblArcadeTower = this.root.querySelector('#lblArcadeTowerLv') as HTMLElement | null;
    if (lblArcadeTower) {
      const arcadeCleared = Math.max(0, towerProg.cleared - m3Info.clearedStages);
      const arcadeTotal = MAX_MINIGAME_STAGE * 4;
      lblArcadeTower.textContent =
        arcadeCleared >= arcadeTotal ? `👑${arcadeTotal}` : `${arcadeCleared}/${arcadeTotal}`;
    }
    (this.root.querySelector('#lblSand') as HTMLElement).textContent = st.sandboxMode ? '∞' : String(st.timeSand);
    (this.root.querySelector('#lblWonder') as HTMLElement).textContent = this.sim.getParkWonderScore().toFixed(1);

    const story = this.sim.getActiveStoryQuest();
    const readyOwlCount = this.sim.getReadyOwlOrdersCount();
    const readyQuestCount =
      (story?.completed ? 1 : 0) +
      st.owlQuests.filter((q) => q.completed && !q.claimed).length +
      st.dailyQuests.filter((q) => q.completed && !q.claimed).length;
    const totalReady = readyOwlCount + readyQuestCount;
    const shownQuestCount = totalReady > 0 ? totalReady : barn.owlOrders.length;

    const badge = this.root.querySelector('#badgeQuestCount') as HTMLElement;
    if (shownQuestCount > 0) {
      badge.textContent = String(shownQuestCount);
      badge.classList.toggle('is-ready-green', readyOwlCount > 0);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }

    // Workshop & Cargo Train ready badge
    const crateReadyCount = st.supply.cargoCrates.filter(
      (c) => !c.fulfilled && (st.sandboxMode || (st.supply.goods[c.goodId] ?? 0) >= c.qtyRequired)
    ).length;
    const wsBadge = this.root.querySelector('#badgeWorkshopCount') as HTMLElement | null;
    if (wsBadge) {
      if (crateReadyCount > 0) {
        wsBadge.textContent = String(crateReadyCount);
        wsBadge.classList.remove('hidden');
      } else {
        wsBadge.classList.add('hidden');
      }
    }

    // House Cup reward ready badge
    const totalHousePts = Object.values(st.housePoints).reduce((a, b) => a + b, 0);
    const cupReady = totalHousePts >= st.houseCupMilestoneTier * 300;
    const cardBadge = this.root.querySelector('#badgeCardCount') as HTMLElement;
    cardBadge.classList.toggle('hidden', !cupReady);

    const manageDot = this.root.querySelector('#badgeManageMenuDot') as HTMLElement | null;
    if (manageDot) {
      const manageCount = crateReadyCount + (cupReady ? 1 : 0);
      if (manageCount > 0) {
        manageDot.textContent = String(manageCount);
        manageDot.classList.remove('hidden');
      } else {
        manageDot.classList.add('hidden');
      }
    }

    this.refreshSuitcaseBadge();
    this.syncProgressiveHudVisibility();
    this.refreshHeaderClock();

    // Sync Heatmap button label & active highlight
    const btnHm = this.root.querySelector('#btnCycleHeatmap') as HTMLButtonElement | null;
    if (btnHm) {
      const hmEntry = HEATMAP_CYCLE.find((h) => h.mode === this.sim.heatmapMode) ?? HEATMAP_CYCLE[0];
      const hmActive = this.sim.heatmapMode !== 'none';
      btnHm.textContent = hmEntry.label;
      btnHm.dataset.active = String(hmActive);
      btnHm.setAttribute('aria-pressed', String(hmActive));
    }

    this.refreshHeaderClock();
  }

  private syncProgressiveHudVisibility(): void {
    const st = this.sim.state;
    const isEarlyOnboarding = st.level < 3 && !st.sandboxMode && !this.sim.isHeadmasterPreview;
    const ownsHabitat = st.buildings.some((b) => Boolean(getCatalogItem(b.itemId)?.isCreatureHabitat));
    const heartsFull = (st.match3?.hearts ?? MAX_MATCH3_HEARTS) >= MAX_MATCH3_HEARTS && !st.sandboxMode;
    const hasActiveBuilds = this.sim.getActiveConstructions(Date.now()).length > 0;

    // Zen Sky HUD: hide full-heart badge inside manage strip when full
    this.root.querySelector('#btnHudHeartChip')?.classList.toggle('hidden', heartsFull);
    void hasActiveBuilds;
    this.root.querySelector('#btnOpenPuzzleArcade')?.classList.remove('hidden');

    this.root
      .querySelector('#btnOpenSuitcase')
      ?.classList.toggle('hidden', isEarlyOnboarding && !ownsHabitat);
    this.root
      .querySelector('[data-cat="staff"]')
      ?.classList.toggle('hidden', isEarlyOnboarding && this.activeCategory !== 'staff');

    // Auto-expand radar when entering Lv100 preview if still untouched
    if (this.sim.isHeadmasterPreview && this.minimapCollapsed) {
      this.minimapCollapsed = false;
      this.minimapHudVisible = true;
      this.minimapCanvas?.classList.remove('hidden');
      const btnMini = this.root.querySelector('#btnToggleMinimap');
      if (btnMini) {
        btnMini.textContent = '–';
        btnMini.setAttribute('aria-expanded', 'true');
      }
    }
  }

  public refreshQuestTracker(): void {
    const body = this.root.querySelector('#questTrackerBody') as HTMLElement;
    if (!body) return;

    const st = this.sim.state;
    const reqTrial = this.sim.getRequiredLevelTrial();
    const trialDone = this.sim.isCurrentLevelTrialPassed();
    const waitingTrial = this.sim.isWaitingOnLevelTrial();
    const story = this.sim.getActiveStoryQuest();
    const owls = st.owlQuests.slice(0, 2);

    let html = '';
    if (reqTrial && !st.sandboxMode && !this.sim.isHeadmasterPreview) {
      const wp = this.sim.getWinsProgressForCurrentLevel();
      const dInfo = this.sim.getDisciplineStageInfo(reqTrial.kind);
      html += `
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:800;">
            <span>🔥 ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)} (${dInfo.currentStage}/${MAX_MINIGAME_STAGE}) • ${wp.current}/${wp.required}</span>
            <button type="button" data-open-trial="${reqTrial.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `;
    }
    if (story) {
      const pct = Math.min(100, Math.round((story.progress / Math.max(1, story.targetAmount)) * 100));
      const autoAct = this.sim.getStoryAutoActionPreview();
      html += `
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:800;color:var(--ink);">${escapeHtml(story.giverEmoji)} ${escapeHtml(story.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(story.progress, story.targetAmount)}/${story.targetAmount}</span>
            ${
              story.completed
                ? `<button type="button" data-claim="${escapeHtml(story.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${story.rewardGalleons}G</button>`
                : `<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:11.5px;" title="${escapeHtml(autoAct.longLabel)}">${escapeHtml(autoAct.shortLabel)}</button>`
            }
          </div>
        </div>
      `;
    }

    for (const q of owls) {
      const pct = Math.min(100, Math.round((q.progress / Math.max(1, q.targetAmount)) * 100));
      html += `
        <div class="quest-card-mini">
          <div style="font-size:12px;font-weight:700;">${escapeHtml(q.giverEmoji)} ${escapeHtml(q.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:12px;">
            <span>${Math.min(q.progress, q.targetAmount)}/${q.targetAmount}</span>
            ${
              q.completed
                ? `<button type="button" data-claim="${escapeHtml(q.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 Nhận</button>`
                : `<span>+${q.rewardGalleons}🪙 +${q.rewardXp}⭐</span>`
            }
          </div>
        </div>
      `;
    }

    body.innerHTML = html;
    body.querySelectorAll<HTMLButtonElement>('[data-claim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sim.claimQuest(btn.dataset.claim!);
      });
    });
    body.querySelectorAll<HTMLButtonElement>('[data-open-trial]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.openTrialMinigame(btn.dataset.openTrial as MinigameTrialKind | undefined);
      });
    });
    body.querySelectorAll<HTMLButtonElement>('[data-star-story]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.completeStoryStepWithStar();
        if (res.ok) {
          if (typeof res.placedGx === 'number' && typeof res.placedGy === 'number') {
            centerCameraOnGrid(this.cam, res.placedGx, res.placedGy);
          }
          return;
        }
        this.showToast(res.msg, res.reason === 'missing_gold' ? '🪙' : '🌟');
        if (
          res.reason === 'missing_stars' ||
          res.reason === 'locked_level' ||
          res.reason === 'open_match3'
        ) {
          this.openTrialMinigame();
        }
      });
    });
  }

  public refreshDock(): void {
    const syncToggle = (el: HTMLElement | null, active: boolean) => {
      if (!el) return;
      el.setAttribute('data-active', String(active));
      el.setAttribute('aria-pressed', String(active));
    };

    this.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      syncToggle(btn, btn.dataset.cat === this.activeCategory);
    });
    syncToggle(this.root.querySelector('#btnPincerTool') as HTMLElement | null, this.pincerActive);
    syncToggle(this.root.querySelector('#btnMoveTool') as HTMLElement | null, this.moveModeActive);
    syncToggle(this.root.querySelector('#btnBulldoze') as HTMLElement | null, this.bulldozerActive);
    const btnRotCam = this.root.querySelector('#btnRotateCam') as HTMLButtonElement | null;
    if (btnRotCam) {
      const vr = this.cam.viewRot ?? 0;
      btnRotCam.textContent = COMPASS_LABELS_VI[vr];
      syncToggle(btnRotCam, vr !== 0);
    }
    syncToggle(
      this.root.querySelector('#btnCutaway') as HTMLElement | null,
      Boolean(this.sim.state.settings.cutawayMode)
    );
    syncToggle(this.root.querySelector('#btnGrid') as HTMLElement | null, this.sim.state.settings.showGrid);

    const secToolsActive = this.mapToolsExpanded || Boolean(this.activeCategory);
    const secBar = this.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    const btnMapTools = this.root.querySelector('#btnToggleMapTools') as HTMLButtonElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !secToolsActive);
    }
    if (btnMapTools) {
      btnMapTools.setAttribute('aria-expanded', String(secToolsActive));
      syncToggle(btnMapTools, secToolsActive);
    }

    const isSheetActive =
      this.buildSheetOpen || Boolean(this.activeCategory) || this.mapToolsExpanded;
    const isBuildModeActive =
      isSheetActive ||
      Boolean(this.selectedCatalogItem) ||
      this.moveModeActive ||
      this.bulldozerActive ||
      this.pincerActive;
    const dockWrap = this.root.querySelector('#bottomDockWrap') as HTMLElement | null;
    dockWrap?.classList.toggle('ts-dock-open', isSheetActive);
    syncToggle(
      this.root.querySelector('#btnToggleBuildDock') as HTMLElement | null,
      isBuildModeActive
    );

    const drawer = this.root.querySelector('#buildDrawer') as HTMLElement;
    const minimap = this.root.querySelector('#minimapWrap') as HTMLElement;
    if (!this.activeCategory || !BUILD_HUD_CATEGORIES.includes(this.activeCategory)) {
      this.activeCategory = null;
      drawer.classList.add('hidden');
      minimap.classList.toggle('hidden', this.photoModeActive || !this.minimapHudVisible);
      return;
    }
    drawer.classList.remove('hidden');
    minimap.classList.add('hidden'); // Give full room while build drawer is open!

    if (this.activeCategory === 'staff') {
      this.renderStaffDrawer(drawer);
      return;
    }

    const items = CATALOG.filter(
      (c) =>
        c.category === this.activeCategory &&
        c.category !== 'terrain' &&
        !c.isThemeParkLegacy
    );
    const lv = this.sim.state.level;
    const sandbox = this.sim.state.sandboxMode;

    drawer.innerHTML = items
      .map((item) => {
        const locked = !sandbox && lv < item.unlockLevel;
        const selected = this.selectedCatalogItem?.id === item.id;
        const fallbackEmoji = item.elevationDelta
          ? item.elevationDelta > 0
            ? '⛰️'
            : '⛏️'
          : item.isCoasterTrackPiece
            ? '🛤️'
            : item.isZooFence
              ? '🚧'
              : item.isBench
                ? '🪑'
                : item.category === 'path'
                  ? '🛣️'
                  : item.category === 'terrain'
                    ? '🌿'
                    : '🕯️';
        const imgTag = item.spriteKey
          ? `<img src="/sprites/${item.spriteKey}.png" alt="${item.name}" class="catalog-card-img" />`
          : `<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${fallbackEmoji}</div>`;

        const starCost = this.sim.getEffectiveItemStarCost(item);
        const buildTag =
          item.buildDurationSec > 0
            ? `🔨 ${formatDurationCompactVi(item.buildDurationSec)}`
            : '⚡';
        const subInfo = locked
          ? `🔒 Cấp ${item.unlockLevel}`
          : starCost > 0
            ? `🌟 ${starCost} • ${buildTag}`
            : `🪙 ${item.cost.toLocaleString('vi-VN')}G`;

        return `
          <button
            type="button"
            class="catalog-card ${locked ? 'locked' : ''}"
            data-item-id="${item.id}"
            data-selected="${selected}"
            aria-pressed="${selected}"
            ${locked ? 'aria-disabled="true"' : ''}
          >
            ${imgTag}
            <div style="font-size:12px;font-weight:800;line-height:1.25;">${escapeHtml(item.name)}</div>
            <div style="font-size:12px;color:#78350f;font-weight:700;">${subInfo}</div>
          </button>
        `;
      })
      .join('');

    drawer.querySelectorAll<HTMLElement>('[data-item-id]').forEach((card) => {
      card.addEventListener('click', () => {
        const item = getCatalogItem(card.dataset.itemId!);
        if (!item) return;
        if (!this.sim.state.sandboxMode && this.sim.state.level < item.unlockLevel) {
          const wp = this.sim.getWinsProgressForCurrentLevel();
          let winsNeeded = Math.max(1, wp.required - wp.current);
          for (let l = this.sim.state.level + 1; l < item.unlockLevel; l++) {
            winsNeeded += getWinsRequiredForNextLevel(l);
          }
          this.showToast(
            `🔒 Bản vẽ "${item.name}" mở ở Cấp Giải Đố ${item.unlockLevel} — Cần thắng thêm ${winsNeeded.toLocaleString('vi-VN')} màn Giải Đố mới!`,
            '🧩'
          );
          this.openTrialMinigame();
          return;
        }
        const needStars = this.sim.getEffectiveItemStarCost(item);
        if (
          !this.sim.state.sandboxMode &&
          needStars > 0 &&
          this.sim.state.match3.stars < needStars
        ) {
          const missing = needStars - this.sim.state.match3.stars;
          this.showToast(
            `Cần thêm ${missing} 🌟 Sao Phép Thuật (${this.sim.state.match3.stars}/${needStars} 🌟) để dựng "${item.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,
            '🌟'
          );
          this.openTrialMinigame();
          return;
        }
        this.selectedCatalogItem = item;
        this.bulldozerActive = false;
        this.moveModeActive = false;
        this.movingBuildingUid = null;
        this.pincerActive = false;
        this.pincerPicked = null;
        this.pendingTouchTile = null;
        this.inspectSelection = null;
        this.collapseBuildDock();
        this.refreshAll();
      });
    });
  }

  private renderStaffDrawer(drawer: HTMLElement): void {
    const roles: Array<{
      key: keyof ParkSimulation['state']['staffHired'];
      icon: string;
      name: string;
      desc: string;
      baseCost: number;
    }> = [
      {
        key: 'caretaker',
        icon: '🧹',
        name: 'Lao Công Phép Thuật',
        desc: 'Tự động dọn vũng bùa chú lỗi và giữ đường đi sạch đẹp.',
        baseCost: 90,
      },
      {
        key: 'artificer',
        icon: '🔧',
        name: 'Phù Thủy Bảo Trì',
        desc: 'Tự động niệm Reparo sửa trò chơi hỏng và bảo trì đường ray.',
        baseCost: 140,
      },
      {
        key: 'magizoologist',
        icon: '🥩',
        name: 'Nhà Sinh Vật Học',
        desc: 'Tự động cho Niffler, Bằng Mã & Rồng ăn khi chúng đói.',
        baseCost: 220,
      },
      {
        key: 'auror',
        icon: '⚡',
        name: 'Thần Sáng Bảo An',
        desc: 'Đuổi bắt thú sổng chuồng và thu hồi vàng Galleon về két.',
        baseCost: 320,
      },
      {
        key: 'house_elf',
        icon: '🧦',
        name: 'Gia Tinh Tình Nguyện',
        desc: 'Tự gom bong bóng vàng trên mái nhà cả khi Online lẫn Offline!',
        baseCost: 480,
      },
    ];

    const unlockedSet = new Set(this.sim.state.unlockedZones);
    const zoneOptions = (selectedZone: ZoneId | 'all') =>
      `<option value="all" ${selectedZone === 'all' ? 'selected' : ''}>🗺️ Toàn công viên</option>` +
      ZONES.filter((z) => this.sim.state.sandboxMode || unlockedSet.has(z.id))
        .map(
          (z) =>
            `<option value="${z.id}" ${selectedZone === z.id ? 'selected' : ''}>📍 ${z.name}</option>`
        )
        .join('');

    const roleCards = roles
      .map((r) => {
        const count = this.sim.state.staffHired[r.key];
        const maxed = count >= MAX_STAFF_PER_ROLE;
        const cost = r.baseCost * (1 + count);
        return `
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:22px;">${r.icon} <span style="font-size:12px;font-weight:800;">${count}/${MAX_STAFF_PER_ROLE}</span></div>
            <div style="font-size:12.5px;font-weight:800;">${r.name}</div>
            <button
              type="button"
              data-hire="${r.key}"
              class="brass-btn ${maxed ? '' : 'gold-cta'}"
              ${maxed ? 'disabled' : ''}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${maxed ? `✓ ${MAX_STAFF_PER_ROLE}/${MAX_STAFF_PER_ROLE}` : `+ 🪙 ${cost}`}
            </button>
          </div>
        `;
      })
      .join('');

    const activeStaffCards = this.sim.staff
      .map((s) => {
        const pZone = this.sim.state.staffPatrolZones?.[s.id] ?? s.patrolZoneId ?? 'all';
        return `
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:800;color:#7c2d12;">🧙 ${escapeHtml(s.name)}</div>
            <select data-patrol-staff="${escapeHtml(s.id)}" aria-label="Khu tuần tra" style="width:100%;margin-top:2px;padding:3px 5px;border-radius:6px;border:1px solid #9a5b1e;font-size:12px;background:#fffdf7;color:#3a2615;">
              ${zoneOptions(pZone)}
            </select>
            <button type="button" data-pick-staff="${escapeHtml(s.id)}" class="brass-btn" style="width:100%;padding:4px 8px;font-size:12px;">
              🤏 Gắp
            </button>
          </div>
        `;
      })
      .join('');

    drawer.innerHTML = roleCards + activeStaffCards;

    drawer.querySelectorAll<HTMLButtonElement>('[data-hire]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.hire as keyof ParkSimulation['state']['staffHired'];
        if (this.sim.hireStaff(role)) {
          this.collapseBuildDock();
          this.refreshAll();
          this.showToast('Đã đón nhân sự mới gia nhập công viên!', '🧙');
        }
      });
    });

    drawer.querySelectorAll<HTMLSelectElement>('[data-patrol-staff]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const sid = sel.dataset.patrolStaff!;
        this.sim.setStaffPatrolZone(sid, sel.value as ZoneId | 'all');
        this.showToast('Đã cập nhật khu vực tuần tra cho nhân sự!', '📍');
      });
    });

    drawer.querySelectorAll<HTMLButtonElement>('[data-pick-staff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const st = this.sim.staff.find((x) => x.id === btn.dataset.pickStaff);
        if (!st) return;
        this.pincerActive = true;
        this.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        this.collapseBuildDock();
        this.refreshAll();
        this.showToast(`Đang gắp ${st.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`, '🤏');
      });
    });
  }

  private syncContextualMapToolsBar(): void {
    const secToolsActive = this.mapToolsExpanded || Boolean(this.activeCategory);
    const secBar = this.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    const btnMapTools = this.root.querySelector('#btnToggleMapTools') as HTMLButtonElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !secToolsActive);
    }
    if (btnMapTools) {
      btnMapTools.setAttribute('aria-expanded', String(secToolsActive));
      btnMapTools.setAttribute('data-active', String(secToolsActive));
      btnMapTools.setAttribute('aria-pressed', String(secToolsActive));
    }
  }

  public renderInspector(): void {
    this.syncContextualMapToolsBar();
    const panel = this.root.querySelector('#inspectorPanel') as HTMLElement;
    if (!this.inspectSelection) {
      this.lastInspectedKey = '';
      this.inspectorCollapsed = false;
      panel.classList.add('hidden');
      panel.classList.remove('inspector-collapsed');
      this.syncHudFocusVisibility();
      return;
    }

    const selKey =
      this.inspectSelection.kind === 'building'
        ? `b:${this.inspectSelection.uid}`
        : this.inspectSelection.kind === 'staff'
          ? `s:${this.inspectSelection.id}`
          : `z:${this.inspectSelection.zoneId}`;
    if (selKey !== this.lastInspectedKey) {
      this.lastInspectedKey = selKey;
      this.inspectorCollapsed = false;
    }
    panel.classList.toggle('inspector-collapsed', this.inspectorCollapsed);

    if (this.inspectSelection.kind === 'building') {
      const targetUid = this.inspectSelection.uid;
      const b = this.sim.state.buildings.find((x) => x.uid === targetUid);
      if (!b) {
        this.inspectSelection = null;
        panel.classList.add('hidden');
        this.syncHudFocusVisibility();
        return;
      }
      const item = getCatalogItem(b.itemId)!;
      const now = Date.now();
      const isBuilding = now < b.constructEndsAt;
      const remainSec = Math.max(0, Math.ceil((b.constructEndsAt - now) / 1000));
      const prod = this.sim.getBuildingProductionPerCycle(b, item);
      const upgCost = getUpgradeCost(item, b.stars);
      const queueCount = (this.sim.rideQueues.get(b.uid) ?? []).length;
      const isConnected = this.sim.isBuildingConnected(b.uid);
      const synGold = this.sim.activeSynergies.buildingGoldMult.get(b.uid) ?? 1;
      const synXp = this.sim.activeSynergies.buildingXpMult.get(b.uid) ?? 1;
      const isRide = item.category === 'ride' && !item.isCoasterTrackPiece;
      const canRideCam = Boolean(item.isCustomCoasterStation) && !isBuilding;

      const stageNames: Record<string, string> = {
        egg: '🥚 Trứng',
        baby: '🐣 Non',
        adult: '🦄 Trưởng thành',
        legendary: '🌟 Huyền thoại',
      };

      const bio = item.isCreatureHabitat ? this.sim.biomeCache.get(b.uid) : undefined;
      const backstage = item.isBackstage ? this.sim.backstageCache.get(b.uid) : undefined;
      const hasPriceSlider = Boolean(item.ticketPrice) && !isBuilding && !item.workshopGroupId;
      const priceBounds = getItemPriceBounds(item);
      const curPrice = this.sim.getEffectivePrice(b, item);
      const priceVerdict = this.sim.getPriceValueVerdict(b, item);

      const farmlandHtml =
        item.isFarmlandPlot && !isBuilding
          ? (() => {
              if (!b.cropId) {
                const allCropList = Object.values(FARM_CROPS).sort(
                  (a, c) => a.unlockLevel - c.unlockLevel || a.growSec - c.growSec
                );
                const flowerTotal = allCropList.filter((c) => c.isFlowerCrop).length;
                const cropTotal = allCropList.length - flowerTotal;
                const filteredList = allCropList.filter((c) => {
                  if (this.seedFilterMode === 'flowers') return Boolean(c.isFlowerCrop);
                  if (this.seedFilterMode === 'crops') return !c.isFlowerCrop;
                  return true;
                });
                const filterPills = (
                  [
                    { id: 'all', label: `🌱 (${allCropList.length})` },
                    { id: 'flowers', label: `🌸 (${flowerTotal})` },
                    { id: 'crops', label: `🌾 (${cropTotal})` },
                  ] as const
                )
                  .map(
                    (f) => `
                      <button
                        type="button"
                        class="seed-filter-pill ${this.seedFilterMode === f.id ? 'active' : ''}"
                        data-insp-seed-filter="${f.id}"
                        aria-pressed="${this.seedFilterMode === f.id}"
                      >${f.label}</button>
                    `
                  )
                  .join('');
                const seedCards = filteredList
                  .map((crop) => {
                    const lockedCrop =
                      !this.sim.state.sandboxMode && this.sim.state.level < crop.unlockLevel;
                    const seedCount = this.sim.getSeedCount(crop.id);
                    const stock = this.sim.getFarmItemCount(crop.id);
                    const growLabel = formatDurationCompactVi(crop.growSec);
                    return `
                      <button
                        type="button"
                        class="seed-card ${lockedCrop ? 'locked' : ''} ${!lockedCrop && seedCount <= 0 ? 'out-of-seeds' : ''}"
                        data-plant-crop="${crop.id}"
                        ${lockedCrop ? 'disabled' : ''}
                      >
                        <img src="${getFarmItemIconSrc(crop.id)}" alt="${escapeHtml(crop.name)}" class="seed-card-img" />
                        <span class="seed-card-name">${escapeHtml(crop.name)}</span>
                        <span class="seed-card-seed-badge ${seedCount > 0 ? 'has-seed' : 'no-seed'}">
                          ${
                            lockedCrop
                              ? `🔒 Lv.${crop.unlockLevel}`
                              : seedCount > 0
                                ? `🌱 ×${seedCount}`
                                : `🎓 +Hạt`
                          }
                        </span>
                        <span class="seed-card-meta">
                          ${lockedCrop ? `⏱️ ${growLabel}` : `⏱️ ${growLabel} • 🪙${crop.seedCost}G`}
                        </span>
                        <span class="seed-card-stock">🧺 ${stock}</span>
                      </button>
                    `;
                  })
                  .join('');
                return `
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>🌱 Chọn Hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta" style="padding:4px 9px;font-size:11.5px;">
                        🪄 +Hạt
                      </button>
                    </div>
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${filterPills}</div>
                    <div class="seed-picker-grid">${seedCards}</div>
                  </div>
                `;
              }

              const cropDef = FARM_CROPS[b.cropId];
              const readyAt = b.cropReadyAt ?? now;
              const plantedAt = b.cropPlantedAt ?? readyAt - cropDef.growSec * 1000;
              const cropLeftSec = Math.max(0, Math.ceil((readyAt - now) / 1000));
              const isRipe = cropLeftSec <= 0;
              const growPct = isRipe
                ? 100
                : Math.max(
                    6,
                    Math.min(98, Math.round(((now - plantedAt) / Math.max(1000, readyAt - plantedAt)) * 100))
                  );
              return `
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="${getFarmItemIconSrc(cropDef.id)}" alt="${escapeHtml(cropDef.name)}" style="width:44px;height:44px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${escapeHtml(cropDef.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${isRipe ? '🌾 Chín!' : `⏱️ ${formatDurationCountdownVi(cropLeftSec)}`}
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${growPct}%"></div>
                  </div>
                  ${
                    isRipe
                      ? `
                        <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;padding:8px 12px;font-size:13px;">
                          <img src="/sprites/ui_icon_golden_sickle.png" alt="" style="width:20px;height:20px;object-fit:contain;vertical-align:-4px;margin-right:4px;" />
                          Gặt (+${cropDef.yieldQty})
                        </button>
                      `
                      : !b.cropWateredBoost
                        ? `
                          <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="width:100%;">
                            <img src="/sprites/ui_icon_watering_can.png" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                            💧 Tưới (-30%)
                          </button>
                        `
                        : `<div style="font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;">💧 Đã tưới</div>`
                  }
                </div>
              `;
            })()
          : '';

      const workshopBoardHtml =
        item.workshopGroupId && !isBuilding
          ? (() => {
              const recipes = this.sim.getWorkshopRecipesForBuilding(item);
              const queue = b.workshopQueue ?? [];
              const readyGoods = b.readyFarmGoods ?? [];
              const maxSlots = 3 + Math.min(2, Math.max(0, b.stars - 1));

              const readyShelfHtml =
                readyGoods.length > 0
                  ? `
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${readyGoods
                          .slice(0, 5)
                          .map((gid) => {
                            const gMeta = FARM_GOODS[gid];
                            return `<img src="/sprites/${gMeta.iconKey}.png" alt="${escapeHtml(gMeta.name)}" title="${escapeHtml(gMeta.name)}" class="ws-ready-good-img" />`;
                          })
                          .join('')}
                      </div>
                      <button id="btnInspCollectGoods" type="button" class="owl-green-send-btn ws-collect-btn">
                        🧺 Thu (${readyGoods.length})
                      </button>
                    </div>
                  `
                  : '';

              const recipeCardsHtml = recipes
                .map((rec) => {
                  const outMeta = FARM_GOODS[rec.goodId];
                  const lockedRec =
                    !this.sim.state.sandboxMode && this.sim.state.level < rec.unlockLevel;
                  const canCraft =
                    !lockedRec &&
                    (this.sim.state.sandboxMode ||
                      rec.inputs.every((inp) => this.sim.getFarmItemCount(inp.itemId) >= inp.qty));
                  const reqFormula = rec.inputs
                    .map((inp) => {
                      const im = getFarmItemMeta(inp.itemId);
                      const have = this.sim.getFarmItemCount(inp.itemId);
                      const ok = this.sim.state.sandboxMode || have >= inp.qty;
                      return `<span class="ws-ing-chip ${ok ? 'ok' : 'lack'}">${escapeHtml(im.name)} ${this.sim.state.sandboxMode ? '∞' : have}/${inp.qty}</span>`;
                    })
                    .join(' ');
                  return `
                    <button
                      type="button"
                      class="ws-recipe-card ${canCraft ? 'craftable' : ''} ${lockedRec ? 'locked' : ''}"
                      data-ws-enqueue="${rec.id}"
                      ${lockedRec ? 'disabled' : ''}
                    >
                      <div class="ws-recipe-name">${escapeHtml(outMeta.name)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/sprites/${outMeta.iconKey}.png" alt="${escapeHtml(outMeta.name)}" class="ws-recipe-img" />
                        ${canCraft ? '<span class="ws-check-dot">✓</span>' : ''}
                      </div>
                      <div class="ws-recipe-ings">
                        ${lockedRec ? `🔒 Lv.${rec.unlockLevel}` : reqFormula}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${formatDurationCompactVi(rec.craftSec)}</div>
                    </button>
                  `;
                })
                .join('');

              const activeSlot = queue[0];
              const activeLeftSec = activeSlot
                ? Math.max(0, Math.ceil((activeSlot.endsAt - now) / 1000))
                : 0;
              const activeMeta = activeSlot ? FARM_GOODS[activeSlot.goodId] : null;

              const queuedSlotsHtml = Array.from({ length: Math.max(1, maxSlots - 1) }, (_, idx) => {
                const slot = queue[idx + 1];
                if (slot) {
                  const sMeta = FARM_GOODS[slot.goodId];
                  return `
                    <div class="ws-slot-card filled" title="Đang chờ: ${escapeHtml(sMeta.name)}">
                      <img src="/sprites/${sMeta.iconKey}.png" alt="${escapeHtml(sMeta.name)}" class="ws-slot-img" />
                      <span class="ws-check-dot">✓</span>
                      <div class="ws-slot-bar"></div>
                    </div>
                  `;
                }
                if (idx === queue.length - (activeSlot ? 1 : 0)) {
                  return `
                    <div class="ws-slot-plus" title="Thêm vào khay">
                      <span>+</span>
                    </div>
                  `;
                }
                return `
                  <div class="ws-slot-card empty" title="Trống">
                    <span style="font-size:11px;font-weight:800;opacity:0.65;">Trống</span>
                  </div>
                `;
              }).join('');

              return `
                <div class="ws-inspector-board">
                  <div class="ws-board-header">
                    <span>🔥 ${escapeHtml(item.name)}</span>
                    <button id="btnInspOpenBarn" type="button" class="brass-btn" style="padding:2px 8px;font-size:11px;">🏡 Kho</button>
                  </div>
                  ${readyShelfHtml}
                  <div class="ws-recipe-grid">${recipeCardsHtml}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${activeSlot ? 'baking' : ''}">
                      <div class="ws-oven-arch">
                        ${
                          activeMeta
                            ? `<img src="/sprites/${activeMeta.iconKey}.png" alt="${escapeHtml(activeMeta.name)}" class="ws-oven-good-img" />`
                            : `<span style="font-size:20px;">🪵</span>`
                        }
                      </div>
                      <div class="ws-oven-caption">
                        ${
                          activeSlot
                            ? `<strong>${formatDurationCountdownVi(activeLeftSec)}</strong>`
                            : `<strong>Trống</strong>`
                        }
                      </div>
                      ${
                        activeSlot
                          ? `<button id="btnInspSpeedSlot" type="button" class="ws-speed-pill" title="Dùng 1 Cát">⚡ 1⏳</button>`
                          : ''
                      }
                    </div>
                    <div class="ws-queue-slots">${queuedSlotsHtml}</div>
                  </div>
                </div>
              `;
            })()
          : '';

      const pastureHtml =
        item.isAnimalPasturePlot && !isBuilding
          ? (() => {
              if (!b.pastureAnimalId) {
                const animalCards = Object.values(PASTURE_ANIMALS)
                  .map((animal) => {
                    const lockedAnimal =
                      !this.sim.state.sandboxMode && this.sim.state.level < animal.unlockLevel;
                    const prodMeta = animal.goodId ? getFarmItemMeta(animal.goodId) : null;
                    return `
                      <button
                        type="button"
                        class="seed-card ${lockedAnimal ? 'locked' : ''}"
                        data-stock-animal="${animal.id}"
                        ${lockedAnimal ? 'disabled' : ''}
                      >
                        <img src="/sprites/${animal.spritePair[0]}.png" alt="${escapeHtml(animal.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${escapeHtml(animal.name)}</span>
                        <span class="seed-card-seed-badge ${lockedAnimal ? 'no-seed' : 'has-seed'}">
                          ${lockedAnimal ? `🔒 Lv.${animal.unlockLevel}` : `🪙 ${animal.cost}G`}
                        </span>
                        <span class="seed-card-meta">⏱️${formatDurationCompactVi(animal.cycleSec)} • +${animal.sellValue}G</span>
                        <span class="seed-card-stock">${prodMeta ? `+${animal.yieldQty} ${escapeHtml(prodMeta.name)}` : 'Sản vật'}</span>
                      </button>
                    `;
                  })
                  .join('');
                return `
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>🐾 Chọn Thú</span>
                    </div>
                    <div class="seed-picker-grid">${animalCards}</div>
                  </div>
                `;
              }

              const animalDef = PASTURE_ANIMALS[b.pastureAnimalId];
              const readyAt = b.pastureReadyAt ?? now;
              const stockedAt = b.pastureStockedAt ?? readyAt - animalDef.cycleSec * 1000;
              const leftSec = Math.max(0, Math.ceil((readyAt - now) / 1000));
              const isReady = leftSec <= 0;
              const grazePct = isReady
                ? 100
                : Math.max(
                    6,
                    Math.min(
                      98,
                      Math.round(((now - stockedAt) / Math.max(1000, readyAt - stockedAt)) * 100)
                    )
                  );
              const prodMeta = animalDef.goodId ? getFarmItemMeta(animalDef.goodId) : null;
              return `
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
                    <img src="/sprites/${animalDef.spritePair[0]}.png" alt="${escapeHtml(animalDef.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div style="font-size:13.5px;font-weight:900;">${escapeHtml(animalDef.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;">
                        ${
                          isReady
                            ? `🧺 +${animalDef.sellValue}G${prodMeta ? ` +${animalDef.yieldQty} ${escapeHtml(prodMeta.name)}` : ''}`
                            : `⏱️ ${formatDurationCountdownVi(leftSec)}`
                        }
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:9px;margin-bottom:8px;">
                    <div class="quest-bar-fill" style="width:${grazePct}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${
                      isReady
                        ? `
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${animalDef.sellValue}G)
                          </button>
                        `
                        : !b.pastureFedBoost
                          ? `
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `
                          : `<div style="flex:1;font-size:11.5px;font-weight:800;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>`
                    }
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                  </div>
                </div>
              `;
            })()
          : '';

      panel.classList.remove('hidden');
      panel.classList.toggle(
        'inspector-wide-ws',
        Boolean(
          (item.workshopGroupId || item.isFarmlandPlot || item.isAnimalPasturePlot) && !isBuilding
        )
      );
      this.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${this.inspectorCollapsed ? '0' : '8px'};">
          <div style="display:flex;gap:10px;align-items:center;min-width:0;">
            ${item.spriteKey ? `<img src="/sprites/${item.spriteKey}.png" alt="${escapeHtml(item.name)}" class="inspector-thumb" />` : ''}
            <div style="min-width:0;">
              <div style="font-size:14px;font-weight:800;color:#45230c;">${escapeHtml(item.name)}</div>
              <div style="font-size:12.5px;color:#b45309;font-weight:800;">${'★'.repeat(b.stars)}${'☆'.repeat(5 - b.stars)}</div>
              <div style="font-size:11.5px;opacity:0.82;">${
                item.isFarmlandPlot
                  ? '🌱 Ruộng'
                  : item.isAnimalPasturePlot
                    ? '🐾 Đồng cỏ'
                    : item.connectableGroup === 'flower_garden'
                      ? '🌸 Vườn hoa'
                      : item.workshopGroupId
                        ? '🔥 Xưởng'
                        : `👥 ${b.visitorsServed}`
              }${isRide ? ` • 🎟️ ${queueCount}/${MAX_RIDE_QUEUE}` : ''}</div>
            </div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!this.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${this.inspectorCollapsed ? '▴' : '▾'}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        ${farmlandHtml}
        ${pastureHtml}
        ${workshopBoardHtml}

        <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;display:flex;flex-direction:column;gap:4px;">
          <div style="font-weight:800;color:${isConnected ? '#15803d' : '#dc2626'};">
            ${isConnected ? '🟢 Đã nối đường' : '🚧 Chưa nối đường (25%)'}
          </div>
          ${
            synGold > 1
              ? `<div style="font-weight:800;color:#b45309;">🌟 Combo: +${Math.round((synGold - 1) * 100)}%G • +${Math.round((synXp - 1) * 100)}%XP</div>`
              : ''
          }
          ${
            item.producesIngredient
              ? `<div style="color:#5c2d0c;">🌿 Rơi: <strong>${RAW_INGREDIENTS_INFO[item.producesIngredient].emoji} ${RAW_INGREDIENTS_INFO[item.producesIngredient].name}</strong></div>`
              : ''
          }
        </div>

        ${
          isBuilding
            ? (() => {
                const reducedSec = Math.max(0, b.buildReducedSec ?? 0);
                const totalMs = Math.max(
                  1000,
                  item.buildDurationSec * 1000,
                  b.constructEndsAt - (b.placedAt || now - 1000) + reducedSec * 1000
                );
                const buildPct = Math.max(
                  1,
                  Math.min(99, Math.floor((1 - (b.constructEndsAt - now) / totalMs) * 100))
                );
                const floorSec = this.sim.getBuildingMinFloorSec(b);
                const reducibleSec = Math.max(0, remainSec - floorSec);
                const hasOtherReducible =
                  reducibleSec <= 0 &&
                  this.sim
                    .getActiveConstructions(now)
                    .some(
                      (x) =>
                        x.uid !== b.uid &&
                        Math.ceil((x.constructEndsAt - now) / 1000) > this.sim.getBuildingMinFloorSec(x)
                    );
                const canTriggerSpeedup = reducibleSec > 0 || hasOtherReducible;
                const progLabel = item.isCreatureHabitat
                  ? 'Tiến độ ấp trứng'
                  : 'Tiến độ xây dựng';
                return `
                  <div class="quest-card-mini" style="margin-bottom:8px;background:var(--surface-panel);border-color:var(--sky-deep);">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;color:var(--sky-deep);">
                      <span>${item.isCreatureHabitat ? '🥚 Đang ấp' : '🔨 Đang xây'}</span>
                      <span>${buildPct}%</span>
                    </div>
                    <progress class="ts-build-progress" max="100" value="${buildPct}" aria-label="${progLabel}"></progress>
                    <div style="font-size:12px;font-weight:700;color:var(--ink);">
                      ⏳ <strong>${formatDurationCountdownVi(remainSec)}</strong>${
                        reducedSec > 0
                          ? ` • <span style="color:var(--teal-deep);">-${formatDurationCompactVi(reducedSec)}</span>`
                          : ''
                      }
                    </div>
                    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta" style="flex:1;" ${canTriggerSpeedup ? '' : 'disabled'} title="Thắng 1 màn trừ 30–75p giờ xây">
                        ⚡ Khảo Thí (-30~75p)
                      </button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn" style="flex:1;" ${canTriggerSpeedup ? '' : 'disabled'} title="Đố ngoại ngữ trừ 10–25p giờ xây">
                        🪄 Thần Chú (-10~25p)
                      </button>
                      ${
                        this.sim.state.sandboxMode
                          ? `<button id="btnFinishNowSand" type="button" class="brass-btn" style="flex:1;" title="Hoàn tất ngay">
                              ⚡ Xong ngay
                            </button>`
                          : ''
                      }
                    </div>
                  </div>
                `;
              })()
            : b.awaitingUnveil
              ? `
                <div class="quest-card-mini feast-unveil-insp-card">
                  <div class="feast-unveil-insp-title">🎀 Hoàn thiện!</div>
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:7px;">
                    🎀 Cắt Băng
                  </button>
                </div>
              `
              : item.baseIncome > 0
              ? (() => {
                  const festSpeed =
                    this.sim.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
                  const effCycle = Math.max(1, item.cycleSec * festSpeed);
                  const rawEl = Math.max(0, (now - (b.lastTickAt || now)) / 1000);
                  const cycLeft = Math.max(1, Math.ceil(effCycle - (rawEl % effCycle)));
                  return `
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${prod.galleons}🪙 +${prod.xp}⭐</strong> / ${formatDurationCompactVi(item.cycleSec)}</div>
                      ${
                        item.cycleSec > 0 && !item.isFarmlandPlot && !item.isAnimalPasturePlot
                          ? `<div style="margin-top:3px;">⏱️ <strong>${formatDurationCountdownVi(cycLeft)}</strong> • Kho: <strong>${b.storedGalleons}🪙</strong></div>`
                          : `<div style="margin-top:3px;">Kho: <strong>${b.storedGalleons}🪙</strong></div>`
                      }
                      ${
                        b.storedGalleons > 0
                          ? `<button id="btnCollectSingle" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:6px;">🪙 Thu (+${b.storedGalleons}G)</button>`
                          : ''
                      }
                    </div>
                  `;
                })()
              : ''
        }

        ${
          isRide && !isBuilding && !item.isFlooPortal
            ? `
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>⚙️ Độ bền:</span>
                  <span style="color:${b.isBrokenDown ? '#dc2626' : b.durability < 50 ? '#b45309' : '#15803d'};">${Math.round(b.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(b.durability)}" aria-label="Độ bền"></progress>
                ${
                  b.isBrokenDown || b.durability < 98
                    ? `<button id="btnRepairRide" type="button" class="brass-btn ${b.isBrokenDown ? 'gold-cta' : ''}" style="width:100%;margin-top:6px;">
                        🪄 Sửa (0G)
                      </button>`
                    : ''
                }
              </div>
            `
            : ''
        }

        ${
          hasPriceSlider
            ? `
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:4px;">
                  <span>🎟️ Giá (${priceBounds.min}–${priceBounds.max}G):</span>
                  <span id="lblBuildingPriceVal">${curPrice}G</span>
                </label>
                <input id="inpBuildingPrice" type="range" min="${priceBounds.min}" max="${priceBounds.max}" value="${curPrice}" />
                <div id="lblPriceVerdict" style="margin-top:4px;font-weight:700;color:${priceVerdict.color};">
                  ${priceVerdict.label}
                </div>
              </div>
            `
            : ''
        }

        ${
          item.isCustomCoasterStation && b.coasterStats && !isBuilding
            ? `
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:800;color:#7c2d12;margin-bottom:4px;">🎢 Ray: ${b.coasterStats.lengthMeters}m • 🔥 ${b.coasterStats.excitement}/10</div>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:4px;">
                  ✨ Tự Lắp Ray
                </button>
              </div>
            `
            : ''
        }

        ${
          canRideCam
            ? `
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">
                🎥 Ride Cam
              </button>
            `
            : ''
        }

        ${
          (item.isWorkshopBrewery || item.producesIngredient || item.isFireworksLauncher) && !isBuilding
            ? `
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">
                  🧪 Xưởng
                </button>
                ${
                  item.isFireworksLauncher
                    ? `<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">🎆 Pháo Hoa</button>`
                    : ''
                }
              </div>
            `
            : ''
        }

        ${
          item.isCreatureHabitat && !isBuilding
            ? `
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>🐾 ${escapeHtml(b.creatureNickname || item.creatureName || item.name)}</strong>
                  <span class="morph-pill ${b.creatureMorph === 'radiant' ? 'radiant' : b.creatureMorph === 'mystic' ? 'mystic' : ''}">
                    ${MORPH_INFO[b.creatureMorph ?? 'normal'].badge}
                  </span>
                </div>
                <div>💝 Lv.${b.creatureBondLevel ?? 1}/${MAX_BOND_LEVEL} • ${stageNames[b.creatureStage ?? 'baby']} • 🌿 ${bio?.score ?? 50}% • 🥩 ${Math.round(b.creatureHunger ?? 90)}%</div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">
                    🥩 Cho ăn
                  </button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1.3;">
                    🧳 Vali
                  </button>
                </div>
              </div>
            `
            : ''
        }

        ${
          item.isBackstage && backstage && !isBuilding
            ? `
              <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                <div style="font-weight:700;color:${backstage.isShielded ? '#15803d' : '#dc2626'};">
                  📦 Che chắn: ${backstage.shieldCount}/${backstage.needed} ${backstage.isShielded ? '✅ (+25%G)' : '⚠️'}
                </div>
              </div>
            `
            : ''
        }

        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${
            !isBuilding && b.stars < 5
              ? `<button id="btnUpgStar" type="button" class="brass-btn" style="flex:1;">
                  ⬆️ ${b.stars + 1}★ (🌟${getUpgradePuzzleStarCost(b.stars, item)} + 🪙${upgCost.toLocaleString('vi-VN')})
                </button>`
              : !isBuilding
                ? `<div style="width:100%;text-align:center;font-size:12px;font-weight:800;color:#15803d;">🌟 5★ Tối Đa</div>`
                : ''
          }
          ${
            !b.isIndestructible
              ? `<button id="btnMoveThis" type="button" class="brass-btn" title="Dời công trình">✋ Dời</button>`
              : ''
          }
        </div>
      `;

      const priceInput = panel.querySelector('#inpBuildingPrice') as HTMLInputElement | null;
      if (priceInput) {
        this.wireRangeProgressFallback(priceInput);
        priceInput.addEventListener('input', () => {
          const v = Number(priceInput.value);
          this.sim.setBuildingCustomPrice(b.uid, v);
          const curEff = this.sim.getEffectivePrice(b, item);
          const lblVal = panel.querySelector('#lblBuildingPriceVal');
          if (lblVal) lblVal.textContent = `${curEff} Galleon`;
          const verd = this.sim.getPriceValueVerdict(b, item);
          const lblVerd = panel.querySelector('#lblPriceVerdict') as HTMLElement | null;
          if (lblVerd) {
            lblVerd.textContent = verd.label;
            lblVerd.style.color = verd.color;
          }
          const liveProd = this.sim.getBuildingProductionPerCycle(b, item);
          const lblProd = panel.querySelector('#lblBuildingProdVal');
          if (lblProd) {
            lblProd.textContent = `+${liveProd.galleons} 🪙 & +${liveProd.xp} ⭐`;
          }
        });
      }

      panel.querySelector('#btnToggleInspRollup')?.addEventListener('click', () => {
        this.inspectorCollapsed = !this.inspectorCollapsed;
        this.renderInspector();
      });
      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        this.inspectSelection = null;
        this.renderInspector();
      });
      panel.querySelector('#btnInspUnveilBuilding')?.addEventListener('click', () => {
        this.sim.unveilBuilding(b.uid);
        this.inspectSelection = null;
        this.refreshAll();
      });
      panel.querySelector('#btnInspPlayMinigameSpeed')?.addEventListener('click', () => {
        this.inspectSelection = null;
        this.refreshAll();
        this.openTrialMinigame();
      });
      panel.querySelector('#btnInspQuizSpeed')?.addEventListener('click', () => {
        this.inspectSelection = null;
        this.refreshAll();
        this.openSeedQuizDialog(this.activeSeedCropId ?? 'ottery_wheat');
      });
      panel.querySelector('#btnFinishNowSand')?.addEventListener('click', () => {
        this.sim.speedUpWithTimeSand(b.uid, true);
        this.renderInspector();
      });
      panel.querySelector('#btnCollectSingle')?.addEventListener('click', () => {
        this.sim.harvestBuildingBubble(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnInspOpenSeedQuiz')?.addEventListener('click', () => {
        const targetUid = b.uid;
        this.inspectSelection = null;
        this.refreshAll();
        this.openSeedQuizDialog(this.activeSeedCropId ?? 'ottery_wheat', targetUid);
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-plant-crop]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const cid = btn.dataset.plantCrop as FarmCropId;
          const res = this.sim.plantCropOnPlot(b.uid, cid);
          if (res.needSeedAcquire) {
            const targetUid = b.uid;
            this.activeSeedCropId = cid;
            this.inspectSelection = null;
            this.refreshAll();
            this.openSeedQuizDialog(cid, targetUid);
            return;
          }
          this.showToast(res.msg, res.ok ? '🌱' : '🪙');
          if (res.ok) {
            this.activeSeedCropId = cid;
            this.seedTrayOpen = false;
            this.inspectSelection = null;
            this.refreshAll();
            return;
          }
          this.renderInspector();
          this.renderSeedTray();
          this.refreshFloatingBanner();
        });
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-insp-seed-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const f = btn.dataset.inspSeedFilter as 'all' | 'flowers' | 'crops';
          if (f === 'all' || f === 'flowers' || f === 'crops') {
            this.seedFilterMode = f;
            this.renderInspector();
          }
        });
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-stock-animal]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const aid = btn.dataset.stockAnimal as PastureAnimalId;
          const res = this.sim.stockAnimalOnPasture(b.uid, aid);
          this.showToast(res.msg, res.ok ? PASTURE_ANIMALS[aid]?.emoji ?? '🐾' : '🪙');
          if (res.ok) {
            this.activePastureAnimalId = aid;
            this.pastureTrayOpen = false;
            this.inspectSelection = null;
            this.refreshAll();
            return;
          }
          this.renderInspector();
        });
      });
      panel.querySelector('#btnInspFeedPasture')?.addEventListener('click', () => {
        const res = this.sim.feedAnimalPasture(b.uid);
        this.showToast(res.msg, res.ok ? '🌾' : '⏳');
        this.renderInspector();
      });
      panel.querySelector('#btnInspHarvestPasture')?.addEventListener('click', () => {
        const res = this.sim.harvestAnimalPasture(b.uid);
        this.showToast(res.msg, res.ok ? '🧺' : '⏳');
        this.renderInspector();
      });
      panel.querySelector('#btnInspClearPasture')?.addEventListener('click', () => {
        const res = this.sim.clearAnimalFromPasture(b.uid);
        this.showToast(res.msg, res.ok ? '🐾' : '⚠️');
        this.renderInspector();
      });
      panel.querySelector('#btnInspWaterCrop')?.addEventListener('click', () => {
        const res = this.sim.waterCropPlot(b.uid);
        this.showToast(res.msg, res.ok ? '💧' : '⏳');
        this.renderInspector();
      });
      panel.querySelector('#btnInspHarvestCrop')?.addEventListener('click', () => {
        const res = this.sim.harvestCropPlot(b.uid);
        this.showToast(res.msg, res.ok ? '🌾' : '🏡');
        this.renderInspector();
      });
      panel.querySelector('#btnInspCollectGoods')?.addEventListener('click', () => {
        this.sim.harvestBuildingBubble(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnInspOpenBarn')?.addEventListener('click', () => {
        this.openWorkshopDialog('barn');
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-ws-enqueue]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rid = btn.dataset.wsEnqueue!;
          const res = this.sim.enqueueWorkshopRecipe(b.uid, rid);
          this.showToast(res.msg, res.ok ? '🔥' : '🧺');
          this.renderInspector();
        });
      });
      panel.querySelector('#btnInspSpeedSlot')?.addEventListener('click', () => {
        this.sim.speedUpWorkshopSlot(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnRepairRide')?.addEventListener('click', () => {
        this.sim.repairBuilding(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnAutoLoopCoaster')?.addEventListener('click', () => {
        this.sim.autoBuildCoasterForStation(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnEnterRideCam')?.addEventListener('click', () => {
        this.rideCamUid = b.uid;
        this.inspectSelection = null;
        this.renderInspector();
        this.refreshFloatingBanner();
        this.showToast(`🎥 Đang ngồi thử trên "${item.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`, '🎢');
      });
      panel.querySelector('#btnInspOpenWorkshop')?.addEventListener('click', () => {
        this.openWorkshopDialog('brew');
      });
      panel.querySelector('#btnInspFireworks')?.addEventListener('click', () => {
        this.sim.launchFireworksShow(10);
        this.showToast('🎆 Rồng Lửa bay vút lên bầu trời đêm!', '🎆');
      });
      panel.querySelector('#btnFeedBeast')?.addEventListener('click', () => {
        this.sim.feedCreature(b.uid);
        this.renderInspector();
      });
      panel.querySelector('#btnInspOpenSuitcase')?.addEventListener('click', () => {
        this.openSuitcaseDialog('care', b.uid);
      });
      panel.querySelector('#btnUpgStar')?.addEventListener('click', () => {
        const res = this.sim.upgradeBuildingStar(b.uid);
        this.showToast(res.msg, res.ok ? '🌟' : '🪙');
        this.renderInspector();
      });
      panel.querySelector('#btnMoveThis')?.addEventListener('click', () => {
        this.moveModeActive = true;
        this.movingBuildingUid = b.uid;
        this.rotation = b.rotation;
        this.inspectSelection = null;
        this.collapseBuildDock();
        this.refreshAll();
        this.showToast(`Đang nhấc "${item.name}" — Nhấp vào ô đất mới để đặt xuống!`, '✋');
      });
      return;
    }

    if (this.inspectSelection.kind === 'staff') {
      const targetStaffId = this.inspectSelection.id;
      const st = this.sim.staff.find((x) => x.id === targetStaffId);
      if (!st) {
        this.inspectSelection = null;
        panel.classList.add('hidden');
        this.syncHudFocusVisibility();
        return;
      }
      const pZone = this.sim.state.staffPatrolZones?.[st.id] ?? st.patrolZoneId ?? 'all';
      const unlockedSet = new Set(this.sim.state.unlockedZones);
      panel.classList.remove('hidden');
      panel.classList.remove('inspector-wide-ws');
      this.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${this.inspectorCollapsed ? '0' : '8px'};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${escapeHtml(st.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!this.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${this.inspectorCollapsed ? '▴' : '▾'}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>

        <div class="quest-card-mini" style="font-size:12.5px;margin-bottom:8px;">
          <strong>"${escapeHtml(st.actionText)}"</strong>
        </div>

        <div class="quest-card-mini" style="font-size:12px;margin-bottom:10px;">
          <label for="selInspPatrolZone" style="display:block;font-weight:800;margin-bottom:5px;">📍 Khu vực:</label>
          <select id="selInspPatrolZone" style="width:100%;padding:6px 8px;border-radius:8px;border:1.5px solid #9a5b1e;background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${pZone === 'all' ? 'selected' : ''}>🗺️ Toàn bộ</option>
            ${ZONES.filter((z) => this.sim.state.sandboxMode || unlockedSet.has(z.id))
              .map((z) => `<option value="${z.id}" ${pZone === z.id ? 'selected' : ''}>📍 ${z.name}</option>`)
              .join('')}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `;

      panel.querySelector('#btnToggleInspRollup')?.addEventListener('click', () => {
        this.inspectorCollapsed = !this.inspectorCollapsed;
        this.renderInspector();
      });
      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        this.inspectSelection = null;
        this.renderInspector();
      });
      panel.querySelector('#selInspPatrolZone')?.addEventListener('change', (e) => {
        const val = (e.currentTarget as HTMLSelectElement).value as ZoneId | 'all';
        this.sim.setStaffPatrolZone(st.id, val);
        this.showToast(`Đã phân công khu tuần tra cho ${st.name}!`, '📍');
      });
      panel.querySelector('#btnPickInspStaff')?.addEventListener('click', () => {
        this.pincerActive = true;
        this.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        this.inspectSelection = null;
        this.refreshAll();
      });
      return;
    }

    if (this.inspectSelection.kind === 'zone') {
      const z = getZoneById(this.inspectSelection.zoneId);
      const zStars = getZonePuzzleStarCost(z);
      const canLv = this.sim.state.level >= z.unlockLevel || this.sim.state.sandboxMode;
      panel.classList.remove('hidden');
      panel.classList.remove('inspector-wide-ws');
      this.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${this.inspectorCollapsed ? '0' : '8px'};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${escapeHtml(z.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!this.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${this.inspectorCollapsed ? '▴' : '▾'}</button>
            <button id="btnCloseInsp" type="button" class="brass-btn" aria-label="Đóng bảng chi tiết" style="padding:3px 8px;">✕</button>
          </div>
        </div>
        <div style="font-size:12.5px;margin-bottom:10px;font-weight:700;">
          🔒 Lv.${z.unlockLevel} • <strong>🌟 ${zStars}</strong>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${canLv ? 'gold-cta' : ''}" style="width:100%;">
          🔓 Mở (🌟 ${zStars})
        </button>
      `;
      panel.querySelector('#btnToggleInspRollup')?.addEventListener('click', () => {
        this.inspectorCollapsed = !this.inspectorCollapsed;
        this.renderInspector();
      });
      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        this.inspectSelection = null;
        this.renderInspector();
      });
      panel.querySelector('#btnConfirmUnlockZone')?.addEventListener('click', () => {
        const res = this.sim.unlockZone(z.id);
        this.showToast(res.msg, res.ok ? '✨' : '🔒');
        if (res.ok) {
          this.inspectSelection = null;
          this.renderInspector();
        }
      });
    }
  }

  private renderFinanceDialog(): void {
    const box = this.root.querySelector('#financeDialogContent') as HTMLElement;
    const f = this.sim.state.finance;
    const totalIn = f.gateRevenue + f.ticketRevenue + f.shopRevenue + f.harvestRevenue;
    const totalOut = f.staffWagesPaid + f.constructionSpent;
    const net = totalIn - totalOut;
    const wagePerCycle = this.sim.getHourlyStaffWage();

    box.innerHTML = `
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${f.harvestRevenue.toLocaleString('vi-VN')} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(f.shopRevenue + f.ticketRevenue + f.gateRevenue).toLocaleString('vi-VN')} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${totalIn.toLocaleString('vi-VN')} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${f.constructionSpent.toLocaleString('vi-VN')} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${wagePerCycle}G/ca):</span><strong>-${f.staffWagesPaid.toLocaleString('vi-VN')} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${net >= 0 ? '#15803d' : '#b45309'};">
              <span>Ròng:</span><strong>${net >= 0 ? '+' : ''}${net.toLocaleString('vi-VN')} G</strong>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private renderAlbumDialog(): void {
    const box = this.root.querySelector('#albumDialogContent') as HTMLElement;
    const st = this.sim.state;

    const houses: Array<{ house: HouseName; icon: string; color: string; pts: number }> = [
      { house: 'Gryffindor', icon: '🦁', color: '#b91c1c', pts: st.housePoints.Gryffindor ?? 0 },
      { house: 'Slytherin', icon: '🐍', color: '#047857', pts: st.housePoints.Slytherin ?? 0 },
      { house: 'Ravenclaw', icon: '🦅', color: '#1d4ed8', pts: st.housePoints.Ravenclaw ?? 0 },
      { house: 'Hufflepuff', icon: '🦡', color: '#ca8a04', pts: st.housePoints.Hufflepuff ?? 0 },
    ];
    houses.sort((a, b) => b.pts - a.pts);

    const totalPts = houses.reduce((acc, h) => acc + h.pts, 0);
    const milestoneTarget = st.houseCupMilestoneTier * 300;
    const canClaimCup = totalPts >= milestoneTarget;

    box.innerHTML = `
      <div class="quest-card-mini" style="padding:13px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div style="font-size:15px;font-weight:800;">🏆 Cúp 4 Nhà</div>
          <span style="font-size:12px;font-weight:700;color:#78350f;">${totalPts} / ${milestoneTarget}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px;">
          ${houses
            .map(
              (h, idx) => `
              <div style="background:rgba(255,255,255,0.65);border:2px solid ${h.color};border-radius:10px;padding:8px;">
                <div style="font-size:13px;font-weight:800;color:${h.color};">${idx === 0 ? '👑 ' : ''}${h.icon} ${h.house}</div>
                <div style="font-size:16px;font-weight:800;margin-top:2px;">${h.pts} đ</div>
              </div>
            `
            )
            .join('')}
        </div>
        <progress max="${milestoneTarget}" value="${Math.min(milestoneTarget, totalPts)}"></progress>
        ${
          canClaimCup
            ? `<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🏆 Nhận Cúp Đợt ${st.houseCupMilestoneTier}</button>`
            : ''
        }
      </div>
    `;

    box.querySelector('#btnClaimHouseCup')?.addEventListener('click', () => {
      if (this.sim.claimHouseCupReward()) {
        this.renderAlbumDialog();
      }
    });
  }

  private renderQuestDialog(): void {
    const box = this.root.querySelector('#questDialogContent') as HTMLElement;
    const barn = this.sim.ensureFarmBarn();
    const story = this.sim.getActiveStoryQuest();
    const autoAct = this.sim.getStoryAutoActionPreview();
    const readyOwlCount = this.sim.getReadyOwlOrdersCount();
    const readyQuestCount =
      (story?.completed ? 1 : 0) +
      this.sim.state.owlQuests.filter((q) => q.completed && !q.claimed).length +
      this.sim.state.dailyQuests.filter((q) => q.completed && !q.claimed).length;

    if (
      !this.selectedOwlOrderId ||
      !barn.owlOrders.some((o) => o.id === this.selectedOwlOrderId)
    ) {
      const firstReady = barn.owlOrders.find((o) => this.sim.canFulfillFarmOwlOrder(o));
      this.selectedOwlOrderId = (firstReady ?? barn.owlOrders[0])?.id ?? null;
    }

    const tabsSwitchHtml = `
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${this.activeQuestTab === 'orders'}" aria-pressed="${this.activeQuestTab === 'orders'}" class="brass-btn">
          🦉 Đơn Cú (${readyOwlCount}/${barn.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${this.activeQuestTab === 'quests'}" aria-pressed="${this.activeQuestTab === 'quests'}" class="brass-btn">
          📖 Nhiệm Vụ ${readyQuestCount > 0 ? `(${readyQuestCount})` : ''}
        </button>
      </div>
    `;

    if (this.activeQuestTab === 'orders') {
      const selectedOrder =
        barn.owlOrders.find((o) => o.id === this.selectedOwlOrderId) ?? barn.owlOrders[0];
      const canSendSelected = selectedOrder
        ? this.sim.canFulfillFarmOwlOrder(selectedOrder)
        : false;

      const pinNotesHtml = barn.owlOrders
        .map((order) => {
          const isSel = selectedOrder?.id === order.id;
          const isReady = this.sim.canFulfillFarmOwlOrder(order);
          const avatarHtml = order.portraitSprite
            ? `<img src="/sprites/${order.portraitSprite}.png" alt="${escapeHtml(order.senderName)}" class="owl-note-portrait" />`
            : `<span class="owl-note-emoji">${escapeHtml(order.portraitEmoji)}</span>`;
          const miniIcons = order.requirements
            .slice(0, 3)
            .map((req) => {
              const m = getFarmItemMeta(req.itemId);
              return `<img src="${m.iconSrc}" alt="${escapeHtml(m.name)}" title="${req.qty} ${escapeHtml(m.name)}" class="owl-note-mini-item" />`;
            })
            .join('');

          return `
            <button
              type="button"
              class="owl-pin-note ${isSel ? 'selected' : ''} ${isReady ? 'ready' : ''}"
              data-select-owl="${escapeHtml(order.id)}"
            >
              <span class="owl-red-pin" aria-hidden="true"></span>
              <div class="owl-note-avatar-box">${avatarHtml}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${escapeHtml(order.senderName)}</div>
                <div class="owl-note-mini-row">${miniIcons}</div>
                ${order.isFeastMarquee ? '<span class="owl-feast-tag">🎪 Tiệc</span>' : ''}
              </div>
              ${isReady ? '<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>' : ''}
            </button>
          `;
        })
        .join('');

      const detailHtml = selectedOrder
        ? `
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${escapeHtml(selectedOrder.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${escapeHtml(selectedOrder.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
              </button>
            </div>

            <div class="owl-req-list">
              ${selectedOrder.requirements
                .map((req, reqIdx) => {
                  const meta = getFarmItemMeta(req.itemId);
                  const have = this.sim.getFarmItemCount(req.itemId);
                  const social = this.sim.ensureNeighborSocial();
                  const owlHelpLeft = Math.max(
                    0,
                    MAX_DAILY_OWL_HELP_REQUESTS - social.dailyOwlHelpRequestedCount
                  );
                  const helpReq = this.sim.getOwlRequirementHelpState(selectedOrder.id, reqIdx);
                  const helpedByFriend = Boolean(helpReq?.fulfilledAt);
                  const ok = this.sim.state.sandboxMode || helpedByFriend || have >= req.qty;
                  const coOpControlHtml = helpedByFriend
                    ? `<span class="owl-help-tag done">✓ ${escapeHtml(helpReq?.helperEmoji ?? '🦉')}</span>`
                    : helpReq
                      ? `<span class="owl-help-tag waiting">🦉 Đang gọi...</span>`
                      : !ok
                        ? `<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${reqIdx}" ${owlHelpLeft <= 0 ? 'disabled' : ''} title="Nhờ bạn">🤝 Nhờ (${owlHelpLeft})</button>`
                        : `<span class="owl-req-status">✓</span>`;
                  return `
                    <div class="owl-req-row ${ok ? 'ok' : 'lack'}">
                      <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${escapeHtml(meta.name)}</div>
                        <div class="owl-req-count">${helpedByFriend ? '✓' : `${this.sim.state.sandboxMode ? '∞' : have}/${req.qty}`}</div>
                      </div>
                      ${coOpControlHtml}
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${selectedOrder.rewardGalleons}</span>
                <span class="owl-rew-pill xp">⭐ +${selectedOrder.rewardXp}</span>
                ${
                  selectedOrder.rewardMugglePlug
                    ? `<span class="owl-rew-pill plug">🔌 +${selectedOrder.rewardMugglePlug}</span>`
                    : ''
                }
                ${
                  (selectedOrder.isFeastMarquee || (barn.ordersDelivered + 1) % 3 === 0) &&
                  this.sim.getPhoenixTalismanCount() < MAX_PHOENIX_TALISMANS
                    ? `<span class="owl-rew-pill plug">🔥 +1</span>`
                    : ''
                }
              </div>
            </div>
          </div>
        `
        : '';

      box.innerHTML = `
        ${tabsSwitchHtml}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${pinNotesHtml}</div>
            ${detailHtml}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${canSendSelected ? 'ready' : 'not-ready'}"
            >
              🦉 ${canSendSelected ? 'Giao Hàng!' : 'Mở Kho'}
            </button>
          </div>
        </div>
      `;

      box.querySelectorAll<HTMLButtonElement>('[data-qtab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.activeQuestTab = btn.dataset.qtab as 'orders' | 'quests';
          this.renderQuestDialog();
        });
      });

      box.querySelectorAll<HTMLButtonElement>('[data-select-owl]').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.selectedOwlOrderId = btn.dataset.selectOwl ?? null;
          this.renderQuestDialog();
        });
      });

      box.querySelector('#btnRefreshOwlOrder')?.addEventListener('click', () => {
        if (selectedOrder) {
          this.sim.refreshFarmOwlOrder(selectedOrder.id);
          this.selectedOwlOrderId = null;
          this.renderQuestDialog();
        }
      });

      box.querySelectorAll<HTMLButtonElement>('[data-ask-owl-help]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!selectedOrder) return;
          const reqIdx = Number(btn.dataset.askOwlHelp);
          if (!Number.isFinite(reqIdx)) return;
          const res = this.sim.requestPlayerOwlCrateHelp(selectedOrder.id, reqIdx);
          if (!res.ok) {
            this.showToast(res.msg, '⚠️');
          }
          this.renderQuestDialog();
        });
      });

      box.querySelector('#btnSendOwlOrder')?.addEventListener('click', () => {
        if (!selectedOrder) return;
        if (!this.sim.canFulfillFarmOwlOrder(selectedOrder)) {
          const res = this.sim.fulfillFarmOwlOrder(selectedOrder.id);
          this.showToast(res.msg, '🧺');
          (this.root.querySelector('#questDialog') as HTMLDialogElement).close();
          this.openWorkshopDialog('barn');
          return;
        }
        const sent = this.sim.fulfillFarmOwlOrder(selectedOrder.id);
        if (sent.ok) {
          this.showToast(sent.msg, '🦉');
        }
        this.selectedOwlOrderId = null;
        this.renderQuestDialog();
      });
      return;
    }

    const renderCard = (q: NonNullable<typeof story>, tag: string, isStory = false) => {
      const pct = Math.min(100, Math.round((q.progress / Math.max(1, q.targetAmount)) * 100));
      return `
        <div class="quest-card-mini" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;">${escapeHtml(q.giverEmoji)} ${escapeHtml(q.title)}</span>
            <span style="font-size:12px;font-weight:700;color:#92400e;">${escapeHtml(tag)}</span>
          </div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;">
            <span>${Math.min(q.progress, q.targetAmount)}/${q.targetAmount}</span>
            <span>🪙${q.rewardGalleons} • ⭐${q.rewardXp} ${q.rewardTimeSand > 0 ? `• ⏳${q.rewardTimeSand}` : ''}</span>
          </div>
          ${
            q.claimed
              ? `<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>`
              : q.completed
                ? `<button type="button" data-modal-claim="${escapeHtml(q.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`
                : isStory
                  ? `<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${escapeHtml(autoAct.shortLabel)}</button>`
                  : ''
          }
        </div>
      `;
    };

    const reqTrial = this.sim.getRequiredLevelTrial();
    const wpModal = this.sim.getWinsProgressForCurrentLevel();
    const fmtStagePill = (k: MinigameTrialKind) => {
      const inf = this.sim.getDisciplineStageInfo(k);
      return inf.isMaxed ? `👑777` : `${inf.currentStage}/777`;
    };
    const trialBannerHtml =
      reqTrial && !this.sim.state.sandboxMode && !this.sim.isHeadmasterPreview
        ? `
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${wpModal.current}/${wpModal.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${reqTrial.kind === 'match3' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🍓 (${fmtStagePill('match3')})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${reqTrial.kind === 'caro' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${fmtStagePill('caro')})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${reqTrial.kind === 'sudoku' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🔮 (${fmtStagePill('sudoku')})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${reqTrial.kind === 'chess' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🏰 (${fmtStagePill('chess')})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${reqTrial.kind === 'blocks' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🦄 (${fmtStagePill('blocks')})</button>
            </div>
          </div>
        </div>
      `
        : '';

    const storyChapterTag = story
      ? `Ch.${story.chapter ?? 1} • ${this.sim.state.storyQuestIndex + 1}/${STORY_QUESTS.length}`
      : '';

    box.innerHTML = `
      ${tabsSwitchHtml}
      ${trialBannerHtml}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${story ? renderCard(story, storyChapterTag, true) : `<div class="quest-card-mini">🎉 Đã hoàn thành!</div>`}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${this.sim.state.owlQuests.map((q) => renderCard(q, 'Xoay vòng')).join('')}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${this.sim.state.dailyQuests.map((q) => renderCard(q, '00:00')).join('')}
      </div>
    `;

    box.querySelectorAll<HTMLButtonElement>('[data-qtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeQuestTab = btn.dataset.qtab as 'orders' | 'quests';
        this.renderQuestDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-modal-open-trial]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.modalOpenTrial as MinigameTrialKind | undefined;
        (this.root.querySelector('#questDialog') as HTMLDialogElement)?.close();
        this.openTrialMinigame(kind);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-modal-claim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.sim.claimQuest(btn.dataset.modalClaim!);
        this.renderQuestDialog();
      });
    });

    box.querySelector('#btnModalStarStory')?.addEventListener('click', () => {
      const res = this.sim.completeStoryStepWithStar();
      if (res.ok) {
        if (typeof res.placedGx === 'number' && typeof res.placedGy === 'number') {
          centerCameraOnGrid(this.cam, res.placedGx, res.placedGy);
        }
        this.renderQuestDialog();
      } else {
        this.showToast(res.msg, res.reason === 'missing_gold' ? '🪙' : '🌟');
        if (
          res.reason === 'missing_stars' ||
          res.reason === 'locked_level' ||
          res.reason === 'open_match3'
        ) {
          (this.root.querySelector('#questDialog') as HTMLDialogElement).close();
          this.openTrialMinigame();
        }
      }
    });
  }

  private renderRoadmapDialog(): void {
    const box = this.root.querySelector('#roadmapDialogContent') as HTMLElement;
    const unlockedSet = new Set(this.sim.state.unlockedZones);
    const reqTrial = this.sim.getRequiredLevelTrial();

    const zonesHtml = ZONES.map((z) => {
      const isOpen = unlockedSet.has(z.id) || this.sim.state.sandboxMode;
      const canOpen = !isOpen && this.sim.state.level >= z.unlockLevel;
      const zStarCost = getZonePuzzleStarCost(z);
      return `
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${isOpen ? '✅' : '🌫️'} ${z.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${z.unlockLevel} • ${zStarCost > 0 ? `🌟 ${zStarCost}` : '✓'}</span>
            <div style="display:flex;gap:5px;">
              <button type="button" data-cam-zone="${z.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
              ${
                canOpen
                  ? `<button type="button" data-unlock-zone="${z.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }).join('');

    const milestones = LEVELS.filter(
      (l) => l.unlockedItemIds.length > 0 || l.unlockedZoneId || l.milestoneNote || l.level % 10 === 0
    );

    box.innerHTML = `
      ${
        reqTrial && !this.sim.state.sandboxMode && !this.sim.isHeadmasterPreview
          ? (() => {
              const wpR = this.sim.getWinsProgressForCurrentLevel();
              return `<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${this.sim.state.level} (${wpR.current}/${wpR.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`;
            })()
          : ''
      }
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${zonesHtml}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${milestones
          .map((m) => {
            const reached = this.sim.state.level >= m.level;
            const itemNames = m.unlockedItemIds
              .map((id) => getCatalogItem(id)?.name)
              .filter(Boolean)
              .join(', ');
            return `
              <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${reached ? '1' : '0.78'};">
                <div>
                  <span style="font-weight:800;font-size:13px;">${reached ? '🌟' : '🔒'} Lv.${m.level}</span>
                  ${itemNames ? `<span style="font-size:12px;margin-left:6px;">${itemNames}</span>` : ''}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${m.rewardGalleons}</span>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

    box.querySelector('#btnRoadmapPlayTrial')?.addEventListener('click', () => {
      (this.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.close();
      this.openTrialMinigame();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-cam-zone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const z = getZoneById(btn.dataset.camZone as ZoneId);
        centerCameraOnGrid(this.cam, (z.x1 + z.x2) * 0.5, (z.y1 + z.y2) * 0.5);
        (this.root.querySelector('#roadmapDialog') as HTMLDialogElement).close();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-unlock-zone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.unlockZone(btn.dataset.unlockZone as ZoneId);
        this.showToast(res.msg, res.ok ? '✨' : '🔒');
        this.renderRoadmapDialog();
      });
    });
  }

  private updateWorkshopLiveTimers(): void {
    const box = this.root.querySelector('#workshopDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const now = Date.now();
    const curBrewId = st.supply.activeBrew?.goodId ?? null;

    if (curBrewId !== this.lastWsBrewId) {
      this.renderWorkshopDialog();
      return;
    }

    if (this.activeWorkshopTab === 'brew') {
      const herbBtn = box.querySelector('#btnWsQuickHerb') as HTMLButtonElement | null;
      if (herbBtn) {
        const herbWait = Math.max(
          0,
          Math.ceil((20_000 - (now - (st.supply.lastHerbPlotHarvestAt || 0))) / 1000)
        );
        const ready = herbWait === 0 || st.sandboxMode;
        herbBtn.classList.toggle('gold-cta', ready);
        herbBtn.textContent = ready
          ? '🌿 Hái Thảo Dược'
          : `🌱 (${herbWait}s)`;
      }

      const brewLbl = box.querySelector('[data-ws-brew-left]') as HTMLElement | null;
      if (brewLbl && st.supply.activeBrew) {
        const brewRec = CRAFT_RECIPES.find((r) => r.id === st.supply.activeBrew?.goodId);
        const brewLeftSec = Math.max(0, Math.ceil((st.supply.activeBrew.endsAt - now) / 1000));
        if (brewRec) {
          brewLbl.textContent = `🔥 ${brewRec.emoji} ${brewRec.name} (${brewLeftSec}s)`;
        }
      }

      const buffBox = box.querySelector('[data-ws-buff-banner]') as HTMLElement | null;
      if (buffBox) {
        const bbLeft = Math.max(0, Math.ceil(((st.supply.butterbeerBoostEndsAt || 0) - now) / 1000));
        const fxLeft = Math.max(0, Math.ceil(((st.supply.felixBoostEndsAt || 0) - now) / 1000));
        if (bbLeft <= 0 && fxLeft <= 0) {
          buffBox.classList.add('hidden');
        } else {
          buffBox.classList.remove('hidden');
          const parts: string[] = [];
          if (bbLeft > 0) parts.push(`🍻 +85%G (${bbLeft}s)`);
          if (fxLeft > 0) parts.push(`🧪 +35%XP (${fxLeft}s)`);
          buffBox.textContent = `✨ ${parts.join(' • ')}`;
        }
      }
    }
  }

  private renderWorkshopDialog(): void {
    const box = this.root.querySelector('#workshopDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const now = Date.now();
    this.lastWsBrewId = st.supply.activeBrew?.goodId ?? null;
    const activeSynCount = this.sim.activeSynergies.activeIds.size;
    const cratesDone = st.supply.cargoCrates.filter((c) => c.fulfilled).length;

    const barn = this.sim.ensureFarmBarn();
    const barnUsed = this.sim.getBarnTotalUsed();

    const tabsHtml = `
      <div class="workshop-tabs" role="group" aria-label="Kho & Xưởng">
        <button type="button" data-ws-tab="barn" data-active="${this.activeWorkshopTab === 'barn'}" aria-pressed="${this.activeWorkshopTab === 'barn'}" class="brass-btn">
          🏡 Kho (${barnUsed}/${barn.capacity})
        </button>
        <button type="button" data-ws-tab="brew" data-active="${this.activeWorkshopTab === 'brew'}" aria-pressed="${this.activeWorkshopTab === 'brew'}" class="brass-btn">
          🧪 Vạc Phép
        </button>
        <button type="button" data-ws-tab="cargo" data-active="${this.activeWorkshopTab === 'cargo'}" aria-pressed="${this.activeWorkshopTab === 'cargo'}" class="brass-btn">
          🚂 Tàu (${cratesDone}/3)
        </button>
        <button type="button" data-ws-tab="synergy" data-active="${this.activeWorkshopTab === 'synergy'}" aria-pressed="${this.activeWorkshopTab === 'synergy'}" class="brass-btn">
          🌟 Combo (${activeSynCount}/12)
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (this.activeWorkshopTab === 'barn') {
      const capPct = Math.min(100, Math.round((barnUsed / Math.max(1, barn.capacity)) * 100));
      const tier = Math.max(1, Math.round((barn.capacity - 40) / 20));
      const upgGold = 160 + tier * 90;
      const plugs = barn.goods.muggle_plug_kit ?? 0;

      const renderStockCards = (ids: FarmItemId[]) =>
        ids
          .map((id) => {
            const meta = getFarmItemMeta(id);
            const qty = this.sim.getFarmItemCount(id);
            return `
              <div class="barn-stock-card ${qty > 0 ? 'in-stock' : 'empty'}">
                <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${escapeHtml(meta.name)}</div>
                <div class="barn-stock-qty"><strong>×${st.sandboxMode ? '∞' : qty}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${qty > 0 || st.sandboxMode ? 'gold-cta' : ''}"
                  data-sell-farm-item="${id}"
                  ${qty <= 0 && !st.sandboxMode ? 'disabled' : ''}
                  style="width:100%;padding:4px 8px;font-size:11.5px;"
                >
                  🪙 +${meta.sellValue}G
                </button>
              </div>
            `;
          })
          .join('');

      const talCount = this.sim.getPhoenixTalismanCount();
      const craftGood = this.sim.getCraftablePhoenixBarnGood();
      const craftMeta = craftGood ? getFarmItemMeta(craftGood) : null;
      const canForgeTalisman =
        st.sandboxMode ||
        (talCount < MAX_PHOENIX_TALISMANS &&
          Boolean(craftGood) &&
          st.galleons >= PHOENIX_FORGE_GOLD_COST);

      bodyHtml = `
        <div class="barn-header-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="font-size:15px;font-weight:900;">🏡 Kho Đỏ (${barnUsed}/${barn.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${barn.ordersDelivered} • 🔌 ×${plugs}
              </div>
            </div>
            <button id="btnUpgradeFarmBarn" type="button" class="owl-green-send-btn" style="padding:7px 14px;font-size:12.5px;">
              🔌 +20 Ô (1🔌 + 🪙${upgGold})
            </button>
          </div>
          <div class="quest-bar" style="height:10px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${capPct}%"></div>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <div class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${st.sandboxMode ? '∞' : `${talCount}/${MAX_PHOENIX_TALISMANS}`})
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${!canForgeTalisman ? 'disabled' : ''}
            style="padding:8px 13px;font-size:12.5px;"
          >
            🔥 Rèn +1 (${craftMeta ? `1 ${escapeHtml(craftMeta.name)}` : '1 Đặc sản'} + ${PHOENIX_FORGE_GOLD_COST}G)
          </button>
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:12px 0 6px;">🌾 Nông Sản (${Object.keys(FARM_CROPS).length})</h3>
        <div class="barn-stock-grid">
          ${renderStockCards(Object.keys(FARM_CROPS) as FarmItemId[])}
        </div>

        <h3 style="font-size:14.5px;font-weight:900;margin:14px 0 6px;">🥧 Đặc Sản (${Object.keys(FARM_GOODS).length})</h3>
        <div class="barn-stock-grid">
          ${renderStockCards(Object.keys(FARM_GOODS) as FarmItemId[])}
        </div>
      `;
    } else if (this.activeWorkshopTab === 'brew') {
      const herbWait = Math.max(
        0,
        Math.ceil((20_000 - (now - (st.supply.lastHerbPlotHarvestAt || 0))) / 1000)
      );
      const bbLeft = Math.max(0, Math.ceil(((st.supply.butterbeerBoostEndsAt || 0) - now) / 1000));
      const fxLeft = Math.max(0, Math.ceil(((st.supply.felixBoostEndsAt || 0) - now) / 1000));
      const activeBrew = st.supply.activeBrew;
      const brewRec = activeBrew ? CRAFT_RECIPES.find((r) => r.id === activeBrew.goodId) : undefined;
      const brewLeftSec = activeBrew ? Math.max(0, Math.ceil((activeBrew.endsAt - now) / 1000)) : 0;

      const ingKeys: RawIngredientId[] = [
        'mandrake_leaf',
        'sweet_pumpkin',
        'starlight_dust',
        'magic_cacao',
      ];

      bodyHtml = `
        <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${herbWait === 0 || st.sandboxMode ? 'gold-cta' : ''}">
            ${herbWait > 0 && !st.sandboxMode ? `🌱 (${herbWait}s)` : '🌿 Hái Thảo Dược'}
          </button>
        </div>

        <div class="ingredient-bar">
          ${ingKeys
            .map((k) => {
              const info = RAW_INGREDIENTS_INFO[k];
              const qty = st.supply.ingredients[k] ?? 0;
              return `
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;">
                    <span>${info.emoji} ${info.name}</span>
                    <span style="color:#b45309;">×${st.sandboxMode ? '∞' : qty}</span>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>

        ${
          bbLeft > 0 || fxLeft > 0
            ? `
              <div data-ws-buff-banner="1" class="quest-card-mini" style="margin-bottom:12px;background:rgba(220,252,231,0.75);border-color:#16a34a;font-size:12.5px;font-weight:800;color:#15803d;">
                ✨ ${bbLeft > 0 ? `🍻 +85%G (${bbLeft}s) ` : ''}${fxLeft > 0 ? `• 🧪 +35%XP (${fxLeft}s)` : ''}
              </div>
            `
            : ''
        }

        ${
          activeBrew && brewRec
            ? `
              <div class="quest-card-mini" style="margin-bottom:12px;border-color:#9333ea;background:rgba(243,232,255,0.82);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13.5px;font-weight:800;color:#6b21a8;">
                    🔥 ${brewRec.emoji} ${escapeHtml(brewRec.name)} (${brewLeftSec}s)
                  </div>
                  <button id="btnWsSpeedBrew" type="button" class="brass-btn gold-cta" style="padding:4px 10px;">
                    ⏳ 1 Cát
                  </button>
                </div>
              </div>
            `
            : ''
        }

        <div class="grid-2col">
          ${CRAFT_RECIPES.map((rec) => {
            const stock = st.supply.goods[rec.id] ?? 0;
            const dur = this.sim.getBrewDurationSec(rec);
            const reqText = Object.entries(rec.inputs)
              .map(([k, q]) => {
                const inf = RAW_INGREDIENTS_INFO[k as RawIngredientId];
                const have = st.supply.ingredients[k as RawIngredientId] ?? 0;
                const ok = st.sandboxMode || have >= (q ?? 0);
                return `<span style="color:${ok ? '#15803d' : '#dc2626'};font-weight:800;">${inf.emoji} ${have}/${q}</span>`;
              })
              .join(' • ');

            return `
              <div class="quest-card-mini" style="padding:12px;display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:14px;font-weight:800;">${rec.emoji} ${rec.name}</span>
                    <span style="font-size:12px;font-weight:800;color:#7c2d12;">×${st.sandboxMode ? '∞' : stock}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${reqText}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${rec.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${dur}s)
                  </button>
                  <button type="button" data-use-good="${rec.id}" class="brass-btn" style="flex:1;">
                    ${rec.directUseLabel}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (this.activeWorkshopTab === 'cargo') {
      const bonusG = Math.round(240 + st.level * 40);
      const bonusXp = Math.round(160 + st.level * 25);
      bodyHtml = `
        <div class="quest-card-mini" style="padding:13px;margin-bottom:14px;background:rgba(254,243,199,0.85);border-color:#b45309;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div style="font-size:15px;font-weight:800;color:#7c2d12;">
              🚂 Tàu #${st.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:800;">🎁 +${bonusG.toLocaleString('vi-VN')}🪙 +${bonusXp}⭐ +2⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${st.supply.cargoCrates
            .map((crate, idx) => {
              const rec = CRAFT_RECIPES.find((r) => r.id === crate.goodId)!;
              const have = st.supply.goods[crate.goodId] ?? 0;
              const canLoad = !crate.fulfilled && (st.sandboxMode || have >= crate.qtyRequired);
              return `
                <div class="crate-card ${crate.fulfilled ? 'done' : ''}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:#92400e;">
                      <span>#${idx + 1}</span>
                      <span>${crate.fulfilled ? '✅' : `${st.sandboxMode ? '∞' : have}/${crate.qtyRequired}`}</span>
                    </div>
                    <div style="font-size:15px;font-weight:800;margin:6px 0;">${rec.emoji} ${rec.name} ×${crate.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${crate.rewardGalleons}🪙 • +${crate.rewardXp}⭐ • +${crate.rewardTimeSand}⏳
                    </div>
                  </div>
                  ${
                    crate.fulfilled
                      ? `<div style="font-size:12.5px;font-weight:800;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>`
                      : canLoad
                        ? `<button type="button" data-fulfill-crate="${crate.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất Hàng</button>`
                        : `<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu</button>`
                  }
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="grid-2col">
          ${DISTRICT_SYNERGIES.map((syn) => {
            const active = this.sim.activeSynergies.activeIds.has(syn.id);
            const names = syn.requiredItems
              .map((id) => getCatalogItem(id)?.name ?? id)
              .join(' + ');
            return `
              <div class="quest-card-mini" style="padding:11px;border-color:${active ? '#d97706' : 'rgba(138,90,43,0.3)'};background:${active ? 'rgba(254,243,199,0.9)' : 'rgba(255,251,240,0.68)'};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span style="font-size:13.5px;font-weight:800;">${syn.emoji} ${escapeHtml(syn.name)}</span>
                  <span style="font-size:12px;font-weight:800;color:${active ? '#15803d' : '#78350f'};">
                    ${active ? '✅' : `≤${syn.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">🔗 ${names}</div>
                <div style="font-size:12px;font-weight:800;color:#15803d;">
                  +${syn.goldBonusPct}%G • +${syn.xpBonusPct}%XP
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    box.innerHTML = tabsHtml + bodyHtml;

    box.querySelectorAll<HTMLButtonElement>('[data-ws-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeWorkshopTab = btn.dataset.wsTab as typeof this.activeWorkshopTab;
        this.renderWorkshopDialog();
      });
    });

    box.querySelector('#btnUpgradeFarmBarn')?.addEventListener('click', () => {
      const res = this.sim.upgradeFarmBarn();
      this.showToast(res.msg, res.ok ? '🏡' : '🔌');
      this.renderWorkshopDialog();
      this.refreshHeader();
    });

    box.querySelector('#btnCraftPhoenixTalisman')?.addEventListener('click', () => {
      const res = this.sim.craftPhoenixTalismanFromBarn();
      this.showToast(res.msg, res.ok ? '🔥' : '🧺');
      this.renderWorkshopDialog();
      this.refreshHeader();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-sell-farm-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.sellFarmItemFromBarn(btn.dataset.sellFarmItem as FarmItemId, 1);
        if (!res.ok) {
          this.showToast(res.msg, '🧺');
        }
        this.renderWorkshopDialog();
        this.refreshHeader();
      });
    });

    box.querySelector('#btnWsQuickHerb')?.addEventListener('click', () => {
      const res = this.sim.quickHarvestHerbs();
      this.showToast(res.msg, res.ok ? '🌿' : '⏳');
      this.renderWorkshopDialog();
    });

    box.querySelector('#btnWsSpeedBrew')?.addEventListener('click', () => {
      if (this.sim.speedUpBrewing()) {
        this.renderWorkshopDialog();
      }
    });

    box.querySelectorAll<HTMLButtonElement>('[data-brew-good]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.startBrewing(btn.dataset.brewGood as CraftedGoodId);
        this.showToast(res.msg, res.ok ? '🧪' : '⚠️');
        this.renderWorkshopDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-use-good]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.useGood as CraftedGoodId;
        const res = this.sim.useCraftedGood(gid);
        if (!res.ok) {
          this.showToast(res.msg, '⚠️');
        } else if (gid === 'dragon_firework') {
          (this.root.querySelector('#workshopDialog') as HTMLDialogElement).close();
        } else {
          this.renderWorkshopDialog();
        }
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-fulfill-crate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.fulfillCargoCrate(btn.dataset.fulfillCrate!);
        this.showToast(res.msg, res.ok ? '📦' : '⚠️');
        this.renderWorkshopDialog();
        this.refreshHeader();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-goto-brew]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeWorkshopTab = 'brew';
        this.renderWorkshopDialog();
      });
    });
  }

  private renderSettingsDialog(): void {
    const box = this.root.querySelector('#settingsDialogContent') as HTMLElement;
    const st = this.sim.state;
    const toonOn = this.sprites ? this.sprites.isToonEnabled() : true;

    box.innerHTML = `
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎵 Âm Thanh &amp; Hiển Thị</div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            <label class="switch-row">
              <span>🎼 Nhạc nền (BGM)</span>
              <input id="swBgm" type="checkbox" switch ${st.settings.bgmEnabled ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>🔔 Âm hiệu ứng (SFX)</span>
              <input id="swSfx" type="checkbox" switch ${st.settings.soundEnabled ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>👁️ Nhìn xuyên nhà (V)</span>
              <input id="swCutaway" type="checkbox" switch ${st.settings.cutawayMode ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>✨ Hiện lưới ô</span>
              <input id="swGrid" type="checkbox" switch ${st.settings.showGrid ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>♾️ Sandbox</span>
              <input id="swSandbox" type="checkbox" switch ${st.sandboxMode ? 'checked' : ''} />
            </label>
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${(['realtime', 'dawn', 'day', 'dusk', 'night'] as TimeOverride[])
              .map((t) => {
                const labels: Record<TimeOverride, string> = {
                  realtime: '🕒 24h',
                  dawn: '🌅 Bình minh',
                  day: '☀️ Ngày',
                  dusk: '🌇 Chiều',
                  night: '🌙 Đêm',
                };
                return `<button type="button" data-time="${t}" data-active="${st.settings.timeOverride === t}" aria-pressed="${st.settings.timeOverride === t}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[t]}</button>`;
              })
              .join('')}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${(['auto', 'halloween', 'christmas', 'quidditch_cup'] as Array<'auto' | FestivalType>)
              .map((f) => {
                const labels: Record<string, string> = {
                  auto: '🎪 Tự động',
                  halloween: '🎃 Halloween',
                  christmas: '🎄 Giáng Sinh',
                  quidditch_cup: '🏆 Quidditch',
                };
                return `<button type="button" data-fest="${f}" data-active="${st.settings.activeFestival === f}" aria-pressed="${st.settings.activeFestival === f}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[f]}</button>`;
              })
              .join('')}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${(['auto', 'clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as WeatherOverride[])
              .map((w) => {
                const labels: Record<string, string> = {
                  auto: '🌦️ Tự động',
                  clear: '☀️ Nắng',
                  cloudy: '⛅ Mây',
                  rain: '🌧️ Mưa',
                  storm: '⛈️ Giông',
                  snow: '❄️ Tuyết',
                  fog: '🌫️ Sương',
                };
                return `<button type="button" data-weather="${w}" data-active="${st.settings.weatherOverride === w}" aria-pressed="${st.settings.weatherOverride === w}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[w]}</button>`;
              })
              .join('')}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${toonOn}" aria-pressed="${toonOn}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!toonOn}" aria-pressed="${!toonOn}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
          </div>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🔮 Tiện Ích</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta">
            📖 Hướng Dẫn
          </button>
          <button id="btnPreview100" type="button" class="brass-btn gold-cta">
            ${this.sim.isHeadmasterPreview ? '↩️ Về Save' : '🌾 Xem Lv.100'}
          </button>
          <button id="btnTestFireworks" type="button" class="brass-btn">
            🎆 Pháo Hoa
          </button>
          <button id="btnTestEscape" type="button" class="brass-btn">
            🐾 Thả Niffler
          </button>
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
          <label class="brass-btn" style="cursor:pointer;">
            📤 Nhập (.json)
            <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
          </label>
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:#ef4444;color:#fecaca;">
            🌱 Chơi Lại
          </button>
        </div>
      </div>
    `;

    // Enhance newly rendered switch inputs if polyfill is active
    if (!('switch' in HTMLInputElement.prototype)) {
      import('input-switch-polyfill').catch(() => {});
    }

    box.querySelector('#swBgm')?.addEventListener('change', (e) => {
      st.settings.bgmEnabled = (e.currentTarget as HTMLInputElement).checked;
      this.sim.audio.bgmEnabled = st.settings.bgmEnabled;
      this.sim.saveToStorage();
    });

    box.querySelector('#swSfx')?.addEventListener('change', (e) => {
      st.settings.soundEnabled = (e.currentTarget as HTMLInputElement).checked;
      this.sim.audio.enabled = st.settings.soundEnabled;
      this.sim.saveToStorage();
    });

    box.querySelector('#swCutaway')?.addEventListener('change', (e) => {
      st.settings.cutawayMode = (e.currentTarget as HTMLInputElement).checked;
      this.refreshAll();
    });

    box.querySelector('#swGrid')?.addEventListener('change', (e) => {
      st.settings.showGrid = (e.currentTarget as HTMLInputElement).checked;
      this.refreshAll();
    });

    box.querySelector('#swSandbox')?.addEventListener('change', (e) => {
      st.sandboxMode = (e.currentTarget as HTMLInputElement).checked;
      this.sim.saveToStorage();
      this.refreshAll();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-time]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.timeOverride = btn.dataset.time as TimeOverride;
        this.sim.saveToStorage();
        this.refreshHeader();
        this.renderSettingsDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-fest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.activeFestival = btn.dataset.fest as 'auto' | FestivalType;
        this.sim.saveToStorage();
        this.refreshHeader();
        this.renderSettingsDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-weather]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.weatherOverride = btn.dataset.weather as WeatherOverride;
        this.sim.saveToStorage();
        this.refreshHeader();
        this.renderSettingsDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-toon]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.dataset.toon === 'on';
        this.sprites?.setToonEnabled(on);
        this.refreshAll();
        this.renderSettingsDialog();
      });
    });

    box.querySelector('#btnTestFireworks')?.addEventListener('click', () => {
      (this.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      this.sim.launchFireworksShow(12);
    });

    box.querySelector('#btnTestEscape')?.addEventListener('click', () => {
      (this.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      this.sim.triggerPlayfulEscape();
    });

    box.querySelector('#btnReplayTutorial')?.addEventListener('click', () => {
      (this.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      this.tutorialMinimized = false;
      this.lastFocusedTutorialStepKey = '';
      this.sim.restartTutorial();
      this.panCameraToTutorialTarget();
      this.refreshAll();
    });

    box.querySelector('#btnPreview100')?.addEventListener('click', () => {
      this.match3Modal?.resetSession();
      this.sim.toggleHeadmasterPreview(100);
      this.refreshAll();
      this.renderSettingsDialog();
    });

    box.querySelector('#btnExportSave')?.addEventListener('click', () => {
      const blob = new Blob([this.sim.exportSaveJson()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cong-vien-harry-potter-lv${st.level}.json`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('Đã xuất file Save thành công!', '💾');
    });

    box.querySelector('#inpImportSave')?.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (this.sim.importSaveJson(String(reader.result))) {
          this.match3Modal?.resetSession();
          this.showToast('Đã khôi phục công viên thành công!', '✨');
          (this.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        } else {
          this.showToast('File Save không hợp lệ!', '⚠️');
        }
      };
      reader.readAsText(file);
    });

    box.querySelector('#btnResetPark')?.addEventListener('click', () => {
      if (window.confirm('Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?')) {
        this.match3Modal?.resetSession();
        this.sim.resetNewGame();
        centerCameraOnGrid(this.cam, 16.0, 18.0);
        (this.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        this.showToast('Chào mừng trở lại Trang Trại Hang Sóc bình yên!', '🏡');
      }
    });
  }

  private refreshSuitcaseBadge(): void {
    const badge = this.root.querySelector('#badgeSuitcaseCount') as HTMLElement | null;
    if (!badge) return;
    const summary = this.sim.getSuitcaseReadySummary();
    if (summary.badgeCount > 0) {
      badge.textContent = String(summary.badgeCount);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  private updateSuitcaseLiveTimers(): void {
    const box = this.root.querySelector('#suitcaseDialogContent') as HTMLElement | null;
    if (!box) return;
    const now = Date.now();
    const sc = this.sim.state.suitcase;
    const incReady = Boolean(sc.activeIncubation && now >= sc.activeIncubation.endsAt);
    const expReady = Boolean(sc.activeExpedition && now >= sc.activeExpedition.endsAt);

    if (
      (incReady !== this.lastSuitcaseIncReady || expReady !== this.lastSuitcaseExpReady) &&
      document.activeElement?.id !== 'inpSuitcasePetName'
    ) {
      this.renderSuitcaseDialog();
      return;
    }

    if (sc.activeIncubation && now < sc.activeIncubation.endsAt) {
      const leftSec = Math.max(1, Math.ceil((sc.activeIncubation.endsAt - now) / 1000));
      const totalMs = Math.max(1000, sc.activeIncubation.endsAt - sc.activeIncubation.startedAt);
      const pct = Math.min(100, Math.round(((now - sc.activeIncubation.startedAt) / totalMs) * 100));
      const lbl = box.querySelector('[data-suitcase-inc-left]');
      if (lbl) lbl.textContent = `${leftSec}s`;
      const prog = box.querySelector('[data-suitcase-inc-prog]') as HTMLProgressElement | null;
      if (prog) prog.value = pct;
    }

    if (sc.activeExpedition && now < sc.activeExpedition.endsAt) {
      const leftSec = Math.max(1, Math.ceil((sc.activeExpedition.endsAt - now) / 1000));
      const totalMs = Math.max(1000, sc.activeExpedition.endsAt - sc.activeExpedition.startedAt);
      const pct = Math.min(100, Math.round(((now - sc.activeExpedition.startedAt) / totalMs) * 100));
      const lbl = box.querySelector('[data-suitcase-exp-left]');
      if (lbl) lbl.textContent = `${leftSec}s`;
      const prog = box.querySelector('[data-suitcase-exp-prog]') as HTMLProgressElement | null;
      if (prog) prog.value = pct;
    }

    if (this.activeSuitcaseTab === 'care' && !this.sim.state.sandboxMode) {
      const selB = this.sim.state.buildings.find((b) => b.uid === this.selectedSuitcaseHabitatUid);
      if (selB) {
        const groomWait = Math.max(
          0,
          Math.ceil((GROOM_COOLDOWN_MS - (now - (selB.lastGroomedAt ?? 0))) / 1000)
        );
        const trainWait = Math.max(
          0,
          Math.ceil((TRAIN_COOLDOWN_MS - (now - (selB.lastTrainedAt ?? 0))) / 1000)
        );
        const groomBtn = box.querySelector('#btnScGroom') as HTMLButtonElement | null;
        if (groomBtn) {
          groomBtn.textContent =
            groomWait > 0
              ? `🪮 (${groomWait}s)`
              : '🪮 Chải (+30💝)';
        }
        const trainBtn = box.querySelector('#btnScTrain') as HTMLButtonElement | null;
        if (trainBtn) {
          trainBtn.textContent =
            trainWait > 0
              ? `🎾 (${trainWait}s)`
              : '🎾 Tập (20G • +45💝)';
        }
      }
    }
  }

  private renderSuitcaseDialog(): void {
    const box = this.root.querySelector('#suitcaseDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const sc = st.suitcase;
    const now = Date.now();
    const habitats = this.sim.getBuiltCreatureHabitats();

    if (
      !this.selectedSuitcaseHabitatUid ||
      !habitats.some((h) => h.building.uid === this.selectedSuitcaseHabitatUid)
    ) {
      this.selectedSuitcaseHabitatUid = habitats[0]?.building.uid ?? null;
    }

    const discoveredSet = new Set(sc.discoveredMorphs);
    const totalCompendiumEntries = CREATURE_SPECIES_PROFILES.length * 3;
    const discoveredCount = discoveredSet.size;
    const masteryPct = getCompendiumMasteryBonusPct(discoveredCount);
    const starlightQty = st.supply.ingredients.starlight_dust ?? 0;

    this.lastSuitcaseIncReady = Boolean(sc.activeIncubation && now >= sc.activeIncubation.endsAt);
    this.lastSuitcaseExpReady = Boolean(sc.activeExpedition && now >= sc.activeExpedition.endsAt);

    const incStatusLabel = sc.activeIncubation
      ? now >= sc.activeIncubation.endsAt
        ? '🐣 Nở!'
        : '🥚 Ấp'
      : '🧬';
    const expStatusLabel = sc.activeExpedition
      ? now >= sc.activeExpedition.endsAt
        ? '🎒 Về!'
        : '🧭 Đi'
      : `${discoveredCount}/${totalCompendiumEntries}`;

    const summaryHtml = `
      <div class="suitcase-summary-bar">
        <span>🐾 <strong>${habitats.length}</strong></span>
        <span>📖 <strong>${discoveredCount}/${totalCompendiumEntries}</strong> (+${masteryPct}%)</span>
        <span>✨ <strong>${st.sandboxMode ? '∞' : starlightQty}</strong> • ⏳ <strong>${st.sandboxMode ? '∞' : st.timeSand}</strong></span>
      </div>
      <div class="workshop-tabs" role="group" aria-label="Vali Sinh Vật">
        <button type="button" data-sc-tab="care" data-active="${this.activeSuitcaseTab === 'care'}" aria-pressed="${this.activeSuitcaseTab === 'care'}" class="brass-btn">
          🐾 Chăm Sóc (${habitats.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${this.activeSuitcaseTab === 'morph'}" aria-pressed="${this.activeSuitcaseTab === 'morph'}" class="brass-btn">
          🧬 Ấp Trứng (${incStatusLabel})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${this.activeSuitcaseTab === 'expedition'}" aria-pressed="${this.activeSuitcaseTab === 'expedition'}" class="brass-btn">
          🧭 Thám Hiểm (${expStatusLabel})
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (this.activeSuitcaseTab === 'care') {
      if (habitats.length === 0) {
        bodyHtml = `
          <div class="quest-card-mini" style="text-align:center;padding:22px 14px;">
            <div style="font-size:32px;margin-bottom:6px;">🧳✨</div>
            <div style="font-size:15px;font-weight:800;color:#45230c;margin-bottom:10px;">
              Chưa có chuồng thú
            </div>
            <button id="btnScOpenCreatureBuild" type="button" class="brass-btn gold-cta">
              🐾 Xây Chuồng
            </button>
          </div>
        `;
      } else {
        const selectedEntry =
          habitats.find((h) => h.building.uid === this.selectedSuitcaseHabitatUid) ?? habitats[0];
        const b = selectedEntry.building;
        const item = selectedEntry.item;
        const profile = getSpeciesProfile(item.id) ?? CREATURE_SPECIES_PROFILES[0];
        const morph: CreatureMorphVariant = b.creatureMorph ?? 'normal';
        const morphMeta = MORPH_INFO[morph];
        const bondLv = b.creatureBondLevel ?? 1;
        const bondXp = b.creatureBondXp ?? 0;
        const bondReq = bondLv >= MAX_BOND_LEVEL ? 100 : getBondXpRequiredForNext(bondLv);
        const bondProgressVal = bondLv >= MAX_BOND_LEVEL ? 100 : bondXp;
        const bondBonusPct = Math.round((getBondIncomeMultiplier(bondLv) - 1) * 100);
        const displayPetName = b.creatureNickname || item.creatureName || item.name;
        const prod = this.sim.getBuildingProductionPerCycle(b, item);
        const bio = this.sim.biomeCache.get(b.uid);
        const hunger = Math.round(b.creatureHunger ?? 90);
        const feedCost = Math.max(8, Math.round(item.cost * 0.04));
        const groomWait = st.sandboxMode
          ? 0
          : Math.max(0, Math.ceil((GROOM_COOLDOWN_MS - (now - (b.lastGroomedAt ?? 0))) / 1000));
        const trainWait = st.sandboxMode
          ? 0
          : Math.max(0, Math.ceil((TRAIN_COOLDOWN_MS - (now - (b.lastTrainedAt ?? 0))) / 1000));
        const isAwayOnExp = sc.activeExpedition?.habitatUid === b.uid;

        const stripHtml = `
          <div class="suitcase-pet-strip" role="group" aria-label="Danh sách sinh vật đang nuôi">
            ${habitats
              .map(({ building: hb, item: hi }) => {
                const hp = getSpeciesProfile(hi.id);
                const hm = hb.creatureMorph ?? 'normal';
                const hmMeta = MORPH_INFO[hm];
                const hName = hb.creatureNickname || hi.creatureName || hi.name;
                const isSel = hb.uid === b.uid;
                return `
                  <button type="button" data-select-pet="${escapeHtml(hb.uid)}" aria-pressed="${isSel}" class="suitcase-pet-chip">
                    <img src="/sprites/${hp?.beastSpriteKey ?? hi.spriteKey}.png" alt="" class="suitcase-pet-chip-img" style="filter:${hmMeta.cssFilter};" />
                    <div style="min-width:0;">
                      <div style="font-size:12.5px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;">
                        ${escapeHtml(hName)}
                      </div>
                      <div style="font-size:11.5px;color:#78350f;font-weight:700;">
                        💝 Lv.${hb.creatureBondLevel ?? 1}
                      </div>
                    </div>
                  </button>
                `;
              })
              .join('')}
          </div>
        `;

        bodyHtml = `
          ${stripHtml}
          <div class="suitcase-care-layout">
            <div class="suitcase-diorama" style="background:${profile.dioramaGradient};">
              <div style="width:100%;display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:800;">
                <span>🏡 ${escapeHtml(profile.sanctuaryRoomTitle)}</span>
                <span class="morph-pill ${morph === 'radiant' ? 'radiant' : morph === 'mystic' ? 'mystic' : ''}" style="color:#1e293b;">
                  ${morphMeta.badge}
                </span>
              </div>

              <button id="btnScPetStage" type="button" class="suitcase-diorama-stage" aria-label="Vuốt ve ${escapeHtml(displayPetName)}" title="Vuốt ve" style="background:none;border:none;">
                <img
                  src="/sprites/${profile.beastSpriteKey}.png"
                  alt="${escapeHtml(displayPetName)}"
                  class="suitcase-diorama-img"
                  style="filter:${morphMeta.cssFilter} drop-shadow(0 0 18px ${morphMeta.glowColor});"
                />
              </button>

              <div style="text-align:center;width:100%;">
                <div style="font-size:15px;font-weight:800;text-shadow:0 1px 4px rgba(0,0,0,0.65);">
                  ${profile.emoji} ${escapeHtml(displayPetName)}
                </div>
                <div style="font-size:11.5px;opacity:0.92;margin-top:2px;">
                  ${escapeHtml(profile.morphNames[morph])}${isAwayOnExp ? ' • 🧭' : ''}
                </div>
              </div>
            </div>

            <div class="suitcase-care-details">
              <form id="formSuitcaseRename" class="suitcase-rename-form">
                <label for="inpSuitcasePetName" style="font-size:12.5px;font-weight:800;color:#5c2d0c;">
                  🏷️
                </label>
                <input
                  id="inpSuitcasePetName"
                  name="petName"
                  type="text"
                  maxlength="28"
                  enterkeyhint="done"
                  autocomplete="off"
                  class="suitcase-name-input"
                  placeholder="${escapeHtml(item.creatureName ?? item.name)}"
                  value="${escapeHtml(b.creatureNickname ?? '')}"
                />
                <button type="submit" class="brass-btn" style="padding:5px 11px;">Lưu</button>
              </form>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:800;margin-bottom:4px;">
                  <span>💝 Lv.${bondLv}/${MAX_BOND_LEVEL} (+${bondBonusPct}%)</span>
                  <span style="color:#b45309;">${bondLv >= MAX_BOND_LEVEL ? 'MAX' : `${bondXp}/${bondReq}`}</span>
                </div>
                <progress max="${bondReq}" value="${bondProgressVal}" aria-label="Điểm gắn kết sinh vật"></progress>
                <div style="font-size:12px;margin-top:5px;color:#5c2d0c;">
                  🍬 ${escapeHtml(profile.favoriteTreat)} • <strong>+${prod.galleons.toLocaleString('vi-VN')}🪙 / ${formatDurationCompactVi(item.cycleSec)}</strong>
                </div>
              </div>

              <div class="quest-card-mini" style="margin-top:0;">
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;margin-bottom:4px;">
                  <span>🥩 ${hunger}%</span>
                  <span>🌿 ${bio?.score ?? 60}% ${b.hasBabyOffspring ? '• 🐣' : ''}</span>
                </div>
                <progress max="100" value="${hunger}" aria-label="Độ no bụng"></progress>
              </div>

              <div class="suitcase-actions-grid">
                <button id="btnScFeed" type="button" class="brass-btn">
                  🥩 Ăn (${st.sandboxMode ? '0G' : `${feedCost}G`} • +22💝)
                </button>
                <button id="btnScGroom" type="button" class="brass-btn ${groomWait === 0 ? 'gold-cta' : ''}">
                  ${groomWait > 0 ? `🪮 (${groomWait}s)` : '🪮 Chải (+30💝)'}
                </button>
                <button id="btnScTrain" type="button" class="brass-btn">
                  ${trainWait > 0 ? `🎾 (${trainWait}s)` : '🎾 Tập (20G • +45💝)'}
                </button>
                <button id="btnScLocate" type="button" class="brass-btn">
                  📍 Tới Chuồng
                </button>
              </div>
            </div>
          </div>
        `;
      }
    } else if (this.activeSuitcaseTab === 'morph') {
      const inc = sc.activeIncubation;
      let incChamberHtml = '';
      if (inc) {
        const incItem = getCatalogItem(inc.itemId);
        const incProfile = getSpeciesProfile(inc.itemId);
        const isReady = now >= inc.endsAt;
        const leftSec = Math.max(0, Math.ceil((inc.endsAt - now) / 1000));
        const totalMs = Math.max(1000, inc.endsAt - inc.startedAt);
        const pct = isReady ? 100 : Math.min(100, Math.round(((now - inc.startedAt) / totalMs) * 100));

        incChamberHtml = `
          <div class="quest-card-mini" style="margin-bottom:12px;border-color:#d97706;background:linear-gradient(180deg,#fffbeb,#fef3c7);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#78350f;">
                🥚 ${escapeHtml(incProfile?.speciesName ?? incItem?.name ?? 'Trứng')}
                ${inc.boostedWithStarlight ? '<span style="color:#0369a1;"> • ✨ ×2</span>' : ''}
              </div>
              <span data-suitcase-inc-left="1" style="font-size:13px;font-weight:800;color:#b45309;">
                ${isReady ? '✨ Nở!' : `${leftSec}s`}
              </span>
            </div>
            <progress data-suitcase-inc-prog="1" max="100" value="${pct}" aria-label="Tiến độ ấp trứng"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${
                isReady
                  ? `<button id="btnScClaimEgg" type="button" class="brass-btn gold-cta">🐣 Tách Vỏ</button>`
                  : `<button id="btnScSpeedEgg" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>`
              }
            </div>
          </div>
        `;
      } else {
        incChamberHtml = `
          <div class="quest-card-mini" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div style="font-size:13.5px;font-weight:800;color:#7c2d12;">🧬 Lồng Ấp (75s)</div>
            <label style="display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#0369a1;cursor:pointer;">
              <input id="chkScStarlight" type="checkbox" ${this.useStarlightForIncubation && (st.sandboxMode || starlightQty > 0) ? 'checked' : ''} />
              ✨ +1 Bụi Sao
            </label>
          </div>
        `;
      }

      const cardsHtml =
        habitats.length === 0
          ? `<div class="quest-card-mini" style="font-size:13px;">Chưa có chuồng thú</div>`
          : `
            <div class="grid-2col">
              ${habitats
                .map(({ building: hb, item: hi }) => {
                  const hp = getSpeciesProfile(hi.id);
                  const curMorph = hb.creatureMorph ?? 'normal';
                  const cost = this.sim.getMorphIncubationCost(hi);
                  const petLabel = hb.creatureNickname || hi.creatureName || hi.name;
                  return `
                    <div class="crate-card">
                      <div style="display:flex;gap:10px;align-items:center;">
                        <img src="/sprites/${hp?.beastSpriteKey ?? hi.spriteKey}.png" alt="" style="width:52px;height:52px;object-fit:contain;filter:${MORPH_INFO[curMorph].cssFilter};" />
                        <div style="min-width:0;">
                          <div style="font-size:13.5px;font-weight:800;color:#45230c;">${escapeHtml(petLabel)}</div>
                          <div style="font-size:12px;color:#78350f;"><strong>${MORPH_INFO[curMorph].badge}</strong></div>
                        </div>
                      </div>
                      <div style="display:flex;gap:5px;flex-wrap:wrap;">
                        ${(['normal', 'mystic', 'radiant'] as CreatureMorphVariant[])
                          .map((mv) => {
                            const unlocked = discoveredSet.has(`${hi.id}:${mv}`);
                            return `<span class="morph-pill ${unlocked ? (mv === 'radiant' ? 'radiant' : mv === 'mystic' ? 'mystic' : '') : 'locked'}">${unlocked ? MORPH_INFO[mv].badge : `🔒 ${MORPH_INFO[mv].shortLabel}`}</span>`;
                          })
                          .join('')}
                      </div>
                      <button
                        type="button"
                        data-incubate-uid="${escapeHtml(hb.uid)}"
                        class="brass-btn ${!inc ? 'gold-cta' : ''}"
                        ${inc ? 'disabled' : ''}
                      >
                        ${inc ? '🥚 Đang ấp' : `🥚 Ấp (${st.sandboxMode ? '0G' : `${cost}G`})`}
                      </button>
                    </div>
                  `;
                })
                .join('')}
            </div>
          `;

      bodyHtml = `${incChamberHtml}${cardsHtml}`;
    } else {
      const actExp = sc.activeExpedition;
      let expSectionHtml = '';

      if (actExp) {
        const expDef =
          SUITCASE_EXPEDITIONS.find((e) => e.id === actExp.expeditionId) ?? SUITCASE_EXPEDITIONS[0];
        const eb = st.buildings.find((x) => x.uid === actExp.habitatUid);
        const ei = eb ? getCatalogItem(eb.itemId) : undefined;
        const petLabel = eb?.creatureNickname || ei?.creatureName || 'Thú cưng';
        const isReady = now >= actExp.endsAt;
        const leftSec = Math.max(0, Math.ceil((actExp.endsAt - now) / 1000));
        const totalMs = Math.max(1000, actExp.endsAt - actExp.startedAt);
        const pct = isReady ? 100 : Math.min(100, Math.round(((now - actExp.startedAt) / totalMs) * 100));

        expSectionHtml = `
          <div class="quest-card-mini" style="margin-bottom:14px;border-color:#15803d;background:rgba(220,252,231,0.82);">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
              <div style="font-size:14px;font-weight:800;color:#14532d;">
                ${expDef.emoji} ${escapeHtml(petLabel)} • ${escapeHtml(expDef.name)}
              </div>
              <span data-suitcase-exp-left="1" style="font-size:13px;font-weight:800;color:#15803d;">
                ${isReady ? '🎒 Đã về!' : `${leftSec}s`}
              </span>
            </div>
            <progress data-suitcase-exp-prog="1" max="100" value="${pct}" aria-label="Tiến độ thám hiểm"></progress>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:8px;">
              ${
                isReady
                  ? `<button id="btnScClaimExp" type="button" class="brass-btn gold-cta">🎒 Nhận</button>`
                  : `<button id="btnScSpeedExp" type="button" class="brass-btn gold-cta">⏳ 1 Cát</button>`
              }
            </div>
          </div>
        `;
      } else if (habitats.length === 0) {
        expSectionHtml = `
          <div class="quest-card-mini" style="margin-bottom:14px;font-size:13px;">
            🧭 Chưa có chuồng thú
          </div>
        `;
      } else {
        const chosenEntry =
          habitats.find((h) => h.building.uid === this.selectedSuitcaseHabitatUid) ?? habitats[0];
        const cb = chosenEntry.building;
        const mult =
          getBondIncomeMultiplier(cb.creatureBondLevel ?? 1) *
          MORPH_INFO[cb.creatureMorph ?? 'normal'].incomeMult;

        expSectionHtml = `
          <div class="quest-card-mini" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
            <label for="selScExpPet" style="font-size:13px;font-weight:800;color:#45230c;">
              🐾 Thú:
            </label>
            <select id="selScExpPet" class="suitcase-select" style="max-width:340px;">
              ${habitats
                .map(({ building: hb, item: hi }) => {
                  const pName = hb.creatureNickname || hi.creatureName || hi.name;
                  const mBadge = MORPH_INFO[hb.creatureMorph ?? 'normal'].shortLabel;
                  return `<option value="${escapeHtml(hb.uid)}" ${hb.uid === cb.uid ? 'selected' : ''}>${escapeHtml(pName)} (💝Lv.${hb.creatureBondLevel ?? 1} • ${mBadge})</option>`;
                })
                .join('')}
            </select>
          </div>
          <div class="crate-grid" style="margin-bottom:16px;">
            ${SUITCASE_EXPEDITIONS.map((exp) => {
              const locked = !st.sandboxMode && st.level < exp.minParkLevel;
              const estGold = Math.round(exp.baseGold * mult);
              const estXp = Math.round(exp.baseXp * mult);
              const bonusHerb = (cb.creatureBondLevel ?? 1) >= 5 ? 1 : 0;
              const herbsText = exp.guaranteedIngredients
                .map(
                  (g) =>
                    `+${g.qty + bonusHerb} ${RAW_INGREDIENTS_INFO[g.id].emoji}`
                )
                .join(' ');
              return `
                <div class="crate-card">
                  <div style="font-size:13.5px;font-weight:800;color:#45230c;">
                    ${exp.emoji} ${escapeHtml(exp.name)} <span style="font-size:11.5px;color:#78350f;">(${exp.durationSec}s)</span>
                  </div>
                  <div style="font-size:12px;font-weight:700;color:#15803d;">
                    +${estGold}🪙 • +${estXp}⭐ • ${herbsText}
                  </div>
                  <button
                    type="button"
                    data-start-exp="${exp.id}"
                    class="brass-btn ${locked ? '' : 'gold-cta'}"
                    ${locked ? 'disabled' : ''}
                  >
                    ${locked ? `🔒 Lv.${exp.minParkLevel}` : '🧭 Cử Đi'}
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      const compendiumHtml = `
        <div class="quest-card-mini" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;font-weight:800;margin-bottom:4px;">
            <span>📖 Sổ Tay (${discoveredCount}/${totalCompendiumEntries})</span>
            <span style="color:#15803d;">+${masteryPct}%</span>
          </div>
          <progress max="${totalCompendiumEntries}" value="${discoveredCount}" aria-label="Tiến độ Sổ Tay"></progress>
        </div>
        <div class="compendium-grid">
          ${CREATURE_SPECIES_PROFILES.map((sp) => {
            return `
              <div class="crate-card" style="gap:6px;">
                <div style="display:flex;gap:8px;align-items:center;">
                  <img src="/sprites/${sp.beastSpriteKey}.png" alt="" style="width:44px;height:44px;object-fit:contain;" />
                  <div>
                    <div style="font-size:13px;font-weight:800;color:#45230c;">${sp.emoji} ${escapeHtml(sp.speciesName)}</div>
                  </div>
                </div>
                <div style="display:flex;gap:4px;flex-wrap:wrap;">
                  ${(['normal', 'mystic', 'radiant'] as CreatureMorphVariant[])
                    .map((mv) => {
                      const ok = discoveredSet.has(`${sp.habitatItemId}:${mv}`);
                      return `<span class="morph-pill ${ok ? (mv === 'radiant' ? 'radiant' : mv === 'mystic' ? 'mystic' : '') : 'locked'}">${ok ? MORPH_INFO[mv].shortLabel : '🔒'}</span>`;
                    })
                    .join('')}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;

      bodyHtml = `${expSectionHtml}${compendiumHtml}`;
    }

    box.innerHTML = `${summaryHtml}${bodyHtml}`;

    box.querySelectorAll<HTMLButtonElement>('[data-sc-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeSuitcaseTab = btn.dataset.scTab as 'care' | 'morph' | 'expedition';
        this.renderSuitcaseDialog();
      });
    });

    box.querySelector('#btnScOpenCreatureBuild')?.addEventListener('click', () => {
      (this.root.querySelector('#suitcaseDialog') as HTMLDialogElement).close();
      this.activeCategory = 'creature';
      this.refreshDock();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-select-pet]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedSuitcaseHabitatUid = btn.dataset.selectPet ?? null;
        this.renderSuitcaseDialog();
      });
    });

    const renameForm = box.querySelector('#formSuitcaseRename') as HTMLFormElement | null;
    const renameInput = box.querySelector('#inpSuitcasePetName') as HTMLInputElement | null;
    if (renameInput) {
      renameInput.addEventListener('keydown', (e) => {
        if (e.isComposing) return;
        e.stopPropagation();
      });
    }
    if (renameForm && renameInput && this.selectedSuitcaseHabitatUid) {
      const targetUid = this.selectedSuitcaseHabitatUid;
      renameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = this.sim.renameCreature(targetUid, renameInput.value);
        this.showToast(res.msg, '🏷️');
        this.renderSuitcaseDialog();
      });
    }

    if (this.selectedSuitcaseHabitatUid) {
      const uid = this.selectedSuitcaseHabitatUid;
      const handleGroom = () => {
        const res = this.sim.groomCreature(uid);
        this.showToast(res.msg, res.ok ? '🪮' : '⏳');
        this.renderSuitcaseDialog();
      };
      box.querySelector('#btnScPetStage')?.addEventListener('click', handleGroom);
      box.querySelector('#btnScGroom')?.addEventListener('click', handleGroom);

      box.querySelector('#btnScFeed')?.addEventListener('click', () => {
        this.sim.feedCreature(uid);
        this.renderSuitcaseDialog();
      });

      box.querySelector('#btnScTrain')?.addEventListener('click', () => {
        const res = this.sim.trainCreatureTrick(uid);
        this.showToast(res.msg, res.ok ? '🎾' : '🪙');
        this.renderSuitcaseDialog();
      });

      box.querySelector('#btnScLocate')?.addEventListener('click', () => {
        const b = st.buildings.find((x) => x.uid === uid);
        if (b) {
          (this.root.querySelector('#suitcaseDialog') as HTMLDialogElement).close();
          centerCameraOnGrid(this.cam, b.gx + 1, b.gy + 1);
          this.inspectSelection = { kind: 'building', uid: b.uid };
          this.renderInspector();
        }
      });
    }

    const chkStarlight = box.querySelector('#chkScStarlight') as HTMLInputElement | null;
    if (chkStarlight) {
      chkStarlight.addEventListener('change', () => {
        this.useStarlightForIncubation = chkStarlight.checked;
      });
    }

    box.querySelectorAll<HTMLButtonElement>('[data-incubate-uid]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetUid = btn.dataset.incubateUid!;
        const wantStarlight =
          this.useStarlightForIncubation &&
          (st.sandboxMode || (st.supply.ingredients.starlight_dust ?? 0) >= 1);
        const res = this.sim.startMorphIncubation(targetUid, wantStarlight);
        this.showToast(res.msg, res.ok ? '🥚' : '⚠️');
        this.renderSuitcaseDialog();
      });
    });

    box.querySelector('#btnScSpeedEgg')?.addEventListener('click', () => {
      const res = this.sim.speedUpIncubationWithSand();
      this.showToast(res.msg, res.ok ? '⏳' : '⚠️');
      this.renderSuitcaseDialog();
    });

    box.querySelector('#btnScClaimEgg')?.addEventListener('click', () => {
      this.sim.claimMorphIncubation();
      this.renderSuitcaseDialog();
    });

    const selExpPet = box.querySelector('#selScExpPet') as HTMLSelectElement | null;
    if (selExpPet) {
      selExpPet.addEventListener('change', () => {
        this.selectedSuitcaseHabitatUid = selExpPet.value;
        this.renderSuitcaseDialog();
      });
    }

    box.querySelectorAll<HTMLButtonElement>('[data-start-exp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expId = btn.dataset.startExp as SuitcaseExpeditionId;
        const petUid = this.selectedSuitcaseHabitatUid ?? habitats[0]?.building.uid;
        if (!petUid) return;
        const res = this.sim.startSuitcaseExpedition(petUid, expId);
        this.showToast(res.msg, res.ok ? '🧭' : '⚠️');
        this.renderSuitcaseDialog();
      });
    });

    box.querySelector('#btnScSpeedExp')?.addEventListener('click', () => {
      const res = this.sim.speedUpExpeditionWithSand();
      this.showToast(res.msg, res.ok ? '⏳' : '⚠️');
      this.renderSuitcaseDialog();
    });

    box.querySelector('#btnScClaimExp')?.addEventListener('click', () => {
      this.sim.claimSuitcaseExpedition();
      this.renderSuitcaseDialog();
    });
  }

  private syncLiveNeighborSocialUI(): void {
    const social = this.sim.ensureNeighborSocial();
    const fulfilledOwlCount = social.playerOwlHelpRequests.filter((r) => Boolean(r.fulfilledAt)).length;
    const sosRescuedAt = social.playerMinigameSos?.rescuedAt ?? 0;
    const sosClaimed = Boolean(social.playerMinigameSos?.claimed);
    const sig = `${social.lastSocialResetKey}|${social.friendshipTokens}|${fulfilledOwlCount}|${sosRescuedAt}|${sosClaimed}|${social.homeLanternMarks.length}|${social.dailyRescuesGivenIds.length}`;
    if (sig === this.lastSocialLiveSig) return;
    this.lastSocialLiveSig = sig;

    this.refreshNeighborBadges();
    const qDlg = this.root.querySelector('#questDialog') as HTMLDialogElement | null;
    if (qDlg?.open && this.activeQuestTab === 'orders') {
      this.renderQuestDialog();
    }
    const nDlg = this.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    const activeId = document.activeElement?.id ?? '';
    if (nDlg?.open && activeId !== 'inpFriendCode' && activeId !== 'inpFriendName') {
      this.renderNeighborDialog();
    }
  }

  private refreshNeighborBadges(): void {
    const social = this.sim.ensureNeighborSocial();
    const chestsReady = Math.floor(social.friendshipTokens / FRIENDSHIP_CHEST_TOKEN_COST);
    const sosReady =
      social.playerMinigameSos &&
      !social.playerMinigameSos.claimed &&
      Boolean(social.playerMinigameSos.rescuedAt)
        ? 1
        : 0;
    const homeLanterns = social.homeLanternMarks.length;
    const urgentReady = chestsReady + sosReady + homeLanterns;

    const rescuesLeftToday = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesGivenIds.length
    );
    const openFriendSosCount =
      rescuesLeftToday > 0
        ? social.neighbors.filter(
            (n) =>
              n.minigameSos &&
              !n.minigameSos.rescuedToday &&
              !social.dailyRescuesGivenIds.includes(n.id)
          ).length
        : 0;

    const badge = this.root.querySelector('#badgeNeighborCount') as HTMLElement | null;
    if (badge) {
      const shown = urgentReady > 0 ? urgentReady : openFriendSosCount;
      if (shown > 0) {
        badge.textContent = String(shown);
        badge.classList.toggle('is-ready-green', urgentReady > 0);
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    const manageBadge = this.root.querySelector('#badgeManageNeighborCount') as HTMLElement | null;
    if (manageBadge) {
      if (urgentReady > 0) {
        manageBadge.textContent = String(urgentReady);
        manageBadge.classList.remove('hidden');
      } else {
        manageBadge.classList.add('hidden');
      }
    }
  }

  private renderVisitorDockBar(): void {
    const bar = this.root.querySelector('#visitorDockBar') as HTMLElement | null;
    if (!bar) return;
    const nb = this.sim.getActiveVisitingNeighbor();
    if (!nb || this.photoModeActive) {
      bar.classList.add('hidden');
      bar.innerHTML = '';
      return;
    }

    const social = this.sim.ensureNeighborSocial();
    const helpsDone = nb.helpedMarksToday.length;
    const maxGardenHelps = 6;
    const likedToday = social.dailyLikedNeighborIds.includes(nb.id);
    const mysteryClaimedToday = social.dailyMysteryClaimedIds.includes(nb.id);
    const openCrates = nb.owlHelpCrates.filter((c) => !c.fulfilledByPlayerToday).length;
    const canRescue = this.sim.canRescueNeighborMinigame(nb.id).ok;
    const coOpPendingCount = openCrates + (canRescue ? 1 : 0);

    bar.classList.remove('hidden');
    bar.innerHTML = `
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${escapeHtml(nb.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${escapeHtml(nb.name)}</strong>
            <span class="visitor-lv-tag">Lv.${nb.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>💧 <strong>${helpsDone}/${maxGardenHelps}</strong></span>
            <span>•</span>
            <span>🍀 <strong>${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnVisitorLike" type="button" class="brass-btn ${likedToday ? '' : 'gold-cta'}" ${likedToday ? 'disabled' : ''} title="Thả tim">
          ${likedToday ? '✓ Đã Tim' : '❤️ +1🍀'}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn ${mysteryClaimedToday ? '' : 'gold-cta'}" ${mysteryClaimedToday ? 'disabled' : ''} title="Tìm Quà">
          ${mysteryClaimedToday ? '✓ Đã Mở' : '🎁 Quà'}
        </button>
        <button id="btnVisitorCoopBook" type="button" class="brass-btn ${coOpPendingCount > 0 ? 'gold-cta' : ''}" title="Đơn Cú & Giải Cứu">
          📦 Tương Trợ ${coOpPendingCount > 0 ? `(${coOpPendingCount})` : ''}
        </button>
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Bạn kế">
          ⏭️ Kế
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về nhà">
          🏡 Về
        </button>
      </div>
    `;

    bar.querySelector('#btnVisitorLike')?.addEventListener('click', () => {
      const res = this.sim.likeVisitedNeighborFarm();
      if (!res.ok) this.showToast(res.msg, '❤️');
      this.refreshAll();
    });

    bar.querySelector('#btnVisitorLocateGift')?.addEventListener('click', () => {
      if (mysteryClaimedToday) return;
      this.rideCamUid = null;
      this.onCameraJump?.();
      centerCameraOnGrid(this.cam, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
      this.showToast(
        `🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!`,
        '🎁'
      );
    });

    bar.querySelector('#btnVisitorCoopBook')?.addEventListener('click', () => {
      this.openNeighborDialog('friends', nb.id);
    });

    bar.querySelector('#btnVisitorNextFriend')?.addEventListener('click', () => {
      const res = this.sim.cycleNextNeighborVisit();
      if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
        this.rideCamUid = null;
        this.onCameraJump?.();
        centerCameraOnGrid(this.cam, res.focusGx, res.focusGy);
      }
      this.refreshAll();
    });

    bar.querySelector('#btnVisitorReturnHome')?.addEventListener('click', () => {
      this.exitVisitFromHud();
    });
  }

  private renderNeighborDialog(): void {
    const box = this.root.querySelector('#neighborDialogContent') as HTMLElement | null;
    if (!box) return;

    const social = this.sim.ensureNeighborSocial();
    const visitingNb = this.sim.getActiveVisitingNeighbor();
    const rescuesGivenLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesGivenIds.length
    );
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesReceivedCount
    );
    const owlHelpLeft = Math.max(
      0,
      MAX_DAILY_OWL_HELP_REQUESTS - social.dailyOwlHelpRequestedCount
    );
    const chestReady = social.friendshipTokens >= FRIENDSHIP_CHEST_TOKEN_COST;
    const chestPct = Math.min(
      100,
      Math.round((social.friendshipTokens / FRIENDSHIP_CHEST_TOKEN_COST) * 100)
    );
    const mySos =
      social.playerMinigameSos && !social.playerMinigameSos.claimed
        ? social.playerMinigameSos
        : null;

    const topStatsHtml = `
      <div class="nb-summary-ribbon">
        <div class="nb-stat-pill token">
          <span>🍀</span>
          <strong>${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST}</strong>
          ${
            chestReady
              ? `<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>`
              : ''
          }
        </div>
        <div class="nb-stat-pill">
          <span>⚔️ <strong>${rescuesGivenLeft}/${MAX_DAILY_MINIGAME_RESCUES}</strong></span>
          <span>•</span>
          <span>🆘 <strong>${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}</strong></span>
          <span>•</span>
          <span>🦉 <strong>${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}</strong></span>
        </div>
      </div>
    `;

    const tabsHtml = `
      <div class="workshop-tabs" role="group" aria-label="Sổ Hàng Xóm" style="margin:10px 0 12px;">
        <button type="button" data-nbtab="friends" data-active="${this.activeNeighborTab === 'friends'}" aria-pressed="${this.activeNeighborTab === 'friends'}" class="brass-btn">
          🏡 Bạn (${social.neighbors.length})
        </button>
        <button type="button" data-nbtab="chest" data-active="${this.activeNeighborTab === 'chest'}" aria-pressed="${this.activeNeighborTab === 'chest'}" class="brass-btn">
          🎁 Rương &amp; Mã ${chestReady || mySos?.rescuedAt ? '(!)' : ''}
        </button>
        <button type="button" data-nbtab="log" data-active="${this.activeNeighborTab === 'log'}" aria-pressed="${this.activeNeighborTab === 'log'}" class="brass-btn">
          📜 Nhật Ký (${social.activityLog.length})
        </button>
        <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
          🏆 BXH
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (this.activeNeighborTab === 'friends') {
      const quickAlertBanners: string[] = [];
      if (mySos?.rescuedAt) {
        const km = getMinigameKindLabelVi(mySos.kind);
        quickAlertBanners.push(`
          <div class="nb-alert-banner ready">
            <span>🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn')}</strong> cứu <strong>${km.icon} Màn ${mySos.stage}</strong>!</span>
            <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
          </div>
        `);
      } else if (mySos) {
        const km = getMinigameKindLabelVi(mySos.kind);
        quickAlertBanners.push(`
          <div class="nb-alert-banner">
            <span>🦉 Đang gọi cứu <strong>${km.icon} Màn ${mySos.stage}</strong>...</span>
          </div>
        `);
      }

      if (social.homeLanternMarks.length > 0) {
        quickAlertBanners.push(`
          <div class="nb-alert-banner ready">
            <span>🏮 <strong>${social.homeLanternMarks.length} Đèn Lồng</strong></span>
            <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${social.homeLanternMarks.length}🍀)</button>
          </div>
        `);
      }

      const houseLabelMap: Record<HouseName, string> = {
        Gryffindor: '🦁 Gryffindor',
        Ravenclaw: '🦅 Ravenclaw',
        Hufflepuff: '🦡 Hufflepuff',
        Slytherin: '🐍 Slytherin',
      };

      const cardsHtml = social.neighbors
        .map((nb) => {
          const isVisitingThis = visitingNb?.id === nb.id;
          const isFocused = this.focusedNeighborId === nb.id;
          const maxGardenHelps = 6;
          const likedToday = social.dailyLikedNeighborIds.includes(nb.id);
          const mysteryClaimedToday = social.dailyMysteryClaimedIds.includes(nb.id);
          const rescueCheck = this.sim.canRescueNeighborMinigame(nb.id);
          const sos = nb.minigameSos;
          const sosMeta = sos ? getMinigameKindLabelVi(sos.kind) : null;
          const alreadyRescuedThisFriend = Boolean(
            sos && (sos.rescuedToday || social.dailyRescuesGivenIds.includes(nb.id))
          );

          const cratesHtml =
            nb.owlHelpCrates.length > 0
              ? `
                <div class="nb-coop-section">
                  <div class="nb-crate-list">
                    ${nb.owlHelpCrates
                      .map((crate) => {
                        const meta = getFarmItemMeta(crate.itemId);
                        const have = this.sim.getFarmItemCount(crate.itemId);
                        const enough = this.sim.state.sandboxMode || have >= crate.qty;
                        return `
                          <div class="nb-crate-item ${crate.fulfilledByPlayerToday ? 'done' : ''}">
                            <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${crate.qty} ${escapeHtml(meta.name)} <span class="nb-crate-stock">(${this.sim.state.sandboxMode ? '∞' : have}/${crate.qty})</span></div>
                              <div class="nb-crate-rew">+${crate.rewardTokens}🍀 • +${crate.rewardGalleons}G</div>
                            </div>
                            ${
                              crate.fulfilledByPlayerToday
                                ? `<span class="nb-done-pill">✓</span>`
                                : `<button type="button" class="brass-btn ${enough ? 'gold-cta' : ''} nb-mini-cta" data-nb-crate="${escapeHtml(nb.id)}|${escapeHtml(crate.id)}" ${!enough ? 'disabled' : ''}>📦 Giúp</button>`
                            }
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
              : '';

          const sosHtml =
            sos && sosMeta
              ? `
                <div class="nb-coop-section sos ${alreadyRescuedThisFriend ? 'done' : ''}">
                  <div class="nb-sos-row">
                    <div class="nb-sos-info">
                      <div class="nb-sos-title">
                        ⚔️ ${sosMeta.icon} ${escapeHtml(sosMeta.nameVi)} • <strong>Màn ${sos.stage}</strong>
                      </div>
                    </div>
                    ${
                      alreadyRescuedThisFriend
                        ? `<span class="nb-done-pill">✓ 1/1</span>`
                        : `<button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${escapeHtml(nb.id)}" ${!rescueCheck.ok ? 'disabled' : ''} title="${escapeHtml(rescueCheck.reason ?? 'Giải cứu')}">⚔️ Cứu</button>`
                    }
                  </div>
                </div>
              `
              : '';

          return `
            <article class="nb-friend-card ${isVisitingThis ? 'visiting' : ''} ${isFocused ? 'focused' : ''}" data-neighbor-card="${escapeHtml(nb.id)}">
              <div class="nb-card-head">
                <div class="nb-avatar-circle" aria-hidden="true">${escapeHtml(nb.avatarEmoji)}</div>
                <div class="nb-head-info">
                  <div class="nb-name-row">
                    <strong class="nb-friend-name">${escapeHtml(nb.name)}</strong>
                    <span class="nb-badge-pill">Lv.${nb.level}</span>
                    <span class="nb-badge-pill house">${houseLabelMap[nb.house]}</span>
                    <span class="nb-code-tag">${escapeHtml(nb.friendCode)}</span>
                  </div>
                </div>
              </div>

              <div class="nb-garden-pills">
                <span class="nb-garden-pill ${nb.helpedMarksToday.length >= maxGardenHelps ? 'done' : ''}">
                  💧 <strong>${nb.helpedMarksToday.length}/${maxGardenHelps}</strong>
                </span>
                <span class="nb-garden-pill ${mysteryClaimedToday ? 'done' : ''}">
                  🎁 <strong>${mysteryClaimedToday ? '✓' : '+1🍀'}</strong>
                </span>
                <span class="nb-garden-pill ${likedToday ? 'done' : ''}">
                  ❤️ <strong>${likedToday ? '✓' : '+1🍀'}</strong>
                </span>
              </div>

              ${cratesHtml}
              ${sosHtml}

              <div class="nb-card-actions">
                ${
                  isVisitingThis
                    ? `<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta">🏡 Về Nhà</button>`
                    : `<button type="button" class="brass-btn gold-cta" data-nb-visit="${escapeHtml(nb.id)}">🚂 Thăm</button>`
                }
                <button type="button" class="brass-btn" data-nb-like="${escapeHtml(nb.id)}" ${likedToday ? 'disabled' : ''}>
                  ${likedToday ? '✓ Đã Tim' : '❤️ +1🍀'}
                </button>
                <button type="button" class="brass-btn nb-mini-cta" data-nb-remove="${escapeHtml(nb.id)}" title="Xoá bạn">
                  ✕
                </button>
              </div>
            </article>
          `;
        })
        .join('');

      const emptyFriendsHtml = `
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🤝 Kết Bạn</div>
          <div class="nb-my-code-box">
            <div>
              <div style="font-size:11.5px;opacity:0.82;">Mã của bạn:</div>
              <strong class="nb-my-code-val">${escapeHtml(social.playerFriendCode)}</strong>
            </div>
            <button id="btnNbCopyCode" type="button" class="brass-btn nb-mini-cta">📋 Sao Chép</button>
          </div>
          <form id="frmAddNeighborCode" class="nb-add-friend-form">
            <div class="nb-form-field">
              <label for="inpFriendCode">Mã bạn bè</label>
              <input id="inpFriendCode" name="friendCode" type="text" maxlength="20" placeholder="HS-ABCD-12" autocomplete="off" required />
            </div>
            <div class="nb-form-field">
              <label for="inpFriendName">Tên (tuỳ chọn)</label>
              <input id="inpFriendName" name="friendName" type="text" maxlength="28" placeholder="Tên bạn" autocomplete="off" />
            </div>
            <button id="btnSubmitAddFriend" type="submit" class="brass-btn gold-cta">🤝 Kết Bạn</button>
          </form>
        </section>
      `;

      bodyHtml = `
        ${quickAlertBanners.join('')}
        ${social.neighbors.length > 0 ? `<div class="nb-friends-list">${cardsHtml}</div>` : emptyFriendsHtml}
      `;
    } else if (this.activeNeighborTab === 'chest') {
      const owlReqsHtml =
        social.playerOwlHelpRequests.length > 0
          ? social.playerOwlHelpRequests
              .map((r) => {
                const meta = getFarmItemMeta(r.itemId);
                return `
                  <div class="nb-crate-item ${r.fulfilledAt ? 'done' : ''}">
                    <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="nb-crate-icon" />
                    <div class="nb-crate-info">
                      <div class="nb-crate-title">${r.qty} ${escapeHtml(meta.name)}</div>
                      <div class="nb-crate-rew">${
                        r.fulfilledAt
                          ? `✓ ${escapeHtml(r.helperEmoji ?? '🦉')} ${escapeHtml(r.helperName ?? 'Bạn')}`
                          : '🦉 Đang gọi...'
                      }</div>
                    </div>
                  </div>
                `;
              })
              .join('')
          : `<div style="font-size:12px;opacity:0.8;">Trống</div>`;

      bodyHtml = `
        <div class="nb-chest-grid">
          <section class="nb-panel-card highlight">
            <div class="nb-section-title">🎁 Rương (${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)</div>
            <div class="quest-bar" style="height:12px;margin:8px 0;">
              <div class="quest-bar-fill" style="width:${chestPct}%"></div>
            </div>
            <div class="nb-chest-rewards">
              <span class="owl-rew-pill gold">🌟 +2</span>
              <span class="owl-rew-pill plug">🔥 +1</span>
              <span class="owl-rew-pill xp">🌱 +2</span>
              <span class="owl-rew-pill gold">🪙 +150G</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;flex-wrap:wrap;">
              <span style="font-size:12px;font-weight:700;">Đã mở: ${social.chestsOpened}</span>
              <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${!chestReady ? 'disabled' : ''}>
                🎁 Mở Rương (${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)
              </button>
            </div>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🆘 Cầu Viện</div>
            <div style="margin-bottom:10px;">
              ${
                mySos
                  ? `
                    <div class="nb-alert-banner ${mySos.rescuedAt ? 'ready' : ''}" style="margin:0;">
                      <span>${
                        mySos.rescuedAt
                          ? `🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn')}</strong> cứu <strong>Màn ${mySos.stage}</strong>!`
                          : `🦉 Đang gọi cứu <strong>Màn ${mySos.stage}</strong>...`
                      }</span>
                      ${
                        mySos.rescuedAt
                          ? `<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>`
                          : ''
                      }
                    </div>
                  `
                  : `<div style="font-size:12px;opacity:0.8;">⚔️ 🆘 ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}</div>`
              }
            </div>
            <div>
              <div style="font-size:12px;font-weight:800;margin-bottom:4px;">🦉 Đơn Cú (${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}):</div>
              <div class="nb-crate-list">${owlReqsHtml}</div>
            </div>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🦉 Mã Kết Bạn</div>
            <div class="nb-my-code-box">
              <div>
                <strong class="nb-my-code-val">${escapeHtml(social.playerFriendCode)}</strong>
              </div>
              <button id="btnNbCopyCode" type="button" class="brass-btn nb-mini-cta">📋 Sao Chép</button>
            </div>
            <form id="frmAddNeighborCode" class="nb-add-friend-form">
              <div class="nb-form-field">
                <label for="inpFriendCode">Mã bạn bè</label>
                <input id="inpFriendCode" name="friendCode" type="text" maxlength="20" placeholder="HS-ABCD-12" autocomplete="off" required />
              </div>
              <div class="nb-form-field">
                <label for="inpFriendName">Tên (tuỳ chọn)</label>
                <input id="inpFriendName" name="friendName" type="text" maxlength="28" placeholder="Tên bạn" autocomplete="off" />
              </div>
              <button id="btnSubmitAddFriend" type="submit" class="brass-btn gold-cta">🤝 Kết Bạn</button>
            </form>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🏮 Lời Chúc</div>
            <div class="nb-preset-notes">
              ${NEIGHBOR_PRESET_NOTES.map((n) => {
                const active = n.id === social.selectedPresetNoteId;
                return `
                  <button type="button" data-nb-note="${n.id}" data-active="${active}" aria-pressed="${active}" class="brass-btn nb-note-btn">
                    ${n.emoji} ${escapeHtml(n.shortVi)}
                  </button>
                `;
              }).join('')}
            </div>
          </section>
        </div>
      `;
    } else {
      const logItemsHtml =
        social.activityLog.length > 0
          ? social.activityLog
              .map((entry) => {
                const d = new Date(entry.timestamp);
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                return `
                  <div class="nb-log-row">
                    <span class="nb-log-icon" aria-hidden="true">${escapeHtml(entry.icon)}</span>
                    <span class="nb-log-msg">${escapeHtml(entry.textVi)}</span>
                    <span class="nb-log-time">${hh}:${mm}</span>
                  </div>
                `;
              })
              .join('')
          : `<div class="nb-panel-card">Trống</div>`;

      bodyHtml = `<div class="nb-log-list">${logItemsHtml}</div>`;
    }

    box.innerHTML = `
      ${topStatsHtml}
      ${tabsHtml}
      ${bodyHtml}
    `;

    box.querySelectorAll<HTMLButtonElement>('[data-nbtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.activeNeighborTab = btn.dataset.nbtab as 'friends' | 'chest' | 'log';
        this.renderNeighborDialog();
      });
    });

    const handleOpenChest = () => {
      const res = this.sim.openFriendshipChest();
      if (!res.ok) {
        this.showToast(res.msg, '🍀');
      }
      this.refreshAll();
      this.renderNeighborDialog();
    };
    box.querySelector('#btnNbQuickOpenChest')?.addEventListener('click', handleOpenChest);
    box.querySelector('#btnNbOpenFriendshipChest')?.addEventListener('click', handleOpenChest);
    box.querySelector('#btnNbOpenFriendsLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.openLeaderboardDialog(undefined, 'friends');
    });

    box.querySelectorAll<HTMLButtonElement>('#btnNbClaimMySos').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = this.sim.claimPlayerMinigameSosRescue();
        if (!res.ok) {
          this.showToast(res.msg, '⚠️');
        }
        this.refreshAll();
        this.renderNeighborDialog();
      });
    });

    box.querySelector('#btnNbClaimAllLanterns')?.addEventListener('click', () => {
      const marks = [...this.sim.ensureNeighborSocial().homeLanternMarks];
      for (const mk of marks) {
        this.sim.claimHomeLanternMark(mk.id);
      }
      this.refreshAll();
      this.renderNeighborDialog();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-visit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbVisit;
        if (nid) this.enterVisitFromHud(nid);
      });
    });

    box.querySelector('#btnNbExitCurrentVisit')?.addEventListener('click', () => {
      const dlg = this.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
      dlg?.close();
      this.exitVisitFromHud();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-like]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbLike;
        if (!nid) return;
        const res = this.sim.likeVisitedNeighborFarm(nid);
        if (!res.ok) this.showToast(res.msg, '❤️');
        this.refreshAll();
        this.renderNeighborDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-crate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.nbCrate ?? '';
        const [nid, cid] = raw.split('|');
        if (!nid || !cid) return;
        const res = this.sim.fulfillNeighborOwlCrate(nid, cid);
        if (!res.ok) {
          this.showToast(res.msg, '🧺');
        }
        this.refreshAll();
        this.renderNeighborDialog();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-rescue]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbRescue;
        if (!nid) return;
        const check = this.sim.canRescueNeighborMinigame(nid);
        if (!check.ok || !check.neighbor || !check.sos) {
          this.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
          return;
        }
        this.openMinigameRescue({
          neighborId: check.neighbor.id,
          neighborName: check.neighbor.name,
          neighborEmoji: check.neighbor.avatarEmoji,
          kind: check.sos.kind,
          stage: check.sos.stage,
        });
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbRemove;
        if (!nid) return;
        const res = this.sim.removeNeighborFriend(nid);
        this.showToast(res.msg, res.ok ? '📋' : '⚠️');
        this.refreshAll();
        this.renderNeighborDialog();
      });
    });

    box.querySelector('#btnNbCopyCode')?.addEventListener('click', () => {
      const code = this.sim.ensureNeighborSocial().playerFriendCode;
      registerRealPlayerProfileOnline(
        this.sim.state as unknown as Record<string, unknown>
      ).catch(() => {});
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(() => this.showToast(`Đã sao chép Mã Thung Lũng: ${code}!`, '📋'))
          .catch(() => this.showToast(`Mã Thung Lũng của bạn: ${code}`, '🦉'));
      } else {
        this.showToast(`Mã Thung Lũng của bạn: ${code}`, '🦉');
      }
    });

    const addForm = box.querySelector('#frmAddNeighborCode') as HTMLFormElement | null;
    addForm?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const codeInp = box.querySelector('#inpFriendCode') as HTMLInputElement | null;
      const nameInp = box.querySelector('#inpFriendName') as HTMLInputElement | null;
      const submitBtn = box.querySelector('#btnSubmitAddFriend') as HTMLButtonElement | null;
      const rawCode = (codeInp?.value ?? '').trim();
      const customName = (nameInp?.value ?? '').trim();

      if (rawCode.toUpperCase() === this.sim.ensureNeighborSocial().playerFriendCode.toUpperCase()) {
        this.showToast('Đây là Mã Thung Lũng của chính bạn rồi!', '⚠️');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '🔍 Đang tìm...';
      }
      await registerRealPlayerProfileOnline(
        this.sim.state as unknown as Record<string, unknown>
      ).catch(() => {});
      const lookup = await lookupRealPlayerByFriendCode(rawCode);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🤝 Kết Bạn';
      }

      if (!lookup.ok || !lookup.profile) {
        this.showToast(lookup.msg, '⚠️');
        return;
      }

      const res = this.sim.addVerifiedRealFriend(lookup.profile, customName || undefined);
      if (!res.ok) {
        this.showToast(res.msg, '⚠️');
        return;
      }
      if (res.neighbor) {
        this.focusedNeighborId = res.neighbor.id;
        this.activeNeighborTab = 'friends';
      }
      this.refreshAll();
      this.renderNeighborDialog();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-note]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const noteId = btn.dataset.nbNote as NeighborPresetNoteId | undefined;
        if (!noteId) return;
        this.sim.setNeighborPresetNote(noteId);
        this.showToast('Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!', '🏮');
        this.renderNeighborDialog();
      });
    });
  }

  public panCameraToTutorialTarget(): void {
    const worldTarget = this.sim.getTutorialWorldTarget();
    if (!worldTarget) return;
    if (this.cam.zoom < 0.85) {
      this.cam.zoom = 0.98;
    }
    const bottomSheetBusy =
      this.seedTrayOpen ||
      this.pastureTrayOpen ||
      this.buildSheetOpen ||
      Boolean(this.activeCategory);
    const gridBias = bottomSheetBusy ? -0.35 : 0.95;
    centerCameraOnGrid(
      this.cam,
      worldTarget.gx + worldTarget.bw * 0.5 + gridBias,
      worldTarget.gy + worldTarget.bh * 0.5 + gridBias
    );
    this.onCameraJump?.();
  }

  private resolveTutorialHudTarget(): { el: HTMLElement | null; label: string } {
    const step = this.sim.getCurrentTutorialStep();
    if (!step) return { el: null, label: '' };

    if (step.id === 'harvest_wheat') {
      const hasPlot = Boolean(this.sim.getTutorialWorldTarget());
      if (!hasPlot) {
        return {
          el: this.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null,
          label: '👇 Đặt ruộng',
        };
      }
      return { el: null, label: '' };
    }

    if (step.id === 'sow_and_merge_plot') {
      if (this.activeSeedCropId) {
        return { el: null, label: '' };
      }
      if (this.seedTrayOpen) {
        const roseCard =
          (this.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])') as HTMLElement | null) ??
          (this.root.querySelector('[data-seed-brush]:not([disabled])') as HTMLElement | null);
        return { el: roseCard, label: '🌸 Chọn Hoa' };
      }
      return {
        el: this.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null,
        label: '🌱 Kho Hạt',
      };
    }

    if (step.id === 'pasture_harvest_and_stock') {
      const now = Date.now();
      const readyPasture = this.sim.state.buildings.some(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (readyPasture && !this.sim.state.tutorial?.pastureHarvestedInStep3) {
        return { el: null, label: '' };
      }
      if (this.activePastureAnimalId) {
        return { el: null, label: '' };
      }
      if (this.pastureTrayOpen) {
        const sheepOrHen =
          (this.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])') as HTMLElement | null) ??
          (this.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])') as HTMLElement | null);
        return { el: sheepOrHen, label: '🐾 Chọn thú' };
      }
      return {
        el: this.root.querySelector('#btnOpenPastureTray') as HTMLElement | null,
        label: '🐾 Chăn Thả',
      };
    }

    if (step.id === 'seed_quiz_or_buy') {
      if (this.seedTrayOpen) {
        return {
          el: this.root.querySelector('#btnSeedTrayOpenQuiz') as HTMLElement | null,
          label: '🪄 Nhận 0G',
        };
      }
      return {
        el: this.root.querySelector('#btnTutorialPrimaryCta') as HTMLElement | null,
        label: '🪄 Thần Chú',
      };
    }

    if (step.id === 'earn_magic_star') {
      return {
        el: this.root.querySelector('#btnCornerPlayPuzzle') as HTMLElement | null,
        label: '🍓 Chơi!',
      };
    }

    if (step.id === 'build_and_owl_order') {
      if (this.selectedCatalogItem) {
        return { el: null, label: '' };
      }
      if (this.buildSheetOpen || this.activeCategory) {
        const houseOrBakery =
          (this.root.querySelector('[data-item-id="burrow_house_canon"]') as HTMLElement | null) ??
          (this.root.querySelector('[data-item-id="molly_apple_bakery"]') as HTMLElement | null);
        if (houseOrBakery) {
          return { el: houseOrBakery, label: '✨ Chọn dựng!' };
        }
      }
      if (this.sim.getReadyOwlOrdersCount() > 0) {
        return {
          el: this.root.querySelector('#btnOpenQuests') as HTMLElement | null,
          label: '🦉 Giao Đơn!',
        };
      }
      return {
        el: this.root.querySelector('#btnToggleBuildDock') as HTMLElement | null,
        label: '🔨 Xây Dựng',
      };
    }

    return { el: null, label: '' };
  }

  public updateTutorialHudSpotlight(): void {
    const spot = this.root.querySelector('#tutorialHudSpotlight') as HTMLElement | null;
    const spotLbl = this.root.querySelector('#tutorialHudSpotlightLabel') as HTMLElement | null;
    this.root
      .querySelectorAll<HTMLElement>('[data-tutorial-anchor="true"]')
      .forEach((el) => el.removeAttribute('data-tutorial-anchor'));
    if (!spot) return;

    const anyModalOpen = Boolean(document.querySelector('dialog[open]'));
    if (this.photoModeActive || anyModalOpen || !this.sim.isTutorialActive()) {
      spot.classList.add('hidden');
      return;
    }

    const { el, label } = this.resolveTutorialHudTarget();
    if (!el || el.id === 'btnTutorialPrimaryCta') {
      spot.classList.add('hidden');
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) {
      spot.classList.add('hidden');
      return;
    }

    const isInsideTransformedTray = Boolean(
      el.closest('#seedBrushTray, #pastureBrushTray, #visitorDockBar')
    );
    if (!isInsideTransformedTray) {
      el.setAttribute('data-tutorial-anchor', 'true');
    }
    spot.classList.toggle('use-css-anchor', !isInsideTransformedTray);
    const pad = 6;
    spot.style.setProperty('--spot-left', `${Math.round(rect.left - pad)}px`);
    spot.style.setProperty('--spot-top', `${Math.round(rect.top - pad)}px`);
    spot.style.setProperty('--spot-w', `${Math.round(rect.width + pad * 2)}px`);
    spot.style.setProperty('--spot-h', `${Math.round(rect.height + pad * 2)}px`);
    spot.classList.toggle('pill-below', rect.top < 110);
    if (spotLbl) {
      spotLbl.textContent = label || '👇 Bấm';
    }
    spot.classList.remove('hidden');
  }

  private hideTutorialPopover(card: HTMLElement): void {
    if (typeof (card as HTMLElement & { hidePopover?: () => void }).hidePopover === 'function') {
      try {
        if (card.matches(':popover-open')) {
          (card as HTMLElement & { hidePopover: () => void }).hidePopover();
        }
      } catch {
        // Ignore if not currently open
      }
    }
    card.classList.remove('is-legacy-open');
  }

  private showTutorialPopover(card: HTMLElement): void {
    if (typeof (card as HTMLElement & { showPopover?: () => void }).showPopover === 'function') {
      try {
        if (!card.matches(':popover-open')) {
          (card as HTMLElement & { showPopover: () => void }).showPopover();
        }
        return;
      } catch {
        // Fall through to legacy fixed class fallback
      }
    }
    card.classList.add('is-legacy-open');
  }

  public renderTutorialCoach(): void {
    const card = this.root.querySelector('#tutorialCoachCard') as HTMLElement | null;
    if (!card) return;

    const anyModalOpen = Boolean(document.querySelector('dialog[open]'));
    const step = this.sim.getCurrentTutorialStep();
    if (this.photoModeActive || anyModalOpen || !step) {
      this.hideTutorialPopover(card);
      this.updateTutorialHudSpotlight();
      return;
    }

    const bottomSheetBusy =
      this.seedTrayOpen ||
      this.pastureTrayOpen ||
      this.buildSheetOpen ||
      Boolean(this.activeCategory) ||
      Boolean(this.selectedCatalogItem);
    card.classList.toggle('docked-top', bottomSheetBusy);
    card.classList.toggle('is-minimized', this.tutorialMinimized);

    const deliverableOwlCount = this.sim.getReadyOwlOrdersCount();
    const renderSig = `${step.index}:${step.id}:${this.tutorialMinimized ? 1 : 0}:${bottomSheetBusy ? 1 : 0}:${deliverableOwlCount}`;

    if (this.lastRenderedTutorialSig !== renderSig) {
      this.lastRenderedTutorialSig = renderSig;
      const dotsHtml = TUTORIAL_STEPS.map((s) => {
        const stateCls =
          s.index < step.index ? 'done' : s.index === step.index ? 'current' : 'upcoming';
        return `<span class="tutorial-step-dot ${stateCls}" aria-hidden="true"></span>`;
      }).join('');

      if (this.tutorialMinimized) {
        card.innerHTML = `
          <div class="tutorial-mini-bar">
            <img src="/sprites/${step.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${escapeHtml(step.title)}</h2>
            </div>
            <button id="btnTutorialExpand" type="button" data-tutorial-focus class="brass-btn gold-cta">▴ Mở</button>
            <button
              id="btnTutorialSkipMini"
              type="button"
              popovertarget="tutorialCoachCard"
              popovertargetaction="hide"
              class="brass-btn tutorial-skip-btn"
              aria-label="Bỏ qua hướng dẫn"
            >✕</button>
          </div>
        `;
      } else {
        const extraActionBtn =
          step.id === 'earn_magic_star'
            ? `<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>`
            : step.id === 'build_and_owl_order'
              ? `<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${
                  deliverableOwlCount > 0 ? '🔨 Xây' : '🦉 Đơn Cú'
                }</button>`
              : '';

        const primaryLabel =
          step.id === 'build_and_owl_order'
            ? deliverableOwlCount > 0
              ? '🦉 Giao Đơn!'
              : '🔨 Xây Dựng'
            : step.ctaLabel;

        card.innerHTML = `
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/sprites/${step.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${TUTORIAL_STEPS.length}"
              aria-valuenow="${step.index + 1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${dotsHtml}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${escapeHtml(step.speakerName)}
              </div>
              <div class="tutorial-top-controls">
                <button
                  id="btnTutorialMinimize"
                  type="button"
                  class="tutorial-ghost-btn"
                  aria-label="Thu gọn bảng hướng dẫn"
                >▾</button>
                <button
                  id="btnTutorialSkip"
                  type="button"
                  popovertarget="tutorialCoachCard"
                  popovertargetaction="hide"
                  class="tutorial-ghost-btn tutorial-skip-btn"
                  aria-label="Bỏ qua hướng dẫn"
                >✕</button>
              </div>
            </div>
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${escapeHtml(step.title)}</h2>
            <div class="tutorial-hint-strip">${escapeHtml(step.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${escapeHtml(step.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${extraActionBtn}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${escapeHtml(primaryLabel)}</button>
              </div>
            </div>
          </div>
        `;
      }

      card.querySelector('#btnTutorialExpand')?.addEventListener('click', () => {
        this.tutorialMinimized = false;
        this.renderTutorialCoach();
      });
      card.querySelector('#btnTutorialMinimize')?.addEventListener('click', () => {
        this.tutorialMinimized = true;
        this.renderTutorialCoach();
      });
      card.querySelector('#btnTutorialSkip')?.addEventListener('click', () => {
        this.sim.skipTutorial();
      });
      card.querySelector('#btnTutorialSkipMini')?.addEventListener('click', () => {
        this.sim.skipTutorial();
      });
      card.querySelector('#btnTutorialPrimaryCta')?.addEventListener('click', () => {
        this.handleTutorialPrimaryAction(step.id);
      });
      card.querySelector('#btnTutorialSecondaryCta')?.addEventListener('click', () => {
        if (step.id === 'earn_magic_star') {
          this.openPuzzleArcadeDialog();
        } else if (step.id === 'build_and_owl_order') {
          if (deliverableOwlCount > 0) {
            this.closeSeedTray();
            this.closePastureTray();
            this.buildSheetOpen = true;
            this.activeCategory = 'shop';
            this.refreshAll();
          } else {
            this.activeQuestTab = 'orders';
            this.renderQuestDialog();
            (this.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
          }
        }
      });
    }

    this.showTutorialPopover(card);

    const stepFocusKey = `${step.index}:${step.id}`;
    if (this.lastFocusedTutorialStepKey !== stepFocusKey) {
      this.lastFocusedTutorialStepKey = stepFocusKey;
      requestAnimationFrame(() => {
        card
          .querySelector<HTMLElement>('[data-tutorial-focus]')
          ?.focus({ preventScroll: true });
      });
    }

    this.updateTutorialHudSpotlight();
  }

  private handleTutorialPrimaryAction(stepId: string): void {
    if (stepId === 'harvest_wheat') {
      const target = this.sim.getTutorialWorldTarget();
      if (target) {
        this.panCameraToTutorialTarget();
        this.showToast('🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!', '🌾');
      } else {
        const plotItem = getCatalogItem('farmland_plot');
        if (plotItem) {
          this.selectedCatalogItem = plotItem;
          this.refreshAll();
        }
      }
      return;
    }

    if (stepId === 'sow_and_merge_plot') {
      this.panCameraToTutorialTarget();
      this.seedFilterMode = 'flowers';
      this.openSeedTray('english_rose');
      return;
    }

    if (stepId === 'pasture_harvest_and_stock') {
      this.panCameraToTutorialTarget();
      const now = Date.now();
      const hasReadyPasture = this.sim.state.buildings.some(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (hasReadyPasture && !this.sim.state.tutorial?.pastureHarvestedInStep3) {
        this.showToast('👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!', '🥚');
      } else {
        this.openPastureTray('ottery_sheep');
      }
      return;
    }

    if (stepId === 'seed_quiz_or_buy') {
      this.openSeedQuizDialog('meadow_daisy', null);
      return;
    }

    if (stepId === 'earn_magic_star') {
      this.openMatch3Dialog();
      return;
    }

    if (stepId === 'build_and_owl_order') {
      if (this.sim.getReadyOwlOrdersCount() > 0) {
        this.activeQuestTab = 'orders';
        this.renderQuestDialog();
        (this.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
      } else {
        this.closeSeedTray();
        this.closePastureTray();
        this.buildSheetOpen = true;
        this.activeCategory = 'shop';
        this.refreshAll();
      }
    }
  }
}
