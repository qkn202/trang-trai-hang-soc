// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

import {
  CATALOG,
  FARM_CROPS,
  FARM_GOODS,
  computeStrategicPlotGrowSeconds,
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
} from "./hudShared";
import {
  computeRoadsideUnitPrice,
  getRoadsideSaleWaitMs,
  RoadsidePriceTier,
} from '../sim/roadsideStandAndEvents';
import { getVietnamCalendarKey } from '../sim/neighborSocial';
import type { GameHUD } from './hud';

export function farmUiOpenWorkshopDialog(hud: GameHUD, tab?: 'barn' | 'stand' | 'market' | 'brew' | 'cargo' | 'synergy'): void {
    if (tab) hud.activeWorkshopTab = tab;
    farmUiRenderWorkshopDialog(hud);
    const dlg = hud.root.querySelector('#workshopDialog') as HTMLDialogElement;
    if (!dlg.open) dlg.showModal();
}

export function farmUiOpenSeedTray(hud: GameHUD, preferredCropId?: FarmCropId, targetPlotUid?: string): void {
    hud.collapseBuildDock();
    farmUiClosePastureTray(hud);
    clearBuildToolModes(hud);
    hud.inspectSelection = null;
    hud.pendingSowPlotUid = targetPlotUid ?? null;
    hud.seedTrayOpen = true;
    if (preferredCropId) {
      hud.activeSeedCropId = preferredCropId;
    }
    hud.refreshAll();
}

export function farmUiCloseSeedTray(hud: GameHUD): void {
    hud.seedTrayOpen = false;
    hud.activeSeedCropId = null;
    hud.pendingSowPlotUid = null;
}

export function farmUiToggleSeedTray(hud: GameHUD): void {
    if (hud.seedTrayOpen) {
      farmUiCloseSeedTray(hud);
      hud.refreshAll();
    } else {
      farmUiOpenSeedTray(hud, hud.activeSeedCropId ?? undefined);
    }
}

export function farmUiOpenPastureTray(hud: GameHUD, preferredAnimalId?: PastureAnimalId, targetPastureUid?: string): void {
    hud.collapseBuildDock();
    farmUiCloseSeedTray(hud);
    clearBuildToolModes(hud);
    hud.inspectSelection = null;
    hud.pendingStockPastureUid = targetPastureUid ?? null;
    hud.pastureTrayOpen = true;
    if (preferredAnimalId) {
      hud.activePastureAnimalId = preferredAnimalId;
    }
    hud.refreshAll();
}

export function farmUiClosePastureTray(hud: GameHUD): void {
    hud.pastureTrayOpen = false;
    hud.activePastureAnimalId = null;
    hud.pendingStockPastureUid = null;
}

export function farmUiTogglePastureTray(hud: GameHUD): void {
    if (hud.pastureTrayOpen) {
      farmUiClosePastureTray(hud);
      hud.refreshAll();
    } else {
      farmUiOpenPastureTray(hud, hud.activePastureAnimalId ?? undefined);
    }
}

export function farmUiRenderSeedTray(hud: GameHUD): void {
    const tray = hud.root.querySelector('#seedBrushTray') as HTMLElement | null;
    const seedBtn = hud.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null;
    if (seedBtn) {
      const active = hud.seedTrayOpen || Boolean(hud.activeSeedCropId);
      seedBtn.dataset.active = String(active);
      seedBtn.setAttribute('aria-pressed', String(active));
    }
    if (!tray) return;

    if (hud.photoModeActive || !hud.seedTrayOpen) {
      tray.classList.add('hidden');
      hud.syncHudFocusVisibility();
      return;
    }
    tray.classList.remove('hidden');
    hud.syncHudFocusVisibility();

    const emptyPlotCount = hud.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFarmlandPlot && !b.cropId && Date.now() >= b.constructEndsAt
    ).length;
    const totalPlotCount = hud.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isFarmlandPlot
    ).length;
    const activeCrop = hud.activeSeedCropId ? FARM_CROPS[hud.activeSeedCropId] : null;

    const allCrops = Object.values(FARM_CROPS).sort(
      (a, b) => a.unlockLevel - b.unlockLevel || a.growSec - b.growSec
    );
    const filteredCrops = allCrops.filter((c) => {
      if (hud.seedFilterMode === 'flowers') return Boolean(c.isFlowerCrop);
      if (hud.seedFilterMode === 'crops') return !c.isFlowerCrop;
      return true;
    });
    const filterPillsHtml = (
      [
        { id: 'all', label: 'Tất cả' },
        { id: 'flowers', label: 'Hoa' },
        { id: 'crops', label: 'Cây' },
      ] as const
    )
      .map(
        (f) => `
          <button
            type="button"
            class="seed-filter-pill ${hud.seedFilterMode === f.id ? 'active' : ''}"
            data-seed-filter="${f.id}"
            aria-pressed="${hud.seedFilterMode === f.id}"
          >${f.label}</button>
        `
      )
      .join('');

    const cardsHtml = filteredCrops
      .map((crop) => {
        const locked = !hud.sim.state.sandboxMode && hud.sim.state.level < crop.unlockLevel;
        const selected = hud.activeSeedCropId === crop.id;
        const seedCount = hud.sim.getSeedCount(crop.id);
        const mastery = hud.sim.state.cropMastery?.[crop.id] ?? 0;
        const firstSec = computeStrategicPlotGrowSeconds(0, false, mastery, crop.growSec).growSec;
        const growLabel = formatDurationCompactVi(firstSec);
        return `
          <div class="seed-card-slot ${locked ? 'locked' : ''} ${selected ? 'selected' : ''} ${!locked && seedCount <= 0 ? 'out-of-seeds' : ''}">
            <button
              type="button"
              class="seed-card seed-tray-card ${locked ? 'locked' : ''} ${selected ? 'selected' : ''} ${!locked && seedCount <= 0 ? 'out-of-seeds' : ''}"
              data-seed-brush="${crop.id}"
              aria-pressed="${selected}"
              ${locked ? 'disabled' : ''}
            >
              <span class="seed-card-seed-badge ${locked ? 'is-locked' : seedCount > 0 ? 'has-seed' : 'no-seed'}">
                ${locked ? `Cấp ${crop.unlockLevel}` : `×${seedCount}`}
              </span>
              <img src="${getFarmItemIconSrc(crop.id)}" alt="${escapeHtml(crop.name)}" class="seed-card-img" />
              <span class="seed-card-name">${escapeHtml(crop.name)}</span>
              <span class="seed-card-meta">${growLabel}</span>
            </button>
            ${
              !locked
                ? `<button type="button" class="seed-card-add-btn" data-acquire-seed="${crop.id}" aria-label="Mua 1 hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')} Sickle)" title="Mua 1 hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')} Sickle)">+ 🪙${hud.sim.state.sandboxMode ? '0' : crop.seedCost.toLocaleString('vi-VN')}</button>`
                : ''
            }
          </div>
        `;
      })
      .join('');

    const prevTrayScrollLeft =
      (tray.querySelector('.seed-tray-scroll') as HTMLElement | null)?.scrollLeft ?? 0;

    tray.innerHTML = `
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${
              activeCrop
                ? `${escapeHtml(activeCrop.name)} · ×${hud.sim.getSeedCount(activeCrop.id)}`
                : 'Hạt Giống & Hoa'
            }</span>
            <span class="seed-tray-sub">Trống ${emptyPlotCount}/${totalPlotCount}</span>
          </div>
          <button id="btnSeedTrayOpenQuiz" type="button" class="brass-btn sq-tray-quiz-cta" title="Đố nhận hạt 0 Sickle">
            Đố nhận hạt
          </button>
          <button id="btnCloseSeedTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng túi hạt giống">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-filter-bar" role="group" aria-label="Bộ lọc nhóm hạt giống">${filterPillsHtml}</div>
          <div class="seed-tray-actions">
            ${
              hud.pendingSowPlotUid &&
              hud.sim.state.buildings.some((x) => x.uid === hud.pendingSowPlotUid && !x.isIndestructible)
                ? `<button id="btnSeedTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời thửa đất này">Dời ô</button>`
                : ''
            }
            <button id="btnSeedTrayPlantAll" type="button" class="brass-btn" title="Gieo hạt giống đã chọn vào tất cả ô đất trống">Gieo tất cả</button>
            ${
              hud.sim.ensureFarmBarn().lastPlantedCropId
                ? `<button id="btnSeedTrayReplantLast" type="button" class="brass-btn" title="Gieo lại hạt giống vụ trước trên các ô đất trống">🌱 Gieo lại</button>`
                : ''
            }
            <button id="btnSeedTrayWaterAll" type="button" class="brass-btn" title="Tưới tất cả luống đang lớn chưa được tưới">Tưới tất cả</button>
            <button id="btnSeedTrayHarvestAll" type="button" class="brass-btn gold-cta" title="Gặt tất cả luống đã chín vàng">Gặt tất cả</button>
            <button id="btnSeedTrayBuyPlot" type="button" class="brass-btn" title="Đặt Thửa Đất (30 Sickle)">
              + Đất 🪙30
            </button>
            <button id="btnSeedTrayBuyFlowerGarden" type="button" class="brass-btn" title="Đặt Vườn Hoa (55 Sickle)">
              + Vườn 🪙55
            </button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll">${cardsHtml}</div>
    `;

    const nextTrayScrollEl = tray.querySelector('.seed-tray-scroll') as HTMLElement | null;
    if (nextTrayScrollEl && prevTrayScrollLeft > 0) {
      nextTrayScrollEl.scrollLeft = prevTrayScrollLeft;
    }

    const seedTrayNow = Date.now();
    const plotBuildings = hud.sim.state.buildings.filter((b) => getCatalogItem(b.itemId)?.isFarmlandPlot);
    const cropUids = plotBuildings.map((b) => b.uid);
    const readyCrops = plotBuildings.filter((b) => b.cropId && b.cropReadyAt && seedTrayNow >= b.cropReadyAt);
    const waterableCrops = plotBuildings.filter(
      (b) => b.cropId && b.cropReadyAt && seedTrayNow < b.cropReadyAt && !b.cropWateredBoost
    );
    const plantableCrops = plotBuildings.filter((b) => !b.cropId && Date.now() >= b.constructEndsAt);

    const plantAllBtn = tray.querySelector('#btnSeedTrayPlantAll') as HTMLButtonElement | null;
    const waterAllBtn = tray.querySelector('#btnSeedTrayWaterAll') as HTMLButtonElement | null;
    const harvestAllBtn = tray.querySelector('#btnSeedTrayHarvestAll') as HTMLButtonElement | null;

    if (plantAllBtn) {
      const count = plantableCrops.length;
      plantAllBtn.disabled = count === 0;
      plantAllBtn.textContent = `Gieo tất cả${count ? ` (${count})` : ''}`;
      plantAllBtn.addEventListener('click', () => {
        const cropId = hud.activeSeedCropId;
        if (!cropId) {
          hud.showToast('🌱 Chọn một hạt giống trước để Gieo Tất Cả!', '🪄');
          return;
        }
        const result = hud.sim.batchPlantCropPlots(plantableCrops.map((b) => b.uid), cropId);
        hud.showToast(result.msg, result.ok ? '🌱' : '🪄');
        hud.activeSeedCropId = null;
        hud.refreshAll();
      });
    }

    if (waterAllBtn) {
      const count = waterableCrops.length;
      waterAllBtn.disabled = count === 0;
      waterAllBtn.textContent = `Tưới tất cả${count ? ` (${count})` : ''}`;
      waterAllBtn.addEventListener('click', () => {
        const result = hud.sim.batchWaterCropPlots(cropUids);
        hud.showToast(result.msg, result.ok ? '💧' : '🌱');
        hud.refreshAll();
      });
    }

    if (harvestAllBtn) {
      const count = readyCrops.length;
      harvestAllBtn.disabled = count === 0;
      harvestAllBtn.textContent = `Gặt tất cả${count ? ` (${count})` : ''}`;
      harvestAllBtn.addEventListener('click', () => {
        const result = hud.sim.batchHarvestCropPlots(cropUids);
        hud.showToast(result.msg, result.ok ? '🌾' : '🌱');
        hud.refreshAll();
      });
    }

    tray.querySelector('#btnSeedTrayReplantLast')?.addEventListener('click', () => {
      const res = hud.sim.batchReplantLastCrops();
      hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
      hud.refreshAll();
    });

    tray.querySelectorAll<HTMLButtonElement>('[data-seed-filter]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const f = btn.dataset.seedFilter as 'all' | 'flowers' | 'crops';
        if (f === 'all' || f === 'flowers' || f === 'crops') {
          hud.seedFilterMode = f;
          farmUiRenderSeedTray(hud);
        }
      });
    });

    tray.querySelectorAll<HTMLButtonElement>('[data-acquire-seed]').forEach((btn) => {
      btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        const cid = btn.dataset.acquireSeed as FarmCropId;
        const res = hud.sim.buyCropSeedWithGold(cid, 1);
        hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
        if (res.ok) {
          hud.activeSeedCropId = cid;
          hud.refreshAll();
        }
      });
    });

    tray.querySelector('#btnSeedTrayOpenQuiz')?.addEventListener('click', () => {
      const targetPlotUid =
        hud.pendingSowPlotUid ??
        (hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null);
      const preferred = hud.activeSeedCropId ?? 'ottery_wheat';
      hud.seedTrayOpen = false;
      hud.pendingSowPlotUid = null;
      hud.inspectSelection = null;
      hud.refreshAll();
      hud.openSeedQuizDialog(preferred, targetPlotUid);
    });

    tray.querySelectorAll<HTMLButtonElement>('[data-seed-brush]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.dataset.seedBrush as FarmCropId;
        const c = FARM_CROPS[cid];

        const targetPlotUid =
          hud.pendingSowPlotUid ??
          (hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null);

        if (!hud.sim.state.sandboxMode && hud.sim.getSeedCount(cid) <= 0) {
          hud.activeSeedCropId = null;
          hud.pendingSowPlotUid = null;
          hud.seedTrayOpen = false;
          hud.inspectSelection = null;
          hud.refreshAll();
          hud.openSeedQuizDialog(cid, targetPlotUid);
          return;
        }

        hud.pendingSowPlotUid = null;
        hud.seedTrayOpen = false;
        hud.inspectSelection = null;

        if (targetPlotUid) {
          const selB = hud.sim.state.buildings.find((x) => x.uid === targetPlotUid);
          if (selB && getCatalogItem(selB.itemId)?.isFarmlandPlot && !selB.cropId) {
            const res = hud.sim.plantCropOnPlot(selB.uid, cid);
            if (res.needSeedAcquire) {
              hud.activeSeedCropId = null;
              hud.refreshAll();
              hud.openSeedQuizDialog(cid, selB.uid);
              return;
            }
            const hasMore =
              Boolean(hud.sim.state.sandboxMode) || hud.sim.getSeedCount(cid) > 0;
            hud.activeSeedCropId = res.ok && hasMore ? cid : null;
            hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
            hud.refreshAll();
            return;
          }
        }

        hud.activeSeedCropId = cid;
        hud.refreshAll();
        hud.showToast(
          `${c.name} · ${hud.sim.getSeedCount(cid)} hạt`,
          c.emoji
        );
      });
    });

    tray.querySelector('#btnSeedTrayMovePlot')?.addEventListener('click', () => {
      const targetUid = hud.pendingSowPlotUid;
      const selB = targetUid ? hud.sim.state.buildings.find((x) => x.uid === targetUid) : undefined;
      if (!selB || selB.isIndestructible) return;
      const it = getCatalogItem(selB.itemId);
      farmUiCloseSeedTray(hud);
      hud.collapseBuildDock();
      hud.inspectSelection = null;
      hud.moveModeActive = true;
      hud.movingBuildingUid = selB.uid;
      hud.rotation = selB.rotation;
      hud.pendingTouchTile = null;
      hud.refreshAll();
      hud.showToast(`Đang nhấc "${it?.name ?? 'Thửa đất'}" — Nhấp vào ô đất mới để đặt xuống!`, '✋');
    });

    tray.querySelector('#btnSeedTrayBuyPlot')?.addEventListener('click', () => {
      const plotItem = getCatalogItem('farmland_plot');
      if (!plotItem) return;
      farmUiCloseSeedTray(hud);
      hud.collapseBuildDock();
      hud.inspectSelection = null;
      hud.selectedCatalogItem = plotItem;
      hud.refreshAll();
      hud.showToast('Thửa đất · 30 Sickle/ô', '🌱');
    });

    tray.querySelector('#btnSeedTrayBuyFlowerGarden')?.addEventListener('click', () => {
      const gardenItem = getCatalogItem('burrow_flower_garden');
      if (!gardenItem) return;
      farmUiCloseSeedTray(hud);
      hud.collapseBuildDock();
      hud.inspectSelection = null;
      hud.selectedCatalogItem = gardenItem;
      hud.refreshAll();
      hud.showToast('Vườn hoa · 55 Sickle/ô', '🌸');
    });

    tray.querySelector('#btnSeedTrayOpenBarn')?.addEventListener('click', () => {
      hud.seedTrayOpen = false;
      hud.pendingSowPlotUid = null;
      hud.refreshAll();
      farmUiOpenWorkshopDialog(hud, 'barn');
    });

    tray.querySelector('#btnCloseSeedTray')?.addEventListener('click', () => {
      const equippedCid = hud.activeSeedCropId;
      if (
        equippedCid &&
        (hud.sim.state.sandboxMode || hud.sim.getSeedCount(equippedCid) > 0)
      ) {
        const targetUid = hud.pendingSowPlotUid;
        hud.seedTrayOpen = false;
        hud.pendingSowPlotUid = null;
        if (targetUid) {
          const selB = hud.sim.state.buildings.find((x) => x.uid === targetUid);
          if (selB && getCatalogItem(selB.itemId)?.isFarmlandPlot && !selB.cropId) {
            const res = hud.sim.plantCropOnPlot(selB.uid, equippedCid);
            const hasMore =
              Boolean(hud.sim.state.sandboxMode) || hud.sim.getSeedCount(equippedCid) > 0;
            hud.activeSeedCropId = res.ok && hasMore ? equippedCid : null;
            hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
          }
        }
        hud.refreshAll();
        return;
      }
      farmUiCloseSeedTray(hud);
      hud.refreshAll();
    });
}

export function farmUiRenderPastureTray(hud: GameHUD): void {
    const tray = hud.root.querySelector('#pastureBrushTray') as HTMLElement | null;
    const pastureBtn = hud.root.querySelector('#btnOpenPastureTray') as HTMLElement | null;
    if (pastureBtn) {
      const active = hud.pastureTrayOpen || Boolean(hud.activePastureAnimalId);
      pastureBtn.dataset.active = String(active);
      pastureBtn.setAttribute('aria-pressed', String(active));
    }
    if (!tray) return;

    if (hud.photoModeActive || !hud.pastureTrayOpen) {
      tray.classList.add('hidden');
      hud.syncHudFocusVisibility();
      return;
    }
    tray.classList.remove('hidden');
    hud.syncHudFocusVisibility();

    const emptyPastureCount = hud.sim.state.buildings.filter(
      (b) =>
        getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
        !b.pastureAnimalId &&
        Date.now() >= b.constructEndsAt
    ).length;
    const totalPastureCount = hud.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot
    ).length;
    const activeAnimal = hud.activePastureAnimalId
      ? PASTURE_ANIMALS[hud.activePastureAnimalId]
      : null;

    const cardsHtml = Object.values(PASTURE_ANIMALS)
      .map((animal) => {
        const locked = !hud.sim.state.sandboxMode && hud.sim.state.level < animal.unlockLevel;
        const selected = hud.activePastureAnimalId === animal.id;
        return `
          <div class="seed-card-slot pasture-card-slot ${locked ? 'locked' : ''} ${selected ? 'selected' : ''}">
            <button
              type="button"
              class="seed-card seed-tray-card ${locked ? 'locked' : ''} ${selected ? 'selected' : ''}"
              data-pasture-brush="${animal.id}"
              aria-pressed="${selected}"
              ${locked ? 'disabled' : ''}
            >
              <span class="seed-card-seed-badge ${locked ? 'is-locked' : 'has-seed'}">
                ${locked ? `Cấp ${animal.unlockLevel}` : `🪙${animal.cost.toLocaleString('vi-VN')}`}
              </span>
              <img src="/game/trang-trai-hang-soc/sprites/${animal.spritePair[0]}.webp" alt="${escapeHtml(animal.name)}" class="seed-card-img pasture-card-img" />
              <span class="seed-card-name">${escapeHtml(animal.name)}</span>
              <span class="seed-card-meta">${formatDurationCompactVi(animal.cycleSec)} · +🪙${animal.sellValue}</span>
            </button>
          </div>
        `;
      })
      .join('');

    tray.innerHTML = `
      <div class="seed-tray-header">
        <div class="hs-tray-head">
          <div class="hs-tray-heading">
            <span class="seed-tray-title">${
              activeAnimal ? escapeHtml(activeAnimal.name) : 'Chăn Thả'
            }</span>
            <span class="seed-tray-sub">Trống ${emptyPastureCount}/${totalPastureCount}</span>
          </div>
          <button id="btnPastureTrayBuyPlot" type="button" class="brass-btn" title="Đặt Đồng Cỏ (45 Sickle)">
            + Đồng cỏ 🪙45
          </button>
          <button id="btnClosePastureTray" type="button" class="brass-btn hs-tray-close" aria-label="Đóng khay chọn thú chăn thả">✕</button>
        </div>
        <div class="hs-tray-toolbar">
          <div class="seed-tray-actions">
            ${
              hud.pendingStockPastureUid &&
              hud.sim.state.buildings.some((x) => x.uid === hud.pendingStockPastureUid && !x.isIndestructible)
                ? `<button id="btnPastureTrayMovePlot" type="button" class="brass-btn" title="Nhấc dời ô đồng cỏ này">Dời ô</button>`
                : ''
            }
            <button id="btnPastureFeedAll" type="button" class="brass-btn" title="Cho tất cả đàn thú đang lớn ăn">Cho ăn tất cả</button>
            <button id="btnPastureCollectAll" type="button" class="brass-btn gold-cta" title="Thu hoạch tất cả sản vật đã sẵn sàng">Thu hoạch tất cả</button>
          </div>
        </div>
      </div>
      <div class="seed-tray-scroll pasture-tray-scroll">${cardsHtml}</div>
    `;

    const pastureUids = hud.sim.state.buildings
      .filter((b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot)
      .map((b) => b.uid);
    const feedAll = tray.querySelector('#btnPastureFeedAll') as HTMLButtonElement | null;
    const collectAll = tray.querySelector('#btnPastureCollectAll') as HTMLButtonElement | null;
    const now = Date.now();
    const feedableCount = hud.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot && b.pastureAnimalId && b.pastureReadyAt && now < b.pastureReadyAt && !b.pastureFedBoost
    ).length;
    const readyCount = hud.sim.state.buildings.filter(
      (b) => getCatalogItem(b.itemId)?.isAnimalPasturePlot && b.pastureAnimalId && b.pastureReadyAt && now >= b.pastureReadyAt
    ).length;
    if (feedAll) {
      feedAll.disabled = feedableCount === 0;
      feedAll.textContent = `Cho ăn tất cả${feedableCount ? ` (${feedableCount})` : ''}`;
      feedAll.addEventListener('click', () => {
        const result = hud.sim.batchFeedAnimalPastures(pastureUids);
        hud.showToast(result.msg, result.ok ? '🌾' : '✨');
        hud.refreshAll();
      });
    }
    if (collectAll) {
      collectAll.disabled = readyCount === 0;
      collectAll.textContent = `Thu hoạch tất cả${readyCount ? ` (${readyCount})` : ''}`;
      collectAll.addEventListener('click', () => {
        const result = hud.sim.batchHarvestAnimalPastures(pastureUids);
        hud.showToast(result.msg, result.ok ? '🐾' : '✨');
        hud.refreshAll();
      });
    }

    tray.querySelectorAll<HTMLButtonElement>('[data-pasture-brush]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const aid = btn.dataset.pastureBrush as PastureAnimalId;
        const a = PASTURE_ANIMALS[aid];
        if (!a) return;

        const targetPastureUid =
          hud.pendingStockPastureUid ??
          (hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null);

        hud.pendingStockPastureUid = null;
        hud.pastureTrayOpen = false;
        hud.inspectSelection = null;

        if (targetPastureUid) {
          const selB = hud.sim.state.buildings.find((x) => x.uid === targetPastureUid);
          if (selB && getCatalogItem(selB.itemId)?.isAnimalPasturePlot && !selB.pastureAnimalId) {
            const res = hud.sim.stockAnimalOnPasture(selB.uid, aid);
            hud.activePastureAnimalId = null;
            hud.showToast(res.msg, res.ok ? a.emoji : '🪙');
            hud.refreshAll();
            return;
          }
        }

        hud.activePastureAnimalId = aid;
        hud.refreshAll();
        hud.showToast(
          `${a.name} · ${a.cost.toLocaleString('vi-VN')} Sickle/ô`,
          a.emoji
        );
      });
    });

    tray.querySelector('#btnPastureTrayMovePlot')?.addEventListener('click', () => {
      const targetUid = hud.pendingStockPastureUid;
      const selB = targetUid ? hud.sim.state.buildings.find((x) => x.uid === targetUid) : undefined;
      if (!selB || selB.isIndestructible) return;
      const it = getCatalogItem(selB.itemId);
      farmUiClosePastureTray(hud);
      hud.collapseBuildDock();
      hud.inspectSelection = null;
      hud.moveModeActive = true;
      hud.movingBuildingUid = selB.uid;
      hud.rotation = selB.rotation;
      hud.pendingTouchTile = null;
      hud.refreshAll();
      hud.showToast(`Đang nhấc "${it?.name ?? 'Đồng cỏ'}" — Nhấp vào ô đất mới để đặt xuống!`, '✋');
    });

    tray.querySelector('#btnPastureTrayBuyPlot')?.addEventListener('click', () => {
      const pastureItem = getCatalogItem('burrow_animal_pasture');
      if (!pastureItem) return;
      farmUiClosePastureTray(hud);
      hud.collapseBuildDock();
      hud.inspectSelection = null;
      hud.selectedCatalogItem = pastureItem;
      hud.refreshAll();
      hud.showToast('Đồng cỏ · 45 Sickle/ô', '🐾');
    });

    tray.querySelector('#btnPastureTrayOpenBarn')?.addEventListener('click', () => {
      hud.pastureTrayOpen = false;
      hud.pendingStockPastureUid = null;
      hud.refreshAll();
      farmUiOpenWorkshopDialog(hud, 'barn');
    });

    tray.querySelector('#btnClosePastureTray')?.addEventListener('click', () => {
      farmUiClosePastureTray(hud);
      hud.refreshAll();
    });
}

export function farmUiUpdateWorkshopLiveTimers(hud: GameHUD): void {
    const box = hud.root.querySelector('#workshopDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = hud.sim.state;
    const now = Date.now();
    const curBrewId = st.supply.activeBrew?.goodId ?? null;

    if (curBrewId !== hud.lastWsBrewId) {
      farmUiRenderWorkshopDialog(hud);
      return;
    }

    if (hud.activeWorkshopTab === 'cargo') {
      const cargoSig = st.supply.cargoCrates
        .map(
          (c) =>
            `${c.id}:${c.fulfilled ? 1 : 0}:${c.helpRequestedAt ? 1 : 0}:${c.helpedByNeighborName ?? ''}`
        )
        .join('|');
      if (box.dataset.cargoSig && box.dataset.cargoSig !== cargoSig) {
        farmUiRenderWorkshopDialog(hud);
        return;
      }
    }

    if (hud.activeWorkshopTab === 'brew') {
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
          : `🌱 (${formatDurationCompactVi(herbWait)})`;
      }

      const brewLbl = box.querySelector('[data-ws-brew-left]') as HTMLElement | null;
      if (brewLbl && st.supply.activeBrew) {
        const brewRec = CRAFT_RECIPES.find((r) => r.id === st.supply.activeBrew?.goodId);
        const brewLeftSec = Math.max(0, Math.ceil((st.supply.activeBrew.endsAt - now) / 1000));
        if (brewRec) {
          brewLbl.textContent = `🔥 ${brewRec.emoji} ${brewRec.name} (còn ${formatDurationCountdownVi(brewLeftSec)})`;
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
          if (bbLeft > 0) parts.push(`🍻 +85% Sickle (${formatDurationCountdownVi(bbLeft)})`);
          if (fxLeft > 0) parts.push(`🧪 +35%XP (${formatDurationCountdownVi(fxLeft)})`);
          buffBox.textContent = `✨ ${parts.join(' • ')}`;
        }
      }
    }
}

export function farmUiRenderWorkshopDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#workshopDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = hud.sim.state;
    const now = Date.now();
    hud.lastWsBrewId = st.supply.activeBrew?.goodId ?? null;
    const activeSynCount = hud.sim.activeSynergies.activeIds.size;
    const cratesDone = st.supply.cargoCrates.filter((c) => c.fulfilled).length;

    const barn = hud.sim.ensureFarmBarn();
    const barnUsed = hud.sim.getBarnTotalUsed();
    const fair = hud.sim.ensureMarketFairState();
    const compostCount = Math.max(0, Math.floor(st.herbalCompost ?? 0));
    const spotlightLotsLeft = Math.max(0, 3 - fair.spotlightLotsSold);
    const marketReadyDeals = fair.deals.filter(
      (d) => !d.claimed && (st.sandboxMode || hud.sim.getFarmItemCount(d.inputItemId) >= d.inputQty)
    ).length;
    const canSellAnySpotlight =
      spotlightLotsLeft > 0 &&
      (st.sandboxMode ||
        hud.sim.getFarmItemCount(fair.spotlightCropId) >= 2 ||
        hud.sim.getFarmItemCount(fair.spotlightGoodId) >= 1);
    const marketBadge = marketReadyDeals + (canSellAnySpotlight ? 1 : 0);
    const stand = hud.sim.ensureRoadsideStand();
    const standSoldCount = stand.slots.filter((s) => Boolean(s.itemId && s.soldAt)).length;
    const standListedCount = stand.slots.filter((s) => Boolean(s.itemId)).length;

    const tabsHtml = `
      <div class="workshop-tabs" role="tablist" aria-label="Kho, Sạp Ngõ, Chợ Phiên &amp; Xưởng">
        <button type="button" role="tab" id="wsTabBarn" data-ws-tab="barn" data-active="${hud.activeWorkshopTab === 'barn'}" aria-selected="${hud.activeWorkshopTab === 'barn'}" class="brass-btn">
          <span class="nb-tab-ico">🏡</span> Kho <span class="nb-tab-badge">${barnUsed}/${barn.capacity}</span>
        </button>
        <button type="button" role="tab" id="wsTabStand" data-ws-tab="stand" data-active="${hud.activeWorkshopTab === 'stand'}" aria-selected="${hud.activeWorkshopTab === 'stand'}" class="brass-btn">
          <span class="nb-tab-ico">🧺</span> <span class="hs-long">Sạp Ngõ</span><span class="hs-short">Sạp</span> <span class="nb-tab-badge">${standSoldCount > 0 ? `${standSoldCount} xong` : `${standListedCount}/6`}</span>
        </button>
        <button type="button" role="tab" id="wsTabMarket" data-ws-tab="market" data-active="${hud.activeWorkshopTab === 'market'}" aria-selected="${hud.activeWorkshopTab === 'market'}" class="brass-btn">
          <span class="nb-tab-ico">🎪</span> <span class="hs-long">Chợ Phiên</span><span class="hs-short">Chợ</span> <span class="nb-tab-badge">${marketBadge > 0 ? `${marketBadge} sẵn` : `${spotlightLotsLeft}/3`}</span>
        </button>
        <button type="button" role="tab" id="wsTabCargo" data-ws-tab="cargo" data-active="${hud.activeWorkshopTab === 'cargo'}" aria-selected="${hud.activeWorkshopTab === 'cargo'}" class="brass-btn">
          <span class="nb-tab-ico">🚂</span> Tàu <span class="nb-tab-badge">${cratesDone}/3</span>
        </button>
        <button type="button" role="tab" id="wsTabBrew" data-ws-tab="brew" data-active="${hud.activeWorkshopTab === 'brew'}" aria-selected="${hud.activeWorkshopTab === 'brew'}" class="brass-btn">
          <span class="nb-tab-ico">🧪</span> <span class="hs-long">Vạc Phép</span><span class="hs-short">Vạc</span>
        </button>
        <button type="button" role="tab" id="wsTabSynergy" data-ws-tab="synergy" data-active="${hud.activeWorkshopTab === 'synergy'}" aria-selected="${hud.activeWorkshopTab === 'synergy'}" class="brass-btn">
          <span class="nb-tab-ico">🌟</span> Combo <span class="nb-tab-badge">${activeSynCount}/12</span>
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (hud.activeWorkshopTab === 'barn') {
      const capPct = Math.min(100, Math.round((barnUsed / Math.max(1, barn.capacity)) * 100));
      const upgInfo = hud.sim.getBarnUpgradeCostInfo();
      const upgBtnLabel = st.sandboxMode
        ? '+20 Ô (Miễn phí)'
        : upgInfo.hasPlug
          ? `+20 Ô (1 🔌 + ${upgInfo.baseGoldCost} Sickle)`
          : `+20 Ô (${upgInfo.effectiveGoldCost} Sickle)`;
      const plugStatusLabel = upgInfo.hasPlug
        ? `🔌 ×${upgInfo.plugsInBarn}`
        : `🔌 ×0 (bù +${upgInfo.plugShortageBuyout} Sickle)`;
      const spCropMeta = getFarmItemMeta(fair.spotlightCropId);
      const spGoodMeta = getFarmItemMeta(fair.spotlightGoodId);

      const renderStockCards = (ids: FarmItemId[]) =>
        ids
          .map((id) => {
            const meta = getFarmItemMeta(id);
            const qty = hud.sim.getFarmItemCount(id);
            const isSpotlight = hud.sim.isItemMarketSpotlight(id);
            return `
              <div class="barn-stock-card ${qty > 0 ? 'in-stock' : 'empty'}">
                <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="barn-stock-img" />
                <div class="barn-stock-name">${escapeHtml(meta.name)} ${isSpotlight ? '<span class="owl-spotlight-tag">🎪 Tiêu điểm</span>' : ''}</div>
                <div class="barn-stock-qty"><strong>×${st.sandboxMode ? '∞' : qty}</strong></div>
                <button
                  type="button"
                  class="brass-btn ${qty > 0 || st.sandboxMode ? 'gold-cta' : ''}"
                  data-sell-farm-item="${id}"
                  ${qty <= 0 && !st.sandboxMode ? 'disabled' : ''}
                  style="width:100%;padding:4px 8px;font-size:12px;"
                >
                  🪙 +${meta.sellValue} Sickle
                </button>
              </div>
            `;
          })
          .join('');

      const talCount = hud.sim.getPhoenixTalismanCount();
      const talDaily = hud.sim.getPhoenixTalismanDailyStatus();
      const craftGood = hud.sim.getCraftablePhoenixBarnGood();
      const craftMeta = craftGood ? getFarmItemMeta(craftGood) : null;
      const canForgeTalisman =
        st.sandboxMode ||
        (talCount < MAX_PHOENIX_TALISMANS &&
          Boolean(craftGood) &&
          st.galleons >= PHOENIX_FORGE_GOLD_COST);

      bodyHtml = `
        <div class="barn-header-card">
          <div class="barn-head-row" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="barn-head-text">
              <div class="hs-card-title">🏡 Kho Đỏ (${barnUsed}/${barn.capacity})</div>
              <div style="font-size:12px;font-weight:700;opacity:0.86;">
                🦉 ${barn.ordersDelivered} · ${plugStatusLabel} · 🌿 Phân Ủ: ×${st.sandboxMode ? '∞' : compostCount}
              </div>
            </div>
            <button
              id="btnUpgradeFarmBarn"
              type="button"
              class="owl-green-send-btn"
              ${!upgInfo.canAfford ? 'disabled' : ''}
              style="padding:7px 14px;font-size:13px;${!upgInfo.canAfford ? 'opacity:0.55;cursor:not-allowed;' : ''}"
            >
              ${upgBtnLabel}
            </button>
          </div>
          <div class="quest-bar" style="height:8px;margin-top:8px;">
            <div class="quest-bar-fill" style="width:${capPct}%"></div>
          </div>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;white-space:normal;overflow-wrap:break-word;">
            🎪 <strong>Tiêu Điểm Hôm Nay:</strong> ${spCropMeta.emoji} ${escapeHtml(spCropMeta.name)} &amp; ${spGoodMeta.emoji} ${escapeHtml(spGoodMeta.name)}
          </div>
          <button type="button" class="brass-btn gold-cta" data-ws-tab="market" style="padding:5px 10px;font-size:12px;">
            🎪 Vào Chợ Phiên (+60%)
          </button>
        </div>

        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div style="flex:1 1 200px;min-width:0;font-size:12px;font-weight:700;">
            <div>🧙 <strong>Phụ Tá Gia Tinh Bà Molly:</strong> ${
              barn.farmHelperEndsAt && barn.farmHelperEndsAt > now
                ? `<span style="color:#15803d;">Đang trực (${formatDurationCompactVi(Math.ceil((barn.farmHelperEndsAt - now) / 1000))})</span>`
                : 'Tự động tưới luống mới &amp; gom thành phẩm xưởng vào Kho Đỏ'
            }</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${
              barn.farmHelperFreeDayKey !== getVietnamCalendarKey()
                ? `<button type="button" class="brass-btn gold-cta" data-activate-helper="free_daily" style="padding:5px 10px;font-size:12px;">🎁 30p Miễn phí</button>`
                : ''
            }
            <button type="button" class="brass-btn" data-activate-helper="feast_points" style="padding:5px 10px;font-size:12px;">🍁 2h (20 điểm)</button>
            <button type="button" class="brass-btn" data-activate-helper="sickle" style="padding:5px 10px;font-size:12px;">🪙 2h (120 Sickle)</button>
          </div>
        </div>

        <div class="barn-talisman-forge">
          <div class="barn-talisman-forge-meta">
            <h3 class="barn-talisman-forge-title">
              🔥 Bùa Phượng Hoàng (${st.sandboxMode ? '∞' : `${talCount}/${MAX_PHOENIX_TALISMANS}`})
            </h3>
            <div class="barn-talisman-forge-sub" style="margin-top:2px;">
              Hôm nay: ${talDaily.usedCount}/${talDaily.maxDaily} môn
            </div>
          </div>
          <button
            id="btnCraftPhoenixTalisman"
            type="button"
            class="brass-btn pa-tool-btn talisman"
            ${!canForgeTalisman ? 'disabled' : ''}
            style="padding:8px 12px;font-size:12px;"
          >
            🔥 Rèn +1 (${craftMeta ? `1 ${escapeHtml(craftMeta.name)}` : '1 Đặc sản'} + ${PHOENIX_FORGE_GOLD_COST} Sickle)
          </button>
        </div>

        <h3 class="hs-section-title" style="margin:12px 0 6px;">Nông sản (${Object.keys(FARM_CROPS).length})</h3>
        <div class="barn-stock-grid">
          ${renderStockCards(Object.keys(FARM_CROPS) as FarmItemId[])}
        </div>

        <h3 class="hs-section-title" style="margin:14px 0 6px;">Đặc sản (${Object.keys(FARM_GOODS).length})</h3>
        <div class="barn-stock-grid">
          ${renderStockCards(Object.keys(FARM_GOODS) as FarmItemId[])}
        </div>
      `;
    } else if (hud.activeWorkshopTab === 'stand') {
      const allItems: FarmItemId[] = [
        ...(Object.keys(FARM_CROPS) as FarmItemId[]),
        ...(Object.keys(FARM_GOODS) as FarmItemId[]),
      ];
      const availableItems = allItems.filter(
        (id) => st.sandboxMode || hud.sim.getFarmItemCount(id) > 0
      );
      if (
        availableItems.length > 0 &&
        !availableItems.includes(hud.selectedStandItemId)
      ) {
        hud.selectedStandItemId = availableItems[0];
      }
      const selMeta = getFarmItemMeta(hud.selectedStandItemId);
      const selHave = hud.sim.getFarmItemCount(hud.selectedStandItemId);
      const selUnitPrice = computeRoadsideUnitPrice(
        hud.selectedStandItemId,
        hud.selectedStandPriceTier
      );
      const listQty = Math.max(1, Math.min(3, st.sandboxMode ? 2 : selHave));

      bodyHtml = `
        <div class="quest-card-mini">
          <div class="hs-card-title">🧺 Sạp Hàng Đầu Ngõ Hang Sóc (6 Ô)</div>
          <div style="font-size:12px;color:var(--ink-soft);margin:4px 0 8px;">
            Bày nông sản hoặc đặc sản dư trong Kho để khách lữ hành Hogsmeade và hàng xóm ghé mua lấy Sickle!
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <select id="selStandItem" aria-label="Chọn nông sản bày sạp" style="flex:1;min-width:160px;min-height:38px;padding:4px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:var(--ink);font-weight:700;">
              ${(availableItems.length > 0 ? availableItems : (['ottery_wheat'] as FarmItemId[]))
                .map((id) => {
                  const m = getFarmItemMeta(id);
                  const c = hud.sim.getFarmItemCount(id);
                  return `<option value="${id}" ${id === hud.selectedStandItemId ? 'selected' : ''}>${escapeHtml(m.name)} (×${st.sandboxMode ? '∞' : c})</option>`;
                })
                .join('')}
            </select>
            <div style="display:flex;gap:4px;">
              ${(
                [
                  ['bargain', 'Giá hời (nhanh)'],
                  ['fair', 'Chuẩn (+15%)'],
                  ['premium', 'Cao (+35%)'],
                ] as Array<[RoadsidePriceTier, string]>
              )
                .map(
                  ([tier, label]) =>
                    `<button type="button" data-stand-tier="${tier}" data-active="${hud.selectedStandPriceTier === tier}" aria-pressed="${hud.selectedStandPriceTier === tier}" class="brass-btn ${hud.selectedStandPriceTier === tier ? 'gold-cta' : ''}" style="padding:4px 8px;font-size:12px;">${label}</button>`
                )
                .join('')}
            </div>
          </div>
          <div style="font-size:12px;font-weight:700;margin-top:6px;">
            Lô mẫu: <strong>${listQty} × ${escapeHtml(selMeta.name)}</strong> → <strong>+${selUnitPrice * listQty} Sickle</strong>
          </div>
        </div>

        <div class="market-deal-grid" style="margin-top:8px;">
          ${stand.slots
            .map((slot) => {
              if (!slot.itemId) {
                const canList = st.sandboxMode || selHave >= 1;
                return `
                  <div class="market-deal-card">
                    <div class="hs-card-title">Ô Sạp #${slot.slotIndex + 1} · Trống</div>
                    <div style="font-size:12px;color:var(--ink-soft);margin:4px 0;">Sẵn sàng bày ${listQty} ${escapeHtml(selMeta.name)}</div>
                    <button type="button" data-stand-list="${slot.slotIndex}" ${!canList ? 'disabled' : ''} class="brass-btn ${canList ? 'gold-cta' : ''}" style="width:100%;">
                      🧺 Bày bán (+${selUnitPrice * listQty} Sickle)
                    </button>
                  </div>
                `;
              }
              const m = getFarmItemMeta(slot.itemId);
              const totalPrice = slot.qty * slot.unitPrice;
              if (slot.soldAt) {
                return `
                  <div class="market-deal-card">
                    <div class="hs-card-title">${slot.buyerEmoji ?? '🍺'} ${escapeHtml(slot.buyerName ?? 'Khách lữ hành')} đã mua!</div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${m.iconSrc}" alt="${escapeHtml(m.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">${slot.qty} × ${escapeHtml(m.name)}</div>
                    </div>
                    <button type="button" data-stand-claim="${slot.slotIndex}" class="owl-green-send-btn" style="width:100%;padding:6px 10px;font-size:12px;">
                      🪙 Thu +${totalPrice} Sickle
                    </button>
                  </div>
                `;
              }
              const waitMs = getRoadsideSaleWaitMs(slot.unitPrice, m.sellValue);
              const leftSec = Math.max(1, Math.ceil((slot.listedAt + waitMs - now) / 1000));
              return `
                <div class="market-deal-card">
                  <div class="hs-card-title">Ô Sạp #${slot.slotIndex + 1} · Đang rao</div>
                  <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                    <img src="${m.iconSrc}" alt="${escapeHtml(m.name)}" style="width:32px;height:32px;object-fit:contain;" />
                    <div>
                      <div style="font-size:13px;font-weight:700;">${slot.qty} × ${escapeHtml(m.name)}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">Giá ${totalPrice} Sickle · khách ghé ~${formatDurationCompactVi(leftSec)}</div>
                    </div>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    } else if (hud.activeWorkshopTab === 'market') {
      const spCropMeta = getFarmItemMeta(fair.spotlightCropId);
      const spGoodMeta = getFarmItemMeta(fair.spotlightGoodId);
      const haveSpCrop = hud.sim.getFarmItemCount(fair.spotlightCropId);
      const haveSpGood = hud.sim.getFarmItemCount(fair.spotlightGoodId);
      const spCropGold = Math.max(16, Math.round(spCropMeta.sellValue * 2 * 1.6) + 12);
      const spGoodGold = Math.max(16, Math.round(spGoodMeta.sellValue * 1 * 1.6) + 12);
      const canSellSpCrop = spotlightLotsLeft > 0 && (st.sandboxMode || haveSpCrop >= 2);
      const canSellSpGood = spotlightLotsLeft > 0 && (st.sandboxMode || haveSpGood >= 1);
      const rerollsLeft = Math.max(0, 1 - fair.rerollsUsed);

      bodyHtml = `
        <div class="market-spotlight-card">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
            <div>
              <div class="hs-card-title">Sạp Tiêu Điểm (${spotlightLotsLeft}/3 lô hôm nay)</div>
              <div class="hs-stat-pills">
                <span class="hs-stat-pill" title="Thu mua giá cao cộng thêm 60% Sickle mỗi lô sỉ">🪙 +60% Sickle</span>
                <span class="hs-stat-pill" title="Tặng thêm 1 Phân Ủ Thảo Dược mỗi lô">🌿 +1</span>
                <span class="hs-stat-pill" title="Tặng 12 điểm Đại Tiệc Mùa Gặt mỗi lô">🍁 +12</span>
                <span class="hs-stat-pill" title="Phân Ủ Thảo Dược hiện có trong kho">🌿 Kho: ×${st.sandboxMode ? '∞' : compostCount}</span>
                <span class="hs-stat-pill is-active" title="Đơn Hàng Cú có món Tiêu Điểm hôm nay thưởng thêm 1 Phân Ủ, 8 XP và 6 điểm Đại Tiệc">🦉 +1🌿 · +8⭐</span>
              </div>
            </div>
          </div>

          <div class="market-deal-grid">
            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${spCropMeta.iconSrc}" alt="${escapeHtml(spCropMeta.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">2 × ${escapeHtml(spCropMeta.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${st.sandboxMode ? '∞' : haveSpCrop}/2</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${canSellSpCrop ? 'gold-cta' : ''}" data-sell-spotlight="crop" title="Bán 2 nông sản Tiêu Điểm lấy ${spCropGold} Sickle và 1 Phân Ủ" ${!canSellSpCrop ? 'disabled' : ''} style="width:100%;">
                🪙 +${spCropGold} · +1 🌿
              </button>
            </div>

            <div class="market-deal-card">
              <div style="display:flex;align-items:center;gap:8px;">
                <img src="${spGoodMeta.iconSrc}" alt="${escapeHtml(spGoodMeta.name)}" style="width:36px;height:36px;object-fit:contain;" />
                <div>
                  <div class="hs-card-title">1 × ${escapeHtml(spGoodMeta.name)}</div>
                  <div style="font-size:12px;opacity:0.86;">Kho: ${st.sandboxMode ? '∞' : haveSpGood}/1</div>
                </div>
              </div>
              <button type="button" class="brass-btn ${canSellSpGood ? 'gold-cta' : ''}" data-sell-spotlight="good" title="Bán 1 đặc sản Tiêu Điểm lấy ${spGoodGold} Sickle và 1 Phân Ủ" ${!canSellSpGood ? 'disabled' : ''} style="width:100%;">
                🪙 +${spGoodGold} · +1 🌿
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin:10px 0 8px;">
          <h3 class="hs-section-title" style="margin:0;">3 Thương Vụ Thương Lái Hogsmeade</h3>
          <button id="btnRerollMarketFair" type="button" class="brass-btn" ${rerollsLeft <= 0 && !st.sandboxMode ? 'disabled' : ''}>
            🔄 Đổi Sạp (${st.sandboxMode ? '∞' : `${rerollsLeft}/1`})
          </button>
        </div>

        <div class="market-deal-grid">
          ${fair.deals
            .map((deal) => {
              const inMeta = getFarmItemMeta(deal.inputItemId);
              const haveIn = hud.sim.getFarmItemCount(deal.inputItemId);
              const canClaim = !deal.claimed && (st.sandboxMode || haveIn >= deal.inputQty);
              const rewards: Array<{ label: string; tip: string }> = [
                { label: `🪙 +${deal.rewardSickle}`, tip: `Thưởng ${deal.rewardSickle} Sickle` },
                { label: `⭐ +${deal.rewardXp}`, tip: `Thưởng ${deal.rewardXp} XP` },
              ];
              if (deal.rewardCompost) {
                rewards.push({ label: `🌿 +${deal.rewardCompost}`, tip: `Thưởng ${deal.rewardCompost} Phân Ủ Thảo Dược` });
              }
              if (deal.rewardSeedCropId && deal.rewardSeedQty) {
                const sc = FARM_CROPS[deal.rewardSeedCropId];
                rewards.push({ label: `🌱 +${deal.rewardSeedQty} ${escapeHtml(sc.name)}`, tip: `Tặng ${deal.rewardSeedQty} hạt ${escapeHtml(sc.name)}` });
              }
              if (deal.rewardMorningDew) {
                rewards.push({ label: `💧 +${deal.rewardMorningDew}`, tip: `Thưởng ${deal.rewardMorningDew} Bình Sương Mai` });
              }
              if (deal.rewardMugglePlug) {
                rewards.push({ label: `🔌 +${deal.rewardMugglePlug}`, tip: `Thưởng ${deal.rewardMugglePlug} Phích Cắm` });
              }
              if (deal.rewardTimeSand) {
                rewards.push({ label: `⏳ +${deal.rewardTimeSand}`, tip: `Thưởng ${deal.rewardTimeSand} Cát Xoay Thời Gian` });
              }
              return `
                <div class="market-deal-card ${deal.claimed ? 'claimed' : ''}">
                  <div>
                    <div class="hs-card-title" style="margin-bottom:6px;">${deal.merchantEmoji} ${escapeHtml(deal.merchantName)}</div>
                    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                      <img src="${inMeta.iconSrc}" alt="${escapeHtml(inMeta.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div style="font-size:13px;font-weight:700;">
                        ${escapeHtml(inMeta.name)} (${st.sandboxMode ? '∞' : haveIn}/${deal.inputQty})
                      </div>
                    </div>
                    <div class="hs-stat-pills">
                      ${rewards.map((r) => `<span class="hs-stat-pill" title="${r.tip}">${r.label}</span>`).join('')}
                    </div>
                  </div>
                  <button
                    type="button"
                    class="brass-btn ${canClaim ? 'gold-cta' : ''}"
                    data-claim-market-deal="${escapeHtml(deal.id)}"
                    title="${deal.claimed ? 'Đã giao dịch thương vụ này hôm nay' : `Đổi ${deal.inputQty} ${escapeHtml(inMeta.name)} lấy thương vụ`}"
                    ${deal.claimed || !canClaim ? 'disabled' : ''}
                    style="width:100%;"
                  >
                    ${deal.claimed ? '✓ Đã chốt' : '🪙 Chốt đơn'}
                  </button>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    } else if (hud.activeWorkshopTab === 'brew') {
      const herbWait = Math.max(
        0,
        Math.ceil((20_000 - (now - (st.supply.lastHerbPlotHarvestAt || 0))) / 1000)
      );
      const bbLeft = Math.max(0, Math.ceil(((st.supply.butterbeerBoostEndsAt || 0) - now) / 1000));
      const fxLeft = Math.max(0, Math.ceil(((st.supply.felixBoostEndsAt || 0) - now) / 1000));
      const activeBrew = st.supply.activeBrew;
      const brewRec = activeBrew ? CRAFT_RECIPES.find((r) => r.id === activeBrew.goodId) : undefined;
      const brewLeftSec = activeBrew ? Math.max(0, Math.ceil((activeBrew.endsAt - now) / 1000)) : 0;
      const completedBrews = Math.max(0, st.supply.brewCompletedCount ?? 0);
      const nextBatchIdx = completedBrews + 1;
      const hasWorkshopBrewery = st.buildings.some(
        (b) => getCatalogItem(b.itemId)?.isWorkshopBrewery && now >= b.constructEndsAt
      );
      const hasHerbSynergy = hud.sim.activeSynergies.activeIds.has('combo_herb_brewery');
      const cycleStageLabel =
        completedBrews === 0
          ? 'Mẻ #1 (1h)'
          : completedBrews === 1
            ? 'Mẻ #2 (2h)'
            : completedBrews === 2
              ? 'Mẻ #3 (4h)'
              : `Mẻ #${nextBatchIdx} (6h)`;

      const ingKeys: RawIngredientId[] = [
        'mandrake_leaf',
        'sweet_pumpkin',
        'starlight_dust',
        'magic_cacao',
      ];

      bodyHtml = `
        <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <div class="hs-card-title">🌿 Luống Thảo Dược</div>
          <button id="btnWsQuickHerb" type="button" class="brass-btn ${herbWait === 0 || st.sandboxMode ? 'gold-cta' : ''}">
            ${herbWait > 0 && !st.sandboxMode ? `🌱 (${formatDurationCompactVi(herbWait)})` : '🌿 Hái Thảo Dược'}
          </button>
        </div>

        <div class="quest-card-mini" style="font-size:12px;line-height:1.45;">
          <div style="font-size:13px;font-weight:700;color:var(--brand-strong);">
            🔥 Nhiệt Vạc · ${cycleStageLabel}
          </div>
          <div style="font-weight:700;color:var(--ink-soft);margin-top:2px;">
            Chu kỳ 1h → 2h → 4h → 6h.${hasWorkshopBrewery ? ' ✓ −45% Xưởng.' : ' Dựng Xưởng −45%.'}${hasHerbSynergy ? ' ✓ −22% Combo.' : ''}
          </div>
        </div>

        <div class="ingredient-bar">
          ${ingKeys
            .map((k) => {
              const info = RAW_INGREDIENTS_INFO[k];
              const qty = st.supply.ingredients[k] ?? 0;
              return `
                <div class="ingredient-pill">
                  <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
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
              <div data-ws-buff-banner="1" class="quest-card-mini" style="font-size:12px;font-weight:700;color:#15803d;">
                ✨ ${bbLeft > 0 ? `🍻 +85% Sickle (${formatDurationCountdownVi(bbLeft)}) ` : ''}${fxLeft > 0 ? `• 🧪 +35% XP (${formatDurationCountdownVi(fxLeft)})` : ''}
              </div>
            `
            : ''
        }

        ${
          activeBrew && brewRec
            ? `
              <div class="quest-card-mini">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div data-ws-brew-left="1" style="font-size:13px;font-weight:700;color:#6b21a8;">
                    🔥 ${brewRec.emoji} ${escapeHtml(brewRec.name)} (${formatDurationCountdownVi(brewLeftSec)})
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
            const dur = hud.sim.getBrewDurationSec(rec);
            const durLabel = formatDurationCompactVi(dur);
            const reqText = Object.entries(rec.inputs)
              .map(([k, q]) => {
                const inf = RAW_INGREDIENTS_INFO[k as RawIngredientId];
                const have = st.supply.ingredients[k as RawIngredientId] ?? 0;
                const ok = st.sandboxMode || have >= (q ?? 0);
                return `<span style="color:${ok ? '#15803d' : '#dc2626'};font-weight:700;">${inf.emoji} ${have}/${q}</span>`;
              })
              .join(' • ');

            return `
              <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:7px;">
                <div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <span class="hs-card-title">${rec.emoji} ${rec.name}</span>
                    <span style="font-size:12px;font-weight:700;color:#7c2d12;">×${st.sandboxMode ? '∞' : stock}</span>
                  </div>
                  <div style="font-size:12px;margin:4px 0;">${reqText}</div>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                  <button type="button" data-brew-good="${rec.id}" class="brass-btn gold-cta" style="flex:1;">
                    🔥 Nấu (${durLabel})
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
    } else if (hud.activeWorkshopTab === 'cargo') {
      const bonusG = Math.max(1, Math.round((240 + st.level * 40) / 5));
      const bonusXp = Math.round(160 + st.level * 25);
      const anyHelpUsedOnTrain = st.supply.cargoCrates.some((c) =>
        Boolean(c.helpRequestedAt || c.helpedByNeighborName)
      );
      bodyHtml = `
        <div class="quest-card-mini">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div class="hs-card-title">
              🚂 Tàu #${st.supply.cargoTrainIndex}
            </div>
            <span style="font-size:12px;font-weight:700;">+${bonusG.toLocaleString('vi-VN')} Sickle · +${bonusXp} ⭐ · +2 ⏳</span>
          </div>
        </div>

        <div class="crate-grid">
          ${st.supply.cargoCrates
            .map((crate, idx) => {
              const stock = hud.sim.getCargoCrateStockInfo(crate);
              const itemMeta = getFarmItemMeta(stock.barnItemId);
              const rec = CRAFT_RECIPES.find((r) => r.id === crate.goodId);
              return `
                <div class="crate-card ${crate.fulfilled ? 'done' : ''}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#92400e;">
                      <span>#${idx + 1}</span>
                      <span>${crate.fulfilled ? '✓' : `${st.sandboxMode ? '∞' : stock.haveBarn}/${crate.qtyRequired}`}</span>
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;margin:6px 0;">
                      <img src="${itemMeta.iconSrc}" alt="${escapeHtml(itemMeta.name)}" style="width:32px;height:32px;object-fit:contain;" />
                      <div>
                        <div class="hs-card-title">${escapeHtml(itemMeta.name)} ×${crate.qtyRequired}</div>
                        ${
                          stock.allowBrewEquiv && rec && stock.haveBrew > 0
                            ? `<div style="font-size:11px;opacity:0.8;">+ ${stock.haveBrew} mẻ ${escapeHtml(rec.name)} (Vạc Phép)</div>`
                            : ''
                        }
                      </div>
                    </div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${crate.rewardSickle} Sickle · +${crate.rewardXp} ⭐ · +${crate.rewardTimeSand} ⏳
                    </div>
                  </div>
                  ${
                    crate.fulfilled
                      ? `<div style="font-size:12px;font-weight:700;color:#15803d;text-align:center;padding:6px 0;">${
                          crate.helpedByNeighborName
                            ? `✓ ${escapeHtml(crate.helpedByNeighborEmoji ?? '🤝')} ${escapeHtml(crate.helpedByNeighborName)} đóng hộ`
                            : '✓ Đã chất'
                        }</div>`
                      : stock.canFulfill
                        ? `<button type="button" data-fulfill-crate="${escapeHtml(crate.id)}" class="brass-btn gold-cta" style="width:100%;">📦 Chất hàng</button>`
                        : `<div style="display:flex;flex-direction:column;gap:6px;">
                            <button type="button" data-jump-cargo-item="${escapeHtml(stock.barnItemId)}" class="brass-btn gold-cta" style="width:100%;">→ Tìm / Sản xuất</button>
                            ${
                              crate.helpRequestedAt
                                ? `<div style="font-size:12px;font-weight:700;color:var(--brand-strong);text-align:center;padding:4px 0;">🦉 Đang gọi...</div>`
                                : `<button type="button" data-help-cargo-crate="${escapeHtml(crate.id)}" class="brass-btn" style="width:100%;" title="Nhờ hàng xóm đóng hộ kiện hàng này (tối đa 1 kiện mỗi chuyến tàu)" ${anyHelpUsedOnTrain ? 'disabled' : ''}>🦉 Nhờ đóng hộ (1/tàu)</button>`
                            }
                            ${
                              stock.allowBrewEquiv
                                ? `<button type="button" data-goto-brew="1" class="brass-btn" style="width:100%;">🧪 Nấu ở Vạc Phép</button>`
                                : ''
                            }
                          </div>`
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
            const active = hud.sim.activeSynergies.activeIds.has(syn.id);
            const names = syn.requiredItems
              .map((id) => getCatalogItem(id)?.name ?? id)
              .join(' + ');
            return `
              <div class="quest-card-mini" style="border-color:${active ? '#d97706' : 'rgba(176, 125, 67, 0.45)'};">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                  <span class="hs-card-title">${syn.emoji} ${escapeHtml(syn.name)}</span>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;color:${active ? '#15803d' : '#78350f'};">
                    ${active ? '✓' : `≤${syn.maxRadius} ô`}
                  </span>
                </div>
                <div style="font-size:12px;font-weight:700;color:#92400e;margin:4px 0;">${names}</div>
                <div style="font-size:12px;font-weight:700;color:#15803d;">
                  +${syn.goldBonusPct}% Sickle · +${syn.xpBonusPct}% XP
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    box.innerHTML = tabsHtml + bodyHtml;
    box.dataset.cargoSig = st.supply.cargoCrates
      .map(
        (c) =>
          `${c.id}:${c.fulfilled ? 1 : 0}:${c.helpRequestedAt ? 1 : 0}:${c.helpedByNeighborName ?? ''}`
      )
      .join('|');

    box.querySelectorAll<HTMLButtonElement>('[data-ws-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeWorkshopTab = btn.dataset.wsTab as typeof hud.activeWorkshopTab;
        farmUiRenderWorkshopDialog(hud);
        const activeBtn = box.querySelector<HTMLButtonElement>(
          `[data-ws-tab="${hud.activeWorkshopTab}"]`
        );
        activeBtn?.scrollIntoView?.({
          block: 'nearest',
          inline: 'nearest',
          container: 'nearest',
        } as ScrollIntoViewOptions);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-sell-spotlight]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.sellSpotlight === 'good' ? 'good' : 'crop';
        const res = hud.sim.sellMarketSpotlightLot(kind);
        if (!res.ok) hud.showToast(res.msg, '🎪');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-claim-market-deal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.fulfillMarketFairDeal(btn.dataset.claimMarketDeal!);
        if (!res.ok) hud.showToast(res.msg, '🎪');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelector('#btnRerollMarketFair')?.addEventListener('click', () => {
      const res = hud.sim.rerollMarketFairDeals();
      if (!res.ok) hud.showToast(res.msg, '🎪');
      farmUiRenderWorkshopDialog(hud);
    });

    box.querySelector('#btnUpgradeFarmBarn')?.addEventListener('click', () => {
      const res = hud.sim.upgradeFarmBarn();
      hud.showToast(res.msg, res.ok ? '🏡' : '🔌');
      farmUiRenderWorkshopDialog(hud);
      hud.refreshHeader();
    });

    box.querySelector('#btnCraftPhoenixTalisman')?.addEventListener('click', () => {
      const res = hud.sim.craftPhoenixTalismanFromBarn();
      hud.showToast(res.msg, res.ok ? '🔥' : '🧺');
      farmUiRenderWorkshopDialog(hud);
      hud.refreshHeader();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-sell-farm-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.sellFarmItemFromBarn(btn.dataset.sellFarmItem as FarmItemId, 1);
        if (!res.ok) {
          hud.showToast(res.msg, '🧺');
        }
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelector('#btnWsQuickHerb')?.addEventListener('click', () => {
      const res = hud.sim.quickHarvestHerbs();
      hud.showToast(res.msg, res.ok ? '🌿' : '⏳');
      farmUiRenderWorkshopDialog(hud);
    });

    box.querySelector('#btnWsSpeedBrew')?.addEventListener('click', () => {
      if (hud.sim.speedUpBrewing()) {
        farmUiRenderWorkshopDialog(hud);
      }
    });

    box.querySelectorAll<HTMLButtonElement>('[data-brew-good]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.startBrewing(btn.dataset.brewGood as CraftedGoodId);
        hud.showToast(res.msg, res.ok ? '🧪' : '⚠️');
        farmUiRenderWorkshopDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-use-good]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gid = btn.dataset.useGood as CraftedGoodId;
        const res = hud.sim.useCraftedGood(gid);
        if (!res.ok) {
          hud.showToast(res.msg, '⚠️');
        } else if (gid === 'dragon_firework') {
          (hud.root.querySelector('#workshopDialog') as HTMLDialogElement).close();
        } else {
          farmUiRenderWorkshopDialog(hud);
        }
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-fulfill-crate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.fulfillCargoCrate(btn.dataset.fulfillCrate!);
        hud.showToast(res.msg, res.ok ? '📦' : '⚠️');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-help-cargo-crate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.requestCargoCrateHelp(btn.dataset.helpCargoCrate!);
        hud.showToast(res.msg, res.ok ? '🤝' : '🚂');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-goto-brew]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeWorkshopTab = 'brew';
        farmUiRenderWorkshopDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-jump-cargo-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const itemId = btn.dataset.jumpCargoItem as FarmItemId;
        (hud.root.querySelector('#workshopDialog') as HTMLDialogElement | null)?.close();
        hud.jumpToMissingFarmItem(itemId);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-activate-helper]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.activateHelper as 'free_daily' | 'feast_points' | 'sickle';
        const res = hud.sim.activateFarmHelper(mode);
        hud.showToast(res.msg, res.ok ? '🧙' : '🪙');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelector('#selStandItem')?.addEventListener('change', (ev) => {
      hud.selectedStandItemId = (ev.currentTarget as HTMLSelectElement).value as FarmItemId;
      farmUiRenderWorkshopDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-stand-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.selectedStandPriceTier = btn.dataset.standTier as RoadsidePriceTier;
        farmUiRenderWorkshopDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-stand-list]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slotIdx = Number(btn.dataset.standList);
        const have = hud.sim.getFarmItemCount(hud.selectedStandItemId);
        const qty = Math.max(1, Math.min(3, st.sandboxMode ? 2 : have));
        const res = hud.sim.listOnRoadsideStand(
          slotIdx,
          hud.selectedStandItemId,
          qty,
          hud.selectedStandPriceTier
        );
        hud.showToast(res.msg, res.ok ? '🧺' : '⚠️');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-stand-claim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const slotIdx = Number(btn.dataset.standClaim);
        const res = hud.sim.claimRoadsideStandSlot(slotIdx);
        hud.showToast(res.msg, res.ok ? '🪙' : '🧺');
        farmUiRenderWorkshopDialog(hud);
        hud.refreshHeader();
      });
    });
}
