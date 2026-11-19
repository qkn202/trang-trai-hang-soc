import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  FISH_SPECIES_CATALOG,
  FishShooterEngine,
  MinesweeperEngine,
  sanitizeSavedFishShooterSession,
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

  it('MinesweeperEngine fresh layout per attemptSeed & Quick-Flag Chord on revealed number cells', () => {
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

    // Quick-Flag Chord: tapping a revealed cell whose unrevealed neighbor count equals adjacentMines flags them all
    let qfTarget: { r: number; c: number; hidden: Array<{ r: number; c: number }> } | null = null;
    for (let r = 0; r < a.rows && !qfTarget; r++) {
      for (let c = 0; c < a.cols && !qfTarget; c++) {
        const cell = a.grid[r][c];
        if (!cell.revealed || cell.adjacentMines <= 0) continue;
        const hidden: Array<{ r: number; c: number }> = [];
        let flaggedNb = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const nb = a.grid[r + dr]?.[c + dc];
            if (!nb) continue;
            if (nb.flagged || nb.defused) flaggedNb++;
            else if (!nb.revealed) hidden.push({ r: nb.r, c: nb.c });
          }
        }
        if (hidden.length > 0 && flaggedNb + hidden.length === cell.adjacentMines) {
          qfTarget = { r, c, hidden };
        }
      }
    }
    expect(qfTarget).toBeTruthy();
    const qfRes = a.tapCell(qfTarget!.r, qfTarget!.c);
    expect(qfRes.action).toBe('flagged');
    expect(qfRes.revealedCells.length).toBe(qfTarget!.hidden.length);
    for (const h of qfTarget!.hidden) {
      expect(a.grid[h.r][h.c].flagged).toBe(true);
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

    // Timeout & Phoenix Talisman revive + reach targetScore win
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

    fe50.score = fe50.targetScore + 50;
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

    // 1b. Catching a fish awards bonus seconds (even above 180s up to 600s) and sets bonusTimeSec on caughtEvents
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
    for (let i = 0; i < 15; i++) {
      const tr = feBonus.tick(0.05);
      for (const ev of tr.caughtEvents) bonusEarned += ev.bonusTimeSec;
    }
    expect(bonusEarned).toBeGreaterThanOrEqual(5);
    expect(feBonus.remainingSec).toBeGreaterThan(180);
    expect(feBonus.remainingSec).toBeLessThanOrEqual(600);

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

      expect(htmlCaro).toContain('phoenix_seal.webp');
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
      const htmlChess = String(contentEl.innerHTML);
      expect(titleEl.innerHTML).toContain('Bắn Cá Hồ Đen');
      expect(htmlChess).toContain('btnPaFishPower');
      expect(htmlChess).toContain('Đũa Phép');
      expect(htmlChess).toContain('btnPaFishSkill');
      expect(htmlChess).toContain('ui_icon_hammer_wand.webp');
      expect(htmlChess).toContain('m3_obs_ice.webp');
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
});
