// Tách tự động từ src/ui/hud.ts (P0 — tách god file theo domain).
// Pattern delegation: hàm nhận `hud` để giữ nguyên state, không đổi hành vi.

import { avatarGlyph } from '../hpvn/emoji';
import { fetchHouseCup, houseCup, houseWeekPoints } from '../hpvn/houseCup';
import { renderFarmExchange } from '../hpvn/exchange';
import { secondsToVietnamMidnight } from '../sim/neighborSocial'; // HPVN: real countdown to VN midnight
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
  ACHIEVEMENT_REGISTRY,
  AchievementCategory,
  DAY_1_TO_7_REWARDS,
  ensureRetentionState,
  FARM_HARVEST_CHEST_XP,
  formatHarvestFeastRewardVi,
  getAchievementCodexSummary,
  getCategoryMetricValue,
  getItemPriceBounds,
  getNpcScheduleForPeriod,
  getUpgradeCost,
  loadFromNamedSlot,
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
  SaveSlotId,
  STORY_CUTSCENE_CHAPTERS,
} from '../sim/simulation';
import { VALLEY_VILLAGER_PROFILES, getLocalDateKey } from '../sim/simulationData';
import { yuleTaskProgress } from '../sim/yuleEvent';
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
  LayoutPresetId,
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

export function questsUiOpenHarvestFeastDialog(hud: GameHUD): void {
    hud.closeHudPopovers();
    questsUiRenderHarvestFeastDialog(hud);
    const dlg = hud.root.querySelector('#harvestFeastDialog') as HTMLDialogElement | null;
    if (dlg && !dlg.open) {
      dlg.showModal();
    }
}

export function questsUiRefreshHarvestFeastBadges(hud: GameHUD): void {
    const claimable = hud.sim.getClaimableHarvestFeastCount();
    const cornerBadge = hud.root.querySelector('#badgeFeastCount') as HTMLElement | null;
    if (cornerBadge) {
      if (claimable > 0) {
        cornerBadge.textContent = String(claimable);
        cornerBadge.classList.remove('hidden');
      } else {
        cornerBadge.classList.add('hidden');
      }
    }
    const manageBadge = hud.root.querySelector('#badgeManageFeastCount') as HTMLElement | null;
    if (manageBadge) {
      if (claimable > 0) {
        manageBadge.textContent = String(claimable);
        manageBadge.classList.remove('hidden');
      } else {
        manageBadge.classList.add('hidden');
      }
    }
}

export function questsUiShowRibbonUnveilBanner(hud: GameHUD, info: RibbonUnveilCelebration): void {
    const card = hud.root.querySelector('#ribbonUnveilToastCard') as HTMLElement | null;
    if (!card) return;
    card.innerHTML = `
      <div class="ribbon-unveil-banner-inner">
        <img src="/game/trang-trai-hang-soc/sprites/prop_ribbon_unveil.webp" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${escapeHtml(info.speakerEmoji)} ${escapeHtml(info.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${escapeHtml(info.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">${info.bonusSickle > 0 ? `+${info.bonusSickle.toLocaleString('vi-VN')} 🪙 • +${info.bonusXp.toLocaleString('vi-VN')} ⭐ • +${info.feastPoints} 🍁` : 'Thưởng khánh thành chỉ nhận một lần cho mỗi loại công trình'}</div>
        </div>
      </div>
    `;
    card.classList.remove('hidden');
    if (hud.ribbonBannerTimer) {
      window.clearTimeout(hud.ribbonBannerTimer);
    }
    hud.ribbonBannerTimer = window.setTimeout(() => {
      card.classList.add('hidden');
      hud.ribbonBannerTimer = 0;
    }, 5200);
}

export function questsUiRenderHarvestFeastDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#harvestFeastDialogContent') as HTMLElement | null;
    if (!box) return;

    const feast = hud.sim.ensureHarvestFeast();
    const claimedSet = new Set(feast.claimedTiers);
    const maxPts = HARVEST_FEAST_TIERS[HARVEST_FEAST_TIERS.length - 1]?.pointsRequired ?? 3000;
    const pct = Math.min(100, Math.round((feast.points / Math.max(1, maxPts)) * 100));
    const claimableCount = hud.sim.getClaimableHarvestFeastCount();
    const allClaimed = HARVEST_FEAST_TIERS.every((t) => claimedSet.has(t.tier));
    const nextUnclaimed = HARVEST_FEAST_TIERS.find((t) => !claimedSet.has(t.tier));

    const tiersHtml = HARVEST_FEAST_TIERS.map((tierDef) => {
      const isClaimed = claimedSet.has(tierDef.tier);
      const isUnlocked = feast.points >= tierDef.pointsRequired;
      const canClaim = isUnlocked && !isClaimed;
      const rewardLabel = formatHarvestFeastRewardVi(tierDef);
      const isGrand = tierDef.tier % 5 === 0;
      const stateClass = isClaimed
        ? 'is-claimed'
        : canClaim
          ? 'is-claimable'
          : 'is-locked';
      return `
        <article class="feast-tier-card ${stateClass} ${isGrand ? 'is-grand' : ''}">
          <div class="feast-tier-badge">
            <span class="feast-tier-num">#${tierDef.tier}</span>
            <span class="feast-tier-pts">🍁 ${tierDef.pointsRequired.toLocaleString('vi-VN')}</span>
          </div>
          <div class="feast-tier-main">
            <div class="feast-tier-title">
              <span>${escapeHtml(tierDef.icon)} ${escapeHtml(tierDef.titleVi)}</span>
              ${isGrand ? '<span class="feast-grand-pill">Mốc lớn</span>' : ''}
            </div>
            <div class="feast-tier-reward">${escapeHtml(rewardLabel)}</div>
          </div>
          <div class="feast-tier-cta">
            ${
              isClaimed
                ? '<span class="feast-claimed-pill">✓</span>'
                : canClaim
                  ? `<button type="button" data-claim-feast-tier="${tierDef.tier}" class="brass-btn gold-cta">🎁 Nhận</button>`
                  : `<span class="feast-need-pill">-${(tierDef.pointsRequired - feast.points).toLocaleString('vi-VN')} 🍁</span>`
            }
          </div>
        </article>
      `;
    }).join('');

    box.innerHTML = `
      <div class="feast-hero-banner">
        <div class="feast-hero-top">
          <div>
            <div class="feast-hero-kicker">🍲 MÙA ${feast.seasonCycle}</div>
            <div class="feast-hero-points">🍁 ${feast.points.toLocaleString('vi-VN')} / ${maxPts.toLocaleString('vi-VN')}</div>
            <div class="feast-hero-sub">
              ${
                allClaimed
                  ? '🎉 30/30!'
                  : nextUnclaimed
                    ? ` Kế tiếp: #${nextUnclaimed.tier} (${nextUnclaimed.pointsRequired.toLocaleString('vi-VN')} 🍁)`
                    : ''
              }
            </div>
          </div>
          <div class="feast-hero-actions">
            ${
              claimableCount > 0
                ? `<button id="btnFeastClaimAll" type="button" class="brass-btn gold-cta">🎁 Nhận (${claimableCount})</button>`
                : ''
            }
            ${
              allClaimed
                ? `<button id="btnFeastNextSeason" type="button" class="brass-btn gold-cta">✨ Mùa ${feast.seasonCycle + 1}</button>`
                : ''
            }
          </div>
        </div>
        <progress class="ts-build-progress feast-progress-bar" max="100" value="${pct}" aria-label="Tiến độ Đại Tiệc Mùa Gặt"></progress>
        <div class="feast-earn-guide">
          <span>🌾 +5~7🍁</span>
          <span>🥧 +10🍁</span>
          <span>🪄 +12🍁</span>
          <span>🦉 +22🍁</span>
          <span>🎀 +25🍁</span>
          <span>🧩 +28~40🍁</span>
        </div>
      </div>

      <div class="feast-tier-list" role="list">
        ${tiersHtml}
      </div>
    `;

    box.querySelector('#btnFeastClaimAll')?.addEventListener('click', () => {
      const res = hud.sim.claimAllHarvestFeastTiers();
      hud.showToast(res.msg, res.ok ? '🍁' : '⏳');
      hud.refreshAll();
    });

    box.querySelector('#btnFeastNextSeason')?.addEventListener('click', () => {
      const res = hud.sim.startNextHarvestFeastCycle();
      hud.showToast(res.msg, res.ok ? '✨' : '🍁');
      hud.refreshAll();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-claim-feast-tier]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tierNum = Number(btn.dataset.claimFeastTier);
        if (!Number.isFinite(tierNum)) return;
        const res = hud.sim.claimHarvestFeastTier(tierNum);
        hud.showToast(res.msg, res.ok ? '🎁' : '🍁');
        hud.refreshAll();
      });
    });
}

export function questsUiRenderFinanceDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#financeDialogContent') as HTMLElement;
    const f = hud.sim.state.finance;
    const totalIn = f.gateRevenue + f.ticketRevenue + f.shopRevenue + f.harvestRevenue;
    const totalOut = f.staffWagesPaid + f.constructionSpent;
    const net = totalIn - totalOut;
    const wagePerCycle = hud.sim.getHourlyStaffWage();

    box.innerHTML = `
      <div class="grid-2col" style="margin-bottom:16px;">
        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#15803d;">📈 Thu</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú</span><strong>+${f.harvestRevenue.toLocaleString('vi-VN')} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm</span><strong>+${(f.shopRevenue + f.ticketRevenue + f.gateRevenue).toLocaleString('vi-VN')} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:#15803d;"><span>Tổng thu</span><strong>+${totalIn.toLocaleString('vi-VN')} Sickle</strong></div>
          </div>
        </div>

        <div class="quest-card-mini">
          <h3 class="hs-section-title" style="color:#9a3412;">📉 Chi</h3>
          <div style="font-size:13px;display:flex;flex-direction:column;gap:6px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây &amp; Nâng sao</span><strong>-${f.constructionSpent.toLocaleString('vi-VN')} Sickle</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${wagePerCycle}/ca)</span><strong>-${f.staffWagesPaid.toLocaleString('vi-VN')} Sickle</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.22);margin:2px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:14px;font-weight:700;color:${net >= 0 ? '#15803d' : '#b45309'};">
              <span>Ròng</span><strong>${net >= 0 ? '+' : ''}${net.toLocaleString('vi-VN')} Sickle</strong>
            </div>
          </div>
        </div>
      </div>
      <div id="hpvnExchange"></div>
    `;
    renderFarmExchange(box.querySelector('#hpvnExchange') as HTMLElement, hud); // HPVN: Quầy Gringotts (src/hpvn/exchange.ts)
}

// HPVN: everything in the Cúp tab is the server's (src/hpvn/houseCup.ts); a fetch re-renders the open tab.
// Only a new reply re-renders: the cached answer (same object) would re-render, refetch the cache and loop forever.
function refreshHouseCup(hud: GameHUD) {
  const before = houseCup();
  return fetchHouseCup().then((cup) => {
    const dlg = hud.root.querySelector('#albumDialog') as HTMLDialogElement | null;
    if (cup !== before && dlg?.open && hud.activeAlbumTab === 'cup') questsUiRenderAlbumDialog(hud);
    const introDlg = hud.root.querySelector('#houseCupIntroDialog') as HTMLDialogElement | null;
    if (cup !== before && introDlg?.open) questsUiRenderHouseCupIntroDialog(hud);
    return cup;
  });
}

function buildHouseCupStandingsHtml(playerHouse: HouseName, cup: ReturnType<typeof houseCup>): {
  listHtml: string;
  noHouse: boolean;
  perTier: number;
  bank: number;
} {
  const houses = (['Gryffindor', 'Slytherin', 'Ravenclaw', 'Hufflepuff'] as HouseName[])
    .map((house) => ({ house, pts: houseWeekPoints(house) }))
    .sort((x, y) => y.pts - x.pts);
  const top = Math.max(1, houses[0].pts);
  const noHouse = cup?.house === null;
  const pts = (v: number) => `${v.toLocaleString('vi-VN')} đ`;
  const listHtml = houses
    .map((h) => {
      const mine = !noHouse && h.house === playerHouse;
      const name = `${h.house}${mine ? '<span class="hs-cup-you">Nhà bạn</span>' : ''}`;
      const crest = `<img class="hs-cup-crest" src="/game/trang-trai-hang-soc/sprites/crest-${h.house.toLowerCase()}.webp" alt="" width="32" height="32">`;
      const pct = Math.round((h.pts / top) * 100);
      return `
        <li class="hs-cup-row" data-house="${h.house}" data-mine="${mine}">
          ${crest}
          <span class="hs-cup-name">${name}</span>
          <span class="hs-cup-pts">${cup ? pts(h.pts) : '…'}</span>
          <span class="hs-cup-bar"><i style="width:${pct}%"></i></span>
        </li>`;
    })
    .join('');
  const perTier = cup?.perTier ?? 300;
  const bank = Math.min(perTier, cup?.memberBank ?? 0);
  return { listHtml, noHouse, perTier, bank };
}

/** Mở pop-up thông tin Cúp 4 Nhà Hogwarts (khi mới vào game hoặc xem thể lệ). */
export function questsUiOpenHouseCupIntroDialog(hud: GameHUD): void {
  hud.hasShownHouseCupIntro = true;
  hud.closeHudPopovers();
  questsUiRenderHouseCupIntroDialog(hud);
  const dlg = hud.root.querySelector('#houseCupIntroDialog') as HTMLDialogElement | null;
  if (dlg && !dlg.open) {
    dlg.showModal();
  }
}

/** Dựng nội dung pop-up thông tin Cúp 4 Nhà Hogwarts từ dữ liệu máy chủ HPVN. */
export function questsUiRenderHouseCupIntroDialog(hud: GameHUD): void {
  const box = hud.root.querySelector('#houseCupIntroDialogContent') as HTMLElement | null;
  if (!box) return;
  const playerHouse = hud.sim.getPlayerHouse();
  const cup = houseCup();
  refreshHouseCup(hud).catch(() => {});

  const { listHtml, noHouse, perTier, bank } = buildHouseCupStandingsHtml(playerHouse, cup);
  const tierNum = cup?.memberTier ?? 1;
  const dailyCap = cup?.memberDailyCap ?? 0;
  const todayPts = cup?.memberTodayPoints ?? 0;
  const crestSrc = noHouse
    ? '/game/trang-trai-hang-soc/sprites/ui_trophy_cup.webp'
    : `/game/trang-trai-hang-soc/sprites/crest-${playerHouse.toLowerCase()}.webp`;
  const subText = noHouse
    ? 'Đội Nón Phân Loại trên HPVN để bắt đầu góp điểm và nhận quà Cúp Đợt.'
    : cup
      ? `Hôm nay: ${todayPts.toLocaleString('vi-VN')}${dailyCap > 0 ? `/${dailyCap.toLocaleString('vi-VN')}` : ''} đ · Cúp Đợt ${tierNum}: ${bank.toLocaleString('vi-VN')}/${perTier.toLocaleString('vi-VN')} đ`
      : 'Đang tải bảng điểm tuần từ máy chủ HPVN…';

  box.innerHTML = `
    <div class="hs-cup hs-cup-intro">
      <div class="hs-cup-intro-hero" data-house="${noHouse ? '' : escapeHtml(playerHouse)}">
        <img class="hs-cup-intro-crest" src="${crestSrc}" alt="" width="40" height="40" />
        <div class="hs-cup-intro-copy">
          <span class="hs-cup-kicker">${cup?.weekKey ? `Mùa giải Tuần ${escapeHtml(cup.weekKey)}` : 'Giải đấu 4 Nhà hàng tuần'}</span>
          <strong class="hs-cup-intro-title">${noHouse ? 'Chưa phân Nhà trên HPVN' : `Nhà ${escapeHtml(playerHouse)}`}</strong>
          <span class="hs-cup-intro-sub">${subText}</span>
        </div>
      </div>

      <ol class="hs-cup-list hs-cup-intro-standings">${listHtml}</ol>

      <div class="quest-card-mini hs-cup-intro-rules">
        <h3 class="hs-section-title">Thể lệ &amp; Phần thưởng Cúp Nhà</h3>
        <ul class="hs-cup-intro-points">
          <li><strong>Ghi điểm cho Nhà:</strong> Thắng màn mới ở 4 môn tính điểm (<strong>Bùa Gặt</strong>, <strong>Số Học</strong>, <strong>Sinh Vật</strong>, <strong>Tranh Ghép</strong>) góp từ <strong>20 đ/màn</strong> vào quỹ điểm tuần của Nhà${dailyCap > 0 ? ` (tối đa ${dailyCap.toLocaleString('vi-VN')} đ/ngày)` : ''}.</li>
          <li><strong>Thưởng Cúp Đợt tự động:</strong> Mỗi khi tích đủ <strong>${perTier.toLocaleString('vi-VN')} đ</strong>, máy chủ HPVN trao ngay quà <strong>Sickle</strong>, <strong>XP</strong> và <strong>Cát Thời Gian</strong> thẳng vào trang trại.</li>
          <li><strong>Đua Cúp hàng tuần:</strong> Điểm của toàn bộ học sinh cùng Nhà trên HPVN được cộng dồn suốt tuần lễ. Xem lại bất cứ lúc nào tại <strong>Hồ Sơ &amp; BXH → Cúp Nhà</strong>.</li>
        </ul>
      </div>

      <div class="hs-dlg-actions">
        <button id="btnCupIntroPlay" type="button" class="brass-btn">Thi đấu ngay</button>
        <button id="btnCupIntroClose" type="button" class="brass-btn gold-cta">Vào trang trại</button>
      </div>
    </div>
  `;

  box.querySelector('#btnCupIntroClose')?.addEventListener('click', () => {
    (hud.root.querySelector('#houseCupIntroDialog') as HTMLDialogElement | null)?.close();
  });

  box.querySelector('#btnCupIntroPlay')?.addEventListener('click', () => {
    (hud.root.querySelector('#houseCupIntroDialog') as HTMLDialogElement | null)?.close();
    const last = hud.sim.getLastPlayedMinigame();
    if (last === 'sudoku' || last === 'blocks' || last === 'jigsaw') {
      hud.openPuzzleArcadeDialog(last);
    } else {
      hud.openMatch3Dialog();
    }
  });
}

export function questsUiRenderAlbumDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#albumDialogContent') as HTMLElement;
    const st = hud.sim.state;
    hud.sim.checkAndToastAchievements();
    const ret = ensureRetentionState(st);
    const codex = getAchievementCodexSummary(st);
    const claimableAchCount = ACHIEVEMENT_REGISTRY.filter((a) => {
      const e = ret.achievements[a.id];
      return Boolean(e?.unlockedAt && !e?.claimedAt);
    }).length;
    const maxLoginDay = hud.sim.getUnlockedLoginDayMax();
    const claimableLoginCount = DAY_1_TO_7_REWARDS.filter(
      (d) => d.day <= maxLoginDay && !ret.claimedLoginDays.includes(d.day)
    ).length;
    const totalProfileBadge = claimableAchCount + claimableLoginCount;

    // HPVN: unified Hồ Sơ, Cúp Nhà & Bảng Xếp Hạng hub (Đợt 8).
    const tab = (id: GameHUD['activeAlbumTab'], label: string, badge = 0) =>
      `<button type="button" role="tab" data-atab="${id}" aria-selected="${hud.activeAlbumTab === id}" class="hs-tab">${label}${
        badge > 0 ? `<span class="hs-tab-badge">${badge}</span>` : ''
      }</button>`;
    const tabsHtml = `
      <div class="hs-tabs" role="tablist" aria-label="Hồ Sơ, Cúp &amp; Xếp Hạng">
        ${tab('profile', 'Hồ sơ', totalProfileBadge)}${tab('cup', 'Cúp Nhà')}${tab('leaderboard', 'Xếp hạng')}
      </div>
    `;

    let bodyHtml = '';
    if (hud.activeAlbumTab === 'cup') {
      const playerHouse = hud.sim.getPlayerHouse();
      // HPVN: server numbers only (week totals per HPVN house, the member's day and milestone bank); nothing local.
      const cup = houseCup();
      refreshHouseCup(hud).catch(() => {});
      const { listHtml, noHouse, perTier, bank } = buildHouseCupStandingsHtml(playerHouse, cup);
      const pts = (v: number) => `${v.toLocaleString('vi-VN')} đ`;
      const row = (lead: string, name: string, value: string, pct: number | null, house = '', mine = false) => `
        <li class="hs-cup-row"${house ? ` data-house="${house}" data-mine="${mine}"` : ''}>
          ${lead || '<span></span>'}
          <span class="hs-cup-name">${name}</span>
          <span class="hs-cup-pts">${value}</span>
          ${pct === null ? '' : `<span class="hs-cup-bar"><i style="width:${pct}%"></i></span>`}
        </li>`;
      const meHtml = cup
        ? noHouse
          ? row('', 'Chưa phân Nhà trên HPVN', '0 đ', null)
          : row('', 'Hôm nay', pts(cup.memberTodayPoints), null) +
            row('', `Đợt ${cup.memberTier}`, `${bank} / ${pts(perTier)}`, Math.round((bank / perTier) * 100))
        : '';

      bodyHtml = `
        <div class="hs-cup">
          <div class="hs-cup-kicker hs-cup-kicker-row">
            <span>${cup?.weekKey ? `Tuần ${cup.weekKey}` : 'Đang tải…'}</span>
            <button id="btnOpenCupIntroFromTab" type="button" class="brass-btn hs-cup-info-btn">Thể lệ</button>
          </div>
          <ol class="hs-cup-list">${listHtml}</ol>
          ${meHtml ? `<ul class="hs-cup-me">${meHtml}</ul>` : ''}
          <p class="hs-cup-note">Thắng màn mới Bùa Gặt, Số Học, Sinh Vật, Tranh Ghép: từ 20 đ/màn.</p>
        </div>
      `;
    } else if (hud.activeAlbumTab === 'leaderboard') {
      bodyHtml = `<div id="leaderboardTabMount"></div>`;
    } else {
      const playerHouse = hud.sim.getPlayerHouse();
      const cup = houseCup();
      const noHouse = cup?.house === null;
      const crestSrc = noHouse
        ? '/game/trang-trai-hang-soc/sprites/ui_trophy_cup.webp'
        : `/game/trang-trai-hang-soc/sprites/crest-${playerHouse.toLowerCase()}.webp`;
      const houseTag = noHouse ? 'Chưa phân Nhà' : playerHouse;
      const psubBtn = (id: GameHUD['activeProfileSubTab'], label: string, badge = 0) =>
        `<button type="button" role="tab" data-psub="${id}" aria-selected="${hud.activeProfileSubTab === id}" class="lb-scope-pill ${hud.activeProfileSubTab === id ? 'active' : ''}">${label}${
          badge > 0 ? `<span class="hs-tab-badge">${badge}</span>` : ''
        }</button>`;

      let subBodyHtml = '';
      if (hud.activeProfileSubTab === 'achievements') {
        const nowAch = Date.now();
        const metricByCat: Record<AchievementCategory, number> = {
          farm: getCategoryMetricValue(st, 'farm', nowAch),
          building: getCategoryMetricValue(st, 'building', nowAch),
          puzzle: getCategoryMetricValue(st, 'puzzle', nowAch),
          language: getCategoryMetricValue(st, 'language', nowAch),
          social: getCategoryMetricValue(st, 'social', nowAch),
          collection: getCategoryMetricValue(st, 'collection', nowAch),
        };
        const catFilterPills: Array<[AchievementCategory | 'all', string]> = [
          ['all', 'Tất cả'],
          ['farm', 'Mùa vụ'],
          ['building', 'Kiến trúc'],
          ['puzzle', 'Khảo thí'],
          ['language', 'Đa ngữ'],
          ['social', 'Xã hội'],
          ['collection', 'Sưu tầm'],
        ];
        const activeCat = hud.activeAchievementFilterCat ?? 'all';
        // ready-to-claim first, otherwise registry order
        const visibleAchievements = ACHIEVEMENT_REGISTRY.filter((def) => activeCat === 'all' || def.category === activeCat)
          .slice()
          .sort((a, b) => {
            const ready = (id: string) => (ret.achievements[id]?.unlockedAt && !ret.achievements[id]?.claimedAt ? 1 : 0);
            return ready(b.id) - ready(a.id);
          });
        subBodyHtml = `
          <div class="quest-card-mini">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
              <h3 class="hs-section-title" style="margin:0;">52 Thành tựu</h3>
              <span style="font-size:12px;font-weight:700;color:var(--ink-gold);">${codex.unlocked}/${codex.total} (${codex.completionPct}%)</span>
              ${
                claimableAchCount > 0
                  ? `<button id="btnClaimAllAchievements" type="button" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận tất cả (${claimableAchCount})</button>`
                  : ''
              }
            </div>
            <progress max="${codex.total}" value="${codex.unlocked}" style="width:100%;margin-bottom:8px;"></progress>
            <div class="lb-scope-pills" role="group" aria-label="Lọc thành tựu theo nhóm">
              ${catFilterPills
                .map(
                  ([id, label]) =>
                    `<button type="button" data-ach-cat="${id}" aria-pressed="${activeCat === id}" class="lb-scope-pill ${activeCat === id ? 'active' : ''}">${label}</button>`
                )
                .join('')}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${visibleAchievements.map((def) => {
              const entry = ret.achievements[def.id];
              const unlocked = Boolean(entry?.unlockedAt);
              const claimed = Boolean(entry?.claimedAt);
              const curVal = Math.min(def.target, Math.max(0, metricByCat[def.category] ?? 0));
              const curLabel = curVal.toLocaleString('vi-VN');
              const targetLabel = def.target.toLocaleString('vi-VN');
              return `
                <div class="aaa-ach-card" data-unlocked="${unlocked}">
                  <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                    <div style="min-width:0;flex:1;">
                      <div class="hs-card-title">${def.titleVi}</div>
                      <div style="font-size:12px;color:var(--ink-soft);">${def.descVi} · <strong>+${def.rewardSickle} Sickle, +${def.rewardStars} 🌟</strong></div>
                      ${
                        unlocked
                          ? ''
                          : `<progress max="${def.target}" value="${curVal}" style="width:100%;max-width:220px;height:6px;margin-top:4px;"></progress>`
                      }
                    </div>
                  </div>
                  <div style="flex-shrink:0;text-align:right;">
                    ${
                      claimed
                        ? `<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>`
                        : unlocked
                          ? `<button type="button" data-claim-ach="${def.id}" class="brass-btn gold-cta" style="min-height:40px;padding:0 12px;font-size:12px;">Nhận</button>`
                          : `<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">${curLabel}/${targetLabel}</span>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else if (hud.activeProfileSubTab === 'friendship') {
        const period = hud.sim.getRealTimePeriod();
        const todayKey = getLocalDateKey();
        subBodyHtml = `
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Phim cốt truyện</h3>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;">
              ${STORY_CUTSCENE_CHAPTERS.map((chap) => {
                const unlocked = st.level >= chap.unlockLevel || hud.sim.isHeadmasterPreview;
                return `
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${chap.titleVi}</div>
                    <div style="font-size:11px;color:var(--ink-soft);">Cấp ${chap.unlockLevel}</div>
                    <button type="button" data-play-cutscene="${chap.id}" ${unlocked ? '' : 'disabled'} class="brass-btn ${unlocked ? 'gold-cta' : ''}" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${unlocked ? 'Xem' : `Cấp ${chap.unlockLevel}`}
                    </button>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
          <div class="aaa-codex-scroll">
            ${VALLEY_VILLAGER_PROFILES.map((v) => {
              const sched = getNpcScheduleForPeriod(v.id, period);
              const f = ret.npcFriendship[v.id] ?? { villagerId: v.id, level: 1, xp: 0 };
              const nextXp = f.level * 60;
              const talkedToday = f.lastTalkedDayKey === todayKey;
              return `
                <div class="aaa-slot-card">
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
                    <div>
                      <strong class="hs-card-title">${v.nameVi}</strong>
                      <span style="font-size:12px;color:var(--ink-soft);"> · ${v.titleVi}</span>
                    </div>
                    <span style="font-size:12px;font-weight:700;color:var(--berry);">Cấp ${f.level}/10 (${f.xp}/${nextXp})</span>
                  </div>
                  <div style="font-size:12px;color:var(--ink-soft);">${sched.activityVi}</div>
                  <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    <button type="button" data-npc-talk="${v.id}" data-choice="0" ${talkedToday ? 'disabled' : ''} class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">
                      ${talkedToday ? '✓ Đã trò chuyện' : 'Trò chuyện (+35 XP)'}
                    </button>
                    ${
                      talkedToday
                        ? ''
                        : `<button type="button" data-npc-talk="${v.id}" data-choice="1" class="brass-btn" style="min-height:40px;font-size:12px;padding:0 10px;">Gợi chuyện (+25 XP)</button>`
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        subBodyHtml = `
          <div class="quest-card-mini">
            <h3 class="hs-section-title">Điểm danh 7 ngày</h3>
            <div class="aaa-slot-grid">
              ${DAY_1_TO_7_REWARDS.map((d) => {
                const claimed = ret.claimedLoginDays.includes(d.day);
                const canClaim = !claimed && d.day <= maxLoginDay;
                return `
                  <div class="aaa-slot-card">
                    <div style="font-size:13px;font-weight:700;">${d.titleVi}</div>
                    <div style="font-size:12px;color:var(--ink-soft);">
                      +${d.galleons} Sickle · +${d.magicStars} 🌟${d.phoenixTalismans > 0 ? ` · +${d.phoenixTalismans} Bùa` : ''}
                    </div>
                    ${
                      claimed
                        ? `<span style="font-size:12px;font-weight:700;color:var(--farm-green-text);">✓ Đã nhận</span>`
                        : `<button type="button" data-claim-login="${d.day}" ${canClaim ? '' : 'disabled'} class="brass-btn ${canClaim ? 'gold-cta' : ''}" style="min-height:40px;font-size:12px;padding:0 10px;">
                            ${canClaim ? 'Nhận' : 'Chờ mở'}
                          </button>`
                    }
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      bodyHtml = `
        <div class="hs-profile-card" data-house="${escapeHtml(playerHouse)}">
          <img class="hs-profile-crest" src="${crestSrc}" alt="" width="36" height="36" />
          <div class="hs-profile-info">
            <div class="hs-profile-head">
              <strong class="hs-profile-name">${escapeHtml(st.parkName)}</strong>
              <span class="hs-profile-house">${escapeHtml(houseTag)}</span>
            </div>
            <div class="hs-profile-meta">Cấp ${st.level} · ${escapeHtml(getPlayerTitle(st.level))} · 🌟 ${(st.match3?.stars ?? 0).toLocaleString('vi-VN')} · Thành tựu ${codex.unlocked}/${codex.total}</div>
          </div>
        </div>
        <div class="lb-scope-pills hs-profile-subtabs" role="tablist" aria-label="Chi tiết hồ sơ">
          ${psubBtn('login7', 'Điểm danh', claimableLoginCount)}${psubBtn('achievements', 'Thành tựu', claimableAchCount)}${psubBtn('friendship', 'Dân làng')}
        </div>
        ${subBodyHtml}
      `;
    }

    box.innerHTML = tabsHtml + bodyHtml;

    if (hud.activeAlbumTab === 'leaderboard') {
      const mount = box.querySelector('#leaderboardTabMount') as HTMLElement | null;
      if (hud.leaderboardModal) {
        hud.leaderboardModal.render(mount);
      } else {
        if (mount) mount.innerHTML = `<p class="hs-lb-note">Đang tải…</p>`;
        void hud.getLeaderboardModal().then((m) => {
          m.configure(hud.sim.getLastPlayedMinigame());
          if (hud.activeAlbumTab === 'leaderboard') {
            m.render();
            m.syncCloud();
          }
        }, () => {});
      }
    }

    box.querySelector('#btnOpenCupIntroFromTab')?.addEventListener('click', () => {
      (hud.root.querySelector('#albumDialog') as HTMLDialogElement | null)?.close();
      questsUiOpenHouseCupIntroDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-atab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const nextTab = btn.dataset.atab as GameHUD['activeAlbumTab'];
        hud.activeAlbumTab = nextTab;
        questsUiRenderAlbumDialog(hud);
        if (nextTab === 'leaderboard' && hud.leaderboardModal) {
          hud.leaderboardModal.syncCloud();
        }
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-psub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeProfileSubTab = btn.dataset.psub as GameHUD['activeProfileSubTab'];
        questsUiRenderAlbumDialog(hud);
      });
    });

    box.querySelector('#btnClaimAllAchievements')?.addEventListener('click', () => {
      const res = hud.sim.claimAllAchievements();
      hud.showToast(res.msg, res.ok ? '🎖️' : '⚠️');
      questsUiRenderAlbumDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-ach-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeAchievementFilterCat = (btn.dataset.achCat as AchievementCategory | 'all') || 'all';
        questsUiRenderAlbumDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-claim-ach]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.claimAchievement(String(btn.dataset.claimAch));
        hud.showToast(res.msg, res.ok ? '🎖️' : '⚠️');
        questsUiRenderAlbumDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-play-cutscene]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.playStoryCutscene(String(btn.dataset.playCutscene));
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-npc-talk]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const vid = btn.dataset.npcTalk as (typeof VALLEY_VILLAGER_PROFILES)[number]['id'];
        const choice = Number(btn.dataset.choice) === 1 ? 1 : 0;
        const res = hud.sim.talkWithVillagerChoice(vid, choice);
        hud.showToast(res.msg, res.ok ? '💝' : '☕');
        questsUiRenderAlbumDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-claim-login]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.claimLoginDayReward(Number(btn.dataset.claimLogin));
        hud.showToast(res.msg, res.ok ? '📅' : '🔒');
        questsUiRenderAlbumDialog(hud);
      });
    });
}

export function questsUiRenderQuestDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#questDialogContent') as HTMLElement;
    const barn = hud.sim.ensureFarmBarn();
    const story = hud.sim.getActiveStoryQuest();
    const autoAct = hud.sim.getStoryAutoActionPreview();
    const readyOwlCount = hud.sim.getReadyOwlOrdersCount();
    const readyQuestCount =
      (story?.completed ? 1 : 0) +
      hud.sim.state.owlQuests.filter((q) => q.completed && !q.claimed).length +
      hud.sim.state.dailyQuests.filter((q) => q.completed && !q.claimed).length;

    if (
      !hud.selectedOwlOrderId ||
      !barn.owlOrders.some((o) => o.id === hud.selectedOwlOrderId)
    ) {
      const firstReady = barn.owlOrders.find((o) => hud.sim.canFulfillFarmOwlOrder(o));
      hud.selectedOwlOrderId = (firstReady ?? barn.owlOrders[0])?.id ?? null;
    }

    const tabsSwitchHtml = `
      <div class="workshop-tabs" role="group" aria-label="Đơn Hàng Cú & Nhiệm Vụ" style="margin-bottom:12px;">
        <button type="button" data-qtab="orders" data-active="${hud.activeQuestTab === 'orders'}" aria-pressed="${hud.activeQuestTab === 'orders'}" class="brass-btn">
          Đơn Cú <span class="nb-tab-badge">${readyOwlCount}/${barn.owlOrders.length}</span>
        </button>
        <button type="button" data-qtab="quests" data-active="${hud.activeQuestTab === 'quests'}" aria-pressed="${hud.activeQuestTab === 'quests'}" class="brass-btn">
          Nhiệm Vụ ${readyQuestCount > 0 ? `<span class="nb-tab-badge">${readyQuestCount}</span>` : ''}
        </button>
      </div>
    `;

    if (hud.activeQuestTab === 'orders') {
      const selectedOrder =
        barn.owlOrders.find((o) => o.id === hud.selectedOwlOrderId) ?? barn.owlOrders[0];
      const canSendSelected = selectedOrder
        ? hud.sim.canFulfillFarmOwlOrder(selectedOrder)
        : false;

      const pinNotesHtml = barn.owlOrders
        .map((order) => {
          const isSel = selectedOrder?.id === order.id;
          const isReady = hud.sim.canFulfillFarmOwlOrder(order);
          const safePortraitKey =
            order.portraitSprite && /^[a-z0-9_]+$/i.test(order.portraitSprite)
              ? order.portraitSprite
              : null;
          const avatarHtml = safePortraitKey
            ? `<img src="/game/trang-trai-hang-soc/sprites/${safePortraitKey}.webp" alt="${escapeHtml(order.senderName)}" class="owl-note-portrait" />`
            : `<span class="owl-note-emoji">${escapeHtml(avatarGlyph(order.portraitEmoji, order.senderName))}</span>`;
          const miniIcons = order.requirements
            .slice(0, 3)
            .map((req) => {
              const m = getFarmItemMeta(req.itemId);
              return `<img src="${m.iconSrc}" alt="${escapeHtml(m.name)}" title="${req.qty} ${escapeHtml(m.name)}" class="owl-note-mini-item" />`;
            })
            .join('');

          return `
            <button
              type="button"
              class="owl-pin-note ${isSel ? 'selected' : ''} ${isReady ? 'ready' : ''}"
              data-select-owl="${escapeHtml(order.id)}"
            >
              <div class="owl-note-avatar-box">${avatarHtml}</div>
              <div class="owl-note-info">
                <div class="owl-note-sender">${escapeHtml(order.senderName)}</div>
                <div class="owl-note-mini-row">${miniIcons}</div>
                ${order.isFeastMarquee ? '<span class="owl-feast-tag">🎪 Tiệc</span>' : ''}
              </div>
              ${isReady ? '<span class="owl-ready-tick" aria-label="Đủ hàng">✓</span>' : ''}
            </button>
          `;
        })
        .join('');

      const detailHtml = selectedOrder
        ? `
          <div class="owl-detail-sheet">
            <div class="owl-detail-head">
              <div>
                <div class="owl-detail-title">${escapeHtml(selectedOrder.senderName)}</div>
                <div class="owl-detail-sub">🦉 ${escapeHtml(selectedOrder.owlName)}</div>
              </div>
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:12px;" ${hud.sim.getOwlRerollsLeft() > 0 ? `title="Đổi đơn (còn ${hud.sim.getOwlRerollsLeft()} lượt hôm nay)"` : 'disabled title="Hết lượt đổi hôm nay"'}>
                ${hud.sim.getOwlRerollsLeft() > 0 ? `🔄 Đổi (${hud.sim.getOwlRerollsLeft()})` : 'Hết lượt đổi'}
              </button>
            </div>

            <div class="owl-req-list">
              ${selectedOrder.requirements
                .map((req, reqIdx) => {
                  const meta = getFarmItemMeta(req.itemId);
                  const have = hud.sim.getFarmItemCount(req.itemId);
                  const social = hud.sim.ensureNeighborSocial();
                  const owlHelpLeft = Math.max(
                    0,
                    MAX_DAILY_OWL_HELP_REQUESTS - social.dailyOwlHelpRequestedCount
                  );
                  const helpReq = hud.sim.getOwlRequirementHelpState(selectedOrder.id, reqIdx);
                  const helpedByFriend = Boolean(helpReq?.fulfilledAt);
                  const ok = hud.sim.state.sandboxMode || helpedByFriend || have >= req.qty;
                  const coOpControlHtml = helpedByFriend
                    ? `<span class="owl-help-tag done">✓ ${escapeHtml(helpReq?.helperEmoji ?? '🦉')}</span>`
                    : helpReq
                      ? `<span class="owl-help-tag waiting">🦉 Đang gọi...</span>`
                      : !ok
                        ? `<button type="button" class="brass-btn owl-ask-help-btn" data-ask-owl-help="${reqIdx}" ${owlHelpLeft <= 0 ? 'disabled' : ''} title="Nhờ bạn">🤝 Nhờ (${owlHelpLeft})</button>`
                        : `<span class="owl-req-status">✓</span>`;
                  return `
                    <div class="owl-req-row ${ok ? 'ok' : 'lack'}">
                      <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="owl-req-img" />
                      <div class="owl-req-meta">
                        <div class="owl-req-name">${escapeHtml(meta.name)}</div>
                        <div class="owl-req-count">${helpedByFriend ? '✓' : `${hud.sim.state.sandboxMode ? '∞' : have}/${req.qty}`}</div>
                      </div>
                      ${coOpControlHtml}
                    </div>
                  `;
                })
                .join('')}
            </div>

            <div class="owl-reward-box">
              <div class="owl-reward-pills">
                <span class="owl-rew-pill gold">🪙 +${selectedOrder.rewardSickle}</span>
                <span class="owl-rew-pill xp">⭐ +${selectedOrder.rewardXp}</span>
                ${
                  selectedOrder.rewardMugglePlug
                    ? `<span class="owl-rew-pill plug">🔌 +${selectedOrder.rewardMugglePlug}</span>`
                    : ''
                }
                ${
                  (selectedOrder.isFeastMarquee || (barn.ordersDelivered + 1) % 3 === 0) &&
                  hud.sim.getPhoenixTalismanCount() < MAX_PHOENIX_TALISMANS
                    ? `<span class="owl-rew-pill plug">🔥 +1</span>`
                    : ''
                }
              </div>
            </div>
          </div>
        `
        : '';

      box.innerHTML = `
        ${tabsSwitchHtml}
        <div class="owl-pinboard-shell">
          <div class="owl-pinboard-grid">
            <div class="owl-pin-notes-col">${pinNotesHtml}</div>
            ${detailHtml}
          </div>
          <div class="owl-cta-bar">
            <button
              type="button"
              id="btnSendOwlOrder"
              class="owl-green-send-btn ${canSendSelected ? 'ready' : 'not-ready'}"
            >
              ${canSendSelected ? 'Giao hàng' : 'Mở Kho'}
            </button>
          </div>
        </div>
      `;

      box.querySelectorAll<HTMLButtonElement>('[data-qtab]').forEach((btn) => {
        btn.addEventListener('click', () => {
          hud.activeQuestTab = btn.dataset.qtab as 'orders' | 'quests';
          questsUiRenderQuestDialog(hud);
        });
      });

      box.querySelectorAll<HTMLButtonElement>('[data-select-owl]').forEach((btn) => {
        btn.addEventListener('click', () => {
          hud.selectedOwlOrderId = btn.dataset.selectOwl ?? null;
          questsUiRenderQuestDialog(hud);
        });
      });

      box.querySelector('#btnRefreshOwlOrder')?.addEventListener('click', () => {
        if (selectedOrder) {
          hud.sim.refreshFarmOwlOrder(selectedOrder.id);
          hud.selectedOwlOrderId = null;
          questsUiRenderQuestDialog(hud);
        }
      });

      box.querySelectorAll<HTMLButtonElement>('[data-ask-owl-help]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!selectedOrder) return;
          const reqIdx = Number(btn.dataset.askOwlHelp);
          if (!Number.isFinite(reqIdx)) return;
          const res = hud.sim.requestPlayerOwlCrateHelp(selectedOrder.id, reqIdx);
          if (!res.ok) {
            hud.showToast(res.msg, '⚠️');
          }
          questsUiRenderQuestDialog(hud);
        });
      });

      box.querySelector('#btnSendOwlOrder')?.addEventListener('click', () => {
        if (!selectedOrder) return;
        if (!hud.sim.canFulfillFarmOwlOrder(selectedOrder)) {
          const res = hud.sim.fulfillFarmOwlOrder(selectedOrder.id);
          hud.showToast(res.msg, '🧺');
          (hud.root.querySelector('#questDialog') as HTMLDialogElement).close();
          hud.openWorkshopDialog('barn');
          return;
        }
        const sent = hud.sim.fulfillFarmOwlOrder(selectedOrder.id);
        if (sent.ok) {
          hud.showToast(sent.msg, '🦉');
        }
        hud.selectedOwlOrderId = null;
        questsUiRenderQuestDialog(hud);
      });
      return;
    }

    const renderCard = (q: NonNullable<typeof story>, tag: string, isStory = false) => {
      const pct = Math.min(100, Math.round((q.progress / Math.max(1, q.targetAmount)) * 100));
      return `
        <div class="quest-card-mini" style="color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span class="hs-card-title" style="color:var(--ink);">${escapeHtml(q.giverEmoji)} ${escapeHtml(q.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${escapeHtml(tag)}</span>
          </div>
          ${isStory && q.dialogue ? `<div style="font-size:12px;color:var(--ink-soft);margin-top:4px;line-height:1.35;">${escapeHtml(q.dialogue)}</div>` : ''}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:700;color:var(--ink);">
            <span>${Math.min(q.progress, q.targetAmount)}/${q.targetAmount}</span>
            <span>🪙${q.rewardSickle} · ⭐${q.rewardXp} ${q.rewardTimeSand > 0 ? `· ⏳${q.rewardTimeSand}` : ''}</span>
          </div>
          ${
            q.claimed
              ? `<div style="margin-top:6px;font-size:12px;color:#15803d;font-weight:700;">✓ Đã nhận</div>`
              : q.completed
                ? `<button type="button" data-modal-claim="${escapeHtml(q.id)}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🎁 Nhận</button>`
                : isStory
                  ? `<button id="btnModalStarStory" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">${escapeHtml(autoAct.shortLabel)}</button>`
                  : ''
          }
        </div>
      `;
    };

    const reqTrial = hud.sim.getRequiredLevelTrial();
    const wpModal = hud.sim.getWinsProgressForCurrentLevel();
    const fmtStagePill = (k: MinigameTrialKind) => {
      const inf = hud.sim.getDisciplineStageInfo(k);
      return inf.isMaxed ? `👑777` : `${inf.currentStage}/777`;
    };
    const trialBannerHtml =
      reqTrial && !hud.sim.state.sandboxMode && !hud.sim.isHeadmasterPreview
        ? `
        <div class="quest-card-mini trial-quest-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div class="hs-card-title">
              🔥 Đề Cử (${wpModal.current}/${wpModal.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)} (${fmtStagePill(reqTrial.kind)})
            </div>
            <button type="button" data-modal-open-trial="${reqTrial.kind}" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">▶️ Chơi</button>
          </div>
        </div>
      `
        : '';

    const storyChapterTag = story
      ? `Ch.${story.chapter ?? 1} · ${hud.sim.state.storyQuestIndex + 1}/${STORY_QUESTS.length}`
      : '';
    const yule = hud.sim.getYuleEventStatus();
    const yuleMain = yule.dayDef?.main;
    const yuleMainClaimed = yule.day > 0 && yule.claimedMainDays.includes(yule.day);
    const yuleMainProgress = yuleMain ? yuleTaskProgress(hud.sim.state, yuleMain) : 0;
    const yuleMainDone = Boolean(yuleMain && yuleMainProgress >= yuleMain.amount);
    const yuleMainPct = yuleMain ? Math.min(100, Math.round((yuleMainProgress / Math.max(1, yuleMain.amount)) * 100)) : 0;
    const yuleSideHtml = yule.dayDef?.side.map((task) => {
      const claimed = yule.claimedSideTaskIds.includes(task.id);
      const sideProg = yuleTaskProgress(hud.sim.state, task);
      const sideDone = sideProg >= task.amount;
      return `<div class="quest-card-mini" style="padding:9px;margin-top:6px;display:flex;align-items:center;justify-content:space-between;gap:8px;"><span style="font-size:12px;font-weight:700;">${escapeHtml(task.titleVi)} <span style="color:var(--ink-soft);">(${Math.min(sideProg, task.amount)}/${task.amount} • +${task.rewardSickles.toLocaleString('vi-VN')} 🪙)</span></span>${claimed ? '<span style="color:#15803d;font-weight:800;">✓</span>' : `<button type="button" class="brass-btn ${sideDone ? 'gold-cta' : ''}" data-yule-side="${escapeHtml(task.id)}" style="padding:4px 8px;font-size:11px;${sideDone ? '' : 'opacity:0.62;'}">Nhận</button>`}</div>`;
    }).join('') ?? '';
    const yuleHtml = yule.active && yuleMain ? `<div class="quest-card-mini" style="padding:12px;border:1px solid #d97706;background:linear-gradient(135deg,rgba(254,243,199,.9),rgba(219,234,254,.8));"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center;"><strong>🎄 Yule • Ngày ${yule.day}/36</strong><span style="font-size:11px;color:var(--ink-soft);">${escapeHtml(yule.dayDef?.titleVi ?? '')}</span></div><div style="font-size:13px;font-weight:800;margin-top:7px;">${escapeHtml(yuleMain.titleVi)}</div><div class="quest-bar"><div class="quest-bar-fill" style="width:${yuleMainPct}%"></div></div><div style="font-size:11px;color:var(--ink-soft);margin-top:3px;">${Math.min(yuleMainProgress, yuleMain.amount)}/${yuleMain.amount}</div>${yuleMainClaimed ? '<div style="margin-top:7px;color:#15803d;font-weight:800;">✓ Đã nhận phần thưởng ngày</div>' : `<button type="button" data-yule-main="${yule.day}" class="brass-btn gold-cta" style="width:100%;margin-top:8px;${yuleMainDone ? '' : 'opacity:0.65;'}">🎁 Nhận phần thưởng ngày</button>`}<div style="margin-top:9px;font-size:12px;font-weight:800;">Nhiệm vụ phụ (mỗi nhiệm vụ tối đa 5.000 Sickle)</div>${yuleSideHtml}</div>` : '';

    box.innerHTML = `
      ${yuleHtml}
      ${tabsSwitchHtml}
      ${trialBannerHtml}
      <h3 class="hs-section-title">📖 Cốt Truyện</h3>
      ${story ? renderCard(story, storyChapterTag, true) : `<div class="quest-card-mini">🎉 Đã hoàn thành!</div>`}

      <h3 class="hs-section-title" style="margin-top:14px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${hud.sim.state.owlQuests.map((q) => renderCard(q, 'Xoay vòng')).join('')}
      </div>

      <h3 class="hs-section-title" style="margin-top:14px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${hud.sim.state.dailyQuests.map((q) => renderCard(q, `⏳ ${formatDurationCountdownVi(secondsToVietnamMidnight())}`)).join('')}
      </div>
    `;

    box.querySelectorAll<HTMLButtonElement>('[data-qtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeQuestTab = btn.dataset.qtab as 'orders' | 'quests';
        questsUiRenderQuestDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-modal-open-trial]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const kind = btn.dataset.modalOpenTrial as MinigameTrialKind | undefined;
        (hud.root.querySelector('#questDialog') as HTMLDialogElement)?.close();
        hud.openTrialMinigame(kind);
      });
    });

    box.querySelector<HTMLButtonElement>('[data-yule-main]')?.addEventListener('click', () => {
      const dayNum = Number(box.querySelector<HTMLButtonElement>('[data-yule-main]')?.dataset.yuleMain);
      const res = hud.sim.claimYuleMainDay(dayNum);
      hud.showToast(res.msg, res.ok ? '🎄' : '⚠️');
      questsUiRenderQuestDialog(hud);
    });
    box.querySelectorAll<HTMLButtonElement>('[data-yule-side]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.claimYuleSideTask(btn.dataset.yuleSide!);
        hud.showToast(res.msg, res.ok ? '🪙' : '⚠️');
        questsUiRenderQuestDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-modal-claim]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.sim.claimQuest(btn.dataset.modalClaim!);
        questsUiRenderQuestDialog(hud);
      });
    });

    box.querySelector('#btnModalStarStory')?.addEventListener('click', () => {
      const res = hud.sim.completeStoryStepWithStar();
      if (res.ok) {
        if (typeof res.placedGx === 'number' && typeof res.placedGy === 'number') {
          centerCameraOnGrid(hud.cam, res.placedGx, res.placedGy);
        }
        questsUiRenderQuestDialog(hud);
      } else {
        hud.showToast(res.msg, res.reason === 'missing_gold' ? '🪙' : res.reason === 'locked_level' ? '🔒' : '🌟');
        if (res.reason === 'open_match3') {
          (hud.root.querySelector('#questDialog') as HTMLDialogElement).close();
          hud.openTrialMinigame();
        }
      }
    });
}

let activeRoadmapTab: 'zones' | 'milestones' = 'zones';

export function questsUiRenderRoadmapDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#roadmapDialogContent') as HTMLElement;
    const unlockedSet = new Set(hud.sim.state.unlockedZones);
    const reqTrial = hud.sim.getRequiredLevelTrial();
    const unlockedCount = ZONES.filter((z) => unlockedSet.has(z.id) || hud.sim.state.sandboxMode).length;

    const tabsHtml = `
      <div class="hs-tabs" role="tablist" aria-label="Bản Đồ &amp; Lộ Trình">
        <button type="button" role="tab" data-rmtab="zones" aria-selected="${activeRoadmapTab === 'zones'}" class="hs-tab">Vùng đất <span class="hs-tab-badge">${unlockedCount}/${ZONES.length}</span></button>
        <button type="button" role="tab" data-rmtab="milestones" aria-selected="${activeRoadmapTab === 'milestones'}" class="hs-tab">Cột mốc <span class="hs-tab-badge">Lv.${hud.sim.state.level}</span></button>
      </div>
    `;

    const trialCardHtml =
      reqTrial && !hud.sim.state.sandboxMode && !hud.sim.isHeadmasterPreview
        ? (() => {
            const wpR = hud.sim.getWinsProgressForCurrentLevel();
            return `<div class="quest-card-mini trial-quest-card" style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div class="hs-card-title">
                🔥 Đề Cử Lv.${hud.sim.state.level} (${wpR.current}/${wpR.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 14px;font-size:13px;">
                ▶️ Chơi
              </button>
            </div>`;
          })()
        : '';

    let bodyHtml = '';
    if (activeRoadmapTab === 'zones') {
      const zonesHtml = ZONES.map((z) => {
        const isOpen = unlockedSet.has(z.id) || hud.sim.state.sandboxMode;
        const canOpen = !isOpen && hud.sim.state.level >= z.unlockLevel;
        const zStarCost = getZonePuzzleStarCost(z);
        return `
          <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
            <div class="hs-card-title">${isOpen ? '✅' : '🌫️'} ${z.name}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
              <span>Lv.${z.unlockLevel} · ${zStarCost > 0 ? `🌟 ${zStarCost}` : '✓'}</span>
              <div style="display:flex;gap:5px;">
                <button type="button" data-cam-zone="${z.id}" class="brass-btn" style="padding:4px 8px;font-size:12px;">👁️ Xem</button>
                ${
                  canOpen
                    ? `<button type="button" data-unlock-zone="${z.id}" class="brass-btn gold-cta" style="padding:4px 8px;font-size:12px;">🔓 Mở</button>`
                    : ''
                }
              </div>
            </div>
          </div>
        `;
      }).join('');
      bodyHtml = `${trialCardHtml}<div class="grid-2col">${zonesHtml}</div>`;
    } else {
      const milestones = LEVELS.filter(
        (l) => l.unlockedItemIds.length > 0 || l.unlockedZoneId || l.milestoneNote || l.level % 10 === 0
      );
      bodyHtml = `
        <div class="hs-card-list">
          ${milestones
            .map((m) => {
              const reached = hud.sim.state.level >= m.level;
              const itemNames = m.unlockedItemIds
                .map((id) => getCatalogItem(id)?.name)
                .filter(Boolean)
                .join(', ');
              return `
                <div class="quest-card-mini" style="display:flex;justify-content:space-between;align-items:center;gap:10px;opacity:${reached ? '1' : '0.78'};">
                  <div>
                    <span style="font-weight:700;font-size:13px;">${reached ? '🌟' : '🔒'} Lv.${m.level}</span>
                    ${itemNames ? `<span style="font-size:12px;margin-left:6px;">${itemNames}</span>` : ''}
                  </div>
                  <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${m.rewardSickle}</span>
                </div>
              `;
            })
            .join('')}
        </div>
      `;
    }

    box.innerHTML = tabsHtml + bodyHtml;

    box.querySelectorAll<HTMLButtonElement>('[data-rmtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeRoadmapTab = btn.dataset.rmtab === 'milestones' ? 'milestones' : 'zones';
        questsUiRenderRoadmapDialog(hud);
      });
    });

    box.querySelector('#btnRoadmapPlayTrial')?.addEventListener('click', () => {
      (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement)?.close();
      hud.openTrialMinigame();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-cam-zone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const z = getZoneById(btn.dataset.camZone as ZoneId);
        centerCameraOnGrid(hud.cam, (z.x1 + z.x2) * 0.5, (z.y1 + z.y2) * 0.5);
        (hud.root.querySelector('#roadmapDialog') as HTMLDialogElement).close();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-unlock-zone]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const res = hud.sim.unlockZone(btn.dataset.unlockZone as ZoneId);
        hud.showToast(res.msg, res.ok ? '✨' : '🔒');
        questsUiRenderRoadmapDialog(hud);
      });
    });
}

// HPVN (owner 15/11 «thiết kế lại, tránh AI slop»): each settings group is one labelled row whose choices are one segmented
// control (even cells, the chosen one gold, no icons) on an even grid: `cols` columns on a phone, `wide` from 980px
// («Bình minh» needs a third of a 360px card; main.css «Cài Đặt»)
function segRowHtml(label: string, attr: string, items: Array<[string, string]>, active: string, cols = items.length, wide = items.length): string {
  const cells = items
    .map(([v, l]) => `<button type="button" data-${attr}="${v}" data-active="${v === active}" aria-pressed="${v === active}">${l}</button>`)
    .join('');
  return `<div class="hs-set-row"><span class="hs-set-k">${label}</span><div class="hs-seg" role="group" aria-label="${label}" style="--hs-seg-cols:${cols};--hs-seg-wide:${wide}">${cells}</div></div>`;
}

export function questsUiRenderSettingsDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#settingsDialogContent') as HTMLElement;
    const st = hud.sim.state;
    const toonOn = hud.sprites ? hud.sprites.isToonEnabled() : true;
    const a11y = hud.getEffectiveA11ySettings();
    const isDev =
      Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) ||
      (typeof window !== 'undefined' && Boolean(import.meta.env.DEV));
    const volRows: Array<{ key: 'master' | 'music' | 'sfx' | 'voice'; label: string }> = [
      { key: 'master', label: 'Tổng' },
      { key: 'music', label: 'Nhạc nền' },
      { key: 'sfx', label: 'Hiệu ứng' },
      { key: 'voice', label: 'Giọng đọc' },
    ];
    const stashedCount = Object.values(st.stashedDecorInventory ?? {}).reduce((a, b) => a + b, 0);

    box.innerHTML = `
      <div class="quest-card-mini">
        <h3 class="hs-section-title">Âm thanh</h3>
        <div style="display:flex;flex-direction:column;gap:6px;">
          <label class="switch-row">
            <span>Nhạc nền</span>
            <input id="swBgm" type="checkbox" switch ${st.settings.bgmEnabled ? 'checked' : ''} />
          </label>
          <label class="switch-row">
            <span>Hiệu ứng</span>
            <input id="swSfx" type="checkbox" switch ${st.settings.soundEnabled ? 'checked' : ''} />
          </label>
          ${volRows
            .map((r) => {
              const pct = Math.round((a11y.volumes[r.key] ?? 0.85) * 100);
              return `
                <label class="aaa-slider-row" style="font-size:12px;font-weight:700;">
                  <span>${r.label}</span>
                  <input type="range" min="0" max="100" value="${pct}" data-vol-bus="${r.key}" />
                  <span data-vol-val="${r.key}">${pct}%</span>
                </label>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Hiển thị &amp; Trợ năng</h3>
        ${segRowHtml('Kiểu vẽ', 'toon', [['on', 'Viền nâu'], ['off', '2.5D']], toonOn ? 'on' : 'off')}
        ${segRowHtml('Đồ hoạ', 'renderer-mode', [['webgl2', 'WebGL2'], ['canvas', 'Cổ điển']], st.settings.rendererMode ?? 'webgl2')}
        ${segRowHtml('Giáng Sinh', 'yule-theme-mode', [['auto', 'Tự động'], ['on', 'Luôn bật'], ['off', 'Tắt']], st.settings.yuleThemeMode ?? 'auto')}
        ${segRowHtml('Chế độ màu', 'cb-mode', [['none', 'Mặc định'], ['protanopia', 'Đỏ-Lục'], ['deuteranopia', 'Lục-Đỏ'], ['tritanopia', 'Xanh-Vàng']], a11y.colorblindMode, 2, 4)}
        ${segRowHtml('Cỡ chữ', 'font-scale', [['100', '100%'], ['125', '125%'], ['150', '150%']], String(a11y.fontScale))}
        <label class="switch-row">
          <span>Tương phản cao</span>
          <input id="swHighContrast" type="checkbox" switch ${a11y.highContrast ? 'checked' : ''} />
        </label>
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Bầu trời &amp; Nhịp độ</h3>
        ${segRowHtml('Giờ', 'time', [['realtime', 'Tự động'], ['dawn', 'Bình minh'], ['day', 'Ngày'], ['dusk', 'Chiều'], ['night', 'Đêm']], st.settings.timeOverride, 3)}
        ${segRowHtml('Lễ hội', 'fest', [['auto', 'Tự động'], ['halloween', 'Halloween'], ['christmas', 'Giáng Sinh'], ['quidditch_cup', 'Quidditch']], st.settings.activeFestival, 2)}
        ${segRowHtml('Thời tiết', 'weather', [['auto', 'Tự động'], ['clear', 'Nắng'], ['cloudy', 'Mây'], ['rain', 'Mưa'], ['storm', 'Giông'], ['snow', 'Tuyết'], ['fog', 'Sương']], st.settings.weatherOverride, 4, 7)}
      </div>

      <div class="quest-card-mini">
        <h3 class="hs-section-title">Điền trang &amp; Cẩm nang</h3>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${(['layout_1', 'layout_2', 'layout_3'] as LayoutPresetId[])
            .map((pid, idx) => {
              const saved = st.layoutPresets?.[pid];
              const title = saved ? escapeHtml(saved.label) : `Bản vẽ #${idx + 1}`;
              return `
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:700;">${title}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${
                    saved ? `${saved.placements.length} công trình` : 'Trống'
                  }</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${pid}" class="brass-btn" style="flex:1;padding:4px 6px;font-size:12px;">Lưu</button>
                    <button type="button" data-load-layout="${pid}" ${saved ? '' : 'disabled'} class="brass-btn ${saved ? 'gold-cta' : ''}" style="flex:1;padding:4px 6px;font-size:12px;">Dùng</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn" style="font-size:12px;">Cất trang trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn ${stashedCount > 0 ? 'gold-cta' : ''}" ${stashedCount > 0 ? '' : 'disabled'} style="font-size:12px;">
            Bày lại (${stashedCount})
          </button>
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta" style="font-size:12px;">
            Hướng dẫn
          </button>
          <button id="btnResetPark" type="button" class="brass-btn" style="font-size:12px;border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            Chơi lại
          </button>
        </div>
        <div style="font-size:12px;color:var(--ink-soft);">Đã tự lưu trên HPVN.</div>
        ${
          isDev
            ? `<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;">
                <label class="switch-row" style="width:100%;">
                  <span>Sandbox (Dev)</span>
                  <input id="swSandbox" type="checkbox" switch ${st.sandboxMode ? 'checked' : ''} />
                </label>
                <button id="btnPreview100" type="button" class="brass-btn" style="font-size:12px;">${hud.sim.isHeadmasterPreview ? 'Về Save' : 'Xem Lv.100'}</button>
                <button id="btnTestFireworks" type="button" class="brass-btn" style="font-size:12px;">Pháo hoa</button>
                <button id="btnTestEscape" type="button" class="brass-btn" style="font-size:12px;">Thả Niffler</button>
              </div>`
            : ''
        }
      </div>
    `;

    // Enhance newly rendered switch inputs if polyfill is active
    if (!('switch' in HTMLInputElement.prototype)) {
      import('input-switch-polyfill').catch(() => {});
    }

    box.querySelector('#swBgm')?.addEventListener('change', (e) => {
      st.settings.bgmEnabled = (e.currentTarget as HTMLInputElement).checked;
      hud.sim.audio.bgmEnabled = st.settings.bgmEnabled;
      hud.sim.saveToStorage();
    });

    box.querySelector('#swSfx')?.addEventListener('change', (e) => {
      st.settings.soundEnabled = (e.currentTarget as HTMLInputElement).checked;
      hud.sim.audio.enabled = st.settings.soundEnabled;
      hud.sim.saveToStorage();
    });

    box.querySelector('#swCutaway')?.addEventListener('change', (e) => {
      st.settings.cutawayMode = (e.currentTarget as HTMLInputElement).checked;
      hud.refreshAll();
    });

    box.querySelector('#swGrid')?.addEventListener('change', (e) => {
      st.settings.showGrid = (e.currentTarget as HTMLInputElement).checked;
      hud.sim.saveToStorage(); // HPVN: kept in the save
      hud.refreshAll();
    });

    box.querySelector('#swSandbox')?.addEventListener('change', (e) => {
      const devAllowed =
        Boolean((import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV) ||
        (typeof window !== 'undefined' && Boolean(import.meta.env.DEV));
      if (!devAllowed) return;
      st.sandboxMode = (e.currentTarget as HTMLInputElement).checked;
      if (st.sandboxMode) {
        st.sandboxTainted = true;
      }
      hud.sim.saveToStorage();
      hud.refreshAll();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-time]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.timeOverride = btn.dataset.time as TimeOverride;
        hud.sim.saveToStorage();
        hud.refreshHeader();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-fest]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.activeFestival = btn.dataset.fest as 'auto' | FestivalType;
        hud.sim.saveToStorage();
        hud.refreshHeader();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-weather]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.weatherOverride = btn.dataset.weather as WeatherOverride;
        hud.sim.saveToStorage();
        hud.refreshHeader();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-toon]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const on = btn.dataset.toon === 'on';
        hud.sprites?.setToonEnabled(on);
        hud.sim.state.settings.toonEnabled = on; // HPVN: kept in the save
        hud.sim.saveToStorage();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hangsoc:toon-changed'));
        }
        hud.refreshAll();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-renderer-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rm = btn.dataset.rendererMode;
        if (rm === 'webgl2' || rm === 'canvas') {
          st.settings.rendererMode = rm;
          hud.sim.saveToStorage();
          hud.refreshAll();
          questsUiRenderSettingsDialog(hud);
        }
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-yule-theme-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.yuleThemeMode;
        if (mode === 'auto' || mode === 'on' || mode === 'off') {
          st.settings.yuleThemeMode = mode;
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.yuleTheme =
              hud.sim.isYuleVisualThemeActive() || hud.sim.isWinterMainMapActive()
                ? 'true'
                : 'false';
          }
          hud.sim.saveToStorage();
          hud.refreshAll();
          questsUiRenderSettingsDialog(hud);
        }
      });
    });

    box.querySelector('#btnReplayTutorial')?.addEventListener('click', () => {
      (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      hud.tutorialMinimized = false;
      hud.lastFocusedTutorialStepKey = '';
      hud.sim.restartTutorial();
      hud.panCameraToTutorialTarget();
      hud.refreshAll();
    });

    box.querySelector('#btnPreview100')?.addEventListener('click', () => {
      hud.match3Modal?.resetSession();
      hud.puzzleArcadeModal?.resetSession();
      hud.sim.toggleHeadmasterPreview(100);
      hud.refreshAll();
      questsUiRenderSettingsDialog(hud);
    });

    box.querySelector('#btnResetPark')?.addEventListener('click', () => {
      if (window.confirm('Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?')) {
        hud.match3Modal?.resetSession();
        hud.puzzleArcadeModal?.resetSession();
        hud.sim.resetNewGame();
        centerCameraOnGrid(hud.cam, 16.0, 18.0);
        (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        hud.showToast('Chào mừng trở lại Trang Trại Hang Sóc bình yên!', '🏡');
      }
    });

    // Wire 4-Bus Audio Sliders, Colorblind, Font Scale, High Contrast, Layout Presets & Save Slots
    box.querySelectorAll<HTMLInputElement>('[data-vol-bus]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const bus = inp.dataset.volBus as 'master' | 'music' | 'sfx' | 'voice';
        const val = Math.max(0, Math.min(1, Number(inp.value) / 100));
        const cur = hud.getEffectiveA11ySettings();
        cur.volumes[bus] = val;
        st.a11ySettings = cur;
        const lbl = box.querySelector(`[data-vol-val="${bus}"]`);
        if (lbl) lbl.textContent = `${Math.round(val * 100)}%`;
        hud.applyStoredA11ySettings();
        hud.sim.saveToStorage();
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-cb-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cur = hud.getEffectiveA11ySettings();
        cur.colorblindMode = btn.dataset.cbMode as typeof cur.colorblindMode;
        st.a11ySettings = cur;
        hud.applyStoredA11ySettings();
        hud.sim.saveToStorage();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-font-scale]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cur = hud.getEffectiveA11ySettings();
        cur.fontScale = Number(btn.dataset.fontScale) as 100 | 125 | 150;
        st.a11ySettings = cur;
        hud.applyStoredA11ySettings();
        hud.sim.saveToStorage();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelector('#swHighContrast')?.addEventListener('change', (e) => {
      const cur = hud.getEffectiveA11ySettings();
      cur.highContrast = (e.currentTarget as HTMLInputElement).checked;
      st.a11ySettings = cur;
      hud.applyStoredA11ySettings();
      hud.sim.saveToStorage();
    });

    box.querySelectorAll<HTMLButtonElement>('[data-save-layout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.saveLayout as LayoutPresetId;
        const entry = hud.sim.saveLayoutPreset(pid);
        hud.showToast(`📐 Đã lưu "${entry.label}" (${entry.placements.length} công trình)!`, '📐');
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-load-layout]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.loadLayout as LayoutPresetId;
        const res = hud.sim.applyLayoutPreset(pid);
        hud.showToast(res.msg, res.ok ? '📐' : '⚠️');
        hud.refreshAll();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelector('#btnStashDecor')?.addEventListener('click', () => {
      const res = hud.sim.stashAllDecorItems();
      hud.showToast(res.msg, res.ok ? '📦' : '⚠️');
      hud.refreshAll();
      questsUiRenderSettingsDialog(hud);
    });

    box.querySelector('#btnRestoreDecor')?.addEventListener('click', () => {
      const res = hud.sim.restoreAllStashedDecor();
      hud.showToast(res.msg, res.ok ? '🌸' : '⚠️');
      hud.refreshAll();
      questsUiRenderSettingsDialog(hud);
    });

    box.querySelectorAll<HTMLButtonElement>('[data-save-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.saveSlot as SaveSlotId;
        const meta = hud.sim.saveNamedProfileSlot(sid);
        hud.showToast(`💾 Đã ghi ${meta.label} (Cấp ${meta.level})!`, '💾');
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-load-slot]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sid = btn.dataset.loadSlot as SaveSlotId;
        const res = hud.sim.loadNamedProfileSlot(sid);
        if (res.ok) {
          hud.match3Modal?.resetSession();
          hud.puzzleArcadeModal?.resetSession();
          hud.applyStoredA11ySettings();
          hud.refreshAll();
          (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        }
        hud.showToast(res.msg, res.ok ? '📂' : '⚠️');
      });
    });
}
