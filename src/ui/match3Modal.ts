import { formatDurationCompactVi } from '../data/catalog';
import {
  EXTRA_MOVES_COUNT,
  GEM_META,
  GemColor,
  getExtraMovesGoldCost,
  getMatch3LevelDef,
  getMilestoneBossMeta,
  getMinigameDifficultyTier,
  getWinStreakGifts,
  MATCH3_BOARD_SIZE,
  MATCH3_BOOSTERS,
  Match3GoalDef,
  Match3LevelDef,
  MAX_MATCH3_HEARTS,
  MAX_MINIGAME_STAGE,
  REFILL_HEARTS_GOLD_COST,
} from '../data/match3Levels';
import { SpriteRegistry } from '../engine/spriteLoader';
import { Match3BoardEngine, Match3Cell, Match3Piece } from '../sim/match3Engine';
import { MAX_DAILY_MINIGAME_RESCUES } from '../sim/neighborSocial';
import { ParkSimulation } from '../sim/simulation';
import {
  BuildReductionResult,
  LeaderboardRankChange,
  Match3BoosterId,
  MinigameRescueContext,
  PuzzleArcadeMode,
} from '../types/game';

const VIRTUAL_W = 468;
const BOARD_PAD = 8;
const BOARD_PX = VIRTUAL_W - BOARD_PAD * 2; // 452
const CELL_PX = BOARD_PX / MATCH3_BOARD_SIZE; // 56.5

const GEM_SPRITE_KEYS: Record<GemColor, string> = {
  ruby: 'm3_farm_strawberry',
  sapphire: 'm3_farm_blueberry',
  emerald: 'm3_farm_pear',
  topaz: 'm3_farm_pumpkin',
  amethyst: 'm3_farm_plum',
  candy_pink: 'm3_farm_honey',
};

const BOOSTER_SPRITE_KEYS: Record<Match3BoosterId, string> = {
  reparo_hammer: 'm3_boost_hammer',
  row_col_cannon: 'm3_boost_cannon',
  alohomora_shuffle: 'm3_boost_shuffle',
};

interface ActiveCanvasVfx {
  kind: 'ring' | 'beam_row' | 'beam_col' | 'shockwave' | 'lightning' | 'text';
  age: number;
  duration: number;
  r?: number;
  c?: number;
  toR?: number;
  toC?: number;
  radius?: number;
  color?: string;
  text?: string;
  seed: number;
}

interface ActiveParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  gravity: number;
  rot: number;
  vRot: number;
  size: number;
  age: number;
  duration: number;
  color: string;
  accent: string;
  shape: 'shard' | 'spark' | 'ice' | 'wood';
}

interface ActiveFlyingGoal {
  spriteKey?: string;
  color: string;
  startX: number;
  startY: number;
  ctrlX: number;
  ctrlY: number;
  endX: number;
  endY: number;
  age: number;
  duration: number;
  goalIdx: number;
}

interface InvalidSwapShake {
  r1: number;
  c1: number;
  r2: number;
  c2: number;
  age: number;
  duration: number;
}

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const COBWEB_GOAL_SVG = `
  <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" style="filter:drop-shadow(0 2px 2px rgba(15,23,42,0.32));">
    <circle cx="20" cy="20" r="17" fill="#334155" stroke="#1e293b" stroke-width="2.5"/>
    <g stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" fill="none">
      <line x1="20" y1="4" x2="20" y2="36"/><line x1="4" y1="20" x2="36" y2="20"/>
      <line x1="8.5" y1="8.5" x2="31.5" x2="31.5" y2="31.5"/><line x1="31.5" y1="8.5" x2="8.5" y2="31.5"/>
      <polygon points="20,12 25.6,14.4 28,20 25.6,25.6 20,28 14.4,25.6 12,20 14.4,14.4"/>
      <polygon points="20,7 29.2,10.8 33,20 29.2,29.2 20,33 10.8,29.2 7,20 10.8,10.8"/>
    </g>
    <circle cx="20" cy="20" r="2.6" fill="#bae6fd"/>
  </svg>
`;

const HONEYCOMB_GOAL_SVG = `
  <svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" style="filter:drop-shadow(0 2px 2px rgba(120,53,15,0.38));">
    <polygon points="20,4 28,8.5 28,17.5 20,22 12,17.5 12,8.5" fill="#fbbf24" stroke="#92400e" stroke-width="2.2"/>
    <polygon points="12.5,18 20.5,22.5 20.5,31.5 12.5,36 4.5,31.5 4.5,22.5" fill="#f59e0b" stroke="#92400e" stroke-width="2.2"/>
    <polygon points="27.5,18 35.5,22.5 35.5,31.5 27.5,36 19.5,31.5 19.5,22.5" fill="#fcd34d" stroke="#92400e" stroke-width="2.2"/>
    <circle cx="17.5" cy="10.5" r="2.1" fill="#fef9c3"/>
  </svg>
`;

function describeGoal(g: Match3GoalDef): {
  emoji: string;
  spriteKey?: string;
  label: string;
  accent: string;
} {
  if (g.kind === 'gem' && g.color) {
    const meta = GEM_META[g.color];
    return {
      emoji: meta.emoji,
      spriteKey: GEM_SPRITE_KEYS[g.color],
      label: meta.name,
      accent: meta.fillPrimary,
    };
  }
  if (g.kind === 'ice') {
    return { emoji: '🧊', spriteKey: 'm3_obs_ice', label: 'Băng Giá', accent: '#0284c7' };
  }
  if (g.kind === 'box') {
    return { emoji: '🧺', spriteKey: 'm3_farm_crate', label: 'Thùng Gỗ', accent: '#d97706' };
  }
  if (g.kind === 'web') {
    return { emoji: '🕸️', label: 'Tơ Nhện', accent: '#64748b' };
  }
  if (g.kind === 'honey') {
    return { emoji: '🍯', label: 'Sáp Ong', accent: '#f59e0b' };
  }
  return {
    emoji: '📜',
    spriteKey: 'm3_piece_scroll',
    label: 'Thư Cú',
    accent: '#eab308',
  };
}

export class Match3ModalController {
  private root: HTMLElement;
  private sim: ParkSimulation;
  private onParentRefresh: () => void;
  private showToast: (msg: string, icon?: string) => void;
  public onSwitchToPuzzleArcade?: (mode?: PuzzleArcadeMode) => void;
  public onOpenLeaderboard?: () => void;
  private sprites?: SpriteRegistry;
  private localImages = new Map<string, HTMLImageElement>();

  public engine: Match3BoardEngine | null = null;
  public rescueContext: MinigameRescueContext | null = null;
  private rescueVictoryOutcome: {
    tokensEarned: number;
    goldEarned: number;
    xpEarned: number;
    buildReduction?: BuildReductionResult;
  } | null = null;
  private lastSeenSosRescuedAt = 0;
  private movesMadeThisAttempt = 0;
  private victoryClaimed = false;
  private victorySummary: {
    starsEarned: number;
    goldEarned: number;
    xpEarned: number;
    sandEarned: number;
    boosterReward?: Match3BoosterId;
    nextLevel: number;
    featuredBonusApplied?: boolean;
    newMasterLevel?: number;
    isMasterReplay?: boolean;
    buildReduction?: BuildReductionResult;
    leaderboardRankUp?: LeaderboardRankChange;
  } | null = null;

  private selectedCell: { r: number; c: number } | null = null;
  private cursorCell: { r: number; c: number } = { r: 3, c: 3 };
  private hoverCell: { r: number; c: number } | null = null;
  private activeBoosterTargetMode: Match3BoosterId | null = null;

  private dragStart: {
    pointerId: number;
    r: number;
    c: number;
    clientX: number;
    clientY: number;
    swapped: boolean;
  } | null = null;

  private activeVfx: ActiveCanvasVfx[] = [];
  private particles: ActiveParticle[] = [];
  private flyingGoals: ActiveFlyingGoal[] = [];
  private prevGoalCounts: number[] = [];
  private invalidShake: InvalidSwapShake | null = null;
  private hitStopTimer = 0;
  private idleSeconds = 0;
  private rafId: number | null = null;
  private lastFrameTs = 0;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    onParentRefresh: () => void,
    showToast: (msg: string, icon?: string) => void,
    sprites?: SpriteRegistry
  ) {
    this.root = root;
    this.sim = sim;
    this.onParentRefresh = onParentRefresh;
    this.showToast = showToast;
    this.sprites = sprites;

    const dlg = this.getDialog();
    if (dlg) {
      dlg.addEventListener('close', () => {
        dlg.returnValue = '';
        this.stopLoop();
        this.activeBoosterTargetMode = null;
        this.dragStart = null;
        if (this.rescueContext) {
          this.rescueContext = null;
          this.rescueVictoryOutcome = null;
          this.engine = null;
        }
        this.onParentRefresh();
      });
    }
  }

  private getSprite(key?: string): HTMLImageElement | undefined {
    if (!key) return undefined;
    // Raw painterly art: the match-3 gem icons are drawn at small size and
    // look best untouched.
    const fromReg = this.sprites?.getRaw(key);
    if (fromReg && fromReg.complete && fromReg.naturalWidth > 0) {
      return fromReg;
    }
    let cached = this.localImages.get(key);
    if (!cached) {
      cached = new Image();
      cached.src = `/sprites/${key}.png`;
      this.localImages.set(key, cached);
    }
    return cached.complete && cached.naturalWidth > 0 ? cached : undefined;
  }

  private getDialog(): HTMLDialogElement | null {
    return this.root.querySelector('#match3Dialog') as HTMLDialogElement | null;
  }

  public isOpen(): boolean {
    return Boolean(this.getDialog()?.open);
  }

  public resetSession(): void {
    this.stopLoop();
    this.engine = null;
    this.movesMadeThisAttempt = 0;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.activeBoosterTargetMode = null;
    this.selectedCell = null;
    this.activeVfx = [];
    this.particles = [];
    this.flyingGoals = [];
    this.prevGoalCounts = [];
    const dlg = this.getDialog();
    if (dlg?.open) dlg.close();
  }

  public open(overrideLevel?: number): void {
    const dlg = this.getDialog();
    if (!dlg) return;

    this.rescueContext = null;
    this.rescueVictoryOutcome = null;
    this.sim.tickMatch3Hearts(Date.now());
    if (typeof overrideLevel === 'number' && Number.isFinite(overrideLevel) && overrideLevel >= 1) {
      this.sim.state.match3.currentLevel = Math.floor(overrideLevel);
      this.engine = null;
    }

    const targetLv = this.sim.state.match3.currentLevel;
    if (
      !this.engine ||
      this.engine.levelDef.level !== targetLv ||
      this.engine.status === 'won'
    ) {
      this.startFreshStage(targetLv);
    }

    this.lastSeenSosRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
    this.renderDOM();
    if (!dlg.open) {
      dlg.showModal();
    }
    this.startLoop();
  }

  public openRescue(ctx: MinigameRescueContext): void {
    const dlg = this.getDialog();
    if (!dlg) return;
    const check = this.sim.canRescueNeighborMinigame(ctx.neighborId);
    if (!check.ok) {
      this.showToast(check.reason ?? 'Không thể giải cứu màn này lúc này!', '🦉');
      return;
    }
    this.rescueContext = { ...ctx };
    this.rescueVictoryOutcome = null;
    this.startFreshStage(ctx.stage, true);
    this.renderDOM();
    if (!dlg.open) {
      dlg.showModal();
    }
    this.startLoop();
  }

  public tickLiveHeaderTimer(): void {
    if (!this.isOpen()) return;
    this.sim.tickMatch3Hearts(Date.now());
    const m3 = this.sim.state.match3;

    const curRescuedAt = this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
    if (!this.rescueContext && curRescuedAt !== this.lastSeenSosRescuedAt) {
      this.lastSeenSosRescuedAt = curRescuedAt;
      this.renderDOM();
      return;
    }

    const heartBadge = this.root.querySelector('#m3ModalHeartsText') as HTMLElement | null;
    if (heartBadge) {
      heartBadge.textContent = this.formatHeartsLabel();
    }

    // If player was on No-Hearts screen and a heart just regenerated automatically, start the stage!
    if (!this.engine && (this.sim.state.sandboxMode || m3.hearts > 0)) {
      this.startFreshStage(m3.currentLevel);
      this.renderDOM();
      return;
    }

    const noHeartCountdown = this.root.querySelector('#m3NoHeartsCountdown') as HTMLElement | null;
    if (noHeartCountdown && m3.hearts < MAX_MATCH3_HEARTS && m3.nextHeartAt > 0) {
      const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
      const mm = Math.floor(leftSec / 60);
      const ss = String(leftSec % 60).padStart(2, '0');
      noHeartCountdown.textContent = `${mm}:${ss}`;
    }
  }

  private formatHeartsLabel(): string {
    if (this.sim.state.sandboxMode) return '∞';
    const m3 = this.sim.state.match3;
    if (m3.hearts >= MAX_MATCH3_HEARTS) {
      return `${m3.hearts}/${MAX_MATCH3_HEARTS}`;
    }
    const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
    const mm = Math.floor(leftSec / 60);
    const ss = String(leftSec % 60).padStart(2, '0');
    return `${m3.hearts}/${MAX_MATCH3_HEARTS} (${mm}:${ss})`;
  }

  private startFreshStage(levelNum: number, bypassHeartCheck = false): void {
    if (!bypassHeartCheck && !this.rescueContext) {
      const check = this.sim.canStartMatch3Level();
      if (!check.ok) {
        this.engine = null;
        this.movesMadeThisAttempt = 0;
        this.victoryClaimed = false;
        this.victorySummary = null;
        this.activeBoosterTargetMode = null;
        this.selectedCell = null;
        return;
      }
    }

    const def: Match3LevelDef = getMatch3LevelDef(levelNum);
    this.engine = new Match3BoardEngine(def, this.sim.state.match3.winStreak);
    this.movesMadeThisAttempt = 0;
    this.victoryClaimed = false;
    this.victorySummary = null;
    this.activeBoosterTargetMode = null;
    this.selectedCell = null;
    this.activeVfx = [];
    this.particles = [];
    this.flyingGoals = [];
    this.prevGoalCounts = this.engine.goals.map((g) => g.current);
    this.invalidShake = null;
    this.idleSeconds = 0;
  }

  private startLoop(): void {
    if (this.rafId !== null) return;
    this.lastFrameTs = performance.now();
    const step = (now: number) => {
      if (!this.isOpen()) {
        this.rafId = null;
        return;
      }
      const dt = Math.min(0.05, Math.max(0.001, (now - this.lastFrameTs) / 1000));
      this.lastFrameTs = now;
      this.updateAndDrawCanvas(dt, now / 1000);
      this.rafId = window.requestAnimationFrame(step);
    };
    this.rafId = window.requestAnimationFrame(step);
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private spawnPopParticles(
    r: number,
    c: number,
    color: string,
    subkind?: 'gem' | 'ice' | 'box' | 'web' | 'scroll' | 'honey'
  ): void {
    if (this.particles.length > 160) return;
    const cx = BOARD_PAD + (c + 0.5) * CELL_PX;
    const cy = BOARD_PAD + (r + 0.5) * CELL_PX;

    const count = subkind === 'scroll' ? 10 : 8;
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const spd = 65 + Math.random() * 95;
      const shape: ActiveParticle['shape'] =
        subkind === 'ice'
          ? 'ice'
          : subkind === 'box'
            ? 'wood'
            : i % 3 === 0
              ? 'spark'
              : 'shard';
      this.particles.push({
        x: cx + (Math.random() - 0.5) * 8,
        y: cy + (Math.random() - 0.5) * 8,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - (shape === 'spark' ? 20 : 42),
        gravity: shape === 'spark' ? 40 : 280,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 11,
        size: shape === 'spark' ? 5.5 + Math.random() * 3.5 : 4.5 + Math.random() * 4,
        age: 0,
        duration: 0.38 + Math.random() * 0.2,
        color:
          subkind === 'ice'
            ? '#7dd3fc'
            : subkind === 'box'
              ? '#d97706'
              : subkind === 'web'
                ? '#f1f5f9'
                : color,
        accent:
          subkind === 'ice'
            ? '#ffffff'
            : subkind === 'box'
              ? '#fde68a'
              : '#ffffff',
        shape,
      });
    }
  }

  private spawnFlyingGoalSprite(
    r: number,
    c: number,
    goalKind: Match3GoalDef['kind'],
    gemColor?: GemColor,
    color = '#fde047'
  ): void {
    if (!this.engine) return;
    const goalIdx = this.engine.goals.findIndex(
      (g) => g.kind === goalKind && (goalKind !== 'gem' || g.color === gemColor)
    );
    if (goalIdx < 0) return;

    const spriteKey =
      goalKind === 'gem' && gemColor
        ? GEM_SPRITE_KEYS[gemColor]
        : goalKind === 'ice'
          ? 'm3_obs_ice'
          : goalKind === 'box'
            ? 'm3_farm_crate'
            : goalKind === 'scroll'
              ? 'm3_piece_scroll'
              : undefined;

    // Spawn a real cross-modal DOM flyer inside #match3Dialog so collectibles fly OUT of the board right onto the Goal Tray!
    const dlg = this.getDialog();
    const canvas = this.root.querySelector('#match3Canvas') as HTMLCanvasElement | null;
    const targetWell = this.root.querySelector(
      `[data-m3-goal-idx="${goalIdx}"] .m3-goal-icon-well`
    ) as HTMLElement | null;

    if (dlg && canvas && targetWell && spriteKey && dlg.querySelectorAll('.m3-dom-flyer').length < 14) {
      const cRect = canvas.getBoundingClientRect();
      const wRect = targetWell.getBoundingClientRect();
      if (cRect.width > 40 && wRect.width > 10) {
        const sx = cRect.left + (cRect.width * (BOARD_PAD + (c + 0.5) * CELL_PX)) / VIRTUAL_W;
        const sy = cRect.top + (cRect.height * (BOARD_PAD + (r + 0.5) * CELL_PX)) / VIRTUAL_W;
        const ex = wRect.left + wRect.width * 0.5;
        const ey = wRect.top + wRect.height * 0.5;
        const mx = (sx + ex) * 0.5 + (Math.random() - 0.5) * 44;
        const my = Math.min(sy, ey) - (46 + Math.random() * 34);

        const flyer = document.createElement('div');
        flyer.className = 'm3-dom-flyer';
        const img = document.createElement('img');
        img.src = `/sprites/${spriteKey}.png`;
        img.alt = '';
        flyer.appendChild(img);
        dlg.appendChild(flyer);

        const dur = 460 + Math.round(Math.random() * 90);
        if (typeof flyer.animate === 'function') {
          const anim = flyer.animate(
            [
              { transform: `translate(${sx}px, ${sy}px) scale(0.85)`, opacity: 1, offset: 0 },
              { transform: `translate(${mx}px, ${my}px) scale(1.28)`, opacity: 1, offset: 0.45 },
              { transform: `translate(${ex}px, ${ey}px) scale(0.75)`, opacity: 0.92, offset: 1 },
            ],
            { duration: dur, easing: 'cubic-bezier(0.22, 0.82, 0.28, 1)', fill: 'forwards' }
          );
          anim.onfinish = () => {
            flyer.remove();
            this.pulseGoalPill(goalIdx);
          };
          return;
        }
        flyer.remove();
      }
    }

    if (this.flyingGoals.length > 24) return;
    const startX = BOARD_PAD + (c + 0.5) * CELL_PX;
    const startY = BOARD_PAD + (r + 0.5) * CELL_PX;
    const isMobileStack = window.innerWidth <= 740;
    const endX = isMobileStack ? 120 + goalIdx * 95 : 8;
    const endY = isMobileStack ? 6 : 86 + goalIdx * 52;

    this.flyingGoals.push({
      spriteKey,
      color,
      startX,
      startY,
      ctrlX: (startX + endX) * 0.5 + (Math.random() - 0.5) * 60,
      ctrlY: Math.min(startY, endY) - (55 + Math.random() * 35),
      endX,
      endY,
      age: 0,
      duration: 0.48 + Math.random() * 0.1,
      goalIdx,
    });
  }

  private drainEngineVfx(): void {
    if (!this.engine) return;
    let crackedObstacle = false;
    while (this.engine.vfxQueue.length > 0) {
      const ev = this.engine.vfxQueue.shift()!;
      if (ev.kind === 'pop') {
        if (ev.subkind === 'box' || ev.subkind === 'ice') {
          crackedObstacle = true;
        }
        this.activeVfx.push({
          kind: 'ring',
          r: ev.r,
          c: ev.c,
          color: ev.color,
          age: 0,
          duration: 0.3,
          seed: Math.random() * Math.PI * 2,
        });
        this.spawnPopParticles(ev.r, ev.c, ev.color, ev.subkind);
        if (ev.goalKind) {
          this.spawnFlyingGoalSprite(ev.r, ev.c, ev.goalKind, ev.gemColor, ev.color);
        }
      } else if (ev.kind === 'beam_row') {
        this.activeVfx.push({
          kind: 'beam_row',
          r: ev.r,
          age: 0,
          duration: 0.4,
          seed: Math.random() * 10,
        });
      } else if (ev.kind === 'beam_col') {
        this.activeVfx.push({
          kind: 'beam_col',
          c: ev.c,
          age: 0,
          duration: 0.4,
          seed: Math.random() * 10,
        });
      } else if (ev.kind === 'shockwave') {
        this.activeVfx.push({
          kind: 'shockwave',
          r: ev.r,
          c: ev.c,
          radius: ev.radius,
          age: 0,
          duration: 0.46,
          seed: 0,
        });
      } else if (ev.kind === 'lightning') {
        this.activeVfx.push({
          kind: 'lightning',
          r: ev.fromR,
          c: ev.fromC,
          toR: ev.toR,
          toC: ev.toC,
          age: 0,
          duration: 0.46,
          seed: Math.random() * 100,
        });
      } else if (ev.kind === 'text') {
        this.activeVfx.push({
          kind: 'text',
          r: ev.r,
          c: ev.c,
          text: ev.text,
          color: ev.color,
          age: 0,
          duration: 1.15,
          seed: 0,
        });
      }
    }
    if (crackedObstacle) {
      this.sim.audio.playCrateCrack();
    }
  }

  private pulseGoalPill(goalIdx: number): void {
    const pill = this.root.querySelector(`[data-m3-goal-idx="${goalIdx}"]`) as HTMLElement | null;
    if (!pill) return;
    pill.classList.remove('bump');
    void pill.offsetWidth;
    pill.classList.add('bump');
  }

  private syncPostTurnState(comboCount: number, isPowerBlast = false): void {
    if (!this.engine) return;
    this.drainEngineVfx();
    this.idleSeconds = 0;

    if (isPowerBlast || comboCount >= 3) {
      this.hitStopTimer = 0.035;
      this.sim.audio.playPowerupBlast();
    } else {
      this.sim.audio.playMatchPop(comboCount);
    }

    if (this.engine.status === 'won' && !this.victoryClaimed) {
      this.victoryClaimed = true;
      if (this.rescueContext) {
        const out = this.sim.completeNeighborMinigameRescue(this.rescueContext);
        this.rescueVictoryOutcome = {
          tokensEarned: out.tokensEarned,
          goldEarned: out.goldEarned,
          xpEarned: out.xpEarned,
          buildReduction: out.buildReduction,
        };
      } else {
        this.victorySummary = this.sim.completeMatch3LevelVictory(
          this.engine.bonusCoinsFromLeftoverMoves,
          { sessionScore: this.engine.score }
        );
      }
      this.onParentRefresh();
      this.renderDOM();
      return;
    }

    if (this.engine.status === 'out_of_moves') {
      this.renderDOM();
      return;
    }

    this.updateSideCountersOnly();
  }

  private updateSideCountersOnly(): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box || !this.engine) return;

    const st = this.sim.state;
    const movesEl = box.querySelector('#m3MovesLeftVal') as HTMLElement | null;
    if (movesEl) {
      movesEl.textContent = String(this.engine.movesLeft);
      movesEl.classList.toggle('low-moves', this.engine.movesLeft <= 5);
    }

    const scoreEl = box.querySelector('#m3ScoreVal') as HTMLElement | null;
    if (scoreEl) {
      scoreEl.textContent = this.engine.score.toLocaleString('vi-VN');
    }

    const goldEl = box.querySelector('#m3ModalGoldText') as HTMLElement | null;
    if (goldEl) {
      goldEl.textContent = st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN');
    }

    const starsEl = box.querySelector('#m3ModalStarsText') as HTMLElement | null;
    if (starsEl) {
      starsEl.textContent = st.sandboxMode ? '∞' : String(st.match3.stars);
    }

    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanEl = box.querySelector('#m3ModalTalismanText') as HTMLElement | null;
    if (talismanEl) {
      talismanEl.textContent = st.sandboxMode ? '∞' : String(talismanQty);
    }

    const talismanBtn = box.querySelector('#btnM3PhoenixTalisman') as HTMLButtonElement | null;
    if (talismanBtn) {
      const used = this.engine.talismanUsed;
      talismanBtn.disabled = used || (!st.sandboxMode && talismanQty <= 0);
      talismanBtn.innerHTML = used
        ? '🔥 Bùa Phượng Hoàng • Đã dùng 1/1'
        : `🔥 Bùa Phượng Hoàng (${st.sandboxMode ? '∞' : `×${talismanQty}`}) • +5 Lượt &amp; Chong Chóng`;
    }

    const hintBanner = box.querySelector('#m3ActionHintBar') as HTMLElement | null;
    if (hintBanner) {
      hintBanner.innerHTML = this.buildActionHintHtml();
    }

    // Update goal cards & trigger pulse when count increased
    this.engine.goals.forEach((g, idx) => {
      const pill = box.querySelector(`[data-m3-goal-idx="${idx}"]`) as HTMLElement | null;
      if (!pill) return;
      const done = g.current >= g.target;
      pill.classList.toggle('done', done);
      const countSpan = pill.querySelector('.m3-goal-count') as HTMLElement | null;
      if (countSpan) {
        countSpan.textContent = done ? '✓ Xong' : `${g.current}/${g.target}`;
      }
      if ((this.prevGoalCounts[idx] ?? 0) < g.current) {
        this.pulseGoalPill(idx);
      }
      this.prevGoalCounts[idx] = g.current;
    });

    // Update booster buttons
    MATCH3_BOOSTERS.forEach((bDef) => {
      const btn = box.querySelector(`[data-m3-booster="${bDef.id}"]`) as HTMLButtonElement | null;
      if (!btn) return;
      const qty = st.match3.boosters[bDef.id] ?? 0;
      const armed = this.activeBoosterTargetMode === bDef.id;
      btn.setAttribute('data-active', String(armed));
      btn.setAttribute('aria-pressed', String(armed));
      const badge = btn.querySelector('.m3-booster-qty') as HTMLElement | null;
      if (badge) {
        badge.textContent = st.sandboxMode ? '∞' : qty > 0 ? `×${qty}` : `🪙${bDef.goldCost}`;
        badge.classList.toggle('buy', !st.sandboxMode && qty <= 0);
      }
    });
  }

  private buildActionHintHtml(): string {
    if (!this.engine) return '';
    if (this.activeBoosterTargetMode) {
      const def = MATCH3_BOOSTERS.find((b) => b.id === this.activeBoosterTargetMode);
      return `<span style="color:#fde047;font-weight:800;">🎯 Đang chọn <strong>${escapeHtml(def?.name ?? '')}</strong>: Chạm 1 ô trên bàn cờ để kích hoạt (bấm lại bùa để hủy)</span>`;
    }
    if (this.selectedCell) {
      const cell = this.engine.grid[this.selectedCell.r]?.[this.selectedCell.c];
      if (cell?.piece?.kind === 'gem' && cell.piece.special !== 'none') {
        return `<span style="color:#fde68a;font-weight:800;">⚡ Chạm lần nữa để kích nổ ngay tại chỗ, hoặc ghép với ô bên cạnh để tạo Đại Combo!</span>`;
      }
    }
    return `<span>💡 Vuốt trái cây cạnh nhau • Ghép <strong>4</strong> tạo Tên Lửa Mùa Gặt, chữ <strong>T/L</strong> tạo Hũ Mứt Nổ, ghép <strong>5</strong> tạo Chong Chóng Cầu Vồng!</span>`;
  }

  public renderDOM(): void {
    const box = this.root.querySelector('#match3DialogContent') as HTMLElement | null;
    if (!box) return;

    const st = this.sim.state;
    const m3 = st.match3;
    const lvDef = this.engine?.levelDef ?? getMatch3LevelDef(m3.currentLevel);
    const m3Info = this.sim.getDisciplineStageInfo('match3');
    const m3Rank = this.sim.getPlayerMinigameRank('match3', 'valley');
    const tierMeta = getMinigameDifficultyTier(lvDef.level);
    const extraMovesCost = getExtraMovesGoldCost(lvDef.level);

    const starMini = `<img src="/sprites/m3_icon_star.png" alt="" style="width:14px;height:14px;vertical-align:-2px;" /><span class="m3-sr-only">🌟</span>`;
    const rewardPart = m3Info.isMaxed ? `👑 Đã phá đảo` : `+${lvDef.starReward} ${starMini}`;
    const diffBadge =
      lvDef.difficulty === 'boss'
        ? `<span class="m3-diff-pill boss">🎃 Đợt Gặt Lớn • ${escapeHtml(tierMeta.label)} • ${rewardPart}</span>`
        : lvDef.difficulty === 'hard'
          ? `<span class="m3-diff-pill hard">🔥 Màn Khó • ${escapeHtml(tierMeta.label)} • ${rewardPart}</span>`
          : `<span class="m3-diff-pill normal">🌻 ${escapeHtml(tierMeta.label)} • ${rewardPart}</span>`;

    const streakGifts = getWinStreakGifts(m3.winStreak);
    const streakLabel =
      m3.winStreak === 0
        ? 'Chuỗi thắng: 0 — Thắng liên tiếp để nhận Quà Mùa Gặt đầu ván miễn phí!'
        : `🔥 Chuỗi thắng ×${m3.winStreak} (Tặng đầu ván: ${streakGifts
            .map((s) =>
              s === 'snitch'
                ? 'Chong Chóng Cầu Vồng'
                : s === 'bomb'
                  ? 'Hũ Mứt Nổ'
                  : 'Tên Lửa Mùa Gặt'
            )
            .join(' + ')})`;

    const topStripHtml = `
      <div class="m3-top-strip ${lvDef.difficulty}">
        <div class="m3-stage-heading">
          <span class="m3-chapter-tag">Chương ${lvDef.chapterIndex + 1}/78 • ${escapeHtml(lvDef.chapterName)}</span>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <strong style="font-size:15.5px;color:#ffffff;text-shadow:0 2px 4px rgba(0,0,0,0.45);">${m3Info.isMaxed ? '👑 ' : ''}Màn ${lvDef.level}/${MAX_MINIGAME_STAGE}: ${escapeHtml(lvDef.title)}</strong>
            ${diffBadge}
          </div>
          <div class="m3-streak-line" style="font-size:11.5px;color:#fef9c3;font-weight:700;">${streakLabel}</div>
        </div>

        <div class="m3-resource-pills">
          <span class="m3-res-chip" title="Sao Phép Thuật đang có để xây công trình, nâng cấp & mở đất">
            <img src="/sprites/m3_icon_star.png" alt="Sao" class="m3-res-icon" />
            <strong id="m3ModalStarsText">${st.sandboxMode ? '∞' : m3.stars}</strong>
          </span>
          <span class="m3-res-chip" title="Tim giải đố (Thắng không mất Tim! Tự hồi 1 Tim mỗi 5 phút)">
            <img src="/sprites/m3_icon_heart.png" alt="Tim" class="m3-res-icon" />
            <strong id="m3ModalHeartsText">${this.formatHeartsLabel()}</strong>
          </span>
          <span class="m3-res-chip" title="Vàng Galleon Trang Trại">
            <span class="g-coin" style="width:18px;height:18px;font-size:11px;">G</span>
            <strong id="m3ModalGoldText">${st.sandboxMode ? '∞' : st.galleons.toLocaleString('vi-VN')}</strong>
          </span>
          <span class="m3-res-chip" title="Bùa Trợ Chiến Phượng Hoàng (Tích lũy từ Đơn Cú, 8 câu Thần Chú Đa Ngữ hoặc rèn tại Kho Nông Sản — tối đa 1 lần/lượt thử màn)">
            🔥 <strong id="m3ModalTalismanText">${st.sandboxMode ? '∞' : this.sim.getPhoenixTalismanCount()}</strong>
          </span>
          <button id="btnM3OpenLeaderboard" type="button" class="m3-res-chip minigame-lb-chip" title="Bảng Xếp Hạng Gác Xép Bùa Gặt Honeydukes — Hạng hiện tại của bạn: #${m3Rank}">
            🏆 <strong id="m3ModalRankText">Hạng #${m3Rank}</strong>
          </button>
          <button id="btnM3SwitchPuzzleArcade" type="button" class="m3-res-chip" style="cursor:pointer;background:linear-gradient(180deg,#d97706,#92400e);color:#fffbeb;border-color:#fde68a;" title="Đổi sang Đại Sảnh Khảo Thí Hogwarts: Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy &amp; Nối Hình Sinh Vật (Mỗi môn 777 Màn, không tốn Tim!)">
            ♟️ <strong class="m3-switch-lbl-full">Ngũ Ấn • Bảo Bối • Cờ Phù Thủy • Sinh Vật</strong><strong class="m3-switch-lbl-compact">4 Môn Khảo Thí</strong>
          </button>
          <form method="dialog" class="m3-inline-close-form">
            <button type="submit" class="brass-btn m3-inline-close-btn" title="Đóng Gác Xép Bùa Gặt Honeydukes (Esc)">✕ Đóng</button>
          </form>
        </div>
      </div>
      ${(() => {
        const bossMeta = getMilestoneBossMeta(lvDef.level);
        if (!bossMeta) return '';
        return `<div class="pa-boss-strip">
          <span class="pa-boss-crown">👑 ĐẠI TRÙM MỐC ${lvDef.level}</span>
          <span class="pa-boss-text"><strong>${escapeHtml(bossMeta.bossGuardianVi)}</strong> — ${escapeHtml(bossMeta.bossTitleVi)} • <em>${escapeHtml(bossMeta.mechanicTagVi)}</em></span>
        </div>`;
      })()}
      ${(() => {
        if (this.rescueContext) {
          return `<div class="pa-trial-strip urgent">
            <span>⚔️ <strong>GIẢI CỨU MÀN KHÓ (1 lần/ngày/bạn):</strong> Đang vượt hộ <strong>Màn ${this.rescueContext.stage}</strong> giúp ${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong> • Không tốn Tim • Thắng nhận <strong>+3 🍀 + 95G + 45 XP</strong>!</span>
          </div>`;
        }
        const social = this.sim.ensureNeighborSocial();
        const mySos = social.playerMinigameSos;
        let sosStrip = '';
        if (mySos && !mySos.claimed && mySos.kind === 'match3' && mySos.stage === lvDef.level) {
          if (mySos.rescuedAt) {
            sosStrip = `<div class="pa-trial-strip done">
              <span>🎉 <strong>${escapeHtml(mySos.rescuerEmoji ?? '🦉')} ${escapeHtml(mySos.rescuerName ?? 'Hàng xóm')}</strong> vừa giải cứu xong Màn ${mySos.stage} giúp bạn!</span>
              <button type="button" id="btnM3ClaimSosRescue" class="brass-btn gold-cta pa-trial-jump-btn">🎉 Nhận Qua Màn Ngay!</button>
            </div>`;
          } else {
            sosStrip = `<div class="pa-trial-strip">
              <span>🦉 Đang phát tín hiệu Cú Đưa Thư nhờ bạn bè giải cứu <strong>Màn ${mySos.stage}</strong>... (Hàng xóm sẽ hoàn tất sau vài giây!)</span>
            </div>`;
          }
        }
        const req = this.sim.getRequiredLevelTrial();
        const wp = this.sim.getWinsProgressForCurrentLevel();
        if (!req || st.sandboxMode || this.sim.isHeadmasterPreview) return sosStrip;
        const nextCap = Math.min(100, st.level + 1);
        if (this.victorySummary) {
          return `${sosStrip}<div class="pa-trial-strip done">
            <span>🎉 <strong>Cấp Giải Đố ${st.level} (${wp.current}/${wp.required} màn)!</strong> Môn Đề Cử kế tiếp (Cấp ${nextCap}): <strong>${req.icon} ${req.shortVi}</strong></span>
            ${
              req.kind !== 'match3'
                ? `<button type="button" class="brass-btn gold-cta pa-trial-jump-btn" data-m3-jump-arcade="${req.kind}">Sang ${req.shortVi} (🔥 Đề cử) →</button>`
                : ''
            }
          </div>`;
        }
        if (m3Info.isMaxed) {
          return `${sosStrip}<div class="pa-trial-strip done">
            <span>👑 <strong>Đỉnh 777/777 Mùa Gặt!</strong> Chơi lại rèn luyện nhận Vàng &amp; XP • Chuyển sang <strong>${req.icon} ${req.shortVi}</strong> để tiếp tục gom 🌟 Sao!</span>
            ${
              req.kind !== 'match3'
                ? `<button type="button" class="brass-btn gold-cta pa-trial-jump-btn" data-m3-jump-arcade="${req.kind}">Sang ${req.shortVi} →</button>`
                : ''
            }
          </div>`;
        }
        if (req.kind === 'match3') {
          return `${sosStrip}<div class="pa-trial-strip urgent">
            <span>🔥 <strong>ĐỀ CỬ CỤ DUMBLEDORE:</strong> Thắng Màn ${lvDef.level}/${MAX_MINIGAME_STAGE} nhận <strong>+${lvDef.starReward} 🌟 Sao gốc + Thưởng Đề Cử (+🌟 Mốc Cấp/Chuỗi 5, +1 ⏳ Cát, +35% 🪙)</strong> • Cấp ${st.level} → ${nextCap} (${wp.current}/${wp.required})!</span>
          </div>`;
        }
        return `${sosStrip}<div class="pa-trial-strip">
          <span>🎯 Thắng Màn ${lvDef.level}/${MAX_MINIGAME_STAGE} nhận <strong>+${lvDef.starReward} 🌟</strong> &amp; tiến độ Cấp ${nextCap} (${wp.current}/${wp.required}) • Đề cử cấp này: <strong>${req.icon} ${req.shortVi}</strong></span>
          <button type="button" class="brass-btn gold-cta pa-trial-jump-btn" data-m3-jump-arcade="${req.kind}">
            Chơi ${req.shortVi} (🔥 Đề cử) →
          </button>
        </div>`;
      })()}
    `;

    // Case 1: Out of Hearts (cannot start level yet)
    if (!this.engine) {
      const leftSec = Math.max(0, Math.ceil((m3.nextHeartAt - Date.now()) / 1000));
      const mm = Math.floor(leftSec / 60);
      const ss = String(leftSec % 60).padStart(2, '0');
      const butterbeerQty = st.supply.goods.aged_butterbeer ?? 0;

      box.innerHTML = `
        ${topStripHtml}
        <div class="m3-empty-hearts-card">
          <img src="/sprites/m3_icon_heart.png" alt="Tim" style="width:64px;height:64px;object-fit:contain;filter:grayscale(0.25) drop-shadow(0 6px 10px rgba(0,0,0,0.3));" />
          <h3 style="font-size:19px;font-weight:900;color:#451a03;">Đang Nghỉ Tay Uống Trà Tại Gác Xép!</h3>
          <p style="font-size:13px;max-width:460px;line-height:1.5;color:#78350f;">
            Tự động hồi <strong>+1 Tim</strong> sau <strong id="m3NoHeartsCountdown" style="color:#b45309;">${mm}:${ss}</strong>.
            Bạn có thể sang Đại Sảnh Khảo Thí chơi Ngũ Ấn Đạo Tặc, Ma Trận Bảo Bối, Cờ Phù Thủy, Nối Hình Sinh Vật (nhận 🌟 Sao, không tốn Tim!) hoặc uống Bia Bơ hồi đầy Tim ngay!
          </p>
          <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px;">
            <button id="btnM3RefillHeartsNow" type="button" class="brass-btn gold-cta" style="padding:9px 18px;font-size:13.5px;">
              ${
                butterbeerQty > 0
                  ? `🍻 Uống 1 Bia Bơ Hồi Đầy 5 Tim (Đang có ×${butterbeerQty})`
                  : `❤️ Hồi Đầy 5/5 Tim Ngay (🪙 ${REFILL_HEARTS_GOLD_COST}G)`
              }
            </button>
            <button id="btnM3EmptyGoArcade" type="button" class="brass-btn pa-hud-cta" style="padding:9px 15px;font-size:13px;">
              ♟️ Vào Đại Sảnh Khảo Thí Hogwarts (Nhận 🌟 Sao!)
            </button>
            <button id="btnM3BackToPark" type="button" class="brass-btn" style="padding:9px 15px;font-size:13px;">
              🏡 Về Trang Trại Hang Sóc
            </button>
          </div>
        </div>
      `;

      box.querySelector('#btnM3SwitchPuzzleArcade')?.addEventListener('click', () => {
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.();
      });
      box.querySelector('#btnM3OpenLeaderboard')?.addEventListener('click', () => {
        this.sim.audio.playClick();
        this.onOpenLeaderboard?.();
      });
      box.querySelector('#btnM3EmptyGoArcade')?.addEventListener('click', () => {
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.();
      });
      box.querySelectorAll('[data-m3-jump-arcade]').forEach((el) => {
        el.addEventListener('click', () => {
          const target = (el as HTMLElement).dataset.m3JumpArcade as PuzzleArcadeMode | undefined;
          this.getDialog()?.close();
          this.onSwitchToPuzzleArcade?.(target);
        });
      });

      box.querySelector('#btnM3RefillHeartsNow')?.addEventListener('click', () => {
        const res = this.sim.refillMatch3Hearts();
        this.showToast(res.msg, res.ok ? '❤️' : '🪙');
        if (res.ok) {
          this.startFreshStage(this.sim.state.match3.currentLevel);
          this.renderDOM();
        }
      });
      box.querySelector('#btnM3BackToPark')?.addEventListener('click', () => {
        this.getDialog()?.close();
      });
      return;
    }

    // Case 2: Active Board (Playing, Out-of-Moves Rescue, or Victory Overlay)
    const talismanQty = this.sim.getPhoenixTalismanCount();
    const talismanUsed = this.engine.talismanUsed;
    const goalsHtml = this.engine.goals
      .map((g, idx) => {
        const meta = describeGoal(g);
        const done = g.current >= g.target;
        const iconVisual = meta.spriteKey
          ? `<img src="/sprites/${meta.spriteKey}.png" alt="${meta.emoji}" class="m3-goal-sprite" /><span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">${meta.emoji}</span>`
          : g.kind === 'honey'
            ? `${HONEYCOMB_GOAL_SVG}<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">${meta.emoji}</span>`
            : `${COBWEB_GOAL_SVG}<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">${meta.emoji}</span>`;
        return `
          <div class="m3-goal-pill ${done ? 'done' : ''}" data-m3-goal-idx="${idx}" style="border-left: 5px solid ${meta.accent};">
            <div class="m3-goal-icon-well" style="position:relative;">${iconVisual}</div>
            <div class="m3-goal-meta">
              <div class="m3-goal-name">${escapeHtml(meta.label)}</div>
              <div class="m3-goal-count">${done ? '✓ Xong' : `${g.current}/${g.target}`}</div>
            </div>
          </div>
        `;
      })
      .join('');

    const boostersHtml = MATCH3_BOOSTERS.map((bDef) => {
      const qty = m3.boosters[bDef.id] ?? 0;
      const armed = this.activeBoosterTargetMode === bDef.id;
      const spriteKey = BOOSTER_SPRITE_KEYS[bDef.id];
      const isBuy = !st.sandboxMode && qty <= 0;
      return `
        <button
          type="button"
          class="brass-btn m3-booster-btn"
          data-m3-booster="${bDef.id}"
          data-active="${armed}"
          aria-pressed="${armed}"
          title="${escapeHtml(bDef.description)}"
        >
          <img src="/sprites/${spriteKey}.png" alt="${escapeHtml(bDef.shortLabel)}" class="m3-booster-sprite" />
          <span class="m3-booster-lbl">${escapeHtml(bDef.shortLabel)}</span>
          <span class="m3-booster-qty ${isBuy ? 'buy' : ''}">${st.sandboxMode ? '∞' : qty > 0 ? `×${qty}` : `🪙${bDef.goldCost}`}</span>
        </button>
      `;
    }).join('');

    const socialState = this.sim.ensureNeighborSocial();
    const mySosMatch3 =
      !this.rescueContext &&
      socialState.playerMinigameSos &&
      !socialState.playerMinigameSos.claimed &&
      socialState.playerMinigameSos.kind === 'match3' &&
      socialState.playerMinigameSos.stage === lvDef.level
        ? socialState.playerMinigameSos
        : null;
    const rescuesReceivedLeft = Math.max(
      0,
      MAX_DAILY_MINIGAME_RESCUES - socialState.dailyRescuesReceivedCount
    );

    let overlayHtml = '';
    if (this.engine.status === 'won' && this.rescueContext && this.rescueVictoryOutcome) {
      const rv = this.rescueVictoryOutcome;
      overlayHtml = `
        <div class="m3-board-overlay" role="region" aria-label="Giải cứu thành công">
          <div class="m3-overlay-card victory">
            <div style="font-size:38px;line-height:1;">🏆🍀</div>
            <h3 style="font-size:20px;font-weight:900;color:#451a03;">
              Giải Cứu Thành Công Cho ${escapeHtml(this.rescueContext.neighborName)}!
            </h3>
            <p style="font-size:13px;color:#78350f;font-weight:700;">
              Bạn đã vượt hộ <strong>Màn ${this.rescueContext.stage}</strong> Gác Xép Bùa Gặt Honeydukes cho ${escapeHtml(this.rescueContext.neighborEmoji)} <strong>${escapeHtml(this.rescueContext.neighborName)}</strong>!
            </p>
            <div class="m3-reward-badges">
              <span class="m3-reward-chip star">+${rv.tokensEarned} 🍀 Huy Hiệu Tình Bạn</span>
              <span class="m3-reward-chip">+${rv.goldEarned} 🪙 Galleon</span>
              <span class="m3-reward-chip">+${rv.xpEarned} ⭐ XP</span>
              ${
                rv.buildReduction && rv.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(rv.buildReduction.reducedSec)} xây ${escapeHtml(rv.buildReduction.targetName ?? 'công trình')}</span>`
                  : rv.buildReduction?.allActiveAtFloor && (rv.buildReduction.activeCount ?? 0) > 0
                    ? `<span class="m3-reward-chip">🔒 Đã chạm mốc tối thiểu ${formatDurationCompactVi(rv.buildReduction.floorSec ?? 3600)}</span>`
                    : ''
              }
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn gold-cta" style="flex:1;min-width:190px;padding:9px 14px;font-size:13.5px;">
                🏡 Quay Về Vườn / Sổ Hàng Xóm
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.engine.status === 'won' && this.victorySummary) {
      const vs = this.victorySummary;
      const bonusBoosterDef = vs.boosterReward
        ? MATCH3_BOOSTERS.find((b) => b.id === vs.boosterReward)
        : undefined;
      const starDisplayCount = Math.max(1, Math.min(6, vs.starsEarned || 1));
      const starIconsHtml = Array.from({ length: starDisplayCount }, (_, idx) => {
        const isCenter = starDisplayCount === 3 && idx === 1;
        return `<img src="/sprites/m3_icon_star.png" alt="Sao" class="m3-victory-star-img ${isCenter ? 'center' : ''}" />`;
      }).join('');

      overlayHtml = `
        <div class="m3-board-overlay" role="region" aria-label="Chiến thắng màn giải đố">
          <div class="m3-overlay-card victory">
            <div class="m3-victory-stars-row">${starIconsHtml}</div>
            <h3 style="font-size:20px;font-weight:900;color:#451a03;">${
              vs.isMasterReplay
                ? `👑 Rèn Luyện Đỉnh 777/777 Thành Công!`
                : lvDef.level >= MAX_MINIGAME_STAGE
                  ? `👑 CHINH PHỤC ĐỈNH 777/777 MÙA GẶT!`
                  : `🎉 Thắng Màn ${lvDef.level}/${MAX_MINIGAME_STAGE} • Cấp ${vs.newMasterLevel ?? st.level}!`
            }</h3>
            <p style="font-size:13px;color:#78350f;font-weight:700;">
              ${
                vs.isMasterReplay
                  ? `Đã đạt tối đa 777/777 màn Mùa Gặt — Thưởng rèn luyện Vàng &amp; XP Điền Trang!`
                  : vs.featuredBonusApplied
                    ? `🔥 <strong>THƯỞNG ĐỀ CỬ CỤ DUMBLEDORE!</strong> Đã thắp sáng <strong>${escapeHtml(lvDef.chapterName)}</strong>!`
                    : `Tích thêm 🌟 Sao xây Điền Trang rực rỡ cho <strong>${escapeHtml(lvDef.chapterName)}</strong>!`
              }
            </p>
            <div class="m3-reward-badges">
              ${
                vs.starsEarned > 0
                  ? `<span class="m3-reward-chip star">
                      <img src="/sprites/m3_icon_star.png" alt="" class="m3-inline-icon" />
                      +${vs.starsEarned} Sao Phép Thuật${vs.featuredBonusApplied ? ' (🔥 Đề cử)' : ''}
                    </span>`
                  : `<span class="m3-reward-chip">👑 Đã nhận đủ Sao 777/777</span>`
              }
              <span class="m3-reward-chip">+${vs.goldEarned} 🪙 Galleon</span>
              <span class="m3-reward-chip">+${vs.xpEarned} ⭐ XP Mùa Gặt</span>
              ${vs.sandEarned > 0 ? `<span class="m3-reward-chip">+${vs.sandEarned} ⏳ Cát</span>` : ''}
              ${
                vs.buildReduction && vs.buildReduction.reducedSec > 0
                  ? `<span class="m3-reward-chip">🔨 -${formatDurationCompactVi(vs.buildReduction.reducedSec)} xây ${escapeHtml(vs.buildReduction.targetName ?? 'công trình')}${vs.buildReduction.hitMinFloor ? ' (chạm mốc tối thiểu)' : ''}</span>`
                  : vs.buildReduction?.allActiveAtFloor && (vs.buildReduction.activeCount ?? 0) > 0
                    ? `<span class="m3-reward-chip">🔒 Công trình chạm mốc tối thiểu ${formatDurationCompactVi(vs.buildReduction.floorSec ?? 3600)}</span>`
                    : ''
              }
              ${
                bonusBoosterDef
                  ? `<span class="m3-reward-chip"><img src="/sprites/${BOOSTER_SPRITE_KEYS[bonusBoosterDef.id]}.png" alt="" class="m3-inline-icon" /> +1 ${escapeHtml(bonusBoosterDef.shortLabel)}</span>`
                  : ''
              }
              ${
                vs.leaderboardRankUp
                  ? vs.leaderboardRankUp.rankUpBy > 0
                    ? `<span class="lb-rankup-badge">🏆 Hạng #${vs.leaderboardRankUp.newRank} • 🔼 Tăng +${vs.leaderboardRankUp.rankUpBy} bậc!</span>`
                    : `<span class="m3-reward-chip">🏆 Hạng #${vs.leaderboardRankUp.newRank} Bùa Gặt</span>`
                  : ''
              }
              ${
                vs.leaderboardRankUp?.housePointsAwarded && vs.leaderboardRankUp.playerHouse
                  ? `<span class="m3-reward-chip">⏳ +${vs.leaderboardRankUp.housePointsAwarded} Điểm Cúp Nhà ${escapeHtml(vs.leaderboardRankUp.playerHouse)} (Hạng #${vs.leaderboardRankUp.houseRank ?? 1})</span>`
                  : ''
              }
            </div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              <button id="btnM3NextLevel" type="button" class="brass-btn gold-cta" style="flex:1;min-width:170px;padding:9px 14px;font-size:13.5px;">
                ${vs.isMasterReplay || lvDef.level >= MAX_MINIGAME_STAGE ? `👑 Đấu Lại Đỉnh 777/777` : `▶️ Tiếp Tục Màn ${vs.nextLevel}/${MAX_MINIGAME_STAGE}`}
              </button>
              <button id="btnM3VictoryLeaderboard" type="button" class="brass-btn" style="flex:0.85;min-width:150px;padding:9px 12px;font-size:13px;">
                🏆 Bảng Xếp Hạng (#${m3Rank})
              </button>
              <button id="btnM3UseStarsInPark" type="button" class="brass-btn" style="flex:1;min-width:170px;padding:9px 14px;font-size:13px;">
                🏗️ Về Xây Điền Trang (${st.sandboxMode ? '∞' : m3.stars} 🌟)
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.engine.status === 'out_of_moves') {
      const canRescueTalisman = !talismanUsed && (st.sandboxMode || talismanQty > 0);
      overlayHtml = `
        <div class="m3-board-overlay" role="region" aria-label="Hết lượt đi">
          <div class="m3-overlay-card rescue">
            <img src="/sprites/m3_farm_pinwheel.png" alt="" style="width:58px;height:58px;object-fit:contain;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));" />
            <h3 style="font-size:19px;font-weight:900;color:#451a03;">Hết Lượt Đi! Chỉ Còn Chút Xíu Nữa!</h3>
            <p style="font-size:12.5px;color:#78350f;line-height:1.45;font-weight:600;">
              Mua thêm <strong>+${EXTRA_MOVES_COUNT} Lượt Đi</strong> hoặc dùng <strong>🔥 Bùa Phượng Hoàng</strong> để giữ nguyên bàn thu hoạch, bảo toàn <strong>🔥 Chuỗi Thắng ×${m3.winStreak}</strong> và không mất Tim!
            </p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;width:100%;margin-top:6px;">
              ${
                canRescueTalisman
                  ? `<button id="btnM3RescuePhoenixTalisman" type="button" class="brass-btn pa-tool-btn talisman" style="flex:1.4;min-width:210px;padding:9px 14px;">
                      🔥 Bùa Phượng Hoàng (+5 Lượt &amp; Chong Chóng • ${st.sandboxMode ? '∞' : `×${talismanQty}`})
                    </button>`
                  : ''
              }
              <button id="btnM3BuyExtraMoves" type="button" class="brass-btn gold-cta" style="flex:1.2;min-width:185px;padding:9px 14px;">
                🪄 +${EXTRA_MOVES_COUNT} Lượt Đi (${st.sandboxMode ? 'Miễn phí' : `🪙 ${extraMovesCost}G`})
              </button>
              <button id="btnM3GiveUpRetry" type="button" class="brass-btn" style="flex:0.8;min-width:130px;padding:9px 12px;">
                ${this.rescueContext ? '🔄 Thử lại (Miễn phí)' : '💔 Thử lại (-1 Tim)'}
              </button>
              ${
                !this.rescueContext
                  ? mySosMatch3?.rescuedAt
                    ? `<button id="btnM3OverlayClaimSos" type="button" class="brass-btn gold-cta" style="flex:1.4;min-width:200px;padding:9px 14px;">
                        🎉 ${escapeHtml(mySosMatch3.rescuerName ?? 'Bạn bè')} Đã Giải Cứu — Qua Màn Ngay!
                      </button>`
                    : `<button id="btnM3OverlayAskFriend" type="button" class="brass-btn" style="flex:1.2;min-width:185px;padding:9px 12px;" ${rescuesReceivedLeft <= 0 && !mySosMatch3 ? 'disabled' : ''}>
                        ${mySosMatch3 ? '🦉 Đang chờ bạn giải cứu...' : `🆘 Nhờ Bạn Qua Màn (${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES})`}
                      </button>`
                  : ''
              }
            </div>
          </div>
        </div>
      `;
    }

    const restartLabel = this.rescueContext
      ? '🔄 Đổi bàn giải cứu (Miễn phí)'
      : this.movesMadeThisAttempt === 0
        ? '🔄 Đổi bàn mới (Miễn phí)'
        : '🔄 Chơi lại (-1 Tim)';

    box.innerHTML = `
      ${topStripHtml}

      <div class="m3-main-grid">
        <!-- MOVES MEDALLION + HARVEST GOAL TRAY -->
        <div class="m3-hud-panel">
          <div class="m3-moves-crest">
            <div class="m3-moves-lbl">LƯỢT</div>
            <div id="m3MovesLeftVal" class="m3-moves-num ${this.engine.movesLeft <= 5 ? 'low-moves' : ''}">${this.engine.movesLeft}</div>
            <div class="m3-score-sub">Điểm: <strong id="m3ScoreVal">${this.engine.score.toLocaleString('vi-VN')}</strong></div>
          </div>

          <div class="m3-goals-box">
            <div class="m3-box-title">🧺 Mục Tiêu Thu Hoạch</div>
            <div class="m3-goals-list">
              ${goalsHtml}
            </div>
          </div>
        </div>

        <!-- 8x8 ATTIC HARVEST BOARD CANVAS -->
        <div class="m3-board-stage">
          <div class="m3-canvas-wrap">
            <canvas
              id="match3Canvas"
              width="${VIRTUAL_W}"
              height="${VIRTUAL_W}"
              tabindex="0"
              aria-label="Bàn phép Gác Xép Bùa Gặt Honeydukes 8 nhân 8. Dùng chuột, cảm ứng vuốt hoặc phím mũi tên và Enter để ghép trái cây và mật ong."
            ></canvas>
          </div>
        </div>

        <!-- 3D BOOSTER DOCK & RESTART -->
        <div class="m3-controls-panel">
          <div class="m3-boosters-box">
            <div class="m3-box-title">🪄 Dụng Cụ Mùa Gặt (Không tốn lượt)</div>
            <div class="m3-booster-row">
              ${boostersHtml}
            </div>
            <button
              id="btnM3PhoenixTalisman"
              type="button"
              class="pa-tool-btn talisman m3-talisman-btn"
              style="width:100%;margin-top:8px;padding:7px 8px;font-size:11.6px;justify-content:space-between;"
              ${talismanUsed || (!st.sandboxMode && talismanQty <= 0) ? 'disabled' : ''}
              title="Bùa Trợ Chiến Phượng Hoàng (Tối đa 1 lần/lượt thử màn): +5 Lượt, triệu hồi Chong Chóng + Hũ Mứt Nổ &amp; thanh tẩy chướng ngại!"
            >
              <span>🔥 Bùa Phượng Hoàng</span>
              <span class="pa-cost-pill">${talismanUsed ? 'Đã dùng' : `×${st.sandboxMode ? '∞' : talismanQty}`}</span>
            </button>
          </div>

          <div id="m3ActionHintBar" class="m3-action-hint">
            ${this.buildActionHintHtml()}
          </div>

          <div class="m3-restart-row" style="display:flex;gap:6px;flex-wrap:wrap;">
            <button id="btnM3RestartStage" type="button" class="brass-btn" style="flex:1;font-size:12px;padding:7px 10px;">
              ${restartLabel}
            </button>
            ${
              !this.rescueContext
                ? mySosMatch3?.rescuedAt
                  ? `<button id="btnM3SideClaimSos" type="button" class="brass-btn gold-cta" style="flex:1;font-size:11.8px;padding:7px 10px;">
                      🎉 Nhận Qua Màn Giải Cứu!
                    </button>`
                  : `<button id="btnM3AskFriendSos" type="button" class="brass-btn" style="flex:1;font-size:11.8px;padding:7px 10px;" ${rescuesReceivedLeft <= 0 && !mySosMatch3 ? 'disabled' : ''} title="Nhờ bạn bè vào vượt hộ màn khó này (tối đa 5 lần/ngày, reset lúc 00:00)">
                      ${mySosMatch3 ? '🦉 Đang gọi bạn...' : `🆘 Nhờ Bạn (${rescuesReceivedLeft}/${MAX_DAILY_MINIGAME_RESCUES})`}
                    </button>`
                : ''
            }
          </div>
        </div>
      </div>
      ${overlayHtml}
    `;

    this.bindStageDOMEvents(box);
  }

  private bindStageDOMEvents(box: HTMLElement): void {
    // Booster buttons
    box.querySelectorAll<HTMLButtonElement>('[data-m3-booster]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (!this.engine || this.engine.status !== 'playing') return;
        const bId = btn.dataset.m3Booster as Match3BoosterId;
        const bDef = MATCH3_BOOSTERS.find((b) => b.id === bId);
        if (!bDef) return;

        // Instant booster: Alohomora Shuffle
        if (!bDef.requiresCellTarget) {
          const pay = this.sim.spendOrBuyMatch3Booster(bId);
          if (!pay.ok) {
            this.showToast(pay.msg, '🪙');
            return;
          }
          const res = this.engine.useBooster(bId);
          if (res.ok) {
            this.activeBoosterTargetMode = null;
            this.selectedCell = null;
            this.showToast(res.msg, '🌪️');
            this.syncPostTurnState(2, true);
          }
          return;
        }

        // Targeted booster (Hammer / Row-Col Cannon): toggle arming!
        this.activeBoosterTargetMode = this.activeBoosterTargetMode === bId ? null : bId;
        this.selectedCell = null;
        this.updateSideCountersOnly();
      });
    });

    // Restart button (Royal Match rule: 0 moves made -> free board reroll; >=1 move -> costs 1 Heart)
    box.querySelector('#btnM3SwitchPuzzleArcade')?.addEventListener('click', () => {
      this.getDialog()?.close();
      this.onSwitchToPuzzleArcade?.();
    });
    box.querySelector('#btnM3OpenLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.();
    });
    box.querySelector('#btnM3VictoryLeaderboard')?.addEventListener('click', () => {
      this.sim.audio.playClick();
      this.onOpenLeaderboard?.();
    });
    box.querySelectorAll('[data-m3-jump-arcade]').forEach((el) => {
      el.addEventListener('click', () => {
        const target = (el as HTMLElement).dataset.m3JumpArcade as PuzzleArcadeMode | undefined;
        this.getDialog()?.close();
        this.onSwitchToPuzzleArcade?.(target);
      });
    });
    box.querySelector('#btnM3RestartStage')?.addEventListener('click', () => {
      if (!this.engine) return;
      if (!this.rescueContext && this.movesMadeThisAttempt > 0) {
        this.sim.loseMatch3Heart();
      }
      this.startFreshStage(
        this.rescueContext ? this.rescueContext.stage : this.sim.state.match3.currentLevel,
        Boolean(this.rescueContext)
      );
      this.renderDOM();
    });

    const handleAskFriendSos = () => {
      if (!this.engine || this.rescueContext) return;
      this.sim.requestPlayerMinigameSos('match3', this.engine.levelDef.level);
      this.lastSeenSosRescuedAt =
        this.sim.ensureNeighborSocial().playerMinigameSos?.rescuedAt ?? 0;
      this.renderDOM();
    };
    const handleClaimFriendSos = () => {
      const res = this.sim.claimPlayerMinigameSosRescue();
      if (res.ok) {
        this.lastSeenSosRescuedAt = 0;
        this.startFreshStage(this.sim.state.match3.currentLevel);
        this.renderDOM();
      } else {
        this.showToast(res.msg, '🦉');
      }
    };
    box.querySelector('#btnM3AskFriendSos')?.addEventListener('click', handleAskFriendSos);
    box.querySelector('#btnM3OverlayAskFriend')?.addEventListener('click', handleAskFriendSos);
    box.querySelector('#btnM3ClaimSosRescue')?.addEventListener('click', handleClaimFriendSos);
    box.querySelector('#btnM3SideClaimSos')?.addEventListener('click', handleClaimFriendSos);
    box.querySelector('#btnM3OverlayClaimSos')?.addEventListener('click', handleClaimFriendSos);

    // Victory overlay buttons
    box.querySelector('#btnM3NextLevel')?.addEventListener('click', () => {
      this.startFreshStage(this.sim.state.match3.currentLevel);
      this.renderDOM();
    });

    box.querySelector('#btnM3UseStarsInPark')?.addEventListener('click', () => {
      this.getDialog()?.close();
    });

    // Out-of-moves rescue buttons
    const triggerMatch3Talisman = () => {
      if (!this.engine || this.engine.status === 'won') return;
      if (this.engine.talismanUsed) {
        this.showToast('Bùa Phượng Hoàng chỉ dùng tối đa 1 lần mỗi lượt thử màn!', '🔥');
        return;
      }
      const pay = this.sim.consumePhoenixTalisman();
      if (!pay.ok) {
        this.showToast(pay.msg, '🔥');
        return;
      }
      const wasOutOfMoves = this.engine.status === 'out_of_moves';
      const res = this.engine.applyPhoenixTalisman();
      this.showToast(res.msg, '🔥');
      if (res.ok) {
        this.activeBoosterTargetMode = null;
        this.selectedCell = null;
        if (wasOutOfMoves) {
          this.renderDOM();
        }
        this.syncPostTurnState(3, true);
      }
    };

    box.querySelector('#btnM3PhoenixTalisman')?.addEventListener('click', triggerMatch3Talisman);
    box.querySelector('#btnM3RescuePhoenixTalisman')?.addEventListener('click', triggerMatch3Talisman);

    box.querySelector('#btnM3BuyExtraMoves')?.addEventListener('click', () => {
      if (!this.engine) return;
      const res = this.sim.buyMatch3ExtraMoves(this.engine.levelDef.level);
      this.showToast(res.msg, res.ok ? '🪄' : '🪙');
      if (res.ok) {
        this.engine.addExtraMoves(EXTRA_MOVES_COUNT);
        this.renderDOM();
      }
    });

    box.querySelector('#btnM3GiveUpRetry')?.addEventListener('click', () => {
      if (!this.rescueContext) {
        this.sim.loseMatch3Heart();
      }
      this.startFreshStage(
        this.rescueContext ? this.rescueContext.stage : this.sim.state.match3.currentLevel,
        Boolean(this.rescueContext)
      );
      this.renderDOM();
    });

    // Canvas pointer & keyboard interactions
    const canvas = box.querySelector('#match3Canvas') as HTMLCanvasElement | null;
    if (!canvas) return;

    const eventToCell = (e: PointerEvent): { r: number; c: number } | null => {
      const rect = canvas.getBoundingClientRect();
      const pad = rect.width * (BOARD_PAD / VIRTUAL_W);
      const boardW = rect.width - pad * 2;
      const cellPx = boardW / MATCH3_BOARD_SIZE;
      const c = Math.floor((e.clientX - rect.left - pad) / cellPx);
      const r = Math.floor((e.clientY - rect.top - pad) / cellPx);
      if (r < 0 || r >= MATCH3_BOARD_SIZE || c < 0 || c >= MATCH3_BOARD_SIZE) return null;
      return { r, c };
    };

    canvas.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || !this.engine || this.engine.status !== 'playing') return;
      const hit = eventToCell(e);
      if (!hit) return;

      canvas.focus({ preventScroll: true });
      this.cursorCell = { ...hit };

      // 1. Targeted Booster Mode (Hammer / Row-Col Cannon)
      if (this.activeBoosterTargetMode) {
        const bId = this.activeBoosterTargetMode;
        const validTarget = this.engine.canUseBooster(bId, hit.r, hit.c);
        if (!validTarget.ok) {
          this.showToast(validTarget.msg, '🎯');
          return;
        }
        const pay = this.sim.spendOrBuyMatch3Booster(bId);
        if (!pay.ok) {
          this.showToast(pay.msg, '🪙');
          return;
        }
        const res = this.engine.useBooster(bId, hit.r, hit.c);
        if (res.ok) {
          this.activeBoosterTargetMode = null;
          this.selectedCell = null;
          this.syncPostTurnState(2, true);
        }
        return;
      }

      // 2. Normal Swipe / Click-Swap Tracking
      canvas.setPointerCapture(e.pointerId);
      this.dragStart = {
        pointerId: e.pointerId,
        r: hit.r,
        c: hit.c,
        clientX: e.clientX,
        clientY: e.clientY,
        swapped: false,
      };
    });

    canvas.addEventListener('pointermove', (e) => {
      const hit = eventToCell(e);
      this.hoverCell = hit;

      if (!this.dragStart || this.dragStart.pointerId !== e.pointerId || this.dragStart.swapped) {
        return;
      }
      if (!this.engine || this.engine.status !== 'playing') return;

      const dx = e.clientX - this.dragStart.clientX;
      const dy = e.clientY - this.dragStart.clientY;
      const dist = Math.hypot(dx, dy);
      if (dist < 16) return;

      let dr = 0;
      let dc = 0;
      if (Math.abs(dx) > Math.abs(dy)) {
        dc = dx > 0 ? 1 : -1;
      } else {
        dr = dy > 0 ? 1 : -1;
      }

      const r1 = this.dragStart.r;
      const c1 = this.dragStart.c;
      const r2 = r1 + dr;
      const c2 = c1 + dc;
      this.dragStart.swapped = true;
      this.selectedCell = null;
      this.attemptBoardSwap(r1, c1, r2, c2);
    });

    const finishPointer = (e: PointerEvent) => {
      if (!this.dragStart || this.dragStart.pointerId !== e.pointerId) return;
      const ds = this.dragStart;
      this.dragStart = null;
      if (ds.swapped || !this.engine || this.engine.status !== 'playing') return;

      this.handleCellTapOrClick(ds.r, ds.c);
    };

    canvas.addEventListener('pointerup', finishPointer);
    canvas.addEventListener('pointercancel', () => {
      this.dragStart = null;
    });
    canvas.addEventListener('pointerleave', () => {
      this.hoverCell = null;
    });

    // Full Keyboard Accessibility (Arrows + Enter/Space)
    canvas.addEventListener('keydown', (e) => {
      if (!this.engine || this.engine.status !== 'playing') return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.cursorCell.r = (this.cursorCell.r + MATCH3_BOARD_SIZE - 1) % MATCH3_BOARD_SIZE;
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.cursorCell.r = (this.cursorCell.r + 1) % MATCH3_BOARD_SIZE;
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.cursorCell.c = (this.cursorCell.c + MATCH3_BOARD_SIZE - 1) % MATCH3_BOARD_SIZE;
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.cursorCell.c = (this.cursorCell.c + 1) % MATCH3_BOARD_SIZE;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (this.activeBoosterTargetMode) {
          const bId = this.activeBoosterTargetMode;
          const validTarget = this.engine.canUseBooster(bId, this.cursorCell.r, this.cursorCell.c);
          if (!validTarget.ok) {
            this.showToast(validTarget.msg, '🎯');
            return;
          }
          const pay = this.sim.spendOrBuyMatch3Booster(bId);
          if (!pay.ok) {
            this.showToast(pay.msg, '🪙');
            return;
          }
          const res = this.engine.useBooster(bId, this.cursorCell.r, this.cursorCell.c);
          if (res.ok) {
            this.activeBoosterTargetMode = null;
            this.syncPostTurnState(2, true);
          }
        } else {
          this.handleCellTapOrClick(this.cursorCell.r, this.cursorCell.c);
        }
      }
    });
  }

  private handleCellTapOrClick(r: number, c: number): void {
    if (!this.engine || this.engine.status !== 'playing') return;
    if (!this.engine.canInteractCell(r, c)) {
      this.selectedCell = null;
      this.updateSideCountersOnly();
      return;
    }

    if (!this.selectedCell) {
      this.selectedCell = { r, c };
      this.updateSideCountersOnly();
      return;
    }

    if (this.selectedCell.r === r && this.selectedCell.c === c) {
      const piece = this.engine.grid[r][c].piece;
      if (piece?.kind === 'gem' && piece.special !== 'none') {
        this.selectedCell = null;
        const wasFreeBefore = this.movesMadeThisAttempt === 0;
        const res = this.engine.tryTapCellSpecial(r, c);
        if (res.acted) {
          this.movesMadeThisAttempt += 1;
          if (wasFreeBefore) this.refreshRestartButtonLabel();
          this.syncPostTurnState(res.comboCount, true);
        }
      } else {
        this.selectedCell = null;
        this.updateSideCountersOnly();
      }
      return;
    }

    const dist = Math.abs(this.selectedCell.r - r) + Math.abs(this.selectedCell.c - c);
    if (dist === 1) {
      const r1 = this.selectedCell.r;
      const c1 = this.selectedCell.c;
      this.selectedCell = null;
      this.attemptBoardSwap(r1, c1, r, c);
      return;
    }

    this.selectedCell = { r, c };
    this.updateSideCountersOnly();
  }

  private attemptBoardSwap(r1: number, c1: number, r2: number, c2: number): void {
    if (!this.engine || this.engine.status !== 'playing') return;
    if (r2 < 0 || r2 >= MATCH3_BOARD_SIZE || c2 < 0 || c2 >= MATCH3_BOARD_SIZE) return;

    const p1 = this.engine.grid[r1]?.[c1]?.piece;
    const p2 = this.engine.grid[r2]?.[c2]?.piece;
    const hadSpecial =
      (p1?.kind === 'gem' && p1.special !== 'none') ||
      (p2?.kind === 'gem' && p2.special !== 'none');

    const wasFreeBefore = this.movesMadeThisAttempt === 0;
    const res = this.engine.trySwap(r1, c1, r2, c2);
    if (!res.valid) {
      this.invalidShake = { r1, c1, r2, c2, age: 0, duration: 0.24 };
      this.updateSideCountersOnly();
      return;
    }

    this.movesMadeThisAttempt += 1;
    if (wasFreeBefore) {
      this.refreshRestartButtonLabel();
    }
    this.syncPostTurnState(res.comboCount, hadSpecial || Boolean(res.createdSpecial));
  }

  private refreshRestartButtonLabel(): void {
    const btn = this.root.querySelector('#btnM3RestartStage') as HTMLButtonElement | null;
    if (btn) {
      btn.textContent = '🔄 Chơi lại (-1 Tim)';
    }
  }

  // ==================== AAA 60FPS HIGH-DPI CANDY / GARDENSCAPES RENDERER ====================

  private stepParticlesAndFlyingGoals(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.duration) {
        this.particles.splice(i, 1);
        continue;
      }
      p.vy += p.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vRot * dt;
    }

    for (let i = this.flyingGoals.length - 1; i >= 0; i--) {
      const fg = this.flyingGoals[i];
      fg.age += dt;
      if (fg.age >= fg.duration) {
        this.flyingGoals.splice(i, 1);
      }
    }
  }

  private updateAndDrawCanvas(dt: number, timeSec: number): void {
    const canvas = this.root.querySelector('#match3Canvas') as HTMLCanvasElement | null;
    if (!canvas || !this.engine) return;

    this.drainEngineVfx();
    let simDt = dt;
    if (this.hitStopTimer > 0) {
      this.hitStopTimer = Math.max(0, this.hitStopTimer - dt);
      simDt = 0;
    }
    this.engine.stepVisualTweens(simDt);
    this.stepParticlesAndFlyingGoals(simDt);

    if (this.engine.status === 'playing') {
      this.idleSeconds += simDt;
    } else {
      this.idleSeconds = 0;
    }

    if (this.invalidShake) {
      this.invalidShake.age += dt;
      if (this.invalidShake.age >= this.invalidShake.duration) {
        this.invalidShake = null;
      }
    }

    for (let i = this.activeVfx.length - 1; i >= 0; i--) {
      this.activeVfx[i].age += simDt;
      if (this.activeVfx[i].age >= this.activeVfx[i].duration) {
        this.activeVfx.splice(i, 1);
      }
    }

    const dpr = Math.min(2.5, window.devicePixelRatio || 1);
    const cssSize = Math.max(260, Math.round(canvas.clientWidth || VIRTUAL_W));
    const targetPx = Math.round(cssSize * dpr);
    if (canvas.width !== targetPx || canvas.height !== targetPx) {
      canvas.width = targetPx;
      canvas.height = targetPx;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(targetPx / VIRTUAL_W, targetPx / VIRTUAL_W);

    const W = VIRTUAL_W;
    const pad = BOARD_PAD;
    const boardPx = BOARD_PX;
    const cellPx = CELL_PX;

    // 1. Sculpted Sunlit Honey-Oak & Biscuit Outer Tray Frame
    this.drawRoyalBoardFrame(ctx, W, pad, timeSec);

    // 2. Shaped Warm Oak Well Backing behind Active Non-Hole Cells (seamless shaped boards!)
    ctx.save();
    ctx.fillStyle = '#8b572a';
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        if (this.engine.grid[r][c].hole) continue;
        const x = pad + c * cellPx;
        const y = pad + r * cellPx;
        this.roundRect(ctx, x - 3, y - 3, cellPx + 6, cellPx + 6, 13);
        ctx.fill();
      }
    }
    ctx.restore();

    // 3. Recessed Candy-Crush / Gardenscapes Pearl-Porcelain Checkerboard Cushions + Ice + Crates
    const hasScrollGoal = this.engine.levelDef.scrollsTotal > 0;
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const cell = this.engine.grid[r][c];
        const x = pad + c * cellPx;
        const y = pad + r * cellPx;

        if (cell.hole) continue;

        this.drawPorcelainCushionTile(ctx, x, y, cellPx, (r + c) % 2 === 0);

        // Scroll Collector Exit Archway on bottom row!
        if (hasScrollGoal && r === MATCH3_BOARD_SIZE - 1 && c >= 1 && c <= 6) {
          this.drawScrollExitChute(ctx, x, y, cellPx, timeSec, c);
        }

        // Crystal Ice Underlay (1..2 layers)
        if (cell.ice > 0) {
          this.drawIceLayer(ctx, x, y, cellPx, cell.ice);
        }

        // Spreading Golden Honeycomb Tile Underlay (Stage >= 160)
        if (cell.honey) {
          this.drawHoneycombLayer(ctx, x, y, cellPx, timeSec);
        }

        // Honeydukes Carved Wooden / Treasure Crate Blocker (1..3 layers)
        if (cell.box > 0) {
          this.drawWoodenBox(ctx, x, y, cellPx, cell.box);
        }
      }
    }

    // 4. Idle Hint Golden Pulsing Frame (after 3.5s idle)
    if (this.engine.status === 'playing' && this.idleSeconds >= 3.5 && !this.selectedCell) {
      const hint = this.engine.findBestHintMove();
      if (hint) {
        const pulse = 0.5 + 0.5 * Math.sin(timeSec * 6.5);
        for (const [hr, hc] of [
          [hint.r1, hint.c1],
          [hint.r2, hint.c2],
        ]) {
          const hx = pad + hc * cellPx;
          const hy = pad + hr * cellPx;
          ctx.save();
          ctx.fillStyle = `rgba(254, 240, 138, ${0.18 + pulse * 0.22})`;
          this.roundRect(ctx, hx + 2, hy + 2, cellPx - 4, cellPx - 4, 11);
          ctx.fill();
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.65 + pulse * 0.35})`;
          ctx.lineWidth = 3.2;
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 5. Selected Cell & Armed Booster Crosshair Highlight
    if (this.selectedCell) {
      const sx = pad + this.selectedCell.c * cellPx;
      const sy = pad + this.selectedCell.r * cellPx;
      ctx.save();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.34)';
      this.roundRect(ctx, sx + 2, sy + 2, cellPx - 4, cellPx - 4, 11);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.65)';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }

    if (this.activeBoosterTargetMode && this.hoverCell) {
      const { r: hr, c: hc } = this.hoverCell;
      ctx.save();
      if (this.activeBoosterTargetMode === 'row_col_cannon') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.24)';
        this.roundRect(ctx, pad, pad + hr * cellPx + 4, boardPx, cellPx - 8, 8);
        ctx.fill();
        this.roundRect(ctx, pad + hc * cellPx + 4, pad, cellPx - 8, boardPx, 8);
        ctx.fill();
      }
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3.2;
      this.roundRect(ctx, pad + hc * cellPx + 2.5, pad + hr * cellPx + 2.5, cellPx - 5, cellPx - 5, 11);
      ctx.stroke();
      ctx.restore();
    }

    if (document.activeElement === canvas) {
      const kx = pad + this.cursorCell.c * cellPx;
      const ky = pad + this.cursorCell.r * cellPx;
      ctx.save();
      ctx.strokeStyle = 'rgba(37, 99, 235, 0.72)';
      ctx.lineWidth = 2.2;
      this.roundRect(ctx, kx + 3.5, ky + 3.5, cellPx - 7, cellPx - 7, 9);
      ctx.stroke();
      ctx.restore();
    }

    // 6. 3D Glossy Candies, Specials, Scrolls & Cobweb Overlays
    for (let r = 0; r < MATCH3_BOARD_SIZE; r++) {
      for (let c = 0; c < MATCH3_BOARD_SIZE; c++) {
        const cell: Match3Cell = this.engine.grid[r][c];
        if (cell.hole || cell.box > 0 || !cell.piece) continue;

        let shakeX = 0;
        let shakeY = 0;
        if (this.invalidShake) {
          const sh = this.invalidShake;
          const phase = Math.sin((sh.age / sh.duration) * Math.PI * 3) * 6.5;
          const dirX = sh.c2 - sh.c1;
          const dirY = sh.r2 - sh.r1;
          if (r === sh.r1 && c === sh.c1) {
            shakeX = dirX * phase;
            shakeY = dirY * phase;
          } else if (r === sh.r2 && c === sh.c2) {
            shakeX = -dirX * phase;
            shakeY = -dirY * phase;
          }
        }

        const isSelected = Boolean(
          this.selectedCell && this.selectedCell.r === r && this.selectedCell.c === c
        );
        const selBounce = isSelected ? Math.sin(timeSec * 8) * 2.2 : 0;

        const cx = pad + (cell.piece.visC + 0.5) * cellPx + shakeX;
        const cy = pad + (cell.piece.visR + 0.5) * cellPx + shakeY - Math.abs(selBounce);

        this.drawPiece(ctx, cell.piece, cx, cy, cellPx, timeSec, isSelected);

        if (cell.ice > 0) {
          this.drawIceFrostOverlay(ctx, pad + c * cellPx, pad + r * cellPx, cellPx, cell.ice);
        }

        if (cell.web) {
          this.drawCobwebOverlay(ctx, pad + c * cellPx, pad + r * cellPx, cellPx);
        }
      }
    }

    // 7. Shatter Shards, Beams, Shockwaves, Snitch Lightning, Flying Goal Sprites & 3D Praise Text!
    this.drawVfxAndParticlesLayer(ctx, pad, boardPx, cellPx);

    ctx.restore();
  }

  private drawRoyalBoardFrame(
    ctx: CanvasRenderingContext2D,
    W: number,
    pad: number,
    timeSec: number
  ): void {
    // Sunlit Playrix Township Honey-Oak Tray Base (matches Gác Xép Mùa Gặt)
    const woodGrad = ctx.createLinearGradient(0, 0, 0, W);
    woodGrad.addColorStop(0, '#dea86c');
    woodGrad.addColorStop(0.5, '#be8142');
    woodGrad.addColorStop(1, '#935b28');
    ctx.fillStyle = woodGrad;
    this.roundRect(ctx, 0, 0, W, W, 22);
    ctx.fill();

    // Sculpted Warm Biscuit-Gold Outer Rim Bevel
    const goldRim = ctx.createLinearGradient(0, 0, W, W);
    goldRim.addColorStop(0, '#fff4cf');
    goldRim.addColorStop(0.35, '#e8b468');
    goldRim.addColorStop(0.72, '#a96b30');
    goldRim.addColorStop(1, '#f5d28c');
    ctx.lineWidth = 4.5;
    ctx.strokeStyle = goldRim;
    this.roundRect(ctx, 2.5, 2.5, W - 5, W - 5, 20);
    ctx.stroke();

    // Crisp Warm Contour Outline
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#5a3314';
    this.roundRect(ctx, 1, 1, W - 2, W - 2, 21);
    ctx.stroke();

    // Subtle Inner Cream Trim around Playfield Well
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(255, 245, 214, 0.72)';
    this.roundRect(ctx, pad - 4, pad - 4, W - (pad - 4) * 2, W - (pad - 4) * 2, 15);
    ctx.stroke();

    // 4 Corner Honey-Brass Dowels
    const glint = 0.75 + 0.25 * Math.sin(timeSec * 3);
    for (const [rx, ry] of [
      [8.5, 8.5],
      [W - 8.5, 8.5],
      [8.5, W - 8.5],
      [W - 8.5, W - 8.5],
    ]) {
      ctx.save();
      ctx.fillStyle = '#d98a2b';
      ctx.beginPath();
      ctx.arc(rx, ry, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 255, 255, ${glint})`;
      ctx.beginPath();
      ctx.arc(rx - 1, ry - 1, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawPorcelainCushionTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    isLight: boolean
  ): void {
    ctx.save();
    // Recessed warm biscuit slot shadow rim
    ctx.fillStyle = isLight ? '#d8bd8e' : '#caa976';
    this.roundRect(ctx, x + 1.2, y + 1.2, cellPx - 2.4, cellPx - 2.4, 10.5);
    ctx.fill();

    // Warm sunlit Township cream-parchment & wheat cushion checkerboard
    const tileGrad = ctx.createLinearGradient(x, y + 2, x, y + cellPx - 2);
    if (isLight) {
      tileGrad.addColorStop(0, '#fffef7');
      tileGrad.addColorStop(1, '#f9eed2');
    } else {
      tileGrad.addColorStop(0, '#f4e4bf');
      tileGrad.addColorStop(1, '#e8d1a2');
    }
    ctx.fillStyle = tileGrad;
    this.roundRect(ctx, x + 2.1, y + 2.4, cellPx - 4.2, cellPx - 4.6, 9.5);
    ctx.fill();

    // Soft top inner bevel highlight
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.82)';
    ctx.lineWidth = 1;
    this.roundRect(ctx, x + 3, y + 3.1, cellPx - 6, cellPx - 6.2, 8.5);
    ctx.stroke();
    ctx.restore();
  }

  private drawHoneycombLayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    timeSec: number
  ): void {
    ctx.save();
    const glow = 0.88 + 0.12 * Math.sin(timeSec * 3.8 + (x + y) * 0.04);
    const honeyGrad = ctx.createLinearGradient(x, y + 1, x, y + cellPx - 1);
    honeyGrad.addColorStop(0, `rgba(254, 240, 138, ${0.95 * glow})`);
    honeyGrad.addColorStop(0.52, 'rgba(245, 158, 11, 0.92)');
    honeyGrad.addColorStop(1, 'rgba(180, 83, 9, 0.94)');
    ctx.fillStyle = honeyGrad;
    this.roundRect(ctx, x + 1.8, y + 1.8, cellPx - 3.6, cellPx - 3.6, 10);
    ctx.fill();

    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 2;
    this.roundRect(ctx, x + 2.2, y + 2.2, cellPx - 4.4, cellPx - 4.4, 9.5);
    ctx.stroke();

    // Subtle 3-hexagon beeswax comb cells inside the cushion
    const drawHex = (cx: number, cy: number, rad: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const ang = (Math.PI / 3) * i - Math.PI / 6;
        const hx = cx + Math.cos(ang) * rad;
        const hy = cy + Math.sin(ang) * rad;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    ctx.strokeStyle = 'rgba(120, 53, 15, 0.48)';
    ctx.fillStyle = 'rgba(254, 249, 195, 0.28)';
    ctx.lineWidth = 1.4;
    const rHex = cellPx * 0.16;
    for (const [ox, oy] of [
      [0.34, 0.34],
      [0.66, 0.38],
      [0.48, 0.66],
    ]) {
      drawHex(x + cellPx * ox, y + cellPx * oy, rHex);
      ctx.fill();
      ctx.stroke();
    }

    // Glossy top honey drip highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.58)';
    ctx.beginPath();
    ctx.ellipse(x + cellPx * 0.32, y + 6.5, cellPx * 0.2, 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawScrollExitChute(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    timeSec: number,
    colIdx: number
  ): void {
    const pulse = 0.55 + 0.45 * Math.sin(timeSec * 4.5 + colIdx * 0.7);
    const cx = x + cellPx * 0.5;
    const by = y + cellPx - 3;
    ctx.save();
    ctx.fillStyle = `rgba(234, 179, 8, ${0.24 + pulse * 0.22})`;
    this.roundRect(ctx, x + 9, y + cellPx - 12, cellPx - 18, 9, 4);
    ctx.fill();

    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(cx - 6, by - 6);
    ctx.lineTo(cx + 6, by - 6);
    ctx.lineTo(cx, by);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = `rgba(254, 240, 138, ${0.7 + pulse * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(cx - 4.5, by - 6.5);
    ctx.lineTo(cx + 4.5, by - 6.5);
    ctx.lineTo(cx, by - 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawIceLayer(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    tier: number
  ): void {
    const iceImg = this.getSprite('m3_obs_ice');
    ctx.save();
    // Rich Candy-Crush / Royal-Match icy turquoise crystal cushion backing
    const iceGrad = ctx.createLinearGradient(x, y + 2, x, y + cellPx - 2);
    if (tier >= 2) {
      iceGrad.addColorStop(0, '#7dd3fc');
      iceGrad.addColorStop(1, '#0284c7');
    } else {
      iceGrad.addColorStop(0, '#bae6fd');
      iceGrad.addColorStop(1, '#38bdf8');
    }
    ctx.fillStyle = iceGrad;
    this.roundRect(ctx, x + 1.8, y + 1.8, cellPx - 3.6, cellPx - 3.6, 10.5);
    ctx.fill();

    if (iceImg) {
      ctx.globalAlpha = tier >= 2 ? 0.96 : 0.78;
      ctx.drawImage(iceImg, x + 0.5, y + 0.5, cellPx - 1, cellPx - 1);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  private drawIceFrostOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    tier: number
  ): void {
    ctx.save();
    // Translucent frost glaze & crystalline corner facets framing the candy inside the ice block!
    const sheen = ctx.createLinearGradient(x + 3, y + 3, x + cellPx - 3, y + cellPx - 3);
    sheen.addColorStop(0, tier >= 2 ? 'rgba(224, 242, 254, 0.42)' : 'rgba(224, 242, 254, 0.25)');
    sheen.addColorStop(0.45, 'rgba(56, 189, 248, 0.04)');
    sheen.addColorStop(1, tier >= 2 ? 'rgba(125, 211, 252, 0.36)' : 'rgba(125, 211, 252, 0.18)');
    ctx.fillStyle = sheen;
    this.roundRect(ctx, x + 2.5, y + 2.5, cellPx - 5, cellPx - 5, 10);
    ctx.fill();

    // Outer icy-cyan crystal bevel
    ctx.strokeStyle = tier >= 2 ? '#0284c7' : 'rgba(14, 165, 233, 0.92)';
    ctx.lineWidth = tier >= 2 ? 2.6 : 2;
    this.roundRect(ctx, x + 2.2, y + 2.2, cellPx - 4.4, cellPx - 4.4, 10);
    ctx.stroke();

    // Inner gleaming white frost rim
    ctx.strokeStyle = tier >= 2 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(240, 249, 255, 0.85)';
    ctx.lineWidth = tier >= 2 ? 1.8 : 1.25;
    this.roundRect(ctx, x + 4.2, y + 4.2, cellPx - 8.4, cellPx - 8.4, 8.5);
    ctx.stroke();

    // Top-left & bottom-right crystalline frost corner facets
    ctx.fillStyle = tier >= 2 ? 'rgba(255, 255, 255, 0.88)' : 'rgba(240, 249, 255, 0.72)';
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 13);
    ctx.lineTo(x + 4, y + 5.5);
    ctx.lineTo(x + 13, y + 4);
    ctx.closePath();
    ctx.fill();

    if (tier >= 2) {
      ctx.beginPath();
      ctx.moveTo(x + cellPx - 4, y + cellPx - 13);
      ctx.lineTo(x + cellPx - 4, y + cellPx - 5.5);
      ctx.lineTo(x + cellPx - 13, y + cellPx - 4);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  private drawWoodenBox(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number,
    layers: number
  ): void {
    const boxImg = this.getSprite('m3_farm_crate');

    ctx.save();
    // Tactile 3D crate drop shadow inside cushion
    ctx.fillStyle = 'rgba(74, 44, 22, 0.24)';
    this.roundRect(ctx, x + 3, y + 5, cellPx - 6, cellPx - 6, 10);
    ctx.fill();

    if (boxImg) {
      ctx.drawImage(boxImg, x + 1, y + 0.5, cellPx - 2, cellPx - 2);
    } else {
      ctx.fillStyle = layers >= 2 ? '#92400e' : '#b45309';
      this.roundRect(ctx, x + 3, y + 3, cellPx - 6, cellPx - 6, 9);
      ctx.fill();
    }

    if (layers >= 2) {
      // Multi-hit Harvest Crate badge (×2 / ×3)
      ctx.strokeStyle = layers >= 3 ? '#fde047' : '#f59e0b';
      ctx.lineWidth = 2.2;
      this.roundRect(ctx, x + 3.5, y + 3, cellPx - 7, cellPx - 7, 9);
      ctx.stroke();

      const bx = x + cellPx - 12;
      const by = y + cellPx - 11;
      ctx.fillStyle = layers >= 3 ? '#be123c' : '#b45309';
      ctx.beginPath();
      ctx.arc(bx, by, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fde68a';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 9.5px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`×${layers}`, bx, by + 0.5);
    }
    ctx.restore();
  }

  private drawCobwebOverlay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    cellPx: number
  ): void {
    const cx = x + cellPx * 0.5;
    const cy = y + cellPx * 0.5;
    const rad = cellPx * 0.45;
    ctx.save();

    // Subtle dark backing shadow so white silk strands pop on every bright gem!
    for (const pass of ['shadow', 'silk'] as const) {
      ctx.strokeStyle = pass === 'shadow' ? 'rgba(15, 23, 42, 0.58)' : 'rgba(255, 255, 255, 0.94)';
      ctx.lineWidth = pass === 'shadow' ? 3.2 : 1.55;
      ctx.lineCap = 'round';

      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
        ctx.stroke();
      }

      for (const ring of [0.38, 0.74]) {
        ctx.beginPath();
        for (let i = 0; i <= 8; i++) {
          const ang = (i * Math.PI) / 4;
          const px = cx + Math.cos(ang) * rad * ring;
          const py = cy + Math.sin(ang) * rad * ring;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.quadraticCurveTo(cx + Math.cos(ang - 0.39) * rad * ring * 0.86, cy + Math.sin(ang - 0.39) * rad * ring * 0.86, px, py);
        }
        ctx.stroke();
      }
    }

    // Glistening pearl center knot
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawPiece(
    ctx: CanvasRenderingContext2D,
    piece: Match3Piece,
    cx: number,
    cy: number,
    cellPx: number,
    timeSec: number,
    isSelected: boolean
  ): void {
    const squash = piece.squash ?? 0;
    const baseScale = piece.scale * (isSelected ? 1.09 : 1);
    const scaleX = baseScale * (1 + squash * 0.85);
    const scaleY = baseScale * (1 - squash * 0.72);

    ctx.save();
    ctx.translate(cx, cy);

    // Tactile 3D Candy Contact Shadow on Cushion Slot
    ctx.fillStyle = 'rgba(15, 23, 42, 0.21)';
    ctx.beginPath();
    ctx.ellipse(0, cellPx * 0.33, cellPx * 0.31 * scaleX, cellPx * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(scaleX, scaleY);

    if (piece.kind === 'scroll') {
      const floatY = Math.sin(timeSec * 4.2 + piece.id) * 1.8;
      ctx.translate(0, floatY);
      const scrollImg = this.getSprite('m3_piece_scroll');
      const sz = cellPx * 0.92;
      if (scrollImg) {
        ctx.drawImage(scrollImg, -sz * 0.5, -sz * 0.5, sz, sz);
      }
      this.drawTinySparkleStar(ctx, sz * 0.3, -sz * 0.3, 4.2, timeSec * 4 + piece.id, '#fde047');
      ctx.restore();
      return;
    }

    if (piece.special === 'snitch') {
      const pulse = 1 + 0.05 * Math.sin(timeSec * 6.5 + piece.id);
      // Radiant rainbow-gold aura behind Harvest Pinwheel
      const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, cellPx * 0.48);
      aura.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
      aura.addColorStop(0.6, 'rgba(250, 204, 21, 0.35)');
      aura.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, cellPx * 0.48, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(Math.sin(timeSec * 2.4 + piece.id) * 0.14);
      ctx.scale(pulse, pulse);
      const pinwheelImg = this.getSprite('m3_farm_pinwheel');
      const sz = cellPx * 0.96;
      if (pinwheelImg) {
        ctx.drawImage(pinwheelImg, -sz * 0.5, -sz * 0.5, sz, sz);
      }
      this.drawTinySparkleStar(ctx, -sz * 0.32, -sz * 0.28, 4.8, timeSec * 5, '#ffffff');
      this.drawTinySparkleStar(ctx, sz * 0.32, sz * 0.22, 4.2, timeSec * 5 + 2, '#fde047');
      ctx.restore();
      return;
    }

    if (piece.special === 'bomb') {
      const pulse = 1 + 0.055 * Math.sin(timeSec * 7 + piece.id);
      const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, cellPx * 0.46);
      aura.addColorStop(0, 'rgba(251, 113, 133, 0.65)');
      aura.addColorStop(1, 'rgba(225, 29, 72, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, cellPx * 0.46, 0, Math.PI * 2);
      ctx.fill();

      ctx.scale(pulse, pulse);
      const bombImg = this.getSprite('m3_farm_jam_bomb');
      const sz = cellPx * 0.94;
      if (bombImg) {
        ctx.drawImage(bombImg, -sz * 0.5, -sz * 0.52, sz, sz);
      }
      ctx.restore();
      return;
    }

    if (piece.special === 'rocket_h' || piece.special === 'rocket_v') {
      const isHoriz = piece.special === 'rocket_h';
      const pulse = 1 + 0.05 * Math.sin(timeSec * 8 + piece.id);
      const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, cellPx * 0.45);
      aura.addColorStop(0, isHoriz ? 'rgba(251, 146, 60, 0.55)' : 'rgba(56, 189, 248, 0.55)');
      aura.addColorStop(1, 'rgba(251, 146, 60, 0)');
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, cellPx * 0.45, 0, Math.PI * 2);
      ctx.fill();

      if (!isHoriz) ctx.rotate(Math.PI / 2);
      ctx.scale(pulse, pulse);
      const rocketImg = this.getSprite('m3_sp_rocket_h');
      const sz = cellPx * 0.96;
      if (rocketImg) {
        ctx.drawImage(rocketImg, -sz * 0.5, -sz * 0.5, sz, sz);
      }
      // Animated fuse sparks at both rocket tips
      const tipJitter = Math.sin(timeSec * 22 + piece.id) * 1.8;
      this.drawTinySparkleStar(ctx, sz * 0.46, tipJitter, 4.2, timeSec * 7, '#fde047');
      this.drawTinySparkleStar(ctx, -sz * 0.46, -tipJitter, 4.2, timeSec * 7 + 1.5, '#fde047');
      ctx.restore();
      return;
    }

    // Standard Glossy 3D Candy-Jewel Sprite!
    const gemImg = this.getSprite(GEM_SPRITE_KEYS[piece.color]);
    const sz = cellPx * 0.9;
    if (gemImg) {
      ctx.drawImage(gemImg, -sz * 0.5, -sz * 0.5, sz, sz);
    } else {
      const meta = GEM_META[piece.color];
      ctx.fillStyle = meta.fillPrimary;
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }

    // Periodic ambient Candy-Crush specular twinkle on ~1 in 12 gems
    const glistenCycle = (timeSec * 0.9 + piece.id * 0.37) % 6.5;
    if (glistenCycle < 0.55) {
      const gAlpha = Math.sin((glistenCycle / 0.55) * Math.PI);
      this.drawTinySparkleStar(
        ctx,
        -sz * 0.18,
        -sz * 0.2,
        4.6 * gAlpha,
        timeSec * 3,
        `rgba(255, 255, 255, ${gAlpha.toFixed(2)})`
      );
    }

    ctx.restore();
  }

  private drawTinySparkleStar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rad: number,
    rot: number,
    color: string
  ): void {
    if (rad <= 0.4) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? rad : rad * 0.28;
      const a = (i * Math.PI) / 4;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  private drawVfxAndParticlesLayer(
    ctx: CanvasRenderingContext2D,
    pad: number,
    boardPx: number,
    cellPx: number
  ): void {
    // 1. Beams, Shockwaves, Expanding Glow Rings & Snitch Lightning
    for (const v of this.activeVfx) {
      const t = Math.min(1, v.age / v.duration);
      const alpha = 1 - t;

      if (v.kind === 'ring' && v.r !== undefined && v.c !== undefined) {
        const cx = pad + (v.c + 0.5) * cellPx;
        const cy = pad + (v.r + 0.5) * cellPx;
        ctx.save();
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = (1 - t) * 5 + 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 6 + t * cellPx * 0.52, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = v.color ?? '#fde047';
        ctx.lineWidth = (1 - t) * 3.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 3 + t * cellPx * 0.62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (v.kind === 'beam_row' && v.r !== undefined) {
        const cy = pad + (v.r + 0.5) * cellPx;
        const halfH = (1 - t * 0.72) * cellPx * 0.48;
        ctx.save();
        ctx.globalAlpha = alpha;
        const grad = ctx.createLinearGradient(0, cy - halfH, 0, cy + halfH);
        grad.addColorStop(0, 'rgba(249, 115, 22, 0)');
        grad.addColorStop(0.25, '#fb923c');
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(0.75, '#fde047');
        grad.addColorStop(1, 'rgba(249, 115, 22, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(pad, cy - halfH, boardPx, halfH * 2);
        ctx.restore();
      } else if (v.kind === 'beam_col' && v.c !== undefined) {
        const cx = pad + (v.c + 0.5) * cellPx;
        const halfW = (1 - t * 0.72) * cellPx * 0.48;
        ctx.save();
        ctx.globalAlpha = alpha;
        const grad = ctx.createLinearGradient(cx - halfW, 0, cx + halfW, 0);
        grad.addColorStop(0, 'rgba(14, 165, 233, 0)');
        grad.addColorStop(0.25, '#38bdf8');
        grad.addColorStop(0.5, '#ffffff');
        grad.addColorStop(0.75, '#fde047');
        grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - halfW, pad, halfW * 2, boardPx);
        ctx.restore();
      } else if (v.kind === 'shockwave' && v.r !== undefined && v.c !== undefined) {
        const cx = pad + (v.c + 0.5) * cellPx;
        const cy = pad + (v.r + 0.5) * cellPx;
        const maxR = (v.radius ?? 1.8) * cellPx;
        const curR = 10 + t * maxR;
        ctx.save();
        ctx.globalAlpha = alpha;
        const glow = ctx.createRadialGradient(cx, cy, curR * 0.35, cx, cy, curR);
        glow.addColorStop(0, 'rgba(52, 211, 153, 0)');
        glow.addColorStop(0.75, 'rgba(52, 211, 153, 0.42)');
        glow.addColorStop(1, 'rgba(254, 240, 138, 0.85)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, curR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ecfdf5';
        ctx.lineWidth = 4.5 * (1 - t) + 1.5;
        ctx.stroke();
        ctx.restore();
      } else if (
        v.kind === 'lightning' &&
        v.r !== undefined &&
        v.c !== undefined &&
        v.toR !== undefined &&
        v.toC !== undefined
      ) {
        const x1 = pad + (v.c + 0.5) * cellPx;
        const y1 = pad + (v.r + 0.5) * cellPx;
        const x2 = pad + (v.toC + 0.5) * cellPx;
        const y2 = pad + (v.toR + 0.5) * cellPx;
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len = Math.max(1, Math.hypot(dx, dy));
        const nx = -dy / len;
        const ny = dx / len;
        const bowSign = (Math.floor(v.seed) % 2 === 0 ? 1 : -1) * Math.min(36, len * 0.24);
        const ctrlX = (x1 + x2) * 0.5 + nx * bowSign;
        const ctrlY = (y1 + y2) * 0.5 + ny * bowSign - 10;
        ctx.save();
        ctx.globalAlpha = alpha;
        for (const pass of [
          { w: 6.2, col: 'rgba(56, 189, 248, 0.68)' },
          { w: 3.4, col: 'rgba(250, 204, 21, 0.85)' },
          { w: 1.9, col: '#fef9c3' },
        ]) {
          ctx.strokeStyle = pass.col;
          ctx.lineWidth = pass.w * (1 - t * 0.35);
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(ctrlX, ctrlY, x2, y2);
          ctx.stroke();
        }
        const headT = Math.min(1, t * 1.4);
        const invH = 1 - headT;
        const hx = invH * invH * x1 + 2 * invH * headT * ctrlX + headT * headT * x2;
        const hy = invH * invH * y1 + 2 * invH * headT * ctrlY + headT * headT * y2;
        this.drawTinySparkleStar(ctx, hx, hy, 8.5 * (1 - t * 0.4), t * 6, '#ffffff');
        ctx.restore();
      }
    }

    // 2. 60fps Candy Shards, Frost Diamonds, Wood Chips & Star Sparkles
    for (const p of this.particles) {
      const t = Math.min(1, p.age / p.duration);
      const alpha = Math.max(0, 1 - t * t);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      if (p.shape === 'spark') {
        this.drawTinySparkleStar(ctx, 0, 0, p.size * (1 - t * 0.4), 0, '#fef08a');
      } else if (p.shape === 'wood') {
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-p.size, -p.size * 0.48, p.size * 2, p.size * 0.96);
        ctx.strokeRect(-p.size, -p.size * 0.48, p.size * 2, p.size * 0.96);
      } else {
        // Glossy Gem / Ice Crystal Shard
        const s = p.size * (1 - t * 0.35);
        ctx.fillStyle = p.color;
        ctx.strokeStyle = p.accent;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(0, -s * 1.25);
        ctx.lineTo(s * 0.95, 0);
        ctx.lineTo(0, s * 1.25);
        ctx.lineTo(-s * 0.95, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Gardenscapes / Royal Match Flying Goal Collectibles Arcing Toward Goal Tray!
    for (const fg of this.flyingGoals) {
      const t = Math.min(1, fg.age / fg.duration);
      const inv = 1 - t;
      const x = inv * inv * fg.startX + 2 * inv * t * fg.ctrlX + t * t * fg.endX;
      const y = inv * inv * fg.startY + 2 * inv * t * fg.ctrlY + t * t * fg.endY;
      const sc = 1 + Math.sin(t * Math.PI) * 0.35 - t * 0.25;

      ctx.save();
      // Golden stardust comet tail
      ctx.fillStyle = 'rgba(253, 224, 71, 0.55)';
      ctx.beginPath();
      ctx.arc(x, y, 16 * sc, 0, Math.PI * 2);
      ctx.fill();

      const img = this.getSprite(fg.spriteKey);
      const sz = 36 * sc;
      if (img) {
        ctx.drawImage(img, x - sz * 0.5, y - sz * 0.5, sz, sz);
      } else {
        ctx.fillStyle = fg.color;
        ctx.beginPath();
        ctx.arc(x, y, 10 * sc, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 4. Extruded 3D Candy-Crush Combo Praise Typography on Top!
    for (const v of this.activeVfx) {
      if (v.kind !== 'text' || v.r === undefined || v.c === undefined || !v.text) continue;
      const cleanText = v.text.replace(/^[^\p{L}\p{N}+×!]+/u, '').trim();
      if (!cleanText) continue;

      const t = Math.min(1, v.age / v.duration);
      const popScale = t < 0.18 ? 0.55 + (t / 0.18) * 0.62 : 1.17 - (t - 0.18) * 0.18;
      const alpha = t > 0.72 ? Math.max(0, 1 - (t - 0.72) / 0.28) : 1;
      const rawCx = pad + (v.c + 0.5) * cellPx;
      const cx = Math.max(pad + 78, Math.min(pad + boardPx - 78, rawCx));
      const cy = Math.max(pad + 26, pad + (v.r + 0.5) * cellPx - t * 32);

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);
      ctx.scale(popScale, popScale);
      ctx.font = '900 20px "Be Vietnam Pro", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineJoin = 'round';

      // Extruded dark-berry & gold 3D Candy Crush text outline
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 6;
      ctx.shadowOffsetY = 3;
      ctx.lineWidth = 6.5;
      ctx.strokeStyle = '#3b0764';
      ctx.strokeText(cleanText, 0, 1.5);
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;

      const textGrad = ctx.createLinearGradient(0, -11, 0, 11);
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.45, '#fef08a');
      textGrad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = textGrad;
      ctx.fillText(cleanText, 0, 0);
      ctx.restore();
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ): void {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
  }
}
