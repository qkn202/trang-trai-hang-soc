import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  FISH_SPECIAL_WEAPON_IDS,
  FISH_SPECIES_CATALOG,
  FISH_WEAPON_CATALOG,
  FishShooterEngine,
  MasterJigsawEngine,
  MinesweeperEngine,
  sanitizeSavedFishShooterSession,
  sanitizeSavedJigsawSession,
  sanitizeSavedMinesweeperSession,
} from '../puzzleArcadeEngine';
import { ParkSimulation } from '../simulation';
import { MagicalAudio } from '../../engine/audio';
import { PuzzleArcadeModalController } from '../../ui/puzzleArcadeModal';

const storageMap = new Map<string, string>();
const mockLocalStorage = {
  getItem: (k: string) => storageMap.get(k) ?? null,
  setItem: (k: string, v: string) => {
    storageMap.set(k, String(v));
  },
  removeItem: (k: string) => {
    storageMap.delete(k);
  },
  clear: () => {
    storageMap.clear();
  },
  key: () => null,
  length: 0,
};

vi.stubGlobal('localStorage', mockLocalStorage);

describe('MinesweeperEngine (Dò Mìn Phép Thuật — 777 Màn) & FishShooterEngine (Bắn Cá Hồ Đen — 777 Màn)', () => {
  beforeEach(() => {
    storageMap.clear();
  });

  it('MinesweeperEngine guarantees a safe 0-mine 3x3 opening cascade on first tap across stages 1..777', () => {
    for (const stage of [1, 25, 200, 777]) {
      const me = new MinesweeperEngine(stage);
      expect(me.minesGenerated).toBe(false);
      const res = me.tapCell(0, 0);
      expect(res.action).toBe('revealed');
      expect(res.lost).toBe(false);
      expect(me.minesGenerated).toBe(true);
      expect(me.grid[0][0].hasMine).toBe(false);
      expect(me.grid[0][0].adjacentMines).toBe(0);
      expect(res.revealedCells.length).toBeGreaterThanOrEqual(4);

      let mineCount = 0;
      for (let r = 0; r < me.rows; r++) {
        for (let c = 0; c < me.cols; c++) {
          if (me.grid[r][c].hasMine) mineCount++;
        }
      }
      expect(mineCount).toBe(me.totalMines);
    }
  });

  it('MinesweeperEngine supports flag toggle, chord reveal, shield protection, Phoenix Talisman revive & win detection', () => {
    const me = new MinesweeperEngine(1, 42);
    me.shieldsLeft = 1;
    me.tapCell(0, 0);

    // Find a mine cell and trigger it with 1 shield left -> shield saves and defuses it!
    let mineA: { r: number; c: number } | null = null;
    let mineB: { r: number; c: number } | null = null;
    for (let r = 0; r < me.rows; r++) {
      for (let c = 0; c < me.cols; c++) {
        if (me.grid[r][c].hasMine) {
          if (!mineA) mineA = { r, c };
          else if (!mineB) mineB = { r, c };
        }
      }
    }
    expect(mineA).toBeTruthy();
    expect(mineB).toBeTruthy();

    const saveRes = me.tapCell(mineA!.r, mineA!.c);
    expect(saveRes.action).toBe('shield_saved');
    expect(saveRes.shieldSaved).toBe(true);
    expect(me.shieldsLeft).toBe(0);
    expect(me.status).toBe('playing');
    expect(me.grid[mineA!.r][mineA!.c].defused).toBe(true);

    // Tapping a flagged cell in reveal mode never detonates it
    me.toggleFlag(mineB!.r, mineB!.c);
    expect(me.grid[mineB!.r][mineB!.c].flagged).toBe(true);
    expect(me.tapCell(mineB!.r, mineB!.c).action).toBe('blocked_flag');

    // Unflag and step on mineB with 0 shields -> exploded loss
    me.toggleFlag(mineB!.r, mineB!.c);
    const boomRes = me.tapCell(mineB!.r, mineB!.c);
    expect(boomRes.action).toBe('exploded');
    expect(boomRes.lost).toBe(true);
    expect(me.status).toBe('lost');

    // Phoenix Talisman revives cleanly and grants +1 shield
    const talRes = me.applyPhoenixTalisman();
    expect(talRes.ok).toBe(true);
    expect(me.status).toBe('playing');
    expect(me.explodedCell).toBeNull();
    expect(me.shieldsLeft).toBeGreaterThanOrEqual(1);

    // Session save & sanitize round-trip
    const snap = me.exportSession({ companionCharge: 3, snackPieUsed: true });
    expect(sanitizeSavedMinesweeperSession(snap, 1)).toBeTruthy();
    const me2 = new MinesweeperEngine(1);
    expect(me2.restoreSession(snap)).toBe(true);
    expect(me2.revealedSafeCount).toBe(me.revealedSafeCount);

    // Safe Radar Hint + clearing remaining safe cells triggers win
    const hint = me2.useSafeRadarHint();
    expect(hint.ok).toBe(true);
    for (let r = 0; r < me2.rows && me2.status === 'playing'; r++) {
      for (let c = 0; c < me2.cols && me2.status === 'playing'; c++) {
        if (!me2.grid[r][c].hasMine && !me2.grid[r][c].revealed) {
          me2.grid[r][c].flagged = false;
          me2.tapCell(r, c);
        }
      }
    }
    expect(me2.status).toBe('won');
  });

  it('MinesweeperEngine fresh layout per attemptSeed & strict Chord Reveal ONLY after manual flags are placed (never auto-flags)', () => {
    const a = new MinesweeperEngine(1, 101);
    const b = new MinesweeperEngine(1, 202);
    a.tapCell(0, 0);
    b.tapCell(0, 0);
    const layoutA: string[] = [];
    const layoutB: string[] = [];
    for (let r = 0; r < a.rows; r++) {
      for (let c = 0; c < a.cols; c++) {
        layoutA.push(a.grid[r][c].hasMine ? '1' : '0');
        layoutB.push(b.grid[r][c].hasMine ? '1' : '0');
      }
    }
    expect(layoutA.join('')).not.toBe(layoutB.join(''));

    // 1. Tapping a revealed number BEFORE placing flags must NEVER auto-flag neighbors
    let chordCandidate: {
      r: number;
      c: number;
      mineNeighbors: Array<{ r: number; c: number }>;
      safeNeighbors: Array<{ r: number; c: number }>;
    } | null = null;
    for (let r = 0; r < a.rows; r++) {
      for (let c = 0; c < a.cols; c++) {
        const cell = a.grid[r][c];
        if (!cell.revealed || cell.adjacentMines <= 0) continue;
        const mineNeighbors: Array<{ r: number; c: number }> = [];
        const safeNeighbors: Array<{ r: number; c: number }> = [];
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nb = a.grid[r + dr]?.[c + dc];
            if (!nb || nb.revealed) continue;
            if (nb.hasMine) mineNeighbors.push({ r: nb.r, c: nb.c });
            else safeNeighbors.push({ r: nb.r, c: nb.c });
          }
        }
        // Check even corner cells where unrevealed count === adjacentMines -> still must NOT auto-flag!
        if (mineNeighbors.length === cell.adjacentMines && safeNeighbors.length === 0) {
          const preTap = a.tapCell(r, c);
          expect(preTap.action).toBe('noop');
          for (const m of mineNeighbors) {
            expect(a.grid[m.r][m.c].flagged).toBe(false);
          }
        }
        if (!chordCandidate && mineNeighbors.length === cell.adjacentMines && safeNeighbors.length > 0) {
          chordCandidate = { r, c, mineNeighbors, safeNeighbors };
        }
      }
    }

    expect(chordCandidate).toBeTruthy();
    // Before placing flags: tapping the number is a noop and flags 0 cells
    expect(a.tapCell(chordCandidate!.r, chordCandidate!.c).action).toBe('noop');
    expect(a.flaggedCount).toBe(0);

    // 2. Place flags manually on the surrounding mines, THEN tap the number -> opens all surrounding safe cells!
    for (const m of chordCandidate!.mineNeighbors) {
      expect(a.toggleFlag(m.r, m.c).flagged).toBe(true);
    }
    const chordRes = a.tapCell(chordCandidate!.r, chordCandidate!.c);
    expect(chordRes.action).toBe('chord');
    expect(chordRes.revealedCells.length).toBeGreaterThanOrEqual(chordCandidate!.safeNeighbors.length);
    for (const s of chordCandidate!.safeNeighbors) {
      expect(a.grid[s.r][s.c].revealed).toBe(true);
    }
  });

  it('FishShooterEngine supports 3 cannon tiers, net capture, Pearl Condenser anti-softlock, Frost Skill & Phoenix Talisman', () => {
    const fe = new FishShooterEngine(1);
    expect(fe.fishList.length).toBeGreaterThanOrEqual(10);
    expect(fe.cannonTier).toBe(1);
    expect(fe.cycleCannonTier()).toBe(2);
    expect(fe.cycleCannonTier()).toBe(3);

    // Place a Puffer Bomb adjacent to a Minnow and fire Tier 3 bolt right into them
    fe.fishList = [
      {
        uid: 9001,
        species: 'puffer_bomb',
        x: 400,
        y: 220,
        baseY: 220,
        dir: 1,
        speed: 0,
        waveAmp: 0,
        waveFreq: 0,
        wavePhase: 0,
        tailPhase: 0,
        hp: 3,
        maxHp: 10,
        radius: 28,
        points: 1150,
        ammoDrop: 3,
        hitFlash: 0,
      },
      {
        uid: 9002,
        species: 'minnow',
        x: 460,
        y: 225,
        baseY: 225,
        dir: -1,
        speed: 0,
        waveAmp: 0,
        waveFreq: 0,
        wavePhase: 0,
        tailPhase: 0,
        hp: 2,
        maxHp: 2,
        radius: 17,
        points: 180,
        ammoDrop: 1,
        hitFlash: 0,
      },
    ];

    const shot = fe.fireShot(400, 220, false);
    expect(shot.fired).toBe(true);
    expect(shot.tier).toBe(3);
    expect(fe.bolts.length).toBe(1);

    // Step simulation until bolt detonates and puffer bomb chains into minnow
    let caughtAny = false;
    for (let i = 0; i < 20; i++) {
      const tr = fe.tick(0.05);
      if (tr.caughtEvents.length > 0) caughtAny = true;
    }
    expect(caughtAny).toBe(true);
    expect(fe.score).toBeGreaterThanOrEqual(1300);
    expect(fe.caughtCount).toBeGreaterThanOrEqual(2);

    // Pearl Condenser auto-regenerates ammo when ammo === 0
    fe.ammo = 0;
    for (let i = 0; i < 15; i++) {
      fe.tick(0.05);
    }
    expect(fe.ammo).toBeGreaterThanOrEqual(1);

    // Frost shockwave slows lake and awards ammo (test on stage 50 so score < targetScore before timeout test)
    const fe50 = new FishShooterEngine(50);
    const prevAmmo = fe50.ammo;
    const skill = fe50.useFrostShockwaveSkill();
    expect(skill.ok).toBe(true);
    expect(fe50.freezeTimer).toBeGreaterThan(0);
    expect(fe50.ammo).toBeGreaterThan(prevAmmo);

    // Timeout & Phoenix Talisman revive + must complete missions AND reach targetScore to win
    fe50.score = Math.min(fe50.score, fe50.targetScore - 100);
    fe50.status = 'playing';
    fe50.remainingSec = 0.02;
    const timeOutRes = fe50.tick(0.05);
    expect(timeOutRes.timedOut).toBe(true);
    expect(fe50.status).toBe('lost');

    const tal = fe50.applyPhoenixTalisman();
    expect(tal.ok).toBe(true);
    expect(fe50.status).not.toBe('lost');
    expect(fe50.remainingSec).toBeGreaterThan(20);

    // Reaching targetScore alone while stage missions remain incomplete does NOT win yet
    for (const m of fe50.missions) {
      m.current = 0;
      m.completed = false;
    }
    fe50.score = fe50.targetScore + 50;
    const blockedWinTick = fe50.tick(0.04);
    expect(blockedWinTick.won).toBe(false);
    expect(fe50.status).toBe('playing');

    // Completing all stage missions while score >= targetScore clears the stage
    for (const m of fe50.missions) {
      m.current = m.target;
      m.completed = true;
    }
    const winTick = fe50.tick(0.04);
    expect(winTick.won).toBe(true);
    expect(fe50.status).toBe('won');

    // Session save & sanitize round-trip
    const fe2 = new FishShooterEngine(777);
    fe2.score = 1234;
    fe2.setCannonTier(2);
    const saved = fe2.exportSession({ companionCharge: 2, snackPieUsed: false });
    expect(sanitizeSavedFishShooterSession(saved, 777)).toBeTruthy();
    const fe3 = new FishShooterEngine(777);
    expect(fe3.restoreSession(saved)).toBe(true);
    expect(fe3.score).toBe(1234);
    expect(fe3.cannonTier).toBe(2);
  });

  it('FishShooterEngine bolts fly through open water, ricochet off walls, award 3m timer + bonus seconds & Frost Skill never auto-wins Stage 1', () => {
    // 1. Stage 1 starts with 3 minutes (180s -> '03:00') & Frost Skill freezes lake without auto-winning
    const fe1 = new FishShooterEngine(1);
    expect(fe1.timeLimitSec).toBe(180);
    expect(fe1.formatRemainingTime()).toBe('03:00');
    const ammoBefore = fe1.ammo;
    const frost = fe1.useFrostShockwaveSkill();
    expect(frost.ok).toBe(true);
    expect(frost.won).toBe(false);
    expect(fe1.status).toBe('playing');
    expect(fe1.freezeTimer).toBeGreaterThan(0);
    expect(fe1.ammo).toBeGreaterThan(ammoBefore);
    expect(fe1.score).toBeLessThan(fe1.targetScore);

    // 1b. Catching a fish awards points ONLY and never adds bonus seconds to remainingSec
    const feBonus = new FishShooterEngine(1);
    feBonus.remainingSec = 179;
    feBonus.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 9801 + idx,
      species: (idx === 0 ? 'golden_ray' : 'minnow') as 'golden_ray' | 'minnow',
      x: idx === 0 ? 400 : 720,
      y: idx === 0 ? 280 : 120,
      baseY: idx === 0 ? 280 : 120,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: idx === 0 ? 1 : 3,
      maxHp: idx === 0 ? 1 : 3,
      radius: idx === 0 ? 36 : 17,
      points: 2200,
      ammoDrop: 4,
      hitFlash: 0,
    }));
    expect(feBonus.fireShot(400, 280, false).fired).toBe(true);
    let bonusEarned = 0;
    let totalCaught = 0;
    for (let i = 0; i < 15; i++) {
      const tr = feBonus.tick(0.05);
      for (const ev of tr.caughtEvents) {
        totalCaught += 1;
        bonusEarned += ev.bonusTimeSec;
      }
    }
    expect(totalCaught).toBeGreaterThanOrEqual(1);
    expect(bonusEarned).toBe(0);
    expect(feBonus.remainingSec).toBeLessThan(179);

    // 2. Bolt aimed short into open water keeps flying past the click point & ricochets off wall
    // Fill desiredCount (13) stationary fish on far bottom-right so no random left-side school spawns in the flight path
    const feWall = new FishShooterEngine(1);
    feWall.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 9901 + idx,
      species: 'emerald_koi' as const,
      x: 690 + (idx % 3) * 18,
      y: 380 + Math.floor(idx / 3) * 12,
      baseY: 380,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 7,
      maxHp: 7,
      radius: 26,
      points: 680,
      ammoDrop: 2,
      hitFlash: 0,
    }));
    feWall.aimX = 240;
    feWall.aimY = 380;
    const shot = feWall.fireShot(240, 380, false);
    expect(shot.fired).toBe(true);
    expect(feWall.bolts.length).toBe(1);
    const initialVx = feWall.bolts[0].vx;
    expect(initialVx).toBeLessThan(0);

    // Advance past the clicked distance (aimX=240, aimY=380 -> ~208px from turret): bolt should NOT detonate mid-water
    for (let i = 0; i < 6; i++) {
      feWall.tick(0.05);
    }
    expect(feWall.bolts.length).toBe(1);
    expect(feWall.nets.length).toBe(0);

    // Advance until bolt hits left wall and bounces back right (vx flips sign, bouncesLeft drops 1 -> 0)
    let bounced = false;
    for (let i = 0; i < 20; i++) {
      const tr = feWall.tick(0.05);
      if (tr.wallBounces && tr.wallBounces.length > 0) {
        bounced = true;
        break;
      }
    }
    expect(bounced).toBe(true);
    expect(feWall.bolts.length).toBe(1);
    expect(feWall.bolts[0].vx).toBeGreaterThan(0);
    expect(feWall.bolts[0].bouncesLeft).toBe(0);
  });

  it('FishShooterEngine uses high-score targets, tougher armor, tier bonus & fizzle combo-reset', () => {
    const fe1 = new FishShooterEngine(1);
    const feBoss = new FishShooterEngine(50);
    const fe777 = new FishShooterEngine(777);
    expect(fe1.targetScore).toBeGreaterThanOrEqual(12000);
    expect(feBoss.targetScore).toBeGreaterThan(fe1.targetScore);
    expect(fe777.targetScore).toBeGreaterThanOrEqual(120000);
    expect(FISH_SPECIES_CATALOG.minnow.basePoints).toBeGreaterThanOrEqual(150);
    expect(FISH_SPECIES_CATALOG.leviathan_carp.basePoints).toBeGreaterThanOrEqual(4000);
    expect(FISH_SPECIES_CATALOG.leviathan_carp.baseHp).toBeGreaterThanOrEqual(30);

    // Cannon tier ×3 yields higher score on identical catch than tier ×1
    const mkTargetFish = () =>
      Array.from({ length: 13 }, (_, idx) => ({
        uid: 9500 + idx,
        species: 'emerald_koi' as const,
        x: idx === 0 ? 400 : 740,
        y: idx === 0 ? 320 : 120,
        baseY: idx === 0 ? 320 : 120,
        dir: 1 as const,
        speed: 0,
        waveAmp: 0,
        waveFreq: 0,
        wavePhase: 0,
        tailPhase: 0,
        hp: idx === 0 ? 1 : 7,
        maxHp: 7,
        radius: 26,
        points: 680,
        ammoDrop: 2,
        hitFlash: 0,
      }));

    const feT1 = new FishShooterEngine(1);
    feT1.fishList = mkTargetFish();
    feT1.setCannonTier(1);
    expect(feT1.fireShot(400, 320, false).fired).toBe(true);
    for (let i = 0; i < 15; i++) feT1.tick(0.05);

    const feT3 = new FishShooterEngine(1);
    feT3.fishList = mkTargetFish();
    feT3.setCannonTier(3);
    expect(feT3.fireShot(400, 320, false).fired).toBe(true);
    for (let i = 0; i < 15; i++) feT3.tick(0.05);

    expect(feT1.score).toBe(680);
    expect(feT3.score).toBeGreaterThan(feT1.score);

    // Complete miss fizzle (out of wall bounces hitting 0 fish) resets active combo to 0
    const feMiss = new FishShooterEngine(1);
    feMiss.combo = 4;
    feMiss.comboTimer = 2.0;
    feMiss.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 9600 + idx,
      species: 'minnow' as const,
      x: 740,
      y: 410,
      baseY: 410,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 2,
      maxHp: 2,
      radius: 17,
      points: 180,
      ammoDrop: 1,
      hitFlash: 0,
    }));
    expect(feMiss.fireShot(180, 360, false).fired).toBe(true);
    for (let i = 0; i < 65; i++) {
      feMiss.tick(0.05);
    }
    expect(feMiss.bolts.length).toBe(0);
    expect(feMiss.combo).toBe(0);
  });

  it('PuzzleArcadeModalController mounts Dò Mìn & Bắn Cá tabs with zero Cờ Vua / Cờ Caro UI', () => {
    class MockImage {
      public complete = false;
      public naturalWidth = 0;
      public naturalHeight = 0;
      public decoding = 'async';
      public onload: (() => void) | null = null;
      public set src(_v: string) {}
    }
    const listeners = new Map<string, Array<(ev: unknown) => void>>();
    const contentEl: Record<string, unknown> = {
      innerHTML: '',
      scrollTop: 0,
      scrollLeft: 0,
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    const titleEl = { innerHTML: '' };
    const modalInnerEl = {
      classList: {
        toggle: () => {},
        remove: () => {},
        add: () => {},
      },
      style: {},
    };
    const dialogEl = {
      open: true,
      dataset: {} as Record<string, string>,
      showModal: () => {
        dialogEl.open = true;
      },
      close: () => {
        dialogEl.open = false;
      },
      addEventListener: () => {},
      querySelector: (sel: string) => (sel === '.pa-modal-inner' ? modalInnerEl : null),
    };
    const mockRoot = {
      querySelector: (sel: string) => {
        if (sel === '#puzzleArcadeDialog') return dialogEl;
        if (sel === '#puzzleArcadeDialogContent') return contentEl;
        if (sel === '#puzzleArcadeDialogTitle') return titleEl;
        if (sel === '#puzzleArcadeDialog .pa-modal-inner') return modalInnerEl;
        return null;
      },
      querySelectorAll: () => [],
    };
    vi.stubGlobal('Image', MockImage);
    vi.stubGlobal('requestAnimationFrame', () => 1);
    vi.stubGlobal('cancelAnimationFrame', () => {});
    vi.stubGlobal('document', {
      hidden: false,
      addEventListener: (t: string, cb: (ev: unknown) => void) => {
        const arr = listeners.get(t) ?? [];
        arr.push(cb);
        listeners.set(t, arr);
      },
      documentElement: { dataset: {} },
    });

    try {
      const sim = new ParkSimulation(new MagicalAudio());
      const ctrl = new PuzzleArcadeModalController(
        mockRoot as unknown as HTMLElement,
        sim,
        () => {},
        () => {},
        () => {}
      );

      ctrl.open('caro');
      expect(ctrl.minesEngine).toBeInstanceOf(MinesweeperEngine);
      const htmlCaro = String(contentEl.innerHTML);
      expect(htmlCaro).toContain('Dò Mìn');
      expect(htmlCaro).toContain('Bắn Cá');
      expect(htmlCaro).not.toContain('Cờ Phù Thủy');
      expect(htmlCaro).not.toContain('Cờ Vua');
      expect(htmlCaro).not.toContain('Ngũ Ấn');
      expect(htmlCaro).not.toContain('Cờ Caro');
      expect(titleEl.innerHTML).toContain('Dò Mìn Phép Thuật');

      expect(htmlCaro).toContain('mines_flag.webp');
      expect(htmlCaro).toContain('btnPaMinesDig');
      expect(htmlCaro).toContain('btnPaMinesFlag');
      expect(htmlCaro).toContain('paMinesFlags');
      expect(htmlCaro).toContain('m3_sp_bomb.webp');
      expect(htmlCaro).not.toContain('🧯');

      // Exploding a mine shows the on-stage loss bar (Chơi Lại + Về vườn), and reopening Dò Mìn starts fresh
      const me = ctrl.minesEngine!;
      me.shieldsLeft = 0;
      me.tapCell(0, 0);
      let minePos: { r: number; c: number } | null = null;
      for (let r = 0; r < me.rows && !minePos; r++) {
        for (let c = 0; c < me.cols && !minePos; c++) {
          if (me.grid[r][c].hasMine) minePos = { r, c };
        }
      }
      expect(minePos).toBeTruthy();
      (
        ctrl as unknown as { handleMinesCellTap: (r: number, c: number) => void }
      ).handleMinesCellTap(minePos!.r, minePos!.c);
      expect(me.status).toBe('lost');
      const lostHtml = String(contentEl.innerHTML);
      expect(lostHtml).toContain('pa-loss-return-bar');
      expect(lostHtml).toContain('btnPaLossRetry');
      expect(lostHtml).toContain('Chơi Lại');
      expect(lostHtml).toContain('btnPaLossHome');
      expect(lostHtml).toContain('Về vườn');

      ctrl.open('caro');
      expect(ctrl.minesEngine?.status).toBe('playing');

      ctrl.switchMode('chess');
      expect(ctrl.fishEngine).toBeInstanceOf(FishShooterEngine);
      expect(ctrl.fishEngine?.autoFire).toBe(true);
      const htmlChess = String(contentEl.innerHTML);
      expect(titleEl.innerHTML).toContain('Bắn Cá Hồ Đen');
      expect(htmlChess).toContain('btnPaFishAuto');
      expect(htmlChess).toContain('Liên Thanh');
      expect(htmlChess).toContain('Ngọc ∞');
      expect(htmlChess).toContain('btnPaFishPower');
      expect(htmlChess).toContain('Đũa Phép');
      expect(htmlChess).toContain('btnPaFishSkill');
      expect(htmlChess).toContain('ui_icon_hammer_wand.webp');
      expect(htmlChess).toContain('m3_obs_ice.webp');
      expect(htmlChess).toContain('paFishMissionsBar');
      expect(htmlChess).toContain('Nhiệm vụ');
      expect(FISH_SPECIES_CATALOG.minnow.nameVi).toBe('Cá Plimpy Lam');
      expect(FISH_SPECIES_CATALOG.clown.nameVi).toBe('Quỷ Nước Grindylow');
      expect(FISH_SPECIES_CATALOG.leviathan_carp.nameVi).toBe('Mực Khổng Lồ Hồ Đen');
      expect(htmlChess).not.toContain('🧯');
      expect(htmlChess).not.toContain('💧');
    } finally {
      vi.unstubAllGlobals();
      vi.stubGlobal('localStorage', mockLocalStorage);
    }
  });

  it('FishShooterEngine fires continuously without running dry and equips 5 shootable in-game ammo drops', () => {
    const fe = new FishShooterEngine(5);
    expect(fe.autoFire).toBe(true);
    expect(FISH_SPECIAL_WEAPON_IDS).toEqual([
      'trident_spread',
      'chain_lightning',
      'piercing_lance',
      'vortex_bomb',
      'rapid_frost',
    ]);

    // 1. Continuous unlimited firing never stalls even when ammo === 0 across 80+ shots
    fe.ammo = 0;
    fe.setCannonTier(3);
    let firedCount = 0;
    for (let i = 0; i < 85; i++) {
      fe.fireCooldown = 0;
      const res = fe.fireShot(400, 260, false);
      expect(res.fired).toBe(true);
      expect(res.tier).toBe(3);
      firedCount += 1;
    }
    expect(firedCount).toBe(85);
    fe.bolts = [];

    // 2. Periodic ocean current spawns floating ammo drop & shooting it equips the weapon
    const feDrop = new FishShooterEngine(2);
    feDrop.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 8100 + idx,
      species: 'minnow' as const,
      x: 740,
      y: 110,
      baseY: 110,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 5,
      maxHp: 5,
      radius: 17,
      points: 180,
      ammoDrop: 1,
      hitFlash: 0,
    }));
    const spawned = feDrop.spawnAmmoDrop('trident_spread', 400, 320);
    spawned.vx = 0;
    spawned.spawnGrace = 0;
    expect(feDrop.ammoDrops.length).toBe(1);

    feDrop.setCannonTier(1);
    expect(feDrop.fireShot(400, 320, false).fired).toBe(true);
    let collected = false;
    for (let i = 0; i < 12; i++) {
      const tr = feDrop.tick(0.04);
      if (tr.collectedDrops && tr.collectedDrops.length > 0) {
        collected = true;
        expect(tr.collectedDrops[0].weaponId).toBe('trident_spread');
      }
    }
    expect(collected).toBe(true);
    expect(feDrop.ammoDrops.length).toBe(0);
    expect(feDrop.activeWeapon).toBe('trident_spread');
    expect(feDrop.activeWeaponTimer).toBeGreaterThan(8);
    expect(FISH_WEAPON_CATALOG[feDrop.activeWeapon].nameVi).toBe('Đạn Đinh Ba 3 Tia');

    // Firing with trident_spread launches 3 diverging bolts in one shot
    feDrop.bolts = [];
    feDrop.fireCooldown = 0;
    expect(feDrop.fireShot(400, 240, false).fired).toBe(true);
    expect(feDrop.bolts.length).toBe(3);

    // 3. Rapid Frost fires twin shards with accelerated cooldown and chills hit fish
    feDrop.bolts = [];
    feDrop.equipWeaponDrop('rapid_frost');
    feDrop.fireCooldown = 0;
    feDrop.fishList[0].x = 400;
    feDrop.fishList[0].y = 330;
    feDrop.fishList[0].baseY = 330;
    feDrop.fishList[0].hp = 10;
    expect(feDrop.fireShot(400, 330, false).fired).toBe(true);
    expect(feDrop.bolts.length).toBe(2);
    expect(feDrop.fireCooldown).toBeLessThan(0.08);
    for (let i = 0; i < 10; i++) feDrop.tick(0.04);
    expect(feDrop.fishList[0].chillTimer).toBeGreaterThan(0);

    // 4. Piercing Lance slices straight through multiple aligned sea creatures in a single shot
    const fePierce = new FishShooterEngine(3);
    fePierce.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 8300 + idx,
      species: 'emerald_koi' as const,
      x: idx < 3 ? 400 : 740,
      y: idx < 3 ? 380 - idx * 75 : 110,
      baseY: idx < 3 ? 380 - idx * 75 : 110,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 10,
      maxHp: 10,
      radius: 26,
      points: 680,
      ammoDrop: 2,
      hitFlash: 0,
    }));
    fePierce.equipWeaponDrop('piercing_lance');
    fePierce.setCannonTier(2);
    expect(fePierce.fireShot(400, 180, false).fired).toBe(true);
    for (let i = 0; i < 14; i++) fePierce.tick(0.03);
    expect(fePierce.fishList[0].hp).toBeLessThan(10);
    expect(fePierce.fishList[1].hp).toBeLessThan(10);
    expect(fePierce.fishList[2].hp).toBeLessThan(10);

    // 5. Chain Lightning arcs across nearby sea creatures and spawns lightningArcs VFX
    const feZap = new FishShooterEngine(4);
    feZap.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 8500 + idx,
      species: 'moon_jelly' as const,
      x: idx < 4 ? 360 + idx * 45 : 750,
      y: idx < 4 ? 300 : 95,
      baseY: idx < 4 ? 300 : 95,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 12,
      maxHp: 12,
      radius: 25,
      points: 820,
      ammoDrop: 2,
      hitFlash: 0,
    }));
    feZap.equipWeaponDrop('chain_lightning');
    expect(feZap.fireShot(360, 300, false).fired).toBe(true);
    let sawArcs = false;
    for (let i = 0; i < 12; i++) {
      feZap.tick(0.03);
      if (feZap.lightningArcs.length > 0) sawArcs = true;
    }
    expect(sawArcs).toBe(true);
    expect(feZap.fishList[1].hp).toBeLessThan(12);
    expect(feZap.fishList[2].hp).toBeLessThan(12);

    // 6. Session export/restore preserves autoFire & activeWeaponTimer
    const saved = feZap.exportSession();
    const restored = new FishShooterEngine(4);
    expect(restored.restoreSession(saved)).toBe(true);
    expect(restored.activeWeapon).toBe('chain_lightning');
    expect(restored.activeWeaponTimer).toBeGreaterThan(0);

    // 7. Dynamic setArenaSize expands playable ocean to match full tall/wide background dimensions & preserves aimAngle
    const feTall = new FishShooterEngine(2);
    feTall.aimAt(200, 120);
    const angleBefore = feTall.aimAngle;
    feTall.setArenaSize(520, 880, 34);
    expect(feTall.arenaW).toBe(520);
    expect(feTall.arenaH).toBe(880);
    expect(feTall.turretX).toBe(260);
    expect(feTall.turretY).toBe(852);
    expect(feTall.aimAngle).toBeCloseTo(angleBefore, 2);

    // 8. Minesweeper restoreSession rejects corrupted mine counts / revealed mines, & infiniteShields protects Sandbox
    const meVal = new MinesweeperEngine(10);
    meVal.tapCell(0, 0);
    const validSnap = meVal.exportSession();
    const meCorruptCount = new MinesweeperEngine(10);
    expect(meCorruptCount.restoreSession({ ...validSnap, totalMines: validSnap.totalMines + 3 })).toBe(false);

    const meSandbox = new MinesweeperEngine(5);
    meSandbox.tapCell(0, 0);
    const shieldsBefore = meSandbox.shieldsLeft;
    let mineCoords: { r: number; c: number } | null = null;
    for (let r = 0; r < meSandbox.rows && !mineCoords; r++) {
      for (let c = 0; c < meSandbox.cols; c++) {
        if (meSandbox.grid[r][c].hasMine && !meSandbox.grid[r][c].defused) {
          mineCoords = { r, c };
          break;
        }
      }
    }
    expect(mineCoords).not.toBeNull();
    const shieldRes = meSandbox.tapCell(mineCoords!.r, mineCoords!.c, true);
    expect(shieldRes.action).toBe('shield_saved');
    expect(meSandbox.shieldsLeft).toBe(shieldsBefore);
  });

  it('prevents Stage 1 -> Stage 6 jumps across legacy saves, desynced *Cleared fields, pre-won sessions & stale victory callbacks', () => {
    // 1. Legacy pre-Minesweeper/pre-FishShooter save (missing arcadeDisciplineRev) with old Caro/Chess at Stage 6 / Cleared 5
    //    (even when autoFire already fired shots on FishShooter Stage 6!) resets cleanly to Stage 1 -> wins to Stage 2!
    const seedSim = new ParkSimulation(new MagicalAudio());
    const legacyRaw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
    const legacyPa = legacyRaw.puzzleArcade as Record<string, unknown>;
    delete legacyPa.arcadeDisciplineRev;
    legacyPa.caroStage = 1;
    legacyPa.caroCleared = 5; // Exact desync that previously jumped Stage 1 -> Stage 6 on win!
    legacyPa.chessStage = 6;
    legacyPa.chessCleared = 5;
    legacyPa.minesSession = new MinesweeperEngine(1).exportSession(); // 0 moves
    const autoFiredStage6 = new FishShooterEngine(6);
    autoFiredStage6.fireShot(340, 200);
    expect(autoFiredStage6.shotsFired).toBeGreaterThan(0);
    legacyPa.fishingSession = autoFiredStage6.exportSession(); // autoFire shots on legacy Stage 6
    (legacyRaw.stats as Record<string, unknown>).minigamesWon = 5;
    legacyPa.totalPuzzlesSolved = 5;
    mockLocalStorage.setItem('burrow_hogsmeade_777_v3', JSON.stringify(legacyRaw));

    const migratedSim = new ParkSimulation(new MagicalAudio());
    expect(migratedSim.state.puzzleArcade.arcadeDisciplineRev).toBe(2);
    expect(migratedSim.state.puzzleArcade.caroStage).toBe(1);
    expect(migratedSim.state.puzzleArcade.caroCleared).toBe(0);
    expect(migratedSim.state.puzzleArcade.chessStage).toBe(1);
    expect(migratedSim.state.puzzleArcade.chessCleared).toBe(0);
    expect(migratedSim.state.puzzleArcade.fishingSession).toBeNull();

    const winCaro1 = migratedSim.completePuzzleArcadeVictory(
      'caro',
      new MinesweeperEngine(1).reward,
      { sessionScore: 2600, completedStage: 1 }
    );
    expect(winCaro1.nextStage).toBe(2);
    expect(migratedSim.state.puzzleArcade.caroStage).toBe(2);
    expect(migratedSim.state.puzzleArcade.caroCleared).toBe(1);

    const winChess1 = migratedSim.completePuzzleArcadeVictory(
      'chess',
      new FishShooterEngine(1).reward,
      { sessionScore: 12500, completedStage: 1 }
    );
    expect(winChess1.nextStage).toBe(2);
    expect(migratedSim.state.puzzleArcade.chessStage).toBe(2);
    expect(migratedSim.state.puzzleArcade.chessCleared).toBe(1);

    // Reloading after arcadeDisciplineRev = 2 preserves Stage 2 progress
    const reloadedAfterV2 = new ParkSimulation(new MagicalAudio());
    expect(reloadedAfterV2.state.puzzleArcade.caroStage).toBe(2);
    expect(reloadedAfterV2.state.puzzleArcade.chessStage).toBe(2);

    // 2. Active mid-game Stage 1 Minesweeper (movesCount > 0) during migration preserves Stage 1 session cleanly
    const midMe = new MinesweeperEngine(1);
    midMe.tapCell(0, 0);
    expect(midMe.movesCount).toBeGreaterThan(0);
    const activeRaw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
    const activePa = activeRaw.puzzleArcade as Record<string, unknown>;
    delete activePa.arcadeDisciplineRev;
    activePa.caroStage = 1;
    activePa.caroCleared = 0;
    activePa.minesSession = midMe.exportSession();
    mockLocalStorage.setItem('burrow_hogsmeade_777_v3', JSON.stringify(activeRaw));

    const activeMigrated = new ParkSimulation(new MagicalAudio());
    expect(activeMigrated.state.puzzleArcade.caroStage).toBe(1);
    expect(activeMigrated.state.puzzleArcade.caroCleared).toBe(0);
    expect(activeMigrated.state.puzzleArcade.minesSession?.movesCount).toBeGreaterThan(0);

    // 3. Desynced Match-3 / Sudoku save on load reconciles (never leaves currentStage=1 with cleared=5)
    const desyncRaw = JSON.parse(seedSim.exportSaveJson()) as Record<string, unknown>;
    const desyncM3 = desyncRaw.match3 as Record<string, unknown>;
    desyncM3.currentLevel = 1;
    desyncM3.maxClearedLevel = 5;
    desyncM3.levelsWon = 0; // Never actually won any Match-3 stage -> heals corrupted maxClearedLevel to 0!
    const desyncPa = desyncRaw.puzzleArcade as Record<string, unknown>;
    desyncPa.sudokuStage = 1;
    desyncPa.sudokuCleared = 5;
    desyncPa.totalPuzzlesSolved = 5; // Actually solved 5 stages -> reconciles sudokuStage to 6!
    mockLocalStorage.setItem('burrow_hogsmeade_777_v3', JSON.stringify(desyncRaw));

    const healedSim = new ParkSimulation(new MagicalAudio());
    expect(healedSim.state.match3.currentLevel).toBe(1);
    expect(healedSim.state.match3.maxClearedLevel).toBe(0);
    expect(healedSim.state.puzzleArcade.sudokuStage).toBe(6);
    expect(healedSim.state.puzzleArcade.sudokuCleared).toBe(5);

    const m3Win1 = healedSim.completeMatch3LevelVictory(10, {
      sessionScore: 2500,
      completedStage: 1,
    });
    expect(m3Win1.nextLevel).toBe(2);
    expect(healedSim.state.match3.currentLevel).toBe(2);

    // 4. Stale / duplicate completedStage callback is ignored and never advances stage a second time
    const staleM3 = healedSim.completeMatch3LevelVictory(10, {
      sessionScore: 2500,
      completedStage: 1,
    });
    expect(staleM3.starsEarned).toBe(0);
    expect(healedSim.state.match3.currentLevel).toBe(2);

    const stalePa = healedSim.completePuzzleArcadeVictory(
      'sudoku',
      { stars: 2, sand: 0, gold: 40, xp: 20 },
      { sessionScore: 2400, completedStage: 5 }
    );
    expect(stalePa.starsEarned).toBe(0);
    expect(healedSim.state.puzzleArcade.sudokuStage).toBe(6);

    // 5. sanitizeSavedMinesweeperSession & sanitizeSavedFishShooterSession reject status='won' & auto-win scores
    const wonMe = new MinesweeperEngine(1).exportSession();
    expect(sanitizeSavedMinesweeperSession({ ...wonMe, status: 'won' }, 1)).toBeNull();

    const wonFe = new FishShooterEngine(1).exportSession();
    expect(sanitizeSavedFishShooterSession({ ...wonFe, status: 'won' }, 1)).toBeNull();

    const highScoreFe = new FishShooterEngine(1);
    const overTargetSnap = {
      ...highScoreFe.exportSession(),
      status: 'playing' as const,
      score: highScoreFe.targetScore + 5000,
    };
    const restoredFe = new FishShooterEngine(1);
    expect(restoredFe.restoreSession(overTargetSnap)).toBe(true);
    expect(restoredFe.score).toBe(restoredFe.targetScore - 1);
    expect(restoredFe.tick(0.016).won).toBe(false);

    // 6. sanitizeSavedJigsawSession & MasterJigsawEngine.restoreSession reject pre-won boards without mutating fresh engine
    const wonJe = new MasterJigsawEngine(1);
    while (wonJe.status !== 'won') {
      wonJe.useMagicHint();
    }
    const wonJigsawSnap = wonJe.exportSession();
    expect(sanitizeSavedJigsawSession(wonJigsawSnap, 1)).toBeNull();
    const freshJe = new MasterJigsawEngine(1);
    expect(freshJe.restoreSession({ ...wonJigsawSnap, status: 'playing' })).toBe(false);
    expect(freshJe.lockedCount).toBe(0);
    expect(freshJe.status).toBe('playing');
  });

  it('FishShooterEngine enforces stage missions before clearing, tracks species/weapon/combo missions, and persists mission progress', () => {
    // 1. Stage 1 has 1 species mission (minnow x4) & seeds target species in initial school
    const fe1 = new FishShooterEngine(1);
    expect(fe1.missions).toHaveLength(1);
    expect(fe1.missions[0].kind).toBe('catch_species');
    expect(fe1.missions[0].species).toBe('minnow');
    expect(fe1.missions[0].target).toBe(4);
    expect(fe1.isTargetMissionSpecies('minnow')).toBe(true);
    expect(fe1.isTargetMissionSpecies('golden_ray')).toBe(false);
    expect(fe1.fishList.some((f) => f.species === 'minnow')).toBe(true);

    // Reaching targetScore WITHOUT completing the mission keeps status = 'playing'
    fe1.score = fe1.targetScore + 2000;
    const blocked = fe1.tick(0.03);
    expect(blocked.won).toBe(false);
    expect(fe1.status).toBe('playing');
    expect(fe1.allMissionsCompleted).toBe(false);

    // Place 4 low-HP minnows directly ahead and shoot them down -> mission completes & stage clears
    fe1.fishList = Array.from({ length: 4 }, (_, idx) => ({
      uid: 7700 + idx,
      species: 'minnow' as const,
      x: 385 + idx * 10,
      y: 280,
      baseY: 280,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 1,
      maxHp: 2,
      radius: 17,
      points: 180,
      ammoDrop: 1,
      hitFlash: 0,
    }));
    fe1.setCannonTier(3);
    expect(fe1.fireShot(400, 280, false).fired).toBe(true);
    let wonAfterMission = false;
    let completedMissionIds: string[] = [];
    for (let i = 0; i < 20; i++) {
      const tr = fe1.tick(0.04);
      if (tr.completedMissions?.length) {
        completedMissionIds.push(...tr.completedMissions.map((m) => m.id));
      }
      if (tr.won) {
        wonAfterMission = true;
        break;
      }
    }
    expect(fe1.missions[0].completed).toBe(true);
    expect(fe1.missions[0].current).toBe(4);
    expect(completedMissionIds).toContain(fe1.missions[0].id);
    expect(wonAfterMission).toBe(true);
    expect(fe1.status).toBe('won');

    // 2. Stage 3 has a collect_weapon mission that completes when shooting a floating weapon drop
    const fe3 = new FishShooterEngine(3);
    expect(fe3.missions).toHaveLength(2);
    const weaponMission = fe3.missions.find((m) => m.kind === 'collect_weapon');
    expect(weaponMission).toBeDefined();
    expect(fe3.hasIncompleteWeaponMission).toBe(true);
    fe3.fishList = Array.from({ length: 13 }, (_, idx) => ({
      uid: 7800 + idx,
      species: 'minnow' as const,
      x: 740,
      y: 110,
      baseY: 110,
      dir: 1 as const,
      speed: 0,
      waveAmp: 0,
      waveFreq: 0,
      wavePhase: 0,
      tailPhase: 0,
      hp: 4,
      maxHp: 4,
      radius: 17,
      points: 180,
      ammoDrop: 1,
      hitFlash: 0,
    }));
    const orb = fe3.spawnAmmoDrop('chain_lightning', 400, 320);
    orb.vx = 0;
    orb.spawnGrace = 0;
    expect(fe3.fireShot(400, 320, false).fired).toBe(true);
    for (let i = 0; i < 15; i++) fe3.tick(0.04);
    expect(weaponMission!.completed).toBe(true);
    expect(fe3.hasIncompleteWeaponMission).toBe(false);

    // 3. Milestone Boss stages (e.g. Stage 25, 50) have 3 missions including leviathan_carp
    const feBoss25 = new FishShooterEngine(25);
    expect(feBoss25.milestoneBoss).not.toBeNull();
    expect(feBoss25.missions).toHaveLength(3);
    expect(feBoss25.missions[0].species).toBe('leviathan_carp');
    expect(feBoss25.missions[0].target).toBe(1);

    const feBoss50 = new FishShooterEngine(50);
    expect(feBoss50.milestoneBoss).not.toBeNull();
    expect(feBoss50.missions).toHaveLength(3);
    expect(feBoss50.missions[0].species).toBe('leviathan_carp');
    expect(feBoss50.missions[0].target).toBe(2);

    // 4. All 777 stages generate 1..3 valid missions with positive targets & every milestone boss stage requires leviathan_carp
    let bossStagesAudited = 0;
    for (let s = 1; s <= 777; s++) {
      const fe = new FishShooterEngine(s);
      expect(fe.missions.length).toBeGreaterThanOrEqual(1);
      expect(fe.missions.length).toBeLessThanOrEqual(3);
      if (fe.milestoneBoss !== null) {
        bossStagesAudited += 1;
        expect(fe.missions.length).toBe(3);
        expect(fe.missions[0].species).toBe('leviathan_carp');
      }
      for (const m of fe.missions) {
        expect(m.target).toBeGreaterThan(0);
        expect(m.labelVi.length).toBeGreaterThan(2);
        expect(m.current).toBe(0);
        expect(m.completed).toBe(false);
      }
    }
    expect(bossStagesAudited).toBeGreaterThanOrEqual(10);

    // 5. exportSession / restoreSession persists missionProgress accurately
    fe3.missions[0].current = 2;
    const snap3 = fe3.exportSession();
    expect(snap3.missionProgress).toEqual([2, 1]);
    const restored3 = new FishShooterEngine(3);
    expect(restored3.restoreSession(snap3)).toBe(true);
    expect(restored3.missions[0].current).toBe(2);
    expect(restored3.missions[0].completed).toBe(false);
    expect(restored3.missions[1].current).toBe(1);
    expect(restored3.missions[1].completed).toBe(true);
  });
});
