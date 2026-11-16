import { buildLocalRecordRows } from './offlineCatalog';
import { OfflineFeedback } from './offlineFeedback';
import {
  loadOfflineStateAsync,
  loadOfflineStateSync,
  resetOfflineProgress,
  saveOfflineState,
} from './offlineStorage';
import type {
  OfflineGameId,
  OfflineMiniGameState,
} from './offlineTypes';
import { GameSelectScreen } from './screens/gameSelect';
import { Match3OfflineScreen } from './screens/match3Screen';
import { PuzzleOfflineScreen } from './screens/puzzleScreen';
import {
  escapeHtml,
  type OfflineScreenController,
  type OfflineScreenHost,
} from './screens/screenContext';
import { SeedQuizOfflineScreen } from './screens/seedQuizScreen';

export interface OfflineAppOptions {
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  mainFarmUrl?: string;
}

export class OfflineMiniGameApp implements OfflineScreenHost {
  public state: OfflineMiniGameState;
  public readonly feedback: OfflineFeedback;

  private readonly root: HTMLElement;
  private readonly storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  private readonly mainFarmUrl: string;

  private screenMountEl!: HTMLElement;
  private toastStackEl!: HTMLElement;
  private recordsDialogEl!: HTMLDialogElement;
  private resetDialogEl!: HTMLDialogElement;

  private activeRoute: 'home' | OfflineGameId = 'home';
  private activeController: OfflineScreenController | null = null;

  private onVisibilityChangeBound?: () => void;
  private onPageHideBound?: () => void;

  constructor(root: HTMLElement, options: OfflineAppOptions = {}) {
    this.root = root;
    this.storage = options.storage;
    this.mainFarmUrl =
      options.mainFarmUrl ||
      (typeof window !== 'undefined' &&
      (window as Window & { __HANGSOC_MAIN_FARM_URL__?: string }).__HANGSOC_MAIN_FARM_URL__) ||
      '/';

    const syncLoaded = loadOfflineStateSync(this.storage);
    this.state = syncLoaded.state;
    this.feedback = new OfflineFeedback(() => this.state.settings);

    this.buildAppChrome();

    if (syncLoaded.recoveredFromCorruption) {
      saveOfflineState(this.state, this.storage);
      this.showToast(
        this.state.settings.language === 'en'
          ? 'Corrupted local save detected — initialized a clean save.'
          : 'Phát hiện dữ liệu lưu cũ bị lỗi — đã khởi tạo bản lưu mới an toàn.',
        '🛠️'
      );
    }

    this.navigateTo('home');
    this.bindLifecycleCheckpoints();

    // Reconcile asynchronously with IndexedDB primary store when no gameplay has mutated state yet
    const bootUpdatedAt = this.state.updatedAt;
    void loadOfflineStateAsync(this.storage)
      .then((asyncRes) => {
        if (
          this.activeRoute === 'home' &&
          this.state.updatedAt === bootUpdatedAt &&
          asyncRes.state.updatedAt > this.state.updatedAt
        ) {
          this.state = asyncRes.state;
          this.navigateTo('home');
        }
      })
      .catch(() => {
        // Never allow storage promise rejection to bubble
      });
  }

  public get currentRoute(): 'home' | OfflineGameId {
    return this.activeRoute;
  }

  public isSafeToReloadForSwUpdate(): boolean {
    return (
      this.activeRoute === 'home' &&
      !this.recordsDialogEl?.open &&
      !this.resetDialogEl?.open
    );
  }

  public saveCheckpoint(): void {
    saveOfflineState(this.state, this.storage);
  }

  public navigateTo(route: 'home' | OfflineGameId): void {
    if (this.activeController) {
      this.activeController.flushCheckpoint();
      this.activeController.destroy();
      this.activeController = null;
    }

    this.activeRoute = route;
    if (route !== 'home') {
      this.state.lastActiveGame = route;
      this.saveCheckpoint();
    }

    let next: OfflineScreenController;
    switch (route) {
      case 'home':
        next = new GameSelectScreen(this);
        break;
      case 'match3':
        next = new Match3OfflineScreen(this);
        break;
      case 'jigsaw':
      case 'sudoku':
      case 'blocks':
        next = new PuzzleOfflineScreen(this, route);
        break;
      case 'seedQuiz':
        next = new SeedQuizOfflineScreen(this);
        break;
    }

    this.activeController = next;
    this.activeController.mount(this.screenMountEl);
  }

  public toggleSound(): void {
    this.state.settings.sound = !this.state.settings.sound;
    this.saveCheckpoint();
    if (this.state.settings.sound) {
      this.feedback.tap();
    }
  }

  public toggleHaptics(): void {
    this.state.settings.haptics = !this.state.settings.haptics;
    this.saveCheckpoint();
    if (this.state.settings.haptics) {
      this.feedback.vibrate(14);
    }
  }

  public toggleLanguage(): void {
    this.state.settings.language = this.state.settings.language === 'vi' ? 'en' : 'vi';
    this.feedback.tap();
    this.saveCheckpoint();
  }

  public openMainFarmApp(): void {
    const isEn = this.state.settings.language === 'en';
    let offline = false;
    try {
      offline = typeof navigator !== 'undefined' && navigator.onLine === false;
    } catch {
      offline = false;
    }
    if (offline) {
      this.showToast(
        isEn
          ? 'You are currently offline. Reconnect to open the online Main Farm.'
          : 'Đang ở chế độ Ngoại tuyến — hãy kết nối mạng khi muốn mở Trang Trại chính.',
        '✈️'
      );
      return;
    }
    if (typeof window !== 'undefined') {
      window.location.assign(this.mainFarmUrl);
    }
  }

  public openRecordsModal(highlightGame?: OfflineGameId): void {
    const isEn = this.state.settings.language === 'en';
    const rows = buildLocalRecordRows(this.state, this.state.settings.language);
    const bodyEl = this.recordsDialogEl.querySelector<HTMLElement>('#offRecordsBody');
    const titleEl = this.recordsDialogEl.querySelector<HTMLElement>('#offRecordsTitle');
    if (titleEl) {
      titleEl.textContent = isEn ? '🏆 Records on This Device' : '🏆 Kỷ Lục Lưu Trên Máy';
    }
    if (bodyEl) {
      bodyEl.innerHTML = rows
        .map(
          (r) => `
          <div class="off-rec-row ${highlightGame === r.gameId ? 'highlight' : ''}">
            <div class="off-rec-head">
              <strong>${escapeHtml(r.icon)} ${escapeHtml(r.title)}</strong>
              <span class="off-rec-score">${escapeHtml(r.highScoreLabel)}</span>
            </div>
            <div class="off-rec-meta">
              <span>${escapeHtml(r.stageLabel)}</span>
              <span>${escapeHtml(r.winsLabel)}</span>
            </div>
          </div>
        `
        )
        .join('');
    }
    this.showModalSafely(this.recordsDialogEl);
  }

  public openResetConfirmModal(): void {
    const isEn = this.state.settings.language === 'en';
    const titleEl = this.resetDialogEl.querySelector<HTMLElement>('#offResetTitle');
    const descEl = this.resetDialogEl.querySelector<HTMLElement>('#offResetDesc');
    const cancelBtn = this.resetDialogEl.querySelector<HTMLButtonElement>('#btnOffResetCancel');
    const confirmBtn = this.resetDialogEl.querySelector<HTMLButtonElement>('#btnOffResetConfirm');

    if (titleEl) {
      titleEl.textContent = isEn
        ? 'Reset Local Mini-game Save?'
        : 'Đặt lại tiến trình trên máy?';
    }
    if (descEl) {
      descEl.textContent = isEn
        ? 'This clears offline mini-game stages, high scores, and coins on this device. Your main online farm save is never touched.'
        : 'Thao tác này xóa toàn bộ màn đã mở, kỷ lục điểm và xu phép của bản Mini-game Offline trên thiết bị này (tuyệt đối không ảnh hưởng save nông trại chính).';
    }
    if (cancelBtn) cancelBtn.textContent = isEn ? 'Keep Save' : 'Giữ lại';
    if (confirmBtn) confirmBtn.textContent = isEn ? 'Reset Everything' : 'Xóa & Đặt lại';

    this.showModalSafely(this.resetDialogEl);
  }

  public performResetProgress(): void {
    if (this.activeController) {
      this.activeController.destroy();
      this.activeController = null;
    }
    const prevSettings = { ...this.state.settings };
    this.state = resetOfflineProgress(this.storage);
    this.state.settings = prevSettings;
    saveOfflineState(this.state, this.storage);
    this.navigateTo('home');
    this.showToast(
      this.state.settings.language === 'en'
        ? 'Local mini-game progress has been reset.'
        : 'Đã đặt lại toàn bộ tiến trình Mini-game Offline về mặc định.',
      '✨'
    );
  }

  public showToast(message: string, icon = '✨'): void {
    if (!this.toastStackEl || typeof document === 'undefined') return;
    const item = document.createElement('div');
    item.className = 'off-toast';
    item.textContent = `${icon} ${message}`;
    this.toastStackEl.appendChild(item);
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        item.remove();
      }, 2600);
    }
  }

  public destroy(): void {
    if (this.activeController) {
      this.activeController.flushCheckpoint();
      this.activeController.destroy();
      this.activeController = null;
    }
    if (typeof document !== 'undefined' && this.onVisibilityChangeBound) {
      document.removeEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
    if (typeof window !== 'undefined' && this.onPageHideBound) {
      window.removeEventListener('pagehide', this.onPageHideBound);
    }
    this.root.innerHTML = '';
  }

  private showModalSafely(dialog: HTMLDialogElement): void {
    if (dialog.open) return;
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  }

  private bindDialogLightDismissFallback(dialog: HTMLDialogElement): void {
    if (typeof HTMLDialogElement === 'undefined') return;
    if ('closedBy' in HTMLDialogElement.prototype) return;

    const outside = (ev: PointerEvent) => {
      const r = dialog.getBoundingClientRect();
      return (
        ev.clientX < r.left ||
        ev.clientX > r.right ||
        ev.clientY < r.top ||
        ev.clientY > r.bottom
      );
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', (ev) => {
      pressedOutside = outside(ev);
    });
    dialog.addEventListener('pointerup', (ev) => {
      if (pressedOutside && outside(ev)) {
        dialog.close();
      }
    });
  }

  private buildAppChrome(): void {
    this.root.innerHTML = `
      <main id="offScreenMount" class="off-app-main"></main>
      <div id="offToastStack" class="off-toast-stack" aria-live="polite"></div>

      <dialog id="offRecordsDialog" class="off-dialog" closedby="any" aria-labelledby="offRecordsTitle">
        <div class="off-dialog-inner">
          <header class="off-dialog-head">
            <h2 id="offRecordsTitle">🏆 Kỷ Lục Lưu Trên Máy</h2>
            <form method="dialog">
              <button type="submit" class="off-icon-btn" value="close" autofocus aria-label="Đóng">✕</button>
            </form>
          </header>
          <div id="offRecordsBody" class="off-records-list"></div>
        </div>
      </dialog>

      <dialog id="offResetDialog" class="off-dialog" aria-labelledby="offResetTitle">
        <div class="off-dialog-inner">
          <h2 id="offResetTitle">Đặt lại tiến trình trên máy?</h2>
          <p id="offResetDesc" class="off-dialog-desc"></p>
          <form method="dialog" class="off-dialog-actions">
            <button type="submit" id="btnOffResetCancel" class="off-ctrl-btn" value="cancel" autofocus>Giữ lại</button>
            <button type="submit" id="btnOffResetConfirm" class="off-ctrl-btn off-ctrl-danger" value="confirm">Xóa & Đặt lại</button>
          </form>
        </div>
      </dialog>
    `;

    this.screenMountEl = this.root.querySelector<HTMLElement>('#offScreenMount')!;
    this.toastStackEl = this.root.querySelector<HTMLElement>('#offToastStack')!;
    this.recordsDialogEl = this.root.querySelector<HTMLDialogElement>('#offRecordsDialog')!;
    this.resetDialogEl = this.root.querySelector<HTMLDialogElement>('#offResetDialog')!;

    this.bindDialogLightDismissFallback(this.recordsDialogEl);

    this.recordsDialogEl.addEventListener('close', () => {
      this.recordsDialogEl.returnValue = '';
    });

    this.resetDialogEl.addEventListener('close', () => {
      const choice = this.resetDialogEl.returnValue;
      this.resetDialogEl.returnValue = '';
      if (choice === 'confirm') {
        this.performResetProgress();
      }
    });
  }

  private bindLifecycleCheckpoints(): void {
    if (typeof document !== 'undefined') {
      this.onVisibilityChangeBound = () => {
        if (document.visibilityState === 'hidden') {
          this.activeController?.flushCheckpoint();
          this.saveCheckpoint();
        }
      };
      document.addEventListener('visibilitychange', this.onVisibilityChangeBound);
    }
    if (typeof window !== 'undefined') {
      this.onPageHideBound = () => {
        this.activeController?.flushCheckpoint();
        this.saveCheckpoint();
      };
      window.addEventListener('pagehide', this.onPageHideBound);
    }
  }
}
