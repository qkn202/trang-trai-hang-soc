// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

import {
  CATALOG,
  computeStrategicPlotGrowSeconds,
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCompactVi,
  formatDurationCountdownVi,
  getBuildingEffectiveCycleSec,
  getCatalogItem,
  getCropFamily,
  getCropMasteryTierInfo,
  getFarmItemIconSrc,
  getFarmItemMeta,
  getWorkshopMaxQueueSlots,
  getWorkshopStarSpeedMultiplier,
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
  getCatalogCardImageSrc,
} from "./hudShared";
import type { GameHUD } from './hud';

export function inspectorRenderInspector(hud: GameHUD): void {
    hud.syncContextualMapToolsBar();
    const panel = hud.root.querySelector('#inspectorPanel') as HTMLElement;
    if (!hud.inspectSelection) {
      hud.lastInspectedKey = '';
      hud.inspectorCollapsed = false;
      delete panel.dataset.inspSig;
      panel.classList.add('hidden');
      panel.classList.remove('inspector-collapsed');
      hud.syncHudFocusVisibility();
      return;
    }

    const selKey =
      hud.inspectSelection.kind === 'building'
        ? `b:${hud.inspectSelection.uid}`
        : hud.inspectSelection.kind === 'staff'
          ? `s:${hud.inspectSelection.id}`
          : `z:${hud.inspectSelection.zoneId}`;
    if (selKey !== hud.lastInspectedKey) {
      hud.lastInspectedKey = selKey;
    }
    hud.inspectorCollapsed = false;
    panel.classList.remove('inspector-collapsed');

    if (hud.inspectSelection.kind === 'building') {
      const targetUid = hud.inspectSelection.uid;
      const b = hud.sim.state.buildings.find((x) => x.uid === targetUid);
      if (!b) {
        hud.inspectSelection = null;
        delete panel.dataset.inspSig;
        panel.classList.add('hidden');
        hud.syncHudFocusVisibility();
        return;
      }
      const item = getCatalogItem(b.itemId)!;
      const now = Date.now();
      const isBuilding = now < b.constructEndsAt;
      const remainSec = Math.max(0, Math.ceil((b.constructEndsAt - now) / 1000));
      const prod = hud.sim.getBuildingProductionPerCycle(b, item);
      const upgCost = getUpgradeCost(item, b.stars);
      const queueCount = (hud.sim.rideQueues.get(b.uid) ?? []).length;
      const isConnected = hud.sim.isBuildingConnected(b.uid);
      const synGold = hud.sim.activeSynergies.buildingGoldMult.get(b.uid) ?? 1;
      const isRide = item.category === 'ride' && !item.isCoasterTrackPiece;
      const canRideCam = Boolean(item.isCustomCoasterStation) && !isBuilding;

      // Precompute live countdown metrics & structural signature so 1s timer ticks patch in-place without rebuilding DOM
      let cropSig = 'none';
      let cropLeftText = '';
      let cropGrowPct = 0;
      if (item.isFarmlandPlot && !isBuilding) {
        if (!b.cropId) {
          const soilEntry = hud.sim.state.plotSoilState?.[`${b.gx},${b.gy}`];
          const seedSig = Object.keys(FARM_CROPS)
            .map((cid) => hud.sim.getSeedCount(cid as FarmCropId))
            .join('.');
          cropSig = `empty:${hud.seedFilterMode}:${soilEntry?.lastFamily ?? ''}:${b.harvestCycleCount ?? 0}:${seedSig}`;
        } else {
          const cropDef = FARM_CROPS[b.cropId];
          const readyAt = b.cropReadyAt ?? now;
          const masteryCount = hud.sim.state.cropMastery?.[cropDef.id] ?? 0;
          const fallbackDurSec = computeStrategicPlotGrowSeconds(0, false, masteryCount, cropDef.growSec).growSec;
          const plantedAt = b.cropPlantedAt ?? readyAt - fallbackDurSec * 1000;
          const cropLeftSec = Math.max(0, Math.ceil((readyAt - now) / 1000));
          const isRipe = cropLeftSec <= 0;
          cropGrowPct = isRipe
            ? 100
            : Math.max(6, Math.min(98, Math.round(((now - plantedAt) / Math.max(1000, readyAt - plantedAt)) * 100)));
          cropLeftText = `${isRipe ? 'Chín' : formatDurationCountdownVi(cropLeftSec)}${b.cropRotatedBonus ? ' · ×2' : ''}`;
          cropSig = `${cropDef.id}:${isRipe ? 1 : 0}:${b.cropWateredBoost ? 1 : 0}:${b.cropRotatedBonus ? 1 : 0}:${hud.sim.state.morningDewPhials ?? 0}`;
        }
      }

      let pastureSig = 'none';
      let pastureLeftText = '';
      let pastureGrazePct = 0;
      if (item.isAnimalPasturePlot && !isBuilding) {
        if (!b.pastureAnimalId) {
          pastureSig = 'empty';
        } else {
          const animalDef = PASTURE_ANIMALS[b.pastureAnimalId];
          const readyAt = b.pastureReadyAt ?? now;
          const stockedAt = b.pastureStockedAt ?? readyAt - animalDef.cycleSec * 1000;
          const leftSec = Math.max(0, Math.ceil((readyAt - now) / 1000));
          const isReady = leftSec <= 0;
          pastureGrazePct = isReady
            ? 100
            : Math.max(6, Math.min(98, Math.round(((now - stockedAt) / Math.max(1000, readyAt - stockedAt)) * 100)));
          const prodMeta = animalDef.goodId ? getFarmItemMeta(animalDef.goodId) : null;
          pastureLeftText = isReady
            ? `🧺 +${animalDef.sellValue} Sickle${prodMeta ? ` +${animalDef.yieldQty} ${prodMeta.name}` : ''}`
            : `⏱️ ${formatDurationCountdownVi(leftSec)}`;
          pastureSig = `${b.pastureAnimalId}:${isReady ? 1 : 0}:${b.pastureFedBoost ? 1 : 0}:${hud.sim.state.morningDewPhials ?? 0}`;
        }
      }

      let wsSig = 'none';
      let wsLeftText = '';
      if (item.workshopGroupId && !isBuilding) {
        const recipes = hud.sim.getWorkshopRecipesForBuilding(item);
        const queue = b.workshopQueue ?? [];
        const readyGoods = b.readyFarmGoods ?? [];
        const recSig = recipes
          .map((rec) => {
            const lockedRec = !hud.sim.state.sandboxMode && hud.sim.state.level < rec.unlockLevel;
            const canCraft =
              !lockedRec &&
              (hud.sim.state.sandboxMode ||
                rec.inputs.every((inp) => hud.sim.getFarmItemCount(inp.itemId) >= inp.qty));
            return `${rec.id}:${lockedRec ? 'L' : canCraft ? 'Y' : 'N'}:${rec.inputs.map((inp) => (hud.sim.state.sandboxMode ? 'X' : hud.sim.getFarmItemCount(inp.itemId))).join('.')}`;
          })
          .join(',');
        const activeSlot = queue[0];
        const activeLeftSec = activeSlot ? Math.max(0, Math.ceil((activeSlot.endsAt - now) / 1000)) : 0;
        wsLeftText = activeSlot ? formatDurationCountdownVi(activeLeftSec) : 'Trống';
        wsSig = `${readyGoods.join(',')}|${queue.map((q) => q.goodId).join(',')}|${recSig}`;
      }

      let buildSig = 'done';
      let buildPctVal = 100;
      let buildTimerText = '';
      let buildPctText = '';
      if (isBuilding) {
        const reducedSec = Math.max(0, b.buildReducedSec ?? 0);
        const totalMs = Math.max(
          1000,
          item.buildDurationSec * 1000,
          b.constructEndsAt - (b.placedAt || now - 1000) + reducedSec * 1000
        );
        buildPctVal = Math.max(1, Math.min(99, Math.floor((1 - (b.constructEndsAt - now) / totalMs) * 100)));
        const floorSec = hud.sim.getBuildingMinFloorSec(b);
        const reducibleSec = Math.max(0, remainSec - floorSec);
        const hasOtherReducible =
          reducibleSec <= 0 &&
          hud.sim
            .getActiveConstructions(now)
            .some(
              (x) =>
                x.uid !== b.uid &&
                Math.ceil((x.constructEndsAt - now) / 1000) > hud.sim.getBuildingMinFloorSec(x)
            );
        const canTriggerSpeedup = reducibleSec > 0 || hasOtherReducible;
        buildTimerText = `${formatDurationCountdownVi(remainSec)}${reducedSec > 0 ? ` (−${formatDurationCompactVi(reducedSec)})` : ''}`;
        buildPctText = `${buildPctVal}%`;
        buildSig = `1:${reducedSec}:${reducibleSec > 0 ? 1 : 0}:${canTriggerSpeedup ? 1 : 0}:${hud.sim.state.morningDewPhials ?? 0}`;
      }

      let prodCycText = '';
      if (!isBuilding && !b.awaitingUnveil && item.baseIncome > 0 && item.cycleSec > 0 && !item.isFarmlandPlot && !item.isAnimalPasturePlot) {
        const festSpeed = hud.sim.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
        const baseCycle = getBuildingEffectiveCycleSec(b, item);
        const effCycle = Math.max(1, baseCycle * festSpeed);
        const rawEl = Math.max(0, (now - (b.lastTickAt || now)) / 1000);
        const cycLeft = Math.max(1, Math.ceil(effCycle - (rawEl % effCycle)));
        prodCycText = formatDurationCountdownVi(cycLeft);
      }

      const bio = item.isCreatureHabitat ? hud.sim.biomeCache.get(b.uid) : undefined;
      const backstage = item.isBackstage ? hud.sim.backstageCache.get(b.uid) : undefined;

      const inspStructSig = [
        b.uid,
        b.itemId,
        b.stars,
        b.rotation,
        b.awaitingUnveil ? 1 : 0,
        isConnected ? 1 : 0,
        synGold.toFixed(2),
        b.visitorsServed,
        queueCount,
        b.storedSickle,
        prod.galleons,
        prod.xp,
        Math.round(b.durability),
        b.isBrokenDown ? 1 : 0,
        b.creatureBondLevel ?? 1,
        b.creatureStage ?? '',
        Math.round(b.creatureHunger ?? 90),
        bio?.score ?? 50,
        backstage ? `${backstage.shieldCount}/${backstage.needed}` : '',
        hud.sim.state.level,
        hud.sim.state.sandboxMode ? 1 : 0,
        hud.sim.isVisitingNeighbor ? 1 : 0,
        !isBuilding && hud.sim.canStashBuilding(b.uid) ? 1 : 0,
        hud.sim.getActiveFestival(),
        buildSig,
        cropSig,
        pastureSig,
        wsSig,
      ].join('#');

      if (!panel.classList.contains('hidden') && panel.dataset.inspSig === inspStructSig) {
        const setLiveText = (key: string, val: string) => {
          const el = panel.querySelector(`[data-insp-live="${key}"]`);
          if (el && el.textContent !== val) el.textContent = val;
        };
        if (cropLeftText) {
          setLiveText('crop-timer', cropLeftText);
          const bar = panel.querySelector<HTMLElement>('[data-insp-live="crop-bar"]');
          if (bar) bar.style.width = `${cropGrowPct}%`;
        }
        if (pastureLeftText) {
          setLiveText('pasture-timer', pastureLeftText);
          const bar = panel.querySelector<HTMLElement>('[data-insp-live="pasture-bar"]');
          if (bar) bar.style.width = `${pastureGrazePct}%`;
        }
        if (wsSig !== 'none') {
          setLiveText('ws-timer', wsLeftText);
        }
        if (isBuilding) {
          setLiveText('build-timer', buildTimerText);
          setLiveText('build-pct', buildPctText);
          const bBar = panel.querySelector<HTMLProgressElement>('[data-insp-live="build-bar"]');
          if (bBar) bBar.value = buildPctVal;
        }
        if (prodCycText) {
          setLiveText('prod-cycle', prodCycText);
        }
        return;
      }
      panel.dataset.inspSig = inspStructSig;

      const stageNames: Record<string, string> = {
        egg: '🥚 Trứng',
        baby: '🐣 Non',
        adult: '🦄 Trưởng thành',
        legendary: '🌟 Huyền thoại',
      };

      const hasPriceSlider = false;
      const priceBounds = getItemPriceBounds(item);
      const curPrice = hud.sim.getEffectivePrice(b, item);
      const priceVerdict = hud.sim.getPriceValueVerdict(b, item);

      const farmlandHtml =
        item.isFarmlandPlot && !isBuilding
          ? (() => {
              if (!b.cropId) {
                const soilEntry = hud.sim.state.plotSoilState?.[`${b.gx},${b.gy}`];
                const fatigueStep = Math.max(b.harvestCycleCount ?? 0, soilEntry?.fatigueStep ?? 0);
                const allCropList = Object.values(FARM_CROPS).sort(
                  (a, c) => a.unlockLevel - c.unlockLevel || a.growSec - c.growSec
                );
                const filteredList = allCropList.filter((c) => {
                  if (hud.seedFilterMode === 'flowers') return Boolean(c.isFlowerCrop);
                  if (hud.seedFilterMode === 'crops') return !c.isFlowerCrop;
                  return true;
                });
                const filterPills = (
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
                        data-insp-seed-filter="${f.id}"
                        aria-pressed="${hud.seedFilterMode === f.id}"
                      >${f.label}</button>
                    `
                  )
                  .join('');
                const seedCards = filteredList
                  .map((crop) => {
                    const lockedCrop =
                      !hud.sim.state.sandboxMode && hud.sim.state.level < crop.unlockLevel;
                    const seedCount = hud.sim.getSeedCount(crop.id);
                    const curFamily = getCropFamily(crop.id);
                    const rotatedFamily = Boolean(
                      soilEntry && soilEntry.lastFamily !== curFamily
                    );
                    const mastery = hud.sim.state.cropMastery?.[crop.id] ?? 0;
                    const strat = computeStrategicPlotGrowSeconds(
                      fatigueStep,
                      rotatedFamily,
                      mastery,
                      crop.growSec
                    );
                    const growLabel = `${formatDurationCompactVi(strat.growSec)}${
                      strat.isRotatedBonus ? ' · ×2' : ''
                    }`;
                    return `
                      <div class="seed-card-slot ${lockedCrop ? 'locked' : ''} ${!lockedCrop && seedCount <= 0 ? 'out-of-seeds' : ''}">
                        <button
                          type="button"
                          class="seed-card seed-tray-card ${lockedCrop ? 'locked' : ''} ${!lockedCrop && seedCount <= 0 ? 'out-of-seeds' : ''}"
                          data-plant-crop="${crop.id}"
                          ${lockedCrop ? 'disabled' : ''}
                        >
                          <span class="seed-card-seed-badge ${lockedCrop ? 'is-locked' : seedCount > 0 ? 'has-seed' : 'no-seed'}">
                            ${lockedCrop ? `Cấp ${crop.unlockLevel}` : `×${seedCount}`}
                          </span>
                          <img src="${getFarmItemIconSrc(crop.id)}" alt="${escapeHtml(crop.name)}" class="seed-card-img" />
                          <span class="seed-card-name">${escapeHtml(crop.name)}</span>
                          <span class="seed-card-meta">${growLabel}</span>
                        </button>
                        ${
                          !lockedCrop
                            ? `<button type="button" class="seed-card-add-btn" data-insp-buy-seed="${crop.id}" aria-label="Mua 1 hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')} Sickle)" title="Mua 1 hạt ${escapeHtml(crop.name)} (${crop.seedCost.toLocaleString('vi-VN')} Sickle)">+ 🪙${hud.sim.state.sandboxMode ? '0' : crop.seedCost.toLocaleString('vi-VN')}</button>`
                            : ''
                        }
                      </div>
                    `;
                  })
                  .join('');
                const familyLabelMap: Record<string, string> = {
                  grain: 'Lúa mạch/Ngũ cốc',
                  produce: 'Rau củ quả',
                  flower: 'Hoa cảnh',
                  magical: 'Thảo dược phép',
                };
                const soilHintHtml = soilEntry?.lastFamily
                  ? `<div class="hs-insp-note">Luân canh ×2 · Khác họ <strong>${familyLabelMap[soilEntry.lastFamily] ?? soilEntry.lastFamily}</strong></div>`
                  : '';
                return `
                  <div class="ws-inspector-board">
                    <div class="ws-board-title" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                      <span>Chọn hạt</span>
                      <button id="btnInspOpenSeedQuiz" type="button" class="brass-btn sq-tray-quiz-cta">
                        Đố nhận hạt
                      </button>
                    </div>
                    ${soilHintHtml}
                    <div class="seed-filter-bar" role="group" aria-label="Bộ lọc hạt giống" style="margin-bottom:6px;">${filterPills}</div>
                    <div class="seed-picker-grid">${seedCards}</div>
                  </div>
                `;
              }

              const cropDef = FARM_CROPS[b.cropId];
              const readyAt = b.cropReadyAt ?? now;
              const masteryCount = hud.sim.state.cropMastery?.[cropDef.id] ?? 0;
              const fallbackDurSec = computeStrategicPlotGrowSeconds(
                0,
                false,
                masteryCount,
                cropDef.growSec
              ).growSec;
              const plantedAt = b.cropPlantedAt ?? readyAt - fallbackDurSec * 1000;
              const cropLeftSec = Math.max(0, Math.ceil((readyAt - now) / 1000));
              const isRipe = cropLeftSec <= 0;
              const masteryInfo = getCropMasteryTierInfo(masteryCount);
              const dewPhials = Math.max(0, hud.sim.state.morningDewPhials ?? 0);
              const effectiveYield = cropDef.yieldQty * (b.cropRotatedBonus ? 2 : 1);
              const growPct = isRipe
                ? 100
                : Math.max(
                    6,
                    Math.min(98, Math.round(((now - plantedAt) / Math.max(1000, readyAt - plantedAt)) * 100))
                  );
              return `
                <div class="ws-inspector-board">
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
                    <img src="${getFarmItemIconSrc(cropDef.id)}" alt="${escapeHtml(cropDef.name)}" style="width:40px;height:40px;object-fit:contain;" />
                    <div style="flex:1;min-width:0;">
                      <div class="hs-insp-name">${escapeHtml(cropDef.name)} <span class="hs-insp-meta">· Bậc ${masteryInfo.labelRom}</span></div>
                      <div class="hs-insp-stat" data-insp-live="crop-timer">
                        ${isRipe ? 'Chín' : formatDurationCountdownVi(cropLeftSec)}${b.cropRotatedBonus ? ' · ×2' : ''}
                      </div>
                      <div class="hs-insp-meta">${masteryCount} vụ</div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="crop-bar" style="width:${growPct}%"></div>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${
                      isRipe
                        ? `
                          <button id="btnInspHarvestCrop" type="button" class="owl-green-send-btn" style="width:100%;">
                            <img src="/game/trang-trai-hang-soc/sprites/ui_icon_golden_sickle.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                            Gặt +${effectiveYield}
                          </button>
                        `
                        : !b.cropWateredBoost
                          ? `
                            <button id="btnInspWaterCrop" type="button" class="brass-btn gold-cta" style="flex:1;">
                              <img src="/game/trang-trai-hang-soc/sprites/ui_icon_watering_can.webp" alt="" style="width:18px;height:18px;object-fit:contain;vertical-align:-3px;margin-right:4px;" />
                              Tưới −30%
                            </button>
                          `
                          : `<div class="hs-insp-meta" style="flex:1;text-align:center;padding:8px 4px;">Đã tưới</div>`
                    }
                    ${
                      !isRipe && (dewPhials > 0 || hud.sim.state.sandboxMode)
                        ? `<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            Sương Mai ×${dewPhials}
                          </button>`
                        : ''
                    }
                  </div>
                </div>
              `;
            })()
          : '';

      const workshopBoardHtml =
        item.workshopGroupId && !isBuilding
          ? (() => {
              const recipes = hud.sim.getWorkshopRecipesForBuilding(item);
              const queue = b.workshopQueue ?? [];
              const readyGoods = b.readyFarmGoods ?? [];
              const maxSlots = getWorkshopMaxQueueSlots(b.stars);
              const starSpeedMult = getWorkshopStarSpeedMultiplier(b.stars);

              const readyShelfHtml =
                readyGoods.length > 0
                  ? `
                    <div class="ws-ready-shelf">
                      <div class="ws-ready-icons">
                        ${readyGoods
                          .slice(0, 5)
                          .map((gid) => {
                            const gMeta = FARM_GOODS[gid];
                            return `<img src="/game/trang-trai-hang-soc/sprites/${gMeta.iconKey}.webp" alt="${escapeHtml(gMeta.name)}" title="${escapeHtml(gMeta.name)}" class="ws-ready-good-img" />`;
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
                  const recipeTitle = rec.name ?? outMeta.name;
                  const altGoodHint =
                    rec.name && rec.name !== outMeta.name
                      ? `title="Ra lò thành phẩm: ${escapeHtml(outMeta.name)}"`
                      : '';
                  const lockedRec =
                    !hud.sim.state.sandboxMode && hud.sim.state.level < rec.unlockLevel;
                  const canCraft =
                    !lockedRec &&
                    (hud.sim.state.sandboxMode ||
                      rec.inputs.every((inp) => hud.sim.getFarmItemCount(inp.itemId) >= inp.qty));
                  const reqFormula = rec.inputs
                    .map((inp) => {
                      const im = getFarmItemMeta(inp.itemId);
                      const have = hud.sim.getFarmItemCount(inp.itemId);
                      const ok = hud.sim.state.sandboxMode || have >= inp.qty;
                      return `<span class="ws-ing-chip ${ok ? 'ok' : 'lack'}">${escapeHtml(im.name)} ${hud.sim.state.sandboxMode ? '∞' : have}/${inp.qty}</span>`;
                    })
                    .join(' ');
                  return `
                    <button
                      type="button"
                      class="ws-recipe-card ${canCraft ? 'craftable' : ''} ${lockedRec ? 'locked' : ''}"
                      data-ws-enqueue="${rec.id}"
                      ${altGoodHint}
                      ${lockedRec ? 'disabled' : ''}
                    >
                      <div class="ws-recipe-name">${escapeHtml(recipeTitle)}</div>
                      <div class="ws-recipe-art-wrap">
                        <img src="/game/trang-trai-hang-soc/sprites/${outMeta.iconKey}.webp" alt="${escapeHtml(recipeTitle)}" class="ws-recipe-img" />
                        ${canCraft ? '<span class="ws-check-dot">✓</span>' : ''}
                      </div>
                      <div class="ws-recipe-ings">
                        ${lockedRec ? `🔒 Lv.${rec.unlockLevel}` : reqFormula}
                      </div>
                      <div class="ws-recipe-time">⏱️ ${formatDurationCompactVi(Math.max(5, Math.round(rec.craftSec * starSpeedMult)))}</div>
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
                      <img src="/game/trang-trai-hang-soc/sprites/${sMeta.iconKey}.webp" alt="${escapeHtml(sMeta.name)}" class="ws-slot-img" />
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
                    <span style="font-size:11px;font-weight:700;opacity:0.65;">Trống</span>
                  </div>
                `;
              }).join('');

              return `
                <div class="ws-inspector-board">
                  ${readyShelfHtml}
                  <div class="ws-recipe-grid">${recipeCardsHtml}</div>
                  <div class="ws-oven-strip">
                    <div class="ws-oven-hearth ${activeSlot ? 'baking' : ''}">
                      <div class="ws-oven-arch">
                        ${
                          activeMeta
                            ? `<img src="/game/trang-trai-hang-soc/sprites/${activeMeta.iconKey}.webp" alt="${escapeHtml(activeMeta.name)}" class="ws-oven-good-img" />`
                            : `<span style="font-size:18px;">🪵</span>`
                        }
                      </div>
                      <div class="ws-oven-caption">
                        ${
                          activeSlot
                            ? `<strong data-insp-live="ws-timer">${formatDurationCountdownVi(activeLeftSec)}</strong>`
                            : `<strong data-insp-live="ws-timer">Trống</strong>`
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
                      !hud.sim.state.sandboxMode && hud.sim.state.level < animal.unlockLevel;
                    return `
                      <button
                        type="button"
                        class="seed-card ${lockedAnimal ? 'locked' : ''}"
                        data-stock-animal="${animal.id}"
                        ${lockedAnimal ? 'disabled' : ''}
                      >
                        <span class="seed-card-seed-badge ${lockedAnimal ? 'is-locked' : 'has-seed'}">
                          ${lockedAnimal ? `Cấp ${animal.unlockLevel}` : `🪙${animal.cost.toLocaleString('vi-VN')}`}
                        </span>
                        <img src="/game/trang-trai-hang-soc/sprites/${animal.spritePair[0]}.webp" alt="${escapeHtml(animal.name)}" class="seed-card-img pasture-card-img" />
                        <span class="seed-card-name">${escapeHtml(animal.name)}</span>
                        <span class="seed-card-meta">${formatDurationCompactVi(animal.cycleSec)} · +🪙${animal.sellValue}</span>
                      </button>
                    `;
                  })
                  .join('');
                return `
                  <div class="ws-inspector-board">
                    <div class="ws-board-title">
                      <span>Chọn thú</span>
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
                    <img src="/game/trang-trai-hang-soc/sprites/${animalDef.spritePair[0]}.webp" alt="${escapeHtml(animalDef.name)}" style="width:46px;height:46px;object-fit:contain;" />
                    <div style="flex:1;">
                      <div class="hs-insp-title">${escapeHtml(animalDef.name)}</div>
                      <div style="font-size:12px;font-weight:700;opacity:0.86;" data-insp-live="pasture-timer">
                        ${
                          isReady
                            ? `🧺 +${animalDef.sellValue} Sickle${prodMeta ? ` +${animalDef.yieldQty} ${escapeHtml(prodMeta.name)}` : ''}`
                            : `⏱️ ${formatDurationCountdownVi(leftSec)}`
                        }
                      </div>
                    </div>
                  </div>
                  <div class="quest-bar" style="height:8px;margin-bottom:8px;">
                    <div class="quest-bar-fill" data-insp-live="pasture-bar" style="width:${grazePct}%"></div>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    ${
                      isReady
                        ? `
                          <button id="btnInspHarvestPasture" type="button" class="owl-green-send-btn" style="flex:1;padding:8px 12px;font-size:13px;">
                            🧺 Thu (+${animalDef.sellValue} Sickle)
                          </button>
                        `
                        : !b.pastureFedBoost
                          ? `
                            <button id="btnInspFeedPasture" type="button" class="brass-btn gold-cta" style="flex:1;">
                              🌾 Cho ăn (-35%)
                            </button>
                          `
                          : `<div style="flex:1;font-size:12px;font-weight:700;text-align:center;opacity:0.88;padding:6px 4px;">🌾 Đã cho ăn</div>`
                    }
                    <button id="btnInspClearPasture" type="button" class="brass-btn" title="Đổi thú">
                      🔄 Đổi
                    </button>
                    ${
                      !isReady && ((hud.sim.state.morningDewPhials ?? 0) > 0 || hud.sim.state.sandboxMode)
                        ? `<button type="button" class="brass-btn" data-use-morning-dew="1" style="flex:1;" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">
                            🧪 -15p (×${hud.sim.state.morningDewPhials ?? 0})
                          </button>`
                        : ''
                    }
                  </div>
                </div>
              `;
            })()
          : '';

      const typeOrVisits = `${
        item.isFarmlandPlot
          ? 'Ruộng'
          : item.isAnimalPasturePlot
            ? 'Đồng cỏ'
            : item.connectableGroup === 'flower_garden'
              ? 'Vườn hoa'
              : item.workshopGroupId
                ? 'Xưởng'
                : `${b.visitorsServed} lượt`
      }${isRide ? ` · ${queueCount}/${MAX_RIDE_QUEUE}` : ''}`;

      panel.classList.remove('hidden');
      panel.classList.toggle(
        'inspector-wide-ws',
        Boolean(
          (item.workshopGroupId || item.isFarmlandPlot || item.isAnimalPasturePlot) && !isBuilding
        )
      );
      hud.syncHudFocusVisibility();
      const inspThumbSrc = getCatalogCardImageSrc(item);
      panel.innerHTML = `
        <div class="inspector-header-bar">
          <div class="hs-insp-head-main">
            ${inspThumbSrc ? `<img src="${inspThumbSrc}" alt="${escapeHtml(item.name)}" class="inspector-thumb" />` : ''}
            <div class="hs-insp-head-copy">
              <div class="hs-insp-title">${escapeHtml(item.name)}</div>
              <div class="hs-insp-meta"><span class="hs-insp-stars-inline">${'★'.repeat(b.stars)}${'☆'.repeat(5 - b.stars)}</span> · ${typeOrVisits}${!isConnected ? ' · <span class="hs-insp-warn">Chưa nối đường</span>' : ''}${synGold > 1 ? ` · +${Math.round((synGold - 1) * 100)}%` : ''}</div>
            </div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        ${farmlandHtml}
        ${pastureHtml}
        ${workshopBoardHtml}

        ${
          item.producesIngredient && !isBuilding
            ? `<div class="hs-insp-drop-meta">Rơi: <strong>${RAW_INGREDIENTS_INFO[item.producesIngredient].name}</strong></div>`
            : ''
        }

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
                const floorSec = hud.sim.getBuildingMinFloorSec(b);
                const reducibleSec = Math.max(0, remainSec - floorSec);
                const hasOtherReducible =
                  reducibleSec <= 0 &&
                  hud.sim
                    .getActiveConstructions(now)
                    .some(
                      (x) =>
                        x.uid !== b.uid &&
                        Math.ceil((x.constructEndsAt - now) / 1000) > hud.sim.getBuildingMinFloorSec(x)
                    );
                const canTriggerSpeedup = reducibleSec > 0 || hasOtherReducible;
                const progLabel = item.isCreatureHabitat
                  ? 'Tiến độ ấp trứng'
                  : 'Tiến độ xây dựng';
                return `
                  <div class="hs-insp-build-wrap">
                    <div class="hs-insp-build-head">
                      <span>${item.isCreatureHabitat ? 'Đang ấp' : 'Đang xây'} · <strong data-insp-live="build-timer">${formatDurationCountdownVi(remainSec)}${
                        reducedSec > 0 ? ` (−${formatDurationCompactVi(reducedSec)})` : ''
                      }</strong></span>
                      <span data-insp-live="build-pct">${buildPct}%</span>
                    </div>
                    <progress class="ts-build-progress" data-insp-live="build-bar" max="100" value="${buildPct}" aria-label="${progLabel}"></progress>
                    <div class="hs-insp-actions-row">
                      <button id="btnInspPlayMinigameSpeed" type="button" class="brass-btn gold-cta hs-insp-speed-btn" ${canTriggerSpeedup ? '' : 'disabled'} title="Thắng 1 màn trừ 30–75p giờ xây">Khảo thí −30p</button>
                      <button id="btnInspQuizSpeed" type="button" class="brass-btn hs-insp-speed-btn" ${canTriggerSpeedup ? '' : 'disabled'} title="Đố ngoại ngữ trừ 10–25p giờ xây">Thần chú −10p</button>
                      ${
                        reducibleSec > 0 && ((hud.sim.state.morningDewPhials ?? 0) > 0 || hud.sim.state.sandboxMode)
                          ? `<button type="button" class="brass-btn" data-use-morning-dew="1" title="Dùng 1 Bình Sương Mai rút ngắn 15 phút">−15p ×${hud.sim.state.morningDewPhials ?? 0}</button>`
                          : ''
                      }
                      ${
                        hud.sim.state.sandboxMode
                          ? `<button id="btnFinishNowSand" type="button" class="brass-btn" title="Hoàn tất ngay">Xong</button>`
                          : ''
                      }
                      ${
                        !b.isIndestructible
                          ? `<button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình">Dời</button>`
                          : ''
                      }
                    </div>
                  </div>
                `;
              })()
            : b.awaitingUnveil
              ? `
                <div class="hs-insp-actions-row">
                  <button id="btnInspUnveilBuilding" type="button" class="brass-btn gold-cta" style="flex:1;">Cắt băng khánh thành</button>
                </div>
              `
              : item.baseIncome > 0
              ? (() => {
                  const festSpeed =
                    hud.sim.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
                  const baseCycle = getBuildingEffectiveCycleSec(b, item);
                  // HPVN: a stocked pasture pays the animal's own values (same numbers as the tray and the harvest)
                  const pastureAnimal = item.isAnimalPasturePlot && b.pastureAnimalId ? PASTURE_ANIMALS[b.pastureAnimalId] : null;
                  const effCycle = Math.max(1, baseCycle * festSpeed);
                  const rawEl = Math.max(0, (now - (b.lastTickAt || now)) / 1000);
                  const cycLeft = Math.max(1, Math.ceil(effCycle - (rawEl % effCycle)));
                  return `
                    <div class="hs-insp-prod-row">
                      <div class="hs-insp-prod-copy">
                        <strong id="lblBuildingProdVal">+${pastureAnimal?.sellValue ?? prod.galleons}🪙 +${pastureAnimal?.xp ?? prod.xp}⭐</strong> / ${formatDurationCompactVi(pastureAnimal?.cycleSec ?? baseCycle)}${
                          item.cycleSec > 0 && !item.isFarmlandPlot && !item.isAnimalPasturePlot
                            ? ` · <span data-insp-live="prod-cycle">${formatDurationCountdownVi(cycLeft)}</span>`
                            : ''
                        } · Kho: <strong>${b.storedSickle}🪙</strong>
                      </div>
                      ${
                        b.storedSickle > 0
                          ? `<button id="btnCollectSingle" type="button" class="brass-btn gold-cta">Thu +${b.storedSickle} Sickle</button>`
                          : ''
                      }
                    </div>
                  `;
                })()
              : ''
        }

        ${
          isRide && !isBuilding && !item.isFlooPortal && b.isBrokenDown
            ? `
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
                  <span>Độ bền</span>
                  <span style="color:${b.isBrokenDown ? '#dc2626' : b.durability < 50 ? '#b45309' : '#15803d'};">${Math.round(b.durability)}%</span>
                </div>
                <progress max="100" value="${Math.round(b.durability)}" aria-label="Độ bền"></progress>
                ${
                  b.isBrokenDown || b.durability < 98
                    ? `<button id="btnRepairRide" type="button" class="brass-btn ${b.isBrokenDown ? 'gold-cta' : ''}" style="width:100%;margin-top:6px;">Sửa (0 Sickle)</button>`
                    : ''
                }
              </div>
            `
            : ''
        }

        ${
          hasPriceSlider
            ? `
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <label for="inpBuildingPrice" style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px;">
                  <span>Giá (${priceBounds.min}–${priceBounds.max})</span>
                  <span id="lblBuildingPriceVal">${curPrice} Sickle</span>
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
              <div class="hs-insp-prod-row">
                <span class="hs-insp-prod-copy">Ray ${b.coasterStats.lengthMeters}m · Hứng khởi ${b.coasterStats.excitement}/10</span>
                <button id="btnAutoLoopCoaster" type="button" class="brass-btn gold-cta">Tự lắp ray</button>
              </div>
            `
            : ''
        }

        ${
          canRideCam
            ? `
              <button id="btnEnterRideCam" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Ride Cam</button>
            `
            : ''
        }

        ${
          (item.isWorkshopBrewery || item.producesIngredient || item.isFireworksLauncher) && !isBuilding
            ? `
              <div class="hs-insp-actions-row" style="margin-bottom:6px;">
                <button id="btnInspOpenWorkshop" type="button" class="brass-btn gold-cta" style="flex:1;">Xưởng</button>
                ${
                  item.isFireworksLauncher
                    ? `<button id="btnInspFireworks" type="button" class="brass-btn" style="flex:1;">Pháo hoa</button>`
                    : ''
                }
              </div>
            `
            : ''
        }

        ${
          item.isCreatureHabitat && !isBuilding
            ? `
              <div class="quest-card-mini" style="margin-bottom:6px;font-size:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
                  <strong>${escapeHtml(b.creatureNickname || item.creatureName || item.name)}</strong>
                  <span class="morph-pill ${b.creatureMorph === 'radiant' ? 'radiant' : b.creatureMorph === 'mystic' ? 'mystic' : ''}">
                    ${MORPH_INFO[b.creatureMorph ?? 'normal'].badge}
                  </span>
                </div>
                <div>Lv.${b.creatureBondLevel ?? 1}/${MAX_BOND_LEVEL} · ${stageNames[b.creatureStage ?? 'baby']} · Môi trường ${bio?.score ?? 50}% · No ${Math.round(b.creatureHunger ?? 90)}%</div>
                <div class="hs-insp-actions-row" style="margin-top:6px;">
                  <button id="btnFeedBeast" type="button" class="brass-btn" style="flex:1;">Cho ăn</button>
                  <button id="btnInspOpenSuitcase" type="button" class="brass-btn gold-cta" style="flex:1;">Vali</button>
                </div>
              </div>
            `
            : ''
        }

        ${
          item.isBackstage && backstage && !isBuilding
            ? `
              <div class="hs-insp-drop-meta" style="color:${backstage.isShielded ? '#15803d' : '#dc2626'};">
                Che chắn: ${backstage.shieldCount}/${backstage.needed} ${backstage.isShielded ? '✓ (+25% Sickle)' : ''}
              </div>
            `
            : ''
        }

        ${
          item.id === 'burrow_honeydukes_canon' && !isBuilding
            ? `
              <button id="btnInspOpenHoneydukesMatch3" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:6px;">Vào Bùa Gặt Honeydukes</button>
            `
            : ''
        }

        ${
          (item.id === 'burrow_owl_post' || item.id === 'eeylops_owl_emporium') && !isBuilding
            ? `<button id="btnInspOpenOwlOrders" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Bảng Đơn Hàng Cú</button>`
            : ''
        }
        ${
          item.id === 'burrow_feast_marquee' && !isBuilding
            ? `<button id="btnInspOpenFeastMarquee" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Đại Tiệc Mùa Gặt</button>`
            : ''
        }
        ${
          item.id === 'floo_fireplace_gate' && !isBuilding
            ? `<button id="btnInspOpenNeighbors" type="button" class="brass-btn gold-cta" style="width:100%;margin-bottom:8px;">Mở Sổ Hàng Xóm &amp; Cổng Floo</button>`
            : ''
        }
        ${
          !isBuilding
            ? `<div class="hs-insp-actions-row">
                ${
                  b.stars < 5
                    ? `<button id="btnUpgStar" type="button" class="brass-btn hs-insp-upg-btn">${
                        item.workshopGroupId
                          ? `Nâng ${b.stars + 1}★ (+1 khay, −8% giờ lò)`
                          : `Nâng ${b.stars + 1}★`
                      } · 🌟${getUpgradePuzzleStarCost(b.stars, item)} + 🪙${upgCost.toLocaleString('vi-VN')}</button>`
                    : `<span class="hs-insp-max-stars">5★ Tối đa</span>`
                }
              </div>`
            : ''
        }
        ${
          !b.isIndestructible && !hud.sim.isVisitingNeighbor
            ? `<div class="inspector-build-actions ${!isBuilding && hud.sim.canStashBuilding(b.uid) ? 'has-stash' : ''}" role="group" aria-label="Thao tác công trình">
                <button id="btnMoveThis" type="button" class="brass-btn hs-insp-move-btn" title="Dời công trình miễn phí (0 Sickle)">Dời</button>
                <button id="btnRotateThis" type="button" class="brass-btn" title="Xoay hướng công trình 90°">Xoay</button>
                ${
                  !isBuilding && hud.sim.canStashBuilding(b.uid)
                    ? `<button id="btnStashThis" type="button" class="brass-btn hs-insp-stash-btn" title="Cất vào Kho Trang Trí (đặt lại miễn phí 0 Sickle)">Cất</button>`
                    : ''
                }
                <button id="btnDeleteThis" type="button" class="brass-btn inspector-delete-btn" title="Xóa công trình">Xóa</button>
              </div>`
            : ''
        }
      `;

      const priceInput = panel.querySelector('#inpBuildingPrice') as HTMLInputElement | null;
      if (priceInput) {
        hud.wireRangeProgressFallback(priceInput);
        priceInput.addEventListener('input', () => {
          const v = Number(priceInput.value);
          hud.sim.setBuildingCustomPrice(b.uid, v);
          const curEff = hud.sim.getEffectivePrice(b, item);
          const lblVal = panel.querySelector('#lblBuildingPriceVal');
          if (lblVal) lblVal.textContent = `${curEff} Sickle`;
          const verd = hud.sim.getPriceValueVerdict(b, item);
          const lblVerd = panel.querySelector('#lblPriceVerdict') as HTMLElement | null;
          if (lblVerd) {
            lblVerd.textContent = verd.label;
            lblVerd.style.color = verd.color;
          }
          const liveProd = hud.sim.getBuildingProductionPerCycle(b, item);
          const lblProd = panel.querySelector('#lblBuildingProdVal');
          if (lblProd) {
            lblProd.textContent = `+${liveProd.galleons} 🪙 & +${liveProd.xp} ⭐`;
          }
        });
      }

      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspUnveilBuilding')?.addEventListener('click', () => {
        hud.sim.unveilBuilding(b.uid);
        hud.inspectSelection = null;
        hud.refreshAll();
      });
      panel.querySelector('#btnInspPlayMinigameSpeed')?.addEventListener('click', () => {
        hud.sim.preferredSpeedupBuildingUid = b.uid;
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openTrialMinigame();
      });
      panel.querySelector('#btnInspQuizSpeed')?.addEventListener('click', () => {
        hud.sim.preferredSpeedupBuildingUid = b.uid;
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openSeedQuizDialog(hud.activeSeedCropId ?? 'ottery_wheat');
      });
      panel.querySelector('#btnFinishNowSand')?.addEventListener('click', () => {
        hud.sim.speedUpWithTimeSand(b.uid, true);
        inspectorRenderInspector(hud);
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-use-morning-dew]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const res = hud.sim.useMorningDewPhial(b.uid);
          hud.showToast(res.msg, res.ok ? '🧪' : '⏳');
          inspectorRenderInspector(hud);
          hud.refreshHeader();
        });
      });
      panel.querySelector('#btnCollectSingle')?.addEventListener('click', () => {
        hud.sim.harvestBuildingBubble(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspOpenSeedQuiz')?.addEventListener('click', () => {
        const targetUid = b.uid;
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openSeedQuizDialog(hud.activeSeedCropId ?? 'ottery_wheat', targetUid);
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-plant-crop]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const cid = btn.dataset.plantCrop as FarmCropId;
          const res = hud.sim.plantCropOnPlot(b.uid, cid);
          if (res.needSeedAcquire) {
            const targetUid = b.uid;
            hud.activeSeedCropId = null;
            hud.inspectSelection = null;
            hud.refreshAll();
            hud.openSeedQuizDialog(cid, targetUid);
            return;
          }
          hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
          if (res.ok) {
            hud.activeSeedCropId = null;
            hud.seedTrayOpen = false;
            hud.inspectSelection = null;
            hud.refreshAll();
            return;
          }
          inspectorRenderInspector(hud);
          hud.renderSeedTray();
          hud.refreshFloatingBanner();
        });
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-insp-buy-seed]').forEach((btn) => {
        btn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          const cid = btn.dataset.inspBuySeed as FarmCropId;
          const res = hud.sim.buyCropSeedWithGold(cid, 1);
          hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
          if (res.ok) {
            inspectorRenderInspector(hud);
            hud.renderSeedTray();
            hud.refreshHeader();
          }
        });
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-insp-seed-filter]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const f = btn.dataset.inspSeedFilter as 'all' | 'flowers' | 'crops';
          if (f === 'all' || f === 'flowers' || f === 'crops') {
            hud.seedFilterMode = f;
            inspectorRenderInspector(hud);
          }
        });
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-stock-animal]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const aid = btn.dataset.stockAnimal as PastureAnimalId;
          const res = hud.sim.stockAnimalOnPasture(b.uid, aid);
          hud.showToast(res.msg, res.ok ? PASTURE_ANIMALS[aid]?.emoji ?? '🐾' : '🪙');
          if (res.ok) {
            hud.activePastureAnimalId = null;
            hud.pastureTrayOpen = false;
            hud.inspectSelection = null;
            hud.refreshAll();
            return;
          }
          inspectorRenderInspector(hud);
        });
      });
      panel.querySelector('#btnInspFeedPasture')?.addEventListener('click', () => {
        const res = hud.sim.feedAnimalPasture(b.uid);
        hud.showToast(res.msg, res.ok ? '🌾' : '⏳');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspHarvestPasture')?.addEventListener('click', () => {
        const res = hud.sim.harvestAnimalPasture(b.uid);
        hud.showToast(res.msg, res.ok ? '🧺' : '⏳');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspClearPasture')?.addEventListener('click', () => {
        const res = hud.sim.clearAnimalFromPasture(b.uid);
        hud.showToast(res.msg, res.ok ? '🐾' : '⚠️');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspWaterCrop')?.addEventListener('click', () => {
        const res = hud.sim.waterCropPlot(b.uid);
        hud.showToast(res.msg, res.ok ? '💧' : '⏳');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspHarvestCrop')?.addEventListener('click', () => {
        const res = hud.sim.harvestCropPlot(b.uid);
        hud.showToast(res.msg, res.ok ? '🌾' : '🏡');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspCollectGoods')?.addEventListener('click', () => {
        hud.sim.harvestBuildingBubble(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelectorAll<HTMLButtonElement>('[data-ws-enqueue]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const rid = btn.dataset.wsEnqueue!;
          const res = hud.sim.enqueueWorkshopRecipe(b.uid, rid);
          hud.showToast(res.msg, res.ok ? '🔥' : '🧺');
          inspectorRenderInspector(hud);
        });
      });
      panel.querySelector('#btnInspSpeedSlot')?.addEventListener('click', () => {
        hud.sim.speedUpWorkshopSlot(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnRepairRide')?.addEventListener('click', () => {
        hud.sim.repairBuilding(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnAutoLoopCoaster')?.addEventListener('click', () => {
        hud.sim.autoBuildCoasterForStation(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnEnterRideCam')?.addEventListener('click', () => {
        hud.rideCamUid = b.uid;
        hud.inspectSelection = null;
        inspectorRenderInspector(hud);
        hud.refreshFloatingBanner();
        hud.showToast(`🎥 Đang ngồi thử trên "${item.name}"! Nhấn Esc hoặc nút Rời Tàu để thoát.`, '🎢');
      });
      panel.querySelector('#btnInspOpenWorkshop')?.addEventListener('click', () => {
        hud.openWorkshopDialog('brew');
      });
      panel.querySelector('#btnInspFireworks')?.addEventListener('click', () => {
        hud.sim.launchFireworksShow(10);
        hud.showToast('🎆 Rồng Lửa bay vút lên bầu trời đêm!', '🎆');
      });
      panel.querySelector('#btnFeedBeast')?.addEventListener('click', () => {
        hud.sim.feedCreature(b.uid);
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnInspOpenSuitcase')?.addEventListener('click', () => {
        hud.openSuitcaseDialog('care', b.uid);
      });
      panel.querySelector('#btnInspOpenHoneydukesMatch3')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openMatch3Dialog();
      });
      panel.querySelector('#btnInspOpenOwlOrders')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        hud.activeQuestTab = 'orders';
        hud.refreshAll();
        hud.renderQuestDialog();
        (hud.root.querySelector('#questDialog') as HTMLDialogElement | null)?.showModal();
      });
      panel.querySelector('#btnInspOpenFeastMarquee')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openHarvestFeastDialog();
      });
      panel.querySelector('#btnInspOpenNeighbors')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openNeighborDialog('friends');
      });
      panel.querySelector('#btnUpgStar')?.addEventListener('click', () => {
        const res = hud.sim.upgradeBuildingStar(b.uid);
        hud.showToast(res.msg, res.ok ? '🌟' : '🪙');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnMoveThis')?.addEventListener('click', () => {
        clearBuildToolModes(hud);
        hud.moveModeActive = true;
        hud.moveKeepActiveAfterDrop = false;
        hud.movingBuildingUid = b.uid;
        hud.rotation = b.rotation;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        hud.onStartMoveBuilding?.(b.uid);
        hud.refreshAll();
        hud.showToast(`✋ Đang nhấc "${item.name}" — chạm ô đất mới trên bản đồ để đặt xuống!`, '✋');
      });
      panel.querySelector('#btnStashThis')?.addEventListener('click', () => {
        const res = hud.sim.stashBuilding(b.uid);
        if (res.ok) {
          hud.inspectSelection = null;
          hud.refreshAll();
        }
        hud.showToast(res.msg, res.ok ? '📦' : '⚠️');
      });
      panel.querySelector('#btnRotateThis')?.addEventListener('click', () => {
        const res = hud.sim.rotatePlacedBuilding(b.uid);
        if (!res.ok) {
          hud.showToast(res.reason ?? 'Không thể xoay công trình tại vị trí này!', '⚠️');
          return;
        }
        hud.rotation = res.newRotation ?? b.rotation;
        inspectorRenderInspector(hud);
        hud.refreshHeader();
        hud.refreshDock();
        hud.showToast(
          `🔄 Đã xoay "${item.name}" (${(res.newRotation ?? 0) * 90}°)`,
          '🔄'
        );
      });
      panel.querySelector('#btnDeleteThis')?.addEventListener('click', () => {
        // HPVN: ask first when the demolition would destroy a ready crop / ready animals / a workshop job
        const loss = hud.sim.getRemovalLossText(b.gx, b.gy);
        if (loss) {
          void hud.askConfirm(loss).then((ok) => {
            if (ok) removeThis();
          });
        } else {
          removeThis();
        }
      });
      const removeThis = () => {
        hud.sim.beginBuildStroke();
        let removed = false;
        try {
          removed = hud.sim.removeAtTile(b.gx, b.gy);
        } finally {
          hud.sim.commitBuildStroke();
        }
        if (removed) {
          hud.inspectSelection = null;
          hud.refreshAll();
          hud.showToast(
            `🧹 Đã xóa "${item.name}" (có thể bấm ↶ Hoàn tác trong Xây Dựng nếu nhầm).`,
            '🧹'
          );
        }
      };
      return;
    }

    if (hud.inspectSelection.kind === 'staff') {
      delete panel.dataset.inspSig;
      const targetStaffId = hud.inspectSelection.id;
      const st = hud.sim.staff.find((x) => x.id === targetStaffId);
      if (!st) {
        hud.inspectSelection = null;
        panel.classList.add('hidden');
        hud.syncHudFocusVisibility();
        return;
      }
      const pZone = hud.sim.state.staffPatrolZones?.[st.id] ?? st.patrolZoneId ?? 'all';
      const unlockedSet = new Set(hud.sim.state.unlockedZones);
      panel.classList.remove('hidden');
      panel.classList.remove('inspector-wide-ws');
      hud.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar">
          <div class="hs-insp-title">${escapeHtml(st.name)}</div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>

        <div class="hs-insp-drop-meta">"${escapeHtml(st.actionText)}"</div>

        <div class="hs-insp-actions-row">
          <select id="selInspPatrolZone" aria-label="Khu vực tuần tra" style="flex:1;min-height:40px;padding:6px 8px;border-radius:8px;border:1px solid var(--hs-brass);background:#fffdf7;color:#3a2615;font-weight:700;">
            <option value="all" ${pZone === 'all' ? 'selected' : ''}>Toàn bộ</option>
            ${ZONES.filter((z) => hud.sim.state.sandboxMode || unlockedSet.has(z.id))
              .map((z) => `<option value="${z.id}" ${pZone === z.id ? 'selected' : ''}>${z.name}</option>`)
              .join('')}
          </select>
          <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta">Gắp</button>
        </div>
      `;

      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#selInspPatrolZone')?.addEventListener('change', (e) => {
        const val = (e.currentTarget as HTMLSelectElement).value as ZoneId | 'all';
        hud.sim.setStaffPatrolZone(st.id, val);
        hud.showToast(`Đã phân công ${st.name}.`, '📍');
      });
      panel.querySelector('#btnPickInspStaff')?.addEventListener('click', () => {
        clearBuildToolModes(hud);
        hud.pincerActive = true;
        hud.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        hud.inspectSelection = null;
        hud.refreshAll();
      });
      return;
    }

    if (hud.inspectSelection.kind === 'zone') {
      delete panel.dataset.inspSig;
      const z = getZoneById(hud.inspectSelection.zoneId);
      const zStars = getZonePuzzleStarCost(z);
      const canLv = hud.sim.state.level >= z.unlockLevel || hud.sim.state.sandboxMode;
      panel.classList.remove('hidden');
      panel.classList.remove('inspector-wide-ws');
      hud.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar">
          <div>
            <div class="hs-insp-title">${escapeHtml(z.name)}</div>
            <div class="hs-insp-meta">Cấp ${z.unlockLevel} · 🌟 ${zStars}</div>
          </div>
          <button id="btnCloseInsp" type="button" class="brass-btn hs-insp-icon-btn" aria-label="Đóng bảng chi tiết">✕</button>
        </div>
        <button id="btnConfirmUnlockZone" type="button" class="brass-btn ${canLv ? 'gold-cta' : ''}" style="width:100%;">Mở khu vực · 🌟 ${zStars}</button>
      `;
      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnConfirmUnlockZone')?.addEventListener('click', () => {
        const res = hud.sim.unlockZone(z.id);
        hud.showToast(res.msg, res.ok ? '✨' : '🔒');
        if (res.ok) {
          hud.inspectSelection = null;
          inspectorRenderInspector(hud);
        }
      });
    }
}
