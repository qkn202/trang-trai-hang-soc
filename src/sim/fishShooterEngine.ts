import { SavedFishShooterSession } from '../types/game';
import {
  MAX_MINIGAME_STAGE,
  MilestoneBossMeta,
  PuzzleRewardSpec,
  TurningPointReview,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getStageStarReward,
  mulberry32,
} from './puzzleShared';

export const FISH_ARENA_W = 800;
export const FISH_ARENA_H = 540;
export const FISH_STAGE_TIME_LIMIT_SEC = 180;
export const FISH_MAX_TIME_SEC = 600;

export type FishSpeciesId =
  | 'minnow'
  | 'clown'
  | 'emerald_koi'
  | 'moon_jelly'
  | 'puffer_bomb'
  | 'golden_ray'
  | 'leviathan_carp';

export interface FishSpeciesDef {
  id: FishSpeciesId;
  nameVi: string;
  radius: number;
  baseHp: number;
  basePoints: number;
  ammoDrop: number;
  timeBonusSec: number;
  minSpeed: number;
  maxSpeed: number;
  bodyColor: string;
  bellyColor: string;
  finColor: string;
  stripeColor: string;
}

export const FISH_SPECIES_CATALOG: Record<FishSpeciesId, FishSpeciesDef> = {
  minnow: {
    id: 'minnow',
    nameVi: 'Cá Plimpy Lam',
    radius: 17,
    baseHp: 2,
    basePoints: 180,
    ammoDrop: 1,
    timeBonusSec: 0,
    minSpeed: 118,
    maxSpeed: 162,
    bodyColor: '#0284c7',
    bellyColor: '#bae6fd',
    finColor: '#fde047',
    stripeColor: '#38bdf8',
  },
  clown: {
    id: 'clown',
    nameVi: 'Quỷ Nước Grindylow',
    radius: 22,
    baseHp: 4,
    basePoints: 360,
    ammoDrop: 1,
    timeBonusSec: 1,
    minSpeed: 96,
    maxSpeed: 136,
    bodyColor: '#4d7c0f',
    bellyColor: '#d9f99d',
    finColor: '#a3e635',
    stripeColor: '#1a2e05',
  },
  emerald_koi: {
    id: 'emerald_koi',
    nameVi: 'Thủy Xà Slytherin',
    radius: 26,
    baseHp: 7,
    basePoints: 680,
    ammoDrop: 2,
    timeBonusSec: 2,
    minSpeed: 84,
    maxSpeed: 118,
    bodyColor: '#059669',
    bellyColor: '#d1fae5',
    finColor: '#e2e8f0',
    stripeColor: '#064e3b',
  },
  moon_jelly: {
    id: 'moon_jelly',
    nameVi: 'Linh Quang Hộ Mệnh',
    radius: 25,
    baseHp: 8,
    basePoints: 820,
    ammoDrop: 2,
    timeBonusSec: 2,
    minSpeed: 64,
    maxSpeed: 92,
    bodyColor: '#60a5fa',
    bellyColor: '#f0f9ff',
    finColor: '#bae6fd',
    stripeColor: '#818cf8',
  },
  puffer_bomb: {
    id: 'puffer_bomb',
    nameVi: 'Thủy Lôi Pháo Hoa Weasley',
    radius: 28,
    baseHp: 10,
    basePoints: 1150,
    ammoDrop: 3,
    timeBonusSec: 3,
    minSpeed: 74,
    maxSpeed: 104,
    bodyColor: '#9333ea',
    bellyColor: '#fde047',
    finColor: '#f97316',
    stripeColor: '#581c87',
  },
  golden_ray: {
    id: 'golden_ray',
    nameVi: 'Snitch Thủy Hoàng Kim',
    radius: 36,
    baseHp: 18,
    basePoints: 2200,
    ammoDrop: 4,
    timeBonusSec: 5,
    minSpeed: 70,
    maxSpeed: 96,
    bodyColor: '#eab308',
    bellyColor: '#fef9c3',
    finColor: '#f8fafc',
    stripeColor: '#a16207',
  },
  leviathan_carp: {
    id: 'leviathan_carp',
    nameVi: 'Mực Khổng Lồ Hồ Đen',
    radius: 45,
    baseHp: 34,
    basePoints: 4800,
    ammoDrop: 6,
    timeBonusSec: 8,
    minSpeed: 58,
    maxSpeed: 82,
    bodyColor: '#9f1239',
    bellyColor: '#fda4af',
    finColor: '#facc15',
    stripeColor: '#4c0519',
  },
};

export interface SwimmingFish {
  uid: number;
  species: FishSpeciesId;
  x: number;
  y: number;
  baseY: number;
  dir: 1 | -1;
  speed: number;
  waveAmp: number;
  waveFreq: number;
  wavePhase: number;
  tailPhase: number;
  hp: number;
  maxHp: number;
  radius: number;
  points: number;
  ammoDrop: number;
  hitFlash: number;
}

export interface CannonBolt {
  uid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tier: 1 | 2 | 3;
  bouncesLeft: number;
  age: number;
  maxAge: number;
  bouncedThisTick?: boolean;
}

export interface CaptureNetVfx {
  x: number;
  y: number;
  radius: number;
  tier: 1 | 2 | 3;
  age: number;
  duration: number;
  isExplosion?: boolean;
}

export interface FloatingFishPopup {
  x: number;
  y: number;
  text: string;
  color: string;
  age: number;
  duration: number;
}

export interface FishTickResult {
  timedOut: boolean;
  won: boolean;
  wholeSecondChanged: boolean;
  caughtEvents: Array<{
    x: number;
    y: number;
    species: FishSpeciesId;
    pointsEarned: number;
    bonusTimeSec: number;
    isExplosion: boolean;
  }>;
  wallBounces?: Array<{ x: number; y: number }>;
}

export function sanitizeSavedFishShooterSession(
  raw: unknown,
  expectedStage: number
): SavedFishShooterSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const stage = Math.round(Number(r.stage));
  if (!Number.isFinite(stage) || stage !== expectedStage || stage < 1 || stage > MAX_MINIGAME_STAGE) {
    return null;
  }
  const timeLimitSec = Math.max(30, Math.min(FISH_MAX_TIME_SEC, Number(r.timeLimitSec) || FISH_STAGE_TIME_LIMIT_SEC));
  const remainingSec = Math.max(0, Math.min(FISH_MAX_TIME_SEC, Number(r.remainingSec) || 0));
  const targetScore = Math.max(200, Math.min(500000, Math.round(Number(r.targetScore) || 12500)));
  const score = Math.max(0, Math.min(9999999, Math.round(Number(r.score) || 0)));
  const cannonTier = r.cannonTier === 2 || r.cannonTier === 3 ? r.cannonTier : 1;
  const status = r.status === 'won' || r.status === 'lost' ? r.status : 'playing';

  return {
    v: 1,
    stage,
    score,
    targetScore,
    ammo: Math.max(0, Math.min(999, Math.round(Number(r.ammo ?? 40)) || 0)),
    cannonTier,
    remainingSec,
    timeLimitSec,
    combo: Math.max(0, Math.min(99, Math.round(Number(r.combo ?? 0)) || 0)),
    maxCombo: Math.max(0, Math.min(99, Math.round(Number(r.maxCombo ?? 0)) || 0)),
    caughtCount: Math.max(0, Math.round(Number(r.caughtCount ?? 0)) || 0),
    shotsFired: Math.max(0, Math.round(Number(r.shotsFired ?? 0)) || 0),
    freeSkillsLeft: Math.max(0, Math.min(9, Math.round(Number(r.freeSkillsLeft ?? 0)) || 0)),
    paidSkillsLeft: Math.max(0, Math.min(9, Math.round(Number(r.paidSkillsLeft ?? 0)) || 0)),
    freezeTimer: Math.max(0, Math.min(15, Number(r.freezeTimer) || 0)),
    talismanUsed: Boolean(r.talismanUsed),
    status,
    companionCharge:
      typeof r.companionCharge === 'number' && Number.isFinite(r.companionCharge)
        ? Math.max(0, Math.round(r.companionCharge))
        : 0,
    snackPieUsed: Boolean(r.snackPieUsed),
  };
}

export class FishShooterEngine {
  public readonly stage: number;
  public readonly targetScore: number;
  public readonly timeLimitSec: number;
  public readonly reward: PuzzleRewardSpec;
  public readonly milestoneBoss: MilestoneBossMeta | null;

  public score = 0;
  public ammo: number;
  public cannonTier: 1 | 2 | 3 = 1;
  public remainingSec: number;
  public status: 'playing' | 'won' | 'lost' = 'playing';

  public aimX = FISH_ARENA_W * 0.5;
  public aimY = FISH_ARENA_H * 0.38;
  public aimAngle = -Math.PI * 0.5;
  public fireCooldown = 0;
  public cannonRecoil = 0;
  public freezeTimer = 0;
  public combo = 0;
  public maxCombo = 0;
  public comboTimer = 0;
  public caughtCount = 0;
  public shotsFired = 0;
  public ammoRegenTimer = 0;
  public timeFlashTimer = 0;
  public lastBonusSecAdded = 0;

  public freeSkillsLeft: number;
  public paidSkillsLeft: number;
  public readonly skillGoldCost = 55;
  public talismanUsed = false;

  public fishList: SwimmingFish[] = [];
  public bolts: CannonBolt[] = [];
  public nets: CaptureNetVfx[] = [];
  public popups: FloatingFishPopup[] = [];

  private nextUid = 1;
  private rng: () => number;
  private lastWholeSecond: number;

  public readonly turretX = FISH_ARENA_W * 0.5;
  public readonly turretY = FISH_ARENA_H - 28;

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    const tier = getMinigameDifficultyTier(this.stage);
    const isBoss = Boolean(this.milestoneBoss);

    const rawTarget = 12500 + Math.pow(this.stage - 1, 0.82) * 520 + (isBoss ? 4500 : 0);
    this.targetScore = Math.round(rawTarget / 100) * 100;
    this.timeLimitSec = FISH_STAGE_TIME_LIMIT_SEC;
    this.remainingSec = this.timeLimitSec;
    this.lastWholeSecond = Math.ceil(this.remainingSec);
    this.ammo = Math.min(88, 46 + Math.floor(this.stage / 32) * 2 + (isBoss ? 14 : 0));

    this.freeSkillsLeft = isBoss ? 2 : 1;
    this.paidSkillsLeft = 2;

    this.reward = {
      stars: getStageStarReward(this.stage),
      sand: isBoss ? 2 : 1,
      gold: Math.round(54 + tier.tierIndex * 15 + (isBoss ? 48 : 0)),
      xp: Math.round(38 + tier.tierIndex * 10 + (isBoss ? 32 : 0)),
    };

    this.rng = mulberry32((this.stage * 0x9e3779b1 + 0x7f4a7c15) >>> 0);
    this.seedInitialSchool();
  }

  private seedInitialSchool(): void {
    this.fishList = [];
    const targetCount = this.getDesiredFishCount();
    for (let i = 0; i < targetCount; i++) {
      const f = this.createFish(true, i === 0 && Boolean(this.milestoneBoss));
      this.fishList.push(f);
    }
  }

  private getDesiredFishCount(): number {
    return this.milestoneBoss ? 15 : 13;
  }

  private pickSpecies(forceBoss = false): FishSpeciesId {
    if (forceBoss) return 'leviathan_carp';
    const hasLeviathan = this.fishList.some((f) => f.species === 'leviathan_carp');
    const r = this.rng();
    if (!hasLeviathan && r > (this.milestoneBoss ? 0.86 : 0.94)) return 'leviathan_carp';
    if (r < 0.32) return 'minnow';
    if (r < 0.56) return 'clown';
    if (r < 0.74) return 'emerald_koi';
    if (r < 0.85) return 'moon_jelly';
    if (r < 0.925) return 'puffer_bomb';
    return 'golden_ray';
  }

  private createFish(inView: boolean, forceBoss = false): SwimmingFish {
    const species = this.pickSpecies(forceBoss);
    const def = FISH_SPECIES_CATALOG[species];
    const dir: 1 | -1 = this.rng() < 0.5 ? 1 : -1;
    const marginYTop = 62;
    const marginYBot = FISH_ARENA_H - 115;
    const baseY = marginYTop + this.rng() * Math.max(80, marginYBot - marginYTop);
    const x = inView
      ? 70 + this.rng() * (FISH_ARENA_W - 140)
      : dir === 1
        ? -def.radius - 16 - this.rng() * 55
        : FISH_ARENA_W + def.radius + 16 + this.rng() * 55;

    const hpScale = 1 + Math.min(1.15, Math.pow(this.stage - 1, 0.68) * 0.018);
    const hpBoost = species === 'leviathan_carp' && this.milestoneBoss ? 12 : 0;
    const maxHp = Math.max(2, Math.round(def.baseHp * hpScale) + hpBoost);
    const speedScale = 1 + Math.min(0.42, (this.stage - 1) * 0.0012);
    const speed = (def.minSpeed + this.rng() * (def.maxSpeed - def.minSpeed)) * speedScale;
    const pointScale = 1 + Math.min(1.6, Math.pow(this.stage - 1, 0.72) * 0.016);
    const points = Math.round((def.basePoints * pointScale) / 10) * 10;

    return {
      uid: this.nextUid++,
      species,
      x,
      y: baseY,
      baseY,
      dir,
      speed,
      waveAmp: species === 'moon_jelly' ? 22 : 9 + this.rng() * 12,
      waveFreq: 1.6 + this.rng() * 1.6,
      wavePhase: this.rng() * Math.PI * 2,
      tailPhase: this.rng() * Math.PI * 2,
      hp: maxHp,
      maxHp,
      radius: def.radius,
      points,
      ammoDrop: def.ammoDrop,
      hitFlash: 0,
    };
  }

  public aimAt(vx: number, vy: number): void {
    const clampedX = Math.max(20, Math.min(FISH_ARENA_W - 20, vx));
    const clampedY = Math.max(20, Math.min(this.turretY - 22, vy));
    this.aimX = clampedX;
    this.aimY = clampedY;
    const ang = Math.atan2(clampedY - this.turretY, clampedX - this.turretX);
    this.aimAngle = Math.max(-Math.PI + 0.16, Math.min(-0.16, ang));
  }

  public cycleCannonTier(): 1 | 2 | 3 {
    this.cannonTier = this.cannonTier === 1 ? 2 : this.cannonTier === 2 ? 3 : 1;
    return this.cannonTier;
  }

  public setCannonTier(tier: 1 | 2 | 3): void {
    this.cannonTier = tier;
  }

  public fireShot(
    vx: number,
    vy: number,
    isSandbox = false
  ): { fired: boolean; tier: 1 | 2 | 3; reason?: 'cooldown' | 'no_ammo' | 'ended' } {
    if (this.status !== 'playing') {
      return { fired: false, tier: this.cannonTier, reason: 'ended' };
    }
    this.aimAt(vx, vy);
    if (this.fireCooldown > 0) {
      return { fired: false, tier: this.cannonTier, reason: 'cooldown' };
    }
    if (!isSandbox && this.ammo <= 0) {
      return { fired: false, tier: this.cannonTier, reason: 'no_ammo' };
    }

    const effectiveTier: 1 | 2 | 3 = isSandbox
      ? this.cannonTier
      : ((Math.max(1, Math.min(this.cannonTier, this.ammo)) as 1 | 2 | 3));

    if (!isSandbox) {
      this.ammo = Math.max(0, this.ammo - effectiveTier);
    }

    const speed = 820;
    const cos = Math.cos(this.aimAngle);
    const sin = Math.sin(this.aimAngle);

    this.bolts.push({
      uid: this.nextUid++,
      x: this.turretX + cos * 30,
      y: this.turretY + sin * 30,
      vx: cos * speed,
      vy: sin * speed,
      tier: effectiveTier,
      bouncesLeft: 1,
      age: 0,
      maxAge: 2.6,
    });

    this.fireCooldown = effectiveTier === 1 ? 0.16 : effectiveTier === 2 ? 0.21 : 0.26;
    this.cannonRecoil = 1;
    this.shotsFired += 1;
    return { fired: true, tier: effectiveTier };
  }

  private detonateNet(
    nx: number,
    ny: number,
    radius: number,
    primaryDamage: number,
    splashDamage: number,
    tier: 1 | 2 | 3,
    isExplosion: boolean,
    caughtEvents: FishTickResult['caughtEvents'],
    primaryFishUid?: number
  ): number {
    this.nets.push({
      x: nx,
      y: ny,
      radius,
      tier,
      age: 0,
      duration: isExplosion ? 0.48 : 0.34,
      isExplosion,
    });

    let hitCount = 0;
    const newlyCaught: SwimmingFish[] = [];
    for (let i = this.fishList.length - 1; i >= 0; i--) {
      const f = this.fishList[i];
      const isPrimary = primaryFishUid !== undefined && f.uid === primaryFishUid;
      const d = Math.hypot(f.x - nx, f.y - ny);
      if (isPrimary || d <= radius + f.radius * 0.45) {
        hitCount += 1;
        const dmg = isPrimary || isExplosion ? primaryDamage : splashDamage;
        f.hp -= dmg;
        f.hitFlash = 0.16;
        if (f.hp <= 0) {
          this.fishList.splice(i, 1);
          newlyCaught.push(f);
        }
      }
    }

    const tierMult = tier === 3 ? 1.15 : tier === 2 ? 1.07 : 1.0;
    for (const f of newlyCaught) {
      this.combo += 1;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.comboTimer = 2.6;
      const comboMult = 1 + Math.min(1.0, Math.max(0, this.combo - 1) * 0.12);
      const ptsEarned = Math.round((f.points * comboMult * tierMult) / 5) * 5;
      this.score += ptsEarned;
      this.ammo = Math.min(999, this.ammo + f.ammoDrop);
      this.caughtCount += 1;

      const def = FISH_SPECIES_CATALOG[f.species];
      const bonusSec = def.timeBonusSec;
      if (this.status === 'playing' && bonusSec > 0) {
        this.remainingSec = Math.min(FISH_MAX_TIME_SEC, Math.max(0, this.remainingSec) + bonusSec);
        this.lastWholeSecond = Math.ceil(this.remainingSec);
        this.timeFlashTimer = 0.65;
        this.lastBonusSecAdded = bonusSec;
      }

      this.popups.push({
        x: f.x,
        y: f.y - 10,
        text:
          bonusSec > 0
            ? `+${ptsEarned.toLocaleString('vi-VN')}  +${bonusSec}s`
            : `+${ptsEarned.toLocaleString('vi-VN')}`,
        color: f.species === 'leviathan_carp' || f.species === 'golden_ray' ? '#fde047' : '#67e8f9',
        age: 0,
        duration: 0.9,
      });

      const isChainBomb = f.species === 'puffer_bomb';
      caughtEvents.push({
        x: f.x,
        y: f.y,
        species: f.species,
        pointsEarned: ptsEarned,
        bonusTimeSec: bonusSec,
        isExplosion: isChainBomb || isExplosion,
      });

      if (isChainBomb) {
        this.popups.push({
          x: f.x,
          y: f.y - 28,
          text: 'Pháo Hoa Weasley!',
          color: '#fb923c',
          age: 0,
          duration: 0.95,
        });
        this.detonateNet(f.x, f.y, 118, 5.5, 5.5, 3, true, caughtEvents);
      }
    }
    return hitCount;
  }

  public tick(dt: number, isSandbox = false): FishTickResult {
    const clampedDt = Math.max(0.001, Math.min(0.08, dt));
    const caughtEvents: FishTickResult['caughtEvents'] = [];
    const wallBounces: Array<{ x: number; y: number }> = [];

    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - clampedDt);
    if (this.cannonRecoil > 0) this.cannonRecoil = Math.max(0, this.cannonRecoil - clampedDt * 5.2);
    if (this.freezeTimer > 0) this.freezeTimer = Math.max(0, this.freezeTimer - clampedDt);
    if (this.timeFlashTimer > 0) this.timeFlashTimer = Math.max(0, this.timeFlashTimer - clampedDt);
    if (this.comboTimer > 0) {
      this.comboTimer = Math.max(0, this.comboTimer - clampedDt);
      if (this.comboTimer <= 0) this.combo = 0;
    }

    for (let i = this.nets.length - 1; i >= 0; i--) {
      this.nets[i].age += clampedDt;
      if (this.nets[i].age >= this.nets[i].duration) this.nets.splice(i, 1);
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].age += clampedDt;
      this.popups[i].y -= 26 * clampedDt;
      if (this.popups[i].age >= this.popups[i].duration) this.popups.splice(i, 1);
    }

    if (this.status !== 'playing') {
      return { timedOut: false, won: this.status === 'won', wholeSecondChanged: false, caughtEvents, wallBounces };
    }

    // Pearl condenser prevents soft-lock when ammo drops low
    if (!isSandbox && this.ammo < 18) {
      this.ammoRegenTimer += clampedDt;
      const interval = this.ammo === 0 ? 0.72 : this.ammo < 6 ? 1.85 : 2.6;
      if (this.ammoRegenTimer >= interval) {
        this.ammoRegenTimer -= interval;
        this.ammo += 1;
      }
    } else {
      this.ammoRegenTimer = 0;
    }

    const slowMult = this.freezeTimer > 0 ? 0.22 : 1.0;
    for (let i = this.fishList.length - 1; i >= 0; i--) {
      const f = this.fishList[i];
      if (f.hitFlash > 0) f.hitFlash = Math.max(0, f.hitFlash - clampedDt);
      const surge = 1 + 0.2 * Math.sin(f.wavePhase * 0.7);
      f.x += f.dir * f.speed * surge * slowMult * clampedDt;
      f.wavePhase += f.waveFreq * slowMult * clampedDt;
      f.tailPhase += (7 + f.speed * 0.045) * slowMult * clampedDt;
      f.y = Math.max(
        48,
        Math.min(FISH_ARENA_H - 96, f.baseY + Math.sin(f.wavePhase) * f.waveAmp)
      );
      if ((f.dir === 1 && f.x > FISH_ARENA_W + f.radius + 75) || (f.dir === -1 && f.x < -f.radius - 75)) {
        this.fishList.splice(i, 1);
      }
    }

    const desiredCount = this.getDesiredFishCount();
    while (this.fishList.length < desiredCount) {
      this.fishList.push(this.createFish(false, false));
    }

    // Move bolts in 2 sub-steps: wall ricochets + direct collision against fish
    const padL = 10;
    const padR = FISH_ARENA_W - 10;
    const padT = 12;
    const padB = FISH_ARENA_H - 18;
    const steps = 2;
    const subDt = clampedDt / steps;
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i];
      b.bouncedThisTick = false;
      let detonated = false;

      for (let s = 0; s < steps && !detonated; s++) {
        b.age += subDt;
        b.x += b.vx * subDt;
        b.y += b.vy * subDt;

        const hitX = b.x <= padL || b.x >= padR;
        const hitY = b.y <= padT || b.y >= padB;
        if (hitX || hitY) {
          if (b.bouncesLeft > 0) {
            if (b.x <= padL) {
              b.x = padL;
              b.vx = Math.abs(b.vx);
            } else if (b.x >= padR) {
              b.x = padR;
              b.vx = -Math.abs(b.vx);
            }
            if (b.y <= padT) {
              b.y = padT;
              b.vy = Math.abs(b.vy);
            } else if (b.y >= padB) {
              b.y = padB;
              b.vy = -Math.abs(b.vy);
            }
            b.bouncesLeft -= 1;
            b.bouncedThisTick = true;
            wallBounces.push({ x: b.x, y: b.y });
          } else {
            b.x = Math.max(padL, Math.min(padR, b.x));
            b.y = Math.max(padT, Math.min(padB, b.y));
            this.bolts.splice(i, 1);
            const fizzleR = b.tier === 1 ? 16 : b.tier === 2 ? 22 : 28;
            const hits = this.detonateNet(b.x, b.y, fizzleR, 0.5, 0.25, b.tier, false, caughtEvents);
            if (hits === 0) {
              this.combo = 0;
              this.comboTimer = 0;
            }
            detonated = true;
            break;
          }
        }

        let closestFish: SwimmingFish | null = null;
        let closestDist = Infinity;
        const hitPad = b.tier === 3 ? 10 : 7;
        for (const f of this.fishList) {
          const d = Math.hypot(f.x - b.x, f.y - b.y);
          if (d <= f.radius + hitPad && d < closestDist) {
            closestDist = d;
            closestFish = f;
          }
        }

        if (closestFish) {
          this.bolts.splice(i, 1);
          const radius = b.tier === 1 ? 22 : b.tier === 2 ? 36 : 52;
          const primaryDamage = b.tier === 1 ? 1.0 : b.tier === 2 ? 2.1 : 3.3;
          const splashDamage = b.tier === 1 ? 0.35 : b.tier === 2 ? 0.85 : 1.4;
          this.detonateNet(
            b.x,
            b.y,
            radius,
            primaryDamage,
            splashDamage,
            b.tier,
            false,
            caughtEvents,
            closestFish.uid
          );
          detonated = true;
          break;
        }
      }

      if (!detonated && b.age >= b.maxAge) {
        this.bolts.splice(i, 1);
        const fizzleR = b.tier === 1 ? 16 : b.tier === 2 ? 22 : 28;
        const hits = this.detonateNet(b.x, b.y, fizzleR, 0.5, 0.25, b.tier, false, caughtEvents);
        if (hits === 0) {
          this.combo = 0;
          this.comboTimer = 0;
        }
      }
    }

    if (this.score >= this.targetScore) {
      this.status = 'won';
      return { timedOut: false, won: true, wholeSecondChanged: true, caughtEvents, wallBounces };
    }

    let wholeSecondChanged = caughtEvents.length > 0;
    if (!isSandbox) {
      this.remainingSec = Math.max(0, this.remainingSec - clampedDt);
      const curWhole = Math.ceil(this.remainingSec);
      if (curWhole !== this.lastWholeSecond) {
        this.lastWholeSecond = curWhole;
        wholeSecondChanged = true;
      }
      if (this.remainingSec <= 0) {
        this.status = 'lost';
        return { timedOut: true, won: false, wholeSecondChanged: true, caughtEvents, wallBounces };
      }
    }

    return { timedOut: false, won: false, wholeSecondChanged, caughtEvents, wallBounces };
  }

  public useFrostShockwaveSkill(): {
    ok: boolean;
    zappedCount: number;
    won: boolean;
    caughtEvents: FishTickResult['caughtEvents'];
  } {
    if (this.status !== 'playing') {
      return { ok: false, zappedCount: 0, won: false, caughtEvents: [] };
    }
    this.freezeTimer = 5.5;
    this.ammo = Math.min(999, this.ammo + 8);

    const targets = [...this.fishList]
      .sort((a, b) => a.hp - b.hp)
      .slice(0, 3);
    const caughtEvents: FishTickResult['caughtEvents'] = [];
    for (const t of targets) {
      this.detonateNet(t.x, t.y, 28, 2.2, 1.0, 3, true, caughtEvents, t.uid);
    }

    const won = this.score >= this.targetScore;
    if (won) this.status = 'won';
    return { ok: true, zappedCount: targets.length, won, caughtEvents };
  }

  public applyPhoenixTalisman(): { ok: boolean; msg: string; won: boolean } {
    if (this.talismanUsed) {
      return {
        ok: false,
        msg: 'Bùa Phượng Hoàng chỉ dùng 1 lần/ngày cho Bắn Cá.',
        won: false,
      };
    }
    this.talismanUsed = true;
    const wasLost = this.status === 'lost';
    if (wasLost) {
      this.status = 'playing';
      this.remainingSec = Math.max(35, this.remainingSec);
    } else {
      this.remainingSec += 35;
    }
    this.lastWholeSecond = Math.ceil(this.remainingSec);
    this.ammo = Math.min(999, this.ammo + 30);
    this.freezeTimer = 6.0;

    const caughtEvents: FishTickResult['caughtEvents'] = [];
    this.detonateNet(FISH_ARENA_W * 0.5, FISH_ARENA_H * 0.44, 420, 14.0, 14.0, 3, true, caughtEvents);
    const won = this.score >= this.targetScore;
    if (won) this.status = 'won';

    return {
      ok: true,
      msg: won
        ? 'Bùa Phượng Hoàng: lưới lửa rực sáng thu trọn đàn cá đủ điểm thắng!'
        : 'Bùa Phượng Hoàng: +35s giờ, +30 Đạn Ngọc & đóng băng toàn Hồ Đen!',
      won,
    };
  }

  public applyApplePieBoost(): { ok: boolean; revived: boolean } {
    const revived = this.status === 'lost';
    if (revived) {
      this.status = 'playing';
      this.remainingSec = Math.max(25, this.remainingSec);
    } else {
      this.remainingSec += 25;
    }
    this.lastWholeSecond = Math.ceil(this.remainingSec);
    this.ammo = Math.min(999, this.ammo + 20);
    this.freeSkillsLeft += 1;
    return { ok: true, revived };
  }

  public get timeProgressRatio(): number {
    return Math.max(0, Math.min(1, this.remainingSec / Math.max(1, this.timeLimitSec)));
  }

  public get isTimeCritical(): boolean {
    return this.status === 'playing' && this.remainingSec <= 20;
  }

  public formatRemainingTime(): string {
    const total = Math.max(0, Math.ceil(this.remainingSec));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  public getTurningPointReview(): TurningPointReview | null {
    if (this.status === 'playing') return null;
    const scoreStr = this.score.toLocaleString('vi-VN');
    const targetStr = this.targetScore.toLocaleString('vi-VN');
    if (this.status === 'lost') {
      return {
        mode: 'chess',
        plyNumber: Math.max(1, this.shotsFired),
        outcomeTagVi: 'Hết giờ khảo thí Hồ Đen',
        playedCoordVi: `${scoreStr}/${targetStr} điểm (${this.caughtCount} thủy quái)`,
        recommendedCoordVi: 'Dùng Đũa ×3 nhắm Thủy Lôi Weasley & Mực Khổng Lồ',
        summaryVi: `Đạt ${scoreStr}/${targetStr} điểm dưới Hồ Đen. Kích nổ Thủy Lôi Pháo Hoa Weasley để gom cả đàn!`,
        highlightCells: [],
      };
    }
    return {
      mode: 'chess',
      plyNumber: Math.max(1, this.shotsFired),
      outcomeTagVi: 'Chinh phục Hồ Đen Hogwarts',
      playedCoordVi: `${this.caughtCount} sinh vật · Đỉnh combo ×${Math.max(1, this.maxCombo)}`,
      recommendedCoordVi: `${scoreStr}/${targetStr} điểm · Còn ${this.formatRemainingTime()}`,
      summaryVi: `Thu phục ${this.caughtCount} sinh vật Hồ Đen, đạt ${scoreStr} điểm với đỉnh combo ×${Math.max(1, this.maxCombo)}.`,
      highlightCells: [],
    };
  }

  public exportSession(extra?: {
    companionCharge?: number;
    snackPieUsed?: boolean;
  }): SavedFishShooterSession {
    return {
      v: 1,
      stage: this.stage,
      score: this.score,
      targetScore: this.targetScore,
      ammo: this.ammo,
      cannonTier: this.cannonTier,
      remainingSec: Math.round(this.remainingSec * 10) / 10,
      timeLimitSec: this.timeLimitSec,
      combo: this.combo,
      maxCombo: this.maxCombo,
      caughtCount: this.caughtCount,
      shotsFired: this.shotsFired,
      freeSkillsLeft: this.freeSkillsLeft,
      paidSkillsLeft: this.paidSkillsLeft,
      freezeTimer: Math.round(this.freezeTimer * 10) / 10,
      talismanUsed: this.talismanUsed,
      status: this.status,
      companionCharge: extra?.companionCharge ?? 0,
      snackPieUsed: Boolean(extra?.snackPieUsed),
    };
  }

  public restoreSession(raw: unknown): boolean {
    const s = sanitizeSavedFishShooterSession(raw, this.stage);
    if (!s) return false;
    this.score =
      s.status === 'playing' && s.targetScore > 0 && s.targetScore < 5000 && this.targetScore >= 10000
        ? Math.min(this.targetScore - 100, Math.round(s.score * (this.targetScore / s.targetScore)))
        : s.score;
    this.ammo = s.ammo;
    this.cannonTier = s.cannonTier;
    this.remainingSec =
      s.status === 'playing' && s.timeLimitSec < FISH_STAGE_TIME_LIMIT_SEC
        ? Math.min(FISH_MAX_TIME_SEC, s.remainingSec + (FISH_STAGE_TIME_LIMIT_SEC - s.timeLimitSec))
        : s.remainingSec;
    this.lastWholeSecond = Math.ceil(this.remainingSec);
    this.combo = s.combo;
    this.maxCombo = s.maxCombo;
    this.caughtCount = s.caughtCount;
    this.shotsFired = s.shotsFired;
    this.freeSkillsLeft = s.freeSkillsLeft;
    this.paidSkillsLeft = s.paidSkillsLeft;
    this.freezeTimer = s.freezeTimer;
    this.talismanUsed = s.talismanUsed;
    this.status = s.status;
    return true;
  }
}
