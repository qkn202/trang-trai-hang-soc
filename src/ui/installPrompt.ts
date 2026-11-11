/**
 * PWA Install Prompt for mobile browsers (Chrome / Android).
 * Manages the 'beforeinstallprompt' event and renders the '💾 Cài Game' mobile CTA button.
 * Remains hidden on desktop or when the app is already installed.
 */

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

interface NavigatorWithWebInstall extends Navigator {
  install?: () => Promise<void>;
  standalone?: boolean;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installBtn: HTMLButtonElement | null = null;
let isInitialized = false;

function supportsWebInstallApi(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    typeof (navigator as NavigatorWithWebInstall).install === 'function'
  );
}

function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const isNarrow = window.matchMedia('(max-width: 820px)').matches;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  return (isCoarse && isNarrow) || isMobileUA;
}

function isStandaloneApp(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    Boolean((navigator as NavigatorWithWebInstall).standalone)
  );
}

function createInstallButton(): HTMLButtonElement {
  const existing = document.getElementById('ipsInstallBtn') as HTMLButtonElement | null;
  if (existing) return existing;

  const btn = document.createElement('button');
  btn.id = 'ipsInstallBtn';
  btn.type = 'button';
  btn.className = 'ips-install-btn hidden';
  btn.setAttribute('aria-label', 'Cài đặt game Trang Trại Hang Sóc');
  btn.innerHTML = '<span class="ips-icon" aria-hidden="true">💾</span><span class="ips-label">Cài Game</span>';

  btn.addEventListener('click', async () => {
    if (btn.getAttribute('aria-disabled') === 'true') return;
    const nav = navigator as NavigatorWithWebInstall;
    const canUseWebInstall = typeof nav.install === 'function';
    if (!canUseWebInstall && !deferredPrompt) {
      btn.classList.add('hidden');
      return;
    }

    // Dùng aria-disabled thay vì disabled để không làm rơi focus bàn phím/trợ năng khi kích hoạt
    btn.setAttribute('aria-disabled', 'true');
    try {
      if (canUseWebInstall && nav.install) {
        await nav.install();
        btn.classList.add('hidden');
      } else if (deferredPrompt) {
        // Sự kiện beforeinstallprompt chỉ dùng được 1 lần: xóa biến lưu trước khi await lựa chọn
        const promptEvent = deferredPrompt;
        deferredPrompt = null;
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted' || !deferredPrompt) {
          btn.classList.add('hidden');
        }
      }
    } catch (err) {
      // Nếu người dùng chủ động hủy qua AbortError trên Web Install API, giữ nút để họ có thể bấm lại sau
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      if (!isAbort && !deferredPrompt) {
        btn.classList.add('hidden');
      }
    } finally {
      btn.removeAttribute('aria-disabled');
    }
  });

  const app = document.getElementById('app') ?? document.body;
  app.appendChild(btn);
  return btn;
}

export function showInstallButton(): void {
  if (!isMobileDevice() || isStandaloneApp()) return;
  if (!installBtn) {
    installBtn = createInstallButton();
  }
  installBtn.classList.remove('hidden');
}

export function hideInstallButton(): void {
  if (installBtn) {
    installBtn.classList.add('hidden');
  }
}

export function initInstallPrompt(): void {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  if (isStandaloneApp()) {
    return;
  }

  installBtn = createInstallButton();

  if (supportsWebInstallApi() && isMobileDevice()) {
    showInstallButton();
  }

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    if (!supportsWebInstallApi() && isMobileDevice() && !isStandaloneApp()) {
      showInstallButton();
    }
  });

  window.addEventListener('appinstalled', () => {
    hideInstallButton();
    deferredPrompt = null;
  });
}

export const installPrompt = {
  init: initInstallPrompt,
  show: showInstallButton,
  hide: hideInstallButton,
};
