import {
  buildLocalRecordRows,
  OFFLINE_GAME_CATALOG,
} from '../offlineCatalog';
import {
  escapeHtml,
  type OfflineScreenController,
  type OfflineScreenHost,
} from './screenContext';

export class GameSelectScreen implements OfflineScreenController {
  private readonly host: OfflineScreenHost;
  private container: HTMLElement | null = null;
  private onOnlineChangeBound?: () => void;

  constructor(host: OfflineScreenHost) {
    this.host = host;
  }

  public mount(container: HTMLElement): void {
    this.container = container;
    this.render();
    if (typeof window !== 'undefined') {
      this.onOnlineChangeBound = () => {
        this.updateNetworkBadge();
      };
      window.addEventListener('online', this.onOnlineChangeBound);
      window.addEventListener('offline', this.onOnlineChangeBound);
    }
  }

  public flushCheckpoint(): void {
    // Home screen holds no transient gameplay state
  }

  public destroy(): void {
    if (typeof window !== 'undefined' && this.onOnlineChangeBound) {
      window.removeEventListener('online', this.onOnlineChangeBound);
      window.removeEventListener('offline', this.onOnlineChangeBound);
    }
    this.onOnlineChangeBound = undefined;
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
  }

  private isBrowserOffline(): boolean {
    try {
      return typeof navigator !== 'undefined' && navigator.onLine === false;
    } catch {
      return false;
    }
  }

  private updateNetworkBadge(): void {
    const el = this.container?.querySelector<HTMLElement>('#offlineNetBadge');
    if (!el) return;
    const isEn = this.host.state.settings.language === 'en';
    const offline = this.isBrowserOffline();
    el.dataset.offline = offline ? 'true' : 'false';
    el.textContent = offline
      ? isEn
        ? '✈️ OFFLINE • Playing offline'
        : '✈️ Đang chơi ngoại tuyến'
      : isEn
        ? '⚡ OFFLINE READY • Saved on device'
        : '⚡ OFFLINE • Sẵn sàng không cần mạng';
  }

  public render(): void {
    if (!this.container) return;
    const { state } = this.host;
    const isEn = state.settings.language === 'en';
    const rows = buildLocalRecordRows(state, state.settings.language);
    const rowByGame = new Map(rows.map((r) => [r.gameId, r]));
    const offline = this.isBrowserOffline();

    const cardsHtml = OFFLINE_GAME_CATALOG.map((item) => {
      const rec = rowByGame.get(item.id)!;
      const title = isEn ? item.titleEn : item.titleVi;
      const subtitle = isEn ? item.subtitleEn : item.subtitleVi;
      const resumeChip = rec.hasActiveSession
        ? `<span class="off-resume-pill">${isEn ? '▶ Resume' : '▶ Ván dở'}</span>`
        : '';

      return `
        <button
          type="button"
          class="off-game-card"
          data-game-id="${escapeHtml(item.id)}"
          style="--card-accent: ${escapeHtml(item.accentHex)}"
        >
          <div class="off-game-card-art">
            <img src="${escapeHtml(item.artworkPath)}" alt="" loading="eager" decoding="async" />
            <span class="off-game-card-badge">${escapeHtml(item.icon)} ${escapeHtml(isEn ? item.badgeEn : item.badgeVi)}</span>
            ${resumeChip}
          </div>
          <div class="off-game-card-body">
            <div class="off-game-card-head">
              <h2>${escapeHtml(title)}</h2>
              <span class="off-game-card-cta" aria-hidden="true">${isEn ? 'Play →' : 'Chơi →'}</span>
            </div>
            <p class="off-game-card-sub">${escapeHtml(subtitle)}</p>
            <div class="off-game-card-stats">
              <span>📍 ${escapeHtml(rec.stageLabel)}</span>
              <span>🏆 ${escapeHtml(rec.highScoreLabel)}</span>
            </div>
          </div>
        </button>
      `;
    }).join('');

    this.container.innerHTML = `
      <section class="off-hub" aria-labelledby="offlineHubTitle">
        <header class="off-hub-hero">
          <div class="off-hub-brand">
            <div class="off-hub-logo" aria-hidden="true">🦉</div>
            <div class="off-hub-titles">
              <div class="off-hub-eyebrow">
                <span id="offlineNetBadge" class="off-net-pill" data-offline="${offline ? 'true' : 'false'}">
                  ${escapeHtml(
                    offline
                      ? isEn
                        ? '✈️ OFFLINE • Playing offline'
                        : '✈️ Đang chơi ngoại tuyến'
                      : isEn
                        ? '⚡ OFFLINE READY • Saved on device'
                        : '⚡ OFFLINE • Sẵn sàng không cần mạng'
                  )}
                </span>
              </div>
              <h1 id="offlineHubTitle">${isEn ? 'Hang Sóc Mini-games' : 'Hang Sóc Mini-games Offline'}</h1>
              <p class="off-hub-desc">
                ${
                  isEn
                    ? '5 standalone wizarding puzzle games. Works in Airplane Mode — all scores & stages stay safely on your phone.'
                    : '5 trò chơi trí tuệ Hang Sóc độc lập. Chơi mượt ngay cả khi bật Chế độ Máy bay — toàn bộ kỷ lục & màn chơi lưu ngay trên máy.'
                }
              </p>
            </div>
          </div>

          <div class="off-hub-wallet" role="group" aria-label="${isEn ? 'Local progress summary' : 'Tóm tắt tiến trình trên máy'}">
            <div class="off-stat-chip">
              <span aria-hidden="true">🪙</span>
              <strong>${state.coins.toLocaleString('vi-VN')}</strong>
              <small>${isEn ? 'Coins' : 'Xu phép'}</small>
            </div>
            <div class="off-stat-chip">
              <span aria-hidden="true">⭐</span>
              <strong>${state.xp.toLocaleString('vi-VN')}</strong>
              <small>XP</small>
            </div>
            <div class="off-stat-chip">
              <span aria-hidden="true">🔥</span>
              <strong>${state.match3Progress.phoenixTalismans + state.puzzleArcade.phoenixTalismans}</strong>
              <small>${isEn ? 'Talismans' : 'Bùa lửa'}</small>
            </div>
          </div>

          <div class="off-hub-controls toolbar">
            <button type="button" class="off-ctrl-btn off-ctrl-primary" id="btnOpenLocalRecords">
              🏆 ${isEn ? 'Device Records' : 'Kỷ lục trên máy'}
            </button>
            <button
              type="button"
              class="off-ctrl-btn"
              id="btnToggleSound"
              aria-pressed="${state.settings.sound ? 'true' : 'false'}"
            >
              ${state.settings.sound ? '🔊' : '🔇'} ${isEn ? 'Sound' : 'Âm thanh'}
            </button>
            <button
              type="button"
              class="off-ctrl-btn"
              id="btnToggleHaptics"
              aria-pressed="${state.settings.haptics ? 'true' : 'false'}"
            >
              ${state.settings.haptics ? '📳' : '📴'} ${isEn ? 'Haptics' : 'Rung'}
            </button>
            <button type="button" class="off-ctrl-btn" id="btnToggleLang">
              🌐 ${state.settings.language === 'en' ? 'Tiếng Việt' : 'English'}
            </button>
            <button type="button" class="off-ctrl-btn off-ctrl-danger" id="btnResetSave">
              🗑️ ${isEn ? 'Reset Save' : 'Đặt lại lưu'}
            </button>
            <button type="button" class="off-ctrl-btn" id="btnOpenMainFarm">
              🏡 ${isEn ? 'Main Farm' : 'Về game chính'}
            </button>
          </div>
        </header>

        <div class="off-game-grid" role="list" aria-label="${isEn ? 'Mini-game list' : 'Danh sách 5 mini-game'}">
          ${cardsHtml}
        </div>
      </section>
    `;

    this.container.querySelectorAll<HTMLButtonElement>('.off-game-card').forEach((btn) => {
      btn.addEventListener('click', () => {
        const gameId = btn.dataset.gameId as
          | 'match3'
          | 'jigsaw'
          | 'sudoku'
          | 'blocks'
          | 'seedQuiz'
          | undefined;
        if (!gameId) return;
        this.host.feedback.tap();
        this.host.navigateTo(gameId);
      });
    });

    this.container.querySelector('#btnOpenLocalRecords')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openRecordsModal();
    });
    this.container.querySelector('#btnToggleSound')?.addEventListener('click', () => {
      this.host.toggleSound();
      this.render();
    });
    this.container.querySelector('#btnToggleHaptics')?.addEventListener('click', () => {
      this.host.toggleHaptics();
      this.render();
    });
    this.container.querySelector('#btnToggleLang')?.addEventListener('click', () => {
      this.host.toggleLanguage();
      this.render();
    });
    this.container.querySelector('#btnResetSave')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openResetConfirmModal();
    });
    this.container.querySelector('#btnOpenMainFarm')?.addEventListener('click', () => {
      this.host.feedback.tap();
      this.host.openMainFarmApp();
    });
  }
}
