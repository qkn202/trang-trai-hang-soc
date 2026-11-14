// Tách tự động từ src/sim/simulation.ts (P0.2 — tách god file theo domain).
// Pattern delegation: hàm nhận `sim` để giữ nguyên state, không đổi hành vi gameplay.

import {
  computeRealTimeBuildSeconds,
  FARM_CROPS,
  FARM_GOODS,
  FARM_WORKSHOP_RECIPES,
  FarmWorkshopRecipe,
  formatDurationCompactVi,
  getCatalogItem,
  getFarmItemMeta,
  getMinRemainingBuildFloorSec,
  MINIGAME_CLEAR_REDUCTION_SEC,
  PASTURE_ANIMALS,
  TIME_SAND_SKIP_SECONDS,
} from '../data/catalog';
import {
  getLevelInfo,
  getLevelTrialRequirement,
  getNextLevelXp,
  getWinsRequiredForNextLevel,
  MAX_LEVEL,
} from '../data/levels';
import { HOUSES } from '../data/names';
import {
  createDailyQuests,
  createOwlOrderQuest,
  HARVEST_FEAST_TIERS,
  STORY_QUESTS,
  TUTORIAL_STEPS,
} from '../data/quests';
import {
  ActiveSynergyResult,
  CRAFT_RECIPES,
  CraftRecipeDef,
  createCargoCrates,
  createInitialSupplyState,
  DISTRICT_SYNERGIES,
  evaluateDistrictSynergies,
  RAW_INGREDIENTS_INFO,
} from '../data/synergiesAndSupply';
import {
  CREATURE_SPECIES_PROFILES,
  createInitialSuitcaseState,
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
  createInitialMatch3State,
  getExtraMovesGoldCost,
  getItemPuzzleStarCost,
  getMatch3LevelDef,
  getUpgradePuzzleStarCost,
  getZonePuzzleStarCost,
  HEART_REGEN_MS,
  MATCH3_BOOSTERS,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
  REFILL_HEARTS_GOLD_COST,
  TOTAL_MINIGAME_STAGES,
} from '../data/match3Levels';
import { getZoneAt, getZoneById, GRID_SIZE, ZONES } from '../data/zones';
import { MagicalAudio } from '../engine/audio';
import { findNextStepOnPaths, getRandomUnlockedPathTile } from '../engine/pathfinding';
import {
  BuildReductionResult,
  CatalogItem,
  CraftedGoodId,
  CreatureMorphVariant,
  EscapedCreatureEntity,
  FarmBarnState,
  FarmCropId,
  FarmGoodId,
  FarmItemId,
  FarmOwlOrder,
  FestivalType,
  FireworkBurst,
  FloatingEffect,
  FlooVisitDirectoryRow,
  FlyRewardKind,
  GameState,
  HarvestFeastState,
  HarvestFeastTierDef,
  HeatmapMode,
  HomeOwlLanternMark,
  HonorGardenTourDef,
  HouseName,
  IsoDirection,
  LanguageQuizState,
  LeaderboardGameId,
  LeaderboardRankChange,
  LeaderboardScope,
  LevelTrialRequirement,
  Match3BoosterId,
  MAX_STAFF_PER_ROLE,
  MinigameLeaderboardState,
  MinigameRescueContext,
  PastureAnimalId,
  MinigameTrialKind,
  NeighborGardenHelpKind,
  NeighborMinigameSos,
  NeighborPresetNoteId,
  NeighborProfileState,
  NeighborSocialState,
  OfflineReport,
  PlacedBuilding,
  PuzzleArcadeMode,
  QuestDef,
  QuestObjectiveType,
  RibbonUnveilCelebration,
  StaffEntity,
  SuitcaseExpeditionId,
  TileCell,
  TutorialState,
  TutorialStepDef,
  TutorialStepId,
  ValleyVillagerEntity,
  ValleyVillagerId,
  VerifiedRealPlayerProfile,
  WeatherForecastSlot,
  WeatherKind,
  ZoneId,
} from '../types/game';
import { buildSampleCoasterLoop, TrackWaypoint, traceCoasterCircuit } from './coaster';
import {
  buildHonorGardenSnapshot,
  buildNeighborValleySnapshot,
  CANON_NPC_NEIGHBOR_IDS,
  classifyBuildingGardenHelpKind,
  createFriendNeighborFromCode,
  createInitialNeighborSocialState,
  deduplicateNeighborProfiles,
  FRIENDSHIP_CHEST_TOKEN_COST,
  getGardenHelpMetaVi,
  getHonorGardenById,
  getLocalCalendarResetKey,
  getMinigameKindLabelVi,
  getPresetNoteMeta,
  HONOR_GARDENS,
  isPlaceholderOrSyntheticFriendCode,
  MAX_DAILY_FRIEND_HELPS,
  MAX_DAILY_MINIGAME_RESCUES,
  MAX_DAILY_OWL_HELP_REQUESTS,
  MAX_HOME_LANTERN_MARKS,
  normalizeDistinctPlayerNickname,
  normalizeSceneTimeOverride,
  normalizeSceneWeatherOverride,
  pickSimulatedHomeLanternMark,
  syncNeighborSocialDailyReset,
  upsertFlooMemberToNeighborProfile,
} from './neighborSocial';
import {
  buildAllPersonalRecordsSummary,
  buildMinigameLeaderboard,
  ensureMinigameLeaderboardState,
  getAllCachedCloudLeaderboards,
  getCachedCloudLeaderboardEntries,
  getClientLeaderboardUserId,
  getPlayerHogwartsHouse,
  HOGWARTS_HOUSE_META,
  isScoredLeaderboardGame,
  LeaderboardStandingResult,
  normalizeScoredLeaderboardGame,
  PersonalDisciplineSummaryRow,
  recordMinigameSessionResult,
  rollSortingHatHouse,
  setPlayerHogwartsHouse,
  submitPlayerCloudLeaderboardEntry,
} from './minigameLeaderboard';
import {
  createInitialPuzzleArcadeState,
  JIGSAW_PAINTINGS,
  PuzzleRewardSpec,
} from './puzzleShared';
import {
  ActiveQuizChallenge,
  createInitialLanguageQuizState,
  QuizAttemptOutcome,
  recordQuizAttempt,
  sanitizeLanguageQuizState,
} from './languageQuizEngine';
import {
  BackstageEvaluation,
  BiomeEvaluation,
  evaluateBackstageShielding,
  evaluateHabitatBiome,
  getBuildingGates,
  traceQueueSlots,
} from './zooAndBackstage';
import {
  FARM_HARVEST_CHEST_XP,
  MAX_PHOENIX_TALISMANS,
  CANON_OWL_SENDERS,
  clampFinite,
  createCanonFarmOwlOrder,
  createInitialFarmBarnState,
  createInitialGameState,
  createInitialHarvestFeastState,
  createInitialTutorialState,
  deltaToFacing,
  FIREWORK_COLORS,
  formatHarvestFeastRewardVi,
  getItemPriceBounds,
  getLocalDateKey,
  getUpgradeCost,
  migrateLoadedState,
  PHOENIX_FORGE_ELIGIBLE_GOODS,
  PHOENIX_FORGE_GOLD_COST,
  PLAYFUL_BREAKDOWNS,
  sanitizePlainText,
  sanitizeQuestList,
  SAVE_KEY,
  starIncomeMultiplier,
  VALLEY_VILLAGER_PROFILES,
} from './simulationData';
import type { ParkSimulation } from './simulation';

export function socialEnsureNeighborSocial(sim: ParkSimulation): NeighborSocialState {
    if (!sim.state.neighborSocial) {
      sim.state.neighborSocial = createInitialNeighborSocialState();
    }
    if (Array.isArray(sim.state.neighborSocial.neighbors)) {
      const ownUid = getClientLeaderboardUserId();
      const deduped = deduplicateNeighborProfiles(sim.state.neighborSocial.neighbors, {
        ownUid: ownUid !== 'local_player' ? ownUid : undefined,
        ownFriendCode: sim.state.neighborSocial.playerFriendCode,
        ownDisplayName: sim.state.neighborSocial.playerDisplayName,
      });
      if (deduped.length !== sim.state.neighborSocial.neighbors.length) {
        sim.state.neighborSocial.neighbors = deduped;
      } else {
        for (let i = 0; i < deduped.length; i++) {
          if (deduped[i] !== sim.state.neighborSocial.neighbors[i]) {
            sim.state.neighborSocial.neighbors = deduped;
            break;
          }
        }
      }
    } else {
      sim.state.neighborSocial.neighbors = [];
    }
    if (Array.isArray(sim.state.neighborSocial.homeLanternMarks)) {
      const cleanMarks = sim.state.neighborSocial.homeLanternMarks.filter(
        (m) => Boolean(m && !CANON_NPC_NEIGHBOR_IDS.has(m.helperId))
      );
      if (cleanMarks.length !== sim.state.neighborSocial.homeLanternMarks.length) {
        sim.state.neighborSocial.homeLanternMarks = cleanMarks;
      }
    }
    syncNeighborSocialDailyReset(sim.state.neighborSocial);
    if (sim.homeStateWhileVisiting) {
      sim.homeStateWhileVisiting.neighborSocial = sim.state.neighborSocial;
    }
    return sim.state.neighborSocial;
}

export function socialPushSocialActivity(sim: ParkSimulation, icon: string, textVi: string, now = Date.now()): void {
    const social = socialEnsureNeighborSocial(sim);
    social.activityLog = [
      {
        id: `slog_${now}_${Math.floor(Math.random() * 9999)}`,
        timestamp: now,
        icon,
        textVi,
      },
      ...social.activityLog,
    ].slice(0, 25);
}

export function socialGetActiveVisitingNeighbor(sim: ParkSimulation): NeighborProfileState | null {
    if (!sim.activeVisitNeighborId) return null;
    const social = socialEnsureNeighborSocial(sim);
    return social.neighbors.find((n) => n.id === sim.activeVisitNeighborId) ?? null;
}

export function socialGetHomeOwnerParkName(sim: ParkSimulation): string {
    return (sim.homeStateWhileVisiting ?? sim.state).parkName;
}

export function socialEnterNeighborVisit(sim: ParkSimulation, neighborId: string): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    if (sim.isHeadmasterPreview) {
      sim.toggleHeadmasterPreview();
    }
    const social = socialEnsureNeighborSocial(sim);
    const neighbor = social.neighbors.find((n) => n.id === neighborId);
    if (!neighbor) {
      return { ok: false, msg: 'Không tìm thấy thung lũng của người bạn này!' };
    }

    if (sim.homeStateWhileVisiting) {
      sim.syncPlayerPrimitivesToHomeState();
    } else {
      sim.homeStateWhileVisiting = sim.state;
    }

    const now = Date.now();
    const snap = buildNeighborValleySnapshot(neighbor, now);
    const homeBase = sim.homeStateWhileVisiting;
    const hostWeather = normalizeSceneWeatherOverride(neighbor.scene?.weather);
    const hostTime = normalizeSceneTimeOverride(neighbor.scene?.atmosphere);

    sim.activeHonorTourId = null;
    sim.activeVisitNeighborId = neighbor.id;
    sim.state = {
      ...homeBase,
      parkName: snap.neighbor.parkName,
      unlockedZones: snap.unlockedZones,
      buildings: snap.buildings,
      tileOverrides: snap.tileOverrides,
      settings: {
        ...homeBase.settings,
        weatherOverride: hostWeather ?? homeBase.settings.weatherOverride,
        timeOverride: hostTime ?? homeBase.settings.timeOverride,
      },
    };
    sim.escapedCreatures = [];
    sim.fireworks = [];
    sim.effects = [];
    sim.rideQueues.clear();
    sim.rebuildGrid();
    sim.syncStaffEntities();
    sim.syncValleyVillagers();
    sim.stateRevision++;

    sim.audio.playOwlHoot(0.035);
    const msg = `🔥 Bay Floo tới "${neighbor.parkName}" của ${neighbor.avatarEmoji} ${neighbor.name} (Cấp ${neighbor.level})!`;
    sim.onToast?.(msg, neighbor.avatarEmoji);
    sim.onUiChange?.();
    return { ok: true, msg, focusGx: snap.focusGx, focusGy: snap.focusGy };
}

export function socialExitNeighborVisit(sim: ParkSimulation, silent = false): {
    ok: boolean;
    focusGx: number;
    focusGy: number;
  } {
    if (!sim.homeStateWhileVisiting) {
      sim.activeVisitNeighborId = null;
      sim.activeHonorTourId = null;
      return { ok: false, focusGx: 18, focusGy: 22 };
    }
    sim.syncPlayerPrimitivesToHomeState();
    sim.state = sim.homeStateWhileVisiting;
    sim.homeStateWhileVisiting = null;
    sim.activeVisitNeighborId = null;
    sim.activeHonorTourId = null;

    sim.escapedCreatures = [];
    sim.fireworks = [];
    sim.effects = [];
    sim.rideQueues.clear();
    sim.rebuildGrid();
    sim.syncStaffEntities();
    sim.syncValleyVillagers();
    sim.stateRevision++;
    sim.saveToStorage();
    if (!silent) {
      sim.audio.playOwlHoot(0.03);
      sim.onToast?.('🏡 Đã quay về Trang Trại Hang Sóc thân yêu của bạn!', '🏡');
    }
    sim.onUiChange?.();
    return { ok: true, focusGx: 18, focusGy: 22 };
}

export function socialCycleNextNeighborVisit(sim: ParkSimulation): {
    ok: boolean;
    msg: string;
    focusGx?: number;
    focusGy?: number;
  } {
    const social = socialEnsureNeighborSocial(sim);
    if (social.neighbors.length === 0) {
      return { ok: false, msg: 'Chưa có hàng xóm trong danh bạ!' };
    }
    const curIdx = social.neighbors.findIndex((n) => n.id === sim.activeVisitNeighborId);
    const nextIdx = (curIdx + 1) % social.neighbors.length;
    return socialEnterNeighborVisit(sim, social.neighbors[nextIdx].id);
}

export function socialSetNeighborPresetNote(sim: ParkSimulation, noteId: NeighborPresetNoteId): void {
    const social = socialEnsureNeighborSocial(sim);
    social.selectedPresetNoteId = noteId;
    sim.saveToStorage();
    sim.onUiChange?.();
}

export function socialAddFriendByCode(sim: ParkSimulation, 
    rawCode: string,
    customName?: string,
    verifiedProfile?: VerifiedRealPlayerProfile
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } {
    const social = socialEnsureNeighborSocial(sim);
    const cleaned = (verifiedProfile?.friendCode || rawCode)
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '');
    if (cleaned.length < 4) {
      return { ok: false, msg: 'Mã Thung Lũng cần ít nhất 4 ký tự (ví dụ: HS-ABCD-12)!' };
    }
    if (cleaned === social.playerFriendCode.toUpperCase()) {
      return { ok: false, msg: 'Đây là Mã Thung Lũng của chính bạn rồi!' };
    }
    if (
      ['HS-HAGRID-01', 'HS-LUNA-02', 'HS-NEVILLE-03', 'HS-HERMIONE-04', 'HS-WEASLEY-05'].includes(
        cleaned
      )
    ) {
      return {
        ok: false,
        msg: 'Sổ Hàng Xóm chỉ kết nối với người chơi thật — không hỗ trợ thêm mã NPC!',
      };
    }
    const candidateNick = normalizeDistinctPlayerNickname(customName || verifiedProfile?.name);
    const existing = social.neighbors.find((n) => {
      if (n.friendCode.toUpperCase() === cleaned) return true;
      if (Boolean(verifiedProfile?.userId) && n.remoteUserId === verifiedProfile?.userId) return true;
      const exNick = normalizeDistinctPlayerNickname(n.name);
      return candidateNick !== null && exNick !== null && candidateNick === exNick;
    });
    if (existing) {
      if (verifiedProfile) {
        socialSyncVerifiedFriendSnapshot(sim, verifiedProfile);
      }
      return {
        ok: false,
        msg: `${existing.avatarEmoji} ${existing.name} (${existing.friendCode}) đã có trong Sổ Hàng Xóm rồi!`,
      };
    }
    if (social.neighbors.length >= 20) {
      return { ok: false, msg: 'Sổ Hàng Xóm hiện tối đa 20 người bạn thân thiết!' };
    }

    const now = Date.now();
    const created = createFriendNeighborFromCode(cleaned, customName, now, verifiedProfile);
    if (social.dailyRescuesGivenIds.includes(created.id) && created.minigameSos) {
      created.minigameSos.rescuedToday = true;
    }
    social.neighbors.push(created);
    socialPushSocialActivity(sim, 
      created.avatarEmoji,
      `Kết giao hàng xóm mới: ${created.name} (${created.friendCode})!`,
      now
    );
    sim.audio.playLevelUp();
    const msg = `🦉 Đã kết bạn với ${created.avatarEmoji} ${created.name} (${created.friendCode}) — ghé thăm vườn ngay nhé!`;
    sim.onToast?.(msg, '🤝');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg, neighbor: created };
}

export function socialAddVerifiedRealFriend(sim: ParkSimulation, 
    profile: VerifiedRealPlayerProfile,
    customName?: string
  ): { ok: boolean; msg: string; neighbor?: NeighborProfileState } {
    return socialAddFriendByCode(sim, profile.friendCode, customName, profile);
}

export function socialSyncVerifiedFriendSnapshot(sim: ParkSimulation, profile: VerifiedRealPlayerProfile): boolean {
    const social = socialEnsureNeighborSocial(sim);
    const norm = profile.friendCode.trim().toUpperCase();
    const nb = social.neighbors.find(
      (n) =>
        n.friendCode.toUpperCase() === norm ||
        (Boolean(profile.userId) && n.remoteUserId === profile.userId)
    );
    if (!nb) return false;
    nb.remoteUserId = profile.userId;
    nb.isVerifiedPlayer = true;
    nb.parkName = profile.parkName || nb.parkName;
    nb.level = Math.max(1, Math.min(100, Math.floor(profile.level || nb.level)));
    nb.house = profile.house || nb.house;
    if (profile.avatarEmoji) nb.avatarEmoji = profile.avatarEmoji;
    if (Array.isArray(profile.buildings) && profile.buildings.length > 0) {
      nb.valleyBuildings = profile.buildings;
    }
    if (profile.tileOverrides) {
      nb.valleyTileOverrides = profile.tileOverrides;
    }
    if (Array.isArray(profile.unlockedZones) && profile.unlockedZones.length > 0) {
      nb.valleyUnlockedZones = profile.unlockedZones;
    }
    sim.saveToStorage();
    return true;
}

export function socialRemoveNeighborFriend(sim: ParkSimulation, neighborId: string): { ok: boolean; msg: string } {
    const social = socialEnsureNeighborSocial(sim);
    const idx = social.neighbors.findIndex((n) => n.id === neighborId);
    if (idx === -1) {
      return { ok: false, msg: 'Không tìm thấy người bạn này trong Sổ Hàng Xóm!' };
    }
    const removed = social.neighbors[idx];
    if (sim.activeVisitNeighborId === removed.id) {
      socialExitNeighborVisit(sim, true);
    }
    social.neighbors.splice(idx, 1);
    const msg = `Đã xoá ${removed.name} (${removed.friendCode}) khỏi Sổ Hàng Xóm.`;
    socialPushSocialActivity(sim, '📋', msg, Date.now());
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialGetVisitedBuildingHelpStatus(sim: ParkSimulation, 
    b: PlacedBuilding,
    now = Date.now()
  ): {
    canHelp: boolean;
    kind: NeighborGardenHelpKind | null;
    existingMark?: NeighborProfileState['helpedMarksToday'][number];
  } {
    const social = socialEnsureNeighborSocial(sim);
    const nb = socialGetActiveVisitingNeighbor(sim);
    if (!nb) return { canHelp: false, kind: null };
    const existingMark = nb.helpedMarksToday.find((m) => m.buildingUid === b.uid);
    if (existingMark) {
      return { canHelp: false, kind: existingMark.kind, existingMark };
    }
    const totalGardenHelpsToday = Math.max(
      social.dailyGardenHelpsCount ?? 0,
      social.neighbors.reduce((s, n) => s + n.helpedMarksToday.length, 0)
    );
    if (
      totalGardenHelpsToday >= MAX_DAILY_FRIEND_HELPS ||
      nb.helpedMarksToday.length >= MAX_DAILY_FRIEND_HELPS
    ) {
      return { canHelp: false, kind: null };
    }
    const item = getCatalogItem(b.itemId);
    const kind = classifyBuildingGardenHelpKind(item, b, now);
    if (!kind) return { canHelp: false, kind: null };
    return { canHelp: true, kind };
}

export function socialHelpVisitedNeighborBuilding(sim: ParkSimulation, buildingUid: string): { ok: boolean; msg: string } {
    if (!sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy sang thăm vườn hàng xóm để trợ giúp nhé!' };
    }
    const social = socialEnsureNeighborSocial(sim);
    const nb = socialGetActiveVisitingNeighbor(sim);
    if (!nb) return { ok: false, msg: 'Không tìm thấy thông tin vườn bạn!' };

    const b = sim.state.buildings.find((x) => x.uid === buildingUid);
    if (!b) return { ok: false, msg: 'Không tìm thấy công trình để trợ giúp!' };
    if (nb.helpedMarksToday.some((m) => m.buildingUid === b.uid)) {
      return { ok: false, msg: 'Bạn đã để lại Dấu Ấn Cú Đưa Thư trên công trình này hôm nay rồi!' };
    }
    const totalGardenHelpsToday = Math.max(
      social.dailyGardenHelpsCount ?? 0,
      social.neighbors.reduce((s, n) => s + n.helpedMarksToday.length, 0)
    );
    if (
      totalGardenHelpsToday >= MAX_DAILY_FRIEND_HELPS ||
      nb.helpedMarksToday.length >= MAX_DAILY_FRIEND_HELPS
    ) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã dùng hết ${MAX_DAILY_FRIEND_HELPS}/${MAX_DAILY_FRIEND_HELPS} lượt hỗ trợ vườn bạn bè (chỉ reset khi qua ngày mới 00:00)!`,
      };
    }

    const now = Date.now();
    const item = getCatalogItem(b.itemId);
    const kind = classifyBuildingGardenHelpKind(item, b, now);
    if (!kind || !item) {
      return { ok: false, msg: 'Công trình này hiện không cần chăm sóc thêm!' };
    }

    const meta = getGardenHelpMetaVi(kind);
    const note = getPresetNoteMeta(social.selectedPresetNoteId);
    social.dailyGardenHelpsCount = totalGardenHelpsToday + 1;
    nb.helpedMarksToday.push({
      buildingUid: b.uid,
      kind,
      helperName: 'Bạn',
      noteId: note.id,
      noteText: note.textVi,
      helpedAt: now,
    });

    if (kind === 'water_crop' && b.cropReadyAt) {
      b.cropWateredBoost = true;
      b.cropReadyAt = Math.max(now + 30_000, b.cropReadyAt - 300_000);
    } else if (kind === 'stoke_workshop' && b.workshopQueue && b.workshopQueue.length > 0) {
      b.workshopQueue[0].endsAt = Math.max(now + 20_000, b.workshopQueue[0].endsAt - 180_000);
    }

    sim.state.galleons += meta.goldReward;
    sim.state.finance.harvestRevenue += meta.goldReward;
    social.friendshipTokens += 1;
    sim.addXp(meta.xpReward);
    sim.addHarvestFeastPoints(10);

    const cx = b.gx + item.width * 0.5;
    const cy = b.gy + item.height * 0.5;
    sim.audio.playHarvestBubble();
    sim.onBuildingTactile?.(b.uid);
    sim.onRewardFly?.('galleons', meta.goldReward, cx, cy);
    sim.spawnFloatingText(
      cx,
      cy,
      `${meta.icon} +${meta.goldReward}G  +${meta.xpReward} ⭐  +1 🍀`,
      '#fde047'
    );

    socialPushSocialActivity(sim, 
      meta.icon,
      `${meta.actionVi} "${item.name}" tại vườn ${nb.name} (+1 🍀, +${meta.goldReward}G)`,
      now
    );
    const msg = `🏮 Đã ${meta.actionVi.toLowerCase()} cho ${nb.name} kèm lời chúc "${note.shortVi}"! Nhận +1 🍀, +${meta.goldReward}G, +${meta.xpReward} XP!`;
    sim.onToast?.(msg, meta.icon);
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

function recordNeighborHelpStat(sim: ParkSimulation, amount = 1): void {
  sim.state.stats.neighborHelpsDone = Math.max(
    0,
    Math.floor(sim.state.stats.neighborHelpsDone ?? 0) + amount
  );
  sim.checkAndToastAchievements?.();
}

export function socialLikeVisitedNeighborFarm(sim: ParkSimulation, targetNeighborId?: string): { ok: boolean; msg: string } {
    const social = socialEnsureNeighborSocial(sim);
    const nid = targetNeighborId ?? sim.activeVisitNeighborId;
    if (!nid) return { ok: false, msg: 'Chưa chọn người bạn để thả tim!' };
    const nb = social.neighbors.find((n) => n.id === nid);
    if (!nb) return { ok: false, msg: 'Không tìm thấy hàng xóm này!' };
    if (social.dailyLikedNeighborIds.includes(nb.id)) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã thả ❤️ khen thung lũng của ${nb.name} rồi (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    social.dailyLikedNeighborIds.push(nb.id);
    nb.likesCount += 1;
    social.friendshipTokens += 1;
    sim.state.galleons += 4;
    sim.state.finance.harvestRevenue += 4;
    sim.addXp(10);

    sim.audio.playMatchPop(1);
    if (sim.isVisitingNeighbor && sim.activeVisitNeighborId === nb.id) {
      sim.spawnFloatingText(15, 19, '❤️ Tuyệt đẹp! +4G +1 🍀', '#fb7185');
    }
    socialPushSocialActivity(sim, '❤️', `Thả tim khen "${nb.parkName}" của ${nb.name} (+1 🍀, +4G)`, now);
    const msg = `❤️ Đã gửi tim khen ngợi "${nb.parkName}"! Nhận +1 🍀 Huy Hiệu Tình Bạn, +4G & +10 XP!`;
    sim.onToast?.(msg, '❤️');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialCanClaimVisitedMysteryGift(sim: ParkSimulation): boolean {
    const social = socialEnsureNeighborSocial(sim);
    const nb = socialGetActiveVisitingNeighbor(sim);
    if (!nb) return false;
    return !social.dailyMysteryClaimedIds.includes(nb.id);
}

export function socialClaimVisitedNeighborMysteryGift(sim: ParkSimulation): { ok: boolean; msg: string } {
    if (!sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy ghé thăm thung lũng hàng xóm để mở Giỏ Quà Bí Ẩn nhé!' };
    }
    const social = socialEnsureNeighborSocial(sim);
    const nb = socialGetActiveVisitingNeighbor(sim);
    if (!nb) return { ok: false, msg: 'Không tìm thấy vườn hàng xóm!' };
    if (social.dailyMysteryClaimedIds.includes(nb.id)) {
      return {
        ok: false,
        msg: `Bạn đã mở Giỏ Quà Bí Ẩn hôm nay tại vườn của ${nb.name} rồi (1 lần/ngày/bạn)!`,
      };
    }

    const now = Date.now();
    social.dailyMysteryClaimedIds.push(nb.id);
    const gold = 10;
    const xp = 18;
    sim.state.galleons += gold;
    sim.state.finance.harvestRevenue += gold;
    social.friendshipTokens += 1;
    sim.addXp(xp);

    // Bonus seed or Time Sand!
    const giveSand = social.dailyMysteryClaimedIds.length % 3 === 0;
    let bonusLabel = '';
    if (giveSand) {
      sim.state.timeSand += 1;
      bonusLabel = ' +1 ⏳ Cát Xoay';
      sim.onRewardFly?.('sand', 1, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
    } else {
      const seedPool: FarmCropId[] = [
        'ruby_strawberry',
        'english_rose',
        'rainbow_tulip',
        'garden_pumpkin',
        'dried_lavender',
        'meadow_daisy',
      ];
      const pickSeed = seedPool[social.dailyMysteryClaimedIds.length % seedPool.length];
      sim.addCropSeeds(pickSeed, 1);
      bonusLabel = ` +1 hạt ${FARM_CROPS[pickSeed].emoji} ${FARM_CROPS[pickSeed].name}`;
    }

    sim.audio.playLevelUp();
    sim.onRewardFly?.('galleons', gold, nb.mysteryGiftGx + 0.5, nb.mysteryGiftGy + 0.5);
    sim.spawnFloatingText(
      nb.mysteryGiftGx + 0.5,
      nb.mysteryGiftGy + 0.5,
      `🎁 +${gold}G +1 🍀${bonusLabel}`,
      '#fde047'
    );
    socialPushSocialActivity(sim, 
      '🎁',
      `Tìm thấy Giỏ Quà Bí Ẩn tại vườn ${nb.name} (+1 🍀, +${gold}G${bonusLabel})`,
      now
    );
    const msg = `🎁 Mở Giỏ Quà Bí Ẩn tại vườn ${nb.name}: Nhận +1 🍀, +${gold}G, +${xp} XP &${bonusLabel}!`;
    sim.onToast?.(msg, '🎁');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialFulfillNeighborOwlCrate(sim: ParkSimulation, 
    neighborId: string,
    crateId: string
  ): { ok: boolean; msg: string } {
    const social = socialEnsureNeighborSocial(sim);
    const nb = social.neighbors.find((n) => n.id === neighborId);
    if (!nb) return { ok: false, msg: 'Không tìm thấy hàng xóm này!' };
    const crate = nb.owlHelpCrates.find((c) => c.id === crateId);
    if (!crate) return { ok: false, msg: 'Không tìm thấy kiện hàng Đơn Cú này!' };
    if (crate.fulfilledByPlayerToday) {
      return { ok: false, msg: 'Bạn đã đóng giúp kiện hàng này hôm nay rồi!' };
    }

    const meta = getFarmItemMeta(crate.itemId);
    if (!sim.state.sandboxMode) {
      const have = sim.getFarmItemCount(crate.itemId);
      if (have < crate.qty) {
        return {
          ok: false,
          msg: `Kho Nông Sản của bạn còn thiếu ${crate.qty - have} ${meta.emoji} ${meta.name} để đóng hộ ${nb.name}!`,
        };
      }
      sim.consumeFarmItemFromBarn(crate.itemId, crate.qty);
    }

    const now = Date.now();
    crate.fulfilledByPlayerToday = true;
    sim.state.galleons += crate.rewardGalleons;
    sim.state.finance.shopRevenue += crate.rewardGalleons;
    social.friendshipTokens += crate.rewardTokens;
    sim.addXp(crate.rewardXp);

    sim.audio.playOwlHoot(0.04);
    sim.audio.playHarvestBubble();
    sim.onRewardFly?.('galleons', crate.rewardGalleons);
    socialPushSocialActivity(sim, 
      '📦',
      `Đóng hộ ${crate.qty} ${meta.emoji} ${meta.name} trên Đơn Cú của ${nb.name} (+${crate.rewardTokens} 🍀, +${crate.rewardGalleons}G)`,
      now
    );
    const msg = `📦 Đã đóng hộ ${crate.qty} ${meta.emoji} ${meta.name} giúp ${nb.name}! Nhận +${crate.rewardTokens} 🍀, +${crate.rewardGalleons}G & +${crate.rewardXp} XP!`;
    sim.onToast?.(msg, '🦉');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialCanRescueNeighborMinigame(sim: ParkSimulation, neighborId: string): {
    ok: boolean;
    reason?: string;
    sos?: NeighborMinigameSos;
    neighbor?: NeighborProfileState;
  } {
    const social = socialEnsureNeighborSocial(sim);
    const nb = social.neighbors.find((n) => n.id === neighborId);
    if (!nb || !nb.minigameSos) {
      return { ok: false, reason: 'Người bạn này hiện không có màn khó cần giải cứu!' };
    }
    if (nb.minigameSos.rescuedToday || social.dailyRescuesGivenIds.includes(nb.id)) {
      return {
        ok: false,
        reason: `Bạn đã giải cứu khảo thí phép thuật cho ${nb.name} hôm nay rồi (1 lần/ngày/bạn — reset lúc 00:00)!`,
      };
    }
    if (social.dailyRescuesGivenIds.length >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        reason: `Hôm nay bạn đã dùng hết ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt Giải Cứu Bạn Bè (reset lúc 00:00)!`,
      };
    }
    return { ok: true, sos: nb.minigameSos, neighbor: nb };
}

export function socialCompleteNeighborMinigameRescue(sim: ParkSimulation, ctx: MinigameRescueContext): {
    ok: boolean;
    msg: string;
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } {
    const social = socialEnsureNeighborSocial(sim);
    const check = socialCanRescueNeighborMinigame(sim, ctx.neighborId);
    if (!check.ok || !check.neighbor || !check.sos) {
      return {
        ok: false,
        msg: check.reason ?? 'Lượt giải cứu này đã hoàn tất trước đó!',
        tokensEarned: 0,
        goldEarned: 0,
        xpEarned: 0,
      };
    }

    const now = Date.now();
    const nb = check.neighbor;
    check.sos.rescuedToday = true;
    if (!social.dailyRescuesGivenIds.includes(nb.id)) {
      social.dailyRescuesGivenIds.push(nb.id);
    }

    const tokensEarned = 3;
    const goldEarned = 95;
    const xpEarned = 45;
    social.friendshipTokens += tokensEarned;
    sim.state.galleons += goldEarned;
    sim.state.finance.harvestRevenue += goldEarned;
    sim.addXp(xpEarned);
    const buildReduction = sim.applyConstructionReductionFromGameplay(
      MINIGAME_CLEAR_REDUCTION_SEC,
      'Giải Cứu Bạn Bè'
    );
    const buildMsg =
      buildReduction.reducedSec > 0
        ? ` • 🔨 -${formatDurationCompactVi(buildReduction.reducedSec)} xây ${buildReduction.targetName ?? 'công trình'}`
        : '';

    const kindMeta = getMinigameKindLabelVi(ctx.kind);
    sim.audio.playLevelUp();
    sim.onRewardFly?.('galleons', goldEarned);
    socialPushSocialActivity(sim, 
      '⚔️',
      `Giải cứu thành công ${kindMeta.icon} ${kindMeta.nameVi} (Màn ${ctx.stage}) cho ${nb.name} (+${tokensEarned} 🍀, +${goldEarned}G)`,
      now
    );
    const msg = `🏆 Tuyệt đỉnh! Bạn đã vượt hộ ${kindMeta.nameVi} Màn ${ctx.stage} giúp ${nb.avatarEmoji} ${nb.name}! Nhận +${tokensEarned} 🍀, +${goldEarned}G & +${xpEarned} XP${buildMsg}!`;
    sim.onToast?.(msg, '🏆');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg, tokensEarned, goldEarned, xpEarned, buildReduction };
}

export function socialOpenFriendshipChest(sim: ParkSimulation): {
    ok: boolean;
    msg: string;
    starsEarned: number;
    talismanEarned: number;
    sandEarned: number;
    goldEarned: number;
    seedCropId?: FarmCropId;
    seedQty?: number;
  } {
    const social = socialEnsureNeighborSocial(sim);
    if (social.friendshipTokens < FRIENDSHIP_CHEST_TOKEN_COST) {
      return {
        ok: false,
        msg: `Cần ${FRIENDSHIP_CHEST_TOKEN_COST} 🍀 Huy Hiệu Tình Bạn để mở Rương Quà (hiện có ${social.friendshipTokens}/${FRIENDSHIP_CHEST_TOKEN_COST} 🍀)!`,
        starsEarned: 0,
        talismanEarned: 0,
        sandEarned: 0,
        goldEarned: 0,
      };
    }

    const now = Date.now();
    social.friendshipTokens -= FRIENDSHIP_CHEST_TOKEN_COST;
    social.chestsOpened += 1;

    const starsEarned = 2;
    const goldEarned = 30;
    const xpEarned = 40;
    sim.state.match3.stars += starsEarned;
    sim.state.match3.totalStarsEarned += starsEarned;
    sim.state.galleons += goldEarned;
    sim.state.finance.harvestRevenue += goldEarned;
    sim.addXp(xpEarned);

    const talismanEarned = sim.grantPhoenixTalisman(1);
    let sandEarned = 0;
    if (talismanEarned === 0) {
      sandEarned = 2;
      sim.state.timeSand += sandEarned;
    }

    const rareSeeds: FarmCropId[] = [
      'baby_mandrake',
      'moonlight_flower',
      'phoenix_fireflower',
      'blush_peony',
      'glow_mushroom',
      'dried_lavender',
      'english_rose',
    ];
    const unlockedSeeds = rareSeeds.filter(
      (cid) => FARM_CROPS[cid].unlockLevel <= Math.max(5, sim.state.level)
    );
    const seedCropId =
      (unlockedSeeds.length > 0 ? unlockedSeeds : (['ruby_strawberry'] as FarmCropId[]))[
        social.chestsOpened % Math.max(1, unlockedSeeds.length)
      ] ?? 'ruby_strawberry';
    const seedQty = 2;
    sim.addCropSeeds(seedCropId, seedQty);
    const cropMeta = FARM_CROPS[seedCropId];

    sim.audio.playLevelUp();
    sim.launchFireworksShow(8);
    sim.onRewardFly?.('stars', starsEarned);
    sim.onRewardFly?.('galleons', goldEarned);

    const relicPart =
      talismanEarned > 0 ? `+${talismanEarned} 🔥 Bùa Phượng Hoàng` : `+${sandEarned} ⏳ Cát Xoay`;
    const msg = `🎁 Mở Rương Quà Tình Bạn #${social.chestsOpened}: Nhận +${starsEarned} 🌟 Sao Phép Thuật, ${relicPart}, +${seedQty} hạt ${cropMeta.emoji} ${cropMeta.name} & +${goldEarned}G!`;
    socialPushSocialActivity(sim, '🎁', msg, now);
    sim.onToast?.(msg, '🎁');
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg,
      starsEarned,
      talismanEarned,
      sandEarned,
      goldEarned,
      seedCropId,
      seedQty,
    };
}

export function socialClaimHomeLanternMark(sim: ParkSimulation, markIdOrBuildingUid: string): { ok: boolean; msg: string } {
    if (sim.isVisitingNeighbor) {
      return { ok: false, msg: 'Hãy quay về vườn nhà Hang Sóc để nhận quà Cú Đưa Thư nhé!' };
    }
    const social = socialEnsureNeighborSocial(sim);
    if ((social.dailyHomeLanternsClaimedCount ?? 0) >= MAX_HOME_LANTERN_MARKS) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã nhận đủ ${MAX_HOME_LANTERN_MARKS}/${MAX_HOME_LANTERN_MARKS} lượt bạn bè hỗ trợ vườn nhà (chỉ reset khi qua ngày mới 00:00)!`,
      };
    }
    const idx = social.homeLanternMarks.findIndex(
      (m) => m.id === markIdOrBuildingUid || m.buildingUid === markIdOrBuildingUid
    );
    if (idx === -1) {
      return { ok: false, msg: 'Dấu ấn Cú Đưa Thư này đã được nhận rồi!' };
    }

    const now = Date.now();
    const mark = social.homeLanternMarks[idx];
    social.homeLanternMarks.splice(idx, 1);
    social.dailyHomeLanternsClaimedCount = (social.dailyHomeLanternsClaimedCount ?? 0) + 1;

    const b = sim.state.buildings.find((x) => x.uid === mark.buildingUid);
    const item = b ? getCatalogItem(b.itemId) : undefined;
    let effectTag = '';

    if (b && item) {
      if (item.isFarmlandPlot && b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
        const left = b.cropReadyAt - now;
        b.cropReadyAt = Math.max(now + 1000, b.cropReadyAt - Math.max(8000, Math.round(left * 0.45)));
        b.cropWateredBoost = true;
        effectTag = ' • Cây lớn vọt +45%!';
      } else if (b.workshopQueue && b.workshopQueue.length > 0) {
        const left = Math.max(0, b.workshopQueue[0].endsAt - now);
        const cut = Math.max(10_000, Math.round(left * 0.4));
        b.workshopQueue[0].endsAt = Math.max(now + 500, b.workshopQueue[0].endsAt - cut);
        effectTag = ' • Lò nhanh hơn +40%!';
      } else if (item.cycleSec > 0 && item.baseIncome > 0) {
        const prod = sim.getBuildingProductionPerCycle(b, item);
        b.readyBubbles = Math.min(8, b.readyBubbles + 1);
        b.storedGalleons += prod.galleons;
        b.storedXp += prod.xp;
        effectTag = ' • Tặng +1 mẻ thu hoạch sẵn!';
      }
      sim.onBuildingTactile?.(b.uid);
      sim.spawnFloatingText(
        b.gx + item.width * 0.5,
        b.gy + item.height * 0.5,
        `🏮 ${mark.helperEmoji} +4G +1 🍀`,
        '#fde047'
      );
    }

    sim.state.galleons += 4;
    sim.state.finance.harvestRevenue += 4;
    social.friendshipTokens += 1;
    sim.addXp(12);
    sim.tickProductionToTimestamp(now, true);

    sim.audio.playHarvestBubble();
    const msg = `🏮 ${mark.helperEmoji} ${mark.helperName} nhắn: "${mark.noteVi}"${effectTag} (+1 🍀, +4G, +12 XP)`;
    socialPushSocialActivity(sim, 
      '🏮',
      `Nhận Dấu Ấn Cú Đưa Thư từ ${mark.helperName}${effectTag} (+1 🍀, +4G)`,
      now
    );
    sim.onToast?.(msg, '🏮');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialRequestPlayerOwlCrateHelp(sim: ParkSimulation, 
    orderId: string,
    reqIndex: number
  ): { ok: boolean; msg: string } {
    const social = socialEnsureNeighborSocial(sim);
    if (social.neighbors.length === 0) {
      return {
        ok: false,
        msg: 'Chưa có thành viên cộng đồng nào trong danh bạ Cổng Floo! Hãy mở Cổng Floo & Hàng Xóm (Cấp 10+) để kết nối thành viên HPVN nhé.',
      };
    }
    const barn = sim.ensureFarmBarn();
    const order = barn.owlOrders.find((o) => o.id === orderId);
    if (!order || !order.requirements[reqIndex]) {
      return { ok: false, msg: 'Không tìm thấy kiện hàng Đơn Cú cần nhờ giúp!' };
    }
    const existing = sim.getOwlRequirementHelpState(orderId, reqIndex);
    if (existing) {
      return {
        ok: false,
        msg: existing.fulfilledAt
          ? `${existing.helperEmoji ?? '🦉'} ${existing.helperName ?? 'Hàng xóm'} đã đóng xong kiện này rồi!`
          : 'Kiện hàng này đang chờ Cú Đưa Thư gọi bạn bè tới đóng phụ!',
      };
    }
    if (social.dailyOwlHelpRequestedCount >= MAX_DAILY_OWL_HELP_REQUESTS) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã gửi tối đa ${MAX_DAILY_OWL_HELP_REQUESTS}/${MAX_DAILY_OWL_HELP_REQUESTS} thư nhờ đóng Đơn Cú (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    const req = order.requirements[reqIndex];
    const meta = getFarmItemMeta(req.itemId);
    social.dailyOwlHelpRequestedCount += 1;
    social.playerOwlHelpRequests.push({
      orderId,
      reqIndex,
      itemId: req.itemId,
      qty: req.qty,
      requestedAt: now,
    });

    sim.audio.playOwlHoot(0.04);
    const msg = `🦉 Đã treo biển nhờ bạn bè đóng hộ ${req.qty} ${meta.emoji} ${meta.name} (${social.dailyOwlHelpRequestedCount}/${MAX_DAILY_OWL_HELP_REQUESTS} hôm nay)!`;
    socialPushSocialActivity(sim, '🦉', msg, now);
    sim.onToast?.(msg, '🤝');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialRequestPlayerMinigameSos(sim: ParkSimulation, 
    kind: MinigameTrialKind,
    stage: number
  ): { ok: boolean; msg: string } {
    const social = socialEnsureNeighborSocial(sim);
    if (social.neighbors.length === 0) {
      return {
        ok: false,
        msg: 'Chưa có thành viên cộng đồng nào trong danh bạ Cổng Floo! Hãy mở Cổng Floo & Hàng Xóm (Cấp 10+) để kết nối thành viên HPVN nhé.',
      };
    }
    const cleanStage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.round(stage)));

    if (social.playerMinigameSos && !social.playerMinigameSos.claimed) {
      if (
        social.playerMinigameSos.kind === kind &&
        social.playerMinigameSos.stage === cleanStage
      ) {
        return {
          ok: false,
          msg: social.playerMinigameSos.rescuedAt
            ? `🎉 ${social.playerMinigameSos.rescuerName ?? 'Hàng xóm'} đã vượt hộ màn này rồi — bấm "Nhận Qua Màn Ngay" nhé!`
            : '🦉 Thư cầu viện Cú Đưa Thư đang bay tới hội bạn bè, chờ vài giây nhé!',
        };
      }
      // Cho phép chuyển mục tiêu cầu viện nếu màn trước chưa nhận
      if (social.playerMinigameSos.rescuedAt) {
        return {
          ok: false,
          msg: `Bạn đang có Màn ${social.playerMinigameSos.stage} đã được bạn bè giải cứu sẵn — hãy bấm nhận trước khi gửi thư mới nhé!`,
        };
      }
    }

    if (social.dailyRescuesReceivedCount >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã nhận đủ ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt Bạn Bè Giải Cứu Màn Khó (reset lúc 00:00)!`,
      };
    }

    const now = Date.now();
    const kindMeta = getMinigameKindLabelVi(kind);
    social.playerMinigameSos = {
      id: `psos_${now}`,
      kind,
      stage: cleanStage,
      requestedAt: now,
      claimed: false,
    };

    sim.audio.playOwlHoot(0.045);
    const msg = `🆘 Đã bắn pháo hiệu Cú Đưa Thư nhờ bạn bè vượt hộ ${kindMeta.icon} ${kindMeta.nameVi} — Màn ${cleanStage} (${social.dailyRescuesReceivedCount}/${MAX_DAILY_MINIGAME_RESCUES} lượt nhận hôm nay)!`;
    socialPushSocialActivity(sim, '🆘', msg, now);
    sim.onToast?.(msg, '🆘');
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg };
}

export function socialClaimPlayerMinigameSosRescue(sim: ParkSimulation): {
    ok: boolean;
    msg: string;
    kind?: MinigameTrialKind;
    clearedStage?: number;
    nextStage?: number;
    ghostReplaySummaryVi?: string;
    ghostReplayMoves?: string[];
  } {
    const social = socialEnsureNeighborSocial(sim);
    const sos = social.playerMinigameSos;
    if (!sos || sos.claimed) {
      return { ok: false, msg: 'Hiện không có màn cầu viện nào chờ nhận!' };
    }
    if (!sos.rescuedAt) {
      return { ok: false, msg: 'Hàng xóm đang vào bàn đấu giải cứu màn này cho bạn — chờ chút nhé!' };
    }
    if (social.dailyRescuesReceivedCount >= MAX_DAILY_MINIGAME_RESCUES) {
      return {
        ok: false,
        msg: `Hôm nay bạn đã nhận tối đa ${MAX_DAILY_MINIGAME_RESCUES}/${MAX_DAILY_MINIGAME_RESCUES} lượt giải cứu rồi!`,
      };
    }

    const now = Date.now();
    const kind = sos.kind;
    const stage = sos.stage;
    const rescuerLabel = `${sos.rescuerEmoji ?? '🦉'} ${sos.rescuerName ?? 'Hàng xóm'}`;
    const kindMeta = getMinigameKindLabelVi(kind);
    const ghostReplaySummaryVi =
      sos.ghostReplaySummaryVi ||
      `👻 Linh ảnh giải cứu: Khai triển Bùa Phượng Hoàng phá thế bế tắc Màn ${stage}!`;
    const ghostReplayMoves = sos.ghostReplayMoves ?? [
      `Nước #4: Mở khóa trung tâm Màn ${stage}`,
      `Nước #9: Kích hoạt chuỗi liên hoàn`,
      `Nước kết: Bùa Phượng Hoàng dứt điểm`,
    ];

    sos.claimed = true;
    social.playerMinigameSos = null;
    social.dailyRescuesReceivedCount += 1;

    let nextStage = stage + 1;
    if (kind === 'match3') {
      if ((sim.state.match3.currentLevel ?? 1) === stage) {
        const res = sim.completeMatch3LevelVictory(0);
        nextStage = res.nextLevel;
      } else {
        sim.state.galleons += 35;
        sim.addXp(15);
        nextStage = sim.state.match3.currentLevel;
      }
    } else {
      const info = sim.getDisciplineStageInfo(kind);
      if (info.currentStage === stage) {
        const res = sim.completePuzzleArcadeVictory(kind, {
          stars: 1,
          gold: 48,
          xp: 24,
          sand: 0,
        });
        nextStage = res.nextStage;
      } else {
        sim.state.galleons += 35;
        sim.addXp(15);
        nextStage = info.currentStage;
      }
    }

    sim.launchFireworksShow(6);
    const msg = `🎉 ${rescuerLabel} đã phá đảo hộ ${kindMeta.icon} ${kindMeta.nameVi} Màn ${stage} — mở khóa Màn ${nextStage}! (${ghostReplaySummaryVi})`;
    socialPushSocialActivity(sim, '🎉', msg, now);
    sim.onToast?.(msg, '🎉');
    sim.saveToStorage();
    sim.onUiChange?.();
    return {
      ok: true,
      msg,
      kind,
      clearedStage: stage,
      nextStage,
      ghostReplaySummaryVi,
      ghostReplayMoves,
    };
}

export function socialTickNeighborSocialBackground(sim: ParkSimulation, now = Date.now()): void {
    const social = socialEnsureNeighborSocial(sim);
    let changed = false;

    // 1. Hàng xóm phản hồi thư cầu viện "🆘 Nhờ Bạn Qua Màn" sau ~5.5 giây
    if (
      social.playerMinigameSos &&
      !social.playerMinigameSos.rescuedAt &&
      !social.playerMinigameSos.claimed &&
      now - social.playerMinigameSos.requestedAt >= 5500 &&
      social.neighbors.length > 0
    ) {
      const pickIdx = Math.abs(Math.floor(social.playerMinigameSos.requestedAt / 1000)) % social.neighbors.length;
      const helper = social.neighbors[pickIdx];
      const kindMeta = getMinigameKindLabelVi(social.playerMinigameSos.kind);
      const stg = social.playerMinigameSos.stage;
      const movesUsed = 11 + (stg % 9);
      social.playerMinigameSos.rescuedAt = now;
      social.playerMinigameSos.rescuerId = helper.id;
      social.playerMinigameSos.rescuerName = helper.name;
      social.playerMinigameSos.rescuerEmoji = helper.avatarEmoji;
      social.playerMinigameSos.rescuerNoteVi = `Mình vừa giải xong Màn ${stg} (${kindMeta.nameVi}) giúp bồ rồi nè!`;
      social.playerMinigameSos.ghostReplaySummaryVi = `👻 Linh ảnh ${helper.name}: Phá đảo Màn ${stg} ở nước #${movesUsed} bằng chuỗi liên hoàn!`;
      social.playerMinigameSos.ghostReplayMoves = [
        `Nước #3: Mở khóa ô trung tâm Màn ${stg}`,
        `Nước #${movesUsed - 3}: Tạo combo phá chướng ngại`,
        `Nước #${movesUsed}: Dứt điểm hoàn hảo!`,
      ];
      sim.audio.playOwlHoot(0.045);
      socialPushSocialActivity(sim, 
        helper.avatarEmoji,
        `${helper.name} vừa giải cứu xong ${kindMeta.icon} Màn ${social.playerMinigameSos.stage} giúp bạn — vào nhận ngay!`,
        now
      );
      sim.onToast?.(
        `🦉 ${helper.avatarEmoji} ${helper.name} vừa vượt hộ ${kindMeta.nameVi} Màn ${social.playerMinigameSos.stage}! Bấm nhận qua màn ngay!`,
        '🎉'
      );
      changed = true;
    }

    // 2. Hàng xóm đóng hộ kiện hàng Đơn Cú sau ~5 giây
    for (const req of social.playerOwlHelpRequests) {
      if (!req.fulfilledAt && now - req.requestedAt >= 5000 && social.neighbors.length > 0) {
        const pickIdx = Math.abs(req.reqIndex + Math.floor(req.requestedAt / 1000)) % social.neighbors.length;
        const helper = social.neighbors[pickIdx];
        const meta = getFarmItemMeta(req.itemId);
        req.fulfilledAt = now;
        req.helperName = helper.name;
        req.helperEmoji = helper.avatarEmoji;
        sim.audio.playOwlHoot(0.04);
        socialPushSocialActivity(sim, 
          helper.avatarEmoji,
          `${helper.name} đã đóng hộ ${req.qty} ${meta.emoji} ${meta.name} vào Đơn Cú giúp bạn!`,
          now
        );
        sim.onToast?.(
          `🦉 ${helper.avatarEmoji} ${helper.name} vừa đóng hộ ${req.qty} ${meta.emoji} ${meta.name} cho Đơn Cú của bạn!`,
          '📦'
        );
        changed = true;
      }
    }

    // 3. Thỉnh thoảng bạn bè ghé thăm vườn nhà để lại Dấu Ấn Đèn Lồng Cú (tối đa 5 lần/ngày, không reset trước ngày mới)
    const totalHomeLanternsToday =
      Math.max(0, social.dailyHomeLanternsClaimedCount ?? 0) + social.homeLanternMarks.length;
    if (
      !sim.isVisitingNeighbor &&
      social.homeLanternMarks.length < 3 &&
      totalHomeLanternsToday < MAX_HOME_LANTERN_MARKS
    ) {
      const youngestMarkAt = social.homeLanternMarks.reduce(
        (mx, m) => Math.max(mx, m.createdAt),
        0
      );
      if (now - youngestMarkAt >= 48_000) {
        const newMark = pickSimulatedHomeLanternMark(social, sim.state.buildings, now);
        if (newMark) {
          social.homeLanternMarks.push(newMark);
          changed = true;
        }
      }
    }

    if (changed) {
      sim.saveToStorage();
      sim.onUiChange?.();
    }
}

// =========================================================================
// HAGRIDFARM / HPVN FLOO COMMUNITY DIRECTORY, 1-TAP HELP, POSTCARD & HONOR TOURS
// =========================================================================

export function socialGetActiveHonorGardenTour(sim: ParkSimulation): HonorGardenTourDef | null {
  if (!sim.activeHonorTourId) return null;
  return getHonorGardenById(sim.activeHonorTourId);
}

export function socialEnterHonorGardenTour(
  sim: ParkSimulation,
  tourId = 'tour_hagrid'
): {
  ok: boolean;
  msg: string;
  focusGx?: number;
  focusGy?: number;
} {
  if (sim.isHeadmasterPreview) {
    sim.toggleHeadmasterPreview();
  }
  const now = Date.now();
  const snap = buildHonorGardenSnapshot(tourId, now);
  if (!snap) {
    return { ok: false, msg: 'Không tìm thấy Vườn Mẫu Danh Dự này!' };
  }

  const social = socialEnsureNeighborSocial(sim);
  if (sim.homeStateWhileVisiting) {
    sim.syncPlayerPrimitivesToHomeState();
  } else {
    sim.homeStateWhileVisiting = sim.state;
  }

  const homeBase = sim.homeStateWhileVisiting;
  sim.activeVisitNeighborId = null;
  sim.activeHonorTourId = snap.tour.id;
  sim.state = {
    ...homeBase,
    parkName: `${snap.tour.titleVi} (${snap.tour.ownerName})`,
    unlockedZones: snap.unlockedZones,
    buildings: snap.buildings,
    tileOverrides: snap.tileOverrides,
    settings: {
      ...homeBase.settings,
      weatherOverride: snap.tour.weather,
      timeOverride: snap.tour.atmosphere,
    },
  };
  sim.escapedCreatures = [];
  sim.fireworks = [];
  sim.effects = [];
  sim.rideQueues.clear();
  sim.rebuildGrid();
  sim.syncStaffEntities();
  sim.syncValleyVillagers();
  sim.stateRevision++;

  let bonusSuffix = '';
  if (!social.dailyHonorTourClaimed) {
    social.dailyHonorTourClaimed = true;
    sim.state.galleons += 8;
    sim.state.finance.harvestRevenue += 8;
    sim.addXp(15);
    sim.addHarvestFeastPoints(8);
    bonusSuffix = ' · Quà tham quan đầu ngày: +8G +15 XP!';
    socialPushSocialActivity(
      sim,
      snap.tour.avatarEmoji,
      `Tham quan Vườn Mẫu "${snap.tour.titleVi}" (+8G, +15 XP)`,
      now
    );
  }

  sim.audio.playOwlHoot(0.035);
  const msg = `🏛️ Đang tham quan "${snap.tour.titleVi}" của ${snap.tour.avatarEmoji} ${snap.tour.ownerName}${bonusSuffix}`;
  sim.onToast?.(msg, snap.tour.avatarEmoji);
  sim.saveToStorage();
  sim.onUiChange?.();
  return { ok: true, msg, focusGx: snap.focusGx, focusGy: snap.focusGy };
}

export function socialCycleHonorGardenTour(
  sim: ParkSimulation,
  dir: 1 | -1 = 1
): {
  ok: boolean;
  msg: string;
  focusGx?: number;
  focusGy?: number;
} {
  const curIdx = HONOR_GARDENS.findIndex((g) => g.id === sim.activeHonorTourId);
  const n = HONOR_GARDENS.length;
  const nextIdx = curIdx >= 0 ? (curIdx + dir + n) % n : 0;
  return socialEnterHonorGardenTour(sim, HONOR_GARDENS[nextIdx].id);
}

/**
 * Tự động đồng bộ danh sách thành viên thực từ Cổng Bay Floo HPVN (`visitBurrowGarden`) vào Sổ Hàng Xóm
 * (không cần nhập Mã Kết Bạn thủ công).
 */
export function socialSyncFlooDirectoryMembers(
  sim: ParkSimulation,
  rows: ReadonlyArray<FlooVisitDirectoryRow>,
  ownUid?: string,
  nowMs = Date.now()
): NeighborProfileState[] {
  const social = socialEnsureNeighborSocial(sim);
  const synced: NeighborProfileState[] = [];
  const ownNick = normalizeDistinctPlayerNickname(social.playerDisplayName);
  const ownCode = (social.playerFriendCode || '').trim().toUpperCase();
  const hasOwnCode = !isPlaceholderOrSyntheticFriendCode(ownCode);

  for (const row of rows) {
    if (!row || !row.uid) continue;
    if (ownUid && row.uid === ownUid) continue;
    const rowCode = String(row.friendCode || '').trim().toUpperCase();
    const hasRowCode = !isPlaceholderOrSyntheticFriendCode(rowCode);
    const rowNick = normalizeDistinctPlayerNickname(row.username);
    if (hasOwnCode && hasRowCode && rowCode === ownCode) continue;
    if (ownNick !== null && rowNick !== null && rowNick === ownNick) continue;

    const existingIdx = social.neighbors.findIndex((n) => {
      if (n.remoteUserId === row.uid) return true;
      const nCode = (n.friendCode || '').trim().toUpperCase();
      if (hasRowCode && !isPlaceholderOrSyntheticFriendCode(nCode) && nCode === rowCode) {
        return true;
      }
      const nNick = normalizeDistinctPlayerNickname(n.name);
      return rowNick !== null && nNick !== null && nNick === rowNick;
    });
    const existing = existingIdx >= 0 ? social.neighbors[existingIdx] : undefined;
    const updated = upsertFlooMemberToNeighborProfile(existing, row, nowMs);
    if (social.dailyRescuesGivenIds.includes(updated.id) && updated.minigameSos) {
      updated.minigameSos.rescuedToday = true;
    }
    if (existingIdx >= 0) {
      social.neighbors[existingIdx] = updated;
    } else if (social.neighbors.length < 30) {
      social.neighbors.push(updated);
    }
    synced.push(updated);
  }

  social.neighbors = deduplicateNeighborProfiles(social.neighbors, {
    ownUid,
    ownFriendCode: social.playerFriendCode,
    ownDisplayName: social.playerDisplayName,
  });

  if (synced.length > 0) {
    sim.saveToStorage();
    sim.onUiChange?.();
  }
  return synced;
}

/**
 * Chăm giúp toàn thung lũng 1 chạm chuẩn `hagridfarm` (`Chăm giúp` trên thanh điều hướng Cổng Floo):
 *  - Rút ngắn 15 phút cho các ô ruộng/xưởng đang sản xuất của chủ vườn.
 *  - Tối đa 5 lượt/ngày trên toàn bộ bạn bè (không reset khi chưa qua ngày mới 00:00), 1 lần/bạn/ngày.
 */
export function socialHelpVisitedFlooMemberWholeGarden(
  sim: ParkSimulation,
  options: { alreadySyncedServer?: boolean; serverHelpsLeft?: number } = {}
): { ok: boolean; msg: string; helpsLeft: number } {
  const social = socialEnsureNeighborSocial(sim);
  const nb = socialGetActiveVisitingNeighbor(sim);
  if (!nb) {
    return {
      ok: false,
      msg: 'Hãy bay Floo tới thung lũng của một thành viên để chăm giúp nhé!',
      helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - (social.dailyGardenHelpsCount ?? 0)),
    };
  }

  const usedToday = Math.max(
    social.dailyGardenHelpsCount ?? 0,
    social.neighbors.reduce((s, n) => s + (n.helpedViaFlooToday ? 1 : n.helpedMarksToday.length), 0)
  );
  if (nb.helpedViaFlooToday || nb.helpedMarksToday.length > 0) {
    return {
      ok: false,
      msg: `Hôm nay bạn đã chăm giúp thung lũng của ${nb.name} rồi (1 lần/bạn/ngày)!`,
      helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - usedToday),
    };
  }
  if (usedToday >= MAX_DAILY_FRIEND_HELPS) {
    return {
      ok: false,
      msg: `Hôm nay bạn đã dùng hết ${MAX_DAILY_FRIEND_HELPS}/${MAX_DAILY_FRIEND_HELPS} lượt hỗ trợ bạn bè (chỉ làm mới sau 00:00 ngày mới)!`,
      helpsLeft: 0,
    };
  }
  if ((nb.hostHelpsLeft ?? 10) <= 0) {
    return {
      ok: false,
      msg: `Thung lũng của ${nb.name} đã nhận đủ số lượt chăm giúp tối đa trong hôm nay!`,
      helpsLeft: Math.max(0, MAX_DAILY_FRIEND_HELPS - usedToday),
    };
  }

  const now = Date.now();
  const nextUsed =
    typeof options.serverHelpsLeft === 'number'
      ? Math.max(usedToday + 1, MAX_DAILY_FRIEND_HELPS - Math.max(0, options.serverHelpsLeft))
      : usedToday + 1;
  social.dailyGardenHelpsCount = Math.min(MAX_DAILY_FRIEND_HELPS, nextUsed);
  nb.helpedViaFlooToday = true;
  nb.hostHelpsLeft = Math.max(0, (nb.hostHelpsLeft ?? 10) - 1);

  const note = getPresetNoteMeta(social.selectedPresetNoteId);
  let helpedPlots = 0;
  for (const b of sim.state.buildings) {
    const item = getCatalogItem(b.itemId);
    if (item?.isFarmlandPlot && b.cropId && b.cropReadyAt && now < b.cropReadyAt) {
      b.cropWateredBoost = true;
      b.cropReadyAt = Math.max(now + 30_000, b.cropReadyAt - 900_000);
      helpedPlots++;
      if (nb.helpedMarksToday.length === 0) {
        nb.helpedMarksToday.push({
          buildingUid: b.uid,
          kind: 'water_crop',
          helperName: social.playerDisplayName || 'Bạn',
          noteId: note.id,
          noteText: note.textVi,
          helpedAt: now,
        });
      }
    } else if (b.workshopQueue && b.workshopQueue.length > 0 && now < b.workshopQueue[0].endsAt) {
      b.workshopQueue[0].endsAt = Math.max(now + 20_000, b.workshopQueue[0].endsAt - 900_000);
      helpedPlots++;
    }
  }
  if (nb.helpedMarksToday.length === 0 && sim.state.buildings[0]) {
    nb.helpedMarksToday.push({
      buildingUid: sim.state.buildings[0].uid,
      kind: 'water_crop',
      helperName: social.playerDisplayName || 'Bạn',
      noteId: note.id,
      noteText: note.textVi,
      helpedAt: now,
    });
  }

  const goldReward = 5;
  const xpReward = 14;
  sim.state.galleons += goldReward;
  sim.state.finance.harvestRevenue += goldReward;
  social.friendshipTokens += 1;
  sim.addXp(xpReward);
  sim.addHarvestFeastPoints(12);

  sim.audio.playHarvestBubble();
  sim.onRewardFly?.('galleons', goldReward, 19.5, 24.5);
  sim.spawnFloatingText(
    19.5,
    24.5,
    `🔥 Chăm giúp -15p! +${goldReward}G +1 🍀 +${xpReward} XP`,
    '#fde047'
  );

  const helpsLeft = Math.max(0, MAX_DAILY_FRIEND_HELPS - social.dailyGardenHelpsCount);
  socialPushSocialActivity(
    sim,
    '🔥',
    `Bay Floo chăm giúp toàn thung lũng ${nb.name} (-15 phút${helpedPlots > 0 ? ` cho ${helpedPlots} mẻ` : ''}, +${goldReward}G, +1 🍀)`,
    now
  );
    const msg = `🔥 Đã chăm giúp thung lũng ${nb.name} (cây chín sớm 15 phút)! Nhận +${goldReward}G · +1 🍀 · +${xpReward} XP (Còn ${helpsLeft}/${MAX_DAILY_FRIEND_HELPS} lượt hôm nay)`;
    sim.onToast?.(msg, '🔥');
    recordNeighborHelpStat(sim);
    sim.saveToStorage();
    sim.onUiChange?.();
    return { ok: true, msg, helpsLeft };
}

/**
 * Thưởng 1 lần/ngày khi lưu Bưu Thiếp hoặc khoe vườn rủ bạn trên Mạng Floo (`FREE_FESTIVAL_ACTIONS_PER_DAY` từ `hagridfarm`).
 */
export function socialRecordFlooShareOrPostcard(
  sim: ParkSimulation,
  kind: 'postcard' | 'shareFloo'
): { rewarded: boolean; msg: string } {
  const social = socialEnsureNeighborSocial(sim);
  const now = Date.now();
  if (social.dailyFlooShareClaimed) {
    return {
      rewarded: false,
      msg:
        kind === 'shareFloo'
          ? '✨ Đã gửi lời mời & Bưu Thiếp Thung Lũng lên Mạng Floo!'
          : '🖼️ Đã lưu Bưu Thiếp Thung Lũng về máy!',
    };
  }

  social.dailyFlooShareClaimed = true;
  sim.state.galleons += 10;
  sim.state.finance.harvestRevenue += 10;
  social.friendshipTokens += 1;
  sim.addXp(12);
  sim.addHarvestFeastPoints(15);
  socialPushSocialActivity(
    sim,
    kind === 'shareFloo' ? '🔥' : '🖼️',
    kind === 'shareFloo'
      ? 'Khoe Bưu Thiếp & rủ bạn sang thăm trên Mạng Floo (+10G, +1 🍀, +15 điểm Lễ Hội)'
      : 'Lưu Bưu Thiếp Thung Lũng đầu ngày (+10G, +1 🍀, +15 điểm Lễ Hội)',
    now
  );
  recordNeighborHelpStat(sim);
  sim.saveToStorage();
  sim.onUiChange?.();
  return {
    rewarded: true,
    msg: '✨ Gửi Bưu Thiếp Mạng Floo đầu ngày: Nhận +10G · +1 🍀 · +15 điểm Đại Tiệc!',
  };
}
