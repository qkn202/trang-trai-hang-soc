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
    hud.root.appendChild(hudWrap);
    hud.minimapCanvas = hud.root.querySelector('#minimapCanvas') as HTMLCanvasElement;
}

export function shellBindEvents(hud: GameHUD): void {
    const handleOpenMatch3 = () => {
      hud.closeHudPopovers();
      hud.openMatch3Dialog();
    };
    const handleOpenTrialOrHub = () => {
      hud.openTrialMinigame();
    };
    hud.root.querySelector('#btnOpenMatch3')?.addEventListener('click', handleOpenMatch3);
    hud.root.querySelector('#btnHudStarChip')?.addEventListener('click', handleOpenTrialOrHub);
    hud.root.querySelector('#btnHudMinigameHub')?.addEventListener('click', handleOpenTrialOrHub);
    hud.root.querySelector('#btnCornerPlayPuzzle')?.addEventListener('click', handleOpenTrialOrHub);
    hud.root.querySelector('#xpBarShell')?.addEventListener('click', () => {
      hud.closeHudPopovers();
      hud.renderRoadmapDialog();
      (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.showModal();
    });
    hud.root.querySelector('#btnHudHeartChip')?.addEventListener('click', handleOpenMatch3);
    hud.root.querySelector('#btnPlusGalleons')?.addEventListener('click', handleOpenTrialOrHub);
    const handleOpenPuzzleArcade = () => {
      hud.closeHudPopovers();
      hud.openPuzzleArcadeDialog();
    };
    hud.root.querySelector('#btnOpenPuzzleArcade')?.addEventListener('click', handleOpenPuzzleArcade);
    hud.root.querySelector('#btnOpenLeaderboard')?.addEventListener('click', () => {
      hud.openLeaderboardDialog();
    });
    hud.root.querySelector('#btnPlusSand')?.addEventListener('click', handleOpenPuzzleArcade);
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
