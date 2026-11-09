/**
 * OnlineBootstrap — Khởi tạo toàn bộ dịch vụ Online / Production cho 'Trang Trại Hang Sóc'
 * Module-level side-effect: Tự khởi chạy khi được nạp qua thẻ script trong index.html.
 */

import { CloudSave } from './cloudSave';
import { Analytics } from './analytics';
import { ErrorMonitor } from './errorMonitor';
import { LegalModal } from './legalModal';

export class OnlineBootstrap {
  public readonly cloudSave: CloudSave;
  public readonly analytics: Analytics;
  public readonly errorMonitor: ErrorMonitor;
  public readonly legalModal: LegalModal;

  private isInitialized = false;

  constructor() {
    this.cloudSave = new CloudSave();
    this.analytics = new Analytics();
    this.errorMonitor = new ErrorMonitor(this.analytics);
    this.legalModal = new LegalModal();
  }

  /**
   * Khởi động toàn bộ các dịch vụ:
   * 1. Giám sát lỗi (Error Monitor)
   * 2. Phân tích sự kiện (Analytics & Auto-track)
   * 3. Nút & Hộp thoại Pháp lý (Legal Modal)
   * 4. Đồng bộ tiến trình đám mây (Cloud Save & Sync Loop)
   */
  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      this.errorMonitor.init();
      this.analytics.init(this.cloudSave);
      this.legalModal.mount();
      this.cloudSave.init();

      console.info(
        '🏰 [Hang Soc Online] Dịch vụ Online/Production đã sẵn sàng: Cloud Save, Analytics, Error Monitor, Legal.'
      );
    } catch (err) {
      console.error('[Hang Soc Online] Lỗi khi khởi động dịch vụ online:', err);
    }
  }
}

// Singleton instance tự khởi chạy (module-level side effect)
const onlineServices = new OnlineBootstrap();

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    window.addEventListener(
      'DOMContentLoaded',
      () => {
        onlineServices.init();
      },
      { once: true }
    );
  } else {
    // DOM đã sẵn sàng (hoặc thẻ script nằm ở cuối body)
    onlineServices.init();
  }
}

export default onlineServices;
