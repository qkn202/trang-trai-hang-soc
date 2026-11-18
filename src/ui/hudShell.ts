import { shareFarmPhoto } from '../hpvn/bridge';
// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

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
  clearBuildToolModes,
  escapeHtml,
  isWinterChristmasBuildItem,
} from "./hudShared";
import type { GameHUD } from './hud';

export function shellMountDOM(hud: GameHUD): void {
    const hudWrap = document.createElement('div');
    hudWrap.className = 'hud-shell-root';
    hudWrap.innerHTML = `
      <div id="hudFrameTop" class="hud-frame-top">
        <!-- KHU VƯỜN HAGRID × HANG SÓC COMPACT SINGLE-ROW TOP HUD -->
        <header class="ts-top-hud hg-top-hud">
          <!-- 1. TOP-LEFT: Level Ring + Unified Supplies Pill -->
          <div class="ts-hud-topleft hg-top-left">
            <button
              id="btnOpenRoadmap"
              type="button"
              class="hg-level-btn"
              aria-label="Hồ sơ cấp độ và lộ trình 100 cấp"
              title="Cấp Độ Điền Trang &amp; Lộ Trình 100 Cấp"
            >
              <span class="hg-level-ring" aria-hidden="true">
                <span id="lblLevelNum" data-fly-target="xp" class="hg-level-num">1</span>
              </span>
              <span class="sr-only-hud">
                <span id="lblTitle">Người Khai Hoang</span>
                <span id="barLevelTopFill"></span>
                <span id="xpBarShell"><span id="barXpFill"></span><span id="lblXpFraction">0/200</span></span>
              </span>
            </button>

            <div class="hg-supplies-pill" role="group" aria-label="Tài nguyên điền trang">
              <button
                id="chipHudSickle"
                data-fly-target="galleons"
                type="button"
                class="hg-res-item"
                aria-label="Sickle — Sổ Cái và Quầy Gringotts"
                title="Sổ Cái &amp; Quầy Gringotts"
              >
                <span class="hg-res-glyph hg-glyph-coin" aria-hidden="true">S</span>
                <span id="lblSickle" class="hg-res-val">1.450</span>
                <span id="btnPlusSickle" class="sr-only-hud">+</span>
              </button>

              <span
                id="btnHudSandChip"
                data-fly-target="sand"
                class="hg-res-item is-readonly"
                aria-label="Cát Thời Gian"
                title="Cát Thời Gian"
              >
                <span class="hg-res-glyph hg-glyph-gem" aria-hidden="true">◆</span>
                <span id="lblSand" class="hg-res-val">28</span>
                <span id="btnPlusSand" class="sr-only-hud">+</span>
              </span>

              <span
                id="btnHudMinigameHub"
                data-fly-target="stars"
                class="hg-res-item is-readonly"
                aria-label="Sao Phép Thuật"
                title="Sao Phép Thuật"
              >
                <img src="/game/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="hg-res-star-img" aria-hidden="true" />
                <strong id="lblHudHubStars" class="hg-res-val">3</strong>
                <span id="lblHudHubTrial" class="sr-only-hud"></span>
              </span>

              <button
                id="btnHudActiveBuilds"
                type="button"
                class="hg-res-item hg-res-build hidden"
                aria-label="Công trình đang xây dựng"
                title="Đang xây"
              >
                <span aria-hidden="true">🔨</span>
                <span id="lblActiveBuilds" class="hg-res-val">0</span>
              </button>
            </div>
          </div>

          <div id="tsParchmentBanner" class="sr-only-hud" aria-hidden="true">
            <span id="lblParkRibbonName">Hang Sóc</span>
          </div>

          <!-- 3. TOP-RIGHT: Hagrid's Farm Round Brass Buttons (Kho · Floo/Bạn Bè · Menu Vườn) -->
          <div class="ts-hud-topright hg-top-actions">
            <button
              id="chipHudBarn"
              type="button"
              class="hg-round-btn"
              aria-label="Mở Kho Nông Sản và Xưởng Chế Biến"
              title="Kho Nông Sản &amp; Xưởng Chế Biến Hang Sóc"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 42 42" class="hg-round-svg" aria-hidden="true">
                  <path d="M5 18 L21 6 L37 18 L34 18 L34 36 L8 36 L8 18 Z" fill="#d94632" stroke="#231f2e" stroke-width="2.6" stroke-linejoin="round"/>
                  <path d="M4 19 L21 6 L38 19" fill="none" stroke="#f7e6c4" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
                  <rect x="14" y="21" width="14" height="15" fill="#992315" stroke="#f7e6c4" stroke-width="1.8"/>
                  <path d="M14 21 L28 36 M28 21 L14 36" stroke="#f7e6c4" stroke-width="1.8"/>
                </svg>
              </span>
              <small id="lblStorageBarn" class="hg-round-count">42/60</small>
              <span id="btnOpenStorageBarn" class="sr-only-hud">Kho</span>
            </button>

            <button
              id="btnOpenNeighbors"
              data-fly-target="friendship"
              type="button"
              class="hg-round-btn"
              aria-label="Mạng Floo và Thăm Vườn Bạn Bè"
              title="Mạng Floo &amp; Thăm Vườn Bạn Bè (Phím N)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <img src="/game/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-round-img" aria-hidden="true" />
              </span>
              <span id="badgeNeighborCount" class="hg-round-badge hidden">1</span>
            </button>

            <button
              id="btnToggleManageMenu"
              type="button"
              class="hg-round-btn hg-menu-btn"
              aria-label="Menu khu vườn"
              aria-expanded="false"
              aria-controls="managePopoverMenu"
              title="Menu Khu Vườn (Bản Đồ, Lễ Hội, Cúp Nhà, Sổ Tay, Đổi Game &amp; Cài Đặt)"
            >
              <span class="hg-round-frame" aria-hidden="true">
                <svg viewBox="0 0 36 36" class="hg-round-svg" aria-hidden="true">
                  <rect x="8.5" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="8.5" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="8.5" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                  <rect x="19.7" y="19.7" width="7.8" height="7.8" rx="2.2" fill="#f5d69a"/>
                </svg>
              </span>
              <span id="badgeManageMenuDot" class="hg-round-badge hidden">!</span>
            </button>
          </div>
        </header>

        <!-- MENU KHU VƯỜN (PHONG CÁCH VƯỜN HAGRID — GỌN GÀNG, RÕ RÀNG, ĐẦY ĐỦ BẢN ĐỒ & ĐỔI GAME) -->
        <nav id="managePopoverMenu" class="hud-floating-popover hg-garden-menu hidden" aria-label="Menu khu vườn">
          <div class="hg-menu-head">
            <div class="hg-menu-brand">
              <span class="hg-menu-seal" aria-hidden="true">🌿</span>
              <div>
                <strong class="hg-menu-title">Menu Khu Vườn</strong>
                <small class="hg-menu-sub">Hang Sóc &amp; Hogsmeade</small>
              </div>
            </div>
            <button id="btnCloseManageMenu" type="button" class="hpvn-menu-close" aria-label="Đóng">✕</button>
          </div>

          <div class="manage-status-strip hg-menu-status">
            <span id="btnHudStarChip" class="stat-chip" title="Sao Phép Thuật"><img src="/game/trang-trai-hang-soc/sprites/m3_icon_star.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></span>
            <span id="btnHudHeartChip" class="stat-chip" title="Tim Bùa Gặt"><img src="/game/trang-trai-hang-soc/sprites/m3_icon_heart.webp" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></span>
            <button id="btnHappySmiley" type="button" class="stat-chip stat-chip-btn" title="Sổ Cái">Vui <span id="lblWonder">4.5</span></button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">--:--</button>
          </div>

          <!-- Lưới điểm đến chuẩn Vườn Hagrid: Bản đồ, Thăm vườn, Hồ sơ/Cúp Nhà, Lễ hội, Sổ tay, Vali, Kho, Việc quê, Cài đặt -->
          <p class="hg-menu-group" id="hgMenuGroupPlaces">Điểm đến</p>
          <div class="hg-menu-grid" role="group" aria-labelledby="hgMenuGroupPlaces">
            <button id="btnOpenWorldMap" type="button" class="hg-menu-node" title="Đại Bản Đồ 10 Vùng Đất &amp; Lộ Trình 100 Cấp">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_world_map.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Bản Đồ</span>
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="hg-menu-node" title="Cổng Floo &amp; Thăm Vườn Bạn Bè (Phím N)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_staff.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Thăm Vườn</span>
              <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenAlbum" type="button" class="hg-menu-node" title="Hồ Sơ, Cúp 4 Nhà &amp; Bảng Xếp Hạng">
              <span class="hg-menu-medal" aria-hidden="true">🏆</span>
              <span class="hg-menu-label">Hồ Sơ &amp; BXH</span>
              <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenHarvestFeast" type="button" class="hg-menu-node" title="Đại Tiệc Mùa Gặt Hang Sóc (30 Bậc)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Lễ Hội</span>
              <span id="badgeFeastCount" class="badge-dot hidden">1</span>
              <span id="badgeManageFeastCount" class="sr-only-hud hidden">0</span>
            </button>
            <button id="btnOpenMenuSeedQuiz" type="button" class="hg-menu-node" title="Sổ Tay Cổ Ngữ &amp; Học Viện Thần Chú Đa Ngữ">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_notebook.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Tay</span>
            </button>
            <button id="btnOpenSuitcase" type="button" class="hg-menu-node" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_suitcase.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Vali Thú</span>
              <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="hg-menu-node" title="Kho Nông Sản, Xưởng Chế Biến &amp; Tàu Hàng">
              <span class="hg-menu-medal" aria-hidden="true">🏡</span>
              <span class="hg-menu-label">Kho Xưởng</span>
              <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenFinance" type="button" class="hg-menu-node" title="Sổ Cái Tài Chính &amp; Việc Quê">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_ledger.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Sổ Cái</span>
            </button>
            <button id="btnOpenSettings" type="button" class="hg-menu-node" title="Cài Đặt Âm Nhạc, Thời Tiết &amp; Lưu Game">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/game/trang-trai-hang-soc/sprites/ui_settings_gear.webp" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Cài Đặt</span>
            </button>
          </div>

          <!-- HPVN 15/11: each group has a small name; seven games by their short tab names plus BXH, on the same 3-column grid -->
          <p class="hg-menu-group" id="hgMenuGroupGames">Trò chơi</p>
          <div class="hg-menu-games-pills" role="group" aria-labelledby="hgMenuGroupGames">
            <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 7.777 Màn (Phím J)">
              Bùa Gặt <small id="lblMatch3Lv" class="sr-only-hud">1/7777</small>
            </button>
            <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Ngũ Ấn Đạo Tặc (Phím K)">
              Ngũ Ấn <small id="lblArcadeTowerLv" class="sr-only-hud">0/3885</small>
            </button>
            <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" aria-label="Số Học Huyền Bí">Số Học</button>
            <button type="button" data-switch-minigame="blocks" class="hg-game-pill" aria-label="Sinh Vật Huyền Bí">Sinh Vật</button>
            <button type="button" data-switch-minigame="jigsaw" class="hg-game-pill" aria-label="Tranh Ghép Phép Thuật">Tranh Ghép</button>
            <button type="button" data-switch-minigame="chess" class="hg-game-pill" aria-label="Cờ Phù Thủy">Cờ Phù Thủy</button>
            <button type="button" data-switch-minigame="seedquiz" class="hg-game-pill" aria-label="Học Viện Thần Chú">Thần Chú</button>
          </div>

          <p class="hg-menu-group" id="hgMenuGroupTools">Công cụ</p>
          <div class="hg-menu-tools-row" role="group" aria-labelledby="hgMenuGroupTools">
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh &amp; vàng">Accio</button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" aria-pressed="false" title="Ghim bảng nhiệm vụ">Ghim NV</button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" aria-pressed="false" title="Hiện/ẩn Radar thu nhỏ">Radar</button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">Nhiệt</button>
            <button id="btnPhotoMode" type="button" class="brass-btn" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để chụp ảnh (Phím P)">Ảnh</button>
            <button id="btnMenuRotateCam" type="button" class="brass-btn" title="Xoay góc nhìn bản đồ 90° (Phím Q / E)">Bắc</button>
            <button id="btnMenuCutaway" type="button" aria-pressed="false" class="brass-btn" title="Nhìn xuyên nhà cao (Phím V)">Xuyên</button>
            <button id="btnMenuGrid" type="button" aria-pressed="false" class="brass-btn" title="Bật/Tắt lưới ô">Lưới</button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn" aria-pressed="false" title="Cuộn gọn thanh HUD quanh màn hình (Phím H)">Ẩn HUD</button>
            <!-- HPVN: the legal screen is gone, so no «Pháp Lý» button -->
            <button id="btnOpenZones" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Bản Đồ</button>
            <button id="btnToggleHudRollup" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true"><svg><path id="svgHudRollupChevron" d="M13.5 23 L18 18.5 L22.5 23"/></svg></button>
            <button id="btnManageOpenFeast" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Lễ Hội</button>
          </div>
        </nav>

        <!-- COZY PROGRESSIVE-DISCLOSURE POPOVER 2: LIVE WEATHER FORECAST & PARK SPEED -->
        <div id="weatherPopoverMenu" class="hud-floating-popover hidden" role="region" aria-label="Dự báo thời tiết và tốc độ công viên"></div>

        <!-- YULE EVENT BANNER -->
        <button id="yuleEventBanner" type="button" class="yule-event-banner hidden" aria-label="Mở nhiệm vụ Yule">
          <span class="yule-event-banner-icon">🎄</span>
          <span><strong id="yuleEventBannerTitle">Yule</strong><small id="yuleEventBannerTask"></small></span>
          <span id="yuleEventBannerProgress" class="yule-event-banner-progress"></span>
        </button>

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
            <button id="btnFloatingAutoPlace" type="button" class="brass-btn gold-cta hidden" style="padding:4px 10px;font-size:12px;">⚡ Đặt Ngay</button>
            <button id="btnFloatingSecondary" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingSwap" type="button" class="brass-btn hidden" style="padding:4px 8px;font-size:12px;"></button>
            <button id="btnFloatingExit" type="button" class="brass-btn gold-cta" aria-label="Thoát" style="padding:4px 8px;font-size:12px;">✕</button>
          </div>
        </div>

        <div class="hud-side-row">
          <!-- LEFT QUEST TRACKER (Hidden by default in clean Township view; toggleable) -->
          <aside id="questTrackerPanel" class="parchment-panel quest-tracker hidden" aria-label="Nhiệm vụ đang làm">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div class="hs-section-title">🦉 Nhiệm Vụ</div>
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!hud.questCollapsed}" style="padding:3px 9px;font-size:12px;">${hud.questCollapsed ? '+' : '–'}</button>
            </div>
            <div id="questTrackerBody" class="${hud.questCollapsed ? 'hidden' : ''}"></div>
          </aside>
        </div>
      </div>

      <!-- TOUCH PLACEMENT CONFIRM BAR (App Store Mobile/Tablet UX) -->
      <div id="touchConfirmBar" class="parchment-dark touch-confirm-bar hidden">
        <span id="lblTouchConfirm" style="font-size:13px;font-weight:700;color:#fde68a;"></span>
        <button id="btnTouchConfirmOk" type="button" class="brass-btn gold-cta" aria-label="Đặt">✓</button>
        <button id="btnTouchRotate" type="button" class="brass-btn" aria-label="Xoay">↻</button>
        <button id="btnTouchStash" type="button" class="brass-btn hidden" aria-label="Cất vào kho" title="Cất vào Kho Trang Trí (0 Sickle)">Cất</button>
        <button id="btnTouchCancel" type="button" class="brass-btn" aria-label="Hủy">✕</button>
      </div>

      <!-- INTERACTIVE ISOMETRIC MINIMAP (Tucked cleanly until requested) -->
      <div id="minimapWrap" class="parchment-dark minimap-wrap ts-minimap-docked hidden">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span class="minimap-title">🧭 Radar</span>
          <button id="btnToggleMinimap" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng bản đồ thu nhỏ" aria-expanded="${!hud.minimapCollapsed}" style="padding:2px 7px;font-size:12px;">${hud.minimapCollapsed ? '+' : '–'}</button>
        </div>
        <canvas id="minimapCanvas" class="${hud.minimapCollapsed ? 'hidden' : ''}" width="168" height="102" aria-label="Bản đồ thu nhỏ công viên"></canvas>
      </div>

      <!-- PHOTO MODE FLOATING BAR -->
      <div id="photoModeBar" class="parchment-dark photo-mode-bar hidden">
        <span style="font-size:13px;font-weight:700;color:#fde68a;">Chụp ảnh</span>
        <button id="btnSavePhotoPng" type="button" class="brass-btn gold-cta">🔥 Floo</button>
        <button id="btnSaveYulePostcard" type="button" class="brass-btn yule-postcard-btn" title="Gửi ảnh thiệp Giáng Sinh khung thông tuyết qua Mạng Floo">Khung Thiệp</button>
        <button id="btnExitPhoto" type="button" class="brass-btn" aria-label="Thoát chế độ chụp ảnh">✕</button>
      </div>

      <!-- COMPACT RESTORE PILL WHEN HUD IS ROLLED UP -->
      <button
        id="btnHudRoundOrb"
        type="button"
        class="hud-round-orb-btn hidden"
        aria-pressed="false"
        aria-label="Hiện giao diện HUD"
      >
        <span id="lblHudRoundOrbTag" class="hud-round-orb-tag">Hiện HUD</span>
      </button>

      <!-- TOAST STACK -->
      <div id="toastStack" class="owl-toast-stack" role="status" aria-live="polite" aria-atomic="false"></div>

      <!-- RIBBON UNVEIL WEASLEY CELEBRATION BANNER -->
      <div id="ribbonUnveilToastCard" class="ribbon-unveil-banner hidden" role="status" aria-live="polite"></div>

      <!-- FLY-TO-HUD WEB ANIMATIONS LAYER -->
      <div id="flyRewardLayer" class="fly-reward-layer" aria-hidden="true"></div>

      <!-- 4. BOTTOM-LEFT UNIFIED 4-CARD FARM & BUILD DOCK: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Xây Dựng -->
      <div id="tsCornerLeft" class="ts-corner-left hg-farm-dock" role="toolbar" aria-label="Nông trại và xây dựng">
        <button id="btnOpenQuests" type="button" class="ts-card-btn hg-dock-card" title="Đơn Hàng Cú &amp; Nhiệm Vụ Cốt Truyện" aria-label="Đơn Hàng Cú &amp; Nhiệm Vụ">
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_owl_orders.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Đơn Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Hạt Giống &amp; Hoa Hang Sóc" aria-label="Kho Hạt Giống">
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Kho Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Đồng Cỏ Chăn Thả" aria-label="Đồng Cỏ Chăn Thả">
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_pasture_bell.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Chăn Thả</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Xây Dựng Bản Vẽ Công Trình" aria-label="Xây Dựng">
          <img src="/game/trang-trai-hang-soc/sprites/ui_icon_hammer_wand.webp" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Xây Dựng</span>
          <span id="badgeBuildReadyCount" class="ts-red-badge is-ready-green hidden">1</span>
        </button>
      </div>

      <!-- 5. BOTTOM-RIGHT HERO PLAY BUTTON: Mở lại ngay trò chơi cuối cùng vừa được chơi -->
      <div id="tsCornerRight" class="ts-corner-right hg-play-corner">
        <button
          id="btnCornerPlayPuzzle"
          type="button"
          class="ts-card-btn ts-card-lg ts-card-play-stage hg-hero-play-btn"
          aria-label="Chơi tiếp trò chơi vừa chơi"
          title="Chạm để quay lại ngay trò chơi cuối cùng vừa được chơi"
        >
          <span id="badgeCornerPlayBonus" class="hg-play-game-tag">Bùa Gặt</span>
          <span class="hg-play-emblem" aria-hidden="true">
            <img id="imgCornerPlayIcon" src="/game/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp" alt="" class="ts-card-art hg-play-art" />
            <span class="hg-play-triangle">▶</span>
          </span>
          <span id="lblCornerPlayStage" class="ts-card-label hg-play-stage">Màn 1</span>
          <small id="lblCornerPlaySub" class="hg-play-sub">0/1 màn</small>
        </button>
      </div>

      <!-- FLOATING SEED BRUSH TRAY (Swipe-to-Plant across unified Thửa Đất Canh Tác) -->
      <section id="seedBrushTray" class="parchment-panel seed-brush-tray hidden" aria-label="Túi hạt giống gieo nhanh"></section>

      <!-- FLOATING PASTURE ANIMAL BRUSH TRAY (Swipe-to-Stock across unified Đồng Cỏ Chăn Thả) -->
      <section id="pastureBrushTray" class="parchment-panel seed-brush-tray pasture-brush-tray hidden" aria-label="Khay chọn thú chăn thả"></section>

      <!-- BOTTOM OBJECT INSPECTOR SHEET -->
      <aside id="inspectorPanel" class="parchment-panel inspector-panel hidden" aria-label="Chi tiết đối tượng"></aside>

      <!-- VISITOR READ-ONLY & CO-OP DOCK BAR -->
      <section id="visitorDockBar" class="parchment-panel visitor-dock-bar hidden" aria-label="Thanh tham quan và trợ giúp vườn bạn bè"></section>

      <!-- BOTTOM BUILD DOCK SHEET (Pops open cleanly above corner cards when "Xây Dựng" is active) -->
      <section id="bottomDockWrap" class="bottom-dock-wrap ts-build-sheet" aria-label="Thanh công cụ xây dựng">
        <div id="buildDrawerSwipeBar" class="build-drawer-swipe-bar hidden">
          <span id="buildDrawerCatLabel" class="build-drawer-cat-label">🏗️ Danh Mục Xây Dựng</span>
          <div class="build-drawer-scroll-ctrls">
            <span id="buildDrawerSwipeHint" class="build-drawer-swipe-hint" aria-hidden="true">↔ Vuốt ngang</span>
            <button id="btnDrawerScrollPrev" type="button" class="drawer-nav-pill" aria-label="Cuộn sang trái">‹</button>
            <button id="btnDrawerScrollNext" type="button" class="drawer-nav-pill" aria-label="Cuộn sang phải">›</button>
          </div>
        </div>
        <div id="decorCollectionFilterBar" class="decor-collection-filter-bar hidden" role="tablist" aria-label="Bộ sưu tập trang trí"></div>
        <div id="buildDrawer" class="parchment-panel build-drawer hidden"></div>

        <div id="secondaryMapToolsBar" class="parchment-dark secondary-map-tools-bar hidden" role="toolbar" focusgroup="toolbar wrap" aria-label="Công cụ xây dựng chính" aria-controls="gameCanvas">
          <div role="group" aria-label="Thao tác công trình" class="build-toolbar-group">
            <button id="btnMoveTool" type="button" aria-pressed="false" class="brass-btn" title="Di dời công trình (Phím M)">✋ Dời</button>
            <button id="btnBulldoze" type="button" aria-pressed="false" class="brass-btn" title="Xóa công trình hoặc đường (Phím X)">🧹 Xóa</button>
            <button id="btnRotate" type="button" class="brass-btn" title="Xoay công trình 90° (Phím R)">🔄 Xoay</button>
          </div>
          <span role="separator" aria-orientation="vertical" class="build-toolbar-sep"></span>
          <div role="group" aria-label="Hoàn tác và đóng" class="build-toolbar-group">
            <button id="btnBuildUndo" type="button" aria-disabled="true" class="brass-btn" title="Hoàn tác xây dựng (Ctrl/Cmd+Z)">↶ Hoàn tác</button>
            <button id="btnBuildRedo" type="button" aria-disabled="true" class="brass-btn" title="Làm lại xây dựng (Ctrl/Cmd+Y)">↷ Làm lại</button>
            <button id="btnBuildDone" type="button" class="brass-btn gold-cta" title="Đóng chế độ xây dựng (Esc)">✓ Xong</button>
          </div>
        </div>

        <div class="parchment-dark bottom-bar" role="group" aria-label="Nhóm công trình xây dựng">
          <button type="button" data-cat="shop" aria-pressed="false" class="brass-btn"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_shop.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Công Trình</button>
          <button type="button" data-cat="creature" aria-pressed="false" class="brass-btn"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_creature.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Sản Xuất</button>
          <button type="button" data-cat="path" aria-pressed="false" class="brass-btn"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_path.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Đường</button>
          <button type="button" data-cat="decor" aria-pressed="false" class="brass-btn"><img src="/game/trang-trai-hang-soc/sprites/ui_icon_decor.webp" alt="" class="hud-3d-icon" aria-hidden="true" /> Trang Trí</button>
          <button type="button" data-decor-event="christmas" aria-pressed="false" class="brass-btn">Giáng Sinh</button>
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
            <h2 id="questDialogTitle" class="modal-title">Đơn Cú &amp; Nhiệm Vụ</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="questDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 2: 100 LEVELS & 10 ZONES ROADMAP -->
      <dialog id="roadmapDialog" closedby="any" aria-labelledby="roadmapDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="roadmapDialogTitle" class="modal-title">Bản Đồ &amp; Lộ Trình</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="roadmapDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 3: FINANCE & MICRO-PRICING -->
      <dialog id="financeDialog" closedby="any" aria-labelledby="financeDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="financeDialogTitle" class="modal-title">Sổ Cái</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="financeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 4: UNIFIED PROFILE, HOUSE CUP & MINIGAME LEADERBOARDS -->
      <dialog id="albumDialog" closedby="any" aria-labelledby="albumDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="albumDialogTitle" class="modal-title">Hồ Sơ &amp; Xếp Hạng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="albumDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 5: SETTINGS, BGM, SAVE & HEADMASTER PREVIEW -->
      <dialog id="settingsDialog" closedby="any" aria-labelledby="settingsDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="settingsDialogTitle" class="modal-title">Cài Đặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="settingsDialogContent"></div>
        </div>
      </dialog>

      <!-- HPVN: confirm before a demolition destroys a ready crop / animals / workshop job -->
      <dialog id="confirmDialog" closedby="any" aria-labelledby="confirmDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="confirmDialogTitle" class="modal-title">Xóa công trình?</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="confirmDialogText"></div>
          <div>
            <button id="btnConfirmKeep" type="button" class="brass-btn">Giữ lại</button>
            <button id="btnConfirmDelete" type="button" class="brass-btn gold-cta">Vẫn xóa</button>
          </div>
        </div>
      </dialog>

      <!-- DIALOG 6: OFFLINE WELCOME BACK -->
      <dialog id="offlineDialog" closedby="any" aria-labelledby="offlineDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="offlineDialogTitle" class="modal-title">Thu Hoạch Offline</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="offlineDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 7: FARMSTEAD STORAGE BARN, WORKSHOP, CARGO TRAIN & SYNERGIES -->
      <dialog id="workshopDialog" closedby="any" aria-labelledby="workshopDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="workshopDialogTitle" class="modal-title">Kho &amp; Xưởng</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="workshopDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 8: MAGICAL CREATURE SANCTUARY SUITCASE -->
      <dialog id="suitcaseDialog" closedby="any" aria-labelledby="suitcaseDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="suitcaseDialogTitle" class="modal-title">Vali Thú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="suitcaseDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 9: ATTIC HARVEST MATCH-3 -->
      <dialog id="match3Dialog" closedby="any" aria-labelledby="match3DialogTitle">
        <div class="parchment-panel modal-inner m3-modal-inner">
          <div class="modal-header">
            <h2 id="match3DialogTitle" class="modal-title">Bùa Gặt Honeydukes</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title">Ngũ Ấn Đạo Tặc</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">Học Viện Thần Chú</h2>
            <button id="btnSqHeaderSubView" type="button" class="brass-btn sq-header-subview-btn">Từ điển</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">Cổng Floo</h2>
            <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta nb-bxh-chip">BXH</button>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="neighborDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 13: HARVEST FEAST 30-TIER ACTION SEASON PASS -->
      <dialog id="harvestFeastDialog" closedby="any" aria-labelledby="harvestFeastDialogTitle">
        <div class="parchment-panel modal-inner feast-modal-inner">
          <div class="modal-header">
            <h2 id="harvestFeastDialogTitle" class="modal-title">Lễ Hội Mùa Gặt</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="harvestFeastDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 14: HOUSE CUP STARTUP INFO POPUP -->
      <dialog id="houseCupIntroDialog" closedby="any" aria-labelledby="houseCupIntroDialogTitle">
        <div class="parchment-panel modal-inner">
          <div class="modal-header">
            <h2 id="houseCupIntroDialogTitle" class="modal-title">Cúp 4 Nhà Hogwarts</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="houseCupIntroDialogContent"></div>
        </div>
      </dialog>

    `;
    hud.root.appendChild(hudWrap);
    hud.minimapCanvas = hud.root.querySelector('#minimapCanvas') as HTMLCanvasElement;
}

export function shellBindEvents(hud: GameHUD): void {
    const handleOpenLastGame = () => {
      hud.openLastPlayedMinigame();
    };
    hud.root.querySelectorAll<HTMLButtonElement>('[data-switch-minigame]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = btn.dataset.switchMinigame as LeaderboardGameId | undefined;
        hud.closeHudPopovers();
        if (!g || g === 'match3') {
          hud.openMatch3Dialog();
        } else if (g === 'seedquiz') {
          hud.openSeedQuizDialog();
        } else {
          hud.openPuzzleArcadeDialog(g);
        }
      });
    });
    const handleOpenFinance = () => {
      hud.closeHudPopovers();
      hud.renderFinanceDialog();
      (hud.root.querySelector('#financeDialog') as HTMLDialogElement)?.showModal();
    };
    hud.root.querySelector('#btnCornerPlayPuzzle')?.addEventListener('click', handleOpenLastGame);
    hud.root.querySelector('#chipHudSickle')?.addEventListener('click', handleOpenFinance);
    hud.root.querySelector('#xpBarShell')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderRoadmapDialog();
      (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.showModal();
    });
    hud.root.querySelector('#btnOpenMenuSeedQuiz')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.openSeedQuizDialog(undefined, null, undefined, undefined, undefined, 'codex');
    });
    const handleOpenBarn = (e?: Event) => {
      e?.stopPropagation();
      hud.closeHudPopovers();
      hud.openWorkshopDialog('barn');
    };
    hud.root.querySelector('#btnOpenSeedSilo')?.addEventListener('click', (e) => {
      e.stopPropagation();
      hud.closeHudPopovers();
      hud.toggleSeedTray();
    });
    hud.root.querySelector('#btnOpenPastureTray')?.addEventListener('click', (e) => {
      e.stopPropagation();
      hud.closeHudPopovers();
      hud.togglePastureTray();
    });
    hud.root.querySelector('#btnOpenStorageBarn')?.addEventListener('click', handleOpenBarn);
    hud.root.querySelector('#chipHudBarn')?.addEventListener('click', handleOpenBarn);
    hud.root.querySelector('#btnHappySmiley')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderFinanceDialog();
      (hud.root.querySelector('#financeDialog') as HTMLDialogElement).showModal();
    });
    hud.root.querySelector('#btnToggleBuildDock')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      const isDockOpen =
        hud.buildSheetOpen ||
        Boolean(hud.activeCategory) ||
        hud.mapToolsExpanded ||
        Boolean(hud.selectedCatalogItem) ||
        hud.moveModeActive ||
        hud.bulldozerActive;
      if (isDockOpen) {
        hud.collapseBuildDock();
        clearBuildToolModes(hud);
      } else {
        const prevItem = hud.selectedCatalogItem;
        const prevWasChristmas = Boolean(prevItem && isWinterChristmasBuildItem(prevItem));
        const prevSelectedCat = prevItem?.category;
        hud.closeSeedTray();
        hud.closePastureTray();
        clearBuildToolModes(hud);
        hud.inspectSelection = null;
        hud.buildSheetOpen = true;
        hud.mapToolsExpanded = true;
        hud.christmasTabActive = prevWasChristmas;
        hud.activeCategory = prevWasChristmas
          ? 'decor'
          : prevSelectedCat && BUILD_HUD_CATEGORIES.includes(prevSelectedCat)
            ? prevSelectedCat
            : 'shop';
      }
      hud.refreshAll();
    });
    hud.root.querySelector('#btnToggleMinimapHud')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.minimapHudVisible = !hud.minimapHudVisible;
      hud.root.querySelector('#btnToggleMinimapHud')?.setAttribute('aria-pressed', String(hud.minimapHudVisible));
      if (hud.minimapHudVisible) {
        hud.minimapCollapsed = false;
        hud.minimapCanvas.classList.remove('hidden');
      }
      hud.refreshDock();
    });
    hud.root.querySelector('#btnToggleQuestTrackerHud')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      const qPanel = hud.root.querySelector('#questTrackerPanel') as HTMLElement | null;
      qPanel?.classList.toggle('hidden');
      hud.root.querySelector('#btnToggleQuestTrackerHud')?.setAttribute('aria-pressed', String(!!qPanel && !qPanel.classList.contains('hidden')));
    });
    hud.root.querySelector('#btnHudActiveBuilds')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      const actives = hud.sim.getActiveConstructions(Date.now());
      if (actives.length === 0) return;
      hud.activeBuildCycleIdx = (hud.activeBuildCycleIdx + 1) % actives.length;
      const nextB = actives[hud.activeBuildCycleIdx];
      const it = getCatalogItem(nextB.itemId);
      const targetGx = nextB.gx + (it?.width ?? 1) * 0.5;
      const targetGy = nextB.gy + (it?.height ?? 1) * 0.5;
      clearBuildToolModes(hud);
      if (hud.onFocusGridSmooth) {
        hud.onFocusGridSmooth(targetGx, targetGy, Math.max(hud.cam.zoom, 0.95));
      } else {
        centerCameraOnGrid(hud.cam, targetGx, targetGy);
      }
      hud.inspectSelection = { kind: 'building', uid: nextB.uid };
      hud.renderInspector();
    });

    hud.root.querySelector('#btnToggleManageMenu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      hud.toggleManagePopover();
    });

    hud.root.querySelector('#btnToggleHudRollup')?.addEventListener('click', () => {
      hud.toggleHudRollup();
    });

    hud.root.querySelector('#btnManageToggleHudRollup')?.addEventListener('click', () => {
      hud.toggleHudRollup();
    });

    hud.root.querySelector('#btnHudRoundOrb')?.addEventListener('click', () => {
      hud.toggleHudRollup();
    });

    hud.root.querySelector('#lblClock')?.addEventListener('click', (e) => {
      e.stopPropagation();
      hud.toggleWeatherPopover();
    });

    // Progressive roving-tabindex fallback for #secondaryMapToolsBar when native focusgroup is unsupported
    const buildToolbar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    if (
      buildToolbar &&
      typeof HTMLElement !== 'undefined' &&
      !('focusGroup' in HTMLElement.prototype)
    ) {
      const toolbarItems = Array.from(
        buildToolbar.querySelectorAll<HTMLButtonElement>('button')
      );
      toolbarItems.forEach((b, i) => {
        b.tabIndex = i === 0 ? 0 : -1;
      });
      buildToolbar.addEventListener('focusin', ({ target }) => {
        if (target instanceof HTMLButtonElement && toolbarItems.includes(target)) {
          toolbarItems.forEach((b) => {
            b.tabIndex = b === target ? 0 : -1;
          });
        }
      });
      buildToolbar.addEventListener('keydown', (ev) => {
        if (toolbarItems.length === 0) return;
        const curIdx = Math.max(
          0,
          toolbarItems.findIndex((b) => b === document.activeElement)
        );
        const rtl =
          typeof getComputedStyle === 'function' &&
          getComputedStyle(buildToolbar).direction === 'rtl';
        let nextIdx = -1;
        if (ev.key === 'ArrowRight') {
          nextIdx = (curIdx + (rtl ? -1 : 1) + toolbarItems.length) % toolbarItems.length;
        } else if (ev.key === 'ArrowLeft') {
          nextIdx = (curIdx + (rtl ? 1 : -1) + toolbarItems.length) % toolbarItems.length;
        } else if (ev.key === 'Home') {
          nextIdx = 0;
        } else if (ev.key === 'End') {
          nextIdx = toolbarItems.length - 1;
        }
        if (nextIdx >= 0) {
          ev.preventDefault();
          toolbarItems[nextIdx]?.focus();
        }
      });
    }

    const scrollBuildDrawerBy = (dir: -1 | 1) => {
      const drawer = hud.root.querySelector('#buildDrawer') as HTMLElement | null;
      if (!drawer) return;
      const step = Math.max(180, Math.round(drawer.clientWidth * 0.68)) * dir;
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      drawer.scrollBy({ left: step, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    hud.root.querySelector('#btnDrawerScrollPrev')?.addEventListener('click', () => {
      scrollBuildDrawerBy(-1);
    });
    hud.root.querySelector('#btnDrawerScrollNext')?.addEventListener('click', () => {
      scrollBuildDrawerBy(1);
    });

    const attachHorizontalWheel = (container: HTMLElement | null, nestedSelector?: string) => {
      container?.addEventListener(
        'wheel',
        (ev) => {
          const target = nestedSelector
            ? (container.querySelector(nestedSelector) as HTMLElement | null)
            : container;
          if (
            target &&
            target.scrollWidth > target.clientWidth + 4 &&
            Math.abs(ev.deltaY) > Math.abs(ev.deltaX) &&
            ev.deltaY !== 0
          ) {
            target.scrollLeft += ev.deltaY;
            ev.preventDefault();
          }
        },
        { passive: false }
      );
    };
    attachHorizontalWheel(hud.root.querySelector('#buildDrawer') as HTMLElement | null);
    attachHorizontalWheel(hud.root.querySelector('#decorCollectionFilterBar') as HTMLElement | null);
    attachHorizontalWheel(hud.root.querySelector('#seedBrushTray') as HTMLElement | null, '.seed-tray-scroll');
    attachHorizontalWheel(hud.root.querySelector('#pastureBrushTray') as HTMLElement | null, '.seed-tray-scroll');

    window.addEventListener('pointerdown', (e) => {
      if (!hud.manageMenuOpen && !hud.weatherPopoverOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      const managePop = hud.root.querySelector('#managePopoverMenu');
      const weatherPop = hud.root.querySelector('#weatherPopoverMenu');
      const btnManage = hud.root.querySelector('#btnToggleManageMenu');
      const btnClock = hud.root.querySelector('#lblClock');
      if (
        managePop?.contains(target) ||
        weatherPop?.contains(target) ||
        btnManage?.contains(target) ||
        btnClock?.contains(target)
      ) {
        return;
      }
      hud.closeHudPopovers();
    });

    window.addEventListener('resize', () => {
      if (hud.manageMenuOpen) {
        hud.positionFloatingPopover(
          hud.root.querySelector('#btnToggleManageMenu') as HTMLElement | null,
          hud.root.querySelector('#managePopoverMenu') as HTMLElement | null
        );
      } else if (hud.weatherPopoverOpen) {
        hud.positionFloatingPopover(
          hud.root.querySelector('#lblClock') as HTMLElement | null,
          hud.root.querySelector('#weatherPopoverMenu') as HTMLElement | null
        );
      }
    });

    hud.root.querySelector('#btnCloseManageMenu')?.addEventListener('click', () => hud.closeHudPopovers());

    hud.root.querySelector('#btnAccioAll')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.sim.castAccioHarvestAll();
    });

    hud.root.querySelector('#btnOpenWorkshop')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.openWorkshopDialog();
    });

    hud.root.querySelector('#btnOpenSuitcase')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.openSuitcaseDialog();
    });

    hud.root.querySelector('#btnOpenQuests')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderQuestDialog();
      (hud.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
    });

    hud.root.querySelector('#yuleEventBanner')?.addEventListener('click', () => {
      hud.activeQuestTab = 'quests';
      hud.closeHudPopovers();
      hud.renderQuestDialog();
      (hud.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
    });

    const openNeighborsHandler = () => {
      hud.openNeighborDialog();
    };
    hud.root.querySelector('#btnOpenNeighbors')?.addEventListener('click', openNeighborsHandler);
    hud.root
      .querySelector('#btnManageOpenNeighbors')
      ?.addEventListener('click', openNeighborsHandler);

    const openFeastHandler = () => {
      hud.openHarvestFeastDialog();
    };
    hud.root.querySelector('#btnOpenHarvestFeast')?.addEventListener('click', openFeastHandler);
    hud.root.querySelector('#btnManageOpenFeast')?.addEventListener('click', openFeastHandler);

    hud.root.querySelector('#ribbonUnveilToastCard')?.addEventListener('click', () => {
      const card = hud.root.querySelector('#ribbonUnveilToastCard') as HTMLElement | null;
      if (card) card.classList.add('hidden');
      if (hud.ribbonBannerTimer) {
        window.clearTimeout(hud.ribbonBannerTimer);
        hud.ribbonBannerTimer = 0;
      }
    });

    const openZones = () => {
      hud.closeHudPopovers();
      hud.renderRoadmapDialog();
      (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement).showModal();
    };
    hud.root.querySelector('#btnOpenRoadmap')?.addEventListener('click', openZones);
    hud.root.querySelector('#btnOpenZones')?.addEventListener('click', openZones);
    hud.root.querySelector('#btnOpenWorldMap')?.addEventListener('click', openZones);

    hud.root.querySelector('#btnOpenFinance')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderFinanceDialog();
      (hud.root.querySelector('#financeDialog') as HTMLDialogElement).showModal();
    });

    hud.root.querySelector('#btnOpenAlbum')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderAlbumDialog();
      (hud.root.querySelector('#albumDialog') as HTMLDialogElement).showModal();
    });

    hud.root.querySelector('#btnCycleHeatmap')?.addEventListener('click', () => {
      const idx = HEATMAP_CYCLE.findIndex((x) => x.mode === hud.sim.heatmapMode);
      const next = HEATMAP_CYCLE[(idx + 1) % HEATMAP_CYCLE.length];
      hud.sim.heatmapMode = next.mode;
      const btn = hud.root.querySelector('#btnCycleHeatmap') as HTMLButtonElement;
      const isHmActive = next.mode !== 'none';
      btn.textContent = next.label;
      btn.setAttribute('data-active', String(isHmActive));
      btn.setAttribute('aria-pressed', String(isHmActive));
      if (isHmActive) {
        hud.showToast(`Đã bật ${next.label}!`, '🌡️');
      }
    });

    hud.root.querySelector('#btnPhotoMode')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.togglePhotoMode(true);
    });
    hud.root.querySelector('#btnExitPhoto')?.addEventListener('click', () => {
      hud.togglePhotoMode(false);
    });
    hud.root.querySelector('#btnSavePhotoPng')?.addEventListener('click', (ev) => {
      // HPVN: the frame cannot download; the picture prefills a Floo message the member sends themself.
      const btn = ev.currentTarget as HTMLButtonElement;
      if (btn.disabled) return; // HPVN: a double tap sent the photo twice
      btn.disabled = true;
      void shareFarmPhoto(hud.gameCanvas, `Trang trại Hang Sóc của mình, cấp ${hud.sim.state.level}!`)
        .then(() => hud.showToast('Ảnh đã nằm trong khung Floo, bấm gửi khi bạn muốn.', '🔥'))
        .catch(() => hud.showToast('Chưa mở được Mạng Floo, thử lại nhé.', '⚠️'))
        .finally(() => {
          btn.disabled = false;
        });
    });
    hud.root.querySelector('#btnSaveYulePostcard')?.addEventListener('click', (ev) => {
      const btn = ev.currentTarget as HTMLButtonElement;
      if (btn.disabled) return;
      // WebGL2 renderer: the ground is on #gpuWorldCanvas under #gameCanvas
      const game = hud.gameCanvas;
      const gpuEl = document.getElementById('gpuWorldCanvas') as HTMLCanvasElement | null;
      const src = document.createElement('canvas');
      src.width = Math.max(640, game.width);
      src.height = Math.max(360, game.height);
      const sctx = src.getContext('2d');
      if (!sctx) return;
      if (gpuEl && gpuEl.style.display !== 'none' && gpuEl.width > 0 && gpuEl.height > 0) sctx.drawImage(gpuEl, 0, 0, src.width, src.height);
      sctx.drawImage(game, 0, 0, src.width, src.height);
      const cw = Math.max(640, src.width);
      const ch = Math.max(360, src.height);
      const out = document.createElement('canvas');
      out.width = cw;
      out.height = ch;
      const pctx = out.getContext('2d');
      if (!pctx) return;
      pctx.drawImage(src, 0, 0, cw, ch);
      const pad = Math.max(18, Math.round(Math.min(cw, ch) * 0.032));
      // Pine-emerald & gold festive frame
      pctx.save();
      pctx.strokeStyle = '#14532d';
      pctx.lineWidth = pad * 1.15;
      pctx.strokeRect(pad * 0.5, pad * 0.5, cw - pad, ch - pad);
      pctx.strokeStyle = '#f59e0b';
      pctx.lineWidth = Math.max(3, pad * 0.18);
      pctx.strokeRect(pad * 0.92, pad * 0.92, cw - pad * 1.84, ch - pad * 1.84);
      // Warm fairy lights along top garland
      const bulbColors = ['#ef4444', '#fbbf24', '#34d399', '#38bdf8'];
      const step = Math.max(44, Math.round(cw / 18));
      for (let x = pad * 2, idx = 0; x <= cw - pad * 2; x += step, idx++) {
        const col = bulbColors[idx % bulbColors.length];
        pctx.fillStyle = col;
        pctx.beginPath();
        pctx.arc(x, pad * 0.92, Math.max(4, pad * 0.24), 0, Math.PI * 2);
        pctx.fill();
      }
      // Festive bottom parchment ribbon plaque
      const barW = Math.min(cw - pad * 4, Math.max(360, Math.round(cw * 0.62)));
      const barH = Math.max(44, Math.round(ch * 0.078));
      const bx = Math.round((cw - barW) * 0.5);
      const by = ch - pad * 1.4 - barH;
      pctx.fillStyle = 'rgba(20, 42, 32, 0.9)';
      pctx.strokeStyle = '#fbbf24';
      pctx.lineWidth = 2.5;
      pctx.beginPath();
      pctx.roundRect(bx, by, barW, barH, 14);
      pctx.fill();
      pctx.stroke();
      const fontSize = Math.max(15, Math.round(barH * 0.42));
      pctx.font = `700 ${fontSize}px "Be Vietnam Pro", system-ui, sans-serif`;
      pctx.fillStyle = '#fef3c7';
      pctx.textAlign = 'center';
      pctx.textBaseline = 'middle';
      pctx.fillText(
        `🎄 Giáng Sinh An Lành • ${hud.sim.state.parkName} (Cấp ${hud.sim.state.level}) ✨`,
        cw * 0.5,
        by + barH * 0.52
      );
      pctx.restore();

      // HPVN: the frame cannot download; the card prefills a Floo message the member sends themself
      btn.disabled = true;
      void shareFarmPhoto(out, `Thiệp Giáng Sinh từ ${hud.sim.state.parkName}, cấp ${hud.sim.state.level}!`)
        .then(() => {
          hud.sim.recordFlooShareOrPostcard?.('postcard');
          hud.showToast('Thiệp đã nằm trong khung Floo, bấm gửi khi bạn muốn.', '🎄');
        })
        .catch(() => hud.showToast('Chưa mở được Mạng Floo, thử lại nhé.', '⚠️'))
        .finally(() => {
          btn.disabled = false;
        });
    });

    hud.root.querySelector('#btnOpenSettings')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderSettingsDialog();
      (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).showModal();
    });

    hud.root.querySelector('#btnToggleQuestCollapse')?.addEventListener('click', (e) => {
      hud.questCollapsed = !hud.questCollapsed;
      const body = hud.root.querySelector('#questTrackerBody') as HTMLElement;
      body.classList.toggle('hidden', hud.questCollapsed);
      const btn = e.currentTarget as HTMLButtonElement;
      btn.textContent = hud.questCollapsed ? '+' : '–';
      btn.setAttribute('aria-expanded', String(!hud.questCollapsed));
    });

    hud.root.querySelector('#btnToggleMinimap')?.addEventListener('click', (e) => {
      hud.minimapCollapsed = !hud.minimapCollapsed;
      hud.minimapCanvas.classList.toggle('hidden', hud.minimapCollapsed);
      const btn = e.currentTarget as HTMLButtonElement;
      btn.textContent = hud.minimapCollapsed ? '+' : '–';
      btn.setAttribute('aria-expanded', String(!hud.minimapCollapsed));
    });

    // Floating Banner buttons (Ride Cam / Pincer / Move / Bulldoze / Build / Seed)
    hud.root.querySelector('#btnFloatingAutoPlace')?.addEventListener('click', () => {
      hud.onAutoPlaceSelected?.();
    });

    hud.root.querySelector('#btnFloatingSecondary')?.addEventListener('click', () => {
      if (hud.rideCamUid) {
        rotateCamera90(hud.cam, 1);
        hud.refreshDock();
        hud.showToast(`Đã xoay góc nhìn bản đồ sang ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]}!`, '🧭');
      } else if (
        (hud.moveModeActive && hud.movingBuildingUid) ||
        (hud.selectedCatalogItem && !hud.buildSheetOpen && !hud.activeCategory)
      ) {
        hud.triggerRotateAction();
      } else if (hud.activeSeedCropId && !hud.seedTrayOpen) {
        hud.openSeedTray(hud.activeSeedCropId);
      } else if (hud.activePastureAnimalId && !hud.pastureTrayOpen) {
        hud.openPastureTray(hud.activePastureAnimalId);
      }
    });

    hud.root.querySelector('#btnFloatingSwap')?.addEventListener('click', () => {
      if (hud.selectedCatalogItem) {
        const selItem = hud.selectedCatalogItem;
        const selWasChristmas = isWinterChristmasBuildItem(selItem);
        const selCat = selItem.category;
        clearBuildToolModes(hud);
        hud.buildSheetOpen = true;
        hud.mapToolsExpanded = true;
        hud.christmasTabActive = selWasChristmas;
        hud.activeCategory = selWasChristmas
          ? 'decor'
          : BUILD_HUD_CATEGORIES.includes(selCat)
            ? selCat
            : 'shop';
        hud.refreshAll();
      } else if (hud.activeSeedCropId) {
        hud.openSeedTray(hud.activeSeedCropId);
      } else if (hud.activePastureAnimalId) {
        hud.openPastureTray(hud.activePastureAnimalId);
      }
    });

    hud.root.querySelector('#btnFloatingExit')?.addEventListener('click', () => {
      if (hud.rideCamUid) {
        hud.rideCamUid = null;
        hud.refreshFloatingBanner();
      } else if (
        hud.pincerActive ||
        hud.moveModeActive ||
        hud.bulldozerActive ||
        hud.selectedCatalogItem
      ) {
        clearBuildToolModes(hud);
        hud.refreshAll();
      } else if (hud.activeSeedCropId || hud.seedTrayOpen) {
        hud.closeSeedTray();
        hud.refreshAll();
      } else if (hud.activePastureAnimalId || hud.pastureTrayOpen) {
        hud.closePastureTray();
        hud.refreshAll();
      } else if (hud.sim.state.settings.cutawayMode) {
        hud.sim.state.settings.cutawayMode = false;
        hud.sim.saveToStorage();
        hud.refreshAll();
      }
    });

    // Touch Confirm Bar buttons (Build & Move confirmation)
    hud.root.querySelector('#btnTouchConfirmOk')?.addEventListener('click', () => {
      hud.onTouchConfirmPlace?.();
    });
    hud.root.querySelector('#btnTouchRotate')?.addEventListener('click', () => {
      hud.triggerRotateAction();
    });
    hud.root.querySelector('#btnTouchStash')?.addEventListener('click', () => {
      hud.onTouchStashActiveBuilding?.();
    });
    hud.root.querySelector('#btnTouchCancel')?.addEventListener('click', () => {
      if (hud.moveModeActive && hud.moveKeepActiveAfterDrop && hud.movingBuildingUid) {
        hud.movingBuildingUid = null;
        hud.pendingTouchTile = null;
        hud.onTouchCancelPlace?.();
        hud.refreshAll();
        return;
      }
      clearBuildToolModes(hud);
      hud.onTouchCancelPlace?.();
      hud.refreshAll();
    });

    // Interactive Minimap Click & Drag Navigation (rotation-aware!)
    const jumpFromMinimap = (e: PointerEvent) => {
      const rect = hud.minimapCanvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * hud.minimapCanvas.width;
      const my = ((e.clientY - rect.top) / rect.height) * hud.minimapCanvas.height;
      const scaleX = (hud.minimapCanvas.width * 0.46) / GRID_SIZE;
      const scaleY = (hud.minimapCanvas.height * 0.44) / GRID_SIZE;
      const u = (mx - hud.minimapCanvas.width * 0.5) / scaleX;
      const v = (my - 8) / scaleY;
      const rx = (u + v) * 0.5;
      const ry = (v - u) * 0.5;
      const { fgx, fgy } = unrotateGridPoint(rx, ry, hud.cam.viewRot ?? 0);
      const gx = Math.max(0, Math.min(GRID_SIZE - 1, fgx));
      const gy = Math.max(0, Math.min(GRID_SIZE - 1, fgy));
      hud.rideCamUid = null;
      centerCameraOnGrid(hud.cam, gx, gy);
    };
    let draggingMinimap = false;
    hud.minimapCanvas.addEventListener('pointerdown', (e) => {
      draggingMinimap = true;
      jumpFromMinimap(e);
    });
    window.addEventListener('pointermove', (e) => {
      if (draggingMinimap) jumpFromMinimap(e);
    });
    window.addEventListener('pointerup', () => {
      draggingMinimap = false;
    });

    // Category buttons (always reset active item/tool modes when changing category)
    hud.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat as BuildingCategory;
        if (!BUILD_HUD_CATEGORIES.includes(cat)) return;
        const wasSameNonChristmasTab =
          hud.activeCategory === cat && !(cat === 'decor' && hud.christmasTabActive);
        clearBuildToolModes(hud);
        hud.inspectSelection = null;
        hud.christmasTabActive = false;
        if (wasSameNonChristmasTab) {
          hud.activeCategory = null;
        } else {
          hud.activeCategory = cat;
          hud.buildSheetOpen = true;
          hud.mapToolsExpanded = true;
          if (
            cat === 'decor' &&
            ![
              'all',
              'recent',
              'stashed',
              'nature',
              'fences',
              'lights',
              'landmarks',
            ].includes(hud.activeDecorFilter)
          ) {
            hud.activeDecorFilter = 'all';
          }
        }
        hud.refreshDock();
        hud.refreshFloatingBanner();
        hud.refreshTouchConfirmBar();
      });
    });

    hud.root.querySelectorAll<HTMLButtonElement>('[data-decor-event]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const isAlreadyChristmas =
          hud.activeCategory === 'decor' && hud.christmasTabActive;
        clearBuildToolModes(hud);
        hud.inspectSelection = null;
        if (isAlreadyChristmas) {
          hud.activeCategory = null;
          hud.christmasTabActive = false;
        } else {
          hud.activeCategory = 'decor';
          hud.christmasTabActive = true;
          hud.buildSheetOpen = true;
          hud.mapToolsExpanded = true;
        }
        hud.refreshDock();
        hud.refreshFloatingBanner();
        hud.refreshTouchConfirmBar();
      });
    });

    hud.root.querySelector('#btnMoveTool')?.addEventListener('click', () => {
      const nextMove = !hud.moveModeActive;
      clearBuildToolModes(hud);
      if (nextMove) {
        hud.moveModeActive = true;
        hud.moveKeepActiveAfterDrop = true;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        hud.showToast('Chế độ Di Dời liên hoàn: Chạm từng công trình để dời chỗ (0 Sickle)!', '✋');
      }
      hud.refreshAll();
    });

    hud.root.querySelector('#btnRotate')?.addEventListener('click', () => {
      hud.triggerRotateAction();
    });

    hud.root.querySelector('#btnBulldoze')?.addEventListener('click', () => {
      const nextBulldoze = !hud.bulldozerActive;
      clearBuildToolModes(hud);
      if (nextBulldoze) {
        hud.bulldozerActive = true;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        hud.showToast('🧹 Chế độ Xóa: Kéo lướt để xóa đường/rào hoặc chạm công trình cần dọn!', '🧹');
      }
      hud.refreshAll();
    });

    hud.root.querySelector('#btnBuildUndo')?.addEventListener('click', (ev) => {
      const btn = ev.currentTarget as HTMLButtonElement | null;
      if (btn?.getAttribute('aria-disabled') === 'true') return;
      if (hud.sim.isVisitingNeighbor) {
        hud.showToast('Chế độ Khách Tham Quan — không thể hoàn tác thao tác của bạn bè!', '🏡');
        return;
      }
      const did = hud.sim.undoBuild();
      hud.showToast(
        did ? '↶ Đã hoàn tác thao tác xây dựng gần nhất.' : 'Không có thao tác nào để hoàn tác.',
        '↶'
      );
      hud.refreshAll();
    });

    hud.root.querySelector('#btnBuildRedo')?.addEventListener('click', (ev) => {
      const btn = ev.currentTarget as HTMLButtonElement | null;
      if (btn?.getAttribute('aria-disabled') === 'true') return;
      if (hud.sim.isVisitingNeighbor) {
        hud.showToast('Chế độ Khách Tham Quan — không thể làm lại thao tác của bạn bè!', '🏡');
        return;
      }
      const did = hud.sim.redoBuild();
      hud.showToast(
        did ? '↷ Đã làm lại thao tác xây dựng.' : 'Không có thao tác nào để làm lại.',
        '↷'
      );
      hud.refreshAll();
    });

    hud.root.querySelector('#btnBuildDone')?.addEventListener('click', () => {
      hud.collapseBuildDock();
      clearBuildToolModes(hud);
      hud.refreshAll();
    });

    // Secondary camera/view controls inside Menu Khu Vườn
    hud.root.querySelector('#btnMenuRotateCam')?.addEventListener('click', () => {
      rotateCamera90(hud.cam, 1);
      hud.refreshDock();
      hud.showToast(`Góc nhìn bản đồ: ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]} (Phím Q/E)`, '🧭');
    });

    hud.root.querySelector('#btnMenuCutaway')?.addEventListener('click', () => {
      hud.sim.state.settings.cutawayMode = !hud.sim.state.settings.cutawayMode;
      hud.closeHudPopovers();
      hud.refreshAll();
      hud.showToast(
        hud.sim.state.settings.cutawayMode
          ? 'Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường khuất phía sau!'
          : 'Đã tắt chế độ Nhìn Xuyên Nhà Cao',
        '👁️'
      );
    });

    hud.root.querySelector('#btnMenuGrid')?.addEventListener('click', () => {
      hud.sim.state.settings.showGrid = !hud.sim.state.settings.showGrid;
      hud.sim.saveToStorage(); // HPVN: kept in the save
      hud.closeHudPopovers();
      hud.refreshAll();
    });

    window.addEventListener('keydown', (e) => {
      if (hud.root.querySelector('dialog[open]') || document.querySelector('dialog[open]')) {
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
        if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
          e.preventDefault();
          if (e.shiftKey) {
            hud.sim.redoBuild();
          } else {
            hud.sim.undoBuild();
          }
          hud.refreshAll();
        } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
          e.preventDefault();
          hud.sim.redoBuild();
          hud.refreshAll();
        }
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        hud.openNeighborDialog();
      } else if (e.key === 'r' || e.key === 'R') {
        if (hud.sim.isVisitingNeighbor) return;
        hud.triggerRotateAction();
      } else if (e.key === 'q' || e.key === 'Q') {
        rotateCamera90(hud.cam, -1);
        hud.refreshDock();
        hud.showToast(`Góc nhìn: ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]}`, '🧭');
      } else if (e.key === 'e' || e.key === 'E') {
        rotateCamera90(hud.cam, 1);
        hud.refreshDock();
        hud.showToast(`Góc nhìn: ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]}`, '🧭');
      } else if (e.key === 'v' || e.key === 'V') {
        hud.sim.state.settings.cutawayMode = !hud.sim.state.settings.cutawayMode;
        hud.refreshAll();
        hud.showToast(
          hud.sim.state.settings.cutawayMode ? 'Bật Nhìn Xuyên Nhà Cao (V)' : 'Tắt Nhìn Xuyên Nhà Cao',
          '👁️'
        );
      } else if (e.key === 'm' || e.key === 'M') {
        if (hud.sim.isVisitingNeighbor) {
          hud.showToast('Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!', '🏡');
          return;
        }
        const nextMove = !hud.moveModeActive;
        clearBuildToolModes(hud);
        if (nextMove) {
          hud.moveModeActive = true;
          hud.moveKeepActiveAfterDrop = true;
          hud.inspectSelection = null;
          hud.closeSeedTray();
          hud.collapseBuildDock();
          hud.showToast('✋ Chạm chọn từng công trình để di dời liên hoàn (0 Sickle)!', '✋');
        }
        hud.refreshAll();
      } else if (e.key === 'b' || e.key === 'B') {
        if (hud.sim.isVisitingNeighbor || hud.sim.isHeadmasterPreview) {
          hud.showToast('🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Vali Thú nhé!', '🧳');
          return;
        }
        hud.openSuitcaseDialog();
      } else if (e.key === 'j' || e.key === 'J') {
        hud.openMatch3Dialog();
      } else if (e.key === 'k' || e.key === 'K') {
        hud.openPuzzleArcadeDialog();
      } else if (e.key === 'l' || e.key === 'L') {
        hud.openLeaderboardDialog();
      } else if (e.key === 'h' || e.key === 'H') {
        hud.toggleHudRollup();
      } else if (e.key === 'p' || e.key === 'P') {
        hud.togglePhotoMode();
      } else if (e.key === 'x' || e.key === 'X') {
        if (hud.sim.isVisitingNeighbor) {
          hud.showToast('Đang tham quan vườn bạn — không thể phá dỡ tại vườn bạn bè!', '🏡');
          return;
        }
        const nextBulldoze = !hud.bulldozerActive;
        clearBuildToolModes(hud);
        if (nextBulldoze) {
          hud.bulldozerActive = true;
          hud.inspectSelection = null;
          hud.closeSeedTray();
          hud.collapseBuildDock();
        }
        hud.refreshAll();
      } else if (e.key === 'Escape') {
        if (hud.sim.pendingBuildStroke) {
          hud.sim.cancelBuildStroke();
        }
        if (hud.manageMenuOpen || hud.weatherPopoverOpen) {
          hud.closeHudPopovers();
          return;
        }
        if (hud.photoModeActive) {
          hud.togglePhotoMode(false);
          return;
        }
        if (hud.sim.isVisitingNeighbor) {
          hud.exitVisitFromHud();
          return;
        }
        hud.rideCamUid = null;
        clearBuildToolModes(hud);
        hud.closeSeedTray();
        hud.closePastureTray();
        hud.collapseBuildDock();
        hud.inspectSelection = null;
        if (hud.sim.state.settings.cutawayMode) {
          hud.sim.state.settings.cutawayMode = false;
        }
        hud.refreshAll();
      } else if (e.key === ' ') {
        hud.rideCamUid = null;
        centerCameraOnGrid(hud.cam, 16.0, 18.0);
        hud.refreshFloatingBanner();
      }
    });
}
