import { describe, expect, it } from 'vitest';
import { computeProximityAmbientMix, MagicalAudio } from '../../engine/audio';
import { verifyFarmEconomyDelta } from '../economyIntegrity';
import { lifecycleDescribeWeatherSlot } from '../simulationLifecycle';
import {
  createInitialLanguageQuizState,
  generateNextQuizChallenge,
  recordQuizAttempt,
} from '../languageQuizEngine';
import { ParkSimulation } from '../simulation';
import { applyFarmInbox } from '../../hpvn/inbox';

function makeSim(): ParkSimulation {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  const sim = new ParkSimulation(new MagicalAudio());
  sim.state.level = 25;
  sim.state.galleons = 2500;
  sim.state.timeSand = 12;
  sim.state.herbalCompost = 6;
  sim.state.morningDewPhials = 4;
  return sim;
}

describe('Full-World & Core Farm Gameplay Upgrades Suite', () => {
  it('1. Weather gameplay buffs: rain auto-waters newly planted crops & weather descriptions contain zero "vàng"', () => {
    const sim = makeSim();
    for (const kind of ['sunny', 'cloudy', 'rain', 'storm', 'snow', 'fog'] as const) {
      const slot = lifecycleDescribeWeatherSlot(sim, kind, 0, kind === 'sunny');
      expect(slot.buffVi.toLowerCase()).not.toContain('vàng');
    }

    sim.state.settings.weatherOverride = 'rain';
    const barn = sim.ensureFarmBarn();
    barn.seeds = { ...(barn.seeds ?? {}), ottery_wheat: 5 };
    const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
    expect(plot).toBeDefined();
    plot.cropId = undefined;
    plot.cropReadyAt = undefined;
    plot.cropWateredBoost = false;

    const sow = sim.plantCropOnPlot(plot.uid, 'ottery_wheat');
    expect(sow.ok).toBe(true);
    expect(plot.cropWateredBoost).toBe(true);
  });

  it('2. 1-Tap Locate Item Source & 1-Tap Replant Last Crop work accurately', () => {
    const sim = makeSim();
    const barn = sim.ensureFarmBarn();
    barn.lastPlantedCropId = 'honey_carrot';
    barn.seeds = { ...(barn.seeds ?? {}), honey_carrot: 4 };

    const plot = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
    plot.cropId = undefined;
    plot.cropReadyAt = undefined;

    const replant = sim.replantPlotLastCrop(plot.uid);
    expect(replant.ok).toBe(true);
    expect(plot.cropId).toBe('honey_carrot');

    const locCrop = sim.locateItemSource('honey_carrot');
    expect(locCrop.kind).toBe('plot');
    expect(locCrop.uid).toBe(plot.uid);

    const now = Date.now();
    sim.state.buildings.push({
      uid: 'test_bakery_1',
      itemId: 'molly_apple_bakery',
      gx: 24,
      gy: 18,
      rotation: 0,
      stars: 2,
      placedAt: now - 50_000,
      constructEndsAt: now - 40_000,
      lastTickAt: now,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
    });
    const locBakery = sim.locateItemSource('cinnamon_apple_pie');
    expect(locBakery.kind).toBe('workshop');
  });

  it('3. Perennial Apple Orchard drops real burrow_apple for 3 cycles then enters needsTreeRevival & revives via Compost or Friend Inbox', () => {
    const sim = makeSim();
    const now = Date.now();
    sim.state.buildings.push({
      uid: 'test_orchard_1',
      itemId: 'burrow_apple_orchard',
      gx: 22,
      gy: 22,
      rotation: 0,
      stars: 2,
      placedAt: now - 100_000,
      constructEndsAt: now - 90_000,
      lastTickAt: now - 80_000,
      storedSickle: 30,
      storedXp: 12,
      readyBubbles: 1,
      durability: 100,
      visitorsServed: 0,
    });
    const orchard = sim.state.buildings.find((b) => b.uid === 'test_orchard_1')!;
    const applesBefore = sim.getFarmItemCount('burrow_apple');

    for (let i = 0; i < 3; i++) {
      orchard.storedSickle = 30;
      orchard.readyBubbles = 1;
      orchard.readyFruitCrops = ['burrow_apple'];
      sim.harvestBuildingBubble(orchard.uid);
    }
    expect(sim.getFarmItemCount('burrow_apple')).toBeGreaterThan(applesBefore);
    expect(orchard.needsTreeRevival).toBe(true);

    // Revive with 1 Compost
    const rev = sim.reviveFruitTree(orchard.uid);
    expect(rev.ok).toBe(true);
    expect(orchard.needsTreeRevival).toBeFalsy();

    // Trigger revival state again and revive via HPVN friend inbox help!
    orchard.needsTreeRevival = true;
    applyFarmInbox(sim.state, [
      {
        seq: 101,
        kind: 'help',
        at: now,
        name: 'Luna Lovegood',
      },
    ]);
    expect(orchard.needsTreeRevival).toBe(false);
  });

  it('4. Roadside Stand 6 slots, Farm House-Elf Helper & 45s Field Micro-Events work and pass economy integrity', () => {
    const sim = makeSim();
    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 10;

    const listed = sim.listOnRoadsideStand(0, 'ottery_wheat', 3, 'fair');
    expect(listed.ok).toBe(true);
    const stand = sim.ensureRoadsideStand();
    expect(stand.slots[0].qty).toBe(3);

    // Simulate traveler buying after timer
    stand.slots[0].listedAt = Date.now() - 400_000;
    sim.update(2.5);
    expect(stand.slots[0].soldAt).toBeDefined();

    const galleonsBefore = sim.state.galleons;
    const claimed = sim.claimRoadsideStandSlot(0);
    expect(claimed.ok).toBe(true);
    expect(sim.state.galleons).toBeGreaterThan(galleonsBefore);

    // Activate daily free House-Elf helper
    const helperRes = sim.activateFarmHelper('free_daily');
    expect(helperRes.ok).toBe(true);
    expect(sim.isFarmHelperActive()).toBe(true);

    // Field micro-event spawn & claim
    sim.nextMicroEventAt = Date.now() - 1000;
    sim.update(0.2);
    expect(sim.fieldMicroEvent).not.toBeNull();
    const microClaim = sim.claimFieldMicroEvent();
    expect(microClaim.ok).toBe(true);
    expect(sim.fieldMicroEvent).toBeNull();

    const integrity = verifyFarmEconomyDelta(sim.economyBaseline!, sim.state, Date.now());
    expect(integrity.ok).toBe(true);
  });

  it('5. Builder Layout Edit Mode rolls back cleanly on Cancel, commits on Save, and preserves paths in Presets', () => {
    const sim = makeSim();
    const target = sim.state.buildings.find((b) => b.itemId === 'farmland_plot')!;
    const origGx = target.gx;
    const origGy = target.gy;

    expect(sim.enterLayoutEditMode().ok).toBe(true);
    expect(sim.isLayoutEditModeActive()).toBe(true);
    target.gx = origGx + 2;
    sim.state.tileOverrides['20,20'] = { path: 'cobble' };

    // Cancel restores exact pre-edit coordinates & tileOverrides
    expect(sim.cancelLayoutEditMode().ok).toBe(true);
    expect(sim.isLayoutEditModeActive()).toBe(false);
    const restored = sim.state.buildings.find((b) => b.uid === target.uid)!;
    expect(restored.gx).toBe(origGx);
    expect(restored.gy).toBe(origGy);

    // Save preset with custom pathMap and re-apply
    sim.state.tileOverrides['21,21'] = { path: 'wood_pier' };
    const savedPreset = sim.saveLayoutPreset('layout_2', 'Bản Thử Nghiệm');
    expect(savedPreset.pathMap?.['21,21']).toBe('wood_pier');
    delete sim.state.tileOverrides['21,21'];
    expect(sim.applyLayoutPreset('layout_2').ok).toBe(true);
    expect(sim.state.tileOverrides['21,21']?.path).toBe('wood_pier');
  });

  it('6. Villager Affection Gifting (2x favorite XP + Lv.5 Keepsake), Roaming Pet, Stroll Mode & Spatial Audio Mix', () => {
    const sim = makeSim();
    const barn = sim.ensureFarmBarn();
    barn.goods.cinnamon_apple_pie = 5;

    const giftRes = sim.giftItemToVillager('molly', 'cinnamon_apple_pie');
    expect(giftRes.ok).toBe(true);
    expect(giftRes.isFavorite).toBe(true);

    // Unlock Lv.5 keepsake when friendship reaches level 5
    sim.state.retention!.npcFriendship.molly.level = 5;
    const keepsakeRes = sim.claimVillagerKeepsake('molly');
    expect(keepsakeRes.ok).toBe(true);

    // Add a creature habitat to test Roaming Pet
    const now = Date.now();
    sim.state.buildings.push({
      uid: 'hab_niffler_1',
      itemId: 'niffler_den',
      gx: 19,
      gy: 23,
      rotation: 0,
      stars: 2,
      placedAt: now - 50_000,
      constructEndsAt: now - 40_000,
      lastTickAt: now,
      storedSickle: 0,
      storedXp: 0,
      readyBubbles: 0,
      durability: 100,
      visitorsServed: 0,
      creatureStage: 'adult',
    });
    expect(sim.setActiveRoamingPet('hab_niffler_1').ok).toBe(true);
    sim.update(0.2);
    expect(sim.roamingPet).not.toBeNull();
    expect(sim.petRoamingCompanion(now + 60_000).ok).toBe(true);

    // Stroll Mode + Care Wave
    expect(sim.toggleStrollMode(true).active).toBe(true);
    expect(sim.playerStrollAvatar).not.toBeNull();
    expect(sim.setStrollDestination(20, 24)).toBe(true);
    sim.update(0.5);
    const wave = sim.castStrollCareWave();
    expect(typeof wave.tendedCount).toBe('number');

    // Spatial audio proximity mix includes orchardGain & festiveGain
    const mix = computeProximityAmbientMix({
      camZoom: 1.0,
      waterDistPx: 100,
      activeWorkshopDistPx: 150,
      pastureDistPx: 200,
      orchardDistPx: 120,
      festiveDistPx: 90,
      ambienceBusGain: 0.85,
      modalMuffled: false,
    });
    expect(mix.orchardGain).toBeGreaterThan(0);
    expect(mix.festiveGain).toBeGreaterThan(0);
  });

  it('7. Co-op Supply Crate, Postcard Themes, Seasonal Festivals (Lunar Tet & Mid-Autumn) & Collection Almanac', () => {
    const sim = makeSim();
    const barn = sim.ensureFarmBarn();
    barn.crops.ottery_wheat = 20;

    const contrib = sim.contributeToCoopSupplyCrate('ottery_wheat', 4);
    expect(contrib.ok).toBe(true);
    expect(contrib.addedPoints).toBeGreaterThan(0);

    const crate = sim.ensureCoopSupplyCrate();
    crate.contributedPoints = 150;
    expect(sim.claimCoopCrateMilestone(1).ok).toBe(true);

    expect(sim.setPostcardFrameTheme('starry_hogwarts').theme).toBe('starry_hogwarts');

    // Seasonal Festivals: Lunar Tet auto-window & Daily Li Xi
    expect(sim.getActiveFestival(new Date(2027, 0, 28, 12, 0, 0))).toBe('lunar_tet');
    expect(sim.getActiveFestival(new Date(2027, 8, 18, 12, 0, 0))).toBe('mid_autumn');
    sim.state.settings.activeFestival = 'lunar_tet';
    const liXi = sim.claimDailyTetLiXi();
    expect(liXi.ok).toBe(true);

    // Collection Almanac evaluation & claim
    sim.state.cropMastery = {
      ottery_wheat: 3,
      honey_carrot: 2,
      garden_pumpkin: 2,
      burrow_potato: 1,
      golden_corn: 1,
      burrow_apple: 1,
    };
    const almanac = sim.evaluateCollectionAlmanac();
    const cropsCh = almanac.chapters.find((c) => c.id === 'crops')!;
    expect(cropsCh.canClaim).toBe(true);
    expect(sim.claimAlmanacChapterReward('crops').ok).toBe(true);
  });

  it('8. Language Academy 2.0: listening_comprehension format, preferredTopic filter & consecutive daily streak', () => {
    const quiz = createInitialLanguageQuizState();
    quiz.preferredFormat = 'listening_comprehension';
    quiz.preferredTopic = 'farm';

    const ch = generateNextQuizChallenge(quiz, 15);
    expect(ch.format).toBe('listening_comprehension');
    expect(ch.visualGameKind).toBe('audio_listening');
    expect(ch.qId.startsWith('listen:')).toBe(true);

    // 3 correct answers on Day 1 -> dailyStreakCount = 1
    for (let i = 0; i < 3; i++) {
      recordQuizAttempt(quiz, ch, true, true, '2026-11-20');
    }
    expect(quiz.dailyStreakCount).toBe(1);

    // 3 correct answers on Day 2 -> dailyStreakCount = 2
    for (let i = 0; i < 3; i++) {
      recordQuizAttempt(quiz, ch, true, true, '2026-11-21');
    }
    expect(quiz.dailyStreakCount).toBe(2);

    // 3 correct answers on Day 3 -> dailyStreakCount = 3 -> claim 3-day milestone in sim
    for (let i = 0; i < 3; i++) {
      recordQuizAttempt(quiz, ch, true, true, '2026-11-22');
    }
    expect(quiz.dailyStreakCount).toBe(3);

    const sim = makeSim();
    sim.state.languageQuiz = quiz;
    expect(sim.claimQuizDailyStreakMilestone(3).ok).toBe(true);
  });
});
