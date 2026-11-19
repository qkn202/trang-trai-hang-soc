import { FishWeaponId, SavedFishShooterSession } from '../types/game';
export type { FishWeaponId };
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
    timeBonusSec: 0,
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
    timeBonusSec: 0,
    minSpeed: 84,
    maxSpeed: 118,
    bodyColor: '#059669',
    bellyColor: '#d1fae5',
    finColor: '#e2e8f0',
    stripeColor: '#064e3b',
  },
  moon_jelly: {
    id: 'moon_jelly',
    nameVi: 'Sứa Ánh Trăng Huyền Bí',
    radius: 25,
    baseHp: 8,
    basePoints: 820,
    ammoDrop: 2,
    timeBonusSec: 0,
    minSpeed: 64,
    maxSpeed: 92,
    bodyColor: '#38bdf8',
    bellyColor: '#f0f9ff',
    finColor: '#bae6fd',
    stripeColor: '#0284c7',
  },
  puffer_bomb: {
    id: 'puffer_bomb',
    nameVi: 'Cá Nóc Gai Tinh Quang',
    radius: 28,
    baseHp: 10,
    basePoints: 1150,
    ammoDrop: 3,
    timeBonusSec: 0,
    minSpeed: 74,
    maxSpeed: 104,
    bodyColor: '#f59e0b',
    bellyColor: '#fef3c7',
    finColor: '#14b8a6',
    stripeColor: '#b45309',
  },
  golden_ray: {
    id: 'golden_ray',
    nameVi: 'Cá Đuối Hoàng Kim',
    radius: 36,
    baseHp: 18,
    basePoints: 2200,
    ammoDrop: 4,
    timeBonusSec: 0,
    minSpeed: 70,
    maxSpeed: 96,
    bodyColor: '#eab308',
    bellyColor: '#fef9c3',
    finColor: '#38bdf8',
    stripeColor: '#a16207',
  },
  leviathan_carp: {
    id: 'leviathan_carp',
    nameVi: 'Mực Khổng Lồ Hồ Đen',
    radius: 45,
    baseHp: 34,
    basePoints: 4800,
    ammoDrop: 6,
    timeBonusSec: 0,
    minSpeed: 58,
    maxSpeed: 82,
    bodyColor: '#9f1239',
    bellyColor: '#fda4af',
    finColor: '#facc15',
    stripeColor: '#4c0519',
  },
};

export type FishSpecialWeaponId = Exclude<FishWeaponId, 'normal'>;

export interface FishWeaponDef {
  id: FishWeaponId;
  nameVi: string;
  shortVi: string;
  badgeVi: string;
  durationSec: number;
  cooldownScale: number;
  boltSpeed: number;
  accentColor: string;
  coreColor: string;
}

export const FISH_SPECIAL_WEAPON_IDS: readonly FishSpecialWeaponId[] = [
  'trident_spread',
  'chain_lightning',
  'piercing_lance',
  'vortex_bomb',
  'rapid_frost',
];

export const FISH_WEAPON_CATALOG: Record<FishWeaponId, FishWeaponDef> = {
  normal: {
    id: 'normal',
    nameVi: 'Đạn Ngọc Hải Vương',
    shortVi: 'Ngọc ∞',
    badgeVi: 'NGỌC ∞',
    durationSec: 0,
    cooldownScale: 1,
    boltSpeed: 840,
    accentColor: '#67e8f9',
    coreColor: '#38bdf8',
  },
  trident_spread: {
    id: 'trident_spread',
    nameVi: 'Đạn Đinh Ba 3 Tia',
    shortVi: '3 Tia',
    badgeVi: '3 TIA',
    durationSec: 13,
    cooldownScale: 0.92,
    boltSpeed: 880,
    accentColor: '#2dd4bf',
    coreColor: '#fde047',
  },
  chain_lightning: {
    id: 'chain_lightning',
    nameVi: 'Đạn Sét Điện Quang',
    shortVi: 'Sét Lan',
    badgeVi: 'SÉT LAN',
    durationSec: 12,
    cooldownScale: 0.9,
    boltSpeed: 1040,
    accentColor: '#38bdf8',
    coreColor: '#c084fc',
  },
  piercing_lance: {
    id: 'piercing_lance',
    nameVi: 'Đạn Mũi Lao Xuyên',
    shortVi: 'Xuyên Thấu',
    badgeVi: 'XUYÊN',
    durationSec: 12,
    cooldownScale: 0.94,
    boltSpeed: 980,
    accentColor: '#34d399',
    coreColor: '#fef08a',
  },
  vortex_bomb: {
    id: 'vortex_bomb',
    nameVi: 'Đạn Xoáy Nổ Lan',
    shortVi: 'Xoáy Nổ',
    badgeVi: 'XOÁY NỔ',
    durationSec: 11,
    cooldownScale: 1.04,
    boltSpeed: 760,
    accentColor: '#fb7185',
    coreColor: '#2dd4bf',
  },
  rapid_frost: {
    id: 'rapid_frost',
    nameVi: 'Đạn Băng Tinh Tốc Xạ',
    shortVi: 'Băng Tốc',
    badgeVi: 'BĂNG TỐC',
    durationSec: 12,
    cooldownScale: 0.48,
    boltSpeed: 940,
    accentColor: '#bae6fd',
    coreColor: '#60a5fa',
  },
};

export interface FloatingAmmoDrop {
  uid: number;
  weaponId: FishSpecialWeaponId;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  bobPhase: number;
  radius: number;
  age: number;
  maxAge: number;
  spawnGrace: number;
}

export interface ChainLightningArcVfx {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  age: number;
  duration: number;
}

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
  chillTimer?: number;
}

export interface CannonBolt {
  uid: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tier: 1 | 2 | 3;
  weaponId?: FishWeaponId;
  bouncesLeft: number;
  piercesLeft?: number;
  hitFishUids?: number[];
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
  weaponId?: FishWeaponId;
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
  collectedDrops?: Array<{
    x: number;
    y: number;
    weaponId: FishSpecialWeaponId;
    nameVi: string;
    color: string;
  }>;
  wallBounces?: Array<{ x: number; y: number }>;
}

function sanitizeWeaponId(raw: unknown): FishWeaponId {
  if (
    raw === 'trident_spread' ||
    raw === 'chain_lightning' ||
    raw === 'piercing_lance' ||
    raw === 'vortex_bomb' ||
    raw === 'rapid_frost'
  ) {
    return raw;
  }
  return 'normal';
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
  if (r.status !== 'playing' && r.status !== 'lost') {
    return null;
  }
  const status = r.status;
  const rawWeaponTimer = Math.max(0, Math.min(30, Number(r.activeWeaponTimer) || 0));
  const rawWeapon = sanitizeWeaponId(r.activeWeapon);
  const activeWeapon: FishWeaponId = rawWeapon !== 'normal' && rawWeaponTimer > 0 ? rawWeapon : 'normal';

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
    autoFire: r.autoFire === undefined ? true : Boolean(r.autoFire),
    activeWeapon,
    activeWeaponTimer: activeWeapon === 'normal' ? 0 : rawWeaponTimer,
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

  public arenaW = FISH_ARENA_W;
  public arenaH = FISH_ARENA_H;
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

  public autoFire = true;
  public activeWeapon: FishWeaponId = 'normal';
  public activeWeaponTimer = 0;
  public activeWeaponMaxTimer = 12;
  public ammoDropSpawnTimer = 3.6;
  public fishDropCooldown = 0;

  public fishList: SwimmingFish[] = [];
  public bolts: CannonBolt[] = [];
  public nets: CaptureNetVfx[] = [];
  public popups: FloatingFishPopup[] = [];
  public ammoDrops: FloatingAmmoDrop[] = [];
  public lightningArcs: ChainLightningArcVfx[] = [];

  private nextUid = 1;
  private rng: () => number;
  private lastWholeSecond: number;

  public get turretX(): number {
    return this.arenaW * 0.5;
  }

  public get turretY(): number {
    return this.arenaH - 28;
  }

  public setArenaSize(nextW: number, nextH: number, topHudArenaPad?: number): void {
    const clampedW = Math.max(360, Math.min(2400, Math.round(nextW)));
    const clampedH = Math.max(360, Math.min(2400, Math.round(nextH)));
    if (topHudArenaPad !== undefined && Number.isFinite(topHudArenaPad)) {
      this.customTopMarginY = Math.max(62, Math.min(180, Math.round(topHudArenaPad)));
    }
    if (Math.abs(clampedW - this.arenaW) < 2 && Math.abs(clampedH - this.arenaH) < 2) {
      return;
    }
    const prevAngle = this.aimAngle;
    const prevDist = Math.max(80, Math.hypot(this.aimX - this.turretX, this.aimY - this.turretY));
    const rx = clampedW / Math.max(1, this.arenaW);
    const ry = clampedH / Math.max(1, this.arenaH);
    this.arenaW = clampedW;
    this.arenaH = clampedH;

    const topSafeY = this.getTopSwimMarginY();
    for (const f of this.fishList) {
      f.x *= rx;
      f.baseY = Math.max(topSafeY, Math.min(this.arenaH - 110, f.baseY * ry));
      f.y = Math.max(topSafeY - 10, Math.min(this.arenaH - 94, f.y * ry));
    }
    for (const d of this.ammoDrops) {
      d.x = Math.max(54, Math.min(this.arenaW - 54, d.x * rx));
      d.baseY = Math.max(topSafeY + 14, Math.min(this.arenaH - 134, d.baseY * ry));
      d.y = d.baseY;
    }
    for (const b of this.bolts) {
      b.x = Math.max(8, Math.min(this.arenaW - 8, b.x * rx));
      b.y = Math.max(8, Math.min(this.arenaH - 10, b.y * ry));
    }
    const scaledDist = prevDist * Math.min(rx, ry);
    this.aimAt(
      this.turretX + Math.cos(prevAngle) * scaledDist,
      this.turretY + Math.sin(prevAngle) * scaledDist
    );
  }

  private customTopMarginY = 0;

  private getTopSwimMarginY(): number {
    const autoTop = Math.max(72, Math.round(72 * Math.max(1, this.arenaH / FISH_ARENA_H)));
    return Math.max(autoTop, this.customTopMarginY);
  }

  constructor(stage: number) {
    this.stage = Math.max(1, Math.min(MAX_MINIGAME_STAGE, Math.floor(stage)));
    this.milestoneBoss = getMilestoneBossMeta(this.stage);
    const tier = getMinigameDifficultyTier(this.stage);
    const isBoss = Boolean(this.milestoneBoss);

    const rawTarget = 24500 + Math.pow(this.stage - 1, 0.82) * 680 + (isBoss ? 7500 : 0);
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
    const base = this.milestoneBoss ? 15 : 13;
    const areaRatio = (this.arenaW * this.arenaH) / (FISH_ARENA_W * FISH_ARENA_H);
    if (areaRatio <= 1.05) return base;
    return Math.round(base * Math.min(1.45, Math.sqrt(areaRatio)));
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
    const marginYTop = this.getTopSwimMarginY();
    const marginYBot = this.arenaH - 112;
    const baseY = marginYTop + this.rng() * Math.max(80, marginYBot - marginYTop);
    const x = inView
      ? 64 + this.rng() * Math.max(80, this.arenaW - 128)
      : dir === 1
        ? -def.radius - 16 - this.rng() * 55
        : this.arenaW + def.radius + 16 + this.rng() * 55;

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
    const clampedX = Math.max(16, Math.min(this.arenaW - 16, vx));
    const clampedY = Math.max(16, Math.min(this.turretY - 22, vy));
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

  public toggleAutoFire(): boolean {
    this.autoFire = !this.autoFire;
    return this.autoFire;
  }

  private pickDropWeaponId(): FishSpecialWeaponId {
    const existing = new Set<FishSpecialWeaponId>(this.ammoDrops.map((d) => d.weaponId));
    const preferred = FISH_SPECIAL_WEAPON_IDS.filter(
      (id) => id !== this.activeWeapon && !existing.has(id)
    );
    const pool = preferred.length > 0 ? preferred : FISH_SPECIAL_WEAPON_IDS;
    const idx = Math.min(pool.length - 1, Math.floor(this.rng() * pool.length));
    return pool[idx];
  }

  public spawnAmmoDrop(
    weaponId?: FishSpecialWeaponId,
    atX?: number,
    atY?: number
  ): FloatingAmmoDrop {
    const chosen = weaponId ?? this.pickDropWeaponId();
    const fromRight = this.rng() < 0.5;
    const topSafeY = this.getTopSwimMarginY() + 18;
    const clampedX =
      atX !== undefined
        ? Math.max(66, Math.min(this.arenaW - 66, atX))
        : fromRight
          ? this.arenaW - 70
          : 70;
    const clampedY =
      atY !== undefined
        ? Math.max(topSafeY, Math.min(this.arenaH - 134, atY))
        : topSafeY + this.rng() * Math.max(80, this.arenaH - topSafeY - 142);
    const dir = atX !== undefined ? (this.rng() < 0.5 ? 1 : -1) : fromRight ? -1 : 1;
    const speed = atX !== undefined ? 28 + this.rng() * 18 : 40 + this.rng() * 24;
    const drop: FloatingAmmoDrop = {
      uid: this.nextUid++,
      weaponId: chosen,
      x: clampedX,
      y: clampedY,
      baseY: clampedY,
      vx: dir * speed,
      bobPhase: this.rng() * Math.PI * 2,
      radius: 24,
      age: 0,
      maxAge: 16,
      spawnGrace: atX !== undefined ? 0.22 : 0.1,
    };
    this.ammoDrops.push(drop);
    return drop;
  }

  public equipWeaponDrop(weaponId: FishSpecialWeaponId): void {
    const def = FISH_WEAPON_CATALOG[weaponId];
    if (this.activeWeapon === weaponId && this.activeWeaponTimer > 0) {
      this.activeWeaponTimer = Math.min(22, this.activeWeaponTimer + def.durationSec * 0.75);
    } else {
      this.activeWeapon = weaponId;
      this.activeWeaponTimer = def.durationSec;
    }
    this.activeWeaponMaxTimer = Math.max(def.durationSec, this.activeWeaponTimer);
  }

  public get activeWeaponDef(): FishWeaponDef {
    return FISH_WEAPON_CATALOG[this.activeWeaponTimer > 0 ? this.activeWeapon : 'normal'];
  }

  public fireShot(
    vx: number,
    vy: number,
    _isSandbox = false
  ): {
    fired: boolean;
    tier: 1 | 2 | 3;
    weaponId: FishWeaponId;
    reason?: 'cooldown' | 'no_ammo' | 'ended';
  } {
    const curWeapon: FishWeaponId = this.activeWeaponTimer > 0 ? this.activeWeapon : 'normal';
    if (this.status !== 'playing') {
      return { fired: false, tier: this.cannonTier, weaponId: curWeapon, reason: 'ended' };
    }
    this.aimAt(vx, vy);
    if (this.fireCooldown > 0) {
      return { fired: false, tier: this.cannonTier, weaponId: curWeapon, reason: 'cooldown' };
    }

    // Continuous unlimited stream: Đài Đũa never runs dry mid-stream
    const effectiveTier: 1 | 2 | 3 = this.cannonTier;
    const wDef = FISH_WEAPON_CATALOG[curWeapon];
    const speed = wDef.boltSpeed;
    const muzzleDist = 30;
    const reachScale = Math.max(
      1,
      Math.hypot(this.arenaW, this.arenaH) / Math.hypot(FISH_ARENA_W, FISH_ARENA_H)
    );

    if (curWeapon === 'trident_spread') {
      for (const offset of [-0.19, 0, 0.19]) {
        const ang = Math.max(-Math.PI + 0.1, Math.min(-0.1, this.aimAngle + offset));
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        this.bolts.push({
          uid: this.nextUid++,
          x: this.turretX + c * muzzleDist,
          y: this.turretY + s * muzzleDist,
          vx: c * speed,
          vy: s * speed,
          tier: effectiveTier,
          weaponId: curWeapon,
          bouncesLeft: 1,
          piercesLeft: 0,
          age: 0,
          maxAge: 2.5 * reachScale,
        });
      }
    } else if (curWeapon === 'rapid_frost') {
      const cos = Math.cos(this.aimAngle);
      const sin = Math.sin(this.aimAngle);
      const perpX = -sin;
      const perpY = cos;
      for (const side of [-6.5, 6.5]) {
        this.bolts.push({
          uid: this.nextUid++,
          x: this.turretX + cos * muzzleDist + perpX * side,
          y: this.turretY + sin * muzzleDist + perpY * side,
          vx: cos * speed,
          vy: sin * speed,
          tier: effectiveTier,
          weaponId: curWeapon,
          bouncesLeft: 1,
          piercesLeft: 0,
          age: 0,
          maxAge: 2.4 * reachScale,
        });
      }
    } else {
      const cos = Math.cos(this.aimAngle);
      const sin = Math.sin(this.aimAngle);
      this.bolts.push({
        uid: this.nextUid++,
        x: this.turretX + cos * muzzleDist,
        y: this.turretY + sin * muzzleDist,
        vx: cos * speed,
        vy: sin * speed,
        tier: effectiveTier,
        weaponId: curWeapon,
        bouncesLeft: 1,
        piercesLeft: curWeapon === 'piercing_lance' ? 3 : 0,
        hitFishUids: curWeapon === 'piercing_lance' ? [] : undefined,
        age: 0,
        maxAge: (curWeapon === 'vortex_bomb' ? 2.4 : 2.6) * reachScale,
      });
    }

    const baseCooldown =
      effectiveTier === 1 ? 0.125 : effectiveTier === 2 ? 0.165 : 0.215;
    this.fireCooldown = Math.max(0.055, baseCooldown * wDef.cooldownScale);
    this.cannonRecoil = 1;
    this.shotsFired += 1;
    return { fired: true, tier: effectiveTier, weaponId: curWeapon };
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
    primaryFishUid?: number,
    weaponId: FishWeaponId = 'normal'
  ): number {
    this.nets.push({
      x: nx,
      y: ny,
      radius,
      tier,
      age: 0,
      duration: isExplosion ? 0.48 : 0.34,
      isExplosion,
      weaponId,
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
        if (weaponId === 'rapid_frost') {
          f.chillTimer = Math.max(f.chillTimer ?? 0, 2.8);
        }
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

      // Không cộng thêm giây khi bắn trúng/thu phục cá — đếm ngược chuẩn theo thời lượng màn
      const bonusSec = 0;
      this.lastBonusSecAdded = 0;

      // Chance for caught medium/giant mystical sea creatures to drop a shootable Ammo Orb in-game
      if (
        this.status === 'playing' &&
        this.shotsFired > 0 &&
        this.ammoDrops.length < 3 &&
        this.fishDropCooldown <= 0
      ) {
        const dropChance =
          f.species === 'leviathan_carp'
            ? 1.0
            : f.species === 'golden_ray'
              ? 0.65
              : f.species === 'puffer_bomb'
                ? 0.5
                : f.species === 'moon_jelly' || f.species === 'emerald_koi'
                  ? 0.3
                  : f.species === 'clown'
                    ? 0.14
                    : 0;
        if (dropChance > 0 && this.rng() < dropChance) {
          this.spawnAmmoDrop(undefined, f.x, f.y);
          this.fishDropCooldown = 3.2;
        }
      }

      this.popups.push({
        x: f.x,
        y: f.y - 10,
        text: `+${ptsEarned.toLocaleString('vi-VN')}`,
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

  private triggerChainLightning(
    originX: number,
    originY: number,
    excludeUid: number,
    tier: 1 | 2 | 3,
    caughtEvents: FishTickResult['caughtEvents']
  ): void {
    const chainDamage = tier === 1 ? 0.95 : tier === 2 ? 1.85 : 2.85;
    const candidates = this.fishList
      .filter((f) => f.uid !== excludeUid && Math.hypot(f.x - originX, f.y - originY) <= 185)
      .sort(
        (a, b) =>
          Math.hypot(a.x - originX, a.y - originY) - Math.hypot(b.x - originX, b.y - originY)
      )
      .slice(0, 3);

    let prevX = originX;
    let prevY = originY;
    for (const target of candidates) {
      this.lightningArcs.push({
        x1: prevX,
        y1: prevY,
        x2: target.x,
        y2: target.y,
        age: 0,
        duration: 0.28,
      });
      prevX = target.x;
      prevY = target.y;
      this.detonateNet(
        target.x,
        target.y,
        18,
        chainDamage,
        chainDamage * 0.4,
        tier,
        false,
        caughtEvents,
        target.uid,
        'chain_lightning'
      );
    }
  }

  public tick(dt: number, isSandbox = false): FishTickResult {
    const clampedDt = Math.max(0.001, Math.min(0.08, dt));
    const caughtEvents: FishTickResult['caughtEvents'] = [];
    const collectedDrops: NonNullable<FishTickResult['collectedDrops']> = [];
    const wallBounces: Array<{ x: number; y: number }> = [];
    let weaponUiChanged = false;

    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - clampedDt);
    if (this.cannonRecoil > 0) this.cannonRecoil = Math.max(0, this.cannonRecoil - clampedDt * 5.2);
    if (this.freezeTimer > 0) this.freezeTimer = Math.max(0, this.freezeTimer - clampedDt);
    if (this.timeFlashTimer > 0) this.timeFlashTimer = Math.max(0, this.timeFlashTimer - clampedDt);
    if (this.fishDropCooldown > 0) {
      this.fishDropCooldown = Math.max(0, this.fishDropCooldown - clampedDt);
    }
    if (this.activeWeaponTimer > 0) {
      const prevCeil = Math.ceil(this.activeWeaponTimer);
      this.activeWeaponTimer = Math.max(0, this.activeWeaponTimer - clampedDt);
      const nextCeil = Math.ceil(this.activeWeaponTimer);
      if (nextCeil !== prevCeil) weaponUiChanged = true;
      if (this.activeWeaponTimer <= 0) {
        this.activeWeapon = 'normal';
        this.activeWeaponMaxTimer = 12;
        weaponUiChanged = true;
      }
    }
    if (this.comboTimer > 0) {
      this.comboTimer = Math.max(0, this.comboTimer - clampedDt);
      if (this.comboTimer <= 0) this.combo = 0;
    }

    for (let i = this.nets.length - 1; i >= 0; i--) {
      this.nets[i].age += clampedDt;
      if (this.nets[i].age >= this.nets[i].duration) this.nets.splice(i, 1);
    }
    for (let i = this.lightningArcs.length - 1; i >= 0; i--) {
      this.lightningArcs[i].age += clampedDt;
      if (this.lightningArcs[i].age >= this.lightningArcs[i].duration) {
        this.lightningArcs.splice(i, 1);
      }
    }
    for (let i = this.popups.length - 1; i >= 0; i--) {
      this.popups[i].age += clampedDt;
      this.popups[i].y -= 26 * clampedDt;
      if (this.popups[i].age >= this.popups[i].duration) this.popups.splice(i, 1);
    }

    if (this.status !== 'playing') {
      return {
        timedOut: false,
        won: this.status === 'won',
        wholeSecondChanged: false,
        caughtEvents,
        collectedDrops,
        wallBounces,
      };
    }

    // Periodic Ocean Current Ammo Drops ("bắn vào để lấy")
    this.ammoDropSpawnTimer -= clampedDt;
    if (this.ammoDropSpawnTimer <= 0) {
      if (this.ammoDrops.length < 3) {
        this.spawnAmmoDrop();
      }
      this.ammoDropSpawnTimer = 5.4 + this.rng() * 2.2;
    }

    for (let i = this.ammoDrops.length - 1; i >= 0; i--) {
      const d = this.ammoDrops[i];
      d.age += clampedDt;
      if (d.spawnGrace > 0) d.spawnGrace = Math.max(0, d.spawnGrace - clampedDt);
      d.x += d.vx * clampedDt;
      if (d.x <= 54) {
        d.x = 54;
        d.vx = Math.abs(d.vx);
      } else if (d.x >= this.arenaW - 54) {
        d.x = this.arenaW - 54;
        d.vx = -Math.abs(d.vx);
      }
      d.bobPhase += 2.6 * clampedDt;
      d.y = Math.max(70, Math.min(this.arenaH - 120, d.baseY + Math.sin(d.bobPhase) * 10));
      if (d.age >= d.maxAge) {
        this.ammoDrops.splice(i, 1);
      }
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

    const globalSlowMult = this.freezeTimer > 0 ? 0.22 : 1.0;
    const minFishY = Math.max(52, this.getTopSwimMarginY() - 12);
    for (let i = this.fishList.length - 1; i >= 0; i--) {
      const f = this.fishList[i];
      if (f.hitFlash > 0) f.hitFlash = Math.max(0, f.hitFlash - clampedDt);
      if ((f.chillTimer ?? 0) > 0) {
        f.chillTimer = Math.max(0, (f.chillTimer ?? 0) - clampedDt);
      }
      const chillMult = (f.chillTimer ?? 0) > 0 ? 0.42 : 1.0;
      const slowMult = globalSlowMult * chillMult;
      const surge = 1 + 0.2 * Math.sin(f.wavePhase * 0.7);
      f.x += f.dir * f.speed * surge * slowMult * clampedDt;
      f.wavePhase += f.waveFreq * slowMult * clampedDt;
      f.tailPhase += (7 + f.speed * 0.045) * slowMult * clampedDt;
      f.y = Math.max(
        minFishY,
        Math.min(this.arenaH - 94, f.baseY + Math.sin(f.wavePhase) * f.waveAmp)
      );
      if ((f.dir === 1 && f.x > this.arenaW + f.radius + 75) || (f.dir === -1 && f.x < -f.radius - 75)) {
        this.fishList.splice(i, 1);
      }
    }

    const desiredCount = this.getDesiredFishCount();
    while (this.fishList.length < desiredCount) {
      this.fishList.push(this.createFish(false, false));
    }

    // Move bolts in 2 sub-steps: wall ricochets + shootable ammo drops + direct collision against fish
    const padL = 6;
    const padR = this.arenaW - 6;
    const padT = 6;
    const padB = this.arenaH - 8;
    const steps = 2;
    const subDt = clampedDt / steps;
    for (let i = this.bolts.length - 1; i >= 0; i--) {
      const b = this.bolts[i];
      const bWeapon: FishWeaponId = b.weaponId ?? 'normal';
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
            const hits = this.detonateNet(
              b.x,
              b.y,
              fizzleR,
              0.5,
              0.25,
              b.tier,
              false,
              caughtEvents,
              undefined,
              bWeapon
            );
            if (hits === 0 && (b.hitFishUids?.length ?? 0) === 0) {
              this.combo = 0;
              this.comboTimer = 0;
            }
            detonated = true;
            break;
          }
        }

        const hitPad = b.tier === 3 ? 10 : 7;

        // 1. Shoot-to-collect Floating Ammo Drops ("bắn vào để lấy")
        let hitDropIdx = -1;
        let closestDropDist = Infinity;
        for (let di = 0; di < this.ammoDrops.length; di++) {
          const drop = this.ammoDrops[di];
          if (drop.spawnGrace > 0) continue;
          const d = Math.hypot(drop.x - b.x, drop.y - b.y);
          if (d <= drop.radius + hitPad + 5 && d < closestDropDist) {
            closestDropDist = d;
            hitDropIdx = di;
          }
        }

        if (hitDropIdx >= 0) {
          const picked = this.ammoDrops.splice(hitDropIdx, 1)[0];
          const wDef = FISH_WEAPON_CATALOG[picked.weaponId];
          this.equipWeaponDrop(picked.weaponId);
          weaponUiChanged = true;
          this.comboTimer = Math.max(this.comboTimer, 2.8);
          this.nets.push({
            x: picked.x,
            y: picked.y,
            radius: 38,
            tier: 3,
            age: 0,
            duration: 0.42,
            isExplosion: true,
            weaponId: picked.weaponId,
          });
          this.popups.push({
            x: picked.x,
            y: picked.y - 12,
            text: `Nhận ${wDef.nameVi}!`,
            color: wDef.accentColor,
            age: 0,
            duration: 1.15,
          });
          collectedDrops.push({
            x: picked.x,
            y: picked.y,
            weaponId: picked.weaponId,
            nameVi: wDef.nameVi,
            color: wDef.accentColor,
          });
          if ((b.piercesLeft ?? 0) > 0) {
            b.piercesLeft = (b.piercesLeft ?? 0) - 1;
          } else {
            this.bolts.splice(i, 1);
            detonated = true;
            break;
          }
        }

        // 2. Direct collision against mystical sea creatures
        let closestFish: SwimmingFish | null = null;
        let closestDist = Infinity;
        for (const f of this.fishList) {
          if (b.hitFishUids && b.hitFishUids.includes(f.uid)) continue;
          const d = Math.hypot(f.x - b.x, f.y - b.y);
          if (d <= f.radius + hitPad && d < closestDist) {
            closestDist = d;
            closestFish = f;
          }
        }

        if (closestFish) {
          if (bWeapon === 'piercing_lance') {
            if (!b.hitFishUids) b.hitFishUids = [];
            b.hitFishUids.push(closestFish.uid);
            const radius = b.tier === 1 ? 20 : b.tier === 2 ? 28 : 38;
            const primaryDamage = b.tier === 1 ? 1.45 : b.tier === 2 ? 2.75 : 4.1;
            const splashDamage = b.tier === 1 ? 0.4 : b.tier === 2 ? 0.9 : 1.45;
            this.detonateNet(
              b.x,
              b.y,
              radius,
              primaryDamage,
              splashDamage,
              b.tier,
              false,
              caughtEvents,
              closestFish.uid,
              bWeapon
            );
            if ((b.piercesLeft ?? 0) > 0) {
              b.piercesLeft = (b.piercesLeft ?? 0) - 1;
            } else {
              this.bolts.splice(i, 1);
              detonated = true;
              break;
            }
          } else if (bWeapon === 'vortex_bomb') {
            this.bolts.splice(i, 1);
            for (const f of this.fishList) {
              const dist = Math.hypot(b.x - f.x, b.y - f.y);
              if (dist > 4 && dist <= 138) {
                const pull = Math.min(30, dist * 0.36);
                f.x = Math.max(38, Math.min(this.arenaW - 38, f.x + ((b.x - f.x) / dist) * pull));
                f.baseY = Math.max(64, Math.min(this.arenaH - 104, f.baseY + ((b.y - f.y) / dist) * pull * 0.65));
              }
            }
            const radius = b.tier === 1 ? 82 : b.tier === 2 ? 98 : 114;
            const primaryDamage = b.tier === 1 ? 1.65 : b.tier === 2 ? 3.0 : 4.4;
            const splashDamage = b.tier === 1 ? 1.15 : b.tier === 2 ? 2.1 : 3.1;
            this.detonateNet(
              b.x,
              b.y,
              radius,
              primaryDamage,
              splashDamage,
              b.tier,
              true,
              caughtEvents,
              closestFish.uid,
              bWeapon
            );
            detonated = true;
            break;
          } else if (bWeapon === 'chain_lightning') {
            this.bolts.splice(i, 1);
            const hitXPos = closestFish.x;
            const hitYPos = closestFish.y;
            const hitUid = closestFish.uid;
            const radius = b.tier === 1 ? 24 : b.tier === 2 ? 36 : 48;
            const primaryDamage = b.tier === 1 ? 1.25 : b.tier === 2 ? 2.4 : 3.6;
            const splashDamage = b.tier === 1 ? 0.45 : b.tier === 2 ? 0.95 : 1.5;
            this.detonateNet(
              b.x,
              b.y,
              radius,
              primaryDamage,
              splashDamage,
              b.tier,
              false,
              caughtEvents,
              hitUid,
              bWeapon
            );
            this.triggerChainLightning(hitXPos, hitYPos, hitUid, b.tier, caughtEvents);
            detonated = true;
            break;
          } else if (bWeapon === 'trident_spread') {
            this.bolts.splice(i, 1);
            const radius = b.tier === 1 ? 20 : b.tier === 2 ? 30 : 42;
            const primaryDamage = b.tier === 1 ? 0.85 : b.tier === 2 ? 1.65 : 2.55;
            const splashDamage = b.tier === 1 ? 0.35 : b.tier === 2 ? 0.75 : 1.2;
            this.detonateNet(
              b.x,
              b.y,
              radius,
              primaryDamage,
              splashDamage,
              b.tier,
              false,
              caughtEvents,
              closestFish.uid,
              bWeapon
            );
            detonated = true;
            break;
          } else if (bWeapon === 'rapid_frost') {
            this.bolts.splice(i, 1);
            const radius = b.tier === 1 ? 20 : b.tier === 2 ? 30 : 42;
            const primaryDamage = b.tier === 1 ? 0.72 : b.tier === 2 ? 1.45 : 2.25;
            const splashDamage = b.tier === 1 ? 0.3 : b.tier === 2 ? 0.65 : 1.05;
            this.detonateNet(
              b.x,
              b.y,
              radius,
              primaryDamage,
              splashDamage,
              b.tier,
              false,
              caughtEvents,
              closestFish.uid,
              bWeapon
            );
            detonated = true;
            break;
          } else {
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
              closestFish.uid,
              'normal'
            );
            detonated = true;
            break;
          }
        }
      }

      if (!detonated && b.age >= b.maxAge) {
        this.bolts.splice(i, 1);
        const fizzleR = b.tier === 1 ? 16 : b.tier === 2 ? 22 : 28;
        const hits = this.detonateNet(
          b.x,
          b.y,
          fizzleR,
          0.5,
          0.25,
          b.tier,
          false,
          caughtEvents,
          undefined,
          bWeapon
        );
        if (hits === 0 && (b.hitFishUids?.length ?? 0) === 0) {
          this.combo = 0;
          this.comboTimer = 0;
        }
      }
    }

    if (this.score >= this.targetScore) {
      this.status = 'won';
      return {
        timedOut: false,
        won: true,
        wholeSecondChanged: true,
        caughtEvents,
        collectedDrops,
        wallBounces,
      };
    }

    let wholeSecondChanged =
      caughtEvents.length > 0 || collectedDrops.length > 0 || weaponUiChanged;
    if (!isSandbox) {
      this.remainingSec = Math.max(0, this.remainingSec - clampedDt);
      const curWhole = Math.ceil(this.remainingSec);
      if (curWhole !== this.lastWholeSecond) {
        this.lastWholeSecond = curWhole;
        wholeSecondChanged = true;
      }
      if (this.remainingSec <= 0) {
        this.status = 'lost';
        return {
          timedOut: true,
          won: false,
          wholeSecondChanged: true,
          caughtEvents,
          collectedDrops,
          wallBounces,
        };
      }
    }

    return {
      timedOut: false,
      won: false,
      wholeSecondChanged,
      caughtEvents,
      collectedDrops,
      wallBounces,
    };
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
      this.remainingSec = Math.min(FISH_MAX_TIME_SEC, Math.max(35, this.remainingSec));
    } else {
      this.remainingSec = Math.min(FISH_MAX_TIME_SEC, this.remainingSec + 35);
    }
    this.lastWholeSecond = Math.ceil(this.remainingSec);
    this.ammo = Math.min(999, this.ammo + 30);
    this.freezeTimer = 6.0;

    const caughtEvents: FishTickResult['caughtEvents'] = [];
    const blastR = Math.max(420, Math.hypot(this.arenaW, this.arenaH) * 0.58);
    this.detonateNet(this.arenaW * 0.5, this.arenaH * 0.46, blastR, 14.0, 14.0, 3, true, caughtEvents);
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
      this.remainingSec = Math.min(FISH_MAX_TIME_SEC, Math.max(25, this.remainingSec));
    } else {
      this.remainingSec = Math.min(FISH_MAX_TIME_SEC, this.remainingSec + 25);
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
        outcomeTagVi: 'Hết giờ săn thủy quái',
        playedCoordVi: `${scoreStr}/${targetStr} điểm (${this.caughtCount} sinh vật biển)`,
        recommendedCoordVi: 'Dùng Đũa ×3 nhắm Cá Nóc Gai Tinh Quang & Mực Khổng Lồ',
        summaryVi: `Đạt ${scoreStr}/${targetStr} điểm dưới đại dương. Thu phục Cá Nóc Gai Tinh Quang để tạo sóng xung kích gom cả đàn cá!`,
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
      autoFire: this.autoFire,
      activeWeapon: this.activeWeaponTimer > 0 ? this.activeWeapon : 'normal',
      activeWeaponTimer: Math.round(this.activeWeaponTimer * 10) / 10,
      companionCharge: extra?.companionCharge ?? 0,
      snackPieUsed: Boolean(extra?.snackPieUsed),
    };
  }

  public restoreSession(raw: unknown): boolean {
    const s = sanitizeSavedFishShooterSession(raw, this.stage);
    if (!s) return false;
    const scaledScore =
      s.status === 'playing' && s.targetScore > 0 && s.targetScore < 5000 && this.targetScore >= 10000
        ? Math.min(this.targetScore - 100, Math.round(s.score * (this.targetScore / s.targetScore)))
        : s.score;
    this.score =
      s.status === 'playing'
        ? Math.min(Math.max(0, this.targetScore - 1), scaledScore)
        : scaledScore;
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
    this.autoFire = s.autoFire ?? true;
    this.activeWeapon = s.activeWeapon ?? 'normal';
    this.activeWeaponTimer = s.activeWeaponTimer ?? 0;
    this.activeWeaponMaxTimer =
      this.activeWeapon !== 'normal'
        ? Math.max(FISH_WEAPON_CATALOG[this.activeWeapon].durationSec, this.activeWeaponTimer)
        : 12;
    return true;
  }
}
