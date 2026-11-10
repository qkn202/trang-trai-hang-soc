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

export function suitcaseUiOpenSuitcaseDialog(hud: GameHUD, 
    tab?: 'care' | 'morph' | 'expedition',
    focusHabitatUid?: string
  ): void {
    if (tab) hud.activeSuitcaseTab = tab;
    if (focusHabitatUid) {
      hud.selectedSuitcaseHabitatUid = focusHabitatUid;
    }
    suitcaseUiRenderSuitcaseDialog(hud);
    const dlg = hud.root.querySelector('#suitcaseDialog') as HTMLDialogElement;
    if (!dlg.open) dlg.showModal();
}

export function suitcaseUiRefreshSuitcaseBadge(hud: GameHUD): void {
    const badge = hud.root.querySelector('#badgeSuitcaseCount') as HTMLElement | null;
    if (!badge) return;
    const summary = hud.sim.getSuitcaseReadySummary();
    if (summary.badgeCount > 0) {
      badge.textContent = String(summary.badgeCount);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
}

export function suitcaseUiUpdateSuitcaseLiveTimers(hud: GameHUD): void {
    const box = hud.root.querySelector('#suitcaseDialogContent') as HTMLElement | null;
    if (!box) return;
    const now = Date.now();
    const sc = hud.sim.state.suitcase;
    const incReady = Boolean(sc.activeIncubation && now >= sc.activeIncubation.endsAt);
    const expReady = Boolean(sc.activeExpedition && now >= sc.activeExpedition.endsAt);

    if (
      (incReady !== hud.lastSuitcaseIncReady || expReady !== hud.lastSuitcaseExpReady) &&
      document.activeElement?.id !== 'inpSuitcasePetName'
    ) {
      suitcaseUiRenderSuitcaseDialog(hud);
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

    if (hud.activeSuitcaseTab === 'care' && !hud.sim.state.sandboxMode) {
      const selB = hud.sim.state.buildings.find((b) => b.uid === hud.selectedSuitcaseHabitatUid);
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

export function suitcaseUiRenderSuitcaseDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#suitcaseDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = hud.sim.state;
    const sc = st.suitcase;
    const now = Date.now();
    const habitats = hud.sim.getBuiltCreatureHabitats();

    if (
      !hud.selectedSuitcaseHabitatUid ||
      !habitats.some((h) => h.building.uid === hud.selectedSuitcaseHabitatUid)
    ) {
      hud.selectedSuitcaseHabitatUid = habitats[0]?.building.uid ?? null;
    }

    const discoveredSet = new Set(sc.discoveredMorphs);
    const totalCompendiumEntries = CREATURE_SPECIES_PROFILES.length * 3;
    const discoveredCount = discoveredSet.size;
    const masteryPct = getCompendiumMasteryBonusPct(discoveredCount);
    const starlightQty = st.supply.ingredients.starlight_dust ?? 0;

    hud.lastSuitcaseIncReady = Boolean(sc.activeIncubation && now >= sc.activeIncubation.endsAt);
    hud.lastSuitcaseExpReady = Boolean(sc.activeExpedition && now >= sc.activeExpedition.endsAt);

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
        <button type="button" data-sc-tab="care" data-active="${hud.activeSuitcaseTab === 'care'}" aria-pressed="${hud.activeSuitcaseTab === 'care'}" class="brass-btn">
          🐾 Chăm Sóc (${habitats.length})
        </button>
        <button type="button" data-sc-tab="morph" data-active="${hud.activeSuitcaseTab === 'morph'}" aria-pressed="${hud.activeSuitcaseTab === 'morph'}" class="brass-btn">
          🧬 Ấp Trứng (${incStatusLabel})
        </button>
        <button type="button" data-sc-tab="expedition" data-active="${hud.activeSuitcaseTab === 'expedition'}" aria-pressed="${hud.activeSuitcaseTab === 'expedition'}" class="brass-btn">
          🧭 Thám Hiểm (${expStatusLabel})
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (hud.activeSuitcaseTab === 'care') {
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
          habitats.find((h) => h.building.uid === hud.selectedSuitcaseHabitatUid) ?? habitats[0];
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
        const prod = hud.sim.getBuildingProductionPerCycle(b, item);
        const bio = hud.sim.biomeCache.get(b.uid);
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
    } else if (hud.activeSuitcaseTab === 'morph') {
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
              <input id="chkScStarlight" type="checkbox" ${hud.useStarlightForIncubation && (st.sandboxMode || starlightQty > 0) ? 'checked' : ''} />
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
                  const cost = hud.sim.getMorphIncubationCost(hi);
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
          habitats.find((h) => h.building.uid === hud.selectedSuitcaseHabitatUid) ?? habitats[0];
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
        hud.activeSuitcaseTab = btn.dataset.scTab as 'care' | 'morph' | 'expedition';
        suitcaseUiRenderSuitcaseDialog(hud);
      });
    });

    box.querySelector('#btnScOpenCreatureBuild')?.addEventListener('click', () => {
      (hud.root.querySelector('#suitcaseDialog') as HTMLDialogElement).close();
      hud.activeCategory = 'creature';
      hud.refreshDock();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-select-pet]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.selectedSuitcaseHabitatUid = btn.dataset.selectPet ?? null;
        suitcaseUiRenderSuitcaseDialog(hud);
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
    if (renameForm && renameInput && hud.selectedSuitcaseHabitatUid) {
      const targetUid = hud.selectedSuitcaseHabitatUid;
      renameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const res = hud.sim.renameCreature(targetUid, renameInput.value);
        hud.showToast(res.msg, '🏷️');
        suitcaseUiRenderSuitcaseDialog(hud);
      });
    }

    if (hud.selectedSuitcaseHabitatUid) {
      const uid = hud.selectedSuitcaseHabitatUid;
      const handleGroom = () => {
        const res = hud.sim.groomCreature(uid);
        hud.showToast(res.msg, res.ok ? '🪮' : '⏳');
        suitcaseUiRenderSuitcaseDialog(hud);
      };
      box.querySelector('#btnScPetStage')?.addEventListener('click', handleGroom);
      box.querySelector('#btnScGroom')?.addEventListener('click', handleGroom);

      box.querySelector('#btnScFeed')?.addEventListener('click', () => {
        hud.sim.feedCreature(uid);
        suitcaseUiRenderSuitcaseDialog(hud);
      });

      box.querySelector('#btnScTrain')?.addEventListener('click', () => {
        const res = hud.sim.trainCreatureTrick(uid);
        hud.showToast(res.msg, res.ok ? '🎾' : '🪙');
        suitcaseUiRenderSuitcaseDialog(hud);
      });

      box.querySelector('#btnScLocate')?.addEventListener('click', () => {
        const b = st.buildings.find((x) => x.uid === uid);
        if (b) {
          (hud.root.querySelector('#suitcaseDialog') as HTMLDialogElement).close();
          centerCameraOnGrid(hud.cam, b.gx + 1, b.gy + 1);
          hud.inspectSelection = { kind: 'building', uid: b.uid };
          hud.renderInspector();
        }
      });
    }

    const chkStarlight = box.querySelector('#chkScStarlight') as HTMLInputElement | null;
    if (chkStarlight) {
      chkStarlight.addEventListener('change', () => {
        hud.useStarlightForIncubation = chkStarlight.checked;
      });
    }

    box.querySelectorAll<HTMLButtonElement>('[data-incubate-uid]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetUid = btn.dataset.incubateUid!;
        const wantStarlight =
          hud.useStarlightForIncubation &&
          (st.sandboxMode || (st.supply.ingredients.starlight_dust ?? 0) >= 1);
        const res = hud.sim.startMorphIncubation(targetUid, wantStarlight);
        hud.showToast(res.msg, res.ok ? '🥚' : '⚠️');
        suitcaseUiRenderSuitcaseDialog(hud);
      });
    });

    box.querySelector('#btnScSpeedEgg')?.addEventListener('click', () => {
      const res = hud.sim.speedUpIncubationWithSand();
      hud.showToast(res.msg, res.ok ? '⏳' : '⚠️');
      suitcaseUiRenderSuitcaseDialog(hud);
    });

    box.querySelector('#btnScClaimEgg')?.addEventListener('click', () => {
      hud.sim.claimMorphIncubation();
      suitcaseUiRenderSuitcaseDialog(hud);
    });

    const selExpPet = box.querySelector('#selScExpPet') as HTMLSelectElement | null;
    if (selExpPet) {
      selExpPet.addEventListener('change', () => {
        hud.selectedSuitcaseHabitatUid = selExpPet.value;
        suitcaseUiRenderSuitcaseDialog(hud);
      });
    }

    box.querySelectorAll<HTMLButtonElement>('[data-start-exp]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const expId = btn.dataset.startExp as SuitcaseExpeditionId;
        const petUid = hud.selectedSuitcaseHabitatUid ?? habitats[0]?.building.uid;
        if (!petUid) return;
        const res = hud.sim.startSuitcaseExpedition(petUid, expId);
        hud.showToast(res.msg, res.ok ? '🧭' : '⚠️');
        suitcaseUiRenderSuitcaseDialog(hud);
      });
    });

    box.querySelector('#btnScSpeedExp')?.addEventListener('click', () => {
      const res = hud.sim.speedUpExpeditionWithSand();
      hud.showToast(res.msg, res.ok ? '⏳' : '⚠️');
      suitcaseUiRenderSuitcaseDialog(hud);
    });

    box.querySelector('#btnScClaimExp')?.addEventListener('click', () => {
      hud.sim.claimSuitcaseExpedition();
      suitcaseUiRenderSuitcaseDialog(hud);
    });
}
