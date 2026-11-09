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

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installBtn: HTMLButtonElement | null = null;
let isInitialized = false;

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
    Boolean((navigator as unknown as { standalone?: boolean }).standalone)
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
    if (!deferredPrompt) {
      btn.classList.add('hidden');
      return;
    }
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        btn.classList.add('hidden');
      }
    } catch {
      // User cancelled or prompt failed gracefully
    } finally {
      deferredPrompt = null;
      btn.classList.add('hidden');
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

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    if (isMobileDevice() && !isStandaloneApp()) {
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
