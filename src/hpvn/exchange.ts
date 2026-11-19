// HPVN «Quầy Gringotts» in the Sổ Cái dialog:
// 1. Forward exchange: HPVN Galleons → farm Sickles (`op: 'sickles'`, priced & debited by server ACP rate).
// 2. Reverse exchange (Cách 1 — server-authoritative with asymmetric rate, daily/weekly caps & Sickle delta audit):
//    farm Sickles → HPVN Galleons (`op: 'galleons'`, default rate 1.000.000 Sickle = 100.000 Galleons, i.e. 10:1).
import { deliverInbox, flushFarmSave, isStandaloneLocal, request } from './bridge';
import type { GameHUD } from '../ui/hud';

const vn = (n: number) => n.toLocaleString('vi-VN');
const esc = (raw: string) =>
  String(raw)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const DEFAULT_REVERSE_SICKLE_PER_GALLEON = 10; // 1.000.000 Sickle → 100.000 Galleons
export const DEFAULT_REVERSE_SICKLE_PACKS: readonly number[] = [1_000_000];
export const DEFAULT_REVERSE_MIN_LEVEL = 10;
export const DEFAULT_REVERSE_DAILY_CAP_GALLEONS = 100_000;
export const DEFAULT_REVERSE_WEEKLY_CAP_GALLEONS = 300_000;

export interface FarmWallet {
  enabled: boolean;
  sicklePerGalleon: number;
  packs: number[];
  balance: number;
  reverseEnabled?: boolean;
  reverseSicklePerGalleon?: number; // default 10 (1.000.000 Sickle → 100.000 Galleons)
  reversePacks?: number[];          // Sickle pack sizes, e.g. [1_000_000]
  reverseMinLevel?: number;         // minimum farm level required to reverse-exchange
  reverseDailyCapGalleons?: number; // hard server daily cap in Galleons
  reverseTodayGalleons?: number;    // Galleons already redeemed today
  reverseWeeklyCapGalleons?: number;// hard server weekly cap in Galleons
  reverseWeekGalleons?: number;     // Galleons already redeemed this week
  reverseFlagged?: boolean;         // true if server flagged an abnormal Sickle jump
  reverseBlockedReason?: string;
}

export interface ReverseExchangeResult {
  balance: number;
  galleons: number;
  sicklesDeducted: number;
  remainingSickles?: number;
  reverseTodayGalleons?: number;
  reverseDailyCapGalleons?: number;
  reverseWeekGalleons?: number;
  reverseWeeklyCapGalleons?: number;
  inbox?: unknown[];
}

export function computeReverseGalleonsOut(
  sickles: number,
  reverseSicklePerGalleon = DEFAULT_REVERSE_SICKLE_PER_GALLEON
): number {
  const s = Math.max(0, Math.floor(Number(sickles) || 0));
  const rate = Math.max(1, Math.floor(Number(reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON));
  if (s < rate) return 0;
  return Math.floor(s / rate);
}

export function validateReverseExchangeEligibility(
  wallet: FarmWallet,
  farmSickles: number,
  farmLevel: number,
  packSickles: number
): { ok: boolean; galleonsOut: number; reason?: string } {
  const rate = Math.max(
    1,
    Math.floor(Number(wallet.reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON)
  );
  const galleonsOut = computeReverseGalleonsOut(packSickles, rate);
  if (!wallet.reverseEnabled) {
    return { ok: false, galleonsOut, reason: 'Chiều đổi Sickle sang Galleons đang đóng.' };
  }
  if (wallet.reverseFlagged) {
    return {
      ok: false,
      galleonsOut,
      reason:
        wallet.reverseBlockedReason ||
        'Tài khoản đang tạm khóa đổi ngược do phát hiện biến động Sickle bất thường.',
    };
  }
  const minLv = Math.max(1, Math.floor(Number(wallet.reverseMinLevel) || DEFAULT_REVERSE_MIN_LEVEL));
  if (farmLevel < minLv) {
    return {
      ok: false,
      galleonsOut,
      reason: `Cần Điền Trang đạt Cấp ${minLv} trở lên để đổi Sickle sang Galleons.`,
    };
  }
  if (galleonsOut <= 0 || packSickles <= 0) {
    return { ok: false, galleonsOut: 0, reason: 'Gói quy đổi không hợp lệ.' };
  }
  if (farmSickles < packSickles) {
    return {
      ok: false,
      galleonsOut,
      reason: `Chưa đủ ${vn(packSickles)} Sickle trong trang trại.`,
    };
  }
  const dailyCap = Math.max(0, Math.floor(Number(wallet.reverseDailyCapGalleons) || 0));
  const todayUsed = Math.max(0, Math.floor(Number(wallet.reverseTodayGalleons) || 0));
  if (dailyCap > 0 && todayUsed + galleonsOut > dailyCap) {
    return {
      ok: false,
      galleonsOut,
      reason: `Vượt hạn mức ngày (${vn(todayUsed)}/${vn(dailyCap)} Galleons).`,
    };
  }
  const weeklyCap = Math.max(0, Math.floor(Number(wallet.reverseWeeklyCapGalleons) || 0));
  const weekUsed = Math.max(0, Math.floor(Number(wallet.reverseWeekGalleons) || 0));
  if (weeklyCap > 0 && weekUsed + galleonsOut > weeklyCap) {
    return {
      ok: false,
      galleonsOut,
      reason: `Vượt hạn mức tuần (${vn(weekUsed)}/${vn(weeklyCap)} Galleons).`,
    };
  }
  return { ok: true, galleonsOut };
}

function buildLocalWalletPreview(): FarmWallet {
  return {
    enabled: true,
    sicklePerGalleon: 1,
    packs: [100, 500, 1_000],
    balance: 250_000,
    reverseEnabled: true,
    reverseSicklePerGalleon: DEFAULT_REVERSE_SICKLE_PER_GALLEON,
    reversePacks: [...DEFAULT_REVERSE_SICKLE_PACKS],
    reverseMinLevel: DEFAULT_REVERSE_MIN_LEVEL,
    reverseDailyCapGalleons: DEFAULT_REVERSE_DAILY_CAP_GALLEONS,
    reverseTodayGalleons: 0,
    reverseWeeklyCapGalleons: DEFAULT_REVERSE_WEEKLY_CAP_GALLEONS,
    reverseWeekGalleons: 0,
    reverseFlagged: false,
  };
}

/** The HPVN wallet's balance and the exchange's rate and packs (ACP sets them). */
const loadFarmWallet = () =>
  isStandaloneLocal
    ? Promise.resolve(buildLocalWalletPreview())
    : request<FarmWallet>('farm', { op: 'wallet' });

// a failed exchange keeps its id for the next tap on the same pack, so a reply lost after the charge never charges twice
let pendingExchange: { galleons: number; requestId: string } | null = null;
let pendingReverseExchange: { sickles: number; requestId: string } | null = null;

/** The page names only a pack and a request id; the server prices it, debits the wallet and sends the Sickles as an
 * inbox entry (applied once). */
export async function exchangeSickles(galleons: number): Promise<{ balance: number; sickle: number }> {
  if (pendingExchange?.galleons !== galleons) pendingExchange = { galleons, requestId: crypto.randomUUID() };
  const result = await request<{ balance: number; sickle: number; inbox?: unknown[] }>('farm', { op: 'sickles', ...pendingExchange });
  pendingExchange = null;
  deliverInbox(result?.inbox);
  return result;
}

/**
 * Reverse exchange (Sickle → HPVN Galleons): flushes the latest farm save first, then asks the server
 * to atomically verify Sickle integrity + daily/weekly caps, deduct Sickles in Firestore, and credit Galleons.
 */
export async function exchangeGalleons(sickles: number): Promise<ReverseExchangeResult> {
  const safeSickles = Math.max(1, Math.floor(Number(sickles) || 0));
  if (pendingReverseExchange?.sickles !== safeSickles) {
    pendingReverseExchange = { sickles: safeSickles, requestId: crypto.randomUUID() };
  }
  await flushFarmSave();
  const result = await request<ReverseExchangeResult>('farm', { op: 'galleons', ...pendingReverseExchange });
  pendingReverseExchange = null;
  deliverInbox(result?.inbox);
  return result;
}

export function resetPendingReverseExchangeForTest(): void {
  pendingReverseExchange = null;
}

export function renderFarmExchange(box: HTMLElement, hud: GameHUD): void {
  box.className = 'quest-card-mini hpvn-exchange';
  box.style.cssText = 'padding:12px;margin-top:12px;';
  if (hud.sim.isHeadmasterPreview || hud.sim.state.sandboxMode) {
    box.textContent = '🏦 Quầy Gringotts không mở trong chế độ thử.';
    return;
  }
  box.textContent = '🏦 Đang mở quầy Gringotts…';
  loadFarmWallet().then((wallet) => {
    if (!box.isConnected) return;
    if (!wallet.enabled && !wallet.reverseEnabled) {
      box.textContent = '🏦 Quầy Gringotts đang đóng.';
      return;
    }

    const farmSickles = Math.max(0, Math.floor(hud.sim.state.galleons ?? 0));
    const farmLevel = Math.max(1, Math.floor(hud.sim.state.level ?? 1));
    const forwardHtml = wallet.enabled
      ? `
        <div class="hs-gringotts-head">
          <span>🏦 Đổi Galleons → Sickle</span><span>Ví: ${vn(wallet.balance)} Galleons</span>
        </div>
        <div class="hs-gringotts-packs">${wallet.packs.map((g) => `
          <button type="button" class="brass-btn" data-pack="${g}" ${wallet.balance < g ? 'disabled' : ''}>${vn(g)} Galleons → ${vn(g * wallet.sicklePerGalleon)} Sickle</button>`).join('')}
        </div>`
      : '';

    let reverseHtml = `<div class="hs-gringotts-note">Một chiều: Sickle không đổi lại được Galleons.</div>`;
    if (wallet.reverseEnabled) {
      const rate = Math.max(
        1,
        Math.floor(Number(wallet.reverseSicklePerGalleon) || DEFAULT_REVERSE_SICKLE_PER_GALLEON)
      );
      const packs =
        Array.isArray(wallet.reversePacks) && wallet.reversePacks.length > 0
          ? wallet.reversePacks.filter((p) => Number.isFinite(p) && p >= rate)
          : [...DEFAULT_REVERSE_SICKLE_PACKS];
      const refSickles = packs[0] ?? 1_000_000;
      const refGalleons = computeReverseGalleonsOut(refSickles, rate);
      const dailyCap = Math.max(0, Math.floor(Number(wallet.reverseDailyCapGalleons) || 0));
      const todayUsed = Math.max(0, Math.floor(Number(wallet.reverseTodayGalleons) || 0));
      const weeklyCap = Math.max(0, Math.floor(Number(wallet.reverseWeeklyCapGalleons) || 0));
      const weekUsed = Math.max(0, Math.floor(Number(wallet.reverseWeekGalleons) || 0));
      const minLv = Math.max(1, Math.floor(Number(wallet.reverseMinLevel) || DEFAULT_REVERSE_MIN_LEVEL));

      const capParts: string[] = [`Tỷ lệ: ${vn(refSickles)} Sickle = ${vn(refGalleons)} Galleons`];
      if (dailyCap > 0) capParts.push(`Hôm nay: ${vn(todayUsed)}/${vn(dailyCap)}`);
      if (weeklyCap > 0) capParts.push(`Tuần: ${vn(weekUsed)}/${vn(weeklyCap)}`);

      const firstCheck = validateReverseExchangeEligibility(wallet, farmSickles, farmLevel, refSickles);
      const alertLine = wallet.reverseFlagged
        ? `<div class="hs-gringotts-warn">${esc(wallet.reverseBlockedReason || 'Tài khoản đang tạm khóa đổi ngược để kiểm tra biến động Sickle bất thường.')}</div>`
        : farmLevel < minLv
          ? `<div class="hs-gringotts-note">Cần Điền Trang đạt Cấp ${minLv} trở lên mới mở đổi ngược (hiện Cấp ${farmLevel}).</div>`
          : !firstCheck.ok && firstCheck.reason
            ? `<div class="hs-gringotts-note">${esc(firstCheck.reason)}</div>`
            : '';

      const reverseBtnsHtml = packs
        .map((s) => {
          const check = validateReverseExchangeEligibility(wallet, farmSickles, farmLevel, s);
          return `<button type="button" class="brass-btn" data-reverse-pack="${s}" ${check.ok ? '' : 'disabled'}>${vn(s)} Sickle → ${vn(check.galleonsOut)} Galleons</button>`;
        })
        .join('');

      reverseHtml = `
        <div class="hs-gringotts-reverse">
          <div class="hs-gringotts-head">
            <span>Đổi Sickle → Galleons</span><span>Trang trại: ${vn(farmSickles)} Sickle</span>
          </div>
          <div class="hs-gringotts-packs">${reverseBtnsHtml}</div>
          <div class="hs-gringotts-note">${capParts.join(' · ')}</div>
          ${alertLine}
        </div>`;
    }

    box.innerHTML = `${forwardHtml}${reverseHtml}`;

    const disarmAll = () => {
      box.querySelectorAll<HTMLButtonElement>('[data-armed="1"]').forEach((other) => {
        other.dataset.armed = '';
        other.textContent = other.dataset.label ?? '';
      });
    };

    box.querySelectorAll<HTMLButtonElement>('[data-pack]').forEach((btn) => {
      const label = btn.textContent ?? '';
      btn.addEventListener('click', () => {
        if (btn.dataset.armed !== '1') { // two taps: Galleons are HPVN money
          disarmAll();
          btn.dataset.armed = '1'; btn.dataset.label = label; btn.textContent = `Chạm lần nữa: trừ ${vn(Number(btn.dataset.pack))} Galleons`;
          return;
        }
        box.querySelectorAll<HTMLButtonElement>('[data-pack], [data-reverse-pack]').forEach((b) => { b.disabled = true; });
        exchangeSickles(Number(btn.dataset.pack)).then(
          () => renderFarmExchange(box, hud),
          (error: Error) => { hud.showToast(error.message || 'Chưa đổi được, thử lại nhé.', '🦉'); renderFarmExchange(box, hud); },
        );
      });
    });

    box.querySelectorAll<HTMLButtonElement>('[data-reverse-pack]').forEach((btn) => {
      const label = btn.textContent ?? '';
      const packSickles = Number(btn.dataset.reversePack);
      btn.addEventListener('click', () => {
        if (btn.dataset.armed !== '1') { // two taps: irreversible Sickle deduction
          disarmAll();
          btn.dataset.armed = '1';
          btn.dataset.label = label;
          btn.textContent = `Chạm lần nữa: trừ ${vn(packSickles)} Sickle`;
          return;
        }
        box.querySelectorAll<HTMLButtonElement>('[data-pack], [data-reverse-pack]').forEach((b) => { b.disabled = true; });
        exchangeGalleons(packSickles).then(
          (res) => {
            const deducted = Math.max(0, Math.floor(Number(res?.sicklesDeducted) || packSickles));
            const curSickles = Math.max(0, Math.floor(hud.sim.state.galleons ?? 0));
            const nextSickles =
              typeof res?.remainingSickles === 'number' && Number.isFinite(res.remainingSickles)
                ? Math.max(0, Math.min(curSickles, Math.floor(res.remainingSickles)))
                : Math.max(0, curSickles - deducted);
            hud.sim.state.galleons = nextSickles;
            hud.sim.saveToStorage();
            hud.refreshAll();
            const outGal = Math.max(
              0,
              Math.floor(
                Number(res?.galleons) ||
                  computeReverseGalleonsOut(packSickles, wallet.reverseSicklePerGalleon)
              )
            );
            hud.showToast(`Đã đổi ${vn(deducted)} Sickle → +${vn(outGal)} Galleons vào ví HPVN!`, '🦉');
            renderFarmExchange(box, hud);
          },
          (error: Error) => {
            hud.showToast(error.message || 'Chưa đổi ngược được, thử lại nhé.', '🦉');
            renderFarmExchange(box, hud);
          },
        );
      });
    });
  }, (error: Error) => { if (box.isConnected) box.textContent = `🏦 ${error.message || 'Chưa mở được quầy Gringotts.'}`; });
}
