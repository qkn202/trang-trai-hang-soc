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
  IS_SANDBOX_BUILD_ENABLED,
  isSandboxRuntimeAllowed,
  loadFromNamedSlot,
  MAX_PHOENIX_TALISMANS,
  ParkSimulation,
  PHOENIX_FORGE_GOLD_COST,
  SaveSlotId,
  STORY_CUTSCENE_CHAPTERS,
} from '../sim/simulation';
import { VALLEY_VILLAGER_PROFILES, getLocalDateKey } from '../sim/simulationData';
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
        <img src="/sprites/prop_ribbon_unveil.png" alt="" class="ribbon-unveil-banner-art" />
        <div class="ribbon-unveil-banner-body">
          <div class="ribbon-unveil-banner-kicker">🎀 ${escapeHtml(info.speakerEmoji)} ${escapeHtml(info.speakerName)}</div>
          <div class="ribbon-unveil-banner-title">${escapeHtml(info.buildingName)}</div>
          <div class="ribbon-unveil-banner-rewards">+${info.bonusGalleons.toLocaleString('vi-VN')} 🪙 • +${info.bonusXp.toLocaleString('vi-VN')} ⭐ • +${info.feastPoints} 🍁</div>
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
              ${isGrand ? '<span class="feast-grand-pill">👑</span>' : ''}
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
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#15803d;margin-bottom:6px;">📈 Thu</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🌾 Nông sản &amp; Đơn Cú:</span><strong>+${f.harvestRevenue.toLocaleString('vi-VN')} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🍻 Cửa tiệm:</span><strong>+${(f.shopRevenue + f.ticketRevenue + f.gateRevenue).toLocaleString('vi-VN')} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:#15803d;"><span>Tổng Thu:</span><strong>+${totalIn.toLocaleString('vi-VN')} G</strong></div>
          </div>
        </div>

        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;color:#9a3412;margin-bottom:6px;">📉 Chi</div>
          <div style="font-size:12.5px;display:flex;flex-direction:column;gap:5px;">
            <div style="display:flex;justify-content:space-between;"><span>🏗️ Xây dựng &amp; Nâng Sao:</span><strong>-${f.constructionSpent.toLocaleString('vi-VN')} G</strong></div>
            <div style="display:flex;justify-content:space-between;"><span>🧦 Phụ tá (${wagePerCycle}G/ca):</span><strong>-${f.staffWagesPaid.toLocaleString('vi-VN')} G</strong></div>
            <hr style="border:none;border-top:1px solid rgba(138,90,43,0.25);margin:3px 0;" />
            <div style="display:flex;justify-content:space-between;font-size:13.5px;color:${net >= 0 ? '#15803d' : '#b45309'};">
              <span>Ròng:</span><strong>${net >= 0 ? '+' : ''}${net.toLocaleString('vi-VN')} G</strong>
            </div>
          </div>
        </div>
      </div>
    `;
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

    const tabsHtml = `
      <div class="workshop-tabs" role="tablist" aria-label="Sổ Vàng Hang Sóc" style="margin-bottom:12px;">
        <button type="button" data-atab="cup" data-active="${hud.activeAlbumTab === 'cup'}" aria-selected="${hud.activeAlbumTab === 'cup'}" class="brass-btn">
          🏆 Cúp 4 Nhà
        </button>
        <button type="button" data-atab="achievements" data-active="${hud.activeAlbumTab === 'achievements'}" aria-selected="${hud.activeAlbumTab === 'achievements'}" class="brass-btn">
          🎖️ Thành Tựu (${codex.unlocked}/${codex.total})${claimableAchCount > 0 ? ` • 🎁${claimableAchCount}` : ''}
        </button>
        <button type="button" data-atab="friendship" data-active="${hud.activeAlbumTab === 'friendship'}" aria-selected="${hud.activeAlbumTab === 'friendship'}" class="brass-btn">
          💝 Tình Bạn &amp; Phim
        </button>
        <button type="button" data-atab="login7" data-active="${hud.activeAlbumTab === 'login7'}" aria-selected="${hud.activeAlbumTab === 'login7'}" class="brass-btn">
          📅 Điểm Danh 7N${claimableLoginCount > 0 ? ` • 🎁${claimableLoginCount}` : ''}
        </button>
      </div>
    `;

    let bodyHtml = '';
    if (hud.activeAlbumTab === 'cup') {
      const playerHouse = hud.sim.getPlayerHouse();
      const serverWeekly = st.weeklyHouseCupServerStandings;
      const houses: Array<{ house: HouseName; icon: string; pts: number }> = [
        {
          house: 'Gryffindor',
          icon: '🦁',
          pts: (st.housePoints.Gryffindor ?? 0) + (serverWeekly?.totals.Gryffindor ?? 0),
        },
        {
          house: 'Slytherin',
          icon: '🐍',
          pts: (st.housePoints.Slytherin ?? 0) + (serverWeekly?.totals.Slytherin ?? 0),
        },
        {
          house: 'Ravenclaw',
          icon: '🦅',
          pts: (st.housePoints.Ravenclaw ?? 0) + (serverWeekly?.totals.Ravenclaw ?? 0),
        },
        {
          house: 'Hufflepuff',
          icon: '🦡',
          pts: (st.housePoints.Hufflepuff ?? 0) + (serverWeekly?.totals.Hufflepuff ?? 0),
        },
      ];
      houses.sort((a, b) => b.pts - a.pts);
      const maxHousePts = Math.max(100, houses[0]?.pts ?? 100);
      const localTotalPts =
        (st.housePoints.Gryffindor ?? 0) +
        (st.housePoints.Slytherin ?? 0) +
        (st.housePoints.Ravenclaw ?? 0) +
        (st.housePoints.Hufflepuff ?? 0);
      const milestoneTarget = st.houseCupMilestoneTier * 300;
      const canClaimCup = localTotalPts >= milestoneTarget;

      bodyHtml = `
        <div class="quest-card-mini" style="padding:13px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;">
            <div>
              <div style="font-size:15px;font-weight:800;">🏆 Đồng Hồ Ngọc Cúp 4 Nhà Hogwarts</div>
              <div style="font-size:12px;color:var(--ink-soft);">
                Nhà của bạn: <strong>${playerHouse}</strong>${
                  serverWeekly ? ` • Tuần HPVN ${serverWeekly.weekKey} (đóng góp: +${serverWeekly.playerContribution} đ)` : ' • Tích điểm khi thu hoạch, giao Đơn Cú & thắng Khảo Thí'
                }
              </div>
            </div>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Đợt ${st.houseCupMilestoneTier}: ${localTotalPts} / ${milestoneTarget}</span>
          </div>
          <div class="aaa-hourglass-grid">
            ${houses
              .map((h, idx) => {
                const pct = Math.min(100, Math.max(8, Math.round((h.pts / maxHousePts) * 100)));
                const isMine = h.house === playerHouse;
                return `
                  <div class="aaa-hourglass-card" data-house="${h.house}" data-player-house="${isMine}">
                    <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
                      <span style="font-size:13px;font-weight:800;">${idx === 0 ? '👑 ' : ''}${h.icon} ${h.house}</span>
                      ${isMine ? `<span style="padding:1px 6px;border-radius:var(--radius-pill);background:var(--house-you-pill-bg);color:var(--house-you-pill-ink);font-size:10px;font-weight:800;">NHÀ BẠN</span>` : ''}
                    </div>
                    <div style="font-size:18px;font-weight:900;">${h.pts.toLocaleString('vi-VN')} đ</div>
                    <div class="aaa-hourglass-tube">
                      <div class="aaa-hourglass-fill" style="width:${pct}%;"></div>
                    </div>
                  </div>
                `;
              })
              .join('')}
          </div>
          <progress max="${milestoneTarget}" value="${Math.min(milestoneTarget, localTotalPts)}" style="width:100%;"></progress>
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;">
            ${
              canClaimCup
                ? `<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="flex:1;">🏆 Nhận Thưởng Cúp Đợt ${st.houseCupMilestoneTier}</button>`
                : ''
            }
            <button id="btnSyncServerHouseCup" type="button" class="brass-btn" style="font-size:12px;">🔄 Đồng Bộ Bảng Tuần HPVN</button>
          </div>
        </div>
      `;
    } else if (hud.activeAlbumTab === 'achievements') {
      const nowAch = Date.now();
      const metricByCat: Record<AchievementCategory, number> = {
        farm: getCategoryMetricValue(st, 'farm', nowAch),
        building: getCategoryMetricValue(st, 'building', nowAch),
        puzzle: getCategoryMetricValue(st, 'puzzle', nowAch),
        language: getCategoryMetricValue(st, 'language', nowAch),
        social: getCategoryMetricValue(st, 'social', nowAch),
        collection: getCategoryMetricValue(st, 'collection', nowAch),
      };
      bodyHtml = `
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
            <strong>🎖️ Sổ Vàng 52 Thành Tựu Hang Sóc</strong>
            <span style="font-size:12px;font-weight:800;color:var(--ink-gold);">Hoàn thành ${codex.completionPct}% (${codex.unlocked}/${codex.total})</span>
          </div>
          <progress max="${codex.total}" value="${codex.unlocked}" style="width:100%;"></progress>
        </div>
        <div class="aaa-codex-scroll">
          ${ACHIEVEMENT_REGISTRY.map((def) => {
            const entry = ret.achievements[def.id];
            const unlocked = Boolean(entry?.unlockedAt);
            const claimed = Boolean(entry?.claimedAt);
            const curVal = Math.min(def.target, Math.max(0, metricByCat[def.category] ?? 0));
            const curLabel = curVal.toLocaleString('vi-VN');
            const targetLabel = def.target.toLocaleString('vi-VN');
            return `
              <div class="aaa-ach-card" data-unlocked="${unlocked}">
                <div style="display:flex;align-items:center;gap:9px;min-width:0;flex:1;">
                  <span style="font-size:22px;">${def.icon}</span>
                  <div style="min-width:0;flex:1;">
                    <div style="font-size:13px;font-weight:800;">${def.titleVi}</div>
                    <div style="font-size:11.5px;color:var(--ink-soft);">${def.descVi} • Thưởng <strong>+${def.rewardGalleons}G, +${def.rewardStars} 🌟</strong></div>
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
                      ? `<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận</span>`
                      : unlocked
                        ? `<button type="button" data-claim-ach="${def.id}" class="brass-btn gold-cta" style="padding:4px 10px;font-size:11.5px;">🎁 Nhận</button>`
                        : `<span style="font-size:11px;font-weight:700;color:var(--ink-soft);">🔒 ${curLabel}/${targetLabel}</span>`
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (hud.activeAlbumTab === 'friendship') {
      const period = hud.sim.getRealTimePeriod();
      const todayKey = getLocalDateKey();
      bodyHtml = `
        <div class="quest-card-mini" style="padding:12px;margin-bottom:10px;">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎬 Ký Ức Phim Cốt Truyện Hang Sóc</div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px;">
            ${STORY_CUTSCENE_CHAPTERS.map((chap) => {
              const unlocked = st.level >= chap.unlockLevel || hud.sim.isHeadmasterPreview;
              return `
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${chap.titleVi}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">Yêu cầu: Cấp ${chap.unlockLevel}</div>
                  <button type="button" data-play-cutscene="${chap.id}" ${unlocked ? '' : 'disabled'} class="brass-btn ${unlocked ? 'gold-cta' : ''}" style="font-size:11.5px;padding:4px 8px;">
                    ${unlocked ? '🎬 Phát Phim Camera' : `🔒 Mở ở Cấp ${chap.unlockLevel}`}
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
                    <strong style="font-size:13.5px;">${v.moodBubble} ${v.nameVi}</strong>
                    <span style="font-size:11.5px;color:var(--ink-soft);"> • ${v.titleVi}</span>
                  </div>
                  <span style="font-size:12px;font-weight:800;color:var(--berry);">💝 Cấp ${f.level}/10 (${f.xp}/${nextXp})</span>
                </div>
                <div style="font-size:12px;color:var(--ink-soft);">🕒 Hiện tại: ${sched.activityVi}</div>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                  <button type="button" data-npc-talk="${v.id}" data-choice="0" ${talkedToday ? 'disabled' : ''} class="brass-btn" style="font-size:11.5px;padding:4px 9px;">
                    ${talkedToday ? '✓ Đã trò chuyện hôm nay' : '☕ Hỏi thăm ấm áp (+35 XP)'}
                  </button>
                  ${
                    talkedToday
                      ? ''
                      : `<button type="button" data-npc-talk="${v.id}" data-choice="1" class="brass-btn" style="font-size:11.5px;padding:4px 9px;">🪄 Bàn ý tưởng mới (+25 XP)</button>`
                  }
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="quest-card-mini" style="padding:12px;">
          <div style="font-size:14px;font-weight:800;margin-bottom:8px;">📅 Lịch Quà Điểm Danh 7 Ngày Bà Molly</div>
          <div class="aaa-slot-grid">
            ${DAY_1_TO_7_REWARDS.map((d) => {
              const claimed = ret.claimedLoginDays.includes(d.day);
              const canClaim = !claimed && d.day <= maxLoginDay;
              return `
                <div class="aaa-slot-card">
                  <div style="font-size:12.5px;font-weight:800;">${d.titleVi}</div>
                  <div style="font-size:11.5px;color:var(--ink-soft);">
                    +${d.galleons}G • +${d.magicStars} 🌟${d.phoenixTalismans > 0 ? ` • +${d.phoenixTalismans} 🔥` : ''}
                  </div>
                  ${
                    claimed
                      ? `<span style="font-size:11.5px;font-weight:800;color:var(--farm-green-text);">✓ Đã nhận quà</span>`
                      : `<button type="button" data-claim-login="${d.day}" ${canClaim ? '' : 'disabled'} class="brass-btn ${canClaim ? 'gold-cta' : ''}" style="font-size:11.5px;padding:4px 8px;">
                          ${canClaim ? '🎁 Nhận Ngay' : `🔒 Mở kế tiếp`}
                        </button>`
                  }
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }

    box.innerHTML = tabsHtml + bodyHtml;

    box.querySelectorAll<HTMLButtonElement>('[data-atab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hud.activeAlbumTab = btn.dataset.atab as GameHUD['activeAlbumTab'];
        questsUiRenderAlbumDialog(hud);
      });
    });

    box.querySelector('#btnClaimHouseCup')?.addEventListener('click', () => {
      if (hud.sim.claimHouseCupReward()) {
        questsUiRenderAlbumDialog(hud);
      }
    });

    box.querySelector('#btnSyncServerHouseCup')?.addEventListener('click', async () => {
      try {
        const mod = await import('./authoritativeClient');
        if (typeof mod.fetchWeeklyHouseCupStandingsOnline === 'function') {
          const snap = await mod.fetchWeeklyHouseCupStandingsOnline();
          if (snap) {
            st.weeklyHouseCupServerStandings = snap;
            hud.sim.saveToStorage();
            hud.showToast(`🏆 Đã đồng bộ Bảng Cúp 4 Nhà tuần ${snap.weekKey}!`, '🏆');
            questsUiRenderAlbumDialog(hud);
            return;
          }
        }
        hud.showToast('Đang hiển thị điểm Cúp 4 Nhà tại Thung Lũng của bạn!', '🏆');
      } catch {
        hud.showToast('Chưa kết nối máy chủ HPVN — đang dùng bảng điểm cục bộ.', '🦉');
      }
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
          🦉 Đơn Cú (${readyOwlCount}/${barn.owlOrders.length})
        </button>
        <button type="button" data-qtab="quests" data-active="${hud.activeQuestTab === 'quests'}" aria-pressed="${hud.activeQuestTab === 'quests'}" class="brass-btn">
          📖 Nhiệm Vụ ${readyQuestCount > 0 ? `(${readyQuestCount})` : ''}
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
          const avatarHtml = order.portraitSprite
            ? `<img src="/sprites/${order.portraitSprite}.png" alt="${escapeHtml(order.senderName)}" class="owl-note-portrait" />`
            : `<span class="owl-note-emoji">${escapeHtml(order.portraitEmoji)}</span>`;
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
              <span class="owl-red-pin" aria-hidden="true"></span>
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
              <button type="button" id="btnRefreshOwlOrder" class="brass-btn" style="padding:4px 9px;font-size:11.5px;" title="Đổi đơn">
                🔄 Đổi
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
                <span class="owl-rew-pill gold">🪙 +${selectedOrder.rewardGalleons}</span>
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
              🦉 ${canSendSelected ? 'Giao Hàng!' : 'Mở Kho'}
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
        <div class="quest-card-mini" style="padding:12px;color:var(--ink);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;color:var(--ink);">${escapeHtml(q.giverEmoji)} ${escapeHtml(q.title)}</span>
            <span style="font-size:12px;font-weight:700;color:var(--brand-strong);white-space:nowrap;flex-shrink:0;">${escapeHtml(tag)}</span>
          </div>
          ${isStory && q.dialogue ? `<div style="font-size:12px;color:var(--muted);margin-top:4px;line-height:1.35;">${escapeHtml(q.dialogue)}</div>` : ''}
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;color:var(--ink);">
            <span>${Math.min(q.progress, q.targetAmount)}/${q.targetAmount}</span>
            <span>🪙${q.rewardGalleons} • ⭐${q.rewardXp} ${q.rewardTimeSand > 0 ? `• ⏳${q.rewardTimeSand}` : ''}</span>
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
        <div class="quest-card-mini trial-quest-card" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <div style="font-size:13.5px;font-weight:900;">
              🔥 Đề Cử (${wpModal.current}/${wpModal.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button type="button" data-modal-open-trial="match3" class="brass-btn ${reqTrial.kind === 'match3' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🍓 (${fmtStagePill('match3')})</button>
              <button type="button" data-modal-open-trial="caro" class="brass-btn ${reqTrial.kind === 'caro' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🗺️ (${fmtStagePill('caro')})</button>
              <button type="button" data-modal-open-trial="sudoku" class="brass-btn ${reqTrial.kind === 'sudoku' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🔮 (${fmtStagePill('sudoku')})</button>
              <button type="button" data-modal-open-trial="chess" class="brass-btn ${reqTrial.kind === 'chess' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🏰 (${fmtStagePill('chess')})</button>
              <button type="button" data-modal-open-trial="blocks" class="brass-btn ${reqTrial.kind === 'blocks' ? 'gold-cta' : ''}" style="padding:5px 10px;font-size:11.5px;">🦄 (${fmtStagePill('blocks')})</button>
            </div>
          </div>
        </div>
      `
        : '';

    const storyChapterTag = story
      ? `Ch.${story.chapter ?? 1} • ${hud.sim.state.storyQuestIndex + 1}/${STORY_QUESTS.length}`
      : '';

    box.innerHTML = `
      ${tabsSwitchHtml}
      ${trialBannerHtml}
      <h3 style="font-size:15px;font-weight:800;margin-bottom:6px;">📖 Cốt Truyện</h3>
      ${story ? renderCard(story, storyChapterTag, true) : `<div class="quest-card-mini">🎉 Đã hoàn thành!</div>`}

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">🦉 Xoay Vòng</h3>
      <div class="grid-2col">
        ${hud.sim.state.owlQuests.map((q) => renderCard(q, 'Xoay vòng')).join('')}
      </div>

      <h3 style="font-size:15px;font-weight:800;margin:14px 0 6px;">📰 Hàng Ngày</h3>
      <div class="grid-2col">
        ${hud.sim.state.dailyQuests.map((q) => renderCard(q, '00:00')).join('')}
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
        hud.showToast(res.msg, res.reason === 'missing_gold' ? '🪙' : '🌟');
        if (
          res.reason === 'missing_stars' ||
          res.reason === 'locked_level' ||
          res.reason === 'open_match3'
        ) {
          (hud.root.querySelector('#questDialog') as HTMLDialogElement).close();
          hud.openTrialMinigame();
        }
      }
    });
}

export function questsUiRenderRoadmapDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#roadmapDialogContent') as HTMLElement;
    const unlockedSet = new Set(hud.sim.state.unlockedZones);
    const reqTrial = hud.sim.getRequiredLevelTrial();

    const zonesHtml = ZONES.map((z) => {
      const isOpen = unlockedSet.has(z.id) || hud.sim.state.sandboxMode;
      const canOpen = !isOpen && hud.sim.state.level >= z.unlockLevel;
      const zStarCost = getZonePuzzleStarCost(z);
      return `
        <div class="quest-card-mini" style="display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          <div style="font-size:13.5px;font-weight:800;">${isOpen ? '✅' : '🌫️'} ${z.name}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;font-size:12px;font-weight:700;">
            <span>Lv.${z.unlockLevel} • ${zStarCost > 0 ? `🌟 ${zStarCost}` : '✓'}</span>
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

    const milestones = LEVELS.filter(
      (l) => l.unlockedItemIds.length > 0 || l.unlockedZoneId || l.milestoneNote || l.level % 10 === 0
    );

    box.innerHTML = `
      ${
        reqTrial && !hud.sim.state.sandboxMode && !hud.sim.isHeadmasterPreview
          ? (() => {
              const wpR = hud.sim.getWinsProgressForCurrentLevel();
              return `<div class="quest-card-mini trial-quest-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="font-size:13.5px;font-weight:900;">
                🔥 Đề Cử Lv.${hud.sim.state.level} (${wpR.current}/${wpR.required}): ${reqTrial.icon} ${escapeHtml(reqTrial.shortVi)}
              </div>
              <button type="button" id="btnRoadmapPlayTrial" class="brass-btn gold-cta" style="padding:6px 12px;font-size:12.5px;">
                ▶️ Chơi
              </button>
            </div>`;
            })()
          : ''
      }
      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🗺️ 10 Vùng Đất</h3>
      <div class="grid-2col" style="margin-bottom:16px;">${zonesHtml}</div>

      <h3 style="font-size:15px;font-weight:800;margin-bottom:8px;">🌟 Cột Mốc (Lv.1 → 100)</h3>
      <div style="display:flex;flex-direction:column;gap:6px;">
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
                  <span style="font-weight:800;font-size:13px;">${reached ? '🌟' : '🔒'} Lv.${m.level}</span>
                  ${itemNames ? `<span style="font-size:12px;margin-left:6px;">${itemNames}</span>` : ''}
                </div>
                <span style="font-size:12px;font-weight:700;white-space:nowrap;">+🪙${m.rewardGalleons}</span>
              </div>
            `;
          })
          .join('')}
      </div>
    `;

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

export function questsUiRenderSettingsDialog(hud: GameHUD): void {
    const box = hud.root.querySelector('#settingsDialogContent') as HTMLElement;
    const st = hud.sim.state;
    const toonOn = hud.sprites ? hud.sprites.isToonEnabled() : true;

    box.innerHTML = `
      <div class="grid-2col" style="margin-bottom:14px;">
        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎵 Âm Thanh &amp; Hiển Thị</div>
          <div style="display:flex;flex-direction:column;gap:7px;">
            <label class="switch-row">
              <span>🎼 Nhạc nền (BGM)</span>
              <input id="swBgm" type="checkbox" switch ${st.settings.bgmEnabled ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>🔔 Âm hiệu ứng (SFX)</span>
              <input id="swSfx" type="checkbox" switch ${st.settings.soundEnabled ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>👁️ Nhìn xuyên nhà (V)</span>
              <input id="swCutaway" type="checkbox" switch ${st.settings.cutawayMode ? 'checked' : ''} />
            </label>
            <label class="switch-row">
              <span>✨ Hiện lưới ô</span>
              <input id="swGrid" type="checkbox" switch ${st.settings.showGrid ? 'checked' : ''} />
            </label>
            ${
              IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
                ? `<label class="switch-row">
                    <span>♾️ Sandbox (Dev)</span>
                    <input id="swSandbox" type="checkbox" switch ${st.sandboxMode ? 'checked' : ''} />
                  </label>`
                : ''
            }
          </div>
        </div>

        <div class="quest-card-mini">
          <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🕒 Thời Gian &amp; Thời Tiết</div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
            ${(['realtime', 'dawn', 'day', 'dusk', 'night'] as TimeOverride[])
              .map((t) => {
                const labels: Record<TimeOverride, string> = {
                  realtime: '🕒 24h',
                  dawn: '🌅 Bình minh',
                  day: '☀️ Ngày',
                  dusk: '🌇 Chiều',
                  night: '🌙 Đêm',
                };
                return `<button type="button" data-time="${t}" data-active="${st.settings.timeOverride === t}" aria-pressed="${st.settings.timeOverride === t}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[t]}</button>`;
              })
              .join('')}
          </div>

          ${
            IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
              ? `<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
                  ${(['auto', 'halloween', 'christmas', 'quidditch_cup'] as Array<'auto' | FestivalType>)
                    .map((f) => {
                      const labels: Record<string, string> = {
                        auto: '🎪 Tự động',
                        halloween: '🎃 Halloween',
                        christmas: '🎄 Giáng Sinh',
                        quidditch_cup: '🏆 Quidditch',
                      };
                      return `<button type="button" data-fest="${f}" data-active="${st.settings.activeFestival === f}" aria-pressed="${st.settings.activeFestival === f}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[f]}</button>`;
                    })
                    .join('')}
                </div>`
              : ''
          }

          <div style="display:flex;flex-wrap:wrap;gap:5px;">
            ${(['auto', 'clear', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as WeatherOverride[])
              .map((w) => {
                const labels: Record<string, string> = {
                  auto: '🌦️ Tự động',
                  clear: '☀️ Nắng',
                  cloudy: '⛅ Mây',
                  rain: '🌧️ Mưa',
                  storm: '⛈️ Giông',
                  snow: '❄️ Tuyết',
                  fog: '🌫️ Sương',
                };
                return `<button type="button" data-weather="${w}" data-active="${st.settings.weatherOverride === w}" aria-pressed="${st.settings.weatherOverride === w}" class="brass-btn" style="padding:4px 8px;font-size:12px;">${labels[w]}</button>`;
              })
              .join('')}
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;">
            <button type="button" data-toon="on" data-active="${toonOn}" aria-pressed="${toonOn}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🎨 Viền nâu</button>
            <button type="button" data-toon="off" data-active="${!toonOn}" aria-pressed="${!toonOn}" class="brass-btn" style="padding:4px 8px;font-size:12px;">🖼️ 2.5D Gốc</button>
          </div>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:8px;">🎚️ Bàn Trộn Âm Thanh 4 Kênh &amp; Tiếp Cận (A11y)</div>
        ${(() => {
          const a11y = hud.getEffectiveA11ySettings();
          const volRows: Array<{ key: 'master' | 'music' | 'sfx' | 'voice'; label: string }> = [
            { key: 'master', label: '🔊 Tổng (Master)' },
            { key: 'music', label: '🎼 Nhạc nền' },
            { key: 'sfx', label: '🔔 Hiệu ứng' },
            { key: 'voice', label: '🗣️ Giọng đọc' },
          ];
          return `
            <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:10px;">
              ${volRows
                .map((r) => {
                  const pct = Math.round((a11y.volumes[r.key] ?? 0.85) * 100);
                  return `
                    <label class="aaa-slider-row">
                      <span>${r.label}</span>
                      <input type="range" min="0" max="100" value="${pct}" data-vol-bus="${r.key}" />
                      <span data-vol-val="${r.key}">${pct}%</span>
                    </label>
                  `;
                })
                .join('')}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px;">
              <span style="font-size:12px;font-weight:700;">🎨 Chế độ màu:</span>
              ${(
                [
                  ['none', 'Mặc định'],
                  ['protanopia', 'Đỏ-Lục (P)'],
                  ['deuteranopia', 'Lục-Đỏ (D)'],
                  ['tritanopia', 'Xanh-Vàng (T)'],
                ] as const
              )
                .map(
                  ([mode, lbl]) =>
                    `<button type="button" data-cb-mode="${mode}" data-active="${a11y.colorblindMode === mode}" aria-pressed="${a11y.colorblindMode === mode}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${lbl}</button>`
                )
                .join('')}
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">
              <span style="font-size:12px;font-weight:700;">🔠 Cỡ chữ:</span>
              ${([100, 125, 150] as const)
                .map(
                  (sc) =>
                    `<button type="button" data-font-scale="${sc}" data-active="${a11y.fontScale === sc}" aria-pressed="${a11y.fontScale === sc}" class="brass-btn" style="padding:3px 8px;font-size:11.5px;">${sc}%</button>`
                )
                .join('')}
              <label class="switch-row" style="margin-left:auto;gap:6px;">
                <span style="font-size:12px;">⚡ Tương phản cao</span>
                <input id="swHighContrast" type="checkbox" switch ${a11y.highContrast ? 'checked' : ''} />
              </label>
            </div>
          `;
        })()}
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">📐 Kiến Trúc Sư Điền Trang (Bố Cục &amp; Cất Nhanh)</div>
        <div class="aaa-slot-grid" style="margin-bottom:8px;">
          ${(['layout_1', 'layout_2', 'layout_3'] as LayoutPresetId[])
            .map((pid, idx) => {
              const saved = st.layoutPresets?.[pid];
              const title = saved ? saved.label : `Bản Vẽ #${idx + 1}`;
              return `
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">${title}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${
                    saved ? `${saved.placements.length} công trình đã lưu` : 'Chưa lưu vị trí'
                  }</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-layout="${pid}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Lưu</button>
                    <button type="button" data-load-layout="${pid}" ${saved ? '' : 'disabled'} class="brass-btn ${saved ? 'gold-cta' : ''}" style="flex:1;padding:3px 6px;font-size:11px;">📐 Áp dụng</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnStashDecor" type="button" class="brass-btn">📦 Cất Nhanh Trang Trí</button>
          <button id="btnRestoreDecor" type="button" class="brass-btn gold-cta">
            🌸 Bày Lại Trang Trí (${Object.values(st.stashedDecorInventory ?? {}).reduce((a, b) => a + b, 0)})
          </button>
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🗂️ 3 Hồ Sơ Lưu Game Độc Lập</div>
        <div class="aaa-slot-grid">
          ${(['slot_1', 'slot_2', 'slot_3'] as SaveSlotId[])
            .map((sid, idx) => {
              const info = loadFromNamedSlot(sid);
              const isLockedSandboxSlot =
                !isSandboxRuntimeAllowed() &&
                Boolean(info.ok && (info.state?.sandboxMode || info.state?.sandboxTainted));
              const canLoadSlot = Boolean(info.ok && !isLockedSandboxSlot);
              return `
                <div class="aaa-slot-card">
                  <div style="font-size:12px;font-weight:800;">Hồ Sơ #${idx + 1}</div>
                  <div style="font-size:11px;color:var(--ink-soft);">${
                    isLockedSandboxSlot
                      ? 'Ô lưu thử nghiệm (Đã khóa)'
                      : info.ok && info.meta
                        ? `${escapeHtml(info.meta.parkName)} • Cấp ${info.meta.level}`
                        : 'Ô trống'
                  }</div>
                  <div style="display:flex;gap:5px;">
                    <button type="button" data-save-slot="${sid}" class="brass-btn" style="flex:1;padding:3px 6px;font-size:11px;">💾 Ghi</button>
                    <button type="button" data-load-slot="${sid}" ${canLoadSlot ? '' : 'disabled'} class="brass-btn ${canLoadSlot ? 'gold-cta' : ''}" style="flex:1;padding:3px 6px;font-size:11px;">📂 Tải</button>
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>

      <div class="quest-card-mini" style="margin-bottom:14px;">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🔮 Tiện Ích</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta">
            📖 Hướng Dẫn
          </button>
          ${
            IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
              ? `<button id="btnPreview100" type="button" class="brass-btn gold-cta">
                  ${hud.sim.isHeadmasterPreview ? '↩️ Về Save' : '🌾 Xem Lv.100'}
                </button>
                <button id="btnTestFireworks" type="button" class="brass-btn">
                  🎆 Pháo Hoa
                </button>
                <button id="btnTestEscape" type="button" class="brass-btn">
                  🐾 Thả Niffler
                </button>`
              : ''
          }
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          ${
            IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()
              ? `<button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
                <label class="brass-btn" style="cursor:pointer;">
                  📤 Nhập (.json)
                  <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
                </label>`
              : ''
          }
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:var(--aaa-danger-border);color:var(--aaa-danger-ink);">
            🌱 Chơi Lại
          </button>
        </div>
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
      hud.refreshAll();
    });

    if (IS_SANDBOX_BUILD_ENABLED && isSandboxRuntimeAllowed()) {
      box.querySelector('#swSandbox')?.addEventListener('change', (e) => {
        if (!isSandboxRuntimeAllowed()) return;
        st.sandboxMode = (e.currentTarget as HTMLInputElement).checked;
        if (st.sandboxMode) {
          st.sandboxTainted = true;
        }
        hud.sim.saveToStorage();
        hud.refreshAll();
      });

      box.querySelectorAll<HTMLButtonElement>('[data-fest]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (!isSandboxRuntimeAllowed()) return;
          st.settings.activeFestival = btn.dataset.fest as 'auto' | FestivalType;
          hud.sim.saveToStorage();
          hud.refreshHeader();
          questsUiRenderSettingsDialog(hud);
        });
      });

      box.querySelector('#btnTestFireworks')?.addEventListener('click', () => {
        if (!isSandboxRuntimeAllowed()) return;
        (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        hud.sim.launchFireworksShow(12);
      });

      box.querySelector('#btnTestEscape')?.addEventListener('click', () => {
        if (!isSandboxRuntimeAllowed()) return;
        (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        hud.sim.triggerPlayfulEscape();
      });

      box.querySelector('#btnPreview100')?.addEventListener('click', () => {
        if (!isSandboxRuntimeAllowed()) return;
        hud.match3Modal?.resetSession();
        hud.puzzleArcadeModal?.resetSession();
        hud.sim.toggleHeadmasterPreview(100);
        hud.refreshAll();
        questsUiRenderSettingsDialog(hud);
      });

      box.querySelector('#btnExportSave')?.addEventListener('click', () => {
        if (!isSandboxRuntimeAllowed()) return;
        const blob = new Blob([hud.sim.exportSaveJson()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cong-vien-harry-potter-lv${st.level}.json`;
        a.click();
        URL.revokeObjectURL(url);
        hud.showToast('Đã xuất file Save thành công!', '💾');
      });

      box.querySelector('#inpImportSave')?.addEventListener('change', (e) => {
        if (!isSandboxRuntimeAllowed()) return;
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (hud.sim.importSaveJson(String(reader.result))) {
            hud.match3Modal?.resetSession();
            hud.puzzleArcadeModal?.resetSession();
            hud.showToast('Đã khôi phục công viên thành công!', '✨');
            (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
          } else {
            hud.showToast('File Save không hợp lệ!', '⚠️');
          }
        };
        reader.readAsText(file);
      });
    }

    box.querySelectorAll<HTMLButtonElement>('[data-time]').forEach((btn) => {
      btn.addEventListener('click', () => {
        st.settings.timeOverride = btn.dataset.time as TimeOverride;
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
        hud.refreshAll();
        questsUiRenderSettingsDialog(hud);
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
