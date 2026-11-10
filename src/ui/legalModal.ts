/**
 * LegalModal — Hộp thoại Pháp Lý & Điều Khoản (Privacy Policy, Terms of Service, Copyright Credits)
 * Tự động gắn nút fixed góc đáy-trái (📜 Pháp lý) và modal <dialog> vào document.body (độc lập với hud.ts).
 */

export type LegalTabKey = 'privacy' | 'terms' | 'copyright';

export class LegalModal {
  private buttonEl: HTMLButtonElement | null = null;
  private dialogEl: HTMLDialogElement | null = null;
  private activeTab: LegalTabKey = 'privacy';
  private isMounted = false;

  /**
   * Tạo phần tử DOM và gắn vào document.body
   */
  public mount(): void {
    if (this.isMounted || typeof document === 'undefined') return;
    this.isMounted = true;

    // 1. Nút kích hoạt cố định góc đáy-trái
    this.buttonEl = document.createElement('button');
    this.buttonEl.className = 'legal-trigger-btn';
    this.buttonEl.type = 'button';
    this.buttonEl.setAttribute('aria-haspopup', 'dialog');
    this.buttonEl.setAttribute('aria-label', 'Pháp lý, Quyền riêng tư & Điều khoản');
    this.buttonEl.innerHTML = '<span class="legal-btn-icon">📜</span><span class="legal-btn-label">Pháp lý</span>';

    this.buttonEl.addEventListener('click', () => {
      this.open();
    });

    // 2. Phần tử <dialog>
    this.dialogEl = document.createElement('dialog');
    this.dialogEl.className = 'legal-dialog';
    this.dialogEl.innerHTML = `
      <div class="legal-modal-inner">
        <header class="legal-modal-header">
          <div class="legal-title-group">
            <span class="legal-modal-icon">📜</span>
            <h2 class="legal-modal-title">Pháp Lý &amp; Bản Quyền</h2>
          </div>
          <button type="button" class="legal-close-btn" aria-label="Đóng hộp thoại">✕</button>
        </header>

        <nav class="legal-nav-tabs" role="tablist" aria-label="Danh mục pháp lý">
          <button type="button" class="legal-tab-btn" role="tab" data-tab="privacy" aria-selected="true" data-active="true">Quyền Riêng Tư</button>
          <button type="button" class="legal-tab-btn" role="tab" data-tab="terms" aria-selected="false" data-active="false">Điều Khoản</button>
          <button type="button" class="legal-tab-btn" role="tab" data-tab="copyright" aria-selected="false" data-active="false">Bản Quyền</button>
        </nav>

        <div class="legal-tab-content">
          <section class="legal-panel" data-panel="privacy" data-active="true" role="tabpanel">
            <h3 class="legal-heading">Chính Sách Quyền Riêng Tư (Privacy Policy)</h3>
            <p><strong>Trang Trại Hang Sóc</strong> cam kết tôn trọng tuyệt đối quyền riêng tư và quyền kiểm soát dữ liệu cá nhân của người chơi:</p>
            <ul class="legal-list">
              <li><strong>Lưu trữ cục bộ trên máy (Local Storage):</strong> Toàn bộ tiến trình game (bản đồ thung lũng, vụ mùa, kho nông sản, thành tích 777 màn Bùa Gặt Honeydukes và 4 môn Đại Sảnh Khảo Thí Hogwarts) được lưu trên trình duyệt của bạn qua khóa <code>burrow_hogsmeade_777_v3</code>.</li>
              <li><strong>Đồng bộ đám mây (Cloud Save):</strong> Tính năng lưu đám mây gửi dữ liệu tiến trình ẩn danh lên hệ thống để đồng bộ giữa các thiết bị. Chúng tôi <em>không</em> thu thập thông tin nhận dạng cá nhân (PII), họ tên, email hay số điện thoại.</li>
              <li><strong>Dữ liệu phân tích &amp; Giám sát lỗi:</strong> Các sự kiện vận hành (khởi động phiên chơi, thăng cấp độ, báo cáo mã lỗi) được thu thập ẩn danh nhằm mục đích duy nhất là cải thiện độ mượt và sửa lỗi trò chơi. Không có mã theo dõi quảng cáo của bên thứ ba.</li>
            </ul>
          </section>

          <section class="legal-panel" data-panel="terms" data-active="false" role="tabpanel" style="display: none;">
            <h3 class="legal-heading">Điều Khoản Dịch Vụ (Terms of Service)</h3>
            <p>Chào mừng bạn đến với thung lũng Hang Sóc &amp; Hogsmeade ấm cúng:</p>
            <ul class="legal-list">
              <li><strong>Mục đích trải nghiệm:</strong> Trò chơi được phát triển phục vụ giải trí thư giãn, rèn luyện tư duy chiến thuật (Trận Pháp Ngũ Ấn Đạo Tặc, Ma Trận Cửu Bảo Bối, Cờ Phù Thủy, Nối Hình Sinh Vật Huyền Bí) và hỗ trợ học Học Viện Thần Chú Đa Ngữ 5 thứ tiếng qua phương pháp lặp lại ngắt quãng SRS.</li>
              <li><strong>Hoàn toàn miễn phí:</strong> Trò chơi không áp dụng cơ chế Pay-to-Win hay bán lượt chơi. Toàn bộ 777 màn và các công trình đều có thể mở khóa thông qua Sao Phép Thuật tự kiếm được trong game.</li>
              <li><strong>Chơi Offline &amp; Ngoại tuyến:</strong> Trò chơi chạy hoàn toàn offline theo tiêu chuẩn Progressive Web App (PWA). Tiến trình sẽ tự động đồng bộ khi thiết bị kết nối mạng Internet.</li>
            </ul>
          </section>

          <section class="legal-panel" data-panel="copyright" data-active="false" role="tabpanel" style="display: none;">
            <h3 class="legal-heading">Bản Quyền &amp; Tri Ân Tác Quyền (Credits)</h3>
            <p>Dự án tri ân người hâm mộ (Fan-Made Tribute):</p>
            <ul class="legal-list">
              <li><strong>Quyền sở hữu Thế Giới Phù Thủy:</strong> Tên địa danh (Trang trại Hang Sóc The Burrow, Thung Lũng Hogsmeade, Trường Hogwarts), tên nhân vật và các thuật ngữ ma thuật liên quan thuộc bản quyền của tác giả J.K. Rowling và Warner Bros. Entertainment Inc. Trò chơi này là dự án phi thương mại vì đam mê sáng tạo cộng đồng.</li>
              <li><strong>Mã nguồn &amp; Thiết kế:</strong> Thuật toán đồ họa 2.5D Canvas Plinth-Free, hệ thống xưởng nông trại Township và 5 engine giải đố được đội ngũ phát triển xây dựng hoàn chỉnh.</li>
              <li><strong>Âm nhạc &amp; Hiệu ứng:</strong> 5 bản nhạc nền giao hưởng không lời thích ứng thời tiết &amp; ngày đêm (Ngày / Đêm / Lễ hội / Mưa / Bão) cùng bộ hiệu ứng âm thanh vật lý Acoustic SFX Atlas và Web Audio API.</li>
            </ul>
          </section>
        </div>

        <footer class="legal-modal-footer">
          <span class="legal-version-tag">Hang Sóc Online • PWA 2026</span>
          <button type="button" class="legal-confirm-btn">Đã Hiểu</button>
        </footer>
      </div>
    `;

    // 3. Xử lý đóng modal
    const closeBtn = this.dialogEl.querySelector('.legal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    const confirmBtn = this.dialogEl.querySelector('.legal-confirm-btn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.close());
    }

    // Đóng khi click ngoài backdrop của <dialog>
    this.dialogEl.addEventListener('click', (e) => {
      if (e.target === this.dialogEl) {
        this.close();
      }
    });

    // 4. Xử lý chuyển tab
    const tabButtons = this.dialogEl.querySelectorAll<HTMLButtonElement>('.legal-tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab') as LegalTabKey;
        if (tab) {
          this.switchTab(tab);
        }
      });
    });

    // 5. Append vào document.body
    document.body.appendChild(this.buttonEl);
    document.body.appendChild(this.dialogEl);
  }

  /**
   * Mở modal pháp lý
   */
  public open(): void {
    if (!this.dialogEl) {
      this.mount();
    }
    if (this.dialogEl && typeof this.dialogEl.showModal === 'function') {
      try {
        this.dialogEl.showModal();
      } catch {
        this.dialogEl.setAttribute('open', '');
      }
    }
  }

  /**
   * Đóng modal pháp lý
   */
  public close(): void {
    if (this.dialogEl) {
      if (typeof this.dialogEl.close === 'function') {
        try {
          this.dialogEl.close();
        } catch {
          this.dialogEl.removeAttribute('open');
        }
      } else {
        this.dialogEl.removeAttribute('open');
      }
    }
  }

  /**
   * Chuyển tab hiển thị
   */
  public switchTab(tab: LegalTabKey): void {
    this.activeTab = tab;
    if (!this.dialogEl) return;

    // Cập nhật trạng thái các nút tab
    const tabButtons = this.dialogEl.querySelectorAll<HTMLButtonElement>('.legal-tab-btn');
    tabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-tab') === tab;
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('data-active', isTarget ? 'true' : 'false');
    });

    // Cập nhật các panel nội dung
    const panels = this.dialogEl.querySelectorAll<HTMLElement>('.legal-panel');
    panels.forEach((p) => {
      const isTarget = p.getAttribute('data-panel') === tab;
      p.setAttribute('data-active', isTarget ? 'true' : 'false');
      p.style.display = isTarget ? 'block' : 'none';
    });
  }

  /**
   * Gỡ bỏ khỏi DOM
   */
  public unmount(): void {
    if (this.buttonEl && this.buttonEl.parentNode) {
      this.buttonEl.parentNode.removeChild(this.buttonEl);
    }
    if (this.dialogEl && this.dialogEl.parentNode) {
      this.dialogEl.parentNode.removeChild(this.dialogEl);
    }
    this.buttonEl = null;
    this.dialogEl = null;
    this.isMounted = false;
  }
}
