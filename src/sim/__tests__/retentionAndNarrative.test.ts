import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
import { createFriendNeighborFromCode } from '../neighborSocial';
import {
  ACHIEVEMENT_REGISTRY,
  answerVillagerDialogue,
  buildSaveSlotMeta,
  claimAchievementReward,
  claimDailyRetentionReward,
  DAY_1_TO_7_REWARDS,
  evaluateAchievements,
  exportSavePayload,
  getAchievementCodexSummary,
  getNpcScheduleForPeriod,
  importSavePayload,
  loadFromNamedSlot,
  ParkSimulation,
  resolveCloudSaveConflict,
  saveToNamedSlot,
  STORY_CUTSCENE_CHAPTERS,
} from '../simulation';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (key: string) => storageMap.get(key) ?? null,
  setItem: (key: string, val: string) => storageMap.set(key, String(val)),
  removeItem: (key: string) => storageMap.delete(key),
  clear: () => storageMap.clear(),
};
vi.stubGlobal('localStorage', mockLocalStorage);

describe('P3 — Retention & Narrative (52 Achievements, 3 Save Slots + Autosave, NPC Schedule/Dialogue & Day 1-7)', () => {
  beforeEach(() => {
    storageMap.clear();
  });
  it('registers 52 stable achievements across 6 categories and evaluates/claims rewards cleanly', () => {
    expect(ACHIEVEMENT_REGISTRY.length).toBe(52);
    expect(ACHIEVEMENT_REGISTRY[0].id).toBe('ach_01');
    expect(ACHIEVEMENT_REGISTRY[51].id).toBe('ach_52');

    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.stats.totalGalleonsHarvested = 500;
    sim.state.stats.minigamesWon = 20;

    const unlocked = evaluateAchievements(sim.state, 1000);
    expect(unlocked.length).toBeGreaterThanOrEqual(4);

    const summaryBefore = getAchievementCodexSummary(sim.state);
    expect(summaryBefore.unlocked).toBe(unlocked.length);
    expect(summaryBefore.claimed).toBe(0);

    const galleonsBefore = sim.state.galleons;
    const claimRes = claimAchievementReward(sim.state, unlocked[0], 2000);
    expect(claimRes.ok).toBe(true);
    expect(sim.state.galleons).toBe(galleonsBefore + claimRes.rewardGalleons);

    // Duplicate claim must fail
    expect(claimAchievementReward(sim.state, unlocked[0], 3000).ok).toBe(false);
  });

  it('supports 3 named save slots + autosave, backward-compatible import/export, and cloud conflict policies', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.parkName = 'Thung Lũng Phượng Hoàng';
    sim.state.level = 14;

    const memStore = new Map<string, string>();
    const storageMock = {
      setItem: (k: string, v: string) => memStore.set(k, v),
      getItem: (k: string) => memStore.get(k) ?? null,
    };

    const meta1 = saveToNamedSlot(sim.state, 'slot_1', storageMock);
    expect(meta1.slotId).toBe('slot_1');
    expect(meta1.level).toBe(14);

    const loaded = loadFromNamedSlot('slot_1', storageMock);
    expect(loaded.ok).toBe(true);
    expect(loaded.state?.parkName).toBe('Thung Lũng Phượng Hoàng');

    // Backward-compatible raw GameState import (without { meta, state } wrapper)
    const legacyRaw = JSON.stringify(sim.state);
    const legacyImported = importSavePayload(legacyRaw);
    expect(legacyImported.ok).toBe(true);
    expect(legacyImported.state?.level).toBe(14);

    // Cloud conflict resolution: highest_progress vs newest
    const localMeta = buildSaveSlotMeta(sim.state, 'slot_1', 1000);
    const remoteHigher = { ...localMeta, level: 18, savedAt: 500 };
    expect(resolveCloudSaveConflict(localMeta, remoteHigher, 'highest_progress').winner).toBe('remote');
    expect(resolveCloudSaveConflict(localMeta, remoteHigher, 'newest').winner).toBe('local');
    expect(resolveCloudSaveConflict(localMeta, remoteHigher, 'local').winner).toBe('local');

    // Export envelope roundtrip
    const exported = exportSavePayload(sim.state, 'autosave', 5000);
    expect(importSavePayload(exported).meta?.slotId).toBe('autosave');
  });

  it('provides NPC schedules across 4 periods, branching dialogue friendship leveling, 3 story chapters, and Day 1..7 rewards', () => {
    const dawnMolly = getNpcScheduleForPeriod('molly', 'dawn');
    const nightRon = getNpcScheduleForPeriod('ron', 'night');
    expect(dawnMolly.zoneId).toBe('burrow_core');
    expect(nightRon.mood).toBe('dreamy');

    const sim = new ParkSimulation(new MagicalAudio());
    const talk1 = answerVillagerDialogue(sim.state, 'hermione', 0);
    const talk2 = answerVillagerDialogue(sim.state, 'hermione', 0);
    expect(talk2.level).toBeGreaterThanOrEqual(talk1.level);
    expect(talk2.replyVi.length).toBeGreaterThan(10);

    expect(STORY_CUTSCENE_CHAPTERS.length).toBe(3);
    expect(DAY_1_TO_7_REWARDS.length).toBe(7);

    const claimDay1 = claimDailyRetentionReward(sim.state, 1);
    expect(claimDay1.ok).toBe(true);
    expect(claimDailyRetentionReward(sim.state, 1).ok).toBe(false);
  });

  it('starts a brand-new Level 1 game with 0/52 unlocked achievements (no false starter unlocks)', () => {
    localStorage.clear();
    const sim = new ParkSimulation(new MagicalAudio());
    const toasts: string[] = [];
    sim.onToast = (msg) => toasts.push(msg);

    const summary0 = getAchievementCodexSummary(sim.state);
    expect(summary0.unlocked).toBe(0);

    // Periodic checkAndToastAchievements ticks at Level 1 must never unlock or toast anything
    expect(sim.checkAndToastAchievements(1000)).toEqual([]);
    expect(sim.checkAndToastAchievements(16_000)).toEqual([]);
    expect(getAchievementCodexSummary(sim.state).unlocked).toBe(0);
    expect(toasts.filter((m) => m.includes('Đạt Thành Tựu'))).toEqual([]);
  });

  it('emits each achievement toast at most once across repeated 15s ticks and save/reload cycles', () => {
    localStorage.clear();
    const sim = new ParkSimulation(new MagicalAudio());
    const toasts: string[] = [];
    sim.onToast = (msg) => toasts.push(msg);

    // Reach true milestone: 1 minigame win -> ach_19 (Quán Quân Khảo Thí I, target 1)
    sim.state.stats.minigamesWon = 1;
    const firstBatch = sim.checkAndToastAchievements(10_000);
    expect(firstBatch).toEqual(['ach_19']);
    expect(toasts.filter((m) => m.includes('Đạt Thành Tựu')).length).toBe(1);
    expect(sim.state.retention?.pendingToasts).toEqual([]);
    expect(sim.state.retention?.achievements['ach_19']?.notifiedAt).toBe(10_000);

    // Subsequent 15s update ticks must NEVER repeat the toast
    expect(sim.checkAndToastAchievements(25_000)).toEqual([]);
    expect(sim.checkAndToastAchievements(40_000)).toEqual([]);
    expect(toasts.filter((m) => m.includes('Đạt Thành Tựu')).length).toBe(1);

    // Reloading from localStorage must preserve unlock AND emit 0 duplicate toasts
    sim.saveToStorage();
    const reloaded = new ParkSimulation(new MagicalAudio());
    const reloadToasts: string[] = [];
    reloaded.onToast = (msg) => reloadToasts.push(msg);

    expect(getAchievementCodexSummary(reloaded.state).unlocked).toBe(1);
    expect(reloaded.checkAndToastAchievements(60_000)).toEqual([]);
    expect(reloadToasts.filter((m) => m.includes('Đạt Thành Tựu'))).toEqual([]);
  });

  it('cleans up unclaimed false starter unlocks when migrating legacy schemaVersion < 13 saves', () => {
    localStorage.clear();
    const legacySim = new ParkSimulation(new MagicalAudio());
    legacySim.state.retention = {
      schemaVersion: 12,
      achievements: {
        // False starter unlocks caused by old formulas (4 starter plots, 4 starter tokens, rural pasture morph)
        ach_10: { unlockedAt: 500 },
        ach_37: { unlockedAt: 500 },
        ach_38: { unlockedAt: 500 },
        ach_45: { unlockedAt: 500 },
      },
      pendingToasts: ['ach_10', 'ach_37', 'ach_38', 'ach_45'],
      npcFriendship: legacySim.state.retention?.npcFriendship ?? {},
      unlockedStoryChapters: ['chap_1_burrow_dawn'],
      claimedLoginDays: [],
      activeSaveSlotId: 'slot_1',
    };
    localStorage.setItem('hogwarts_theme_park_save_v6', JSON.stringify(legacySim.state));

    const migrated = new ParkSimulation(new MagicalAudio());
    const toasts: string[] = [];
    migrated.onToast = (msg) => toasts.push(msg);

    expect(getAchievementCodexSummary(migrated.state).unlocked).toBe(0);
    expect(migrated.state.retention?.pendingToasts).toEqual([]);
    expect(migrated.checkAndToastAchievements(90_000)).toEqual([]);
    expect(toasts).toEqual([]);
  });

  it('never leaks neighbor buildings into player building achievements while visiting, and tracks neighbor helps cleanly', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const achToasts: string[] = [];
    sim.onToast = (msg) => {
      if (msg.includes('Đạt Thành Tựu') || msg.includes('Mở khoá')) achToasts.push(msg);
    };

    const friend = createFriendNeighborFromCode('HS-HAGRID-88', 'Rubeus Hagrid', 1000, {
      userId: 'hagrid_uid',
      friendCode: 'HS-HAGRID-88',
      name: 'Rubeus Hagrid',
      parkName: 'Chòi Bí Ngô Hagrid',
      level: 45,
      house: 'Gryffindor',
    });
    sim.ensureNeighborSocial().neighbors.push(friend);

    const visitRes = sim.enterNeighborVisit(friend.id);
    expect(visitRes.ok).toBe(true);
    expect(sim.state.buildings.length).toBeGreaterThan(6);

    // Ticking while inside Hagrid's 72x72 farm must NOT unlock any building achievements
    expect(sim.checkAndToastAchievements(5000)).toEqual([]);
    expect(achToasts).toEqual([]);

    // Liking Hagrid's farm counts 1 real neighbor help -> unlocks ach_37 (Đại Sứ Thung Lũng I, target 1) once
    expect(sim.likeVisitedNeighborFarm().ok).toBe(true);
    expect(achToasts.length).toBe(1);

    sim.exitNeighborVisit(true);
    expect(getAchievementCodexSummary(sim.state).unlocked).toBe(1);
    expect(sim.state.retention?.achievements['ach_37']?.unlockedAt).toBeGreaterThan(0);
    expect(sim.checkAndToastAchievements(20_000)).toEqual([]);
    expect(achToasts.length).toBe(1);
  });
});
