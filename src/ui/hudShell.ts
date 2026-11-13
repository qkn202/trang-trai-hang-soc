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
  escapeHtml,
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
                id="chipHudGalleons"
                data-fly-target="galleons"
                type="button"
                class="hg-res-item"
                aria-label="Vàng Galleon — Chạm để chơi kiếm thêm Vàng"
                title="Vàng Galleon — Chạm quay lại game vừa chơi"
              >
                <span class="hg-res-glyph hg-glyph-coin" aria-hidden="true">G</span>
                <span id="lblGalleons" class="hg-res-val">1.450</span>
                <span id="btnPlusGalleons" class="sr-only-hud">+</span>
              </button>

              <button
                id="btnHudSandChip"
                data-fly-target="sand"
                type="button"
                class="hg-res-item"
                aria-label="Ngọc Thời Gian — Chạm mở Đại Sảnh Khảo Thí"
                title="Ngọc &amp; Cát Thời Gian"
              >
                <span class="hg-res-glyph hg-glyph-gem" aria-hidden="true">◆</span>
                <span id="lblSand" class="hg-res-val">28</span>
                <span id="btnPlusSand" class="sr-only-hud">+</span>
              </button>

              <button
                id="btnHudMinigameHub"
                data-fly-target="stars"
                type="button"
                class="hg-res-item"
                aria-label="Sao Phép Thuật — Chạm tiếp tục game vừa chơi"
                title="Sao Phép Thuật dùng mở đất &amp; xây công trình"
              >
                <img src="/sprites/m3_icon_star.png" alt="" class="hg-res-star-img" aria-hidden="true" />
                <strong id="lblHudHubStars" class="hg-res-val">3</strong>
                <span id="lblHudHubTrial" class="sr-only-hud"></span>
              </button>

              <button
                id="btnHudActiveBuilds"
                type="button"
                class="hg-res-item hg-res-build hidden"
                aria-label="Công trình đang xây dựng"
                title="Xem công trình đang thi công"
              >
                <span aria-hidden="true">🔨</span>
                <span id="lblActiveBuilds" class="hg-res-val">0</span>
              </button>
            </div>
          </div>

          <!-- 2. TOP-CENTER: Warm Curved Parchment Scroll Ribbon (Wide Desktop Only) -->
          <div id="tsParchmentBanner" class="ts-parchment-ribbon">
            <div class="ts-ribbon-tail ts-ribbon-tail-left" aria-hidden="true"></div>
            <div class="ts-ribbon-body">
              <div id="lblParkRibbonName" class="ts-ribbon-title">Hang Sóc</div>
            </div>
            <div class="ts-ribbon-tail ts-ribbon-tail-right" aria-hidden="true"></div>
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
                <img src="/sprites/ui_icon_staff.png" alt="" class="hg-round-img" aria-hidden="true" />
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
                  <rect x="8" y="10" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
                  <rect x="8" y="16.3" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
                  <rect x="8" y="22.6" width="20" height="3.4" rx="1.7" fill="#f5d69a"/>
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
            <button id="lblClock" type="button" class="stat-chip stat-chip-btn chip-clock chip-clock-btn" aria-expanded="false" aria-controls="weatherPopoverMenu">🕒 --:--</button>
          </div>

          <div class="manage-status-strip hg-menu-status">
            <button id="btnHudStarChip" type="button" class="stat-chip stat-chip-btn" title="Sao Phép Thuật"><img src="/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleStars">3</span></button>
            <button id="btnHudHeartChip" type="button" class="stat-chip stat-chip-btn" title="Tim Bùa Gặt Honeydukes"><img src="/sprites/m3_icon_heart.png" alt="" class="m3-inline-icon" /> <span id="lblPuzzleHearts">5/5</span></button>
            <button id="btnHappySmiley" type="button" class="stat-chip stat-chip-btn" title="Độ Hạnh Phúc &amp; Sổ Cái">😊 <span id="lblWonder">4.5</span></button>
            <span id="lblFestival" class="stat-chip chip-fest hidden">🎃</span>
          </div>

          <!-- Lưới điểm đến chuẩn Vườn Hagrid: Bản đồ, Thăm vườn, Hồ sơ/Cúp Nhà, Lễ hội, Sổ tay, Vali, Kho, Việc quê, Cài đặt -->
          <div class="hg-menu-grid">
            <button id="btnOpenWorldMap" type="button" class="hg-menu-node" title="Đại Bản Đồ 10 Vùng Đất &amp; Lộ Trình 100 Cấp">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/sprites/ui_icon_world_map.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Bản Đồ</span>
            </button>
            <button id="btnManageOpenNeighbors" type="button" class="hg-menu-node" title="Cổng Floo &amp; Thăm Vườn Bạn Bè (Phím N)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/sprites/ui_icon_staff.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Thăm Vườn</span>
              <span id="badgeManageNeighborCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenAlbum" type="button" class="hg-menu-node" title="Hồ Sơ &amp; Cúp 4 Nhà Hogwarts">
              <span class="hg-menu-medal" aria-hidden="true">🏆</span>
              <span class="hg-menu-label">Hồ Sơ &amp; Cúp</span>
              <span id="badgeCardCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenHarvestFeast" type="button" class="hg-menu-node" title="Đại Tiệc Mùa Gặt Hang Sóc (30 Bậc)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/sprites/prop_ribbon_unveil.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Lễ Hội</span>
              <span id="badgeFeastCount" class="badge-dot hidden">1</span>
              <span id="badgeManageFeastCount" class="sr-only-hud hidden">0</span>
            </button>
            <button id="btnOpenMenuSeedQuiz" type="button" class="hg-menu-node" title="Sổ Tay Cổ Ngữ &amp; Học Viện Thần Chú Đa Ngữ">
              <span class="hg-menu-medal" aria-hidden="true">📖</span>
              <span class="hg-menu-label">Sổ Tay</span>
            </button>
            <button id="btnOpenSuitcase" type="button" class="hg-menu-node" title="Vali Bảo Tồn Sinh Vật Huyền Bí (Phím B)">
              <span class="hg-menu-medal" aria-hidden="true"><img src="/sprites/ui_icon_suitcase.png" alt="" class="hg-menu-node-img" /></span>
              <span class="hg-menu-label">Vali Thú</span>
              <span id="badgeSuitcaseCount" class="badge-dot hidden">0</span>
            </button>
            <button id="btnOpenWorkshop" type="button" class="hg-menu-node" title="Kho Nông Sản, Xưởng Chế Biến &amp; Tàu Hàng">
              <span class="hg-menu-medal" aria-hidden="true">🏡</span>
              <span class="hg-menu-label">Kho Xưởng</span>
              <span id="badgeWorkshopCount" class="badge-dot hidden">!</span>
            </button>
            <button id="btnOpenFinance" type="button" class="hg-menu-node" title="Sổ Cái Tài Chính &amp; Việc Quê">
              <span class="hg-menu-medal" aria-hidden="true">📊</span>
              <span class="hg-menu-label">Sổ Cái</span>
            </button>
            <button id="btnOpenSettings" type="button" class="hg-menu-node" title="Cài Đặt Âm Nhạc, Thời Tiết &amp; Lưu Game">
              <span class="hg-menu-medal" aria-hidden="true">⚙️</span>
              <span class="hg-menu-label">Cài Đặt</span>
            </button>
          </div>

          <!-- Chọn trực tiếp môn Mini-game (tự động nhớ làm game mặc định cho nút Chơi góc phải) -->
          <div class="hg-menu-games-box">
            <div class="hg-menu-games-head">
              <span>🎮 Chọn Môn Chơi</span>
              <button id="btnOpenLeaderboard" type="button" class="hg-bxh-chip" title="Bảng Xếp Hạng 3 Môn Tính Điểm (Phím L)">🥇 BXH</button>
            </div>
            <div class="hg-menu-games-pills" role="group" aria-label="Đổi trò chơi">
              <button id="btnOpenMatch3" type="button" data-switch-minigame="match3" class="hg-game-pill" title="Bùa Gặt Honeydukes — 777 Màn (Phím J)">
                🍬 Bùa Gặt Honeydukes <small id="lblMatch3Lv" class="sr-only-hud">1/777</small>
              </button>
              <button id="btnOpenPuzzleArcade" type="button" data-switch-minigame="caro" class="hg-game-pill" title="Ngũ Ấn Đạo Tặc (Phím K)">
                🗺️ Ngũ Ấn Đạo Tặc <small id="lblArcadeTowerLv" class="sr-only-hud">0/3108</small>
              </button>
              <button type="button" data-switch-minigame="sudoku" class="hg-game-pill" title="Số Học Huyền Bí">
                🔢 Số Học Huyền Bí
              </button>
              <button type="button" data-switch-minigame="blocks" class="hg-game-pill" title="Sinh Vật Huyền Bí">
                🦄 Sinh Vật Huyền Bí
              </button>
              <button type="button" data-switch-minigame="chess" class="hg-game-pill" title="Cờ Phù Thủy">
                🏰 Cờ Phù Thủy
              </button>
              <button type="button" data-switch-minigame="seedquiz" class="hg-game-pill" title="Học Viện Thần Chú">
                🪄 Học Viện Thần Chú
              </button>
            </div>
          </div>

          <div class="hg-menu-tools-row">
            <button id="btnAccioAll" type="button" class="brass-btn gold-cta" title="Phép Accio gom toàn bộ nông sản, bánh &amp; vàng">⚡ Accio</button>
            <button id="btnToggleQuestTrackerHud" type="button" class="brass-btn" title="Ghim bảng nhiệm vụ">📌 Ghim NV</button>
            <button id="btnToggleMinimapHud" type="button" class="brass-btn" title="Hiện/ẩn Radar thu nhỏ">🧭 Radar</button>
            <button id="btnCycleHeatmap" type="button" class="brass-btn" aria-pressed="false" title="Bật lớp màu Bản Đồ Nhiệt">🌡️ Nhiệt</button>
            <button id="btnPhotoMode" type="button" class="brass-btn" aria-label="Chế độ chụp ảnh (Phím P)" title="Ẩn giao diện để chụp ảnh (Phím P)">📷 Ảnh</button>
            <button id="btnManageToggleHudRollup" type="button" class="brass-btn" title="Cuộn gọn thanh HUD quanh màn hình (Phím H)">📜 Ẩn HUD</button>
            <button id="btnOpenLegalFromMenu" type="button" class="brass-btn" title="Pháp lý, Quyền riêng tư &amp; Bản quyền">⚖️ Pháp Lý</button>
            <button id="btnOpenZones" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Bản Đồ</button>
            <button id="btnToggleHudRollup" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true"><svg><path id="svgHudRollupChevron" d="M13.5 23 L18 18.5 L22.5 23"/></svg></button>
            <button id="btnManageOpenFeast" type="button" class="sr-only-hud" tabindex="-1" aria-hidden="true">Lễ Hội</button>
          </div>
        </nav>

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
              <button id="btnToggleQuestCollapse" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng nhiệm vụ" aria-expanded="${!hud.questCollapsed}" style="padding:3px 9px;font-size:12px;">${hud.questCollapsed ? '+' : '–'}</button>
            </div>
            <div id="questTrackerBody" class="${hud.questCollapsed ? 'hidden' : ''}"></div>
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
          <button id="btnToggleMinimap" type="button" class="brass-btn" aria-label="Thu gọn hoặc mở rộng bản đồ thu nhỏ" aria-expanded="${!hud.minimapCollapsed}" style="padding:2px 7px;font-size:12px;">${hud.minimapCollapsed ? '+' : '–'}</button>
        </div>
        <canvas id="minimapCanvas" class="${hud.minimapCollapsed ? 'hidden' : ''}" width="168" height="102" aria-label="Bản đồ thu nhỏ công viên"></canvas>
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

      <!-- 4. BOTTOM-LEFT UNIFIED 4-CARD FARM & BUILD DOCK: Đơn Hàng Cú, Kho Hạt, Chăn Thả, Xây Dựng -->
      <div id="tsCornerLeft" class="ts-corner-left hg-farm-dock" role="toolbar" aria-label="Nông trại và xây dựng">
        <button id="btnOpenQuests" type="button" class="ts-card-btn hg-dock-card" title="Đơn Hàng Cú &amp; Nhiệm Vụ Cốt Truyện">
          <img src="/sprites/ui_icon_owl_orders.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Đơn Hàng Cú</span>
          <span id="badgeQuestCount" class="ts-red-badge">3</span>
        </button>
        <button id="btnOpenSeedSilo" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Hạt Giống &amp; Hoa Hang Sóc">
          <img src="/sprites/ui_icon_seed_sack.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Kho Hạt</span>
        </button>
        <button id="btnOpenPastureTray" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Đồng Cỏ Chăn Thả">
          <img src="/sprites/ui_icon_pasture_bell.png" alt="" class="ts-card-art" aria-hidden="true" />
          <span class="ts-card-label">Chăn Thả</span>
        </button>
        <button id="btnToggleBuildDock" type="button" aria-pressed="false" class="ts-card-btn hg-dock-card" title="Kho Xây Dựng Bản Vẽ Công Trình">
          <img src="/sprites/ui_icon_hammer_wand.png" alt="" class="ts-card-art" aria-hidden="true" />
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
          <span id="badgeCornerPlayBonus" class="hg-play-game-tag">🍬 Bùa Gặt</span>
          <span class="hg-play-emblem" aria-hidden="true">
            <img id="imgCornerPlayIcon" src="/sprites/m3_farm_pinwheel.png" alt="" class="ts-card-art hg-play-art" />
            <span class="hg-play-triangle">▶</span>
          </span>
          <span id="lblCornerPlayStage" class="ts-card-label hg-play-stage">Màn 1</span>
          <small id="lblCornerPlaySub" class="hg-play-sub">Cấp 1 → 2</small>
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
        <div id="buildDrawerSwipeBar" class="build-drawer-swipe-bar hidden">
          <span id="buildDrawerCatLabel" class="build-drawer-cat-label">🏗️ Danh Mục Xây Dựng</span>
          <div class="build-drawer-scroll-ctrls">
            <span id="buildDrawerSwipeHint" class="build-drawer-swipe-hint" aria-hidden="true">↔ Vuốt ngang</span>
            <button id="btnDrawerScrollPrev" type="button" class="drawer-nav-pill" aria-label="Cuộn sang trái">‹</button>
            <button id="btnDrawerScrollNext" type="button" class="drawer-nav-pill" aria-label="Cuộn sang phải">›</button>
          </div>
        </div>
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

          <button id="btnToggleMapTools" type="button" aria-pressed="false" aria-expanded="false" aria-controls="secondaryMapToolsBar" class="brass-btn" title="Công cụ Sửa &amp; Góc Nhìn"><span class="dock-tool-icon" aria-hidden="true">🛠️</span> Công Cụ</button>
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
            <h2 id="match3DialogTitle" class="modal-title"><img src="/sprites/m3_farm_pinwheel.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Bùa Gặt Honeydukes</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="match3DialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 10: PUZZLE ARCADE PARLOR (CARO + SUDOKU + WIZARD CHESS + JIGSAW + BLOCKS) -->
      <dialog id="puzzleArcadeDialog" closedby="any" aria-labelledby="puzzleArcadeDialogTitle">
        <div class="parchment-panel modal-inner pa-modal-inner">
          <div class="modal-header">
            <h2 id="puzzleArcadeDialogTitle" class="modal-title"><img src="/sprites/m3_piece_scroll.png" alt="" style="width:26px;height:26px;vertical-align:-6px;margin-right:6px;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.45));" />Ngũ Ấn Đạo Tặc</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="puzzleArcadeDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 11: 2-OPTION SEED SHOP & 5-LANGUAGE ADAPTIVE QUIZ ACADEMY -->
      <dialog id="seedQuizDialog" closedby="any" aria-labelledby="seedQuizDialogTitle">
        <div class="parchment-panel modal-inner sq-modal-inner">
          <div class="modal-header">
            <h2 id="seedQuizDialogTitle" class="modal-title">🪄 Học Viện Thần Chú</h2>
            <form method="dialog"><button type="submit" class="brass-btn" aria-label="Đóng" autofocus>✕</button></form>
          </div>
          <div id="seedQuizDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 12: NEIGHBOR SOCIAL BOOK, GARDEN VISIT & DAILY MINIGAME RESCUE -->
      <dialog id="neighborDialog" closedby="any" aria-labelledby="neighborDialogTitle">
        <div class="parchment-panel modal-inner neighbor-modal-inner">
          <div class="modal-header">
            <h2 id="neighborDialogTitle" class="modal-title">🔥 Cổng Floo &amp; Hàng Xóm</h2>
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

      <!-- DIALOG 14: PER-MINIGAME LEADERBOARDS & HOGWARTS 4-HOUSE CUP (HANG SÓC PARCHMENT & BRASS EDITION) -->
      <dialog id="leaderboardDialog" class="cc-lb-dialog" closedby="any" aria-labelledby="leaderboardDialogTitle">
        <div class="parchment-panel modal-inner lb-modal-inner cc-lb-card">
          <div class="modal-header cc-lb-header">
            <div class="cc-lb-title-stack">
              <span class="cc-lb-ribbon-sub">ĐẠI SẢNH ĐƯỜNG HANG SÓC • 3 MÔN TRANH CÚP</span>
              <h2 id="leaderboardDialogTitle" class="modal-title">🏆 Bảng Xếp Hạng &amp; Cúp 4 Nhà</h2>
            </div>
            <form method="dialog" class="cc-lb-close-form">
              <button type="submit" class="brass-btn" aria-label="Đóng bảng xếp hạng" autofocus>✕</button>
            </form>
          </div>
          <div id="leaderboardLiveAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
          <div id="leaderboardDialogToast" class="cc-lb-toast" hidden></div>
          <div id="leaderboardDialogContent"></div>
        </div>
      </dialog>

      <!-- DIALOG 15: DESTRUCTIVE BULLDOZE CONFIRMATION (CROPS / PASTURES / ACTIVE WORKSHOPS) -->
      <dialog id="bulldozeConfirmDialog" aria-labelledby="bulldozeConfirmTitle" class="bulldoze-confirm-dialog">
        <div class="parchment-panel modal-inner bulldoze-confirm-inner">
          <div class="modal-header">
            <h2 id="bulldozeConfirmTitle" class="modal-title">⚠️ Xác Nhận Phá Dỡ</h2>
            <form method="dialog"><button type="submit" value="cancel" class="brass-btn" aria-label="Đóng">✕</button></form>
          </div>
          <div id="bulldozeConfirmBody" class="bulldoze-confirm-body"></div>
          <form method="dialog" class="bulldoze-confirm-actions">
            <button type="submit" value="cancel" class="brass-btn" autofocus>Giữ lại</button>
            <button type="submit" value="confirm" class="brass-btn bulldoze-confirm-danger-btn">🧹 Vẫn phá dỡ</button>
          </form>
        </div>
      </dialog>
    `;
    hud.root.appendChild(hudWrap);
    hud.minimapCanvas = hud.root.querySelector('#minimapCanvas') as HTMLCanvasElement;
}

export function shellBindEvents(hud: GameHUD): void {
    const handleOpenMatch3 = () => {
      hud.closeHudPopovers();
      hud.openMatch3Dialog();
    };
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
    hud.root.querySelector('#btnHudStarChip')?.addEventListener('click', handleOpenLastGame);
    hud.root.querySelector('#btnHudMinigameHub')?.addEventListener('click', handleOpenLastGame);
    hud.root.querySelector('#btnCornerPlayPuzzle')?.addEventListener('click', handleOpenLastGame);
    hud.root.querySelector('#chipHudGalleons')?.addEventListener('click', handleOpenLastGame);
    hud.root.querySelector('#xpBarShell')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderRoadmapDialog();
      (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.showModal();
    });
    hud.root.querySelector('#btnHudHeartChip')?.addEventListener('click', handleOpenMatch3);
    hud.root.querySelector('#btnPlusGalleons')?.addEventListener('click', handleOpenLastGame);
    const handleOpenPuzzleArcade = () => {
      hud.closeHudPopovers();
      const last = hud.sim.getLastPlayedMinigame();
      if (last === 'caro' || last === 'sudoku' || last === 'chess' || last === 'blocks') {
        hud.openPuzzleArcadeDialog(last);
      } else {
        hud.openPuzzleArcadeDialog('caro');
      }
    };
    hud.root.querySelector('#btnHudSandChip')?.addEventListener('click', handleOpenPuzzleArcade);
    hud.root.querySelector('#btnPlusSand')?.addEventListener('click', handleOpenPuzzleArcade);
    hud.root.querySelector('#btnOpenLeaderboard')?.addEventListener('click', () => {
      hud.openLeaderboardDialog();
    });
    hud.root.querySelector('#btnOpenMenuSeedQuiz')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.openSeedQuizDialog(undefined, null, undefined, undefined, undefined, 'codex');
    });
    hud.root.querySelector('#btnOpenLegalFromMenu')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      (document.querySelector('.legal-trigger-btn') as HTMLButtonElement | null)?.click();
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
        hud.buildSheetOpen || Boolean(hud.activeCategory) || hud.mapToolsExpanded;
      if (isDockOpen) {
        hud.collapseBuildDock();
        hud.selectedCatalogItem = null;
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.pendingTouchTile = null;
      } else {
        hud.closeSeedTray();
        hud.closePastureTray();
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.pendingTouchTile = null;
        hud.inspectSelection = null;
        hud.buildSheetOpen = true;
        hud.mapToolsExpanded = window.innerWidth > 680;
        const selCat = hud.selectedCatalogItem?.category;
        hud.activeCategory =
          selCat && BUILD_HUD_CATEGORIES.includes(selCat) ? selCat : 'shop';
      }
      hud.refreshAll();
    });
    hud.root.querySelector('#btnToggleMinimapHud')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.minimapHudVisible = !hud.minimapHudVisible;
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
    });
    hud.root.querySelector('#btnHudActiveBuilds')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      const actives = hud.sim.getActiveConstructions(Date.now());
      if (actives.length === 0) return;
      const nextB = actives[0];
      const it = getCatalogItem(nextB.itemId);
      centerCameraOnGrid(
        hud.cam,
        nextB.gx + (it?.width ?? 1) * 0.5,
        nextB.gy + (it?.height ?? 1) * 0.5
      );
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

    const roundOrbBtn = hud.root.querySelector('#btnHudRoundOrb') as HTMLButtonElement | null;
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
        hud.toggleHudRollup();
      });
    }

    hud.root.querySelector('#lblClock')?.addEventListener('click', (e) => {
      e.stopPropagation();
      hud.toggleWeatherPopover();
    });

    hud.root.querySelector('#btnToggleMapTools')?.addEventListener('click', () => {
      hud.mapToolsExpanded = !hud.mapToolsExpanded;
      hud.refreshDock();
    });

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
    hud.root.querySelector('#btnSavePhotoPng')?.addEventListener('click', () => {
      const url = hud.gameCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `cong-vien-phep-thuat-lv${hud.sim.state.level}.png`;
      a.click();
      hud.showToast('Đã lưu ảnh kỷ niệm công viên (.png)!', '📸');
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
    hud.root.querySelector('#btnFloatingSecondary')?.addEventListener('click', () => {
      if (hud.rideCamUid) {
        rotateCamera90(hud.cam, 1);
        hud.refreshDock();
        hud.showToast(`Đã xoay góc nhìn bản đồ sang ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]}!`, '🧭');
      } else if (
        (hud.moveModeActive && hud.movingBuildingUid) ||
        (hud.selectedCatalogItem && !hud.buildSheetOpen && !hud.activeCategory)
      ) {
        hud.rotation = ((hud.rotation + 1) % 4) as 0 | 1 | 2 | 3;
        hud.refreshFloatingBanner();
        hud.refreshTouchConfirmBar();
        hud.showToast(`Đã xoay hướng cửa công trình (${hud.rotation * 90}°)`, '🔄');
      } else if (hud.activeSeedCropId && !hud.seedTrayOpen) {
        hud.openSeedTray(hud.activeSeedCropId);
      } else if (hud.activePastureAnimalId && !hud.pastureTrayOpen) {
        hud.openPastureTray(hud.activePastureAnimalId);
      }
    });

    hud.root.querySelector('#btnFloatingSwap')?.addEventListener('click', () => {
      if (hud.selectedCatalogItem) {
        hud.buildSheetOpen = true;
        const selCat = hud.selectedCatalogItem.category;
        hud.activeCategory = BUILD_HUD_CATEGORIES.includes(selCat) ? selCat : 'shop';
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
      } else if (hud.pincerActive) {
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.refreshAll();
      } else if (hud.moveModeActive) {
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pendingTouchTile = null;
        hud.refreshAll();
      } else if (hud.bulldozerActive) {
        hud.bulldozerActive = false;
        hud.pendingTouchTile = null;
        hud.refreshAll();
      } else if (hud.selectedCatalogItem) {
        hud.selectedCatalogItem = null;
        hud.pendingTouchTile = null;
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

    // Touch Confirm Bar buttons
    hud.root.querySelector('#btnTouchConfirmOk')?.addEventListener('click', () => {
      hud.onTouchConfirmPlace?.();
    });
    hud.root.querySelector('#btnTouchRotate')?.addEventListener('click', () => {
      hud.rotation = ((hud.rotation + 1) % 4) as 0 | 1 | 2 | 3;
      hud.showToast(`Đã xoay hướng cửa công trình (${hud.rotation * 90}°)`, '🔄');
      hud.refreshTouchConfirmBar();
    });
    hud.root.querySelector('#btnTouchCancel')?.addEventListener('click', () => {
      hud.pendingTouchTile = null;
      hud.onTouchCancelPlace?.();
      hud.refreshTouchConfirmBar();
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

    // Category buttons
    hud.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.cat as BuildingCategory;
        if (!BUILD_HUD_CATEGORIES.includes(cat)) return;
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.pendingTouchTile = null;
        if (hud.activeCategory === cat) {
          hud.activeCategory = null;
          hud.selectedCatalogItem = null;
        } else {
          hud.activeCategory = cat;
        }
        hud.refreshDock();
        hud.refreshFloatingBanner();
        hud.refreshTouchConfirmBar();
      });
    });

    hud.root.querySelector('#btnPincerTool')?.addEventListener('click', () => {
      hud.pincerActive = !hud.pincerActive;
      hud.pincerPicked = null;
      if (hud.pincerActive) {
        hud.selectedCatalogItem = null;
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pendingTouchTile = null;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        const st0 = hud.sim.staff[0];
        if (st0) {
          hud.pincerPicked = { kind: 'staff', id: st0.id, label: st0.name };
        }
        hud.showToast('Điều phối nhanh: Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới dọn dẹp / sửa chữa!', '🤏');
      }
      hud.refreshAll();
    });

    hud.root.querySelector('#btnMoveTool')?.addEventListener('click', () => {
      hud.moveModeActive = !hud.moveModeActive;
      hud.movingBuildingUid = null;
      hud.pendingTouchTile = null;
      if (hud.moveModeActive) {
        hud.selectedCatalogItem = null;
        hud.bulldozerActive = false;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        hud.showToast('Chế độ Di Dời: Nhấp vào công trình cần dời chỗ (Miễn phí 0G)!', '✋');
      }
      hud.refreshAll();
    });

    hud.root.querySelector('#btnRotate')?.addEventListener('click', () => {
      hud.rotation = ((hud.rotation + 1) % 4) as 0 | 1 | 2 | 3;
      hud.refreshFloatingBanner();
      hud.refreshTouchConfirmBar();
      hud.showToast(`Đã xoay hướng Cổng Vào/Ra (${hud.rotation * 90}°)`, '🔄');
    });

    hud.root.querySelector('#btnBulldoze')?.addEventListener('click', () => {
      hud.bulldozerActive = !hud.bulldozerActive;
      hud.pendingTouchTile = null;
      if (hud.bulldozerActive) {
        hud.selectedCatalogItem = null;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
      }
      hud.refreshAll();
    });

    hud.root.querySelector('#btnRotateCam')?.addEventListener('click', () => {
      rotateCamera90(hud.cam, 1);
      hud.refreshDock();
      hud.showToast(`Góc nhìn bản đồ: ${COMPASS_LABELS_VI[hud.cam.viewRot ?? 0]} (Phím Q/E)`, '🧭');
    });

    hud.root.querySelector('#btnCutaway')?.addEventListener('click', () => {
      hud.sim.state.settings.cutawayMode = !hud.sim.state.settings.cutawayMode;
      hud.collapseBuildDock();
      hud.refreshAll();
      hud.showToast(
        hud.sim.state.settings.cutawayMode
          ? 'Đã bật Nhìn Xuyên Nhà Cao — dễ dàng lát đường & đặt ray khuất phía sau!'
          : 'Đã tắt chế độ Nhìn Xuyên Nhà Cao',
        '👁️'
      );
    });

    hud.root.querySelector('#btnGrid')?.addEventListener('click', () => {
      hud.sim.state.settings.showGrid = !hud.sim.state.settings.showGrid;
      hud.collapseBuildDock();
      hud.refreshAll();
    });

    hud.root.querySelector('#btnHomeCam')?.addEventListener('click', () => {
      hud.rideCamUid = null;
      hud.collapseBuildDock();
      const burrowB = hud.sim.state.buildings.find((b) => b.itemId === 'burrow_house_canon');
      if (burrowB) {
        centerCameraOnGrid(hud.cam, burrowB.gx + 1.5, burrowB.gy + 1.5);
      } else {
        centerCameraOnGrid(hud.cam, 13.8, 18.2);
      }
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
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        hud.openNeighborDialog();
      } else if (e.key === 'r' || e.key === 'R') {
        if (hud.sim.isVisitingNeighbor) return;
        hud.rotation = ((hud.rotation + 1) % 4) as 0 | 1 | 2 | 3;
        hud.refreshFloatingBanner();
        hud.refreshTouchConfirmBar();
        hud.showToast(`Đã xoay hướng cửa công trình (${hud.rotation * 90}°)`, '🔄');
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
      } else if (e.key === 'g' || e.key === 'G') {
        if (hud.sim.isVisitingNeighbor) {
          hud.showToast('Đang tham quan vườn bạn — chỉ có thể ngắm cảnh & trợ giúp vườn!', '🏡');
          return;
        }
        hud.pincerActive = !hud.pincerActive;
        hud.pincerPicked = null;
        if (hud.pincerActive) {
          hud.selectedCatalogItem = null;
          hud.bulldozerActive = false;
          hud.moveModeActive = false;
          hud.movingBuildingUid = null;
          hud.inspectSelection = null;
          hud.closeSeedTray();
          hud.collapseBuildDock();
          const st0 = hud.sim.staff[0];
          if (st0) {
            hud.pincerPicked = { kind: 'staff', id: st0.id, label: st0.name };
          }
          hud.showToast('Điều phối nhanh (G): Nhấp ô bất kỳ trên bản đồ để cử nhân sự tới hỗ trợ!', '🤏');
        }
        hud.refreshAll();
      } else if (e.key === 'm' || e.key === 'M') {
        if (hud.sim.isVisitingNeighbor) {
          hud.showToast('Đang tham quan vườn bạn — không thể di dời công trình của bạn bè!', '🏡');
          return;
        }
        hud.moveModeActive = !hud.moveModeActive;
        hud.movingBuildingUid = null;
        if (hud.moveModeActive) {
          hud.selectedCatalogItem = null;
          hud.bulldozerActive = false;
          hud.pincerActive = false;
          hud.pincerPicked = null;
          hud.inspectSelection = null;
          hud.closeSeedTray();
          hud.collapseBuildDock();
          hud.showToast('Nhấp chọn công trình để di dời miễn phí!', '✋');
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
        hud.bulldozerActive = !hud.bulldozerActive;
        if (hud.bulldozerActive) {
          hud.selectedCatalogItem = null;
          hud.moveModeActive = false;
          hud.movingBuildingUid = null;
          hud.pincerActive = false;
          hud.pincerPicked = null;
          hud.inspectSelection = null;
          hud.closeSeedTray();
          hud.collapseBuildDock();
        }
        hud.refreshAll();
      } else if (e.key === 'Escape') {
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
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.closeSeedTray();
        hud.closePastureTray();
        hud.collapseBuildDock();
        hud.pendingTouchTile = null;
        hud.selectedCatalogItem = null;
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
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
