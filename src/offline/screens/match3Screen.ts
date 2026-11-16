import {
  CANDY_OBSTACLE_ICONS,
  CANDY_TILE_TYPES,
  getCandyChapterForLevel,
  getCandyLevelById,
  type CandyHouseId,
} from '../../data/candyHogwartsLevels';
import { MAX_MINIGAME_STAGE } from '../../data/match3Levels';
import {
  CandyHogwartsEngine,
  type CandyGameEndPayload,
  type CandyHudStateSnapshot,
  type CandyObjectiveProgress,
} from '../../sim/candyHogwartsEngine';
import type { Match3BoosterId } from '../../types/game';
import { rewriteInlineAssetHtml } from '../offlineAssets';
import {
  escapeHtml,
  type OfflineScreenController,
  type OfflineScreenHost,
} from './screenContext';

const EXTRA_MOVES_COIN_COST = 60;
const BOOSTER_COIN_COST = 45;

const HOUSE_OPTIONS: ReadonlyArray<{ id: CandyHouseId; label: string; emoji: string }> = [
  { id: 'gryffindor', label: 'Gryffindor', emoji: '🦁' },
  { id: 'slytherin', label: 'Slytherin', emoji: '🐍' },
  { id: 'ravenclaw', label: 'Ravenclaw', emoji: '🦅' },
  { id: 'hufflepuff', label: 'Hufflepuff', emoji: '🦡' },
];

export class Match3OfflineScreen implements OfflineScreenController {
  private readonly host: OfflineScreenHost;
  private container: HTMLElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private engine: CandyHogwartsEngine | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private onWindowResizeBound?: () => void;
  private resultBanner: CandyGameEndPayload | null = null;

  constructor(host: OfflineScreenHost) {
    this.host = host;
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    this.renderShell();
    this.canvas = container.querySelector<HTMLCanvasElement>('#offM3Canvas');

    this.engine = new CandyHogwartsEngine(this.canvas, {
      audio: this.host.feedback,
      onStateChange: (snap) => {
        this.updateHud(snap);
      },
      onBoosterConsumed: (kind) => this.consumeBooster(kind),
      onSettled: () => {
        this.persistActiveSession();
      },
      onGameEnd: (payload) => {
        this.handleGameEnd(payload);
      },
      onToast: (msg, icon) => {
        this.host.showToast(msg, icon);
      },
    });

    this.startOrRestoreCurrentLevel();

    const boardWrap = container.querySelector<HTMLElement>('#offM3BoardWrap');
    if (typeof ResizeObserver !== 'undefined' && boardWrap) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.canvas && this.engine) {
          this.engine.attachCanvas(this.canvas);
        }
      });
      this.resizeObserver.observe(boardWrap);
    } else if (typeof window !== 'undefined') {
      this.onWindowResizeBound = () => {
        if (this.canvas && this.engine) {
          this.engine.attachCanvas(this.canvas);
        }
      };
      window.addEventListener('resize', this.onWindowResizeBound);
    }
  }

  public flushCheckpoint(): void {
    this.persistActiveSession();
  }

  public destroy(): void {
    this.persistActiveSession();
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (typeof window !== 'undefined' && this.onWindowResizeBound) {
      window.removeEventListener('resize', this.onWindowResizeBound);
      this.onWindowResizeBound = undefined;
    }
    this.engine?.destroy();
    this.engine = null;
    this.canvas = null;
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  private persistActiveSession(): void {
    if (!this.engine || !this.engine.level) return;
    if (this.engine.ended || this.engine.status !== 'playing') {
      this.host.state.match3 = null;
    } else {
      const snap = this.engine.exportSession();
      if (snap) {
        this.host.state.match3 = snap;
      }
    }
    this.host.saveCheckpoint();
  }

  private startOrRestoreCurrentLevel(forceFresh = false): void {
    if (!this.engine) return;
    this.resultBanner = null;
    this.hideResultOverlay();

    const prog = this.host.state.match3Progress;
    const targetLevel = Math.max(1, Math.min(MAX_MINIGAME_STAGE, prog.currentLevel));
    prog.currentLevel = targetLevel;

    const saved = this.host.state.match3;
    if (!forceFresh && saved && saved.levelId === targetLevel && this.engine.restoreSession(saved)) {
      if (this.canvas) {
        this.engine.attachCanvas(this.canvas);
      }
      const hud = this.engine.getHudSnapshot();
      if (hud) this.updateHud(hud);
      return;
    }

    this.host.state.match3 = null;
    const levelDef = getCandyLevelById(targetLevel);
    this.engine.loadLevel(levelDef, {
      house: prog.house,
      winStreak: prog.winStreak,
    });
    if (this.canvas) {
      this.engine.attachCanvas(this.canvas);
    }
    const hud = this.engine.getHudSnapshot();
    if (hud) this.updateHud(hud);
    this.host.saveCheckpoint();
  }

  private consumeBooster(kind: 'hammer' | 'swap' | 'shuffle'): boolean {
    const keyMap: Record<'hammer' | 'swap' | 'shuffle', Match3BoosterId> = {
      hammer: 'reparo_hammer',
      swap: 'row_col_cannon',
      shuffle: 'alohomora_shuffle',
    };
    const key = keyMap[kind];
    const prog = this.host.state.match3Progress;
    const have = prog.boosters[key] ?? 0;
    if (have > 0) {
      prog.boosters[key] = have - 1;
      this.host.saveCheckpoint();
      this.refreshBoosterCounts();
      return true;
    }
    if (this.host.state.coins >= BOOSTER_COIN_COST) {
      this.host.state.coins -= BOOSTER_COIN_COST;
      this.host.saveCheckpoint();
      this.refreshBoosterCounts();
      return true;
    }
    this.host.feedback.error();
    this.host.showToast(
      this.host.state.settings.language === 'en'
        ? `Need ${BOOSTER_COIN_COST} coins for this booster!`
        : `Cần ${BOOSTER_COIN_COST} 🪙 Xu phép để mua thêm trợ lực này!`,
      '🪙'
    );
    return false;
  }

  private handleGameEnd(payload: CandyGameEndPayload): void {
    this.resultBanner = payload;
    const prog = this.host.state.match3Progress;

    if (payload.won) {
      this.host.state.match3 = null;
      const earnedCoins = 35 + payload.stars * 15 + Math.min(60, payload.bonusCoinsFromLeftoverMoves);
      const earnedXp = 25 + payload.stars * 10;
      this.host.state.coins += earnedCoins;
      this.host.state.xp += earnedXp;

      if (payload.score > prog.highScore) {
        prog.highScore = payload.score;
      }
      prog.totalWins += 1;
      prog.winStreak += 1;
      if (prog.winStreak > prog.bestStreak) {
        prog.bestStreak = prog.winStreak;
      }
      if (prog.winStreak % 3 === 0) {
        prog.phoenixTalismans = Math.min(99, prog.phoenixTalismans + 1);
      }
      if (payload.levelId > prog.maxClearedLevel) {
        prog.maxClearedLevel = Math.min(MAX_MINIGAME_STAGE, payload.levelId);
      }
      prog.currentLevel = Math.min(MAX_MINIGAME_STAGE, Math.max(prog.maxClearedLevel + 1, payload.levelId + 1));
      this.host.saveCheckpoint();
    } else {
      prog.winStreak = 0;
      this.host.state.match3 = null;
      this.host.saveCheckpoint();
    }

    this.renderResultOverlay(payload);
  }

  private formatObjectiveChip(obj: CandyObjectiveProgress): string {
    let iconHtml = '✨';
    if (obj.type === 'collect' && typeof obj.tileId === 'number') {
      const tile = CANDY_TILE_TYPES[obj.tileId % CANDY_TILE_TYPES.length];
      if (tile) {
        iconHtml = `<img src="./paintings/candy-hogwarts/candy-${tile.id}.png" alt="" class="off-m3-obj-img" />`;
      }
    } else if (obj.type in CANDY_OBSTACLE_ICONS) {
      iconHtml = rewriteInlineAssetHtml(
        CANDY_OBSTACLE_ICONS[obj.type as keyof typeof CANDY_OBSTACLE_ICONS]
      );
    }
    const done = obj.completed;
    const rem = Math.max(0, obj.remaining);
    return `
      <div class="off-m3-obj-chip ${done ? 'done' : ''}">
        <span class="off-m3-obj-icon">${iconHtml}</span>
        <strong>${done ? '✓' : rem}</strong>
      </div>
    `;
  }

  private updateHud(snap: CandyHudStateSnapshot): void {
    if (!this.container) return;
    const isEn = this.host.state.settings.language === 'en';
    const chapter = getCandyChapterForLevel(snap.level.id);

    const stageLabel = this.container.querySelector('#offM3StageTitle');
    if (stageLabel) {
      stageLabel.textContent = isEn
        ? `Stage ${snap.level.id} • ${chapter.shortTitle}`
        : `Màn ${snap.level.id} • ${chapter.shortTitle}`;
    }

    const movesEl = this.container.querySelector('#offM3Moves');
    if (movesEl) movesEl.textContent = String(snap.movesLeft);

    const scoreEl = this.container.querySelector('#offM3Score');
    if (scoreEl) scoreEl.textContent = snap.score.toLocaleString('vi-VN');

    const bestEl = this.container.querySelector('#offM3Best');
    if (bestEl) {
      bestEl.textContent = Math.max(
        this.host.state.match3Progress.highScore,
        snap.score
      ).toLocaleString('vi-VN');
    }

    const objsEl = this.container.querySelector('#offM3Objectives');
    if (objsEl) {
      objsEl.innerHTML = snap.objectives.map((o) => this.formatObjectiveChip(o)).join('');
    }

    const rainbowFill = this.container.querySelector<HTMLElement>('#offM3RainbowFill');
    if (rainbowFill) {
      rainbowFill.style.width = `${Math.max(0, Math.min(100, Math.round(snap.rainbowCharge)))}%`;
    }

    const patronusBtn = this.container.querySelector<HTMLButtonElement>('#btnOffM3Patronus');
    if (patronusBtn) {
      const pct = Math.max(0, Math.min(100, Math.round(snap.patronusCharge)));
      patronusBtn.disabled = pct < 100 || snap.status !== 'playing';
      patronusBtn.textContent =
        pct >= 100
          ? isEn
            ? '⚡ Cast Patronus!'
            : '⚡ Gọi Hộ Mệnh!'
          : `🦌 ${pct}%`;
    }

    this.container
      .querySelectorAll<HTMLButtonElement>('[data-booster-kind]')
      .forEach((btn) => {
        const k = btn.dataset.boosterKind;
        btn.classList.toggle('active', Boolean(k && snap.activeBooster === k));
      });

    this.refreshBoosterCounts();
  }

  private refreshBoosterCounts(): void {
    if (!this.container) return;
    const prog = this.host.state.match3Progress;
    const coinsEl = this.container.querySelector('#offM3Coins');
    if (coinsEl) coinsEl.textContent = this.host.state.coins.toLocaleString('vi-VN');

    const setBadge = (id: string, val: number) => {
      const el = this.container?.querySelector(id);
      if (el) el.textContent = val > 0 ? `×${val}` : `${BOOSTER_COIN_COST}🪙`;
    };
    setBadge('#offM3CntHammer', prog.boosters.reparo_hammer);
    setBadge('#offM3CntSwap', prog.boosters.row_col_cannon);
    setBadge('#offM3CntShuffle', prog.boosters.alohomora_shuffle);

    const talEl = this.container.querySelector('#offM3CntTalisman');
    if (talEl) talEl.textContent = `×${prog.phoenixTalismans}`;

    const prevBtn = this.container.querySelector<HTMLButtonElement>('#btnOffM3PrevStage');
    const nextBtn = this.container.querySelector<HTMLButtonElement>('#btnOffM3NextStage');
    const maxUnlocked = Math.min(MAX_MINIGAME_STAGE, prog.maxClearedLevel + 1);
    if (prevBtn) prevBtn.disabled = prog.currentLevel <= 1;
    if (nextBtn) nextBtn.disabled = prog.currentLevel >= maxUnlocked;
  }

  private renderResultOverlay(payload: CandyGameEndPayload): void {
    const overlay = this.container?.querySelector<HTMLElement>('#offM3ResultOverlay');
    if (!overlay) return;
    const isEn = this.host.state.settings.language === 'en';
    const starsStr = '⭐'.repeat(Math.max(1, payload.stars));

    if (payload.won) {
      overlay.innerHTML = `
        <div class="off-result-card won">
          <div class="off-result-badge">${starsStr}</div>
          <h3>${isEn ? `Stage ${payload.levelId} Cleared!` : `Hoàn thành Màn ${payload.levelId}!`}</h3>
          <p>${isEn ? 'Score' : 'Điểm ván'}: <strong>${payload.score.toLocaleString('vi-VN')}</strong></p>
          <p>${isEn ? 'Saved locally on device' : 'Đã lưu kỷ lục trực tiếp trên máy'}</p>
          <div class="off-result-actions">
            <button type="button" class="off-ctrl-btn off-ctrl-primary" id="btnOffM3ContinueNext">
              ${isEn ? 'Next Stage →' : 'Màn tiếp theo →'}
            </button>
            <button type="button" class="off-ctrl-btn" id="btnOffM3ReplaySame">
              🔄 ${isEn ? 'Replay' : 'Chơi lại'}
            </button>
          </div>
        </div>
      `;
    } else {
      const canBuyMoves = this.host.state.coins >= EXTRA_MOVES_COIN_COST;
      overlay.innerHTML = `
        <div class="off-result-card lost">
          <div class="off-result-badge">🕯️</div>
          <h3>${
            payload.failReason === 'bomb'
              ? isEn
                ? 'Candy Bomb Detonated!'
                : 'Kẹo Nổ Đếm Ngược Đã Phát Nổ!'
              : isEn
                ? 'Out of Moves!'
                : 'Hết Lượt Di Chuyển!'
          }</h3>
          <p>${isEn ? 'Score' : 'Điểm đạt được'}: <strong>${payload.score.toLocaleString('vi-VN')}</strong></p>
          <div class="off-result-actions">
            <button
              type="button"
              class="off-ctrl-btn off-ctrl-primary"
              id="btnOffM3BuyMoves"
              ${canBuyMoves ? '' : 'disabled'}
            >
              ➕ +5 ${isEn ? 'Moves' : 'Lượt'} (${EXTRA_MOVES_COIN_COST} 🪙)
            </button>
            <button type="button" class="off-ctrl-btn" id="btnOffM3RetryStage">
              🔄 ${isEn ? 'Try Again' : 'Thử lại màn này'}
            </button>
          </div>
        </div>
      `;
    }

    overlay.hidden = false;

    overlay.querySelector('#btnOffM3ContinueNext')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentLevel(true);
    });
    overlay.querySelector('#btnOffM3ReplaySame')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.state.match3Progress.currentLevel = payload.levelId;
      this.startOrRestoreCurrentLevel(true);
    });
    overlay.querySelector('#btnOffM3RetryStage')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentLevel(true);
    });
    overlay.querySelector('#btnOffM3BuyMoves')?.addEventListener('click', () => {
      if (!this.engine || this.host.state.coins < EXTRA_MOVES_COIN_COST) return;
      this.host.state.coins -= EXTRA_MOVES_COIN_COST;
      this.host.feedback.success();
      this.hideResultOverlay();
      if (payload.failReason === 'bomb') {
        this.engine.addExtraTurnsToBombs(5);
      }
      this.engine.addExtraMoves(5);
      this.persistActiveSession();
      this.refreshBoosterCounts();
    });
  }

  private hideResultOverlay(): void {
    const overlay = this.container?.querySelector<HTMLElement>('#offM3ResultOverlay');
    if (overlay) {
      overlay.hidden = true;
      overlay.innerHTML = '';
    }
  }

  private renderShell(): void {
    if (!this.container) return;
    const { state } = this.host;
    const isEn = state.settings.language === 'en';
    const prog = state.match3Progress;

    const houseOptionsHtml = HOUSE_OPTIONS.map(
      (h) =>
        `<option value="${h.id}" ${prog.house === h.id ? 'selected' : ''}>${h.emoji} ${h.label}</option>`
    ).join('');

    this.container.innerHTML = `
      <section class="off-screen off-m3-screen" aria-label="${isEn ? 'Honeydukes Match-3' : 'Bùa Gặt Honeydukes'}">
        <header class="off-game-topbar">
          <button type="button" class="off-back-btn" id="btnOffM3Back">
            ← ${isEn ? 'Games' : 'Menu'}
          </button>
          <div class="off-stage-nav">
            <button type="button" class="off-icon-btn" id="btnOffM3PrevStage" aria-label="${isEn ? 'Previous stage' : 'Màn trước'}">◀</button>
            <strong id="offM3StageTitle">${isEn ? 'Stage' : 'Màn'} ${prog.currentLevel}</strong>
            <button type="button" class="off-icon-btn" id="btnOffM3NextStage" aria-label="${isEn ? 'Next unlocked stage' : 'Màn kế tiếp'}">▶</button>
          </div>
          <div class="off-topbar-right">
            <span class="off-coin-pill">🪙 <b id="offM3Coins">${state.coins.toLocaleString('vi-VN')}</b></span>
            <button type="button" class="off-icon-btn" id="btnOffM3Records" aria-label="${isEn ? 'Local records' : 'Kỷ lục trên máy'}">🏆</button>
          </div>
        </header>

        <div class="off-m3-hud">
          <div class="off-m3-stat-box">
            <small>${isEn ? 'Moves' : 'Lượt còn'}</small>
            <strong id="offM3Moves">24</strong>
          </div>
          <div class="off-m3-objectives" id="offM3Objectives" aria-label="${isEn ? 'Stage goals' : 'Mục tiêu màn'}"></div>
          <div class="off-m3-stat-box">
            <small>${isEn ? 'Score / Best' : 'Điểm / Kỷ lục'}</small>
            <span><strong id="offM3Score">0</strong> <em class="off-muted">/ <span id="offM3Best">${prog.highScore.toLocaleString('vi-VN')}</span></em></span>
          </div>
        </div>

        <div class="off-m3-meters">
          <div class="off-rainbow-bar" title="${isEn ? 'Rainbow Charge' : 'Năng lượng Cầu Vồng'}">
            <span>🌈</span>
            <div class="off-meter-track"><div class="off-meter-fill" id="offM3RainbowFill"></div></div>
          </div>
          <label class="off-house-select-wrap">
            <span class="sr-only">${isEn ? 'Select Hogwarts House' : 'Chọn Nhà Hogwarts'}</span>
            <select id="selOffM3House" class="off-select">${houseOptionsHtml}</select>
          </label>
          <button type="button" class="off-ctrl-btn off-patronus-btn" id="btnOffM3Patronus" disabled>
            🦌 0%
          </button>
        </div>

        <div class="off-m3-board-wrap" id="offM3BoardWrap">
          <canvas id="offM3Canvas" tabindex="0" aria-label="${isEn ? 'Match-3 game board' : 'Bàn cờ ghép kẹo Honeydukes'}"></canvas>
          <div class="off-result-overlay" id="offM3ResultOverlay" hidden></div>
        </div>

        <footer class="off-m3-boosters toolbar">
          <button type="button" class="off-booster-btn" data-booster-kind="hammer" id="btnOffM3Hammer">
            <span>🔨 ${isEn ? 'Hammer' : 'Búa Kẹo'}</span>
            <small id="offM3CntHammer">×${prog.boosters.reparo_hammer}</small>
          </button>
          <button type="button" class="off-booster-btn" data-booster-kind="swap" id="btnOffM3Swap">
            <span>🔄 ${isEn ? 'Free Swap' : 'Đổi Chỗ'}</span>
            <small id="offM3CntSwap">×${prog.boosters.row_col_cannon}</small>
          </button>
          <button type="button" class="off-booster-btn" id="btnOffM3Shuffle">
            <span>🔀 ${isEn ? 'Shuffle' : 'Xáo Bài'}</span>
            <small id="offM3CntShuffle">×${prog.boosters.alohomora_shuffle}</small>
          </button>
          <button type="button" class="off-booster-btn off-talisman-btn" id="btnOffM3Talisman">
            <span>🔥 ${isEn ? 'Phoenix' : 'Phượng Hoàng'}</span>
            <small id="offM3CntTalisman">×${prog.phoenixTalismans}</small>
          </button>
          <button type="button" class="off-booster-btn" id="btnOffM3Restart">
            <span>↺ ${isEn ? 'Restart' : 'Ván mới'}</span>
          </button>
        </footer>
      </section>
    `;

    this.container.querySelector('#btnOffM3Back')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.navigateTo('home');
    });
    this.container.querySelector('#btnOffM3Records')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openRecordsModal('match3');
    });
    this.container.querySelector('#btnOffM3PrevStage')?.addEventListener('click', () => {
      if (prog.currentLevel <= 1) return;
      this.host.feedback.tap();
      prog.currentLevel -= 1;
      this.startOrRestoreCurrentLevel(true);
    });
    this.container.querySelector('#btnOffM3NextStage')?.addEventListener('click', () => {
      const maxUnlocked = Math.min(MAX_MINIGAME_STAGE, prog.maxClearedLevel + 1);
      if (prog.currentLevel >= maxUnlocked) return;
      this.host.feedback.tap();
      prog.currentLevel += 1;
      this.startOrRestoreCurrentLevel(true);
    });
    this.container.querySelector<HTMLSelectElement>('#selOffM3House')?.addEventListener('change', (ev) => {
      const val = (ev.currentTarget as HTMLSelectElement).value as CandyHouseId;
      prog.house = val;
      this.engine?.setHouse(val);
      this.host.saveCheckpoint();
    });
    this.container.querySelector('#btnOffM3Patronus')?.addEventListener('click', () => {
      void this.engine?.castPatronus();
    });
    this.container.querySelector('#btnOffM3Hammer')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.engine?.setBoosterMode('hammer');
    });
    this.container.querySelector('#btnOffM3Swap')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.engine?.setBoosterMode('swap');
    });
    this.container.querySelector('#btnOffM3Shuffle')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.engine?.setBoosterMode('shuffle');
    });
    this.container.querySelector('#btnOffM3Talisman')?.addEventListener('click', async () => {
      if (!this.engine) return;
      if (prog.phoenixTalismans <= 0) {
        this.host.feedback.error();
        this.host.showToast(
          isEn
            ? 'Win 3 stages in a row to earn +1 Phoenix Talisman!'
            : 'Thắng chuỗi 3 màn liên tiếp để nhận thêm +1 🔥 Bùa Phượng Hoàng!',
          '🔥'
        );
        return;
      }
      const res = await this.engine.applyPhoenixTalisman();
      if (res.ok) {
        prog.phoenixTalismans = Math.max(0, prog.phoenixTalismans - 1);
        this.host.feedback.winFanfare();
        this.refreshBoosterCounts();
        this.persistActiveSession();
      }
      this.host.showToast(res.msg, res.ok ? '🔥' : '⚠️');
    });
    this.container.querySelector('#btnOffM3Restart')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.startOrRestoreCurrentLevel(true);
    });
  }
}
