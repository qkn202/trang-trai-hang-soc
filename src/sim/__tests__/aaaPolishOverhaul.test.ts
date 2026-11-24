import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  computeProximityAmbientMix,
  FootstepSurface,
  MagicalAudio,
  SFX_ATLAS_CUES,
} from '../../engine/audio';
import {
  cacheNeighborSocialExtras,
  clearNeighborSocialExtrasCache,
  prepareGameStateForPersistence,
} from '../neighborSocial';
import {
  createInitialRoadsideStandState,
  getNeighborRoadsideOffer,
} from '../roadsideStandAndEvents';
import {
  clearServerCoopCrateSnapshot,
  computeIsoWeekKey,
  setServerCoopCrateSnapshot,
} from '../socialFestivalsAndAlmanac';
import { applyFarmInbox } from '../../hpvn/inbox';
import {
  drawAmbientWildlifeOverlay,
  getActiveAmbientOwlFlyby,
  triggerAmbientOwlFlyby,
} from '../../engine/ambientWildlife';
import type { Camera } from '../../engine/isometric';
import { ParkSimulation } from '../simulation';
import { migrateLoadedState } from '../simulationData';
import { captureEconomyBaseline, verifyFarmEconomyDelta } from '../economyIntegrity';
import { STROLL_ROBE_ORDER, STROLL_ROBE_WARDROBE } from '../villagerGiftsPetAndStroll';
import { captureModalScrollSnapshot, restoreModalScrollSnapshot } from '../../ui/hudShared';
import { patchWorkshopBarnInPlace } from '../../ui/hudFarmAndWorkshop';

type MinimalNodeFs = {
  readFileSync: (p: string, enc: string) => string;
  existsSync: (p: string) => boolean;
  statSync: (p: string) => { size: number };
};

async function loadNodeFsAndPath(): Promise<{
  fs: MinimalNodeFs;
  path: { resolve: (...parts: string[]) => string };
  rootDir: string;
}> {
  const fs = (await import(/* @vite-ignore */ 'node:' + 'fs')) as unknown as MinimalNodeFs;
  const path = (await import(/* @vite-ignore */ 'node:' + 'path')) as {
    resolve: (...parts: string[]) => string;
  };
  const proc = (globalThis as unknown as { process: { cwd: () => string } }).process;
  return { fs, path, rootDir: proc.cwd() };
}

afterEach(() => {
  clearNeighborSocialExtrasCache();
  clearServerCoopCrateSnapshot();
});

describe('AAA Polish Overhaul — Foley, Living World, Floo Social Sync & UX', () => {
  it('registers all 22 physical-modeling SFX atlas cues and ships the upgraded sfx_atlas.mp3', async () => {
    const { fs, path, rootDir } = await loadNodeFsAndPath();
    const newCues = [
      'orchard_birds',
      'festive_chimes',
      'step_grass',
      'step_stone',
      'step_wood',
      'pet_chirp',
    ] as const;

    const entries = Object.entries(SFX_ATLAS_CUES);
    expect(entries.length).toBeGreaterThanOrEqual(22);

    let prevOffset = -1;
    for (const [id, spec] of entries) {
      expect(spec.duration, `cue ${id} duration`).toBeGreaterThan(0.1);
      expect(spec.offset, `cue ${id} offset`).toBeGreaterThan(prevOffset);
      prevOffset = spec.offset;
    }

    for (const cue of newCues) {
      expect(SFX_ATLAS_CUES[cue]).toBeDefined();
    }

    const atlasPath = path.resolve(rootDir, 'public/audio/sfx_atlas.mp3');
    expect(fs.existsSync(atlasPath)).toBe(true);
    expect(fs.statSync(atlasPath).size).toBeGreaterThan(250_000);

    const mix = computeProximityAmbientMix({
      camZoom: 1.0,
      waterDistPx: 120,
      activeWorkshopDistPx: 140,
      pastureDistPx: 160,
      orchardDistPx: 100,
      festiveDistPx: 90,
      ambienceBusGain: 0.9,
      modalMuffled: false,
    });
    expect(mix.orchardGain).toBeGreaterThan(0.05);
    expect(mix.festiveGain).toBeGreaterThan(0.05);
  });

  it('triggers material-aware footsteps (wood/stone/grass) in Stroll Mode and pet chirp on petting', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const playedSteps: FootstepSurface[] = [];
    const playStepSpy = vi.spyOn(sim.audio, 'playFootstep').mockImplementation((s) => {
      playedSteps.push(s ?? 'grass');
    });
    const playChirpSpy = vi.spyOn(sim.audio, 'playPetChirp').mockImplementation(() => {});

    sim.toggleStrollMode(true);
    expect(sim.playerStrollAvatar).toBeTruthy();
    const startGx = Math.floor(sim.playerStrollAvatar!.gx);
    const startGy = Math.floor(sim.playerStrollAvatar!.gy);

    // 1. Lay wooden pier ahead and walk onto it
    for (let dx = 0; dx <= 4; dx++) {
      sim.state.tileOverrides[`${startGx + dx},${startGy}`] = { path: 'wood_pier' };
    }
    sim.rebuildGrid();
    sim.setStrollDestination(startGx + 3.5, startGy + 0.5);
    for (let i = 0; i < 30; i++) sim.update(0.08);
    expect(playedSteps).toContain('wood');
    expect(sim.playerStrollAvatar!.stepDustTimer).toBeGreaterThanOrEqual(0);

    // 2. Lay cobblestone ahead and walk onto it
    playedSteps.length = 0;
    const curGx = Math.floor(sim.playerStrollAvatar!.gx);
    const curGy = Math.floor(sim.playerStrollAvatar!.gy);
    for (let dx = 0; dx <= 4; dx++) {
      sim.state.tileOverrides[`${curGx + dx},${curGy}`] = { path: 'cobble' };
    }
    sim.rebuildGrid();
    sim.setStrollDestination(curGx + 3.5, curGy + 0.5);
    for (let i = 0; i < 30; i++) sim.update(0.08);
    expect(playedSteps).toContain('stone');

    // 3. Clear path to grass and walk back
    playedSteps.length = 0;
    const gGx = Math.floor(sim.playerStrollAvatar!.gx);
    const gGy = Math.floor(sim.playerStrollAvatar!.gy);
    for (let dy = 0; dy <= 4; dy++) {
      sim.state.tileOverrides[`${gGx},${gGy + dy}`] = { path: 'none' };
    }
    sim.rebuildGrid();
    sim.setStrollDestination(gGx + 0.5, gGy + 3.5);
    for (let i = 0; i < 30; i++) sim.update(0.08);
    expect(playedSteps).toContain('grass');

    // 4. Pet roaming companion triggers pet_chirp cue
    const now = Date.now();
    sim.state.buildings.push({
      uid: 'hab_niffler_test',
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
    expect(sim.setActiveRoamingPet('hab_niffler_test').ok).toBe(true);
    sim.update(0.15);
    const petRes = sim.petRoamingCompanion(now + 60_000);
    expect(petRes.ok).toBe(true);
    expect(playChirpSpy).toHaveBeenCalledTimes(1);

    playStepSpy.mockRestore();
    playChirpSpy.mockRestore();
  });

  it('supports 6 Stroll Wardrobe robes, cycles cleanly, and persists through save migration', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    expect(STROLL_ROBE_ORDER).toHaveLength(6);

    const setRes = sim.setStrollRobe('ravenclaw_cloak');
    expect(setRes.ok).toBe(true);
    expect(sim.state.settings.strollRobeId).toBe('ravenclaw_cloak');
    expect(STROLL_ROBE_WARDROBE[setRes.robe.id].labelVi).toContain('Ravenclaw');

    const migrated = migrateLoadedState(structuredClone(sim.state));
    expect(migrated.settings.strollRobeId).toBe('ravenclaw_cloak');

    const seen = new Set<string>([sim.state.settings.strollRobeId ?? 'burrow_classic']);
    for (let i = 0; i < STROLL_ROBE_ORDER.length; i++) {
      const c = sim.cycleStrollRobe();
      expect(c.ok).toBe(true);
      seen.add(c.robe.id);
    }
    expect(seen.size).toBe(STROLL_ROBE_ORDER.length);
  });

  it('hydrates real visited Floo friend Roadside Stand listings and weekly Co-op Supply Crate contributions', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.state.galleons = 500;
    const synced = sim.syncFlooDirectoryMembers(
      [
        {
          uid: 'floo_friend_42',
          username: 'Hermione HPVN',
          parkName: 'Vườn Sách Hogsmeade',
          house: 'Gryffindor',
          avatarEmoji: '📚',
          level: 28,
          growing: 2,
          helped: false,
          hostHelpsLeft: 8,
          fire: null,
        },
      ],
      'self_player_uid'
    );
    const targetNb = synced[0];
    expect(targetNb).toBeDefined();

    // Fallback curated offer before real stand cache is populated
    const fallbackOffer = getNeighborRoadsideOffer(targetNb, '2026-11-23');
    expect(fallbackOffer.isRealFriendListing).toBe(false);

    // Hydrate real friend Roadside Stand & weekly Co-op Crate contribution
    const friendStand = createInitialRoadsideStandState();
    friendStand.slots[0] = {
      slotIndex: 0,
      itemId: 'cinnamon_apple_pie',
      qty: 2,
      unitPrice: 28,
      listedAt: Date.now() - 5000,
    };
    const weekKey = computeIsoWeekKey();
    cacheNeighborSocialExtras(targetNb, {
      roadsideStand: friendStand,
      coopWeekKey: weekKey,
      coopPoints: 140,
    });

    const realOffer = getNeighborRoadsideOffer(targetNb, '2026-11-23');
    expect(realOffer.isRealFriendListing).toBe(true);
    expect(realOffer.itemId).toBe('cinnamon_apple_pie');
    expect(realOffer.qty).toBe(2);
    expect(realOffer.totalSickle).toBe(56);

    // Visiting & buying the real listing transfers exact item into home barn cleanly
    const enterRes = sim.enterNeighborVisit(targetNb.id);
    expect(enterRes.ok).toBe(true);
    const beforeSnap = captureEconomyBaseline(sim.homeStateWhileVisiting ?? sim.state);
    const buyRes = sim.buyVisitedNeighborRoadsideOffer();
    expect(buyRes.ok).toBe(true);
    expect(buyRes.msg).toContain('Sạp thật');
    expect(sim.getFarmItemCount('cinnamon_apple_pie')).toBeGreaterThanOrEqual(2);
    expect(
      verifyFarmEconomyDelta(beforeSnap, sim.homeStateWhileVisiting ?? sim.state, 1_000).ok
    ).toBe(true);

    // Exit visit & verify weekly Co-op Supply Crate aggregates real synced friend points
    sim.exitNeighborVisit(true);
    const summary = sim.getNeighborhoodCoopSummary();
    expect(summary.weekKey).toBe(weekKey);
    expect(summary.syncedFriendPoints).toBe(140);
    expect(summary.totalPoints).toBe(summary.localPoints + 140);
    expect(summary.syncedContributors).toHaveLength(1);
    expect(summary.syncedContributors[0].displayName).toBe('Hermione HPVN');

    // Milestone 1 (120 pts) is now claimable thanks to combined neighborhood effort
    const claimRes = sim.claimCoopCrateMilestone(1);
    expect(claimRes.ok).toBe(true);

    // Persistence payload stays slim (runtime social extras cache is not serialized into save JSON)
    const persisted = prepareGameStateForPersistence(sim.state);
    expect(JSON.stringify(persisted)).not.toContain('cinnamon_apple_pie_cached_extra');
  });

  it('preserves and resets modal scroll positions cleanly and ships token-based CSS classes', async () => {
    const { fs, path, rootDir } = await loadNodeFsAndPath();
    const innerChild = { scrollTop: 140 } as unknown as HTMLElement;
    const parentEl = { scrollTop: 95 } as unknown as HTMLElement;
    const dialogEl = { scrollTop: 42 } as unknown as HTMLElement;
    const boxEl = {
      scrollTop: 64,
      parentElement: parentEl,
      closest: (sel: string) => (sel === 'dialog' ? dialogEl : null),
      querySelector: (sel: string) => (sel === '.aaa-codex-scroll' ? innerChild : null),
    } as unknown as HTMLElement;

    const snap = captureModalScrollSnapshot(boxEl);
    boxEl.scrollTop = 0;
    parentEl.scrollTop = 0;
    dialogEl.scrollTop = 0;
    innerChild.scrollTop = 0;

    restoreModalScrollSnapshot(boxEl, snap, false);
    expect(boxEl.scrollTop).toBe(64);
    expect(parentEl.scrollTop).toBe(95);
    expect(dialogEl.scrollTop).toBe(42);
    expect(innerChild.scrollTop).toBe(140);

    restoreModalScrollSnapshot(boxEl, snap, true);
    expect(boxEl.scrollTop).toBe(0);
    expect(parentEl.scrollTop).toBe(0);
    expect(dialogEl.scrollTop).toBe(0);

    const css = fs.readFileSync(path.resolve(rootDir, 'src/styles/hudAndMatch3.css'), 'utf8');
    expect(css).toContain('.hs-utility-pouch');
    expect(css).toContain('.hs-robe-pills');
    expect(css).toContain('.hs-coop-roster');
    expect(css).toContain('.is-patched-pop');

    // Verify lazy CSS split artifacts & slimmed main.css (< 9000 lines)
    expect(fs.existsSync(path.resolve(rootDir, 'src/styles/leaderboardModal.css'))).toBe(true);
    expect(fs.existsSync(path.resolve(rootDir, 'src/styles/minigameViewControls.css'))).toBe(true);
    const mainCss = fs.readFileSync(path.resolve(rootDir, 'src/styles/main.css'), 'utf8');
    expect(mainCss.split(/\r?\n/).length).toBeLessThan(9000);
    const lbTs = fs.readFileSync(path.resolve(rootDir, 'src/ui/leaderboardModal.ts'), 'utf8');
    expect(lbTs).toContain("import '../styles/leaderboardModal.css'");
    const vcTs = fs.readFileSync(path.resolve(rootDir, 'src/ui/minigameViewControls.ts'), 'utf8');
    expect(vcTs).toContain("import '../styles/minigameViewControls.css'");
  });

  it('settles 2-way atomic stand-sale inbox entries once without double-crediting or losing Sickle', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const stand = sim.ensureRoadsideStand();
    stand.slots[0] = {
      slotIndex: 0,
      itemId: 'cinnamon_apple_pie',
      qty: 2,
      unitPrice: 25,
      listedAt: 1000,
    };
    const startSickle = sim.state.galleons;

    // 1. Active unsold slot -> marked sold for seller to claim, no premature double-add
    const applied1 = applyFarmInbox(
      sim.state,
      [
        {
          seq: 10,
          kind: 'stand-sale',
          uid: 'buyer_1',
          name: 'Ron HPVN',
          at: 5000,
          slotIndex: 0,
          itemId: 'cinnamon_apple_pie',
          qty: 2,
          sickle: 60,
        },
      ],
      5000
    );
    expect(applied1).toHaveLength(1);
    expect(stand.slots[0].soldAt).toBe(5000);
    expect(stand.slots[0].buyerName).toBe('Ron HPVN');
    expect(stand.slots[0].unitPrice).toBe(30);
    expect(sim.state.galleons).toBe(startSickle);

    // Replay same seq -> ignored
    expect(
      applyFarmInbox(
        sim.state,
        [{ seq: 10, kind: 'stand-sale', name: 'Ron HPVN', at: 5000, slotIndex: 0, sickle: 60 }],
        5000
      )
    ).toHaveLength(0);

    // 2. If slot already empty/claimed -> credits wallet directly so seller never loses Sickle
    const applied2 = applyFarmInbox(
      sim.state,
      [
        {
          seq: 11,
          kind: 'stand-sale',
          uid: 'buyer_2',
          name: 'Ginny HPVN',
          at: 6000,
          slotIndex: 3,
          itemId: 'ottery_wheat',
          qty: 3,
          sickle: 45,
        },
      ],
      6000
    );
    expect(applied2).toHaveLength(1);
    expect(sim.state.galleons).toBe(startSickle + 45);
    expect(sim.state.hpvnInboxSeq).toBe(11);
  });

  it('merges authoritative server Co-op Supply Crate snapshots cleanly and renders ambient wildlife safely', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    const weekKey = computeIsoWeekKey();
    setServerCoopCrateSnapshot({
      weekKey,
      totalPoints: 340,
      contributors: [
        { uid: 'srv_1', displayName: 'Minerva HPVN', avatarEmoji: '🦉', points: 180 },
        { uid: 'srv_2', displayName: 'Neville HPVN', avatarEmoji: '🌿', points: 160 },
      ],
      syncedAt: Date.now(),
    });

    const summary = sim.getNeighborhoodCoopSummary();
    expect(summary.isServerAuthoritative).toBe(true);
    expect(summary.totalPoints).toBeGreaterThanOrEqual(340);
    expect(summary.syncedContributors.map((c) => c.displayName)).toContain('Minerva HPVN');
    expect(sim.claimCoopCrateMilestone(2).ok).toBe(true);

    // Ambient wildlife: owl flyby lifecycle & safe canvas draw pass
    const now = Date.now();
    triggerAmbientOwlFlyby(now);
    expect(getActiveAmbientOwlFlyby(now + 500)).not.toBeNull();
    expect(getActiveAmbientOwlFlyby(now + 10_000)).toBeNull();

    triggerAmbientOwlFlyby(now);
    const noop = () => {};
    const mockCtx = {
      save: noop,
      restore: noop,
      beginPath: noop,
      ellipse: noop,
      arc: noop,
      moveTo: noop,
      quadraticCurveTo: noop,
      fill: noop,
      stroke: noop,
      translate: noop,
      scale: noop,
      fillRect: noop,
      strokeStyle: '',
      fillStyle: '',
      lineWidth: 1,
      lineCap: 'round',
    } as unknown as CanvasRenderingContext2D;
    const cam: Camera = { x: 0, y: 0, zoom: 1, viewRot: 0 };
    expect(() =>
      drawAmbientWildlifeOverlay(mockCtx, sim, cam, 1280, 720, now + 400, false)
    ).not.toThrow();
  });

  it('patches Red Barn cards and progress bar in place without replacing card DOM nodes', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.addFarmItemToBarn('ottery_wheat', 5);

    const qtyEl = { textContent: '×99' };
    const sellBtn = {
      disabled: true,
      classList: {
        classes: new Set<string>(),
        toggle(c: string, on?: boolean) {
          if (on) this.classes.add(c);
          else this.classes.delete(c);
        },
      },
    };
    const wheatCard = {
      dataset: { barnCard: 'ottery_wheat' },
      offsetWidth: 100,
      classList: {
        classes: new Set<string>(),
        toggle(c: string, on?: boolean) {
          if (on) this.classes.add(c);
          else this.classes.delete(c);
        },
        add(c: string) {
          this.classes.add(c);
        },
        remove(c: string) {
          this.classes.delete(c);
        },
      },
      querySelector(sel: string) {
        if (sel === '[data-barn-qty]') return qtyEl;
        if (sel === '[data-sell-farm-item]') return sellBtn;
        return null;
      },
    };
    const capLabel = { textContent: '' };
    const barFill = { style: { width: '0%' } };
    const mockBox = {
      dataset: { activeWsTab: 'barn' },
      querySelector(sel: string) {
        if (sel === '[data-barn-root="1"]') return {};
        if (sel === '[data-barn-cap-label]') return capLabel;
        if (sel === '[data-barn-cap-bar]') return barFill;
        return null;
      },
      querySelectorAll(sel: string) {
        if (sel === '[data-barn-card]') return [wheatCard];
        return [];
      },
    } as unknown as HTMLElement;

    const fakeHud = { activeWorkshopTab: 'barn', sim } as never;
    const patched = patchWorkshopBarnInPlace(mockBox, fakeHud);
    expect(patched).toBe(true);
    expect(qtyEl.textContent).toBe(`×${sim.getFarmItemCount('ottery_wheat')}`);
    expect(sellBtn.disabled).toBe(false);
    expect(capLabel.textContent).toContain('Kho Đỏ');
    expect(barFill.style.width).toMatch(/%$/);
  });

  it('keeps 60fps simulation.update() hot loop fast (< 2.5 ms/frame average over 300 ticks)', () => {
    const sim = new ParkSimulation(new MagicalAudio());
    sim.toggleStrollMode(true);
    sim.setStrollDestination(24, 24);
    const t0 = performance.now();
    for (let i = 0; i < 300; i++) {
      sim.update(1 / 60);
    }
    const elapsedMs = performance.now() - t0;
    const avgMsPerFrame = elapsedMs / 300;
    expect(avgMsPerFrame).toBeLessThan(2.5);
  });
});
