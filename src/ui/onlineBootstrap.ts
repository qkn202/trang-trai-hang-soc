/**
 * OnlineBootstrap — Khởi tạo toàn bộ dịch vụ Online / Production cho 'Trang Trại Hang Sóc'
 * Nâng cấp chuẩn HPVNN (`thachanhgau/hagridfarm`):
 *  - `authoritativeClient`: Kênh RPC tuần tự + `requestId` idempotency + `expectedRevision` + HPVN `#hpvn-ticket`.
 *  - `hpvnBridge`: Cầu nối `postMessage` 2 chiều với trang chủ HPVN & chia sẻ Mạng Floo.
 *  - `cloudSave`, `analytics`, `errorMonitor`, `legalModal`.
 */

import {
  hydrateCloudLeaderboardsFromSnapshot,
  registerAuthoritativeLeaderboardTransport,
} from '../sim/minigameLeaderboard';
import { Analytics } from './analytics';
import {
  type AuthoritativeError,
  type AuthoritativeSnapshot,
  type BurrowGardenClient,
  createAutoAuthoritativeClient,
  formatServerRefusalVi,
} from './authoritativeClient';
import {
  acquireSessionBearerToken,
  CloudSave,
  SAVE_KEY,
  setAuthenticatedUserId,
} from './cloudSave';
import { ErrorMonitor } from './errorMonitor';
import { createHpvnBridge, type FlooShareContext } from './hpvnBridge';
import { LegalModal } from './legalModal';

export interface SimulationWalletTargetLike {
  state: {
    galleons: number;
    level: number;
    sandboxMode?: boolean;
    sandboxTainted?: boolean;
  };
  homeStateWhileVisiting?: {
    galleons: number;
    level: number;
    sandboxMode?: boolean;
    sandboxTainted?: boolean;
  } | null;
  isHeadmasterPreview?: boolean;
  saveToStorage: () => void;
  onUiChange?: (() => void) | null;
}

export function bindAuthoritativeLeaderboardClient(client: BurrowGardenClient): void {
  registerAuthoritativeLeaderboardTransport({
    fetchLeaderboards: async (gameId) => {
      const snap = await client.getLeaderboard(gameId);
      hydrateCloudLeaderboardsFromSnapshot(snap.leaderboards);
      return snap.leaderboards ?? null;
    },
    submitLeaderboard: async (payload) => {
      const snap = await client.submitLeaderboard(payload);
      hydrateCloudLeaderboardsFromSnapshot(snap.leaderboards);
      return snap.leaderboards ?? null;
    },
  });
}

export class OnlineBootstrap {
  public readonly cloudSave: CloudSave;
  public readonly analytics: Analytics;
  public readonly errorMonitor: ErrorMonitor;
  public readonly legalModal: LegalModal;
  public readonly authoritativeClient: BurrowGardenClient;
  public readonly hpvnBridge: ReturnType<typeof createHpvnBridge>;

  private isInitialized = false;
  private lastAuthoritativeWalletBalance: number | null = null;
  private walletSyncTimer: ReturnType<typeof setTimeout> | null = null;
  private isApplyingServerWallet = false;
  private boundSim: SimulationWalletTargetLike | null = null;

  constructor() {
    this.cloudSave = new CloudSave();
    this.analytics = new Analytics();
    this.errorMonitor = new ErrorMonitor(this.analytics);
    this.legalModal = new LegalModal();
    this.authoritativeClient = createAutoAuthoritativeClient();
    this.hpvnBridge = createHpvnBridge({
      getSnapshot: () => {
        try {
          const raw =
            typeof localStorage !== 'undefined' ? localStorage.getItem(SAVE_KEY) : null;
          if (!raw) return {};
          const parsed = JSON.parse(raw) as Record<string, unknown>;
          const m3 =
            parsed.match3 && typeof parsed.match3 === 'object'
              ? (parsed.match3 as Record<string, unknown>)
              : null;
          const settings =
            parsed.settings && typeof parsed.settings === 'object'
              ? (parsed.settings as Record<string, unknown>)
              : null;
          return {
            version: Number(parsed.version || 3),
            parkName: String(parsed.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
            level: Math.max(1, Math.floor(Number(parsed.level) || 1)),
            xp: Math.max(0, Math.floor(Number(parsed.xp) || 0)),
            magicStars: Math.max(0, Math.floor(Number(m3?.stars ?? parsed.magicStars) || 0)),
            unlockedZonesCount: Array.isArray(parsed.unlockedZones)
              ? parsed.unlockedZones.length
              : 1,
            buildingsCount: Array.isArray(parsed.buildings) ? parsed.buildings.length : 0,
            weatherMode: String(settings?.weatherOverride || parsed.weatherMode || 'auto'),
            atmosphereMode: String(settings?.timeOverride || parsed.timeMode || 'auto'),
          };
        } catch {
          return {};
        }
      },
      onAtmosphereChange: (mode) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:atmosphere', { detail: { mode } }));
        }
      },
      onWeatherChange: (mode) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:weather', { detail: { mode } }));
        }
      },
      onMuteChange: (muted) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:mute', { detail: { muted } }));
        }
      },
      onEventChange: (mode) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:event', { detail: { mode } }));
        }
      },
      onStartTour: (tourId) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:tour-garden', { detail: { tourId } }));
        }
      },
      onStopTour: () => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:tour-garden', { detail: { tourId: null } }));
        }
      },
      notify: (msg) => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hpvn:toast', { detail: { text: msg } }));
        }
      },
    });
  }

  /**
   * Khởi động toàn bộ các dịch vụ:
   * 1. Giám sát lỗi (Error Monitor)
   * 2. Phân tích sự kiện (Analytics & Auto-track)
   * 3. Nút & Hộp thoại Pháp lý (Legal Modal)
   * 4. Đồng bộ tiến trình đám mây & Authoritative RPC Bootstrap
   * 5. Báo tín hiệu `hpvn:burrow:ready` & lắng nghe cầu nối `hpvn:sync-state` / `hpvn:visit-help`
   */
  public init(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      this.errorMonitor.init();
      this.analytics.init(this.cloudSave);
      this.legalModal.mount();
      this.cloudSave.init();
      bindAuthoritativeLeaderboardClient(this.authoritativeClient);

      if (typeof window !== 'undefined') {
        window.addEventListener('hpvn:sync-state', (ev: Event) => {
          const detail = (ev as CustomEvent<Record<string, unknown>>).detail;
          if (detail && typeof detail === 'object') {
            this.hpvnBridge.syncState(detail);
          }
        });

        window.addEventListener('hpvn:share-floo', (ev: Event) => {
          const detail = ((ev as CustomEvent<FlooShareContext>).detail ?? {}) as FlooShareContext;
          void this.hpvnBridge.shareToFloo({
            ...detail,
            sendToFloo:
              detail.sendToFloo ??
              (async (text, shareCtx) => {
                if (typeof this.authoritativeClient.host !== 'function') return false;
                try {
                  const res = await this.authoritativeClient.host('floo-share', {
                    text,
                    ...(shareCtx.image ? { image: shareCtx.image } : {}),
                    ...(shareCtx.tourId ? { tourId: shareCtx.tourId } : {}),
                  });
                  return Boolean(
                    res &&
                      typeof res === 'object' &&
                      (res as Record<string, unknown>).ok !== false
                  );
                } catch {
                  return false;
                }
              }),
          });
        });

        window.addEventListener('hpvn:visit-help', (ev: Event) => {
          const detail = (ev as CustomEvent<{
            hostUid?: string;
            buildingUid?: string;
            kind?: string;
            noteText?: string;
            helperName?: string;
            helperEmoji?: string;
          }>).detail;
          if (!detail?.hostUid) return;
          void this.authoritativeClient
            .visit({
              hostUid: detail.hostUid,
              help: true,
              buildingUid: detail.buildingUid,
              kind: detail.kind || 'water_crop',
              noteText: detail.noteText,
              helperName: detail.helperName,
              helperEmoji: detail.helperEmoji,
            })
            .catch(() => {});
        });
      }

      // Khởi tạo snapshot ủy quyền & đồng bộ Ví Galleon Gringotts HPVN (im lặng nếu chạy thuần offline)
      if (typeof navigator === 'undefined' || navigator.onLine) {
        this.authoritativeClient
          .read()
          .then((snap) => {
            hydrateCloudLeaderboardsFromSnapshot(snap.leaderboards);
            if (snap.wallet && typeof snap.wallet.spendable === 'number') {
              this.syncWalletBaseline(snap.wallet.spendable);
            }
            if (typeof snap.uid === 'string' && snap.uid) {
              const prevUid = this.cloudSave.getUserId();
              const unifiedUid = setAuthenticatedUserId(snap.uid);
              if (unifiedUid !== prevUid) {
                // Nếu UID từ vé HPVN / Firebase Auth khác với UID tạm cục bộ -> tải bản lưu đám mây rồi áp lại số dư Gringotts
                acquireSessionBearerToken(unifiedUid)
                  .catch(() => null)
                  .then(() => this.cloudSave.downloadNow())
                  .then(() => {
                    if (typeof window !== 'undefined' && this.authoritativeClient.snapshot) {
                      window.dispatchEvent(
                        new CustomEvent('hpvn:authoritative-snapshot', {
                          detail: this.authoritativeClient.snapshot,
                        })
                      );
                    }
                  })
                  .catch(() => {});
              }
            }
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('hpvn:authoritative-snapshot', { detail: snap })
              );
            }
          })
          .catch(() => {});
      }

      this.hpvnBridge.notifyReady({
        uid: this.cloudSave.getUserId(),
        region: 'asia-southeast1',
        protocol: 'burrow-hpvnn-25.1',
      });

      console.info(
        '🏰 [Hang Soc Online] Dịch vụ Authoritative Backend đã sẵn sàng: RPC Client, Ví Gringotts HPVN, HPVN Bridge, Cloud Save, Analytics, Error Monitor, Legal.'
      );
    } catch (err) {
      console.error('[Hang Soc Online] Lỗi khi khởi động dịch vụ online:', err);
    }
  }

  /**
   * Ghi nhận mốc số dư ủy quyền mới nhất từ Ví Gringotts HPVN (`galleons_accounts/{uid}`)
   * để tránh vòng lặp tự phát lệnh `settleBurrowWallet` khi HUD áp snapshot từ máy chủ.
   */
  public syncWalletBaseline(spendable: number): void {
    if (!Number.isFinite(spendable)) return;
    this.lastAuthoritativeWalletBalance = Math.max(0, Math.floor(spendable));
  }

  /**
   * Liên kết vòng đời lưu trạng thái của `ParkSimulation` với Ví Galleon Gringotts HPVN:
   *  - Chỉ kích hoạt sau khi đã nhận được `wallet.spendable` hợp lệ từ máy chủ HPVN (không ảnh hưởng offline/unit test).
   *  - Gom biến động Galleon trong cửa sổ 180ms (mua hạt, bán nông sản, nâng cấp kho, Đơn Cú...) và quyết toán nguyên tử qua `settleBurrowWallet`.
   *  - Nếu ví bị khóa (`wallet-frozen`), thiếu số dư thực trên diễn đàn (`insufficient-balance`) hoặc chạm trần ngày (`daily-cap`),
   *    tự động hoàn đồng bộ số dư HUD về đúng số dư thật của Ngân Hàng Gringotts.
   */
  public bindSimulationGringottsWallet(
    sim: SimulationWalletTargetLike,
    options: {
      onSnapshot?: (snap: AuthoritativeSnapshot) => void;
      onToast?: (msg: string, icon?: string) => void;
      debounceMs?: number;
    } = {}
  ): () => void {
    if (this.boundSim === sim) {
      return () => {};
    }
    this.boundSim = sim;

    if (
      this.lastAuthoritativeWalletBalance === null &&
      this.authoritativeClient.snapshot?.wallet &&
      typeof this.authoritativeClient.snapshot.wallet.spendable === 'number'
    ) {
      this.syncWalletBaseline(this.authoritativeClient.snapshot.wallet.spendable);
    }

    const origSaveToStorage = sim.saveToStorage.bind(sim);
    const debounceMs = Math.max(0, options.debounceMs ?? 180);

    const applyServerBalanceToSim = (spendable: number) => {
      const cleanBalance = Math.max(0, Math.floor(spendable));
      this.syncWalletBaseline(cleanBalance);
      this.isApplyingServerWallet = true;
      try {
        const homeOrActive = sim.homeStateWhileVisiting ?? sim.state;
        if (!homeOrActive.sandboxMode && !homeOrActive.sandboxTainted) {
          homeOrActive.galleons = cleanBalance;
          if (sim.homeStateWhileVisiting) {
            sim.state.galleons = cleanBalance;
          }
          origSaveToStorage();
          sim.onUiChange?.();
        }
      } finally {
        this.isApplyingServerWallet = false;
      }
    };

    const flushDelta = async () => {
      this.walletSyncTimer = null;
      if (this.isApplyingServerWallet || this.lastAuthoritativeWalletBalance === null) {
        return;
      }
      const homeOrActive = sim.homeStateWhileVisiting ?? sim.state;
      if (
        homeOrActive.sandboxMode ||
        homeOrActive.sandboxTainted ||
        sim.isHeadmasterPreview
      ) {
        return;
      }

      const targetGalleons = Math.max(0, Math.floor(Number(homeOrActive.galleons) || 0));
      const delta = targetGalleons - this.lastAuthoritativeWalletBalance;
      if (delta === 0) return;

      const prevBaseline = this.lastAuthoritativeWalletBalance;
      this.lastAuthoritativeWalletBalance = targetGalleons;

      const direction: 'debit' | 'credit' = delta < 0 ? 'debit' : 'credit';
      let remaining = Math.abs(delta);
      const maxChunk = direction === 'credit' ? 1000 : 50_000;

      try {
        let latestSnap: AuthoritativeSnapshot | null = null;
        while (remaining > 0) {
          const chunk = Math.min(remaining, maxChunk);
          remaining -= chunk;
          latestSnap = await this.authoritativeClient.settleWallet({
            direction,
            amount: chunk,
            reasonCode: direction === 'debit' ? 'burrow_gameplay_spend' : 'burrow_gameplay_earn',
            sourceType: direction === 'debit' ? 'burrow-garden-store' : 'burrow-garden-market',
            clientLevel: Math.max(1, Math.floor(Number(homeOrActive.level) || 1)),
          });
        }
        if (latestSnap?.wallet && typeof latestSnap.wallet.spendable === 'number') {
          applyServerBalanceToSim(latestSnap.wallet.spendable);
          options.onSnapshot?.(latestSnap);
        }
      } catch (err) {
        const authErr = err as AuthoritativeError;
        if (authErr?.definitive === true) {
          const refusal = formatServerRefusalVi(authErr);
          options.onToast?.(`🏦 Gringotts HPVN: ${refusal.text}`, refusal.icon);
          const detailSpendable = authErr.details?.spendable;
          if (typeof detailSpendable === 'number' && Number.isFinite(detailSpendable)) {
            applyServerBalanceToSim(detailSpendable);
          } else {
            await this.authoritativeClient
              .read()
              .then((fresh) => {
                if (fresh.wallet && typeof fresh.wallet.spendable === 'number') {
                  applyServerBalanceToSim(fresh.wallet.spendable);
                }
              })
              .catch(() => {
                applyServerBalanceToSim(prevBaseline);
              });
          }
        } else {
          // Lỗi mạng tạm thời -> hoàn mốc cũ để lần lưu tiếp theo tự động quyết toán phần chênh lệch
          this.lastAuthoritativeWalletBalance = prevBaseline;
        }
      }
    };

    const scheduleCheck = () => {
      if (this.isApplyingServerWallet || this.lastAuthoritativeWalletBalance === null) {
        return;
      }
      const homeOrActive = sim.homeStateWhileVisiting ?? sim.state;
      if (
        homeOrActive.sandboxMode ||
        homeOrActive.sandboxTainted ||
        sim.isHeadmasterPreview
      ) {
        return;
      }
      const currentGalleons = Math.max(0, Math.floor(Number(homeOrActive.galleons) || 0));
      if (currentGalleons === this.lastAuthoritativeWalletBalance) {
        return;
      }
      if (this.walletSyncTimer !== null) {
        clearTimeout(this.walletSyncTimer);
      }
      if (debounceMs === 0) {
        void flushDelta();
      } else {
        this.walletSyncTimer = setTimeout(() => {
          void flushDelta();
        }, debounceMs);
      }
    };

    sim.saveToStorage = () => {
      origSaveToStorage();
      scheduleCheck();
    };

    return () => {
      if (this.walletSyncTimer !== null) {
        clearTimeout(this.walletSyncTimer);
        this.walletSyncTimer = null;
      }
      sim.saveToStorage = origSaveToStorage;
      if (this.boundSim === sim) {
        this.boundSim = null;
      }
    };
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
    onlineServices.init();
  }
}

export default onlineServices;
