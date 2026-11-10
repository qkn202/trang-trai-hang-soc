import { describe, expect, it } from 'vitest';
import { MagicalAudio } from '../../engine/audio';
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

describe('P3 — Retention & Narrative (52 Achievements, 3 Save Slots + Autosave, NPC Schedule/Dialogue & Day 1-7)', () => {
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
});
