// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

import {
  CATALOG,
  computeRealTimeBuildSeconds,
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
  IS_SANDBOX_BUILD_ENABLED,
  isDragPaintableCatalogItem,
  isSandboxRuntimeAllowed,
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
} from '../sim/simulation';
import { worldGetStashedDecorCount } from '../sim/simulationWorld';
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
  YuleCollectionId,
  ZoneId,
} from '../types/game';
import { LeaderboardModalController } from './leaderboardModal';
import { compactSickle } from '../hpvn/toolIcons';
import {
  lookupRealPlayerByFriendCode,
  registerRealPlayerProfileOnline,
} from './cloudSave';
import type { Match3ModalController } from './match3Modal';
import type { PuzzleArcadeModalController } from './puzzleArcadeModal';
import { SeedQuizModalController } from './seedQuizModal';
import {
  BUILD_HUD_CATEGORIES,
  ClassicDecorSubFilter,
  classifyClassicDecorSubFilter,
  HEATMAP_CYCLE,
  InspectSelection,
  clearBuildToolModes,
  escapeHtml,
  getCatalogCardImageSrc,
  isWinterChristmasBuildItem,
} from "./hudShared";
import type { GameHUD } from './hud';

export function headerTogglePhotoMode(hud: GameHUD, force?: boolean): void {
    hud.photoModeActive = typeof force === 'boolean' ? force : !hud.photoModeActive;
    if (typeof document !== 'undefined') {
      document.body.dataset.photoMode = hud.photoModeActive ? 'true' : 'false';
    }
    const isVisiting = hud.sim.isVisitingNeighbor;
    (hud.root.querySelector('#hudFrameTop') as HTMLElement).classList.toggle('hidden', hud.photoModeActive);
    (hud.root.querySelector('#bottomDockWrap') as HTMLElement).classList.toggle(
      'hidden',
      hud.photoModeActive || isVisiting
    );
    hud.root
      .querySelector('#tsCornerLeft')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
    const isMapEditActive =
      Boolean(hud.selectedCatalogItem) ||
      hud.moveModeActive ||
      hud.bulldozerActive ||
      hud.pincerActive;
    const isBottomToolOverlayOpen =
      hud.buildSheetOpen ||
      Boolean(hud.activeCategory) ||
      hud.mapToolsExpanded ||
      hud.seedTrayOpen ||
      hud.pastureTrayOpen;
    hud.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle(
        'hidden',
        hud.photoModeActive || isVisiting || isMapEditActive || isBottomToolOverlayOpen
      );
    hud.root
      .querySelector('#visitorDockBar')
      ?.classList.toggle('hidden', hud.photoModeActive || !isVisiting);
    hud.root
      .querySelector('#inspectorPanel')
      ?.classList.toggle('hidden', hud.photoModeActive || !hud.inspectSelection);
    (hud.root.querySelector('#minimapWrap') as HTMLElement).classList.toggle(
      'hidden',
      hud.photoModeActive || !hud.minimapHudVisible
    );
    hud.root.querySelector('#btnToggleMinimapHud')?.setAttribute('aria-pressed', String(hud.minimapHudVisible)); // HPVN: gold when on
    (hud.root.querySelector('#photoModeBar') as HTMLElement).classList.toggle('hidden', !hud.photoModeActive);
    headerRefreshFloatingBanner(hud);
    headerRefreshTouchConfirmBar(hud);
    headerSyncHudFocusVisibility(hud);
    hud.renderTutorialCoach();
}

export function headerIsBuildingFocusMode(hud: GameHUD): boolean {
    if (hud.photoModeActive) return false;
    return (
      Boolean(hud.inspectSelection) ||
      (hud.seedTrayOpen && Boolean(hud.pendingSowPlotUid)) ||
      (hud.pastureTrayOpen && Boolean(hud.pendingStockPastureUid))
    );
}

export function headerToggleHudRollup(hud: GameHUD, force?: boolean): void {
    hud.hudRolledUp = force !== undefined ? force : !hud.hudRolledUp;
    if (hud.hudRolledUp) {
      headerCloseHudPopovers(hud);
      headerCollapseBuildDock(hud);
      hud.closeSeedTray();
      hud.closePastureTray();
    }
    headerSyncHudFocusVisibility(hud);
}

export function headerSyncHudFocusVisibility(hud: GameHUD): void {
    const shell = hud.root.querySelector('.hud-shell-root') as HTMLElement | null;
    if (!shell) return;
    const focused = headerIsBuildingFocusMode(hud);
    const rolled = hud.hudRolledUp && !hud.photoModeActive && !focused;
    const isVisiting = hud.sim.isVisitingNeighbor;
    const isMapEditActive =
      Boolean(hud.selectedCatalogItem) ||
      hud.moveModeActive ||
      hud.bulldozerActive ||
      hud.pincerActive;
    const sheetOrTrayOpen =
      !hud.photoModeActive &&
      !isVisiting &&
      (hud.buildSheetOpen ||
        Boolean(hud.activeCategory) ||
        hud.mapToolsExpanded ||
        hud.seedTrayOpen ||
        hud.pastureTrayOpen);
    shell.classList.toggle('hud-building-focus', focused);
    shell.classList.toggle('hud-compact-rolled', rolled);
    shell.classList.toggle('hud-sheet-or-tray-open', sheetOrTrayOpen);
    hud.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle(
        'hidden',
        hud.photoModeActive || isVisiting || isMapEditActive || sheetOrTrayOpen
      );
    const btnRoll = hud.root.querySelector('#btnToggleHudRollup') as HTMLButtonElement | null;
    if (btnRoll) {
      btnRoll.setAttribute('aria-pressed', String(hud.hudRolledUp));
      btnRoll.dataset.active = String(hud.hudRolledUp);
      btnRoll.title = hud.hudRolledUp
        ? 'Mở rộng lại các thanh HUD quanh màn hình (Phím H)'
        : 'Cuộn gọn các thanh HUD quanh màn hình để nhìn thoáng nông trại (Phím H)';
    }
    const chevron = hud.root.querySelector('#svgHudRollupChevron') as SVGPathElement | null;
    if (chevron) {
      chevron.setAttribute(
        'd',
        hud.hudRolledUp ? 'M13.5 19.5 L18 24 L22.5 19.5' : 'M13.5 23 L18 18.5 L22.5 23'
      );
    }
    const btnManageRoll = hud.root.querySelector(
      '#btnManageToggleHudRollup'
    ) as HTMLButtonElement | null;
    if (btnManageRoll) {
      btnManageRoll.textContent = hud.hudRolledUp
        ? 'Mở HUD'
        : 'Ẩn HUD';
      btnManageRoll.setAttribute('aria-pressed', String(hud.hudRolledUp)); // HPVN: a toggle that is on is gold in the ☰ menu
    }
    const roundOrb = hud.root.querySelector('#btnHudRoundOrb') as HTMLButtonElement | null;
    if (roundOrb) {
      roundOrb.classList.toggle('hidden', !hud.hudRolledUp || hud.photoModeActive || focused);
      roundOrb.setAttribute('aria-pressed', String(hud.hudRolledUp));
      roundOrb.dataset.rolled = String(hud.hudRolledUp);
    }
    const orbLbl = hud.root.querySelector('#lblHudRoundOrbTag');
    if (orbLbl) {
      orbLbl.textContent = 'Hiện HUD';
    }
    const orbChevron = hud.root.querySelector('#svgRoundOrbChevron') as SVGPathElement | null;
    if (orbChevron) {
      orbChevron.setAttribute(
        'd',
        hud.hudRolledUp ? 'M16 19.8 L20 23.8 L24 19.8' : 'M16 23.2 L20 19.2 L24 23.2'
      );
    }
    if (focused) {
      headerCloseHudPopovers(hud);
      headerCollapseBuildDock(hud);
      const dockWrap = hud.root.querySelector('#bottomDockWrap') as HTMLElement | null;
      dockWrap?.classList.remove('ts-dock-open');
      const drawer = hud.root.querySelector('#buildDrawer') as HTMLElement | null;
      drawer?.classList.add('hidden');
      const swipeBar = hud.root.querySelector('#buildDrawerSwipeBar') as HTMLElement | null;
      swipeBar?.classList.add('hidden');
      const decorFilterBar = hud.root.querySelector('#decorCollectionFilterBar') as HTMLElement | null;
      decorFilterBar?.classList.add('hidden');
      const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
      secBar?.classList.add('hidden');
    }
}

export function headerCloseHudPopovers(hud: GameHUD): void {
    const wasOpen = hud.manageMenuOpen || hud.weatherPopoverOpen;
    hud.manageMenuOpen = false;
    hud.weatherPopoverOpen = false;
    const managePop = hud.root.querySelector('#managePopoverMenu') as HTMLElement | null;
    const weatherPop = hud.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    const btnManage = hud.root.querySelector('#btnToggleManageMenu') as HTMLElement | null;
    const btnClock = hud.root.querySelector('#lblClock') as HTMLElement | null;
    managePop?.classList.add('hidden');
    weatherPop?.classList.add('hidden');
    if (btnManage) {
      btnManage.setAttribute('aria-expanded', 'false');
      btnManage.setAttribute('data-active', 'false');
    }
    if (btnClock) {
      btnClock.setAttribute('aria-expanded', 'false');
    }
    if (wasOpen) {
      hud.renderTutorialCoach();
    }
}

export function headerCollapseBuildDock(hud: GameHUD): void {
    hud.buildSheetOpen = false;
    hud.activeCategory = null;
    hud.christmasTabActive = false;
    hud.mapToolsExpanded = false;
}

export function headerHasOpenFloatingTray(hud: GameHUD): boolean {
    return (
      hud.buildSheetOpen ||
      Boolean(hud.activeCategory) ||
      hud.mapToolsExpanded ||
      hud.seedTrayOpen ||
      hud.pastureTrayOpen
    );
}

export function headerHideOpenFloatingTrays(hud: GameHUD): void {
    headerCollapseBuildDock(hud);
    hud.seedTrayOpen = false;
    hud.pendingSowPlotUid = null;
    hud.activeSeedCropId = null;
    hud.pastureTrayOpen = false;
    hud.pendingStockPastureUid = null;
    hud.activePastureAnimalId = null;
}

export function headerPositionFloatingPopover(hud: GameHUD, triggerEl: HTMLElement | null, popoverEl: HTMLElement | null): void {
    if (!triggerEl || !popoverEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const cs = getComputedStyle(document.documentElement);
    const pxVar = (name: string) => parseFloat(cs.getPropertyValue(name)) || 0;
    const insetTop = Math.max(8, pxVar('--host-inset-top'));
    const insetRight = Math.max(8, pxVar('--host-inset-right'));
    const insetLeft = Math.max(8, pxVar('--host-inset-left'));
    const insetBottom = Math.max(8, pxVar('--host-inset-bottom'), pxVar('--hpvn-safe-bottom'), pxVar('--hpvn-dock'));
    const popW = Math.min(window.innerWidth - insetLeft - insetRight, Math.max(248, popoverEl.offsetWidth || 336));
    const popH = Math.min(popoverEl.offsetHeight || 420, window.innerHeight - insetTop - insetBottom);
    const preferredLeft = rect.left < window.innerWidth * 0.5 ? rect.left : rect.right - popW;
    const left = Math.max(insetLeft, Math.min(preferredLeft, window.innerWidth - popW - insetRight));
    const top = Math.max(insetTop, Math.min(rect.bottom + 8, window.innerHeight - insetBottom - popH));
    popoverEl.style.left = `${Math.round(left)}px`;
    popoverEl.style.top = `${Math.round(top)}px`;
}

export function headerToggleManagePopover(hud: GameHUD, force?: boolean): void {
    if (hud.sim.isVisitingNeighbor) {
      headerCloseHudPopovers(hud);
      hud.showToast('🦉 Đang tham quan vườn bạn — hãy về vườn nhà để mở Menu Khu Vườn nhé!', '🦉');
      return;
    }
    const next = typeof force === 'boolean' ? force : !hud.manageMenuOpen;
    headerCloseHudPopovers(hud);
    if (!next) return;
    if (headerHasOpenFloatingTray(hud) || hud.inspectSelection) {
      headerHideOpenFloatingTrays(hud);
      hud.inspectSelection = null;
      hud.refreshAll();
    }
    hud.manageMenuOpen = true;
    const pop = hud.root.querySelector('#managePopoverMenu') as HTMLElement | null;
    const btn = hud.root.querySelector('#btnToggleManageMenu') as HTMLElement | null;
    if (pop && btn) {
      pop.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('data-active', 'true');
      headerPositionFloatingPopover(hud, btn, pop);
    }
    hud.renderTutorialCoach();
}

export function headerToggleWeatherPopover(hud: GameHUD, force?: boolean): void {
    const next = typeof force === 'boolean' ? force : !hud.weatherPopoverOpen;
    headerCloseHudPopovers(hud);
    if (!next) return;
    hud.weatherPopoverOpen = true;
    const pop = hud.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    const btn = hud.root.querySelector('#lblClock') as HTMLElement | null;
    if (pop && btn) {
      headerRenderWeatherPopover(hud);
      pop.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      headerPositionFloatingPopover(hud, btn, pop);
    }
    hud.renderTutorialCoach();
}

export function headerRenderWeatherPopover(hud: GameHUD): void {
    const pop = hud.root.querySelector('#weatherPopoverMenu') as HTMLElement | null;
    if (!pop) return;
    const nowMs = Date.now();
    const cur = hud.sim.getCurrentWeather(nowMs);
    const slots = hud.sim.getWeatherForecast(4, nowMs);
    const isAuto = hud.sim.state.settings.weatherOverride === 'auto';

    pop.innerHTML = `
      <div class="hud-popover-title">
        <span>🌦️ Thời Tiết</span>
        <span class="weather-slot-meta">${isAuto ? 'Tự động' : 'Khóa'}</span>
      </div>
      <div class="weather-current-banner">
        <div class="weather-current-head">${cur.icon} ${escapeHtml(cur.labelVi)}</div>
        <div class="weather-current-buff">✨ ${escapeHtml(cur.buffVi)}</div>
      </div>
      ${
        IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
          ? `<div class="speed-toggle-row" role="group" aria-label="Tốc độ nhịp sống công viên">
              <button type="button" data-sim-speed="1" data-active="${hud.sim.simSpeed === 1}" aria-pressed="${hud.sim.simSpeed === 1}" class="brass-btn">
                🐢 1×
              </button>
              <button type="button" data-sim-speed="2" data-active="${hud.sim.simSpeed === 2}" aria-pressed="${hud.sim.simSpeed === 2}" class="brass-btn">
                ⚡ 2×
              </button>
            </div>`
          : ''
      }
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

    if (IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()) {
      pop.querySelectorAll<HTMLButtonElement>('[data-sim-speed]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (!isSandboxRuntimeAllowed()) return;
          const spd = btn.dataset.simSpeed === '2' ? 2 : 1;
          hud.sim.simSpeed = spd;
          headerRefreshHeaderClock(hud);
          headerCloseHudPopovers(hud);
          headerShowToast(
            hud,
            spd === 2
              ? '⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!'
              : '🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.',
            spd === 2 ? '⚡' : '🌿'
          );
        });
      });
    }
}

// HPVN: on phones a balance from 10.000 reads «12,9k» (compactSickle, toolIcons.ts); the full figure goes to the title and
// the chip's label once the roll stops, and Gringotts / the barn show it whole
function setSickleText(lbl: HTMLElement, n: number, final = true): void {
    const full = n.toLocaleString('vi-VN');
    lbl.textContent = window.matchMedia('(max-width: 599px)').matches ? compactSickle(n) : full;
    if (!final) return;
    lbl.title = `${full} Sickle`;
    lbl.closest('button')?.setAttribute('aria-label', `${full} Sickle — Chạm để chơi kiếm thêm Sickle`);
}

export function headerAnimateSickleTo(hud: GameHUD, target: number): void {
    const lbl = hud.root.querySelector('#lblSickle') as HTMLElement | null;
    if (!lbl) return;
    if (hud.sim.state.sandboxMode) {
      if (hud.galleonRollRaf) {
        cancelAnimationFrame(hud.galleonRollRaf);
        hud.galleonRollRaf = 0;
      }
      lbl.textContent = '∞';
      hud.displayedSickle = target;
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hud.displayedSickle < 0 || reducedMotion || Math.abs(target - hud.displayedSickle) <= 1) {
      hud.displayedSickle = target;
      setSickleText(lbl, Math.round(target));
      return;
    }

    if (hud.galleonRollRaf) {
      cancelAnimationFrame(hud.galleonRollRaf);
      hud.galleonRollRaf = 0;
    }

    const startVal = hud.displayedSickle;
    const startAt = performance.now();
    const duration = 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(startVal + (target - startVal) * eased);
      hud.displayedSickle = cur;
      setSickleText(lbl, cur, t >= 1);
      if (t < 1) {
        hud.galleonRollRaf = requestAnimationFrame(step);
      } else {
        hud.displayedSickle = target;
        hud.galleonRollRaf = 0;
      }
    };
    hud.galleonRollRaf = requestAnimationFrame(step);
}

export function headerSpawnFlyReward(hud: GameHUD, 
    kind: FlyRewardKind,
    amount: number,
    startSx?: number,
    startSy?: number
  ): void {
    const targetEl = hud.root.querySelector(`[data-fly-target="${kind}"]`) as HTMLElement | null;
    const layer = hud.root.querySelector('#flyRewardLayer') as HTMLElement | null;
    if (!targetEl || !layer) return;

    const pulseTarget = () => {
      targetEl.classList.remove('hud-chip-pulse');
      void targetEl.offsetWidth;
      targetEl.classList.add('hud-chip-pulse');
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hud.photoModeActive) {
      pulseTarget();
      hud.sim.audio.playFlyTick(0);
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
        hud.sim.audio.playFlyTick(i);
      };
    }
}

// HPVN: a toast is one plain line — the leading emoji (and the icon argument) is dropped here, for every caller
export function formatToastMessage(msg: string, _icon = ''): string {
  const trimmed = msg.trim();
  return trimmed.replace(/^(?:[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]|\s)+/u, '') || trimmed;
}

// HPVN: one toast at a time; a newer one waits until the shown one has been up ~1.2 s (at most 3 waiting, oldest dropped)
const TOAST_MIN_MS = 1200;
const toastQueue: string[] = [];
let toastShownAt = 0;
let toastWait = 0;
let toastShown: HTMLElement | null = null;

export function headerShowToast(hud: GameHUD, msg: string, icon = '🦉'): void {
    const text = formatToastMessage(msg, icon);
    if (!text) return;
    // the same message again: if it is showing now it stays another 3,5 s; if it is last in line, nothing to add
    if (toastShown?.isConnected && toastShown.dataset.msg === text) return scheduleToastHide(toastShown);
    if (text === toastQueue[toastQueue.length - 1]) return;
    if (toastQueue.length >= 3) toastQueue.shift();
    toastQueue.push(text);
    pumpToast(hud);
}

let toastHide = 0;
function scheduleToastHide(item: HTMLElement, stack?: HTMLElement | null): void {
    window.clearTimeout(toastHide);
    toastHide = window.setTimeout(() => {
      const host = stack ?? item.parentElement;
      item.remove();
      const pop = host as (HTMLElement & { hidePopover?: () => void }) | null;
      if (pop && !pop.childElementCount && typeof pop.hidePopover === 'function') {
        try {
          if (pop.matches(':popover-open')) pop.hidePopover();
        } catch {
          // Ignore if already closed
        }
      }
    }, 3500);
}

export function headerSyncToastStackHost(hud: GameHUD): HTMLElement | null {
    const stack =
      hud.root.querySelector<HTMLElement>('#toastStack') ??
      (typeof document !== 'undefined' ? document.getElementById('toastStack') : null);
    if (!stack) return null;

    // Promote #toastStack into the topmost open <dialog> (#top-layer) so toasts never hide behind showModal()!
    const openDialogs = Array.from(hud.root.querySelectorAll<HTMLDialogElement>('dialog[open]'));
    const topDialog = openDialogs.length > 0 ? openDialogs[openDialogs.length - 1] : null;
    if (topDialog) {
      if (stack.parentElement !== topDialog) {
        topDialog.appendChild(stack);
        topDialog.addEventListener(
          'close',
          () => {
            const remaining = Array.from(
              hud.root.querySelectorAll<HTMLDialogElement>('dialog[open]')
            );
            const nextHost =
              remaining.length > 0 ? remaining[remaining.length - 1] : hud.root;
            if (stack.parentElement !== nextHost) {
              nextHost.appendChild(stack);
            }
          },
          { once: true }
        );
      }
    } else if (stack.parentElement !== hud.root) {
      hud.root.appendChild(stack);
    }
    return stack;
}

function pumpToast(hud: GameHUD): void {
    if (toastWait) return;
    const stack = headerSyncToastStackHost(hud);
    if (!stack) {
      toastQueue.length = 0; // no stack to show them in: drop, so they do not all burst out later
      return;
    }

    const wait = stack.childElementCount ? toastShownAt + TOAST_MIN_MS - Date.now() : 0;
    if (wait > 0) {
      toastWait = window.setTimeout(() => { toastWait = 0; pumpToast(hud); }, wait);
      return;
    }
    const text = toastQueue.shift();
    if (!text) return;
    const item = document.createElement('div');
    item.className = 'parchment-dark owl-toast';
    item.dataset.msg = text; // HPVN: its text loses the emoji on screen, so the repeat check reads the message here
    item.appendChild(document.createElement('span')).textContent = text; // the inner span carries the 2-line clamp
    stack.replaceChildren(item);
    const pop = stack as HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
    if (typeof pop.showPopover === 'function') {
      try {
        if (!stack.hasAttribute('popover')) stack.setAttribute('popover', 'manual');
        if (stack.matches(':popover-open')) pop.hidePopover?.();
        pop.showPopover();
      } catch {
        // Fallback to fixed stack when Popover API is unavailable
      }
    }
    toastShown = item;
    toastShownAt = Date.now();
    scheduleToastHide(item, stack);
    if (toastQueue.length) pumpToast(hud);
}

export function headerShowOfflineModal(hud: GameHUD, report: OfflineReport): void {
    const mins = Math.max(1, Math.round(report.awaySeconds / 60));
    const content = hud.root.querySelector('#offlineDialogContent')!;
    // HPVN (đợt 4): bare rows, name left and figure right, then the one decision
    content.innerHTML = `
      <dl class="hs-rows">
        <div><dt>Vắng mặt</dt><dd>${mins.toLocaleString('vi-VN')} phút</dd></div>
        <div><dt>Sickle</dt><dd>+${report.galleonsEarned.toLocaleString('vi-VN')} Sickle</dd></div>
        <div><dt>XP</dt><dd>+${report.xpEarned.toLocaleString('vi-VN')}</dd></div>
        <div><dt>Công trình xong</dt><dd>${report.buildingsFinished}</dd></div>
      </dl>
      <form method="dialog" class="hs-dlg-actions"><button type="submit" class="brass-btn gold-cta">Nhận</button></form>
    `;
    (hud.root.querySelector('#offlineDialog') as HTMLDialogElement).showModal();
}

export function headerRefreshFloatingBanner(hud: GameHUD): void {
    const banner = hud.root.querySelector('#floatingModeBanner') as HTMLElement | null;
    const txt = hud.root.querySelector('#floatingBannerText') as HTMLElement | null;
    const btnAutoPlace = hud.root.querySelector('#btnFloatingAutoPlace') as HTMLButtonElement | null;
    const btnSec = hud.root.querySelector('#btnFloatingSecondary') as HTMLButtonElement | null;
    const btnSwap = hud.root.querySelector('#btnFloatingSwap') as HTMLButtonElement | null;
    const btnExit = hud.root.querySelector('#btnFloatingExit') as HTMLButtonElement | null;
    hud.root.classList.toggle('is-pincer-mode', hud.pincerActive && !hud.photoModeActive);
    if (!banner || !txt || !btnSec || !btnSwap || !btnExit) return;

    btnAutoPlace?.classList.add('hidden');
    btnSwap.classList.add('hidden');
    btnExit.classList.add('gold-cta');

    if (hud.photoModeActive) {
      banner.classList.add('hidden');
      return;
    }

    if (hud.rideCamUid) {
      const b = hud.sim.state.buildings.find((x) => x.uid === hud.rideCamUid);
      const it = b ? getCatalogItem(b.itemId) : undefined;
      if (!b || !it) {
        hud.rideCamUid = null;
      } else {
        banner.classList.remove('hidden');
        txt.textContent = `🎥 ${it.name}${hud.rideCamSpeedText ? ` • ${hud.rideCamSpeedText}` : ''}`;
        btnSec.textContent = '🧭 90°';
        btnSec.classList.remove('hidden');
        btnExit.textContent = '✕';
        return;
      }
    }

    if (hud.pincerActive) {
      banner.classList.remove('hidden');
      txt.textContent = hud.pincerPicked
        ? `🤏 Đang gắp ${hud.pincerPicked.label} — Chạm ô để thả`
        : '🤏 Điều phối nhân sự — Chạm ô để thả • Esc hủy';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (hud.moveModeActive) {
      banner.classList.remove('hidden');
      if (hud.movingBuildingUid) {
        const mb = hud.sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid);
        const mIt = mb ? getCatalogItem(mb.itemId) : undefined;
        txt.textContent = `✋ ${mIt?.name ?? 'Dời chỗ'}`;
        btnSec.textContent = `🔄 ${hud.rotation * 90}°`;
        btnSec.classList.remove('hidden');
        btnExit.textContent = '✕';
      } else {
        txt.textContent = '✋ Chọn công trình để dời';
        btnSec.classList.add('hidden');
        btnExit.textContent = '✕';
      }
      return;
    }

    if (hud.bulldozerActive) {
      banner.classList.remove('hidden');
      txt.textContent = '🧹 Phá dỡ';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (hud.selectedCatalogItem && !hud.buildSheetOpen && !hud.activeCategory) {
      const it = hud.selectedCatalogItem;
      const canRotate =
        it.category !== 'path' &&
        it.category !== 'terrain' &&
        !it.isFarmlandPlot &&
        !it.connectableGroup &&
        !it.isZooFence;
      const canAutoPlace =
        it.category !== 'path' &&
        it.category !== 'terrain' &&
        !it.isCoasterTrackPiece &&
        !it.isZooFence &&
        !it.elevationDelta;
      const effStars = hud.sim.getEffectiveItemStarCost(it);
      const costTxt =
        effStars > 0
          ? `🌟 ${effStars}`
          : it.cost === 0
            ? '0 Sickle'
            : `${it.cost.toLocaleString('vi-VN')} Sickle`;
      banner.classList.remove('hidden');
      txt.textContent = `🏗️ ${it.name} • ${costTxt}`;
      if (canAutoPlace && btnAutoPlace) {
        btnAutoPlace.textContent = '⚡ Đặt Ngay';
        btnAutoPlace.classList.remove('hidden');
        btnExit.classList.remove('gold-cta');
      }
      if (canRotate) {
        btnSec.textContent = `🔄 ${hud.rotation * 90}°`;
        btnSec.classList.remove('hidden');
      } else {
        btnSec.classList.add('hidden');
      }
      btnSwap.textContent = '📦 Đổi';
      btnSwap.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (hud.activeSeedCropId && !hud.seedTrayOpen) {
      const c = FARM_CROPS[hud.activeSeedCropId];
      const seedLeft = hud.sim.getSeedCount(hud.activeSeedCropId);
      banner.classList.remove('hidden');
      txt.textContent = `🌱 ${c.emoji} ${c.name} (${seedLeft})`;
      btnSec.textContent = '🌱 Đổi';
      btnSec.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (hud.activePastureAnimalId && !hud.pastureTrayOpen) {
      const a = PASTURE_ANIMALS[hud.activePastureAnimalId];
      banner.classList.remove('hidden');
      txt.textContent = `🐾 ${a.emoji} ${a.name} (${a.cost.toLocaleString('vi-VN')} Sickle)`;
      btnSec.textContent = '🐾 Đổi';
      btnSec.classList.remove('hidden');
      btnExit.textContent = '✕';
      return;
    }

    if (hud.sim.state.settings.cutawayMode) {
      banner.classList.remove('hidden');
      txt.textContent = '👁️ Nhìn xuyên';
      btnSec.classList.add('hidden');
      btnExit.textContent = '✕';
      return;
    }

    banner.classList.add('hidden');
}

export function headerRefreshTouchConfirmBar(hud: GameHUD): void {
    const bar = hud.root.querySelector('#touchConfirmBar') as HTMLElement | null;
    const lbl = hud.root.querySelector('#lblTouchConfirm') as HTMLElement | null;
    const btnRot = hud.root.querySelector('#btnTouchRotate') as HTMLButtonElement | null;
    const btnStash = hud.root.querySelector('#btnTouchStash') as HTMLButtonElement | null;
    if (!bar || !lbl) return;
    if (hud.photoModeActive || !hud.pendingTouchTile) {
      bar.classList.add('hidden');
      return;
    }
    const activeItem =
      hud.selectedCatalogItem ??
      (hud.moveModeActive && hud.movingBuildingUid
        ? getCatalogItem(
            hud.sim.state.buildings.find((x) => x.uid === hud.movingBuildingUid)?.itemId ?? ''
          ) ?? null
        : null);
    const canRotate = Boolean(
      activeItem &&
        activeItem.category !== 'path' &&
        activeItem.category !== 'terrain' &&
        !activeItem.isFarmlandPlot &&
        !activeItem.connectableGroup &&
        !activeItem.isZooFence
    );
    const canStashMove = Boolean(
      hud.moveModeActive &&
        hud.movingBuildingUid &&
        hud.sim.canStashBuilding(hud.movingBuildingUid)
    );
    btnRot?.classList.toggle('hidden', !canRotate);
    btnStash?.classList.toggle('hidden', !canStashMove);
    bar.classList.remove('hidden');
    lbl.textContent = `📍 ${hud.pendingTouchTile.label}`;
}

export function headerRefreshYuleBanner(hud: GameHUD): void {
    const banner = hud.root.querySelector('#yuleEventBanner') as HTMLButtonElement | null;
    const title = hud.root.querySelector('#yuleEventBannerTitle') as HTMLElement | null;
    const task = hud.root.querySelector('#yuleEventBannerTask') as HTMLElement | null;
    const progress = hud.root.querySelector('#yuleEventBannerProgress') as HTMLElement | null;
    if (!banner || !title || !task || !progress) return;
    const status = hud.sim.getYuleEventStatus();
    if (hud.photoModeActive || hud.sim.isVisitingNeighbor || !status.active || !status.dayDef) { banner.classList.add('hidden'); return; }
    const main = status.dayDef.main;
    const current = hud.sim.getYuleTaskProgress(main.id);
    const target = hud.sim.getYuleTaskTarget(main.id);
    const claimed = status.claimedMainDays.includes(status.day);
    title.textContent = `🎄 Yule • Ngày ${status.day}/36`;
    task.textContent = claimed ? 'Đã nhận phần thưởng' : main.titleVi;
    progress.textContent = claimed ? '✓' : `${Math.min(current, target)}/${target}`;
    banner.classList.remove('hidden');
}

export function headerYuleReadyToasts(hud: GameHUD): void {
    const status = hud.sim.getYuleEventStatus();
    if (!status.active || !status.dayDef || hud.photoModeActive || hud.sim.isVisitingNeighbor) {
      hud.yuleReadySig = '';
      return;
    }
    const defs = [status.dayDef.main, ...status.dayDef.side];
    const ready = defs.filter((t) => {
      const isMain = t === status.dayDef!.main;
      const claimed = isMain ? status.claimedMainDays.includes(status.day) : status.claimedSideTaskIds.includes(t.id);
      return !claimed && hud.sim.getYuleTaskProgress(t.id) >= t.amount;
    });
    if (ready.length === 0) { hud.yuleReadySig = ''; return; }
    const sig = ready.map((t) => t.id).join('|');
    if (hud.yuleReadySig === sig) return;
    hud.yuleReadySig = sig;
    hud.showToast(`🎄 Yule: ${ready.length} nhiệm vụ sẵn sàng — mở bảng Nhiệm Vụ để nhận!`, '🎄');
}

export function headerRefreshAll(hud: GameHUD): void {
    const isVisiting = hud.sim.isVisitingNeighbor;
    if (isVisiting) {
      clearBuildToolModes(hud);
      hud.inspectSelection = null;
      hud.seedTrayOpen = false;
      hud.activeSeedCropId = null;
      hud.pendingSowPlotUid = null;
      hud.pastureTrayOpen = false;
      hud.activePastureAnimalId = null;
      hud.pendingStockPastureUid = null;
    }
    headerRefreshHeader(hud);
    headerRefreshYuleBanner(hud);
    headerYuleReadyToasts(hud);
    headerRefreshQuestTracker(hud);
    headerRefreshDock(hud);
    hud.renderSeedTray();
    hud.renderPastureTray();
    hud.renderVisitorDockBar();
    hud.root
      .querySelector('#bottomDockWrap')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
    hud.root
      .querySelector('#tsCornerLeft')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
    const isMapEditActive =
      Boolean(hud.selectedCatalogItem) ||
      hud.moveModeActive ||
      hud.bulldozerActive ||
      hud.pincerActive;
    const isBottomToolOverlayOpen =
      hud.buildSheetOpen ||
      Boolean(hud.activeCategory) ||
      hud.mapToolsExpanded ||
      hud.seedTrayOpen ||
      hud.pastureTrayOpen;
    hud.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle(
        'hidden',
        hud.photoModeActive || isVisiting || isMapEditActive || isBottomToolOverlayOpen
      );
    hud.root
      .querySelector('#btnOpenSeedSilo')
      ?.classList.toggle('hidden', isVisiting);
    hud.root
      .querySelector('#btnOpenPastureTray')
      ?.classList.toggle('hidden', isVisiting);
    hud.root
      .querySelector('#btnOpenHarvestFeast')
      ?.classList.toggle('hidden', isVisiting);
    hud.refreshHarvestFeastBadges();
    const feastDlg = hud.root.querySelector('#harvestFeastDialog') as HTMLDialogElement | null;
    if (feastDlg?.open) {
      hud.renderHarvestFeastDialog();
    }
    if (document.activeElement?.id !== 'inpBuildingPrice') {
      hud.renderInspector();
    }
    headerRefreshFloatingBanner(hud);
    headerRefreshTouchConfirmBar(hud);
    headerSyncHudFocusVisibility(hud);
    hud.renderTutorialCoach();
}

export function headerRefreshHeaderClock(hud: GameHUD): void {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const period = hud.sim.getRealTimePeriod(now);
    const weather = hud.sim.getCurrentWeather(now.getTime());
    const periodNames: Record<string, string> = {
      dawn: 'Bình Minh',
      day: 'Ban Ngày',
      dusk: 'Hoàng Hôn',
      night: 'Đêm Sao',
    };
    const lblClock = hud.root.querySelector('#lblClock') as HTMLElement | null;
    if (lblClock) {
      const speedBadge = hud.sim.simSpeed === 2 ? ' <span class="speed-mini-tag">2×</span>' : '';
      lblClock.innerHTML = `<span>${hh}:${mm}</span>${speedBadge}`; // HPVN: no weather emoji; the weather is named in the label and in its popover
      lblClock.setAttribute('aria-label', `${hh}:${mm} · ${weather.labelVi}`);
      lblClock.title = weather.labelVi;
    }
    if (hud.weatherPopoverOpen) {
      headerRenderWeatherPopover(hud);
    }

    const fest = hud.sim.getActiveFestival(now);
    const winterMapActive =
      typeof hud.sim.isWinterMainMapActive === 'function' && hud.sim.isWinterMainMapActive();
    if (typeof document !== 'undefined') {
      const wantYule =
        hud.sim.isYuleVisualThemeActive(now) || winterMapActive ? 'true' : 'false';
      if (document.documentElement.dataset.yuleTheme !== wantYule) {
        document.documentElement.dataset.yuleTheme = wantYule;
      }
    }
    const lblFest = hud.root.querySelector('#lblFestival') as HTMLElement | null;
    if (lblFest) {
      if (fest === 'halloween') {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🎃 +35% XP';
      } else if (fest === 'christmas') {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🎄 Giáng Sinh +25% 🪙';
      } else if (fest === 'quidditch_cup' && !winterMapActive) {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🏆 Quidditch +Cúp';
      } else if (winterMapActive) {
        lblFest.classList.remove('hidden');
        lblFest.textContent = '🎄 Đồi Tuyết Giáng Sinh';
      } else {
        lblFest.classList.add('hidden');
      }
    }

    // Live Match-3 Hearts regeneration readout in top HUD
    hud.sim.tickMatch3Hearts(Date.now());
    const st = hud.sim.state;
    const lblHearts = hud.root.querySelector('#lblPuzzleHearts') as HTMLElement | null;
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
    const btnBuilds = hud.root.querySelector('#btnHudActiveBuilds') as HTMLElement | null;
    const lblBuilds = hud.root.querySelector('#lblActiveBuilds') as HTMLElement | null;
    if (btnBuilds && lblBuilds) {
      const actives = hud.sim.getActiveConstructions(Date.now());
      if (actives.length === 0) {
        btnBuilds.classList.add('hidden');
      } else {
        btnBuilds.classList.remove('hidden');
        const nextLeft = Math.max(1, Math.ceil((actives[0].constructEndsAt - Date.now()) / 1000));
        lblBuilds.textContent = String(actives.length);
        btnBuilds.title = `Đang xây (${formatDurationCountdownVi(nextLeft)})`;
      }
    }
}

export function headerRefreshHeader(hud: GameHUD): void {
    const st = hud.sim.state;
    const reqTrial = hud.sim.getRequiredLevelTrial();
    const chestXp = Math.max(0, st.xp) % FARM_HARVEST_CHEST_XP;
    const pct = Math.max(6, Math.min(100, (chestXp / FARM_HARVEST_CHEST_XP) * 100));

    (hud.root.querySelector('#lblLevelNum') as HTMLElement).textContent = String(st.level);
    (hud.root.querySelector('#lblTitle') as HTMLElement).textContent =
      (hud.sim.isHeadmasterPreview ? '🔮 [Xem Thử] ' : '') + getPlayerTitle(st.level);
    (hud.root.querySelector('#barXpFill') as HTMLElement).style.width = `${pct}%`;
    const xpShell = hud.root.querySelector('#xpBarShell') as HTMLElement | null;
    xpShell?.classList.remove('trial-waiting');

    const lblRibbon = hud.root.querySelector('#lblParkRibbonName') as HTMLElement | null;
    if (lblRibbon) {
      const visitingNb = hud.sim.getActiveVisitingNeighbor();
      lblRibbon.textContent = visitingNb
        ? `🚂 Thăm: ${visitingNb.avatarEmoji} ${visitingNb.parkName}`
        : st.parkName || 'Trang Trại Hang Sóc';
    }
    hud.refreshNeighborBadges();
    const winsProg = hud.sim.getWinsProgressForCurrentLevel();
    const towerProg = hud.sim.getTotalTowerClearedStages();
    const lvPct =
      st.level >= MAX_LEVEL
        ? 100
        : Math.min(
            100,
            Math.max(8, Math.round((winsProg.current / Math.max(1, winsProg.required)) * 100))
          );
    const btnRoadmap = hud.root.querySelector('#btnOpenRoadmap') as HTMLElement | null;
    if (btnRoadmap) {
      btnRoadmap.style.setProperty('--hg-lvl-pct', String(lvPct));
      btnRoadmap.title =
        st.level >= MAX_LEVEL
          ? `👑 Cấp Tối Đa ${MAX_LEVEL} • Rương XP: ${chestXp}/${FARM_HARVEST_CHEST_XP} • Tháp 6 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`
          : `Cấp ${st.level} → ${st.level + 1}: Đã thắng ${winsProg.current}/${winsProg.required} màn • Rương XP: ${chestXp}/${FARM_HARVEST_CHEST_XP}`;
    }
    const barLvlTop = hud.root.querySelector('#barLevelTopFill') as HTMLElement | null;
    if (barLvlTop) {
      barLvlTop.style.width = `${lvPct}%`;
      if (barLvlTop.parentElement) {
        barLvlTop.parentElement.title =
          st.level >= MAX_LEVEL
            ? `👑 Đã đạt Cấp Tối Đa ${MAX_LEVEL} • Tháp 6 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`
            : `Cấp Giải Đố ${st.level} → ${st.level + 1}: Đã thắng ${winsProg.current}/${winsProg.required} màn mới • Tháp 6 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`;
      }
    }
    const lblXpFrac = hud.root.querySelector('#lblXpFraction') as HTMLElement | null;
    if (lblXpFrac) {
      lblXpFrac.textContent = `🎁 ${chestXp}/${FARM_HARVEST_CHEST_XP}`;
    }
    const barn = hud.sim.ensureFarmBarn();
    const barnUsed = hud.sim.getBarnTotalUsed();
    const lblBarn = hud.root.querySelector('#lblStorageBarn') as HTMLElement | null;
    if (lblBarn) {
      lblBarn.textContent = `${barnUsed}/${barn.capacity}`;
    }

    headerAnimateSickleTo(hud, st.galleons);
    const starsStr = st.sandboxMode ? '∞' : String(st.match3?.stars ?? 0);
    const lblStars = hud.root.querySelector('#lblPuzzleStars') as HTMLElement | null;
    if (lblStars && st.match3) {
      lblStars.textContent = starsStr;
    }
    const lblHubStars = hud.root.querySelector('#lblHudHubStars') as HTMLElement | null;
    if (lblHubStars) {
      lblHubStars.textContent = starsStr;
    }
    const lblHubTrial = hud.root.querySelector('#lblHudHubTrial') as HTMLElement | null;
    if (lblHubTrial) {
      if (st.level >= MAX_LEVEL || st.sandboxMode || hud.sim.isHeadmasterPreview || !reqTrial) {
        lblHubTrial.textContent = `🌟 ${towerProg.cleared}/${towerProg.total}`;
      } else {
        lblHubTrial.textContent = `🔥 ${reqTrial.icon} ${winsProg.current}/${winsProg.required}`;
      }
    }
    hud.root.querySelector('#btnHudMinigameHub')?.classList.remove('trial-urgent');

    // Update Bottom-Right Hero Play CTA -> Always reflects lastPlayedMinigame (never forces Chess)
    const m3Info = hud.sim.getDisciplineStageInfo('match3');
    const lastGame = hud.sim.getLastPlayedMinigame();
    let playTag = '🍬 Bùa Gặt';
    let playIcon = '/game/trang-trai-hang-soc/sprites/m3_farm_pinwheel.webp';
    let playStageText = m3Info.isMaxed ? `👑 ${m3Info.maxStage}` : `Màn ${m3Info.currentStage}`;
    if (lastGame === 'caro') {
      const info = hud.sim.getDisciplineStageInfo('caro');
      playTag = '🧨 Dò Mìn';
      playIcon = '/game/trang-trai-hang-soc/paintings/mines_flag.webp?v=flag1';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'sudoku') {
      const info = hud.sim.getDisciplineStageInfo('sudoku');
      playTag = '🔢 Số Học';
      playIcon = '/game/trang-trai-hang-soc/sprites/m3_piece_scroll.webp';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'blocks') {
      const info = hud.sim.getDisciplineStageInfo('blocks');
      playTag = '🦄 Sinh Vật';
      playIcon = '/game/trang-trai-hang-soc/sprites/beast_niffler.webp';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'chess') {
      const info = hud.sim.getDisciplineStageInfo('chess');
      playTag = '🎯 Bắn Cá';
      playIcon = '/game/trang-trai-hang-soc/paintings/plimpy_icon.webp?v=sea2';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'jigsaw') {
      const info = hud.sim.getDisciplineStageInfo('jigsaw');
      playTag = '🧩 Tranh Ghép';
      playIcon = '/game/trang-trai-hang-soc/sprites/ui_icon_jigsaw.webp';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'seedquiz') {
      playTag = '🪄 Thần Chú';
      playIcon = '/game/trang-trai-hang-soc/sprites/ui_icon_seed_sack.webp';
      playStageText = 'Ôn Tập';
    }

    const imgCornerPlay = hud.root.querySelector('#imgCornerPlayIcon') as HTMLImageElement | null;
    if (imgCornerPlay && imgCornerPlay.getAttribute('src') !== playIcon) {
      imgCornerPlay.setAttribute('src', playIcon);
    }
    // HPVN: names and stages without emoji; the accessible name joins the three filtered lines
    const playTagText = formatToastMessage(playTag);
    const playStageLine = formatToastMessage(playStageText.replace('👑', 'Màn'));
    let bestNeedStars = 0;
    if (!st.sandboxMode && lastGame === 'match3' && st.level < MAX_LEVEL) {
      const curStars = st.match3?.stars ?? 0;
      const builtSet = new Set(st.buildings.map((b) => b.itemId));
      const unlockedZoneSet = new Set(st.unlockedZones);
      for (const z of ZONES) {
        if (unlockedZoneSet.has(z.id) || st.level < z.unlockLevel) continue;
        const need = getZonePuzzleStarCost(z) - curStars;
        if (need >= 1 && need <= 25 && (bestNeedStars === 0 || need < bestNeedStars)) {
          bestNeedStars = need;
        }
      }
      for (const c of CATALOG) {
        if (c.isThemeParkLegacy || builtSet.has(c.id)) continue;
        if (!hud.sim.isCatalogItemUnlocked(c)) continue;
        const sc = hud.sim.getEffectiveItemStarCost(c);
        const need = sc - curStars;
        if (sc > 0 && need >= 1 && need <= 25 && (bestNeedStars === 0 || need < bestNeedStars)) {
          bestNeedStars = need;
        }
      }
    }
    // the level itself is on the HUD ring: the card counts wins toward the next level + optional urgent star goal
    const playSubLine = st.level >= MAX_LEVEL
      ? `Cấp ${MAX_LEVEL}`
      : bestNeedStars > 0
        ? `Cần +${bestNeedStars} Sao · ${winsProg.current}/${winsProg.required} màn`
        : `${winsProg.current}/${winsProg.required} màn`;
    const playSubSpoken = st.level >= MAX_LEVEL
      ? `Cấp ${MAX_LEVEL}`
      : bestNeedStars > 0
        ? `Cần thêm ${bestNeedStars} Sao · Lên cấp ${st.level + 1}: ${winsProg.current}/${winsProg.required} màn`
        : `Lên cấp ${st.level + 1}: ${winsProg.current}/${winsProg.required} màn`;
    const badgeCornerBonus = hud.root.querySelector('#badgeCornerPlayBonus') as HTMLElement | null;
    if (badgeCornerBonus) {
      badgeCornerBonus.textContent = playTagText;
      badgeCornerBonus.classList.remove('hidden');
    }
    const lblCornerStage = hud.root.querySelector('#lblCornerPlayStage') as HTMLElement | null;
    if (lblCornerStage) lblCornerStage.textContent = playStageLine;
    const lblCornerSub = hud.root.querySelector('#lblCornerPlaySub') as HTMLElement | null;
    if (lblCornerSub) lblCornerSub.textContent = playSubLine;
    const btnCornerPlay = hud.root.querySelector('#btnCornerPlayPuzzle') as HTMLButtonElement | null;
    if (btnCornerPlay) {
      const playSummary = `Chơi tiếp ${playTagText} — ${playStageLine} · ${playSubSpoken}`;
      btnCornerPlay.title = playSummary;
      btnCornerPlay.setAttribute('aria-label', playSummary);
    }
    hud.root.querySelectorAll<HTMLButtonElement>('[data-switch-minigame]').forEach((pill) => {
      const isCurrent = pill.dataset.switchMinigame === lastGame;
      pill.dataset.active = String(isCurrent); // HPVN 15/11: the game «Chơi» resumes; not a toggle, and no gold in the ☰ menu
      if (isCurrent) pill.setAttribute('aria-current', 'true');
      else pill.removeAttribute('aria-current');
    });

    const badgeBuildReady = hud.root.querySelector('#badgeBuildReadyCount') as HTMLElement | null;
    if (badgeBuildReady) {
      const builtSet = new Set(st.buildings.map((b) => b.itemId));
      const curStars = st.sandboxMode ? 999 : (st.match3?.stars ?? 0);
      const readyUnbuiltBlueprints = CATALOG.filter((c) => {
        if (c.isThemeParkLegacy) return false;
        const sc = hud.sim.getEffectiveItemStarCost(c);
        if (sc <= 0) return false;
        if (!hud.sim.isCatalogItemUnlocked(c)) return false;
        return !builtSet.has(c.id) && curStars >= sc;
      }).length;
      if (readyUnbuiltBlueprints > 0 && !hud.sim.isHeadmasterPreview) {
        badgeBuildReady.textContent = String(readyUnbuiltBlueprints);
        badgeBuildReady.classList.remove('hidden');
      } else {
        badgeBuildReady.classList.add('hidden');
      }
      // HPVN: the button's name carries the count its badge shows
      badgeBuildReady.closest('button')?.setAttribute('aria-label', readyUnbuiltBlueprints > 0 && !hud.sim.isHeadmasterPreview ? `Xây Dựng · ${readyUnbuiltBlueprints} bản vẽ đủ sao` : 'Xây Dựng');
    }
    const lblM3Lv = hud.root.querySelector('#lblMatch3Lv') as HTMLElement | null;
    if (lblM3Lv && st.match3) {
      lblM3Lv.textContent = m3Info.isMaxed
        ? `👑${m3Info.maxStage}`
        : `${m3Info.currentStage}/${m3Info.maxStage}`;
    }
    const lblArcadeTower = hud.root.querySelector('#lblArcadeTowerLv') as HTMLElement | null;
    if (lblArcadeTower) {
      const arcadeCleared = Math.max(0, towerProg.cleared - m3Info.clearedStages);
      const arcadeTotal = MAX_MINIGAME_STAGE * 5;
      lblArcadeTower.textContent =
        arcadeCleared >= arcadeTotal ? `👑${arcadeTotal}` : `${arcadeCleared}/${arcadeTotal}`;
    }
    (hud.root.querySelector('#lblSand') as HTMLElement).textContent = st.sandboxMode ? '∞' : String(st.timeSand);
    (hud.root.querySelector('#lblWonder') as HTMLElement).textContent = hud.sim.getParkWonderScore().toFixed(1);

    const story = hud.sim.getActiveStoryQuest();
    const readyOwlCount = hud.sim.getReadyOwlOrdersCount();
    const readyQuestCount =
      (story?.completed ? 1 : 0) +
      st.owlQuests.filter((q) => q.completed && !q.claimed).length +
      st.dailyQuests.filter((q) => q.completed && !q.claimed).length;
    const totalReady = readyOwlCount + readyQuestCount;
    const shownQuestCount = totalReady > 0 ? totalReady : barn.owlOrders.length;

    const badge = hud.root.querySelector('#badgeQuestCount') as HTMLElement;
    if (shownQuestCount > 0) {
      badge.textContent = String(shownQuestCount);
      badge.classList.toggle('is-ready-green', readyOwlCount > 0);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
    badge.closest('button')?.setAttribute('aria-label', totalReady > 0 ? `Đơn Hàng Cú & Nhiệm Vụ · ${totalReady} xong` : shownQuestCount > 0 ? `Đơn Hàng Cú & Nhiệm Vụ · ${shownQuestCount} đơn` : 'Đơn Hàng Cú & Nhiệm Vụ');

    // Workshop, Market Fair & Cargo Train ready badge
    const fairForBadge = hud.sim.ensureMarketFairState();
    const dealReadyCount = fairForBadge.deals.filter(
      (d) => !d.claimed && (st.sandboxMode || hud.sim.getFarmItemCount(d.inputItemId) >= d.inputQty)
    ).length;
    const crateReadyCount =
      st.supply.cargoCrates.filter((c) => hud.sim.getCargoCrateStockInfo(c).canFulfill).length +
      dealReadyCount;
    const wsBadge = hud.root.querySelector('#badgeWorkshopCount') as HTMLElement | null;
    if (wsBadge) {
      if (crateReadyCount > 0) {
        wsBadge.textContent = String(crateReadyCount);
        wsBadge.classList.remove('hidden');
      } else {
        wsBadge.classList.add('hidden');
      }
    }

    // Achievements + 7-Day Login reward ready badge
    // HPVN: no «cup reward ready» part: the server sends each «Cúp Đợt» reward on its own (src/hpvn/inbox.ts)
    const albumReadyCount = hud.sim.getClaimableRetentionCount().total;
    const cardBadge = hud.root.querySelector('#badgeCardCount') as HTMLElement | null;
    if (cardBadge) {
      if (albumReadyCount > 0) {
        cardBadge.textContent = String(albumReadyCount);
        cardBadge.classList.remove('hidden');
      } else {
        cardBadge.classList.add('hidden');
      }
    }

    hud.refreshSuitcaseBadge();
    const suitcaseBadgeEl = hud.root.querySelector('#badgeSuitcaseCount') as HTMLElement | null;
    const suitcaseReadyCount =
      suitcaseBadgeEl && !suitcaseBadgeEl.classList.contains('hidden')
        ? Math.max(0, Number.parseInt(suitcaseBadgeEl.textContent || '0', 10) || 0)
        : 0;
    const feastClaimableCount = hud.sim.getClaimableHarvestFeastCount();

    const manageDot = hud.root.querySelector('#badgeManageMenuDot') as HTMLElement | null;
    if (manageDot) {
      const manageCount =
        crateReadyCount + albumReadyCount + feastClaimableCount + suitcaseReadyCount;
      if (manageCount > 0) {
        manageDot.textContent = String(manageCount);
        manageDot.classList.remove('hidden');
      } else {
        manageDot.classList.add('hidden');
      }
    }

    headerSyncProgressiveHudVisibility(hud);

    // Sync Heatmap button label & active highlight
    const btnHm = hud.root.querySelector('#btnCycleHeatmap') as HTMLButtonElement | null;
    if (btnHm) {
      const hmEntry = HEATMAP_CYCLE.find((h) => h.mode === hud.sim.heatmapMode) ?? HEATMAP_CYCLE[0];
      const hmActive = hud.sim.heatmapMode !== 'none';
      btnHm.textContent = hmEntry.label;
      btnHm.dataset.active = String(hmActive);
      btnHm.setAttribute('aria-pressed', String(hmActive));
    }

    headerRefreshHeaderClock(hud);
}

export function headerSyncProgressiveHudVisibility(hud: GameHUD): void {
    const st = hud.sim.state;
    const isEarlyOnboarding = st.level < 3 && !st.sandboxMode && !hud.sim.isHeadmasterPreview;
    const ownsHabitat = st.buildings.some((b) => Boolean(getCatalogItem(b.itemId)?.isCreatureHabitat));
    const heartsFull = (st.match3?.hearts ?? MAX_MATCH3_HEARTS) >= MAX_MATCH3_HEARTS && !st.sandboxMode;
    const hasActiveBuilds = hud.sim.getActiveConstructions(Date.now()).length > 0;

    // Zen Sky HUD: hide full-heart badge inside manage strip when full
    hud.root.querySelector('#btnHudHeartChip')?.classList.toggle('hidden', heartsFull);
    void hasActiveBuilds;
    hud.root.querySelector('#btnOpenPuzzleArcade')?.classList.remove('hidden');

    hud.root
      .querySelector('#btnOpenSuitcase')
      ?.classList.toggle('hidden', isEarlyOnboarding && !ownsHabitat);

    // Auto-expand radar when entering Lv100 preview if still untouched
    if (hud.sim.isHeadmasterPreview && hud.minimapCollapsed) {
      hud.minimapCollapsed = false;
      hud.minimapHudVisible = true;
      hud.minimapCanvas?.classList.remove('hidden');
      const btnMini = hud.root.querySelector('#btnToggleMinimap');
      if (btnMini) {
        btnMini.textContent = '–';
        btnMini.setAttribute('aria-expanded', 'true');
      }
    }
}

export function headerRefreshQuestTracker(hud: GameHUD): void {
    const body = hud.root.querySelector('#questTrackerBody') as HTMLElement;
    if (!body) return;

    const st = hud.sim.state;
    const reqTrial = hud.sim.getRequiredLevelTrial();
    const trialDone = hud.sim.isCurrentLevelTrialPassed();
    const waitingTrial = hud.sim.isWaitingOnLevelTrial();
    const story = hud.sim.getActiveStoryQuest();
    const owls = st.owlQuests.slice(0, 2);

    let html = '';
    if (reqTrial && !st.sandboxMode && !hud.sim.isHeadmasterPreview) {
      const wp = hud.sim.getWinsProgressForCurrentLevel();
      const dInfo = hud.sim.getDisciplineStageInfo(reqTrial.kind);
      html += `
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:12px;font-weight:700;">
            <span>🔥 ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)} (${dInfo.currentStage}/${dInfo.maxStage}) • ${wp.current}/${wp.required}</span>
            <button type="button" data-open-trial="${reqTrial.kind}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">
              ▶️ Chơi
            </button>
          </div>
        </div>
      `;
    }
    if (story) {
      const pct = Math.min(100, Math.round((story.progress / Math.max(1, story.targetAmount)) * 100));
      const autoAct = hud.sim.getStoryAutoActionPreview();
      html += `
        <div class="quest-card-mini" style="border-color:var(--brand-color);background:var(--quest-accent-bg);">
          <div style="font-size:12px;font-weight:700;color:var(--ink);">${escapeHtml(story.giverEmoji)} ${escapeHtml(story.title)}</div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;flex-wrap:wrap;font-size:12px;font-weight:700;">
            <span>${Math.min(story.progress, story.targetAmount)}/${story.targetAmount}</span>
            ${
              story.completed
                ? `<button type="button" data-claim="${escapeHtml(story.id)}" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;">🎁 +${story.rewardSickle} Sickle</button>`
                : `<button type="button" data-star-story="1" class="brass-btn gold-cta" style="padding:3px 8px;font-size:12px;" title="${escapeHtml(autoAct.longLabel)}">${escapeHtml(autoAct.shortLabel)}</button>`
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
                : `<span>+${q.rewardSickle}🪙 +${q.rewardXp}⭐</span>`
            }
          </div>
        </div>
      `;
    }

    body.innerHTML = html;
    body.querySelectorAll<HTMLButtonElement>('[data-claim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.sim.claimQuest(btn.dataset.claim!);
      });
    });
    body.querySelectorAll<HTMLButtonElement>('[data-open-trial]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.openTrialMinigame(btn.dataset.openTrial as MinigameTrialKind | undefined);
      });
    });
    body.querySelectorAll<HTMLButtonElement>('[data-star-story]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.completeStoryStepWithStar();
        if (res.ok) {
          if (typeof res.placedGx === 'number' && typeof res.placedGy === 'number') {
            centerCameraOnGrid(hud.cam, res.placedGx, res.placedGy);
          }
          return;
        }
        headerShowToast(
          hud,
          res.msg,
          res.reason === 'missing_gold' ? '🪙' : res.reason === 'locked_level' ? '🔒' : '🌟'
        );
        if (res.reason === 'open_match3') {
          hud.openTrialMinigame();
        }
      });
    });
}

export function headerRefreshDock(hud: GameHUD): void {
    const syncToggle = (el: HTMLElement | null, active: boolean) => {
      if (!el) return;
      el.setAttribute('data-active', String(active));
      el.setAttribute('aria-pressed', String(active));
    };

    const isChristmasActive =
      hud.activeCategory === 'decor' && Boolean(hud.christmasTabActive);
    hud.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      const cat = btn.dataset.cat;
      const isCatActive =
        cat === hud.activeCategory && !(cat === 'decor' && isChristmasActive);
      syncToggle(btn, isCatActive);
    });
    hud.root.querySelectorAll<HTMLButtonElement>('[data-decor-event]').forEach((btn) => {
      syncToggle(btn, isChristmasActive);
    });
    syncToggle(hud.root.querySelector('#btnMoveTool') as HTMLElement | null, hud.moveModeActive);
    syncToggle(hud.root.querySelector('#btnBulldoze') as HTMLElement | null, hud.bulldozerActive);
    const btnRotate = hud.root.querySelector('#btnRotate') as HTMLButtonElement | null;
    if (btnRotate) {
      const rotDeg = (hud.rotation ?? 0) * 90;
      btnRotate.textContent = rotDeg > 0 ? `🔄 Xoay ${rotDeg}°` : '🔄 Xoay';
    }
    const btnMenuRotCam = hud.root.querySelector('#btnMenuRotateCam') as HTMLButtonElement | null;
    if (btnMenuRotCam) {
      const vr = hud.cam.viewRot ?? 0;
      btnMenuRotCam.textContent = COMPASS_LABELS_VI[vr];
    }
    syncToggle(
      hud.root.querySelector('#btnMenuCutaway') as HTMLElement | null,
      Boolean(hud.sim.state.settings.cutawayMode)
    );
    syncToggle(
      hud.root.querySelector('#btnMenuGrid') as HTMLElement | null,
      hud.sim.state.settings.showGrid
    );
    const undoBtn = hud.root.querySelector('#btnBuildUndo') as HTMLButtonElement | null;
    const redoBtn = hud.root.querySelector('#btnBuildRedo') as HTMLButtonElement | null;
    const undoDisabled =
      hud.sim.isVisitingNeighbor ||
      (typeof hud.sim.canUndoBuild === 'function' ? !hud.sim.canUndoBuild() : true);
    const redoDisabled =
      hud.sim.isVisitingNeighbor ||
      (typeof hud.sim.canRedoBuild === 'function' ? !hud.sim.canRedoBuild() : true);
    if (undoBtn) {
      undoBtn.setAttribute('aria-disabled', String(undoDisabled));
    }
    if (redoBtn) {
      redoBtn.setAttribute('aria-disabled', String(redoDisabled));
    }
    const accioBtn = hud.root.querySelector('#btnAccioAll') as HTMLButtonElement | null;
    if (accioBtn) accioBtn.disabled = hud.sim.isVisitingNeighbor;

    const isSheetActive =
      hud.buildSheetOpen || Boolean(hud.activeCategory) || hud.mapToolsExpanded;
    const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !isSheetActive);
    }
    const isBuildModeActive =
      isSheetActive ||
      Boolean(hud.selectedCatalogItem) ||
      hud.moveModeActive ||
      hud.bulldozerActive ||
      hud.pincerActive;
    const dockWrap = hud.root.querySelector('#bottomDockWrap') as HTMLElement | null;
    dockWrap?.classList.toggle('ts-dock-open', isSheetActive);
    headerSyncHudFocusVisibility(hud);
    syncToggle(
      hud.root.querySelector('#btnToggleBuildDock') as HTMLElement | null,
      isBuildModeActive
    );

    const drawer = hud.root.querySelector('#buildDrawer') as HTMLElement;
    const swipeBar = hud.root.querySelector('#buildDrawerSwipeBar') as HTMLElement | null;
    const decorFilterBar = hud.root.querySelector('#decorCollectionFilterBar') as HTMLElement | null;
    const minimap = hud.root.querySelector('#minimapWrap') as HTMLElement;
    if (!hud.activeCategory || !BUILD_HUD_CATEGORIES.includes(hud.activeCategory)) {
      hud.activeCategory = null;
      hud.drawerEdgeObserver?.disconnect();
      hud.drawerEdgeObserver = null;
      drawer.classList.add('hidden');
      swipeBar?.classList.add('hidden');
      decorFilterBar?.classList.add('hidden');
      minimap.classList.toggle('hidden', hud.photoModeActive || !hud.minimapHudVisible);
      return;
    }
    drawer.classList.remove('hidden');
    if (drawer.dataset) {
      drawer.dataset.christmasDrawer = String(isChristmasActive);
    }
    minimap.classList.add('hidden'); // Give full room while build drawer is open!

    const recentIds = hud.recentDecorIds ?? [];
    const recentOrder = new Map(recentIds.map((id, idx) => [id, idx]));

    const placedCountByItemId = new Map<string, number>();
    for (const b of hud.sim.state.buildings) {
      placedCountByItemId.set(b.itemId, (placedCountByItemId.get(b.itemId) ?? 0) + 1);
    }
    let zooFenceCount = 0;
    for (const ov of Object.values(hud.sim.state.tileOverrides)) {
      if (ov?.zooFence) zooFenceCount++;
    }
    if (zooFenceCount > 0) {
      placedCountByItemId.set('burrow_stone_rune_fence', zooFenceCount);
    }

    const stashedWinterCount = CATALOG.reduce((acc, it) => {
      if (it.category === 'decor' && !it.isThemeParkLegacy && isWinterChristmasBuildItem(it)) {
        return acc + worldGetStashedDecorCount(hud.sim, it);
      }
      return acc;
    }, 0);
    const stashedClassicCount = CATALOG.reduce((acc, it) => {
      if (it.category === 'decor' && !it.isThemeParkLegacy && !isWinterChristmasBuildItem(it)) {
        return acc + worldGetStashedDecorCount(hud.sim, it);
      }
      return acc;
    }, 0);

    if (decorFilterBar) {
      if (hud.activeCategory === 'decor' && isChristmasActive) {
        decorFilterBar.classList.remove('hidden');
        const recentWinterCount = recentIds.filter((id) => {
          const it = getCatalogItem(id);
          return Boolean(it && isWinterChristmasBuildItem(it));
        }).length;
        const totalWinterCount = CATALOG.filter(
          (it) => it.category === 'decor' && !it.isThemeParkLegacy && isWinterChristmasBuildItem(it)
        ).length;
        const activeCf = hud.activeChristmasFilter ?? 'all';
        const christmasChips: Array<{
          id: 'all' | 'recent' | 'stashed' | YuleCollectionId;
          label: string;
        }> = [
          { id: 'all', label: `✨ Tất cả (${totalWinterCount})` },
          {
            id: 'recent',
            label: recentWinterCount > 0 ? `Gần đây (${recentWinterCount})` : 'Gần đây',
          },
          {
            id: 'stashed',
            label: stashedWinterCount > 0 ? `📦 Trong kho (${stashedWinterCount})` : '📦 Trong kho',
          },
          { id: 'vietnam_noel', label: '🏮 Noel Việt Nam' },
          { id: 'yule_trees', label: '🌲 Cây tuyết' },
          { id: 'yule_flowers', label: '🌺 Hoa đông' },
          { id: 'modular', label: '❄️ Hàng rào' },
          { id: 'landmarks', label: '🏰 Địa danh' },
          { id: 'hogwarts_crests', label: '🦁 4 Nhà' },
          { id: 'burrow', label: 'Hang Sóc' },
          { id: 'hogwarts', label: '🕯️ Dạ vũ' },
          { id: 'hogsmeade', label: '🍺 Hogsmeade' },
          { id: 'express', label: '🚂 Cú & Tàu' },
          { id: 'creatures', label: '🦌 Sinh vật' },
          { id: 'book_lore', label: '📖 Điển tích' },
        ];
        decorFilterBar.innerHTML = christmasChips
          .map((ch) => {
            const isAct = activeCf === ch.id;
            return `<button type="button" role="tab" aria-selected="${isAct}" data-decor-filter="${ch.id}" class="decor-filter-chip ${isAct ? 'active is-active' : ''}">${ch.label}</button>`;
          })
          .join('');
        decorFilterBar.querySelectorAll<HTMLButtonElement>('[data-decor-filter]').forEach((chip) => {
          chip.addEventListener('click', () => {
            hud.activeChristmasFilter = (chip.dataset.decorFilter ?? 'all') as typeof hud.activeChristmasFilter;
            drawer.scrollLeft = 0;
            headerRefreshDock(hud);
          });
        });
      } else if (hud.activeCategory === 'decor') {
        decorFilterBar.classList.remove('hidden');
        const recentClassicCount = recentIds.filter((id) => {
          const it = getCatalogItem(id);
          return Boolean(
            it && it.category === 'decor' && it.id !== 'farmland_plot' && !isWinterChristmasBuildItem(it)
          );
        }).length;
        const validClassicFilters: ReadonlyArray<ClassicDecorSubFilter> = [
          'all',
          'recent',
          'stashed',
          'nature',
          'fences',
          'lights',
          'landmarks',
        ];
        const activeDf: ClassicDecorSubFilter = validClassicFilters.includes(
          hud.activeDecorFilter as ClassicDecorSubFilter
        )
          ? (hud.activeDecorFilter as ClassicDecorSubFilter)
          : 'all';
        const classicChips: Array<{ id: ClassicDecorSubFilter; label: string }> = [
          { id: 'all', label: '✨ Tất cả' },
          {
            id: 'recent',
            label: recentClassicCount > 0 ? `Gần đây (${recentClassicCount})` : 'Gần đây',
          },
          {
            id: 'stashed',
            label: stashedClassicCount > 0 ? `📦 Trong kho (${stashedClassicCount})` : '📦 Trong kho',
          },
          { id: 'nature', label: '🌿 Cây & Hoa' },
          { id: 'fences', label: '🚧 Rào & Cổng' },
          { id: 'lights', label: '🕯️ Đèn & Ghế' },
          { id: 'landmarks', label: '⛲ Tiểu cảnh' },
        ];
        decorFilterBar.innerHTML = classicChips
          .map((ch) => {
            const isAct = activeDf === ch.id;
            return `<button type="button" role="tab" aria-selected="${isAct}" data-decor-filter="${ch.id}" class="decor-filter-chip ${isAct ? 'active is-active' : ''}">${ch.label}</button>`;
          })
          .join('');
        decorFilterBar.querySelectorAll<HTMLButtonElement>('[data-decor-filter]').forEach((chip) => {
          chip.addEventListener('click', () => {
            hud.activeDecorFilter = (chip.dataset.decorFilter ?? 'all') as typeof hud.activeDecorFilter;
            drawer.scrollLeft = 0;
            headerRefreshDock(hud);
          });
        });
      } else {
        decorFilterBar.classList.add('hidden');
      }
    }

    const isRecentSubFilter =
      hud.activeCategory === 'decor' &&
      (isChristmasActive
        ? (hud.activeChristmasFilter ?? 'all') === 'recent'
        : hud.activeDecorFilter === 'recent');
    const isStashedSubFilter =
      hud.activeCategory === 'decor' &&
      (isChristmasActive
        ? (hud.activeChristmasFilter ?? 'all') === 'stashed'
        : hud.activeDecorFilter === 'stashed');

    const PROD_PLOT_PRIORITY: ReadonlyArray<string> = [
      'farmland_plot',
      'burrow_animal_pasture',
      'burrow_flower_garden',
      'burrow_chicken_coop',
      'burrow_pumpkin_gnomes',
      'burrow_apple_orchard',
    ];

    const items = CATALOG.filter((c) => {
      if (c.category === 'terrain' || c.isThemeParkLegacy) {
        return false;
      }
      if (hud.activeCategory === 'creature') {
        return c.category === 'creature' || PROD_PLOT_PRIORITY.includes(c.id);
      }
      if (c.category !== hud.activeCategory) {
        return false;
      }
      if (hud.activeCategory === 'decor') {
        const isWinter = isWinterChristmasBuildItem(c);
        if (isChristmasActive) {
          if (!isWinter) return false;
          const cf = hud.activeChristmasFilter ?? 'all';
          if (cf === 'recent') return recentOrder.has(c.id);
          if (cf === 'stashed') return worldGetStashedDecorCount(hud.sim, c) > 0;
          if (cf === 'all') return true;
          if (c.id === 'snowy_pines') {
            return cf === 'yule_trees' || cf === 'hogsmeade';
          }
          return c.yuleCollection === cf;
        }
        if (isWinter || c.id === 'farmland_plot') return false;
        const df = hud.activeDecorFilter;
        if (df === 'recent') return recentOrder.has(c.id);
        if (df === 'stashed') return worldGetStashedDecorCount(hud.sim, c) > 0;
        if (
          df === 'nature' ||
          df === 'fences' ||
          df === 'lights' ||
          df === 'landmarks'
        ) {
          return classifyClassicDecorSubFilter(c) === df;
        }
        return true;
      }
      return true;
    });
    if (isRecentSubFilter) {
      items.sort((a, b) => (recentOrder.get(a.id) ?? 999) - (recentOrder.get(b.id) ?? 999));
    } else if (hud.activeCategory === 'creature') {
      items.sort((a, b) => {
        const pa = PROD_PLOT_PRIORITY.indexOf(a.id);
        const pb = PROD_PLOT_PRIORITY.indexOf(b.id);
        if (pa !== -1 || pb !== -1) {
          return (pa === -1 ? 999 : pa) - (pb === -1 ? 999 : pb);
        }
        return a.unlockLevel - b.unlockLevel;
      });
    }
    const sandbox = hud.sim.state.sandboxMode;
    const curStars = hud.sim.state.match3?.stars ?? 0;
    const curGold = hud.sim.state.galleons;

    if (items.length === 0 && (isRecentSubFilter || isStashedSubFilter)) {
      drawer.innerHTML = `
        <div class="catalog-empty-hint">
          ${
            isStashedSubFilter
              ? 'Kho Trang Trí hiện đang trống — bấm vào món trang trí ngoài sân rồi chọn <strong>Cất</strong> để lưu giữ nhé!'
              : 'Chưa có vật phẩm vừa đặt gần đây — hãy chọn một món trong <strong>✨ Tất cả</strong> nhé!'
          }
        </div>
      `;
      headerSyncBuildDrawerScrollAffordance(hud, drawer);
      return;
    }

    drawer.innerHTML = items
      .map((item) => {
        const stashedQty = worldGetStashedDecorCount(hud.sim, item);
        const locked = stashedQty === 0 && !hud.sim.isCatalogItemUnlocked(item);
        const selected = hud.selectedCatalogItem?.id === item.id;
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
        const cardImgSrc = getCatalogCardImageSrc(item);
        const imgTag = cardImgSrc
          ? `<img src="${cardImgSrc}" alt="${escapeHtml(item.name)}" class="catalog-card-img" />`
          : `<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${fallbackEmoji}</div>`;

        const starCost = hud.sim.getEffectiveItemStarCost(item);
        const isMajorStarBlueprint =
          starCost > 0 && !item.connectableGroup && item.category !== 'decor';
        const alreadyBuilt =
          isMajorStarBlueprint && hud.sim.state.buildings.some((b) => b.itemId === item.id);
        const shortStars = stashedQty === 0 && !sandbox && !locked && starCost > 0 && curStars < starCost;
        const shortGold = stashedQty === 0 && !sandbox && !locked && starCost === 0 && curGold < item.cost;
        const isShortResource = stashedQty === 0 && ((shortStars && !alreadyBuilt) || shortGold);
        const realBuildSec = computeRealTimeBuildSeconds(item);
        const buildSuffix =
          realBuildSec > 0 ? ` • ⏱️ ${formatDurationCompactVi(realBuildSec)}` : '';
        const basePriceTxt =
          starCost > 0
            ? `🌟 ${starCost}`
            : `🪙 ${item.cost.toLocaleString('vi-VN')} Sickle`;
        const subInfo =
          stashedQty > 0
            ? `📦 Kho: ${stashedQty} • 0 Sickle`
            : locked
              ? `🔒 Cấp ${item.unlockLevel} • ${basePriceTxt}${buildSuffix}`
              : alreadyBuilt
                ? shortStars
                  ? `✅ Đã xây • 🌟 ${curStars}/${starCost}`
                  : `✅ Đã xây • 🌟 ${starCost}`
                : shortStars
                  ? `🌟 ${curStars}/${starCost}${buildSuffix}`
                  : starCost > 0
                    ? `🌟 ${starCost}${buildSuffix}`
                    : shortGold
                      ? `🪙 ${curGold.toLocaleString('vi-VN')}/${item.cost.toLocaleString('vi-VN')} Sickle${buildSuffix}`
                      : `🪙 ${item.cost.toLocaleString('vi-VN')} Sickle${buildSuffix}`;

        const isWinterCard = isChristmasActive && isWinterChristmasBuildItem(item);
        const placedCount = placedCountByItemId.get(item.id) ?? 0;
        const placedBadgeHtml =
          placedCount > 0 && (!alreadyBuilt || placedCount > 1)
            ? `<span class="catalog-card-placed-badge">Đã đặt ${placedCount}</span>`
            : '';

        return `
          <button
            type="button"
            class="catalog-card ${isWinterCard ? 'yule-festive-card' : ''} ${locked ? 'locked' : ''} ${isShortResource ? 'short-resource' : ''}"
            data-item-id="${item.id}"
            data-selected="${selected}"
            aria-pressed="${selected}"
            ${locked || isShortResource ? 'aria-disabled="true"' : ''}
          >
            ${placedBadgeHtml}
            ${isWinterCard ? '<span class="yule-card-twinkle" aria-hidden="true">❄</span>' : ''}
            ${imgTag}
            <div class="catalog-card-title">${escapeHtml(item.name)}</div>
            <div class="catalog-card-sub ${isShortResource ? 'is-short' : ''}">${subInfo}</div>
          </button>
        `;
      })
      .join('');

    drawer.querySelectorAll<HTMLElement>('[data-item-id]').forEach((card) => {
      card.addEventListener('click', () => {
        const item = getCatalogItem(card.dataset.itemId!);
        if (!item) return;
        const needStars = hud.sim.getEffectiveItemStarCost(item);
        const haveStars = hud.sim.state.match3?.stars ?? 0;
        const hasInStash = worldGetStashedDecorCount(hud.sim, item) > 0;
        if (!hasInStash && !hud.sim.isCatalogItemUnlocked(item)) {
          const wp = hud.sim.getWinsProgressForCurrentLevel();
          let winsNeeded = Math.max(1, wp.required - wp.current);
          for (let l = hud.sim.state.level + 1; l < item.unlockLevel; l++) {
            winsNeeded += getWinsRequiredForNextLevel(l);
          }
          const starUnlockHint =
            needStars > 0 ? ` hoặc ${needStars} Sao (${haveStars}/${needStars})` : '';
          headerShowToast(
            hud,
            `Mở ở Cấp ${item.unlockLevel}${starUnlockHint} · cần thêm ${winsNeeded.toLocaleString('vi-VN')} màn.`,
            '🔒'
          );
          return;
        }
        if (
          !hasInStash &&
          !hud.sim.state.sandboxMode &&
          needStars > 0 &&
          haveStars < needStars
        ) {
          const existingBuilt =
            !item.connectableGroup && item.category !== 'decor'
              ? hud.sim.state.buildings.find((b) => b.itemId === item.id)
              : undefined;
          if (existingBuilt) {
            clearBuildToolModes(hud);
            hud.inspectSelection = { kind: 'building', uid: existingBuilt.uid };
            centerCameraOnGrid(
              hud.cam,
              existingBuilt.gx + item.width * 0.5,
              existingBuilt.gy + item.height * 0.5
            );
            hud.onCameraJump?.();
            headerCollapseBuildDock(hud);
            headerRefreshAll(hud);
            headerShowToast(
              hud,
              `Đã chọn "${item.name}" · bấm "✋ Dời" để đổi vị trí.`,
              '✋'
            );
            return;
          }
          const missing = needStars - haveStars;
          headerShowToast(
            hud,
            `Thiếu ${missing} Sao (${haveStars}/${needStars}).`,
            '🌟'
          );
          return;
        }
        if (
          !hasInStash &&
          !hud.sim.state.sandboxMode &&
          needStars === 0 &&
          hud.sim.state.galleons < item.cost
        ) {
          const missingGold = item.cost - hud.sim.state.galleons;
          headerShowToast(
            hud,
            `🪙 Thiếu ${missingGold.toLocaleString('vi-VN')} Sickle (hiện có ${hud.sim.state.galleons.toLocaleString('vi-VN')}/${item.cost.toLocaleString('vi-VN')} Sickle) để dựng "${item.name}"!`,
            '🪙'
          );
          return;
        }
        clearBuildToolModes(hud);
        hud.selectedCatalogItem = item;
        hud.inspectSelection = null;
        headerCollapseBuildDock(hud);
        headerRefreshAll(hud);
        hud.onSelectCatalogItem?.(item);
        const isBrushItem = isDragPaintableCatalogItem(item);
        const isCoarseTouch =
          typeof window !== 'undefined' &&
          Boolean(window.matchMedia?.('(pointer: coarse)')?.matches);
        headerShowToast(
          hud,
          isBrushItem
            ? `🏗️ Đã chọn "${item.name}" — Chạm hoặc kéo liên tục trên bản đồ để đặt!`
            : isCoarseTouch
              ? `🏗️ Đã chọn "${item.name}" — Kéo/chạm ô chỉnh vị trí rồi bấm ✓ Đặt (hoặc bấm ⚡ Đặt Ngay)!`
              : `🏗️ Đã chọn "${item.name}" — Chạm một lần vào ô xanh để đặt ngay (hoặc bấm ⚡ Đặt Ngay)!`,
          '🔨'
        );
      });
    });

    headerSyncBuildDrawerScrollAffordance(hud, drawer);
}

export function headerRenderStaffDrawer(hud: GameHUD, drawer: HTMLElement): void {
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
        desc: 'Đuổi bắt thú sổng chuồng và thu hồi vàng Sickle về két.',
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

    const unlockedSet = new Set(hud.sim.state.unlockedZones);
    const zoneOptions = (selectedZone: ZoneId | 'all') =>
      `<option value="all" ${selectedZone === 'all' ? 'selected' : ''}>🗺️ Toàn công viên</option>` +
      ZONES.filter((z) => hud.sim.state.sandboxMode || unlockedSet.has(z.id))
        .map(
          (z) =>
            `<option value="${z.id}" ${selectedZone === z.id ? 'selected' : ''}>📍 ${z.name}</option>`
        )
        .join('');

    const roleCards = roles
      .map((r) => {
        const count = hud.sim.state.staffHired[r.key];
        const maxed = count >= MAX_STAFF_PER_ROLE;
        const cost = r.baseCost * (1 + count);
        return `
          <div class="catalog-card catalog-card-static" style="flex:0 0 156px;">
            <div style="font-size:18px;">${r.icon} <span style="font-size:12px;font-weight:700;">${count}/${MAX_STAFF_PER_ROLE}</span></div>
            <div style="font-size:13px;font-weight:700;">${r.name}</div>
            <button
              type="button"
              data-hire="${r.key}"
              class="brass-btn ${maxed ? '' : 'gold-cta'}"
              ${maxed ? 'disabled' : ''}
              style="width:100%;padding:5px 8px;font-size:12px;"
            >
              ${maxed ? `✓ ${MAX_STAFF_PER_ROLE}/${MAX_STAFF_PER_ROLE}` : `+ 🪙 ${cost}`}
            </button>
            ${
              count > 0
                ? `<button type="button" data-dismiss="${r.key}" class="brass-btn" style="width:100%;margin-top:4px;padding:4px 8px;font-size:12px;">Cho nghỉ</button>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    const activeStaffCards = hud.sim.staff
      .map((s) => {
        const pZone = hud.sim.state.staffPatrolZones?.[s.id] ?? s.patrolZoneId ?? 'all';
        return `
          <div class="catalog-card catalog-card-static" style="flex:0 0 170px;background:rgba(254,243,199,0.92);">
            <div style="font-size:12px;font-weight:700;color:#7c2d12;">🧙 <span class="hs-raw">${escapeHtml(s.name)}</span></div>
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
        if (hud.sim.hireStaff(role)) {
          headerCollapseBuildDock(hud);
          headerRefreshAll(hud);
          headerShowToast(hud, 'Đã đón nhân sự mới gia nhập công viên!', '🧙');
        }
      });
    });

    drawer.querySelectorAll<HTMLButtonElement>('[data-dismiss]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.dismiss as keyof ParkSimulation['state']['staffHired'];
        if (hud.sim.dismissStaff(role)) {
          headerRefreshAll(hud);
          headerRenderStaffDrawer(hud, drawer);
          headerShowToast(hud, 'Đã cho phụ tá tạm nghỉ ngơi!', '🧙');
        }
      });
    });

    drawer.querySelectorAll<HTMLSelectElement>('[data-patrol-staff]').forEach((sel) => {
      sel.addEventListener('change', () => {
        const sid = sel.dataset.patrolStaff!;
        hud.sim.setStaffPatrolZone(sid, sel.value as ZoneId | 'all');
        headerShowToast(hud, 'Đã cập nhật khu vực tuần tra cho nhân sự!', '📍');
      });
    });

    drawer.querySelectorAll<HTMLButtonElement>('[data-pick-staff]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const st = hud.sim.staff.find((x) => x.id === btn.dataset.pickStaff);
        if (!st) return;
        clearBuildToolModes(hud);
        hud.pincerActive = true;
        hud.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        headerCollapseBuildDock(hud);
        headerRefreshAll(hud);
        headerShowToast(hud, `Đang gắp ${st.name} — Chạm vào ô bất kỳ trên bản đồ để thả xuống!`, '🤏');
      });
    });
}

const BUILD_CATEGORY_TITLES_VI: Partial<Record<BuildingCategory, string>> = {
  path: '🛣️ Đường Đá & Lối Dạo',
  shop: '🏠 Nhà & Xưởng Chế Biến',
  creature: '🌾 Sản Xuất, Đồng Cỏ & Thú',
  decor: '🌳 Vườn Hoa & Trang Trí',
  staff: '🧙 Phụ Tá Điền Trang',
};

export function headerSyncBuildDrawerScrollAffordance(hud: GameHUD, drawer: HTMLElement): void {
    const swipeBar = hud.root.querySelector('#buildDrawerSwipeBar') as HTMLElement | null;
    const catLbl = hud.root.querySelector('#buildDrawerCatLabel') as HTMLElement | null;
    const prevBtn = hud.root.querySelector('#btnDrawerScrollPrev') as HTMLButtonElement | null;
    const nextBtn = hud.root.querySelector('#btnDrawerScrollNext') as HTMLButtonElement | null;
    const hintPill = hud.root.querySelector('#buildDrawerSwipeHint') as HTMLElement | null;

    hud.drawerEdgeObserver?.disconnect();
    hud.drawerEdgeObserver = null;

    const cards = Array.from(drawer.querySelectorAll<HTMLElement>('.catalog-card'));
    if (!swipeBar || cards.length === 0 || !hud.activeCategory) {
      swipeBar?.classList.add('hidden');
      return;
    }

    if (catLbl) {
      const titleVi =
        hud.activeCategory === 'decor' && hud.christmasTabActive
          ? '🎄 Giáng Sinh & Mùa Đông'
          : (BUILD_CATEGORY_TITLES_VI[hud.activeCategory] ?? '🏗️ Danh Mục Xây Dựng');
      const starsTxt = hud.sim.state.sandboxMode
        ? '∞'
        : String(hud.sim.state.match3?.stars ?? 0);
      const goldTxt = hud.sim.state.sandboxMode
        ? '∞'
        : `${hud.sim.state.galleons.toLocaleString('vi-VN')} Sickle`;
      catLbl.textContent = `${titleVi} (${cards.length}) • 🌟 ${starsTxt} • 🪙 ${goldTxt}`;
    }
    swipeBar.classList.remove('hidden');

    const selectedCard = drawer.querySelector<HTMLElement>('.catalog-card[data-selected="true"]');
    if (selectedCard && typeof selectedCard.scrollIntoView === 'function') {
      selectedCard.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        container: 'nearest',
      } as ScrollIntoViewOptions);
    }

    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];
    let firstVisible = true;
    let lastVisible = cards.length <= 2;

    const applyEdgeState = () => {
      const hasOverflow = !firstVisible || !lastVisible || drawer.scrollWidth > drawer.clientWidth + 6;
      if (prevBtn) {
        prevBtn.disabled = firstVisible;
        prevBtn.classList.toggle('hidden', !hasOverflow);
      }
      if (nextBtn) {
        nextBtn.disabled = lastVisible;
        nextBtn.classList.toggle('hidden', !hasOverflow);
      }
      if (hintPill) {
        hintPill.classList.toggle('hidden', !hasOverflow);
      }
      drawer.dataset.scrollStart = String(!firstVisible);
      drawer.dataset.scrollEnd = String(!lastVisible);
    };

    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === firstCard) {
              firstVisible = entry.intersectionRatio >= 1;
            }
            if (entry.target === lastCard) {
              lastVisible = entry.intersectionRatio >= 1;
            }
          }
          applyEdgeState();
        },
        { root: drawer, threshold: 1, rootMargin: '2px' }
      );
      obs.observe(firstCard);
      if (lastCard !== firstCard) {
        obs.observe(lastCard);
      }
      hud.drawerEdgeObserver = obs;
    }
    applyEdgeState();
}

export function headerSyncContextualMapToolsBar(hud: GameHUD): void {
    const isSheetActive =
      hud.buildSheetOpen || Boolean(hud.activeCategory) || hud.mapToolsExpanded;
    const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !isSheetActive);
    }
}
