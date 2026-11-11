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

export function headerTogglePhotoMode(hud: GameHUD, force?: boolean): void {
    hud.photoModeActive = typeof force === 'boolean' ? force : !hud.photoModeActive;
    const isVisiting = hud.sim.isVisitingNeighbor;
    (hud.root.querySelector('#hudFrameTop') as HTMLElement).classList.toggle('hidden', hud.photoModeActive);
    (hud.root.querySelector('#bottomDockWrap') as HTMLElement).classList.toggle(
      'hidden',
      hud.photoModeActive || isVisiting
    );
    hud.root
      .querySelector('#tsCornerLeft')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
    hud.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
    hud.root
      .querySelector('#visitorDockBar')
      ?.classList.toggle('hidden', hud.photoModeActive || !isVisiting);
    (hud.root.querySelector('#minimapWrap') as HTMLElement).classList.toggle(
      'hidden',
      hud.photoModeActive || !hud.minimapHudVisible
    );
    (hud.root.querySelector('#photoModeBar') as HTMLElement).classList.toggle('hidden', !hud.photoModeActive);
    headerRefreshFloatingBanner(hud);
    headerRefreshTouchConfirmBar(hud);
    headerSyncHudFocusVisibility(hud);
    hud.renderTutorialCoach();
}

export function headerIsBuildingFocusMode(hud: GameHUD): boolean {
    if (hud.photoModeActive) return false;
    return (
      (Boolean(hud.inspectSelection) && !hud.inspectorCollapsed) ||
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
    shell.classList.toggle('hud-building-focus', focused);
    shell.classList.toggle('hud-compact-rolled', rolled);
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
        ? '📜 Mở HUD'
        : '📜 Ẩn HUD';
    }
    const roundOrb = hud.root.querySelector('#btnHudRoundOrb') as HTMLButtonElement | null;
    if (roundOrb) {
      roundOrb.classList.toggle('hidden', !hud.hudRolledUp || hud.photoModeActive || focused);
      roundOrb.setAttribute('aria-pressed', String(hud.hudRolledUp));
      roundOrb.dataset.rolled = String(hud.hudRolledUp);
    }
    const orbLbl = hud.root.querySelector('#lblHudRoundOrbTag');
    if (orbLbl) {
      orbLbl.textContent = hud.hudRolledUp ? 'Mở HUD' : 'Thu HUD';
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
      const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
      secBar?.classList.add('hidden');
    }
}

export function headerCloseHudPopovers(hud: GameHUD): void {
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
}

export function headerCollapseBuildDock(hud: GameHUD): void {
    hud.buildSheetOpen = false;
    hud.activeCategory = null;
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
    hud.pastureTrayOpen = false;
    hud.pendingStockPastureUid = null;
}

export function headerPositionFloatingPopover(hud: GameHUD, triggerEl: HTMLElement | null, popoverEl: HTMLElement | null): void {
    if (!triggerEl || !popoverEl) return;
    const rect = triggerEl.getBoundingClientRect();
    const popW = Math.min(window.innerWidth - 16, Math.max(248, popoverEl.offsetWidth || 336));
    const popH = Math.min(popoverEl.offsetHeight || 420, window.innerHeight - 16);
    const preferredLeft = rect.left < window.innerWidth * 0.5 ? rect.left : rect.right - popW;
    const left = Math.max(8, Math.min(preferredLeft, window.innerWidth - popW - 8));
    const top = Math.max(8, Math.min(rect.bottom + 8, window.innerHeight - popH - 8));
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
    hud.manageMenuOpen = true;
    const pop = hud.root.querySelector('#managePopoverMenu') as HTMLElement | null;
    const btn = hud.root.querySelector('#btnToggleManageMenu') as HTMLElement | null;
    if (pop && btn) {
      pop.classList.remove('hidden');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('data-active', 'true');
      headerPositionFloatingPopover(hud, btn, pop);
    }
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
      <div class="speed-toggle-row" role="group" aria-label="Tốc độ nhịp sống công viên">
        <button type="button" data-sim-speed="1" data-active="${hud.sim.simSpeed === 1}" aria-pressed="${hud.sim.simSpeed === 1}" class="brass-btn">
          🐢 1×
        </button>
        <button type="button" data-sim-speed="2" data-active="${hud.sim.simSpeed === 2}" aria-pressed="${hud.sim.simSpeed === 2}" class="brass-btn">
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
        hud.sim.simSpeed = spd;
        headerRefreshHeaderClock(hud);
        headerCloseHudPopovers(hud);
        headerShowToast(hud, 
          spd === 2
            ? '⚡ Nhịp sống 2× Nhộn Nhịp: Khách dạo chơi & doanh thu quầy nhanh gấp đôi!'
            : '🐢 Nhịp sống 1× Thư Thả: Tận hưởng không khí công viên êm đềm.',
          spd === 2 ? '⚡' : '🌿'
        );
      });
    });
}

export function headerAnimateGalleonsTo(hud: GameHUD, target: number): void {
    const lbl = hud.root.querySelector('#lblGalleons') as HTMLElement | null;
    if (!lbl) return;
    if (hud.sim.state.sandboxMode) {
      if (hud.galleonRollRaf) {
        cancelAnimationFrame(hud.galleonRollRaf);
        hud.galleonRollRaf = 0;
      }
      lbl.textContent = '∞';
      hud.displayedGalleons = target;
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (hud.displayedGalleons < 0 || reducedMotion || Math.abs(target - hud.displayedGalleons) <= 1) {
      hud.displayedGalleons = target;
      lbl.textContent = Math.round(target).toLocaleString('vi-VN');
      return;
    }

    if (hud.galleonRollRaf) {
      cancelAnimationFrame(hud.galleonRollRaf);
      hud.galleonRollRaf = 0;
    }

    const startVal = hud.displayedGalleons;
    const startAt = performance.now();
    const duration = 420;
    const step = (now: number) => {
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(startVal + (target - startVal) * eased);
      hud.displayedGalleons = cur;
      lbl.textContent = cur.toLocaleString('vi-VN');
      if (t < 1) {
        hud.galleonRollRaf = requestAnimationFrame(step);
      } else {
        hud.displayedGalleons = target;
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

export function headerShowToast(hud: GameHUD, msg: string, icon = '🦉'): void {
    const stack =
      hud.root.querySelector<HTMLElement>('#toastStack') ??
      (typeof document !== 'undefined' ? document.getElementById('toastStack') : null);
    if (!stack) return;

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

    const item = document.createElement('div');
    item.className = 'parchment-dark owl-toast';
    item.textContent = `${icon} ${msg}`;
    stack.appendChild(item);
    window.setTimeout(() => item.remove(), 3500);
}

export function headerShowOfflineModal(hud: GameHUD, report: OfflineReport): void {
    const mins = Math.max(1, Math.round(report.awaySeconds / 60));
    const content = hud.root.querySelector('#offlineDialogContent')!;
    content.innerHTML = `
      <div class="quest-card-mini" style="font-size:13.5px;display:flex;flex-direction:column;gap:6px;">
        <div>⏱️ Vắng mặt: <strong>${mins} phút</strong></div>
        <div>🪙 Vàng: <strong>+${report.galleonsEarned}G</strong></div>
        <div>⭐ XP: <strong>+${report.xpEarned}</strong></div>
        <div>🏗️ Hoàn tất: <strong>${report.buildingsFinished}</strong></div>
      </div>
    `;
    (hud.root.querySelector('#offlineDialog') as HTMLDialogElement).showModal();
}

export function headerRefreshFloatingBanner(hud: GameHUD): void {
    const banner = hud.root.querySelector('#floatingModeBanner') as HTMLElement | null;
    const txt = hud.root.querySelector('#floatingBannerText') as HTMLElement | null;
    const btnSec = hud.root.querySelector('#btnFloatingSecondary') as HTMLButtonElement | null;
    const btnSwap = hud.root.querySelector('#btnFloatingSwap') as HTMLButtonElement | null;
    const btnExit = hud.root.querySelector('#btnFloatingExit') as HTMLButtonElement | null;
    if (!banner || !txt || !btnSec || !btnSwap || !btnExit) return;

    btnSwap.classList.add('hidden');

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
        ? `🤏 ${hud.pincerPicked.label}`
        : '🤏 Gắp nhân sự';
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
      const effStars = hud.sim.getEffectiveItemStarCost(it);
      const costTxt =
        effStars > 0
          ? `🌟 ${effStars}`
          : it.cost === 0
            ? '0G'
            : `${it.cost.toLocaleString('vi-VN')}G`;
      banner.classList.remove('hidden');
      txt.textContent = `🏗️ ${it.name} • ${costTxt}`;
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
      txt.textContent = `🐾 ${a.emoji} ${a.name} (${a.cost.toLocaleString('vi-VN')}G)`;
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
    if (!bar || !lbl) return;
    if (hud.photoModeActive || !hud.pendingTouchTile) {
      bar.classList.add('hidden');
      return;
    }
    bar.classList.remove('hidden');
    lbl.textContent = `📍 ${hud.pendingTouchTile.label}`;
}

export function headerRefreshAll(hud: GameHUD): void {
    const isVisiting = hud.sim.isVisitingNeighbor;
    if (isVisiting) {
      hud.inspectSelection = null;
      hud.seedTrayOpen = false;
      hud.activeSeedCropId = null;
      hud.pendingSowPlotUid = null;
      hud.pastureTrayOpen = false;
      hud.activePastureAnimalId = null;
      hud.pendingStockPastureUid = null;
    }
    headerRefreshHeader(hud);
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
    hud.root
      .querySelector('#tsCornerRight')
      ?.classList.toggle('hidden', hud.photoModeActive || isVisiting);
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
      lblClock.innerHTML = `${weather.icon} <span>${hh}:${mm}</span>${speedBadge}`;
    }
    if (hud.weatherPopoverOpen) {
      headerRenderWeatherPopover(hud);
    }

    const fest = hud.sim.getActiveFestival(now);
    const lblFest = hud.root.querySelector('#lblFestival') as HTMLElement | null;
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
        lblBuilds.textContent = `${actives.length} (${formatDurationCountdownVi(nextLeft)})`;
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
          ? `👑 Cấp Tối Đa ${MAX_LEVEL} • Rương XP: ${chestXp}/${FARM_HARVEST_CHEST_XP} • Tháp 5 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`
          : `Cấp ${st.level} → ${st.level + 1}: Đã thắng ${winsProg.current}/${winsProg.required} màn • Rương XP: ${chestXp}/${FARM_HARVEST_CHEST_XP}`;
    }
    const barLvlTop = hud.root.querySelector('#barLevelTopFill') as HTMLElement | null;
    if (barLvlTop) {
      barLvlTop.style.width = `${lvPct}%`;
      if (barLvlTop.parentElement) {
        barLvlTop.parentElement.title =
          st.level >= MAX_LEVEL
            ? `👑 Đã đạt Cấp Tối Đa ${MAX_LEVEL} • Tháp 5 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`
            : `Cấp Giải Đố ${st.level} → ${st.level + 1}: Đã thắng ${winsProg.current}/${winsProg.required} màn mới • Tháp 5 Môn: ${towerProg.cleared.toLocaleString('vi-VN')}/${towerProg.total.toLocaleString('vi-VN')} Màn`;
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

    headerAnimateGalleonsTo(hud, st.galleons);
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
        lblHubTrial.textContent = `♟️ ${towerProg.cleared}/${towerProg.total}`;
      } else {
        lblHubTrial.textContent = `🔥 ${reqTrial.icon} ${winsProg.current}/${winsProg.required}`;
      }
    }
    hud.root.querySelector('#btnHudMinigameHub')?.classList.remove('trial-urgent');

    // Update Bottom-Right Hero Play CTA -> Always reflects lastPlayedMinigame (never forces Chess)
    const m3Info = hud.sim.getDisciplineStageInfo('match3');
    const lastGame = hud.sim.getLastPlayedMinigame();
    let playTag = '🍬 Bùa Gặt';
    let playIcon = '/sprites/m3_farm_pinwheel.png';
    let playStageText = m3Info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${m3Info.currentStage}`;
    if (lastGame === 'caro') {
      const info = hud.sim.getDisciplineStageInfo('caro');
      playTag = '🗺️ Ngũ Ấn';
      playIcon = '/sprites/ui_icon_jigsaw.png';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'sudoku') {
      const info = hud.sim.getDisciplineStageInfo('sudoku');
      playTag = '🔢 Số Học';
      playIcon = '/sprites/m3_piece_scroll.png';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'blocks') {
      const info = hud.sim.getDisciplineStageInfo('blocks');
      playTag = '🦄 Sinh Vật';
      playIcon = '/sprites/beast_niffler.png';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'chess') {
      const info = hud.sim.getDisciplineStageInfo('chess');
      playTag = '🏰 Cờ Phù Thủy';
      playIcon = '/sprites/ui_icon_jigsaw.png';
      playStageText = info.isMaxed ? `👑 ${MAX_MINIGAME_STAGE}` : `Màn ${info.currentStage}`;
    } else if (lastGame === 'seedquiz') {
      playTag = '🪄 Thần Chú';
      playIcon = '/sprites/ui_icon_seed_sack.png';
      playStageText = 'Ôn Tập';
    }

    const imgCornerPlay = hud.root.querySelector('#imgCornerPlayIcon') as HTMLImageElement | null;
    if (imgCornerPlay && imgCornerPlay.getAttribute('src') !== playIcon) {
      imgCornerPlay.setAttribute('src', playIcon);
    }
    const badgeCornerBonus = hud.root.querySelector('#badgeCornerPlayBonus') as HTMLElement | null;
    if (badgeCornerBonus) {
      badgeCornerBonus.textContent = playTag;
      badgeCornerBonus.classList.remove('hidden');
    }
    const lblCornerStage = hud.root.querySelector('#lblCornerPlayStage') as HTMLElement | null;
    if (lblCornerStage) {
      lblCornerStage.textContent = playStageText;
    }
    const lblCornerSub = hud.root.querySelector('#lblCornerPlaySub') as HTMLElement | null;
    if (lblCornerSub) {
      lblCornerSub.textContent =
        st.level >= MAX_LEVEL
          ? `👑 Cấp ${MAX_LEVEL}`
          : `Cấp ${st.level + 1} (${winsProg.current}/${winsProg.required})`;
    }
    const btnCornerPlay = hud.root.querySelector('#btnCornerPlayPuzzle') as HTMLButtonElement | null;
    if (btnCornerPlay) {
      const playSummary = `Chơi tiếp ${playTag} — ${playStageText}`;
      btnCornerPlay.title = playSummary;
      btnCornerPlay.setAttribute('aria-label', playSummary);
    }
    hud.root.querySelectorAll<HTMLButtonElement>('[data-switch-minigame]').forEach((pill) => {
      const isCurrent = pill.dataset.switchMinigame === lastGame;
      pill.dataset.active = String(isCurrent);
      pill.setAttribute('aria-pressed', String(isCurrent));
    });

    const badgeBuildReady = hud.root.querySelector('#badgeBuildReadyCount') as HTMLElement | null;
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
      if (readyUnbuiltBlueprints > 0 && !hud.sim.isHeadmasterPreview) {
        badgeBuildReady.textContent = String(readyUnbuiltBlueprints);
        badgeBuildReady.classList.remove('hidden');
      } else {
        badgeBuildReady.classList.add('hidden');
      }
    }
    const lblM3Lv = hud.root.querySelector('#lblMatch3Lv') as HTMLElement | null;
    if (lblM3Lv && st.match3) {
      lblM3Lv.textContent = m3Info.isMaxed
        ? `👑${MAX_MINIGAME_STAGE}`
        : `${m3Info.currentStage}/${MAX_MINIGAME_STAGE}`;
    }
    const lblArcadeTower = hud.root.querySelector('#lblArcadeTowerLv') as HTMLElement | null;
    if (lblArcadeTower) {
      const arcadeCleared = Math.max(0, towerProg.cleared - m3Info.clearedStages);
      const arcadeTotal = MAX_MINIGAME_STAGE * 4;
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

    // Workshop & Cargo Train ready badge
    const crateReadyCount = st.supply.cargoCrates.filter(
      (c) => !c.fulfilled && (st.sandboxMode || (st.supply.goods[c.goodId] ?? 0) >= c.qtyRequired)
    ).length;
    const wsBadge = hud.root.querySelector('#badgeWorkshopCount') as HTMLElement | null;
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
    const cardBadge = hud.root.querySelector('#badgeCardCount') as HTMLElement;
    cardBadge.classList.toggle('hidden', !cupReady);

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
        crateReadyCount + (cupReady ? 1 : 0) + feastClaimableCount + suitcaseReadyCount;
      if (manageCount > 0) {
        manageDot.textContent = String(manageCount);
        manageDot.classList.remove('hidden');
      } else {
        manageDot.classList.add('hidden');
      }
    }

    headerSyncProgressiveHudVisibility(hud);
    headerRefreshHeaderClock(hud);

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
    hud.root
      .querySelector('[data-cat="staff"]')
      ?.classList.toggle('hidden', isEarlyOnboarding && hud.activeCategory !== 'staff');

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
      const autoAct = hud.sim.getStoryAutoActionPreview();
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
        headerShowToast(hud, res.msg, res.reason === 'missing_gold' ? '🪙' : '🌟');
        if (
          res.reason === 'missing_stars' ||
          res.reason === 'locked_level' ||
          res.reason === 'open_match3'
        ) {
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

    hud.root.querySelectorAll<HTMLButtonElement>('[data-cat]').forEach((btn) => {
      syncToggle(btn, btn.dataset.cat === hud.activeCategory);
    });
    syncToggle(hud.root.querySelector('#btnPincerTool') as HTMLElement | null, hud.pincerActive);
    syncToggle(hud.root.querySelector('#btnMoveTool') as HTMLElement | null, hud.moveModeActive);
    syncToggle(hud.root.querySelector('#btnBulldoze') as HTMLElement | null, hud.bulldozerActive);
    const btnRotCam = hud.root.querySelector('#btnRotateCam') as HTMLButtonElement | null;
    if (btnRotCam) {
      const vr = hud.cam.viewRot ?? 0;
      btnRotCam.textContent = COMPASS_LABELS_VI[vr];
      syncToggle(btnRotCam, vr !== 0);
    }
    syncToggle(
      hud.root.querySelector('#btnCutaway') as HTMLElement | null,
      Boolean(hud.sim.state.settings.cutawayMode)
    );
    syncToggle(hud.root.querySelector('#btnGrid') as HTMLElement | null, hud.sim.state.settings.showGrid);

    const secToolsActive = hud.mapToolsExpanded || Boolean(hud.activeCategory);
    const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    const btnMapTools = hud.root.querySelector('#btnToggleMapTools') as HTMLButtonElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !secToolsActive);
    }
    if (btnMapTools) {
      btnMapTools.setAttribute('aria-expanded', String(secToolsActive));
      syncToggle(btnMapTools, secToolsActive);
    }

    const isSheetActive =
      hud.buildSheetOpen || Boolean(hud.activeCategory) || hud.mapToolsExpanded;
    const isBuildModeActive =
      isSheetActive ||
      Boolean(hud.selectedCatalogItem) ||
      hud.moveModeActive ||
      hud.bulldozerActive ||
      hud.pincerActive;
    const dockWrap = hud.root.querySelector('#bottomDockWrap') as HTMLElement | null;
    dockWrap?.classList.toggle('ts-dock-open', isSheetActive);
    syncToggle(
      hud.root.querySelector('#btnToggleBuildDock') as HTMLElement | null,
      isBuildModeActive
    );

    const drawer = hud.root.querySelector('#buildDrawer') as HTMLElement;
    const minimap = hud.root.querySelector('#minimapWrap') as HTMLElement;
    if (!hud.activeCategory || !BUILD_HUD_CATEGORIES.includes(hud.activeCategory)) {
      hud.activeCategory = null;
      drawer.classList.add('hidden');
      minimap.classList.toggle('hidden', hud.photoModeActive || !hud.minimapHudVisible);
      return;
    }
    drawer.classList.remove('hidden');
    minimap.classList.add('hidden'); // Give full room while build drawer is open!

    if (hud.activeCategory === 'staff') {
      headerRenderStaffDrawer(hud, drawer);
      return;
    }

    const items = CATALOG.filter(
      (c) =>
        c.category === hud.activeCategory &&
        c.category !== 'terrain' &&
        !c.isThemeParkLegacy
    );
    const lv = hud.sim.state.level;
    const sandbox = hud.sim.state.sandboxMode;

    drawer.innerHTML = items
      .map((item) => {
        const locked = !sandbox && lv < item.unlockLevel;
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
        const imgTag = item.spriteKey
          ? `<img src="/sprites/${item.spriteKey}.png" alt="${item.name}" class="catalog-card-img" />`
          : `<div style="height:64px;display:flex;align-items:center;justify-content:center;font-size:28px;">${fallbackEmoji}</div>`;

        const starCost = hud.sim.getEffectiveItemStarCost(item);
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
        if (!hud.sim.state.sandboxMode && hud.sim.state.level < item.unlockLevel) {
          const wp = hud.sim.getWinsProgressForCurrentLevel();
          let winsNeeded = Math.max(1, wp.required - wp.current);
          for (let l = hud.sim.state.level + 1; l < item.unlockLevel; l++) {
            winsNeeded += getWinsRequiredForNextLevel(l);
          }
          headerShowToast(hud, 
            `🔒 Bản vẽ "${item.name}" mở ở Cấp Giải Đố ${item.unlockLevel} — Cần thắng thêm ${winsNeeded.toLocaleString('vi-VN')} màn Giải Đố mới!`,
            '🧩'
          );
          hud.openTrialMinigame();
          return;
        }
        const needStars = hud.sim.getEffectiveItemStarCost(item);
        if (
          !hud.sim.state.sandboxMode &&
          needStars > 0 &&
          hud.sim.state.match3.stars < needStars
        ) {
          const missing = needStars - hud.sim.state.match3.stars;
          headerShowToast(hud, 
            `Cần thêm ${missing} 🌟 Sao Phép Thuật (${hud.sim.state.match3.stars}/${needStars} 🌟) để dựng "${item.name}" — Hãy chinh phục Tháp Giải Đố 777 Màn!`,
            '🌟'
          );
          hud.openTrialMinigame();
          return;
        }
        hud.selectedCatalogItem = item;
        hud.bulldozerActive = false;
        hud.moveModeActive = false;
        hud.movingBuildingUid = null;
        hud.pincerActive = false;
        hud.pincerPicked = null;
        hud.pendingTouchTile = null;
        hud.inspectSelection = null;
        headerCollapseBuildDock(hud);
        headerRefreshAll(hud);
      });
    });
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

    const activeStaffCards = hud.sim.staff
      .map((s) => {
        const pZone = hud.sim.state.staffPatrolZones?.[s.id] ?? s.patrolZoneId ?? 'all';
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
        if (hud.sim.hireStaff(role)) {
          headerCollapseBuildDock(hud);
          headerRefreshAll(hud);
          headerShowToast(hud, 'Đã đón nhân sự mới gia nhập công viên!', '🧙');
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
        hud.pincerActive = true;
        hud.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        headerCollapseBuildDock(hud);
        headerRefreshAll(hud);
        headerShowToast(hud, `Đang gắp ${st.name} — Nhấp vào bất kỳ ô nào trên bản đồ để thả xuống!`, '🤏');
      });
    });
}

export function headerSyncContextualMapToolsBar(hud: GameHUD): void {
    const secToolsActive = hud.mapToolsExpanded || Boolean(hud.activeCategory);
    const secBar = hud.root.querySelector('#secondaryMapToolsBar') as HTMLElement | null;
    const btnMapTools = hud.root.querySelector('#btnToggleMapTools') as HTMLButtonElement | null;
    if (secBar) {
      secBar.classList.toggle('hidden', !secToolsActive);
    }
    if (btnMapTools) {
      btnMapTools.setAttribute('aria-expanded', String(secToolsActive));
      btnMapTools.setAttribute('data-active', String(secToolsActive));
      btnMapTools.setAttribute('aria-pressed', String(secToolsActive));
    }
}
