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
  canHelpFlooVisitRow,
  detectFreshFlooHelpersToast,
  FLOO_VISIT_UNLOCK_LEVEL,
  flooVisitOrder,
  formatFlooHelperNamesVi,
  FRIENDSHIP_CHEST_TOKEN_COST,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  HONOR_GARDENS,
  MAX_DAILY_FRIEND_HELPS,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  NEIGHBOR_PRESET_NOTES,
  nextFlooVisit,
  resolveHpvnAvatarSrc,
} from '../sim/neighborSocial';
import {
  BuildingCategory,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  FarmCropId,
  FarmItemId,
  FestivalType,
  FlooVisitDirectoryRow,
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
  PlacedBuilding,
  PuzzleArcadeMode,
  QuizFormatKind,
  QuizLanguageId,
  QuizProficiencyTier,
  RawIngredientId,
  RibbonUnveilCelebration,
  SuitcaseExpeditionId,
  TileOverrideData,
  TimeOverride,
  WeatherOverride,
  ZoneId,
} from '../types/game';
import {
  type AuthoritativeSnapshot,
  formatServerRefusalVi,
} from './authoritativeClient';
import {
  getOrCreateClientUserId,
  isUnplayedFreshSave,
  registerRealPlayerProfileOnline,
  setAuthenticatedUserId,
} from './cloudSave';
import {
  formatFlooShareMessage,
  renderValleyPostcardCanvas,
  type ValleyPostcardMeta,
  valleyPostcardToWebpDataUrl,
} from './hpvnBridge';
import { LeaderboardModalController } from './leaderboardModal';
import type { Match3ModalController } from './match3Modal';
import onlineServices from './onlineBootstrap';
import type { PuzzleArcadeModalController } from './puzzleArcadeModal';
import { SeedQuizModalController } from './seedQuizModal';
import {
  BUILD_HUD_CATEGORIES,
  HEATMAP_CYCLE,
  InspectSelection,
  escapeHtml,
} from './hudShared';
import type { GameHUD } from './hud';

const HOUSE_LABEL_MAP: Record<HouseName, string> = {
  Gryffindor: '🦁 Gryffindor',
  Ravenclaw: '🦅 Ravenclaw',
  Hufflepuff: '🦡 Hufflepuff',
  Slytherin: '🐍 Slytherin',
};

const HOUSE_CREST_MAP: Record<HouseName, string> = {
  Gryffindor: '🦁',
  Ravenclaw: '🦅',
  Hufflepuff: '🦡',
  Slytherin: '🐍',
};

function getPlayerPrimaryHouse(hud: GameHUD): HouseName {
  const pts = hud.sim.state.housePoints;
  const houses: HouseName[] = ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'];
  let best: HouseName = 'Gryffindor';
  let bestVal = -1;
  for (const h of houses) {
    const v = Number(pts?.[h] ?? 0);
    if (v > bestVal) {
      bestVal = v;
      best = h;
    }
  }
  return best;
}

function buildAvatarBadgeHtml(
  avatarUrl: string | undefined,
  fallbackEmojiOrName: string,
  extraClass = ''
): string {
  const resolved = resolveHpvnAvatarSrc(avatarUrl);
  const fallback = (fallbackEmojiOrName || '🧙').trim().slice(0, 2);
  if (resolved) {
    return `<span class="floo-avatar-shell ${extraClass}"><img src="${escapeHtml(resolved)}" alt="" class="floo-avatar-img" loading="lazy" /><span class="floo-avatar-fallback hidden">${escapeHtml(fallback)}</span></span>`;
  }
  return `<span class="floo-avatar-shell ${extraClass}"><span class="floo-avatar-fallback">${escapeHtml(fallback)}</span></span>`;
}

function wireAvatarImgFallbacks(container: ParentNode): void {
  container.querySelectorAll<HTMLImageElement>('img.floo-avatar-img').forEach((img) => {
    img.addEventListener(
      'error',
      () => {
        img.classList.add('hidden');
        const fb = img.nextElementSibling as HTMLElement | null;
        fb?.classList.remove('hidden');
      },
      { once: true }
    );
  });
}

function buildPlayerPostcardMeta(hud: GameHUD): ValleyPostcardMeta {
  const social = hud.sim.ensureNeighborSocial();
  const house = getPlayerPrimaryHouse(hud);
  const playerName =
    social.playerDisplayName?.trim() ||
    hud.sim.state.parkName?.trim() ||
    'Phù Thủy Hang Sóc';
  return {
    parkName: hud.sim.state.parkName || 'Trang Trại Hang Sóc',
    playerName,
    level: hud.sim.state.level,
    house,
    keeperTitle: getPlayerTitle(hud.sim.state.level),
    magicStars: hud.sim.state.match3?.stars ?? 0,
    buildingsCount: hud.sim.state.buildings.length,
    unlockedZonesCount: hud.sim.state.unlockedZones.length,
    weatherMode: hud.sim.state.settings.weatherOverride || 'clear',
    atmosphereMode: hud.sim.state.settings.timeOverride || 'day',
  };
}

function clearHudActiveMapTools(hud: GameHUD): void {
  if (hud.flooAutoAdvanceTimer) {
    window.clearTimeout(hud.flooAutoAdvanceTimer);
    hud.flooAutoAdvanceTimer = 0;
  }
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
}

export function socialUiApplyAuthoritativeSnapshotIdentity(
  hud: GameHUD,
  rawSnap: unknown
): void {
  if (!rawSnap || typeof rawSnap !== 'object') return;
  const snap = rawSnap as Partial<AuthoritativeSnapshot>;
  const social = hud.sim.ensureNeighborSocial();
  let changed = false;

  if (typeof snap.uid === 'string' && snap.uid.trim()) {
    setAuthenticatedUserId(snap.uid);
  }

  const serverFriendCode =
    (typeof snap.garden?.progression?.friendCode === 'string' &&
      snap.garden.progression.friendCode.trim()) ||
    (snap.profile &&
    typeof snap.profile === 'object' &&
    typeof (snap.profile as Record<string, unknown>).friendCode === 'string'
      ? String((snap.profile as Record<string, unknown>).friendCode).trim()
      : '');
  if (serverFriendCode && social.playerFriendCode !== serverFriendCode) {
    social.playerFriendCode = serverFriendCode;
    changed = true;
  }

  // Đồng bộ số dư trực tiếp từ Ví Galleon Gringotts của HPVN (`galleons_accounts/{uid}`) ngay khi vào game & sau mỗi giao dịch
  if (
    snap.wallet &&
    typeof snap.wallet.spendable === 'number' &&
    Number.isFinite(snap.wallet.spendable)
  ) {
    const homeOrActive = hud.sim.homeStateWhileVisiting ?? hud.sim.state;
    const nextGalleons = Math.max(0, Math.floor(snap.wallet.spendable));
    onlineServices.syncWalletBaseline(nextGalleons);
    if (
      !homeOrActive.sandboxMode &&
      !homeOrActive.sandboxTainted &&
      !hud.sim.isHeadmasterPreview
    ) {
      const hasReceipt = Boolean(snap.receipt);
      const isFreshLocal = isUnplayedFreshSave(
        homeOrActive as unknown as Record<string, unknown>
      );
      // Chỉ ghi đè số dư cục bộ khi có biên lai giao dịch mới (`snap.receipt`), save mới tinh chưa chơi,
      // hoặc số dư trên ví diễn đàn cao hơn (tránh xóa mất Galleon vừa cày offline khi mới mở lại mạng)
      if (hasReceipt || isFreshLocal || nextGalleons >= homeOrActive.galleons) {
        if (homeOrActive.galleons !== nextGalleons) {
          homeOrActive.galleons = nextGalleons;
          if (hud.sim.homeStateWhileVisiting) {
            hud.sim.state.galleons = nextGalleons;
          }
          changed = true;
        }
      }
    }
  }

  const profile =
    snap.profile && typeof snap.profile === 'object'
      ? (snap.profile as Record<string, unknown>)
      : null;
  if (profile) {
    const serverName = typeof profile.username === 'string' ? profile.username.trim() : '';
    if (
      serverName &&
      serverName !== 'Phù Thủy Hang Sóc' &&
      serverName !== 'Trang Trại Hang Sóc' &&
      !social.playerDisplayName
    ) {
      social.playerDisplayName = serverName;
      changed = true;
    }
    const serverAvatar = typeof profile.avatarUrl === 'string' ? profile.avatarUrl.trim() : '';
    if (serverAvatar && social.playerAvatarUrl !== serverAvatar) {
      social.playerAvatarUrl = serverAvatar;
      changed = true;
    }
  }

  const daily = snap.daily && typeof snap.daily === 'object' ? snap.daily : null;
  if (daily && typeof daily.helpsLeft === 'number') {
    hud.flooHelpsLeft = Math.max(0, Math.min(MAX_DAILY_FRIEND_HELPS, Math.floor(daily.helpsLeft)));
    const serverUsed = Math.max(0, MAX_DAILY_FRIEND_HELPS - hud.flooHelpsLeft);
    if (serverUsed > (social.dailyGardenHelpsCount ?? 0)) {
      social.dailyGardenHelpsCount = serverUsed;
      changed = true;
    }
  }

  if (Array.isArray(snap.helpers) && snap.helpers.length > 0) {
    hud.flooHelpersToday = snap.helpers.map((h) => ({
      uid: String(h.uid || ''),
      name: String(h.name || 'Bạn HPVN'),
      avatarEmoji: h.avatarEmoji,
      avatarUrl: h.avatarUrl,
      at: Number(h.at || 0),
    }));
    const freshCheck = detectFreshFlooHelpersToast(
      hud.flooHelpersToday,
      social.lastSeenHelperAt ?? 0
    );
    if (freshCheck && freshCheck.textVi && freshCheck.seenAt > (social.lastSeenHelperAt ?? 0)) {
      social.lastSeenHelperAt = freshCheck.seenAt;
      changed = true;
      hud.showToast(freshCheck.textVi, '🤝');
    }
  }

  if (snap.houseCup && typeof snap.houseCup === 'object') {
    const hc = snap.houseCup as Record<string, unknown>;
    const houses =
      hc.houses && typeof hc.houses === 'object' ? (hc.houses as Record<string, unknown>) : null;
    if (houses && typeof hc.weekKey === 'string') {
      hud.sim.state.weeklyHouseCupServerStandings = {
        weekKey: hc.weekKey,
        totals: {
          Gryffindor: Math.max(0, Math.floor(Number(houses.Gryffindor) || 0)),
          Slytherin: Math.max(0, Math.floor(Number(houses.Slytherin) || 0)),
          Ravenclaw: Math.max(0, Math.floor(Number(houses.Ravenclaw) || 0)),
          Hufflepuff: Math.max(0, Math.floor(Number(houses.Hufflepuff) || 0)),
        },
        playerContribution: Math.max(0, Math.floor(Number(hc.memberTodayPoints) || 0)),
        updatedAt: Date.now(),
      };
      changed = true;
    }
  }

  if (changed) {
    hud.sim.saveToStorage();
    hud.refreshAll();
  }
}

export async function socialUiRefreshFlooDirectory(
  hud: GameHUD,
  force = false
): Promise<void> {
  if (hud.flooLoading) return;
  const now = Date.now();
  if (!force && hud.flooLastLoadedAt > 0 && now - hud.flooLastLoadedAt < 8_000) {
    return;
  }

  hud.flooLoading = true;
  const social = hud.sim.ensureNeighborSocial();
  const house = getPlayerPrimaryHouse(hud);
  const displayName =
    social.playerDisplayName?.trim() ||
    hud.sim.state.parkName?.trim() ||
    'Phù Thủy Hang Sóc';

  try {
    const isSandboxOrPreview =
      Boolean(hud.sim.state.sandboxMode) ||
      Boolean(hud.sim.state.sandboxTainted) ||
      Boolean(hud.sim.isHeadmasterPreview);

    if (!isSandboxOrPreview) {
      void registerRealPlayerProfileOnline(
        hud.sim.state as unknown as Record<string, unknown>
      ).catch(() => {});
    }

    if (!hud.sim.isVisitingNeighbor && !isSandboxOrPreview) {
      await onlineServices.authoritativeClient
        .syncProfile({
          playerName: displayName,
          parkName: hud.sim.state.parkName || 'Trang Trại Hang Sóc',
          avatarUrl: social.playerAvatarUrl || '',
          avatarEmoji: HOUSE_CREST_MAP[house],
          house,
          level: hud.sim.state.level,
          scene: {
            weather:
              hud.sim.state.settings.weatherOverride === 'auto'
                ? 'clear'
                : hud.sim.state.settings.weatherOverride,
            atmosphere:
              hud.sim.state.settings.timeOverride === 'realtime'
                ? 'day'
                : hud.sim.state.settings.timeOverride,
            event: 'harvest_feast',
          },
        })
        .then((snap) => socialUiApplyAuthoritativeSnapshotIdentity(hud, snap))
        .catch(() => {});
    }

    const res = await onlineServices.authoritativeClient.visit({});
    if (typeof res.helpsLeft === 'number') {
      hud.flooHelpsLeft = Math.max(
        0,
        Math.min(MAX_DAILY_FRIEND_HELPS, Math.floor(res.helpsLeft))
      );
      const serverUsed = Math.max(0, MAX_DAILY_FRIEND_HELPS - hud.flooHelpsLeft);
      if (serverUsed > (social.dailyGardenHelpsCount ?? 0)) {
        social.dailyGardenHelpsCount = serverUsed;
      }
    }

    const rawVisits = Array.isArray(res.visits)
      ? (res.visits as FlooVisitDirectoryRow[])
      : [];
    const ordered = flooVisitOrder(rawVisits, Date.now());
    hud.flooDirectoryRows = ordered;
    if (hud.flooQueueRows.length === 0) {
      hud.flooQueueRows = ordered;
    }
    hud.flooLastLoadedAt = Date.now();
    hud.sim.syncFlooDirectoryMembers(ordered, getOrCreateClientUserId());
  } catch {
    // Im lặng dùng danh sách đã cache khi chơi ngoại tuyến
  } finally {
    hud.flooLoading = false;
    const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
    const activeId = document.activeElement?.id ?? '';
    if (nDlg?.open && activeId !== 'inpFlooDisplayName') {
      socialUiRenderNeighborDialog(hud);
    }
    hud.renderVisitorDockBar();
  }
}

export function socialUiShareValleyToFloo(hud: GameHUD): void {
  const meta = buildPlayerPostcardMeta(hud);
  const cardCanvas = renderValleyPostcardCanvas(hud.gameCanvas, meta);
  const image = valleyPostcardToWebpDataUrl(cardCanvas, 0.55);
  const bonus = hud.sim.recordFlooShareOrPostcard('shareFloo');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('hpvn:share-floo', {
        detail: {
          ...meta,
          tourId: getOrCreateClientUserId(),
          image: image || undefined,
        },
      })
    );
  }
  if (bonus.rewarded) {
    hud.showToast(bonus.msg, '🔥');
  }
  hud.refreshAll();
}

export function socialUiOpenNeighborDialog(
  hud: GameHUD,
  tab?: 'friends' | 'postcard' | 'chest' | 'log',
  focusNeighborId?: string
): void {
  hud.closeHudPopovers();
  if (tab) hud.activeNeighborTab = tab;
  if (focusNeighborId) hud.focusedNeighborId = focusNeighborId;

  const isFlooUnlocked =
    hud.sim.state.level >= FLOO_VISIT_UNLOCK_LEVEL ||
    hud.sim.state.sandboxMode ||
    hud.sim.isHeadmasterPreview;
  if (isFlooUnlocked) {
    void socialUiRefreshFlooDirectory(hud);
  }

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

export function socialUiEnterHonorTourFromHud(hud: GameHUD, tourId: string): void {
  clearHudActiveMapTools(hud);
  const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
  if (nDlg?.open) nDlg.close();

  const res = hud.sim.enterHonorGardenTour(tourId);
  if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
    hud.onCameraJump?.();
    centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
  } else if (!res.ok) {
    hud.showToast(res.msg, '⚠️');
  }
  hud.refreshAll();
}

export function socialUiEnterFlooMemberVisitFromHud(
  hud: GameHUD,
  hostUid: string,
  queue?: FlooVisitDirectoryRow[]
): void {
  const cleanUid = String(hostUid || '').trim();
  if (!cleanUid) return;
  if (cleanUid.startsWith('tour_')) {
    socialUiEnterHonorTourFromHud(hud, cleanUid);
    return;
  }
  if (queue && queue.length > 0) {
    hud.flooQueueRows = [...queue];
  } else if (hud.flooQueueRows.length === 0 && hud.flooDirectoryRows.length > 0) {
    hud.flooQueueRows = [...hud.flooDirectoryRows];
  }

  clearHudActiveMapTools(hud);
  const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
  if (nDlg?.open) nDlg.close();

  const neighborId = cleanUid.startsWith('player_') ? cleanUid : `player_${cleanUid}`;
  const rawUid = cleanUid.startsWith('player_') ? cleanUid.slice(7) : cleanUid;

  void (async () => {
    try {
      const res = await onlineServices.authoritativeClient.visit({ hostUid: rawUid });
      if (typeof res.helpsLeft === 'number') {
        hud.flooHelpsLeft = Math.max(
          0,
          Math.min(MAX_DAILY_FRIEND_HELPS, Math.floor(res.helpsLeft))
        );
      }
      const v =
        res.visit && typeof res.visit === 'object'
          ? (res.visit as Record<string, unknown>)
          : null;
      if (v) {
        const prog =
          v.progression && typeof v.progression === 'object'
            ? (v.progression as { timers?: Array<{ readyAt?: number }> })
            : undefined;
        const nowMs = Date.now();
        const growingCount = Array.isArray(prog?.timers)
          ? prog.timers.filter((t) => Number(t.readyAt || 0) > nowMs).length
          : 0;
        const dec =
          v.decorations && typeof v.decorations === 'object'
            ? (v.decorations as { scene?: { weather: string; atmosphere: string; event: string } })
            : undefined;
        const row: FlooVisitDirectoryRow = {
          uid: String(v.uid || rawUid),
          friendCode: typeof v.friendCode === 'string' ? v.friendCode : undefined,
          username: String(v.username || 'Thành Viên HPVN'),
          parkName: String(v.parkName || 'Thung Lũng Phép Thuật'),
          house: (v.house as HouseName) || 'Gryffindor',
          avatarEmoji: typeof v.avatarEmoji === 'string' ? v.avatarEmoji : undefined,
          avatarUrl: typeof v.avatarUrl === 'string' ? v.avatarUrl : undefined,
          level: Math.max(1, Number(v.level || 1)),
          growing: growingCount,
          helped: Boolean(v.helped),
          hostHelpsLeft: typeof v.hostHelpsLeft === 'number' ? v.hostHelpsLeft : 10,
          fire:
            v.fire && typeof v.fire === 'object'
              ? (v.fire as { mode: string; since: number; until: number })
              : null,
          scene: dec?.scene,
        };
        const synced = hud.sim.syncFlooDirectoryMembers([row], getOrCreateClientUserId());
        const rawSave =
          v.rawClientSave && typeof v.rawClientSave === 'object'
            ? (v.rawClientSave as Record<string, unknown>)
            : null;
        if (synced[0] && rawSave) {
          if (Array.isArray(rawSave.buildings) && rawSave.buildings.length > 0) {
            const validB = (rawSave.buildings as PlacedBuilding[]).filter(
              (b) => b && typeof b.itemId === 'string' && Boolean(getCatalogItem(b.itemId))
            );
            if (validB.length > 0) synced[0].valleyBuildings = validB;
          }
          if (rawSave.tileOverrides && typeof rawSave.tileOverrides === 'object') {
            synced[0].valleyTileOverrides = rawSave.tileOverrides as Record<
              string,
              TileOverrideData
            >;
          }
          if (Array.isArray(rawSave.unlockedZones) && rawSave.unlockedZones.length > 0) {
            synced[0].valleyUnlockedZones = rawSave.unlockedZones as ZoneId[];
          }
        }
      }
    } catch {
      // Fallback sang hồ sơ cục bộ nếu đang ngoại tuyến
    }

    const enterRes = hud.sim.enterNeighborVisit(neighborId);
    if (
      enterRes.ok &&
      typeof enterRes.focusGx === 'number' &&
      typeof enterRes.focusGy === 'number'
    ) {
      hud.onCameraJump?.();
      centerCameraOnGrid(hud.cam, enterRes.focusGx, enterRes.focusGy);
    } else if (!enterRes.ok) {
      hud.showToast(enterRes.msg, '⚠️');
    }
    hud.refreshAll();
  })();
}

export function socialUiEnterVisitFromHud(hud: GameHUD, neighborId: string): void {
  if (neighborId.startsWith('tour_')) {
    socialUiEnterHonorTourFromHud(hud, neighborId);
    return;
  }
  clearHudActiveMapTools(hud);

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
  if (hud.flooAutoAdvanceTimer) {
    window.clearTimeout(hud.flooAutoAdvanceTimer);
    hud.flooAutoAdvanceTimer = 0;
  }
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
  const fulfilledOwlCount = social.playerOwlHelpRequests.filter((r) => Boolean(r.fulfilledAt))
    .length;
  const sosRescuedAt = social.playerMinigameSos?.rescuedAt ?? 0;
  const sosClaimed = Boolean(social.playerMinigameSos?.claimed);
  const sig = `${social.lastSocialResetKey}|${social.friendshipTokens}|${fulfilledOwlCount}|${sosRescuedAt}|${sosClaimed}|${social.homeLanternMarks.length}|${social.dailyRescuesGivenIds.length}|${social.dailyGardenHelpsCount ?? 0}`;
  if (sig === hud.lastSocialLiveSig) return;
  hud.lastSocialLiveSig = sig;

  socialUiRefreshNeighborBadges(hud);
  const qDlg = hud.root.querySelector('#questDialog') as HTMLDialogElement | null;
  if (qDlg?.open && hud.activeQuestTab === 'orders') {
    hud.renderQuestDialog();
  }
  const nDlg = hud.root.querySelector('#neighborDialog') as HTMLDialogElement | null;
  const activeId = document.activeElement?.id ?? '';
  if (nDlg?.open && activeId !== 'inpFlooDisplayName') {
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
  const helpableFlooCount =
    hud.sim.state.level >= FLOO_VISIT_UNLOCK_LEVEL &&
    (social.dailyGardenHelpsCount ?? 0) < MAX_DAILY_FRIEND_HELPS
      ? hud.flooDirectoryRows.filter((r) => canHelpFlooVisitRow(r)).length
      : 0;

  const badge = hud.root.querySelector('#badgeNeighborCount') as HTMLElement | null;
  if (badge) {
    const shown =
      urgentReady > 0
        ? urgentReady
        : openFriendSosCount > 0
          ? openFriendSosCount
          : helpableFlooCount;
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

  if (hud.photoModeActive) {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }

  // Chế độ 1: Đang tham quan Vườn Mẫu Danh Dự Hogwarts (mở ngay từ Cấp 1)
  const honorTour = hud.sim.getActiveHonorGardenTour();
  if (honorTour) {
    bar.classList.remove('hidden');
    bar.innerHTML = `
      <div class="visitor-dock-head">
        <span class="visitor-avatar-pill" aria-hidden="true">${escapeHtml(honorTour.avatarEmoji)}</span>
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${escapeHtml(honorTour.titleVi)}</strong>
            <span class="visitor-lv-tag">🏛️ Vườn Mẫu · Lv.${honorTour.level}</span>
          </div>
          <div class="visitor-sub-row">
            <span>${escapeHtml(honorTour.ownerName)} · ${escapeHtml(HOUSE_LABEL_MAP[honorTour.house])}</span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        <button id="btnHonorPrev" type="button" class="brass-btn" title="Vườn mẫu trước">‹</button>
        <button id="btnHonorNext" type="button" class="brass-btn gold-cta" title="Sang Vườn Mẫu kế tiếp">🏛️ Vườn mẫu tiếp ›</button>
        <button id="btnHonorShareFloo" type="button" class="brass-btn" title="Khoe vườn trên Mạng Floo">🔥 Khoe Floo</button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Về vườn nhà">🏡 Về vườn</button>
      </div>
    `;

    bar.querySelector('#btnHonorPrev')?.addEventListener('click', () => {
      const res = hud.sim.cycleHonorGardenTour(-1);
      if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
        hud.onCameraJump?.();
        centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
      }
      hud.refreshAll();
    });
    bar.querySelector('#btnHonorNext')?.addEventListener('click', () => {
      const res = hud.sim.cycleHonorGardenTour(1);
      if (res.ok && typeof res.focusGx === 'number' && typeof res.focusGy === 'number') {
        hud.onCameraJump?.();
        centerCameraOnGrid(hud.cam, res.focusGx, res.focusGy);
      }
      hud.refreshAll();
    });
    bar.querySelector('#btnHonorShareFloo')?.addEventListener('click', () => {
      socialUiShareValleyToFloo(hud);
    });
    bar.querySelector('#btnVisitorReturnHome')?.addEventListener('click', () => {
      socialUiExitVisitFromHud(hud);
    });
    return;
  }

  // Chế độ 2: Đang bay Floo thăm thung lũng thành viên cộng đồng HPVN
  const nb = hud.sim.getActiveVisitingNeighbor();
  if (!nb) {
    bar.classList.add('hidden');
    bar.innerHTML = '';
    return;
  }

  const social = hud.sim.ensureNeighborSocial();
  const nowMs = Date.now();
  const helpsDone = Math.min(
    MAX_DAILY_FRIEND_HELPS,
    Math.max(
      social.dailyGardenHelpsCount ?? 0,
      nb.helpedViaFlooToday ? 1 : nb.helpedMarksToday.length
    )
  );
  const helpsLeft = Math.max(0, MAX_DAILY_FRIEND_HELPS - helpsDone);
  const alreadyHelpedThisHost = Boolean(nb.helpedViaFlooToday || nb.helpedMarksToday.length > 0);
  const hostCapReached = (nb.hostHelpsLeft ?? 10) <= 0;
  const isBurning = Boolean(nb.fireUntilMs && nb.fireUntilMs > nowMs);
  const canFlooHelp = !alreadyHelpedThisHost && helpsLeft > 0 && !hostCapReached;

  const likedToday = social.dailyLikedNeighborIds.includes(nb.id);
  const mysteryClaimedToday = social.dailyMysteryClaimedIds.includes(nb.id);
  const openCrates = nb.owlHelpCrates.filter((c) => !c.fulfilledByPlayerToday).length;
  const canRescue = hud.sim.canRescueNeighborMinigame(nb.id).ok;
  const coOpPendingCount = openCrates + (canRescue ? 1 : 0);

  const queueRows =
    hud.flooQueueRows.length > 0 ? hud.flooQueueRows : hud.flooDirectoryRows;
  const activeHostUid = nb.remoteUserId || nb.id.replace(/^player_/, '');

  const stripHtml =
    queueRows.length > 1
      ? `
        <div class="floo-visit-strip" role="list" aria-label="Hàng đợi Cổng Bay Floo">
          ${queueRows
            .slice(0, 12)
            .map((r) => {
              const isCurrent = r.uid === activeHostUid;
              const needHelp = canHelpFlooVisitRow(r, nowMs);
              const burn = Boolean(r.fire && r.fire.until > nowMs);
              return `
                <button
                  type="button"
                  class="floo-strip-dot ${isCurrent ? 'is-current' : ''} ${needHelp ? 'is-helpable' : ''} ${burn ? 'is-fire' : ''}"
                  data-floo-jump="${escapeHtml(r.uid)}"
                  title="${escapeHtml(r.username)} (Lv.${r.level})"
                >
                  ${buildAvatarBadgeHtml(r.avatarUrl, r.avatarEmoji || r.username, 'floo-strip-avatar')}
                  ${burn ? '<span class="floo-mini-fire" aria-hidden="true">🔥</span>' : ''}
                </button>
              `;
            })
            .join('')}
        </div>
      `
      : '';

  const helpBtnLabel = alreadyHelpedThisHost
    ? '✓ Đã giúp (-15p)'
    : helpsLeft <= 0
      ? 'Hết lượt (5/5)'
      : hostCapReached
        ? 'Đủ lượt nhận'
        : '🔥 Chăm giúp (-15p)';

  bar.classList.remove('hidden');
  bar.innerHTML = `
    ${stripHtml}
    <div class="visitor-dock-main-row">
      <div class="visitor-dock-head">
        ${buildAvatarBadgeHtml(nb.avatarUrl, nb.avatarEmoji || nb.name, 'visitor-avatar-pill')}
        <div class="visitor-meta-col">
          <div class="visitor-title-row">
            <strong>${escapeHtml(nb.name)}</strong>
            <span class="visitor-lv-tag">Lv.${nb.level}</span>
            ${isBurning ? '<span class="floo-fire-tag">🔥 Đang cháy</span>' : ''}
          </div>
          <div class="visitor-sub-row">
            <span>🔥 Còn <strong>${helpsLeft}/${MAX_DAILY_FRIEND_HELPS}</strong> lượt</span>
            <span>•</span>
            <span>🍀 <strong>${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST}</strong></span>
          </div>
        </div>
      </div>
      <div class="visitor-dock-actions">
        ${
          queueRows.length > 1
            ? `<button id="btnVisitorPrevFriend" type="button" class="brass-btn" title="Vườn trước">‹</button>`
            : ''
        }
        <button id="btnVisitorFlooHelp" type="button" class="brass-btn ${canFlooHelp ? 'gold-cta' : ''}" ${!canFlooHelp ? 'disabled' : ''} title="Chăm giúp toàn thung lũng (-15 phút chờ)">
          ${helpBtnLabel}
        </button>
        ${
          isBurning
            ? `<button id="btnVisitorExtinguish" type="button" class="brass-btn gold-cta" title="Dập lửa giúp hàng xóm">🧯 Dập lửa</button>`
            : ''
        }
        <button id="btnVisitorLike" type="button" class="brass-btn" ${likedToday ? 'disabled' : ''} title="Thả tim khen vườn">
          ${likedToday ? '✓ Tim' : '❤️ +1🍀'}
        </button>
        <button id="btnVisitorLocateGift" type="button" class="brass-btn" ${mysteryClaimedToday ? 'disabled' : ''} title="Tìm Giỏ Quà Bí Ẩn">
          ${mysteryClaimedToday ? '✓ Quà' : '🎁 Quà'}
        </button>
        ${
          coOpPendingCount > 0
            ? `<button id="btnVisitorCoopBook" type="button" class="brass-btn gold-cta" title="Đóng Đơn Cú & Giải Cứu Màn Khó">📦 (${coOpPendingCount})</button>`
            : ''
        }
        <button id="btnVisitorNextFriend" type="button" class="brass-btn" title="Sang thung lũng tiếp theo">
          Vườn tiếp ›
        </button>
        <button id="btnVisitorReturnHome" type="button" class="brass-btn visitor-home-cta" title="Trở về vườn nhà">
          🏡 Về vườn
        </button>
      </div>
    </div>
  `;

  wireAvatarImgFallbacks(bar);

  bar.querySelectorAll<HTMLButtonElement>('[data-floo-jump]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetUid = btn.dataset.flooJump;
      if (targetUid && targetUid !== activeHostUid) {
        socialUiEnterFlooMemberVisitFromHud(hud, targetUid, queueRows);
      }
    });
  });

  bar.querySelector('#btnVisitorFlooHelp')?.addEventListener('click', async () => {
    const helpBtn = bar.querySelector('#btnVisitorFlooHelp') as HTMLButtonElement | null;
    if (helpBtn) helpBtn.disabled = true;

    let serverHelpsLeft: number | undefined;
    if (nb.remoteUserId) {
      try {
        const note = getPresetNoteMeta(social.selectedPresetNoteId);
        const rpcRes = await onlineServices.authoritativeClient.visit({
          hostUid: nb.remoteUserId,
          help: true,
          kind: 'water_crop',
          noteText: note.textVi,
        });
        if (typeof rpcRes.helpsLeft === 'number') {
          serverHelpsLeft = rpcRes.helpsLeft;
          hud.flooHelpsLeft = rpcRes.helpsLeft;
        }
      } catch (err) {
        const refusal = formatServerRefusalVi(err);
        if (refusal.reason === 'already-helped' || refusal.reason === 'daily-help-cap' || refusal.reason === 'host-help-cap') {
          hud.showToast(`${refusal.icon} ${refusal.text}`, refusal.icon);
          void socialUiRefreshFlooDirectory(hud, true);
          hud.refreshAll();
          return;
        }
      }
    }

    const res = hud.sim.helpVisitedFlooMemberWholeGarden({ serverHelpsLeft });
    if (!res.ok) {
      hud.showToast(res.msg, '🤝');
      hud.refreshAll();
      return;
    }

    const markRowHelped = (rows: FlooVisitDirectoryRow[]) =>
      rows.map((r) => (r.uid === activeHostUid ? { ...r, helped: true } : r));
    hud.flooDirectoryRows = markRowHelped(hud.flooDirectoryRows);
    hud.flooQueueRows = markRowHelped(hud.flooQueueRows);
    hud.refreshAll();

    // Tự động chuyển sang vườn cần chăm kế tiếp sau 1.6s (chuẩn UX Bay Floo Hagrid's Garden)
    if (res.helpsLeft > 0 && hud.flooQueueRows.length > 1) {
      const nextRow = nextFlooVisit(hud.flooQueueRows, activeHostUid, 1);
      if (nextRow && nextRow.uid !== activeHostUid && canHelpFlooVisitRow(nextRow)) {
        if (hud.flooAutoAdvanceTimer) window.clearTimeout(hud.flooAutoAdvanceTimer);
        hud.flooAutoAdvanceTimer = window.setTimeout(() => {
          hud.flooAutoAdvanceTimer = 0;
          if (hud.sim.getActiveVisitingNeighbor()?.id === nb.id) {
            socialUiEnterFlooMemberVisitFromHud(hud, nextRow.uid, hud.flooQueueRows);
          }
        }, 1600);
      }
    }
  });

  bar.querySelector('#btnVisitorExtinguish')?.addEventListener('click', async () => {
    const extBtn = bar.querySelector('#btnVisitorExtinguish') as HTMLButtonElement | null;
    if (extBtn) extBtn.disabled = true;
    try {
      let paidGalleons = 0;
      if (nb.remoteUserId) {
        const fireRes = await onlineServices.authoritativeClient.fireOut({
          hostUid: nb.remoteUserId,
        });
        paidGalleons = Math.max(0, Math.floor(Number(fireRes?.price || 0)));
      }
      if (paidGalleons > 0) {
        const homeOrActive = hud.sim.homeStateWhileVisiting ?? hud.sim.state;
        homeOrActive.galleons = Math.max(0, homeOrActive.galleons - paidGalleons);
        if (hud.sim.homeStateWhileVisiting) {
          hud.sim.state.galleons = homeOrActive.galleons;
        }
      }
      nb.fireUntilMs = 0;
      const clearFire = (rows: FlooVisitDirectoryRow[]) =>
        rows.map((r) => (r.uid === activeHostUid ? { ...r, fire: null } : r));
      hud.flooDirectoryRows = clearFire(hud.flooDirectoryRows);
      hud.flooQueueRows = clearFire(hud.flooQueueRows);
      hud.showToast(
        paidGalleons > 0
          ? `🧯 Đã dập tắt đám cháy giúp thung lũng ${nb.name} (-${paidGalleons} G)!`
          : `🧯 Đã dập tắt đám cháy giúp thung lũng ${nb.name}!`,
        '🧯'
      );
      hud.sim.saveToStorage();
      hud.refreshAll();
    } catch (err) {
      const refusal = formatServerRefusalVi(err);
      hud.showToast(`${refusal.icon} ${refusal.text}`, refusal.icon);
      if (extBtn) extBtn.disabled = false;
    }
  });

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
      '🎁 Giỏ Quà Bí Ẩn đang lấp lánh tại đây — nhấp trực tiếp vào hộp quà để nhận +1 🍀!',
      '🎁'
    );
  });

  bar.querySelector('#btnVisitorCoopBook')?.addEventListener('click', () => {
    socialUiOpenNeighborDialog(hud, 'friends', nb.id);
  });

  bar.querySelector('#btnVisitorPrevFriend')?.addEventListener('click', () => {
    const prevRow = nextFlooVisit(queueRows, activeHostUid, -1);
    if (prevRow && prevRow.uid !== activeHostUid) {
      socialUiEnterFlooMemberVisitFromHud(hud, prevRow.uid, queueRows);
    }
  });

  bar.querySelector('#btnVisitorNextFriend')?.addEventListener('click', () => {
    if (queueRows.length > 1) {
      const nextRow = nextFlooVisit(queueRows, activeHostUid, 1);
      if (nextRow && nextRow.uid !== activeHostUid) {
        socialUiEnterFlooMemberVisitFromHud(hud, nextRow.uid, queueRows);
        return;
      }
    }
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
  const activeHonorTour = hud.sim.getActiveHonorGardenTour();
  const nowMs = Date.now();
  const playerHouse = getPlayerPrimaryHouse(hud);
  const playerDisplayName =
    social.playerDisplayName?.trim() ||
    hud.sim.state.parkName?.trim() ||
    'Phù Thủy Hang Sóc';

  const helpsUsedToday = Math.min(
    MAX_DAILY_FRIEND_HELPS,
    Math.max(0, social.dailyGardenHelpsCount ?? 0)
  );
  const helpsLeftToday = Math.max(0, MAX_DAILY_FRIEND_HELPS - helpsUsedToday);
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

  const isFlooUnlocked =
    hud.sim.state.level >= FLOO_VISIT_UNLOCK_LEVEL ||
    hud.sim.state.sandboxMode ||
    hud.sim.isHeadmasterPreview;

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
        <span>🔥 <strong>${helpsLeftToday}/${MAX_DAILY_FRIEND_HELPS}</strong></span>
        <span>•</span>
        <span>⚔️ <strong>${rescuesGivenLeft}/${MAX_DAILY_MINIGAME_RESCUES}</strong></span>
        <span>•</span>
        <span>🦉 <strong>${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}</strong></span>
      </div>
    </div>
  `;

  const tabsHtml = `
    <div class="workshop-tabs" role="group" aria-label="Cổng Floo và Hàng Xóm">
      <button type="button" data-nbtab="friends" data-active="${hud.activeNeighborTab === 'friends'}" aria-pressed="${hud.activeNeighborTab === 'friends'}" class="brass-btn">
        🔥 Cổng Floo
      </button>
      <button type="button" data-nbtab="postcard" data-active="${hud.activeNeighborTab === 'postcard'}" aria-pressed="${hud.activeNeighborTab === 'postcard'}" class="brass-btn">
        🖼️ Bưu Thiếp ${!social.dailyFlooShareClaimed ? '(!)' : ''}
      </button>
      <button type="button" data-nbtab="chest" data-active="${hud.activeNeighborTab === 'chest'}" aria-pressed="${hud.activeNeighborTab === 'chest'}" class="brass-btn">
        🎁 Rương &amp; SOS ${chestReady || mySos?.rescuedAt ? '(!)' : ''}
      </button>
      <button type="button" data-nbtab="log" data-active="${hud.activeNeighborTab === 'log'}" aria-pressed="${hud.activeNeighborTab === 'log'}" class="brass-btn">
        📜 Lưu Bút (${social.activityLog.length})
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
          <span>🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn HPVN')}</strong> đã vượt hộ <strong>${km.icon} Màn ${mySos.stage}</strong>!</span>
          <button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>
        </div>
      `);
    } else if (mySos) {
      const km = getMinigameKindLabelVi(mySos.kind);
      quickAlertBanners.push(`
        <div class="nb-alert-banner">
          <span>🦉 Đang treo cầu viện <strong>${km.icon} Màn ${mySos.stage}</strong> trên Cổng Floo…</span>
        </div>
      `);
    }

    if (social.homeLanternMarks.length > 0) {
      quickAlertBanners.push(`
        <div class="nb-alert-banner ready">
          <span>🏮 Có <strong>${social.homeLanternMarks.length} Đèn Lồng Chúc Phúc</strong> tại vườn nhà</span>
          <button id="btnNbClaimAllLanterns" type="button" class="brass-btn gold-cta nb-mini-cta">🏮 Nhận (+${social.homeLanternMarks.length}🍀)</button>
        </div>
      `);
    }

    // 1. Thẻ Định Danh Thành Viên HPVN (Tự động kết nối — không cần mã kết bạn)
    const identityCardHtml = `
      <section class="floo-identity-card">
        <div class="floo-identity-main">
          ${buildAvatarBadgeHtml(social.playerAvatarUrl, HOUSE_CREST_MAP[playerHouse], 'floo-identity-avatar')}
          <div class="floo-identity-fields">
            <div class="floo-identity-badges">
              <span class="nb-badge-pill">Lv.${hud.sim.state.level}</span>
              <span class="nb-badge-pill house">${HOUSE_LABEL_MAP[playerHouse]}</span>
              <span class="floo-verified-tag">✓ Thành viên HPVN tự động</span>
            </div>
            <form id="frmFlooIdentityName" class="floo-name-form">
              <label for="inpFlooDisplayName" class="sr-only">Biệt danh trên Cổng Floo</label>
              <input
                id="inpFlooDisplayName"
                name="displayName"
                type="text"
                maxlength="32"
                value="${escapeHtml(playerDisplayName)}"
                placeholder="Biệt danh phù thủy của bạn"
                autocomplete="off"
              />
              <button type="submit" class="brass-btn nb-mini-cta">Lưu tên</button>
            </form>
          </div>
        </div>
        <div class="floo-identity-ctas">
          <button id="btnFlooOpenPostcardTab" type="button" class="brass-btn">🖼️ Bưu Thiếp</button>
          <button id="btnFlooQuickInvite" type="button" class="brass-btn gold-cta">
            🔥 Rủ Bạn Trên Mạng Floo ${!social.dailyFlooShareClaimed ? '(+10G)' : ''}
          </button>
        </div>
      </section>
    `;

    // 2. Khu Cổng Bay Floo Cộng Đồng (Cấp 1–9 khóa ấm áp · Cấp 10+ mở lưới portal)
    let flooHearthHtml = '';
    if (!isFlooUnlocked) {
      const lvPct = Math.min(
        100,
        Math.round((hud.sim.state.level / FLOO_VISIT_UNLOCK_LEVEL) * 100)
      );
      flooHearthHtml = `
        <section class="floo-hearth-hero is-locked">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN — Mở Ở Cấp ${FLOO_VISIT_UNLOCK_LEVEL}</div>
              <div class="floo-hearth-sub">
                Đang ở <strong>Cấp ${hud.sim.state.level}/${FLOO_VISIT_UNLOCK_LEVEL}</strong> · Khi đạt Cấp ${FLOO_VISIT_UNLOCK_LEVEL}, lò sưởi tự động kết nối thung lũng các thành viên HPVN mà không cần nhập mã kết bạn!
              </div>
              <div class="quest-bar floo-lv-bar">
                <div class="quest-bar-fill" style="width:${lvPct}%"></div>
              </div>
            </div>
          </div>
        </section>
      `;
    } else {
      const orderedRows = flooVisitOrder(hud.flooDirectoryRows, nowMs);
      const helpableCount = orderedRows.filter((r) => canHelpFlooVisitRow(r, nowMs)).length;

      const helpersCombined = [
        ...hud.flooHelpersToday,
        ...social.homeLanternMarks.map((m) => ({
          uid: m.helperId,
          name: m.helperName,
          avatarEmoji: m.helperEmoji,
          avatarUrl: m.helperAvatarUrl,
          at: m.createdAt,
        })),
      ];
      const uniqueHelpers = Array.from(
        new Map(helpersCombined.map((h) => [h.uid || h.name, h])).values()
      );
      const helpersStripHtml =
        uniqueHelpers.length > 0
          ? `
            <div class="floo-helpers-strip">
              <div class="floo-helpers-avatars">
                ${uniqueHelpers
                  .slice(0, 6)
                  .map((h) =>
                    buildAvatarBadgeHtml(h.avatarUrl, h.avatarEmoji || h.name, 'floo-helper-chip')
                  )
                  .join('')}
              </div>
              <div class="floo-helpers-text">
                🤝 <strong>${escapeHtml(formatFlooHelperNamesVi(uniqueHelpers))}</strong> đã sang chăm giúp · mẻ sản xuất nhanh hơn <strong>${uniqueHelpers.length * 15} phút</strong>!
              </div>
            </div>
          `
          : '';

      const portalsGridHtml =
        orderedRows.length > 0
          ? `
            <div class="floo-portal-grid" role="list">
              ${orderedRows
                .map((row) => {
                  const isBurn = Boolean(row.fire && row.fire.until > nowMs);
                  const needHelp = canHelpFlooVisitRow(row, nowMs);
                  const isCurrentVisit =
                    visitingNb?.remoteUserId === row.uid ||
                    visitingNb?.id === `player_${row.uid}`;
                  const statusLabel = isBurn
                    ? '🔥 Đang cháy · cần dập!'
                    : row.helped
                      ? '✓ Đã chăm giúp'
                      : row.growing > 0
                        ? `🌱 ${row.growing} mẻ đang lớn`
                        : '🌿 Thung lũng yên bình';
                  return `
                    <button
                      type="button"
                      role="listitem"
                      class="floo-portal-tile ${isBurn ? 'is-fire' : ''} ${needHelp ? 'is-helpable' : ''} ${row.helped ? 'is-helped' : ''} ${isCurrentVisit ? 'is-visiting' : ''}"
                      data-floo-portal="${escapeHtml(row.uid)}"
                    >
                      <div class="floo-portal-ring">
                        ${buildAvatarBadgeHtml(row.avatarUrl, row.avatarEmoji || row.username, 'floo-portal-avatar')}
                        ${isBurn ? '<span class="floo-portal-fire-badge" aria-hidden="true">🔥</span>' : ''}
                        <span class="floo-portal-lv">Lv.${row.level}</span>
                      </div>
                      <strong class="floo-portal-name">${escapeHtml(row.username)}</strong>
                      <span class="floo-portal-park">${escapeHtml((row.house ? HOUSE_CREST_MAP[row.house] : '') || '🪄')} ${escapeHtml(row.parkName || '')}</span>
                      <span class="floo-portal-status">${statusLabel}</span>
                    </button>
                  `;
                })
                .join('')}
            </div>
          `
          : `
            <div class="nb-panel-card">
              ${
                hud.flooLoading
                  ? '🔥 Đang thắp lửa kết nối Cổng Bay Floo Cộng Đồng HPVN…'
                  : '🌿 Lò sưởi đang lắng nghe các thung lũng thành viên HPVN trực tuyến — bấm Làm mới hoặc Khoe Vườn để rủ bạn ghé thăm!'
              }
            </div>
          `;

      // Tương trợ Co-op (Đơn Cú & Giải Cứu Màn Khó) cho các thành viên đã đồng bộ từ Cổng Floo
      const coopNeighbors = social.neighbors.filter(
        (nb) =>
          nb.owlHelpCrates.some((c) => !c.fulfilledByPlayerToday) ||
          Boolean(nb.minigameSos && !nb.minigameSos.rescuedToday)
      );
      const coopSectionHtml =
        coopNeighbors.length > 0
          ? `
            <section class="floo-coop-board">
              <div class="nb-section-title">🦉 Bảng Tương Trợ Cộng Đồng (Đơn Cú &amp; Giải Cứu Khảo Thí)</div>
              <div class="nb-friends-list">
                ${coopNeighbors
                  .slice(0, 6)
                  .map((nb) => {
                    const rescueCheck = hud.sim.canRescueNeighborMinigame(nb.id);
                    const sos = nb.minigameSos;
                    const sosMeta = sos ? getMinigameKindLabelVi(sos.kind) : null;
                    const alreadyRescued = Boolean(
                      sos && (sos.rescuedToday || social.dailyRescuesGivenIds.includes(nb.id))
                    );
                    const cratesHtml = nb.owlHelpCrates
                      .filter((c) => !c.fulfilledByPlayerToday)
                      .map((crate) => {
                        const meta = getFarmItemMeta(crate.itemId);
                        const have = hud.sim.getFarmItemCount(crate.itemId);
                        const enough = hud.sim.state.sandboxMode || have >= crate.qty;
                        return `
                          <div class="nb-crate-item">
                            <img src="${meta.iconSrc}" alt="${escapeHtml(meta.name)}" class="nb-crate-icon" />
                            <div class="nb-crate-info">
                              <div class="nb-crate-title">${crate.qty} ${escapeHtml(meta.name)} <span class="nb-crate-stock">(${hud.sim.state.sandboxMode ? '∞' : have}/${crate.qty})</span></div>
                              <div class="nb-crate-rew">+${crate.rewardTokens}🍀 • +${crate.rewardGalleons}G</div>
                            </div>
                            <button type="button" class="brass-btn ${enough ? 'gold-cta' : ''} nb-mini-cta" data-nb-crate="${escapeHtml(nb.id)}|${escapeHtml(crate.id)}" ${!enough ? 'disabled' : ''}>📦 Đóng giúp</button>
                          </div>
                        `;
                      })
                      .join('');

                    const sosHtml =
                      sos && sosMeta && !alreadyRescued
                        ? `
                          <div class="nb-coop-section sos">
                            <div class="nb-sos-row">
                              <div class="nb-sos-info">
                                <div class="nb-sos-title">⚔️ ${sosMeta.icon} ${escapeHtml(sosMeta.nameVi)} • <strong>Màn ${sos.stage}</strong></div>
                              </div>
                              <button type="button" class="brass-btn gold-cta nb-mini-cta" data-nb-rescue="${escapeHtml(nb.id)}" ${!rescueCheck.ok ? 'disabled' : ''}>⚔️ Cứu hộ</button>
                            </div>
                          </div>
                        `
                        : '';

                    return `
                      <article class="nb-friend-card ${hud.focusedNeighborId === nb.id ? 'focused' : ''}" data-neighbor-card="${escapeHtml(nb.id)}">
                        <div class="nb-card-head">
                          ${buildAvatarBadgeHtml(nb.avatarUrl, nb.avatarEmoji || nb.name, 'nb-avatar-circle')}
                          <div class="nb-head-info">
                            <div class="nb-name-row">
                              <strong class="nb-friend-name">${escapeHtml(nb.name)}</strong>
                              <span class="nb-badge-pill">Lv.${nb.level}</span>
                              <span class="nb-badge-pill house">${HOUSE_LABEL_MAP[nb.house]}</span>
                            </div>
                          </div>
                          <button type="button" class="brass-btn nb-mini-cta" data-nb-visit="${escapeHtml(nb.id)}">🔥 Bay tới</button>
                        </div>
                        ${cratesHtml ? `<div class="nb-coop-section"><div class="nb-crate-list">${cratesHtml}</div></div>` : ''}
                        ${sosHtml}
                      </article>
                    `;
                  })
                  .join('')}
              </div>
            </section>
          `
          : '';

      flooHearthHtml = `
        <section class="floo-hearth-hero">
          <div class="floo-hearth-head">
            <div class="floo-hearth-flame" aria-hidden="true">🔥</div>
            <div class="floo-hearth-copy">
              <div class="floo-hearth-title">Cổng Bay Floo Cộng Đồng HPVN</div>
              <div class="floo-hearth-sub">
                Còn <strong>${helpsLeftToday}/${MAX_DAILY_FRIEND_HELPS} lượt chăm giúp</strong> hôm nay · <strong>${helpableCount}</strong> thung lũng đang chờ tiếp sức (-15 phút)
              </div>
            </div>
            <div class="floo-hearth-actions">
              <button id="btnFlooRefreshDir" type="button" class="brass-btn nb-mini-cta" ${hud.flooLoading ? 'disabled' : ''}>
                ${hud.flooLoading ? '⏳…' : '🔄'}
              </button>
              <button id="btnFlooQuickJump" type="button" class="brass-btn gold-cta" ${orderedRows.length === 0 ? 'disabled' : ''}>
                🔥 Bay Floo
              </button>
            </div>
          </div>
          ${helpersStripHtml}
        </section>
        ${portalsGridHtml}
        ${coopSectionHtml}
      `;
    }

    // 3. Khu Vườn Mẫu Danh Dự Hogwarts (Mở sẵn ngay từ Cấp 1 — không bao giờ trống rỗng!)
    const honorGardensHtml = `
      <section class="honor-gardens-section">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🏛️ Vườn Mẫu Danh Dự Hogwarts (Mở Từ Cấp 1)</div>
          <span class="honor-daily-pill">
            ${!social.dailyHonorTourClaimed ? '🎁 +8G · +15 XP cảm hứng đầu ngày' : '✓ Đã nhận quà cảm hứng hôm nay'}
          </span>
        </div>
        <div class="honor-gardens-grid">
          ${HONOR_GARDENS.map((g) => {
            const isCurrentTour = activeHonorTour?.id === g.id;
            return `
              <article class="honor-garden-card ${isCurrentTour ? 'visiting' : ''}">
                <div class="honor-garden-top">
                  <span class="honor-garden-emoji" aria-hidden="true">${escapeHtml(g.avatarEmoji)}</span>
                  <div class="honor-garden-meta">
                    <strong class="honor-garden-title">${escapeHtml(g.titleVi)}</strong>
                    <span class="honor-garden-owner">${escapeHtml(g.ownerName)} · Lv.${g.level} · ${HOUSE_LABEL_MAP[g.house]}</span>
                  </div>
                </div>
                <p class="honor-garden-desc">${escapeHtml(g.descVi)}</p>
                <div class="honor-garden-foot">
                  <span class="nb-badge-pill">✨ ${escapeHtml(g.weather)} · ${escapeHtml(g.atmosphere)}</span>
                  ${
                    isCurrentTour
                      ? `<button type="button" id="btnNbExitCurrentVisit" class="brass-btn visitor-home-cta nb-mini-cta">🏡 Về vườn</button>`
                      : `<button type="button" class="brass-btn gold-cta nb-mini-cta" data-honor-tour="${escapeHtml(g.id)}">🧭 Tham Quan</button>`
                  }
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    `;

    bodyHtml = `
      ${quickAlertBanners.join('')}
      ${identityCardHtml}
      ${
        isFlooUnlocked
          ? `${flooHearthHtml}${honorGardensHtml}`
          : `${honorGardensHtml}${flooHearthHtml}`
      }
    `;
  } else if (hud.activeNeighborTab === 'postcard') {
    const meta = buildPlayerPostcardMeta(hud);
    const previewMsg = formatFlooShareMessage(meta);
    bodyHtml = `
      <section class="nb-panel-card highlight floo-postcard-wrap">
        <div class="honor-gardens-header">
          <div class="nb-section-title">🖼️ Bưu Thiếp Thung Lũng &amp; Rủ Bạn Qua Mạng Floo</div>
          <span class="honor-daily-pill">
            ${!social.dailyFlooShareClaimed ? '🎁 +10G · +1 🍀 · +15 điểm Lễ Hội' : '✓ Đã nhận quà Bưu Thiếp hôm nay'}
          </span>
        </div>
        <div class="floo-postcard-stage">
          <canvas id="flooPostcardCanvas" width="640" height="380" class="floo-postcard-canvas"></canvas>
        </div>
        <div class="floo-postcard-caption">${escapeHtml(previewMsg)}</div>
        <div class="floo-postcard-actions">
          <button id="btnPostcardDownload" type="button" class="brass-btn">
            💾 Lưu Bưu Thiếp Về Máy
          </button>
          <button id="btnPostcardShareFloo" type="button" class="brass-btn gold-cta">
            🔥 Khoe Vườn &amp; Rủ Bạn Trên Mạng Floo
          </button>
        </div>
      </section>
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
                        ? `✓ ${escapeHtml(r.helperEmoji ?? '🦉')} ${escapeHtml(r.helperName ?? 'Bạn HPVN')}`
                        : '🦉 Đang gọi hỗ trợ trên Cổng Floo…'
                    }</div>
                  </div>
                </div>
              `;
            })
            .join('')
        : `<div class="floo-muted-note">Chưa có kiện hàng nào đang nhờ bạn bè đóng phụ.</div>`;

    bodyHtml = `
      <div class="nb-chest-grid">
        <section class="nb-panel-card highlight">
          <div class="nb-section-title">🎁 Rương Tình Bạn (${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)</div>
          <div class="quest-bar floo-lv-bar">
            <div class="quest-bar-fill" style="width:${chestPct}%"></div>
          </div>
          <div class="nb-chest-rewards">
            <span class="owl-rew-pill gold">🌟 +2</span>
            <span class="owl-rew-pill plug">🔥 +1</span>
            <span class="owl-rew-pill xp">🌱 +2</span>
            <span class="owl-rew-pill gold">🪙 +150G</span>
          </div>
          <div class="floo-chest-foot">
            <span class="floo-chest-count">Đã mở: ${social.chestsOpened}</span>
            <button id="btnNbOpenFriendshipChest" type="button" class="brass-btn gold-cta" ${!chestReady ? 'disabled' : ''}>
              🎁 Mở Rương (${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)
            </button>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🆘 Cầu Viện Khảo Thí &amp; Đơn Cú</div>
          <div class="floo-sos-wrap">
            ${
              mySos
                ? `
                  <div class="nb-alert-banner ${mySos.rescuedAt ? 'ready' : ''}">
                    <span>${
                      mySos.rescuedAt
                        ? `🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Bạn HPVN')}</strong> đã cứu <strong>Màn ${mySos.stage}</strong>!`
                        : `🦉 Đang gọi cứu <strong>Màn ${mySos.stage}</strong>…`
                    }</span>
                    ${
                      mySos.rescuedAt
                        ? `<button id="btnNbClaimMySos" type="button" class="brass-btn gold-cta nb-mini-cta">🎉 Nhận</button>`
                        : ''
                    }
                  </div>
                `
                : `<div class="floo-muted-note">⚔️ Lượt nhận giải cứu hôm nay: ${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES}</div>`
            }
          </div>
          <div>
            <div class="floo-sub-heading">🦉 Đơn Cú Nhờ Bạn (${owlHelpLeft}/${MAX_DAILY_OWL_HELP_REQUESTS}):</div>
            <div class="nb-crate-list">${owlReqsHtml}</div>
          </div>
        </section>

        <section class="nb-panel-card">
          <div class="nb-section-title">🏮 Lời Chúc Khi Sang Chăm Giúp Vườn Bạn</div>
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
        : `<div class="nb-panel-card">Lưu bút Cổng Floo hiện đang trống.</div>`;

    bodyHtml = `<div class="nb-log-list">${logItemsHtml}</div>`;
  }

  box.innerHTML = `
    ${topStatsHtml}
    ${tabsHtml}
    ${bodyHtml}
  `;

  wireAvatarImgFallbacks(box);

  // Vẽ canvas Bưu Thiếp ngay khi đang ở tab Bưu Thiếp
  const postcardCanvas = box.querySelector('#flooPostcardCanvas') as HTMLCanvasElement | null;
  if (postcardCanvas) {
    renderValleyPostcardCanvas(hud.gameCanvas, buildPlayerPostcardMeta(hud), postcardCanvas);
  }

  box.querySelectorAll<HTMLButtonElement>('[data-nbtab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      hud.activeNeighborTab = btn.dataset.nbtab as 'friends' | 'postcard' | 'chest' | 'log';
      socialUiRenderNeighborDialog(hud);
    });
  });

  box.querySelector('#btnFlooOpenPostcardTab')?.addEventListener('click', () => {
    hud.activeNeighborTab = 'postcard';
    socialUiRenderNeighborDialog(hud);
  });

  box.querySelector('#btnFlooQuickInvite')?.addEventListener('click', () => {
    socialUiShareValleyToFloo(hud);
    socialUiRenderNeighborDialog(hud);
  });

  box.querySelector('#btnPostcardShareFloo')?.addEventListener('click', () => {
    socialUiShareValleyToFloo(hud);
    socialUiRenderNeighborDialog(hud);
  });

  box.querySelector('#btnPostcardDownload')?.addEventListener('click', () => {
    const card =
      (box.querySelector('#flooPostcardCanvas') as HTMLCanvasElement | null) ??
      renderValleyPostcardCanvas(hud.gameCanvas, buildPlayerPostcardMeta(hud));
    const webpUrl = valleyPostcardToWebpDataUrl(card, 0.72);
    if (webpUrl) {
      const a = document.createElement('a');
      a.href = webpUrl;
      a.download = `buu-thiep-hang-soc-lv${hud.sim.state.level}.${webpUrl.startsWith('data:image/webp') ? 'webp' : 'png'}`;
      a.click();
    }
    const bonus = hud.sim.recordFlooShareOrPostcard('postcard');
    hud.showToast(bonus.msg, '🖼️');
    socialUiRenderNeighborDialog(hud);
  });

  const idForm = box.querySelector('#frmFlooIdentityName') as HTMLFormElement | null;
  idForm?.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const inp = box.querySelector('#inpFlooDisplayName') as HTMLInputElement | null;
    const val = (inp?.value ?? '').trim().slice(0, 32);
    if (!val) return;
    social.playerDisplayName = val;
    hud.sim.saveToStorage();
    void socialUiRefreshFlooDirectory(hud, true);
    hud.showToast(`🔥 Đã cập nhật biệt danh Cổng Floo: "${val}"!`, '🔥');
    socialUiRenderNeighborDialog(hud);
  });

  box.querySelector('#btnFlooRefreshDir')?.addEventListener('click', () => {
    void socialUiRefreshFlooDirectory(hud, true);
  });

  box.querySelector('#btnFlooQuickJump')?.addEventListener('click', () => {
    const ordered = flooVisitOrder(hud.flooDirectoryRows, Date.now());
    if (ordered.length > 0) {
      socialUiEnterFlooMemberVisitFromHud(hud, ordered[0].uid, ordered);
    }
  });

  box.querySelectorAll<HTMLButtonElement>('[data-floo-portal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.dataset.flooPortal;
      if (!uid) return;
      const ordered = flooVisitOrder(hud.flooDirectoryRows, Date.now());
      socialUiEnterFlooMemberVisitFromHud(hud, uid, ordered);
    });
  });

  box.querySelectorAll<HTMLButtonElement>('[data-honor-tour]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tid = btn.dataset.honorTour;
      if (tid) socialUiEnterHonorTourFromHud(hud, tid);
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
