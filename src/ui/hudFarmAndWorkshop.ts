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
import type { GameHUD } from './hud';

export function farmUiOpenWorkshopDialog(hud: GameHUD, tab?: 'barn' | 'brew' | 'cargo' | 'synergy'): void {
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
                ? `<button type="button" class="seed-card-add-btn" data-acquire-seed="${crop.id}" aria-label="Nạp hạt ${escapeHtml(crop.name)}" title="Mua hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')} Sickle) hoặc Đố 0 Sickle">+ 🪙${crop.seedCost.toLocaleString('vi-VN')}</button>`
                : ''
            }
          </div>
        `;
      })
      .join('');

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
        const targetPlotUid =
          hud.pendingSowPlotUid ??
          (hud.inspectSelection?.kind === 'building' ? hud.inspectSelection.uid : null);
        hud.seedTrayOpen = false;
        hud.pendingSowPlotUid = null;
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openSeedQuizDialog(cid, targetPlotUid);
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
            hud.activeSeedCropId = null;
            if (res.needSeedAcquire) {
              hud.refreshAll();
              hud.openSeedQuizDialog(cid, selB.uid);
              return;
            }
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

    const tabsHtml = `
      <div class="workshop-tabs" role="group" aria-label="Kho & Xưởng">
        <button type="button" data-ws-tab="barn" data-active="${hud.activeWorkshopTab === 'barn'}" aria-pressed="${hud.activeWorkshopTab === 'barn'}" class="brass-btn">
          <span class="nb-tab-ico">🏡</span> Kho <span class="nb-tab-badge">${barnUsed}/${barn.capacity}</span>
        </button>
        <button type="button" data-ws-tab="brew" data-active="${hud.activeWorkshopTab === 'brew'}" aria-pressed="${hud.activeWorkshopTab === 'brew'}" class="brass-btn">
          <span class="nb-tab-ico">🧪</span> <span class="hs-long">Vạc Phép</span><span class="hs-short">Vạc</span>
        </button>
        <button type="button" data-ws-tab="cargo" data-active="${hud.activeWorkshopTab === 'cargo'}" aria-pressed="${hud.activeWorkshopTab === 'cargo'}" class="brass-btn">
          <span class="nb-tab-ico">🚂</span> Tàu <span class="nb-tab-badge">${cratesDone}/3</span>
        </button>
        <button type="button" data-ws-tab="synergy" data-active="${hud.activeWorkshopTab === 'synergy'}" aria-pressed="${hud.activeWorkshopTab === 'synergy'}" class="brass-btn">
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

      const renderStockCards = (ids: FarmItemId[]) =>
        ids
          .map((id) => {
            const meta = getFarmItemMeta(id);
            const qty = hud.sim.getFarmItemCount(id);
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
                🦉 ${barn.ordersDelivered} · ${plugStatusLabel}
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
      const bonusG = Math.round(240 + st.level * 40);
      const bonusXp = Math.round(160 + st.level * 25);
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
              const rec = CRAFT_RECIPES.find((r) => r.id === crate.goodId)!;
              const have = st.supply.goods[crate.goodId] ?? 0;
              const canLoad = !crate.fulfilled && (st.sandboxMode || have >= crate.qtyRequired);
              return `
                <div class="crate-card ${crate.fulfilled ? 'done' : ''}">
                  <div>
                    <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#92400e;">
                      <span>#${idx + 1}</span>
                      <span>${crate.fulfilled ? '✓' : `${st.sandboxMode ? '∞' : have}/${crate.qtyRequired}`}</span>
                    </div>
                    <div class="hs-card-title" style="margin:6px 0;">${rec.emoji} ${rec.name} ×${crate.qtyRequired}</div>
                    <div style="font-size:12px;font-weight:700;color:#15803d;">
                      +${crate.rewardSickle} Sickle · +${crate.rewardXp} ⭐ · +${crate.rewardTimeSand} ⏳
                    </div>
                  </div>
                  ${
                    crate.fulfilled
                      ? `<div style="font-size:12px;font-weight:700;color:#15803d;text-align:center;padding:6px 0;">✓ Đã chất</div>`
                      : canLoad
                        ? `<button type="button" data-fulfill-crate="${crate.id}" class="brass-btn gold-cta" style="width:100%;">📦 Chất hàng</button>`
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

    box.querySelectorAll<HTMLButtonElement>('[data-ws-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeWorkshopTab = btn.dataset.wsTab as typeof hud.activeWorkshopTab;
        farmUiRenderWorkshopDialog(hud);
      });
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

    box.querySelectorAll<HTMLButtonElement>('[data-goto-brew]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeWorkshopTab = 'brew';
        farmUiRenderWorkshopDialog(hud);
      });
    });
}
