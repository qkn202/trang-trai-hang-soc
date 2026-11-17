// HPVN «Quầy Gringotts» in the Sổ Cái dialog: a one-way exchange, a pack of HPVN Galleons → farm Sickles. The server
// prices the pack (ACP rate) and debits the wallet; the Sickles arrive through the inbox (src/hpvn/inbox.ts).
import { deliverInbox, request } from './bridge';
import type { GameHUD } from '../ui/hud';

const vn = (n: number) => n.toLocaleString('vi-VN');

interface FarmWallet { enabled: boolean; sicklePerGalleon: number; packs: number[]; balance: number }
/** The HPVN wallet's balance and the exchange's rate and packs (ACP sets them). */
const loadFarmWallet = () => request<FarmWallet>('farm', { op: 'wallet' });
// a failed exchange keeps its id for the next tap on the same pack, so a reply lost after the charge never charges twice
let pendingExchange: { galleons: number; requestId: string } | null = null;
/** The page names only a pack and a request id; the server prices it, debits the wallet and sends the Sickles as an
 * inbox entry (applied once). */
export async function exchangeSickles(galleons: number): Promise<{ balance: number; sickle: number }> {
  if (pendingExchange?.galleons !== galleons) pendingExchange = { galleons, requestId: crypto.randomUUID() };
  const result = await request<{ balance: number; sickle: number; inbox?: unknown[] }>('farm', { op: 'sickles', ...pendingExchange });
  pendingExchange = null;
  deliverInbox(result?.inbox);
  return result;
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
    if (!wallet.enabled) { box.textContent = '🏦 Quầy Gringotts đang đóng.'; return; }
    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:8px;font-size:14px;font-weight:800;margin-bottom:8px;">
        <span>🏦 Đổi Galleons → Sickle</span><span>Ví: ${vn(wallet.balance)} Galleons</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${wallet.packs.map((g) => `
        <button type="button" class="brass-btn" data-pack="${g}" ${wallet.balance < g ? 'disabled' : ''}>${vn(g)} Galleons → ${vn(g * wallet.sicklePerGalleon)} Sickle</button>`).join('')}
      </div>
      <div style="font-size:12px;margin-top:6px;opacity:.8;">Một chiều: Sickle không đổi lại được Galleons.</div>`;
    box.querySelectorAll<HTMLButtonElement>('[data-pack]').forEach((btn) => {
      const label = btn.textContent ?? '';
      btn.addEventListener('click', () => {
        if (btn.dataset.armed !== '1') { // two taps: Galleons are HPVN money
          box.querySelectorAll<HTMLButtonElement>('[data-armed="1"]').forEach((other) => { other.dataset.armed = ''; other.textContent = other.dataset.label ?? ''; });
          btn.dataset.armed = '1'; btn.dataset.label = label; btn.textContent = `Chạm lần nữa: trừ ${vn(Number(btn.dataset.pack))} Galleons`;
          return;
        }
        box.querySelectorAll<HTMLButtonElement>('[data-pack]').forEach((b) => { b.disabled = true; });
        exchangeSickles(Number(btn.dataset.pack)).then(
          () => renderFarmExchange(box, hud),
          (error: Error) => { hud.showToast(error.message || 'Chưa đổi được, thử lại nhé.', '🦉'); renderFarmExchange(box, hud); },
        );
      });
    });
  }, (error: Error) => { if (box.isConnected) box.textContent = `🏦 ${error.message || 'Chưa mở được quầy Gringotts.'}`; });
}
