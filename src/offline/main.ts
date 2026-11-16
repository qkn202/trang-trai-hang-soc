import './styles.css';
import { OfflineMiniGameApp } from './app';

function registerOfflineServiceWorker(app: OfflineMiniGameApp): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  const isLocalDevVite = window.location.port === '5173' || window.location.port === '5174';
  if (isLocalDevVite) return;

  window.addEventListener('load', () => {
    let pendingReload = false;
    let reloaded = false;

    const trySafeReload = () => {
      if (reloaded) return;
      if (!app.isSafeToReloadForSwUpdate()) {
        pendingReload = true;
        return;
      }
      reloaded = true;
      app.saveCheckpoint();
      window.setTimeout(() => {
        window.location.reload();
      }, 60);
    };

    const hadController = Boolean(navigator.serviceWorker.controller);

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;
      trySafeReload();
    });

    window.setInterval(() => {
      if (pendingReload && app.isSafeToReloadForSwUpdate()) {
        pendingReload = false;
        trySafeReload();
      }
    }, 3000);

    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .catch(() => {
        // Ignore SW registration errors on restricted protocols
      });
  });
}

function bootstrapOfflineApp(): void {
  if (typeof document === 'undefined') return;
  const root = document.getElementById('offlineApp');
  if (!root) return;
  const app = new OfflineMiniGameApp(root);
  registerOfflineServiceWorker(app);
}

bootstrapOfflineApp();
