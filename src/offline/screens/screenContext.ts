import type { OfflineFeedback } from '../offlineFeedback';
import type {
  OfflineGameId,
  OfflineMiniGameState,
} from '../offlineTypes';

export interface OfflineScreenHost {
  readonly state: OfflineMiniGameState;
  readonly feedback: OfflineFeedback;
  saveCheckpoint(): void;
  navigateTo(screen: 'home' | OfflineGameId): void;
  openRecordsModal(initialGameId?: OfflineGameId): void;
  openResetConfirmModal(): void;
  toggleSound(): void;
  toggleHaptics(): void;
  toggleLanguage(): void;
  openMainFarmApp(): void;
  showToast(message: string, icon?: string): void;
}

export interface OfflineScreenController {
  mount(container: HTMLElement): void;
  flushCheckpoint(): void;
  destroy(): void;
}

export function escapeHtml(val: unknown): string {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
