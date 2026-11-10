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

export function socialUiOpenNeighborDialog(hud: GameHUD, 
    tab?: 'friends' | 'chest' | 'log',
    focusNeighborId?: string
  ): void {
    hud.closeHudPopovers();
    if (tab) hud.activeNeighborTab = tab;
    if (focusNeighborId) hud.focusedNeighborId = focusNeighborId;
    registerRealPlayerProfileOnline(
      hud.sim.state as unknown as Record<string, unknown>
    ).catch(() => {});
    socialUiRenderNeighborDialog(hud);
    const dlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
    if (focusNeighborId) {
      requestAnimationFrame(() => {
        const card = hud.root.querySelector(
          `[data-neighbor-card="${focusNeighborId}"]`
        ) as HTMLElement | null;
        card?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
    }
}

export function socialUiOpenMinigameRescue(hud: GameHUD, ctx: MinigameRescueContext): void {
    hud.closeHudPopovers();
    const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (nDlg?.open) nDlg.close();
    if (ctx.kind === 'match3') {
      void hud.getMatch3Modal().then((m) => m.openRescue(ctx));
    } else {
      void hud.getPuzzleArcadeModal().then((m) => m.openRescue(ctx));
    }
}

export function socialUiEnterVisitFromHud(hud: GameHUD, neighborId: string): void {
    hud.selectedCatalogItem = null;
    hud.moveModeActive = false;
    hud.movingBuildingUid = null;
    hud.bulldozerActive = false;
    hud.pincerActive = false;
    hud.pincerPicked = null;
    hud.pendingTouchTile = null;
    hud.inspectSelection = null;
    hud.rideCamUid = null;
    hud.closeSeedTray();
    hud.closePastureTray();
    hud.collapseBuildDock();
    hud.closeHudPopovers();

    const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    if (nDlg?.open) nDlg.close();

    const res = hud.sim.enterNeighborVisit(neighborId);
    if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
      hud.onCameraJump?.();
      centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
    } else if (!res.ok) {
      hud.showToast(res.msg, '⚠️');
    }
    hud.refreshAll();
}

export function socialUiExitVisitFromHud(hud: GameHUD): void {
    const res = hud.sim.exitNeighborVisit(false);
    if (res.ok) {
      hud.inspectSelection = null;
      hud.rideCamUid = null;
      hud.onCameraJump?.();
      centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
    }
    hud.refreshAll();
}

export function socialUiSyncLiveNeighborSocialUI(hud: GameHUD): void {
    const social = hud.sim.ensureNeighborSocial();
    const fulfilledOwlCount = social.playerOwlHelpRequests.filter((r) => Boolean(r.fulfilledAt)).length;
    const sosRescuedAt = social.playerMinigameSos?.rescuedAt ?? 0;
    const sosClaimed = Boolean(social.playerMinigameSos?.claimed);
    const sig = `${social.lastSocialResetKey}|${social.friendshipTokens}|${fulfilledOwlCount}|${sosRescuedAt}|${sosClaimed}|${social.homeLanternMarks.length}|${social.dailyRescuesGivenIds.length}`;
    if (sig === hud.lastSocialLiveSig) return;
    hud.lastSocialLiveSig = sig;

    socialUiRefreshNeighborBadges(hud);
    const qDlg = hud.root.querySelector('#questDialog') as HTMLDialogElement | null;
    if (qDlg?.open && hud.activeQuestTab === 'orders') {
      hud.renderQuestDialog();
    }
    const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    const activeId = document.activeElement?.id ?? '';
    if (nDlg?.open && activeId !== 'inpFriendCode' && activeId !== 'inpFriendName') {
      socialUiRenderNeighborDialog(hud);
    }
}

export function socialUiRefreshNeighborBadges(hud: GameHUD): void {
    const social = hud.sim.ensureNeighborSocial();
    const chestsReady = Math.floor(social.friendshipTokens / FRIENDSHIP_CHEST_TOKEN_COST);
    const sosReady =
      social.playerMinigameSos &&
      !social.playerMinigameSos.claimed &&
      Boolean(social.playerMinigameSos.rescuedAt)
        ? 1
        : 0;
    const homeLanterns = social.homeLanternMarks.length;
    const urgentReady = chestsReady + sosReady + homeLanterns;

    const rescuesLeftToday = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesGivenIds.length
    );
    const openFriendSosCount =
      rescuesLeftToday > 0
        ? social.neighbors.filter(
            (n) =>
              n.minigameSos &&
              !n.minigameSos.rescuedToday &&
              !social.dailyRescuesGivenIds.includes(n.id)
          ).length
        : 0;

    const badge = hud.root.querySelector('#badgeNeighborCount') as HTMLElement | null;
    if (badge) {
      const shown = urgentReady > 0 ? urgentReady : openFriendSosCount;
      if (shown > 0) {
        badge.textContent = String(shown);
        badge.classList.toggle('is-ready-green', urgentReady > 0);
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    const manageBadge = hud.root.querySelector('#badgeManageNeighborCount') as HTMLElement | null;
    if (manageBadge) {
      if (urgentReady > 0) {
        manageBadge.textContent = String(urgentReady);
        manageBadge.classList.remove('hidden');
      } else {
        manageBadge.classList.add('hidden');
      }
    }
}

export function socialUiRenderVisitorDockBar(hud: GameHUD): void {
    const bar = hud.root.querySelector('#visitorDockBar') as HTMLElement | null;
    if (!bar) return;
    const nb = hud.sim.getActiveVisitingNeighbor();
    if (!nb || hud.photoModeActive) {
      bar.classList.add('hidden');
      bar.innerHTML = '';
      return;
    }

    const social = hud.sim.ensureNeighborSocial();
    const helpsDone = nb.helpedMarksToday.length;
    const maxGardenHelps = 6;
    const likedToday = social.dailyLikedNeighborIds.includes(nb.id);
    const mysteryClaimedToday = social.dailyMysteryClaimedIds.includes(nb.id);
    const openCrates = nb.owlHelpCrates.filter((c) => !c.fulfilledByPlayerToday).length;
    const canRescue = hud.sim.canRescueNeighborMinigame(nb.id).ok;
    const coOpPendingCount = openCrates + (canRescue ? 1 : 0);

    bar.classList.remove('hidden');
    bar.innerHTML = `
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${escapeHtml(nb.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${escapeHtml(nb.name)}</strong>
            <span class="visitor-lv-tag">Lv.${nb.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>💧 <strong>${helpsDone}/${maxGardenHelps}</strong></span>
            <span>•</span>
            <span>🍀 <strong>${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnVisitorLike" type="button" class="brass-btn ${likedToday ? '' : 'gold-cta'}" ${likedToday ? 'disabled' : ''} title="Thả tim">
          ${likedToday ? '✓ Đã Tim' : '❤️ +1🍀'}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn ${mysteryClaimedToday ? '' : 'gold-cta'}" ${mysteryClaimedToday ? 'disabled' : ''} title="Tìm Quà">
          ${mysteryClaimedToday ? '✓ Đã Mở' : '🎁 Quà'}
        </button>
        <button id="btnVisitorCoopBook" type="button" class="brass-btn ${coOpPendingCount > 0 ? 'gold-cta' : ''}" title="Đơn Cú & Giải Cứu">
          📦 Tương Trợ ${coOpPendingCount > 0 ? `(${coOpPendingCount})` : ''}
        </button>
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Bạn kế">
          ⏭️ Kế
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về nhà">
          🏡 Về
        </button>
      </div>
    `;

    bar.querySelector('#btnVisitorLike')?.addEventListener('click', () => {
      const res = hud.sim.likeVisitedNeighborFarm();
      if (!res.ok) hud.showToast(res.msg, '❤️');
      hud.refreshAll();
    });

    bar.querySelector('#btnVisitorLocateGift')?.addEventListener('click', () => {
      if (mysteryClaimedToday) return;
      hud.rideCamUid = null;
      hud.onCameraJump?.();
      centerCameraOnGrid(hud.cam, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
      hud.showToast(
        `🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!`,
        '🎁'
      );
    });

    bar.querySelector('#btnVisitorCoopBook')?.addEventListener('click', () => {
      socialUiOpenNeighborDialog(hud, 'friends', nb.id);
    });

    bar.querySelector('#btnVisitorNextFriend')?.addEventListener('click', () => {
      const res = hud.sim.cycleNextNeighborVisit();
      if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
        hud.rideCamUid = null;
        hud.onCameraJump?.();
        centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
      }
      hud.refreshAll();
    });

    bar.querySelector('#btnVisitorReturnHome')?.addEventListener('click', () => {
      socialUiExitVisitFromHud(hud);
    });
}

export function socialUiRenderNeighborDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#neighborDialogContent') as HTMLElement | null;
    if (!box) return;

    const social = hud.sim.ensureNeighborSocial();
    const visitingNb = hud.sim.getActiveVisitingNeighbor();
    const rescuesGivenLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesGivenIds.length
    );
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - social.dailyRescuesReceivedCount
    );
    const owlHelpLeft = Math.max(
      0,
      MAX_DAILY_OWL_HELP_REQUESTS - social.dailyOwlHelpRequestedCount
    );
    const chestReady = social.friendshipTokens >= FRIENDSHIP_CHEST_TOKEN_COST;
    const chestPct = Math.min(
      100,
      Math.round((social.friendshipTokens / FRIENDSHIP_CHEST_TOKEN_COST) * 100)
    );
    const mySos =
      social.playerMinigameSos && !social.playerMinigameSos.claimed
        ? social.playerMinigameSos
        : null;

    const topStatsHtml = `
      <div class="nb-summary-ribbon">
        <div class="nb-stat-pill token">
          <span>🍀</span>
          <strong>${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST}</strong>
          ${
            chestReady
              ? `<button id="btnNbQuickOpenChest" type="button" class="brass-btn gold-cta nb-mini-cta">🎁 Mở Rương</button>`
              : ''
          }
        </div>
        <div class="nb-stat-pill">
          <span>⚔️ <strong>${rescuesGivenLeft}/${MAX_DAILY_MINIGAME_RESCUES}</strong></span>
          <span>•</span>
          <span>🆘 <strong>${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}</strong></span>
          <span>•</span>
          <span>🦉 <strong>${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}</strong></span>
        </div>
      </div>
    `;

    const tabsHtml = `
      <div class="workshop-tabs" role="group" aria-label="Sổ Hàng Xóm" style="margin:10px 0 12px;">
        <button type="button" data-nbtab="friends" data-active="${hud.activeNeighborTab === 'friends'}" aria-pressed="${hud.activeNeighborTab === 'friends'}" class="brass-btn">
          🏡 Bạn (${social.neighbors.length})
        </button>
        <button type="button" data-nbtab="chest" data-active="${hud.activeNeighborTab === 'chest'}" aria-pressed="${hud.activeNeighborTab === 'chest'}" class="brass-btn">
          🎁 Rương &amp; Mã ${chestReady || mySos?.rescuedAt ? '(!)' : ''}
        </button>
        <button type="button" data-nbtab="log" data-active="${hud.activeNeighborTab === 'log'}" aria-pressed="${hud.activeNeighborTab === 'log'}" class="brass-btn">
          📜 Nhật Ký (${social.activityLog.length})
        </button>
        <button id="btnNbOpenFriendsLeaderboard" type="button" class="brass-btn gold-cta">
          🏆 BXH
        </button>
      </div>
    `;

    let bodyHtml = '';

    if (hud.activeNeighborTab === 'friends') {
      const quickAlertBanners: string[] = [];
      if (mySos?.rescuedAt) {
        const km = getMinigameKindLabelVi(mySos.kind);
        quickAlertBanners.push(`
          <div class="nb-alert-banner ready">
            <span>🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn')}</strong> cứu <strong>${km.icon} Màn ${mySos.stage}</strong>!</span>
            <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
          </div>
        `);
      } else if (mySos) {
        const km = getMinigameKindLabelVi(mySos.kind);
        quickAlertBanners.push(`
          <div class="nb-alert-banner">
            <span>🦉 Đang gọi cứu <strong>${km.icon} Màn ${mySos.stage}</strong>...</span>
          </div>
        `);
      }

      if (social.homeLanternMarks.length > 0) {
        quickAlertBanners.push(`
          <div class="nb-alert-banner ready">
            <span>🏮 <strong>${social.homeLanternMarks.length} Đèn Lồng</strong></span>
            <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${social.homeLanternMarks.length}🍀)</button>
          </div>
        `);
      }

      const houseLabelMap: Record<HouseName, string> = {
        Gryffindor: '🦁 Gryffindor',
        Ravenclaw: '🦅 Ravenclaw',
        Hufflepuff: '🦡 Hufflepuff',
        Slytherin: '🐍 Slytherin',
      };

      const cardsHtml = social.neighbors
        .map((nb) => {
          const isVisitingThis = visitingNb?.id === nb.id;
          const isFocused = hud.focusedNeighborId === nb.id;
          const maxGardenHelps = 6;
          const likedToday = social.dailyLikedNeighborIds.includes(nb.id);
          const mysteryClaimedToday = social.dailyMysteryClaimedIds.includes(nb.id);
          const rescueCheck = hud.sim.canRescueNeighborMinigame(nb.id);
          const sos = nb.minigameSos;
          const sosMeta = sos ? getMinigameKindLabelVi(sos.kind) : null;
          const alreadyRescuedThisFriend = Boolean(
            sos && (sos.rescuedToday || social.dailyRescuesGivenIds.includes(nb.id))
          );

          const cratesHtml =
            nb.owlHelpCrates.length > 0
              ? `
                <div class="nb-coop-section">
                  <div class="nb-crate-list">
                    ${nb.owlHelpCrates
                      .map((crate) => {
                        const meta = getFarmItemMeta(crate.itemId);
                        const have = hud.sim.getFarmItemCount(crate.itemId);
                        const enough = hud.sim.state.sandboxMode || have >= crate.qty;
                        return `
                          <div class="nb-crate-item ${crate.fulfilledByPlayerToday ? 'done' : ''}">
                            <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${crate.qty} ${escapeHtml(meta.name)} <span class="nb-crate-stock">(${hud.sim.state.sandboxMode ? '∞' : have}/${crate.qty})</span></div>
                              <div class="nb-crate-rew">+${crate.rewardTokens}🍀 • +${crate.rewardGalleons}G</div>
                            </div>
                            ${
                              crate.fulfilledByPlayerToday
                                ? `<span class="nb-done-pill">✓</span>`
                                : `<button type="button" class="brass-btn ${enough ? 'gold-cta' : ''} nb-mini-cta" data-nb-crate="${escapeHtml(nb.id)}|${escapeHtml(crate.id)}" ${!enough ? 'disabled' : ''}>📦 Giúp</button>`
                            }
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
              `
              : '';

          const sosHtml =
            sos && sosMeta
              ? `
                <div class="nb-coop-section sos ${alreadyRescuedThisFriend ? 'done' : ''}">
                  <div class="nb-sos-row">
                    <div class="nb-sos-info">
                      <div class="nb-sos-title">
                        ⚔️ ${sosMeta.icon} ${escapeHtml(sosMeta.nameVi)} • <strong>Màn ${sos.stage}</strong>
                      </div>
                    </div>
                    ${
                      alreadyRescuedThisFriend
                        ? `<span class="nb-done-pill">✓ 1/1</span>`
                        : `<button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${escapeHtml(nb.id)}" ${!rescueCheck.ok ? 'disabled' : ''} title="${escapeHtml(rescueCheck.reason ?? 'Giải cứu')}">⚔️ Cứu</button>`
                    }
                  </div>
                </div>
              `
              : '';

          return `
            <article class="nb-friend-card ${isVisitingThis ? 'visiting' : ''} ${isFocused ? 'focused' : ''}" data-neighbor-card="${escapeHtml(nb.id)}">
              <div class="nb-card-head">
                <div class="nb-avatar-circle" aria-hidden="true">${escapeHtml(nb.avatarEmoji)}</div>
                <div class="nb-head-info">
                  <div class="nb-name-row">
                    <strong class="nb-friend-name">${escapeHtml(nb.name)}</strong>
                    <span class="nb-badge-pill">Lv.${nb.level}</span>
                    <span class="nb-badge-pill house">${houseLabelMap[nb.house]}</span>
                    <span class="nb-code-tag">${escapeHtml(nb.friendCode)}</span>
                  </div>
                </div>
              </div>

              <div class="nb-garden-pills">
                <span class="nb-garden-pill ${nb.helpedMarksToday.length >= maxGardenHelps ? 'done' : ''}">
                  💧 <strong>${nb.helpedMarksToday.length}/${maxGardenHelps}</strong>
                </span>
                <span class="nb-garden-pill ${mysteryClaimedToday ? 'done' : ''}">
                  🎁 <strong>${mysteryClaimedToday ? '✓' : '+1🍀'}</strong>
                </span>
                <span class="nb-garden-pill ${likedToday ? 'done' : ''}">
                  ❤️ <strong>${likedToday ? '✓' : '+1🍀'}</strong>
                </span>
              </div>

              ${cratesHtml}
              ${sosHtml}

              <div class="nb-card-actions">
                ${
                  isVisitingThis
                    ? `<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta">🏡 Về Nhà</button>`
                    : `<button type="button" class="brass-btn gold-cta" data-nb-visit="${escapeHtml(nb.id)}">🚂 Thăm</button>`
                }
                <button type="button" class="brass-btn" data-nb-like="${escapeHtml(nb.id)}" ${likedToday ? 'disabled' : ''}>
                  ${likedToday ? '✓ Đã Tim' : '❤️ +1🍀'}
                </button>
                <button type="button" class="brass-btn nb-mini-cta" data-nb-remove="${escapeHtml(nb.id)}" title="Xoá bạn">
                  ✕
                </button>
              </div>
            </article>
          `;
        })
        .join('');

      const emptyFriendsHtml = `
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🤝 Kết Bạn</div>
          <div class="nb-my-code-box">
            <div>
              <div style="font-size:11.5px;opacity:0.82;">Mã của bạn:</div>
              <strong class="nb-my-code-val">${escapeHtml(social.playerFriendCode)}</strong>
            </div>
            <button id="btnNbCopyCode" type="button" class="brass-btn nb-mini-cta">📋 Sao Chép</button>
          </div>
          <form id="frmAddNeighborCode" class="nb-add-friend-form">
            <div class="nb-form-field">
              <label for="inpFriendCode">Mã bạn bè</label>
              <input id="inpFriendCode" name="friendCode" type="text" maxlength="20" placeholder="HS-ABCD-12" autocomplete="off" required />
            </div>
            <div class="nb-form-field">
              <label for="inpFriendName">Tên (tuỳ chọn)</label>
              <input id="inpFriendName" name="friendName" type="text" maxlength="28" placeholder="Tên bạn" autocomplete="off" />
            </div>
            <button id="btnSubmitAddFriend" type="submit" class="brass-btn gold-cta">🤝 Kết Bạn</button>
          </form>
        </section>
      `;

      bodyHtml = `
        ${quickAlertBanners.join('')}
        ${social.neighbors.length > 0 ? `<div class="nb-friends-list">${cardsHtml}</div>` : emptyFriendsHtml}
      `;
    } else if (hud.activeNeighborTab === 'chest') {
      const owlReqsHtml =
        social.playerOwlHelpRequests.length > 0
          ? social.playerOwlHelpRequests
              .map((r) => {
                const meta = getFarmItemMeta(r.itemId);
                return `
                  <div class="nb-crate-item ${r.fulfilledAt ? 'done' : ''}">
                    <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="nb-crate-icon" />
                    <div class="nb-crate-info">
                      <div class="nb-crate-title">${r.qty} ${escapeHtml(meta.name)}</div>
                      <div class="nb-crate-rew">${
                        r.fulfilledAt
                          ? `✓ ${escapeHtml(r.helperEmoji ?? '🦉')} ${escapeHtml(r.helperName ?? 'Bạn')}`
                          : '🦉 Đang gọi...'
                      }</div>
                    </div>
                  </div>
                `;
              })
              .join('')
          : `<div style="font-size:12px;opacity:0.8;">Trống</div>`;

      bodyHtml = `
        <div class="nb-chest-grid">
          <section class="nb-panel-card highlight">
            <div class="nb-section-title">🎁 Rương (${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)</div>
            <div class="quest-bar" style="height:12px;margin:8px 0;">
              <div class="quest-bar-fill" style="width:${chestPct}%"></div>
            </div>
            <div class="nb-chest-rewards">
              <span class="owl-rew-pill gold">🌟 +2</span>
              <span class="owl-rew-pill plug">🔥 +1</span>
              <span class="owl-rew-pill xp">🌱 +2</span>
              <span class="owl-rew-pill gold">🪙 +150G</span>
            </div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:10px;flex-wrap:wrap;">
              <span style="font-size:12px;font-weight:700;">Đã mở: ${social.chestsOpened}</span>
              <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${!chestReady ? 'disabled' : ''}>
                🎁 Mở Rương (${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)
              </button>
            </div>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🆘 Cầu Viện</div>
            <div style="margin-bottom:10px;">
              ${
                mySos
                  ? `
                    <div class="nb-alert-banner ${mySos.rescuedAt ? 'ready' : ''}" style="margin:0;">
                      <span>${
                        mySos.rescuedAt
                          ? `🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn')}</strong> cứu <strong>Màn ${mySos.stage}</strong>!`
                          : `🦉 Đang gọi cứu <strong>Màn ${mySos.stage}</strong>...`
                      }</span>
                      ${
                        mySos.rescuedAt
                          ? `<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>`
                          : ''
                      }
                    </div>
                  `
                  : `<div style="font-size:12px;opacity:0.8;">⚔️ 🆘 ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}</div>`
              }
            </div>
            <div>
              <div style="font-size:12px;font-weight:800;margin-bottom:4px;">🦉 Đơn Cú (${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}):</div>
              <div class="nb-crate-list">${owlReqsHtml}</div>
            </div>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🦉 Mã Kết Bạn</div>
            <div class="nb-my-code-box">
              <div>
                <strong class="nb-my-code-val">${escapeHtml(social.playerFriendCode)}</strong>
              </div>
              <button id="btnNbCopyCode" type="button" class="brass-btn nb-mini-cta">📋 Sao Chép</button>
            </div>
            <form id="frmAddNeighborCode" class="nb-add-friend-form">
              <div class="nb-form-field">
                <label for="inpFriendCode">Mã bạn bè</label>
                <input id="inpFriendCode" name="friendCode" type="text" maxlength="20" placeholder="HS-ABCD-12" autocomplete="off" required />
              </div>
              <div class="nb-form-field">
                <label for="inpFriendName">Tên (tuỳ chọn)</label>
                <input id="inpFriendName" name="friendName" type="text" maxlength="28" placeholder="Tên bạn" autocomplete="off" />
              </div>
              <button id="btnSubmitAddFriend" type="submit" class="brass-btn gold-cta">🤝 Kết Bạn</button>
            </form>
          </section>

          <section class="nb-panel-card">
            <div class="nb-section-title">🏮 Lời Chúc</div>
            <div class="nb-preset-notes">
              ${NEIGHBOR_PRESET_NOTES.map((n) => {
                const active = n.id === social.selectedPresetNoteId;
                return `
                  <button type="button" data-nb-note="${n.id}" data-active="${active}" aria-pressed="${active}" class="brass-btn nb-note-btn">
                    ${n.emoji} ${escapeHtml(n.shortVi)}
                  </button>
                `;
              }).join('')}
            </div>
          </section>
        </div>
      `;
    } else {
      const logItemsHtml =
        social.activityLog.length > 0
          ? social.activityLog
              .map((entry) => {
                const d = new Date(entry.timestamp);
                const hh = String(d.getHours()).padStart(2, '0');
                const mm = String(d.getMinutes()).padStart(2, '0');
                return `
                  <div class="nb-log-row">
                    <span class="nb-log-icon" aria-hidden="true">${escapeHtml(entry.icon)}</span>
                    <span class="nb-log-msg">${escapeHtml(entry.textVi)}</span>
                    <span class="nb-log-time">${hh}:${mm}</span>
                  </div>
                `;
              })
              .join('')
          : `<div class="nb-panel-card">Trống</div>`;

      bodyHtml = `<div class="nb-log-list">${logItemsHtml}</div>`;
    }

    box.innerHTML = `
      ${topStatsHtml}
      ${tabsHtml}
      ${bodyHtml}
    `;

    box.querySelectorAll<HTMLButtonElement>('[data-nbtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeNeighborTab = btn.dataset.nbtab as 'friends' | 'chest' | 'log';
        socialUiRenderNeighborDialog(hud);
      });
    });

    const handleOpenChest = () => {
      const res = hud.sim.openFriendshipChest();
      if (!res.ok) {
        hud.showToast(res.msg, '🍀');
      }
      hud.refreshAll();
      socialUiRenderNeighborDialog(hud);
    };
    box.querySelector('#btnNbQuickOpenChest')?.addEventListener('click', handleOpenChest);
    box.querySelector('#btnNbOpenFriendshipChest')?.addEventListener('click', handleOpenChest);
    box.querySelector('#btnNbOpenFriendsLeaderboard')?.addEventListener('click', () => {
      hud.sim.audio.playClick();
      hud.openLeaderboardDialog(undefined, 'friends');
    });

    box.querySelectorAll<HTMLButtonElement>('#btnNbClaimMySos').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.claimPlayerMinigameSosRescue();
        if (!res.ok) {
          hud.showToast(res.msg, '⚠️');
        }
        hud.refreshAll();
        socialUiRenderNeighborDialog(hud);
      });
    });

    box.querySelector('#btnNbClaimAllLanterns')?.addEventListener('click', () => {
      const marks = [...hud.sim.ensureNeighborSocial().homeLanternMarks];
      for (const mk of marks) {
        hud.sim.claimHomeLanternMark(mk.id);
      }
      hud.refreshAll();
      socialUiRenderNeighborDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-visit]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbVisit;
        if (nid) socialUiEnterVisitFromHud(hud, nid);
      });
    });

    box.querySelector('#btnNbExitCurrentVisit')?.addEventListener('click', () => {
      const dlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
      dlg?.close();
      socialUiExitVisitFromHud(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-like]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbLike;
        if (!nid) return;
        const res = hud.sim.likeVisitedNeighborFarm(nid);
        if (!res.ok) hud.showToast(res.msg, '❤️');
        hud.refreshAll();
        socialUiRenderNeighborDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-crate]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.nbCrate ?? '';
        const [nid, cid] = raw.split('|');
        if (!nid || !cid) return;
        const res = hud.sim.fulfillNeighborOwlCrate(nid, cid);
        if (!res.ok) {
          hud.showToast(res.msg, '🧺');
        }
        hud.refreshAll();
        socialUiRenderNeighborDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-rescue]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbRescue;
        if (!nid) return;
        const check = hud.sim.canRescueNeighborMinigame(nid);
        if (!check.ok || !check.neighbor || !check.sos) {
          hud.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
          return;
        }
        socialUiOpenMinigameRescue(hud, {
          neighborId: check.neighbor.id,
          neighborName: check.neighbor.name,
          neighborEmoji: check.neighbor.avatarEmoji,
          kind: check.sos.kind,
          stage: check.sos.stage,
        });
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nid = btn.dataset.nbRemove;
        if (!nid) return;
        const res = hud.sim.removeNeighborFriend(nid);
        hud.showToast(res.msg, res.ok ? '📋' : '⚠️');
        hud.refreshAll();
        socialUiRenderNeighborDialog(hud);
      });
    });

    box.querySelector('#btnNbCopyCode')?.addEventListener('click', () => {
      const code = hud.sim.ensureNeighborSocial().playerFriendCode;
      registerRealPlayerProfileOnline(
        hud.sim.state as unknown as Record<string, unknown>
      ).catch(() => {});
      if (navigator.clipboard?.writeText) {
        navigator.clipboard
          .writeText(code)
          .then(() => hud.showToast(`Đã sao chép Mã Thung Lũng: ${code}!`, '📋'))
          .catch(() => hud.showToast(`Mã Thung Lũng của bạn: ${code}`, '🦉'));
      } else {
        hud.showToast(`Mã Thung Lũng của bạn: ${code}`, '🦉');
      }
    });

    const addForm = box.querySelector('#frmAddNeighborCode') as HTMLFormElement | null;
    addForm?.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const codeInp = box.querySelector('#inpFriendCode') as HTMLInputElement | null;
      const nameInp = box.querySelector('#inpFriendName') as HTMLInputElement | null;
      const submitBtn = box.querySelector('#btnSubmitAddFriend') as HTMLButtonElement | null;
      const rawCode = (codeInp?.value ?? '').trim();
      const customName = (nameInp?.value ?? '').trim();

      if (rawCode.toUpperCase() === hud.sim.ensureNeighborSocial().playerFriendCode.toUpperCase()) {
        hud.showToast('Đây là Mã Thung Lũng của chính bạn rồi!', '⚠️');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = '🔍 Đang tìm...';
      }
      await registerRealPlayerProfileOnline(
        hud.sim.state as unknown as Record<string, unknown>
      ).catch(() => {});
      const lookup = await lookupRealPlayerByFriendCode(rawCode);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = '🤝 Kết Bạn';
      }

      if (!lookup.ok || !lookup.profile) {
        hud.showToast(lookup.msg, '⚠️');
        return;
      }

      const res = hud.sim.addVerifiedRealFriend(lookup.profile, customName || undefined);
      if (!res.ok) {
        hud.showToast(res.msg, '⚠️');
        return;
      }
      if (res.neighbor) {
        hud.focusedNeighborId = res.neighbor.id;
        hud.activeNeighborTab = 'friends';
      }
      hud.refreshAll();
      socialUiRenderNeighborDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-nb-note]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const noteId = btn.dataset.nbNote as NeighborPresetNoteId | undefined;
        if (!noteId) return;
        hud.sim.setNeighborPresetNote(noteId);
        hud.showToast('Đã cập nhật lời chúc treo Đèn Lồng Cú Đưa Thư!', '🏮');
        socialUiRenderNeighborDialog(hud);
      });
    });
}

export function socialUiPanCameraToTutorialTarget(hud: GameHUD): void {
    const worldTarget = hud.sim.getTutorialWorldTarget();
    if (!worldTarget) return;
    if (hud.cam.zoom < 0.85) {
      hud.cam.zoom = 0.98;
    }
    const bottomSheetBusy =
      hud.seedTrayOpen ||
      hud.pastureTrayOpen ||
      hud.buildSheetOpen ||
      Boolean(hud.activeCategory);
    const gridBias = bottomSheetBusy ? -0.35 : 0.95;
    centerCameraOnGrid(
      hud.cam,
      worldTarget.gx + worldTarget.bw * 0.5 + gridBias,
      worldTarget.gy + worldTarget.bh * 0.5 + gridBias
    );
    hud.onCameraJump?.();
}

export function socialUiResolveTutorialHudTarget(hud: GameHUD): { el: HTMLElement | null; label: string } {
    const step = hud.sim.getCurrentTutorialStep();
    if (!step) return { el: null, label: '' };

    if (step.id === 'harvest_wheat') {
      const hasPlot = Boolean(hud.sim.getTutorialWorldTarget());
      if (!hasPlot) {
        return {
          el: hud.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null,
          label: '👇 Đặt ruộng',
        };
      }
      return { el: null, label: '' };
    }

    if (step.id === 'sow_and_merge_plot') {
      if (hud.activeSeedCropId) {
        return { el: null, label: '' };
      }
      if (hud.seedTrayOpen) {
        const roseCard =
          (hud.root.querySelector('[data-seed-brush="english_rose"]:not([disabled])') as HTMLElement | null) ??
          (hud.root.querySelector('[data-seed-brush]:not([disabled])') as HTMLElement | null);
        return { el: roseCard, label: '🌸 Chọn Hoa' };
      }
      return {
        el: hud.root.querySelector('#btnOpenSeedSilo') as HTMLElement | null,
        label: '🌱 Kho Hạt',
      };
    }

    if (step.id === 'pasture_harvest_and_stock') {
      const now = Date.now();
      const readyPasture = hud.sim.state.buildings.some(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (readyPasture && !hud.sim.state.tutorial?.pastureHarvestedInStep3) {
        return { el: null, label: '' };
      }
      if (hud.activePastureAnimalId) {
        return { el: null, label: '' };
      }
      if (hud.pastureTrayOpen) {
        const sheepOrHen =
          (hud.root.querySelector('[data-pasture-brush="ottery_sheep"]:not([disabled])') as HTMLElement | null) ??
          (hud.root.querySelector('[data-pasture-brush="burrow_hen"]:not([disabled])') as HTMLElement | null);
        return { el: sheepOrHen, label: '🐾 Chọn thú' };
      }
      return {
        el: hud.root.querySelector('#btnOpenPastureTray') as HTMLElement | null,
        label: '🐾 Chăn Thả',
      };
    }

    if (step.id === 'seed_quiz_or_buy') {
      if (hud.seedTrayOpen) {
        return {
          el: hud.root.querySelector('#btnSeedTrayOpenQuiz') as HTMLElement | null,
          label: '🪄 Nhận 0G',
        };
      }
      return {
        el: hud.root.querySelector('#btnTutorialPrimaryCta') as HTMLElement | null,
        label: '🪄 Thần Chú',
      };
    }

    if (step.id === 'earn_magic_star') {
      return {
        el: hud.root.querySelector('#btnCornerPlayPuzzle') as HTMLElement | null,
        label: '🍓 Chơi!',
      };
    }

    if (step.id === 'build_and_owl_order') {
      if (hud.selectedCatalogItem) {
        return { el: null, label: '' };
      }
      if (hud.buildSheetOpen || hud.activeCategory) {
        const houseOrBakery =
          (hud.root.querySelector('[data-item-id="burrow_house_canon"]') as HTMLElement | null) ??
          (hud.root.querySelector('[data-item-id="molly_apple_bakery"]') as HTMLElement | null);
        if (houseOrBakery) {
          return { el: houseOrBakery, label: '✨ Chọn dựng!' };
        }
      }
      if (hud.sim.getReadyOwlOrdersCount() > 0) {
        return {
          el: hud.root.querySelector('#btnOpenQuests') as HTMLElement | null,
          label: '🦉 Giao Đơn!',
        };
      }
      return {
        el: hud.root.querySelector('#btnToggleBuildDock') as HTMLElement | null,
        label: '🔨 Xây Dựng',
      };
    }

    return { el: null, label: '' };
}

export function socialUiUpdateTutorialHudSpotlight(hud: GameHUD): void {
    const spot = hud.root.querySelector('#tutorialHudSpotlight') as HTMLElement | null;
    const spotLbl = hud.root.querySelector('#tutorialHudSpotlightLabel') as HTMLElement | null;
    hud.root
      .querySelectorAll<HTMLElement>('[data-tutorial-anchor="true"]')
      .forEach((el) => el.removeAttribute('data-tutorial-anchor'));
    if (!spot) return;

    const anyModalOpen = Boolean(document.querySelector('dialog[open]'));
    if (hud.photoModeActive || anyModalOpen || !hud.sim.isTutorialActive()) {
      spot.classList.add('hidden');
      return;
    }

    const { el, label } = socialUiResolveTutorialHudTarget(hud);
    if (!el || el.id === 'btnTutorialPrimaryCta') {
      spot.classList.add('hidden');
      return;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width < 8 || rect.height < 8) {
      spot.classList.add('hidden');
      return;
    }

    const isInsideTransformedTray = Boolean(
      el.closest('#seedBrushTray, #pastureBrushTray, #visitorDockBar')
    );
    if (!isInsideTransformedTray) {
      el.setAttribute('data-tutorial-anchor', 'true');
    }
    spot.classList.toggle('use-css-anchor', !isInsideTransformedTray);
    const pad = 6;
    spot.style.setProperty('--spot-left', `${Math.round(rect.left - pad)}px`);
    spot.style.setProperty('--spot-top', `${Math.round(rect.top - pad)}px`);
    spot.style.setProperty('--spot-w', `${Math.round(rect.width + pad * 2)}px`);
    spot.style.setProperty('--spot-h', `${Math.round(rect.height + pad * 2)}px`);
    spot.classList.toggle('pill-below', rect.top < 110);
    if (spotLbl) {
      spotLbl.textContent = label || '👇 Bấm';
    }
    spot.classList.remove('hidden');
}

export function socialUiHideTutorialPopover(hud: GameHUD, card: HTMLElement): void {
    if (typeof (card as HTMLElement & { hidePopover?: () => void }).hidePopover === 'function') {
      try {
        if (card.matches(':popover-open')) {
          (card as HTMLElement & { hidePopover: () => void }).hidePopover();
        }
      } catch {
        // Ignore if not currently open
      }
    }
    card.classList.remove('is-legacy-open');
}

export function socialUiShowTutorialPopover(hud: GameHUD, card: HTMLElement): void {
    if (typeof (card as HTMLElement & { showPopover?: () => void }).showPopover === 'function') {
      try {
        if (!card.matches(':popover-open')) {
          (card as HTMLElement & { showPopover: () => void }).showPopover();
        }
        return;
      } catch {
        // Fall through to legacy fixed class fallback
      }
    }
    card.classList.add('is-legacy-open');
}

export function socialUiRenderTutorialCoach(hud: GameHUD): void {
    const card = hud.root.querySelector('#tutorialCoachCard') as HTMLElement | null;
    if (!card) return;

    const anyModalOpen = Boolean(document.querySelector('dialog[open]'));
    const step = hud.sim.getCurrentTutorialStep();
    if (hud.photoModeActive || anyModalOpen || !step) {
      socialUiHideTutorialPopover(hud, card);
      socialUiUpdateTutorialHudSpotlight(hud);
      return;
    }

    const bottomSheetBusy =
      hud.seedTrayOpen ||
      hud.pastureTrayOpen ||
      hud.buildSheetOpen ||
      Boolean(hud.activeCategory) ||
      Boolean(hud.selectedCatalogItem);
    card.classList.toggle('docked-top', bottomSheetBusy);
    card.classList.toggle('is-minimized', hud.tutorialMinimized);

    const deliverableOwlCount = hud.sim.getReadyOwlOrdersCount();
    const renderSig = `${step.index}:${step.id}:${hud.tutorialMinimized ? 1 : 0}:${bottomSheetBusy ? 1 : 0}:${deliverableOwlCount}`;

    if (hud.lastRenderedTutorialSig !== renderSig) {
      hud.lastRenderedTutorialSig = renderSig;
      const dotsHtml = TUTORIAL_STEPS.map((s) => {
        const stateCls =
          s.index < step.index ? 'done' : s.index === step.index ? 'current' : 'upcoming';
        return `<span class="tutorial-step-dot ${stateCls}" aria-hidden="true"></span>`;
      }).join('');

      if (hud.tutorialMinimized) {
        card.innerHTML = `
          <div class="tutorial-mini-bar">
            <img src="/sprites/${step.pose}.png" alt="" class="tutorial-mini-avatar" />
            <div class="tutorial-mini-info">
              <h2 id="tutorialCoachTitle" class="tutorial-mini-title">${escapeHtml(step.title)}</h2>
            </div>
            <button id="btnTutorialExpand" type="button" data-tutorial-focus class="brass-btn gold-cta">▴ Mở</button>
            <button
              id="btnTutorialSkipMini"
              type="button"
              popovertarget="tutorialCoachCard"
              popovertargetaction="hide"
              class="brass-btn tutorial-skip-btn"
              aria-label="Bỏ qua hướng dẫn"
            >✕</button>
          </div>
        `;
      } else {
        const extraActionBtn =
          step.id === 'earn_magic_star'
            ? `<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">♟️ 4 Môn</button>`
            : step.id === 'build_and_owl_order'
              ? `<button id="btnTutorialSecondaryCta" type="button" class="brass-btn">${
                  deliverableOwlCount > 0 ? '🔨 Xây' : '🦉 Đơn Cú'
                }</button>`
              : '';

        const primaryLabel =
          step.id === 'build_and_owl_order'
            ? deliverableOwlCount > 0
              ? '🦉 Giao Đơn!'
              : '🔨 Xây Dựng'
            : step.ctaLabel;

        card.innerHTML = `
          <div class="tutorial-portrait-col">
            <div class="tutorial-portrait-halo" aria-hidden="true"></div>
            <img src="/sprites/${step.pose}.png" alt="" class="tutorial-molly-img" />
            <div
              class="tutorial-step-dots"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="${TUTORIAL_STEPS.length}"
              aria-valuenow="${step.index + 1}"
              aria-label="Tiến độ hướng dẫn Hang Sóc"
            >
              ${dotsHtml}
            </div>
          </div>
          <div class="tutorial-body-col">
            <div class="tutorial-top-row">
              <div class="tutorial-speaker-pill">
                🥧 ${escapeHtml(step.speakerName)}
              </div>
              <div class="tutorial-top-controls">
                <button
                  id="btnTutorialMinimize"
                  type="button"
                  class="tutorial-ghost-btn"
                  aria-label="Thu gọn bảng hướng dẫn"
                >▾</button>
                <button
                  id="btnTutorialSkip"
                  type="button"
                  popovertarget="tutorialCoachCard"
                  popovertargetaction="hide"
                  class="tutorial-ghost-btn tutorial-skip-btn"
                  aria-label="Bỏ qua hướng dẫn"
                >✕</button>
              </div>
            </div>
            <h2 id="tutorialCoachTitle" class="tutorial-coach-title">${escapeHtml(step.title)}</h2>
            <div class="tutorial-hint-strip">${escapeHtml(step.hintVi)}</div>
            <div class="tutorial-footer-row">
              <span class="tutorial-reward-pill">🎁 ${escapeHtml(step.rewardLabel)}</span>
              <div class="tutorial-cta-group">
                ${extraActionBtn}
                <button
                  id="btnTutorialPrimaryCta"
                  type="button"
                  data-tutorial-focus
                  class="brass-btn gold-cta tutorial-primary-cta"
                >${escapeHtml(primaryLabel)}</button>
              </div>
            </div>
          </div>
        `;
      }

      card.querySelector('#btnTutorialExpand')?.addEventListener('click', () => {
        hud.tutorialMinimized = false;
        socialUiRenderTutorialCoach(hud);
      });
      card.querySelector('#btnTutorialMinimize')?.addEventListener('click', () => {
        hud.tutorialMinimized = true;
        socialUiRenderTutorialCoach(hud);
      });
      card.querySelector('#btnTutorialSkip')?.addEventListener('click', () => {
        hud.sim.skipTutorial();
      });
      card.querySelector('#btnTutorialSkipMini')?.addEventListener('click', () => {
        hud.sim.skipTutorial();
      });
      card.querySelector('#btnTutorialPrimaryCta')?.addEventListener('click', () => {
        socialUiHandleTutorialPrimaryAction(hud, step.id);
      });
      card.querySelector('#btnTutorialSecondaryCta')?.addEventListener('click', () => {
        if (step.id === 'earn_magic_star') {
          hud.openPuzzleArcadeDialog();
        } else if (step.id === 'build_and_owl_order') {
          if (deliverableOwlCount > 0) {
            hud.closeSeedTray();
            hud.closePastureTray();
            hud.buildSheetOpen = true;
            hud.activeCategory = 'shop';
            hud.refreshAll();
          } else {
            hud.activeQuestTab = 'orders';
            hud.renderQuestDialog();
            (hud.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
          }
        }
      });
    }

    socialUiShowTutorialPopover(hud, card);

    const stepFocusKey = `${step.index}:${step.id}`;
    if (hud.lastFocusedTutorialStepKey !== stepFocusKey) {
      hud.lastFocusedTutorialStepKey = stepFocusKey;
      requestAnimationFrame(() => {
        card
          .querySelector<HTMLElement>('[data-tutorial-focus]')
          ?.focus({ preventScroll: true });
      });
    }

    socialUiUpdateTutorialHudSpotlight(hud);
}

export function socialUiHandleTutorialPrimaryAction(hud: GameHUD, stepId: string): void {
    if (stepId === 'harvest_wheat') {
      const target = hud.sim.getTutorialWorldTarget();
      if (target) {
        socialUiPanCameraToTutorialTarget(hud);
        hud.showToast('🌾 Nhấp trực tiếp vào ô Lúa Mì đang sáng vàng để gặt nhé!', '🌾');
      } else {
        const plotItem = getCatalogItem('farmland_plot');
        if (plotItem) {
          hud.selectedCatalogItem = plotItem;
          hud.refreshAll();
        }
      }
      return;
    }

    if (stepId === 'sow_and_merge_plot') {
      socialUiPanCameraToTutorialTarget(hud);
      hud.seedFilterMode = 'flowers';
      hud.openSeedTray('english_rose');
      return;
    }

    if (stepId === 'pasture_harvest_and_stock') {
      socialUiPanCameraToTutorialTarget(hud);
      const now = Date.now();
      const hasReadyPasture = hud.sim.state.buildings.some(
        (b) =>
          getCatalogItem(b.itemId)?.isAnimalPasturePlot &&
          b.pastureAnimalId &&
          b.pastureReadyAt &&
          now >= b.pastureReadyAt
      );
      if (hasReadyPasture && !hud.sim.state.tutorial?.pastureHarvestedInStep3) {
        hud.showToast('👆 Nhấp vào ô Đồng Cỏ đang có bong bóng trứng để thu hoạch trước nhé!', '🥚');
      } else {
        hud.openPastureTray('ottery_sheep');
      }
      return;
    }

    if (stepId === 'seed_quiz_or_buy') {
      hud.openSeedQuizDialog('meadow_daisy', null);
      return;
    }

    if (stepId === 'earn_magic_star') {
      hud.openMatch3Dialog();
      return;
    }

    if (stepId === 'build_and_owl_order') {
      if (hud.sim.getReadyOwlOrdersCount() > 0) {
        hud.activeQuestTab = 'orders';
        hud.renderQuestDialog();
        (hud.root.querySelector('#questDialog') as HTMLDialogElement).showModal();
      } else {
        hud.closeSeedTray();
        hud.closePastureTray();
        hud.buildSheetOpen = true;
        hud.activeCategory = 'shop';
        hud.refreshAll();
      }
    }
}
