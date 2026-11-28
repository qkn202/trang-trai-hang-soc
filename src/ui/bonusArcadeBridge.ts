import {
  BONUS_ARCADE_META,
  BONUS_ARCADE_ORDER,
  isBonusArcadeGameId,
} from '../sim/bonusArcadeGames';
import type { ParkSimulation } from '../sim/simulation';
import type { BonusArcadeGameId } from '../types/game';
import { compactSickle } from '../hpvn/toolIcons';
import { levelBarHtml } from '../hpvn/levelBar';

export const BONUS_ARCADE_CHANNEL = 'hs-bonus-arcade';

export interface BonusArcadeBridgeCallbacks {
  onParentRefresh: () => void;
  showToast: (msg: string, icon?: string) => void;
}

export interface BonusArcadeViewMarkup {
  levelBarHtml: string;
  stageViewportHtml: string;
  controlsBarHtml: string;
}

function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateBonusBridgeToken(): string {
  return `hsb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function buildBonusArcadeTabsHtml(
  sim: ParkSimulation,
  activeBonus: BonusArcadeGameId | null
): string {
  return BONUS_ARCADE_ORDER.map((gid) => {
    const bMeta = BONUS_ARCADE_META[gid];
    const bRec = sim.getBonusArcadeRecord(gid);
    const isSelected = activeBonus === gid;
    const lvBadge =
      gid === 'suika'
        ? bRec.bestScore > 0
          ? compactSickle(bRec.bestScore)
          : 'Kỷ lục'
        : `Màn ${bRec.unlockedStage}`;
    return `
              <button type="button" role="tab" aria-selected="${isSelected}" data-pa-bonus="${gid}" class="pa-mode-tab is-bonus-tab pa-mode-tab-bonus ${isSelected ? 'active' : ''}" title="${escapeHtml(bMeta.titleVi)} • ${escapeHtml(bMeta.specialtyTagVi)}">
                <span class="pa-tab-name"><span class="pa-tab-name-full">${bMeta.icon} ${escapeHtml(bMeta.shortTabVi)}</span><span class="pa-tab-name-short"><span class="pa-tab-ico">${bMeta.icon}</span> ${escapeHtml(bMeta.shortTabVi)}</span></span> <span class="pa-tab-badges"><span class="pa-tab-lv" data-pa-bonus-lv="${gid}">${escapeHtml(lvBadge)}</span></span>
              </button>`;
  }).join('');
}

export function buildBonusArcadeViewMarkup(
  sim: ParkSimulation,
  gameId: BonusArcadeGameId,
  bridgeToken: string
): BonusArcadeViewMarkup {
  const st = sim.state;
  const meta = BONUS_ARCADE_META[gameId];
  const rec = sim.getBonusArcadeRecord(gameId);
  const supply = sim.getBonusArcadeMollySupply(gameId);
  const stageHeading =
    gameId === 'suika' ? meta.titleVi : `${meta.titleVi} · Màn ${rec.unlockedStage}`;
  const iframeSrc = `/game/trang-trai-hang-soc/minigames/${encodeURIComponent(meta.embedFile)}?embed=1&token=${encodeURIComponent(bridgeToken)}`;

  const renderedLevelBarHtml = levelBarHtml({
    stage: `<span id="paBonusStageText">${escapeHtml(stageHeading)}</span>`,
    sub: `<span class="pa-bonus-specialty-badge">${escapeHtml(meta.specialtyTagVi)}</span>`,
    stats: `<span id="paBonusStatsText" class="pa-bonus-stats-text">Kỷ lục: ${rec.bestScore.toLocaleString('vi-VN')} · Thắng: ${rec.winsCount}</span>`,
  });

  const stageViewportHtml = `
        <div class="pa-stage-viewport pa-bonus-stage-viewport">
          <div class="pa-bonus-iframe-shell">
            <iframe
              id="paBonusGameFrame"
              class="pa-bonus-iframe"
              src="${escapeHtml(iframeSrc)}"
              title="${escapeHtml(meta.titleVi)}"
              allow="autoplay"
            ></iframe>
          </div>
        </div>
      `;

  const controlsBarHtml = `
        <div class="pa-controls-bar pa-bonus-controls-bar pa-bonus-controls-row">
          <button
            id="btnPaBonusMollySupply"
            type="button"
            class="pa-tool-btn gold pa-bonus-molly-btn"
            ${!supply.ready ? 'disabled' : ''}
            title="${escapeHtml(`${supply.titleVi}: ${supply.descVi} (Kho: ${supply.haveQty} ${supply.itemNameVi})`)}"
          >
            <img src="/game/trang-trai-hang-soc/sprites/ui_icon_pie_ready.webp" alt="" width="20" height="20" class="aaa-synergy-sprite" />
            <span class="pa-bonus-molly-copy">
              <strong>${escapeHtml(supply.titleVi)}</strong>
              <span id="paBonusMollyQty" class="pa-cost-pill">${st.sandboxMode ? '∞' : `${supply.haveQty}/${supply.qtyNeeded}`}</span>
            </span>
          </button>
          <div class="pa-bonus-specialty-pill pa-bonus-spec-pill" title="${escapeHtml(meta.specialtyDescVi)}">
            <span class="pa-bonus-specialty-tag">${escapeHtml(meta.specialtyTagVi)}</span>
            <span class="pa-bonus-specialty-desc">${escapeHtml(meta.specialtyDescVi)}</span>
          </div>
        </div>
      `;

  return {
    levelBarHtml: renderedLevelBarHtml,
    stageViewportHtml,
    controlsBarHtml,
  };
}

export function scrollActiveArcadeTabIntoView(
  box: HTMLElement | null,
  smooth = true
): void {
  if (!box || typeof box.querySelector !== 'function') return;
  const run = () => {
    const activeTab = box.querySelector(
      '.pa-mode-tabs .pa-mode-tab.active, .pa-mode-tabs .pa-mode-tab[aria-selected="true"]'
    ) as HTMLElement | null;
    if (!activeTab || typeof activeTab.scrollIntoView !== 'function') return;
    try {
      activeTab.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'nearest',
        inline: 'center',
      });
    } catch {
      // Fallback for engines without ScrollIntoViewOptions
      try {
        activeTab.scrollIntoView(false);
      } catch {
        // Ignore stub environments
      }
    }
  };
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(run);
  } else {
    run();
  }
}

export class BonusArcadeBridgeController {
  private readonly root: HTMLElement;
  private readonly sim: ParkSimulation;
  private readonly callbacks: BonusArcadeBridgeCallbacks;
  public activeGame: BonusArcadeGameId | null = null;
  public bridgeToken = '';
  private messageListenerAttached = false;

  constructor(
    root: HTMLElement,
    sim: ParkSimulation,
    callbacks: BonusArcadeBridgeCallbacks
  ) {
    this.root = root;
    this.sim = sim;
    this.callbacks = callbacks;
  }

  public activate(gameId: BonusArcadeGameId): string {
    this.teardownIframe();
    this.activeGame = gameId;
    this.bridgeToken = generateBonusBridgeToken();
    this.attachMessageListener();
    return this.bridgeToken;
  }

  public deactivate(): void {
    this.teardownIframe();
    this.activeGame = null;
  }

  public teardownIframe(): void {
    this.detachMessageListener();
    this.bridgeToken = '';
    const frame = this.getActiveIframe();
    if (frame) {
      try {
        frame.src = 'about:blank';
      } catch {
        // Ignore teardown errors
      }
    }
  }

  public buildTabsHtml(): string {
    return buildBonusArcadeTabsHtml(this.sim, this.activeGame);
  }

  public buildViewMarkup(): BonusArcadeViewMarkup | null {
    if (!this.activeGame) return null;
    return buildBonusArcadeViewMarkup(this.sim, this.activeGame, this.bridgeToken);
  }

  public bindControls(
    box: HTMLElement,
    onSwitchBonusGame: (gameId: BonusArcadeGameId) => void
  ): void {
    box.querySelectorAll<HTMLButtonElement>('[data-pa-bonus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset.paBonus;
        if (isBonusArcadeGameId(raw) && raw !== this.activeGame) {
          onSwitchBonusGame(raw);
        }
      });
    });

    box.querySelector('#btnPaBonusMollySupply')?.addEventListener('click', () => {
      this.triggerMollySupply(box);
    });
  }

  public triggerMollySupply(box: HTMLElement): void {
    const gid = this.activeGame;
    if (!gid) return;
    const meta = BONUS_ARCADE_META[gid];
    const res = this.sim.consumeBonusArcadeMollySupply(gid);
    if (!res.ok) {
      this.callbacks.showToast(res.msg, '🥧');
      this.refreshHeaderAndControls(gid);
      return;
    }
    const frame = box.querySelector('#paBonusGameFrame') as HTMLIFrameElement | null;
    if (frame?.contentWindow) {
      frame.contentWindow.postMessage(
        {
          channel: BONUS_ARCADE_CHANNEL,
          type: 'molly-boost',
          gameId: gid,
          token: this.bridgeToken,
          boostKind: res.boostKind ?? meta.mollyBoostKind,
        },
        '*'
      );
    } else {
      this.callbacks.showToast(res.msg, meta.icon);
    }
    this.refreshHeaderAndControls(gid);
    this.callbacks.onParentRefresh();
  }

  public syncAudio(soundEnabled?: boolean): void {
    const gid = this.activeGame;
    if (!gid || !this.bridgeToken) return;
    const frame = this.getActiveIframe();
    if (!frame?.contentWindow) return;
    const enabled =
      typeof soundEnabled === 'boolean' ? soundEnabled : Boolean(this.sim.audio.enabled);
    frame.contentWindow.postMessage(
      {
        channel: BONUS_ARCADE_CHANNEL,
        type: 'audio-sync',
        gameId: gid,
        token: this.bridgeToken,
        soundEnabled: enabled,
        muted: !enabled,
      },
      '*'
    );
  }

  public refreshHeaderAndControls(gameId: BonusArcadeGameId): void {
    const box = this.root.querySelector('#puzzleArcadeDialogContent') as HTMLElement | null;
    if (!box) return;
    const st = this.sim.state;
    const meta = BONUS_ARCADE_META[gameId];
    const rec = this.sim.getBonusArcadeRecord(gameId);
    const supply = this.sim.getBonusArcadeMollySupply(gameId);

    const starsEl = box.querySelector('#paStarsText');
    if (starsEl) starsEl.textContent = st.sandboxMode ? '∞' : compactSickle(st.match3.stars);
    const sandEl = box.querySelector('#paSandText');
    if (sandEl) sandEl.textContent = st.sandboxMode ? '∞' : String(st.timeSand);
    const goldEl = box.querySelector('#paGoldText');
    if (goldEl) goldEl.textContent = st.sandboxMode ? '∞' : compactSickle(st.galleons);
    const talEl = box.querySelector('#paTalismanText');
    if (talEl) talEl.textContent = st.sandboxMode ? '∞' : String(this.sim.getPhoenixTalismanCount());

    const stageEl = box.querySelector('#paBonusStageText');
    if (stageEl) {
      stageEl.textContent =
        gameId === 'suika' ? meta.titleVi : `${meta.titleVi} · Màn ${rec.unlockedStage}`;
    }
    const statsEl = box.querySelector('#paBonusStatsText');
    if (statsEl) {
      statsEl.textContent = `Kỷ lục: ${rec.bestScore.toLocaleString('vi-VN')} · Thắng: ${rec.winsCount}`;
    }
    const tabLvEl = box.querySelector(`[data-pa-bonus-lv="${gameId}"]`);
    if (tabLvEl) {
      tabLvEl.textContent =
        gameId === 'suika'
          ? rec.bestScore > 0
            ? compactSickle(rec.bestScore)
            : 'Kỷ lục'
          : `Màn ${rec.unlockedStage}`;
    }

    const supplyBtn = box.querySelector('#btnPaBonusMollySupply') as HTMLButtonElement | null;
    if (supplyBtn) {
      supplyBtn.disabled = !supply.ready;
      supplyBtn.title = `${supply.titleVi}: ${supply.descVi} (Kho: ${supply.haveQty} ${supply.itemNameVi})`;
    }
    const qtyEl = box.querySelector('#paBonusMollyQty');
    if (qtyEl) {
      qtyEl.textContent = st.sandboxMode ? '∞' : `${supply.haveQty}/${supply.qtyNeeded}`;
    }
  }

  private getActiveIframe(): HTMLIFrameElement | null {
    return this.root.querySelector('#paBonusGameFrame') as HTMLIFrameElement | null;
  }

  private attachMessageListener(): void {
    if (this.messageListenerAttached || typeof window === 'undefined') return;
    window.addEventListener('message', this.handleMessage);
    this.messageListenerAttached = true;
  }

  private detachMessageListener(): void {
    if (!this.messageListenerAttached || typeof window === 'undefined') return;
    window.removeEventListener('message', this.handleMessage);
    this.messageListenerAttached = false;
  }

  private readonly handleMessage = (ev: MessageEvent): void => {
    const data = ev.data as Record<string, unknown> | null | undefined;
    if (!data || typeof data !== 'object') return;
    if (data.channel !== BONUS_ARCADE_CHANNEL) return;
    const gameId = this.activeGame;
    if (!gameId || data.gameId !== gameId) return;
    if (!this.bridgeToken || data.token !== this.bridgeToken) return;

    const frame = this.getActiveIframe();
    if (frame && frame.contentWindow && ev.source && ev.source !== frame.contentWindow) return;

    const meta = BONUS_ARCADE_META[gameId];
    const type = String(data.type ?? '');

    if (type === 'ready') {
      const rec = this.sim.getBonusArcadeRecord(gameId);
      const reducedMotion = Boolean(
        typeof window !== 'undefined' &&
          window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      );
      frame?.contentWindow?.postMessage(
        {
          channel: BONUS_ARCADE_CHANNEL,
          type: 'init',
          gameId,
          token: this.bridgeToken,
          state: rec,
          record: rec,
          soundEnabled: Boolean(this.sim.audio.enabled),
          reducedMotion,
        },
        '*'
      );
      return;
    }

    if (type === 'victory') {
      const outcome = this.sim.completeBonusArcadeVictory(gameId, {
        stage: typeof data.stage === 'number' ? data.stage : undefined,
        score: typeof data.score === 'number' ? data.score : undefined,
        combo: typeof data.combo === 'number' ? data.combo : undefined,
        isBoss: Boolean(data.isBoss),
        runId: typeof data.runId === 'string' ? data.runId : undefined,
      });
      if (outcome.ok) {
        this.refreshHeaderAndControls(gameId);
        this.callbacks.showToast(outcome.msg, meta.icon);
        this.callbacks.onParentRefresh();
      }
      return;
    }

    if (type === 'score') {
      this.sim.recordBonusArcadeScore(gameId, {
        bestScore: typeof data.bestScore === 'number' ? data.bestScore : undefined,
        bestCombo: typeof data.bestCombo === 'number' ? data.bestCombo : undefined,
        unlockedStage: typeof data.unlockedStage === 'number' ? data.unlockedStage : undefined,
      });
      this.refreshHeaderAndControls(gameId);
      return;
    }

    if (type === 'audio-sync') {
      if (typeof data.request === 'boolean' && data.request) {
        this.syncAudio();
      }
      return;
    }

    if (type === 'boost-applied') {
      const msgVi =
        typeof data.msgVi === 'string' && data.msgVi.trim()
          ? data.msgVi.trim()
          : `${meta.mollyBoostTitleVi}: ${meta.mollyBoostDescVi}`;
      this.callbacks.showToast(msgVi, meta.icon);
    }
  };
}
