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

    const houses: Array<{ house: HouseName; icon: string; color: string; pts: number }> = [
      { house: 'Gryffindor', icon: '🦁', color: '#b91c1c', pts: st.housePoints.Gryffindor ?? 0 },
      { house: 'Slytherin', icon: '🐍', color: '#047857', pts: st.housePoints.Slytherin ?? 0 },
      { house: 'Ravenclaw', icon: '🦅', color: '#1d4ed8', pts: st.housePoints.Ravenclaw ?? 0 },
      { house: 'Hufflepuff', icon: '🦡', color: '#ca8a04', pts: st.housePoints.Hufflepuff ?? 0 },
    ];
    houses.sort((a, b) => b.pts - a.pts);

    const totalPts = houses.reduce((acc, h) => acc + h.pts, 0);
    const milestoneTarget = st.houseCupMilestoneTier * 300;
    const canClaimCup = totalPts >= milestoneTarget;

    box.innerHTML = `
      <div class="quest-card-mini" style="padding:13px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
          <div style="font-size:15px;font-weight:800;">🏆 Cúp 4 Nhà</div>
          <span style="font-size:12px;font-weight:700;color:#78350f;">${totalPts} / ${milestoneTarget}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-bottom:10px;">
          ${houses
            .map(
              (h, idx) => `
              <div style="background:rgba(255,255,255,0.65);border:2px solid ${h.color};border-radius:10px;padding:8px;">
                <div style="font-size:13px;font-weight:800;color:${h.color};">${idx === 0 ? '👑 ' : ''}${h.icon} ${h.house}</div>
                <div style="font-size:16px;font-weight:800;margin-top:2px;">${h.pts} đ</div>
              </div>
            `
            )
            .join('')}
        </div>
        <progress max="${milestoneTarget}" value="${Math.min(milestoneTarget, totalPts)}"></progress>
        ${
          canClaimCup
            ? `<button id="btnClaimHouseCup" type="button" class="brass-btn gold-cta" style="width:100%;margin-top:8px;">🏆 Nhận Cúp Đợt ${st.houseCupMilestoneTier}</button>`
            : ''
        }
      </div>
    `;

    box.querySelector('#btnClaimHouseCup')?.addEventListener('click', () => {
      if (hud.sim.claimHouseCupReward()) {
        questsUiRenderAlbumDialog(hud);
      }
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
        <div class="quest-card-mini" style="padding:12px;">
          <div style="display:flex;justify-content:space-between;gap:8px;">
            <span style="font-size:13.5px;font-weight:800;">${escapeHtml(q.giverEmoji)} ${escapeHtml(q.title)}</span>
            <span style="font-size:12px;font-weight:700;color:#92400e;">${escapeHtml(tag)}</span>
          </div>
          <div class="quest-bar"><div class="quest-bar-fill" style="width:${pct}%"></div></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700;">
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
            <label class="switch-row">
              <span>♾️ Sandbox</span>
              <input id="swSandbox" type="checkbox" switch ${st.sandboxMode ? 'checked' : ''} />
            </label>
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

          <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px;">
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
          </div>

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
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">🔮 Tiện Ích</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnReplayTutorial" type="button" class="brass-btn gold-cta">
            📖 Hướng Dẫn
          </button>
          <button id="btnPreview100" type="button" class="brass-btn gold-cta">
            ${hud.sim.isHeadmasterPreview ? '↩️ Về Save' : '🌾 Xem Lv.100'}
          </button>
          <button id="btnTestFireworks" type="button" class="brass-btn">
            🎆 Pháo Hoa
          </button>
          <button id="btnTestEscape" type="button" class="brass-btn">
            🐾 Thả Niffler
          </button>
        </div>
      </div>

      <div class="quest-card-mini">
        <div style="font-size:13.5px;font-weight:800;margin-bottom:6px;">💾 Dữ Liệu</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;">
          <button id="btnExportSave" type="button" class="brass-btn">📥 Xuất (.json)</button>
          <label class="brass-btn" style="cursor:pointer;">
            📤 Nhập (.json)
            <input id="inpImportSave" type="file" accept=".json" style="display:none;" />
          </label>
          <button id="btnResetPark" type="button" class="brass-btn" style="border-color:#ef4444;color:#fecaca;">
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

    box.querySelector('#swSandbox')?.addEventListener('change', (e) => {
      st.sandboxMode = (e.currentTarget as HTMLInputElement).checked;
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
        hud.refreshAll();
        questsUiRenderSettingsDialog(hud);
      });
    });

    box.querySelector('#btnTestFireworks')?.addEventListener('click', () => {
      (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      hud.sim.launchFireworksShow(12);
    });

    box.querySelector('#btnTestEscape')?.addEventListener('click', () => {
      (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
      hud.sim.triggerPlayfulEscape();
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
      hud.sim.toggleHeadmasterPreview(100);
      hud.refreshAll();
      questsUiRenderSettingsDialog(hud);
    });

    box.querySelector('#btnExportSave')?.addEventListener('click', () => {
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
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (hud.sim.importSaveJson(String(reader.result))) {
          hud.match3Modal?.resetSession();
          hud.showToast('Đã khôi phục công viên thành công!', '✨');
          (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        } else {
          hud.showToast('File Save không hợp lệ!', '⚠️');
        }
      };
      reader.readAsText(file);
    });

    box.querySelector('#btnResetPark')?.addEventListener('click', () => {
      if (window.confirm('Bạn có chắc muốn khởi tạo lại Trang Trại Hang Sóc từ đầu không?')) {
        hud.match3Modal?.resetSession();
        hud.sim.resetNewGame();
        centerCameraOnGrid(hud.cam, 16.0, 18.0);
        (hud.root.querySelector('#settingsDialog') as HTMLDialogElement).close();
        hud.showToast('Chào mừng trở lại Trang Trại Hang Sóc bình yên!', '🏡');
      }
    });
}
