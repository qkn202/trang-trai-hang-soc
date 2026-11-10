// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

import {
  CATALOG,
  FARM_CROPS,
  FARM_GOODS,
  formatDurationCompactVi,
  formatDurationCountdownVi,
  getBuildingEffectiveCycleSec,
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

export function inspectorRenderInspector(hud: GameHUD): void {
    hud.syncContextualMapToolsBar();
    const panel = hud.root.querySelector('#inspectorPanel') as HTMLElement;
    if (!hud.inspectSelection) {
      hud.lastInspectedKey = '';
      hud.inspectorCollapsed = false;
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
      hud.inspectorCollapsed = false;
    }
    panel.classList.toggle('inspector-collapsed', hud.inspectorCollapsed);

    if (hud.inspectSelection.kind === 'building') {
      const targetUid = hud.inspectSelection.uid;
      const b = hud.sim.state.buildings.find((x) => x.uid === targetUid);
      if (!b) {
        hud.inspectSelection = null;
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
      const synXp = hud.sim.activeSynergies.buildingXpMult.get(b.uid) ?? 1;
      const isRide = item.category === 'ride' && !item.isCoasterTrackPiece;
      const canRideCam = Boolean(item.isCustomCoasterStation) && !isBuilding;

      const stageNames: Record<string, string> = {
        egg: '🥚 Trứng',
        baby: '🐣 Non',
        adult: '🦄 Trưởng thành',
        legendary: '🌟 Huyền thoại',
      };

      const bio = item.isCreatureHabitat ? hud.sim.biomeCache.get(b.uid) : undefined;
      const backstage = item.isBackstage ? hud.sim.backstageCache.get(b.uid) : undefined;
      const hasPriceSlider = Boolean(item.ticketPrice) && !isBuilding && !item.workshopGroupId;
      const priceBounds = getItemPriceBounds(item);
      const curPrice = hud.sim.getEffectivePrice(b, item);
      const priceVerdict = hud.sim.getPriceValueVerdict(b, item);

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
                  if (hud.seedFilterMode === 'flowers') return Boolean(c.isFlowerCrop);
                  if (hud.seedFilterMode === 'crops') return !c.isFlowerCrop;
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
                    const stock = hud.sim.getFarmItemCount(crop.id);
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
              const recipes = hud.sim.getWorkshopRecipesForBuilding(item);
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
                      !hud.sim.state.sandboxMode && hud.sim.state.level < animal.unlockLevel;
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
      hud.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:${hud.inspectorCollapsed ? '0' : '8px'};">
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
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!hud.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${hud.inspectorCollapsed ? '▴' : '▾'}</button>
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
                        hud.sim.state.sandboxMode
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
                    hud.sim.getActiveFestival() === 'quidditch_cup' ? 0.85 : 1.0;
                  const baseCycle = getBuildingEffectiveCycleSec(b, item);
                  const effCycle = Math.max(1, baseCycle * festSpeed);
                  const rawEl = Math.max(0, (now - (b.lastTickAt || now)) / 1000);
                  const cycLeft = Math.max(1, Math.ceil(effCycle - (rawEl % effCycle)));
                  return `
                    <div class="quest-card-mini" style="margin-bottom:8px;font-size:12px;">
                      <div><strong id="lblBuildingProdVal">+${prod.galleons}🪙 +${prod.xp}⭐</strong> / ${formatDurationCompactVi(baseCycle)}</div>
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
        hud.wireRangeProgressFallback(priceInput);
        priceInput.addEventListener('input', () => {
          const v = Number(priceInput.value);
          hud.sim.setBuildingCustomPrice(b.uid, v);
          const curEff = hud.sim.getEffectivePrice(b, item);
          const lblVal = panel.querySelector('#lblBuildingPriceVal');
          if (lblVal) lblVal.textContent = `${curEff} Galleon`;
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

      panel.querySelector('#btnToggleInspRollup')?.addEventListener('click', () => {
        hud.inspectorCollapsed = !hud.inspectorCollapsed;
        inspectorRenderInspector(hud);
      });
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
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openTrialMinigame();
      });
      panel.querySelector('#btnInspQuizSpeed')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        hud.refreshAll();
        hud.openSeedQuizDialog(hud.activeSeedCropId ?? 'ottery_wheat');
      });
      panel.querySelector('#btnFinishNowSand')?.addEventListener('click', () => {
        hud.sim.speedUpWithTimeSand(b.uid, true);
        inspectorRenderInspector(hud);
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
            hud.activeSeedCropId = cid;
            hud.inspectSelection = null;
            hud.refreshAll();
            hud.openSeedQuizDialog(cid, targetUid);
            return;
          }
          hud.showToast(res.msg, res.ok ? '🌱' : '🪙');
          if (res.ok) {
            hud.activeSeedCropId = cid;
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
            hud.activePastureAnimalId = aid;
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
      panel.querySelector('#btnInspOpenBarn')?.addEventListener('click', () => {
        hud.openWorkshopDialog('barn');
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
      panel.querySelector('#btnUpgStar')?.addEventListener('click', () => {
        const res = hud.sim.upgradeBuildingStar(b.uid);
        hud.showToast(res.msg, res.ok ? '🌟' : '🪙');
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnMoveThis')?.addEventListener('click', () => {
        hud.moveModeActive = true;
        hud.movingBuildingUid = b.uid;
        hud.rotation = b.rotation;
        hud.inspectSelection = null;
        hud.collapseBuildDock();
        hud.refreshAll();
        hud.showToast(`Đang nhấc "${item.name}" — Nhấp vào ô đất mới để đặt xuống!`, '✋');
      });
      return;
    }

    if (hud.inspectSelection.kind === 'staff') {
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
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${hud.inspectorCollapsed ? '0' : '8px'};">
          <div>
            <div style="font-size:14.5px;font-weight:800;">🧙 ${escapeHtml(st.name)}</div>
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!hud.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${hud.inspectorCollapsed ? '▴' : '▾'}</button>
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
            ${ZONES.filter((z) => hud.sim.state.sandboxMode || unlockedSet.has(z.id))
              .map((z) => `<option value="${z.id}" ${pZone === z.id ? 'selected' : ''}>📍 ${z.name}</option>`)
              .join('')}
          </select>
        </div>

        <button id="btnPickInspStaff" type="button" class="brass-btn gold-cta" style="width:100%;">
          🤏 Gắp
        </button>
      `;

      panel.querySelector('#btnToggleInspRollup')?.addEventListener('click', () => {
        hud.inspectorCollapsed = !hud.inspectorCollapsed;
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#btnCloseInsp')?.addEventListener('click', () => {
        hud.inspectSelection = null;
        inspectorRenderInspector(hud);
      });
      panel.querySelector('#selInspPatrolZone')?.addEventListener('change', (e) => {
        const val = (e.currentTarget as HTMLSelectElement).value as ZoneId | 'all';
        hud.sim.setStaffPatrolZone(st.id, val);
        hud.showToast(`Đã phân công khu tuần tra cho ${st.name}!`, '📍');
      });
      panel.querySelector('#btnPickInspStaff')?.addEventListener('click', () => {
        hud.pincerActive = true;
        hud.pincerPicked = { kind: 'staff', id: st.id, label: st.name };
        hud.inspectSelection = null;
        hud.refreshAll();
      });
      return;
    }

    if (hud.inspectSelection.kind === 'zone') {
      const z = getZoneById(hud.inspectSelection.zoneId);
      const zStars = getZonePuzzleStarCost(z);
      const canLv = hud.sim.state.level >= z.unlockLevel || hud.sim.state.sandboxMode;
      panel.classList.remove('hidden');
      panel.classList.remove('inspector-wide-ws');
      hud.syncHudFocusVisibility();
      panel.innerHTML = `
        <div class="inspector-header-bar" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:${hud.inspectorCollapsed ? '0' : '8px'};">
          <div style="font-size:15px;font-weight:800;">🌫️ ${escapeHtml(z.name)}</div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button id="btnToggleInspRollup" type="button" class="brass-btn" aria-expanded="${!hud.inspectorCollapsed}" title="Thu gọn / Mở rộng" style="padding:3px 7px;font-size:11.5px;">${hud.inspectorCollapsed ? '▴' : '▾'}</button>
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
        hud.inspectorCollapsed = !hud.inspectorCollapsed;
        inspectorRenderInspector(hud);
      });
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
