// HPVN: upstream's own farm server (src/ui/authoritativeClient.ts) is not shipped. «Cổng Floo» goes through the HPVN
// bridge to the trangTraiHangSoc callable (ops visit / help / fire-out / stand-buy / coop-status / coop-contribute):
// the server takes the member from the HPVN sign-in and the page only names the farm. The coins stay the farm's own Sickle.
import { identity, request } from './bridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthoritativeSnapshot = any;
const farm = (op: string, hostUid?: unknown): Promise<AuthoritativeSnapshot> =>
  request('farm', { op, ...(typeof hostUid === 'string' ? { hostUid } : {}) });

const STAND_REFUSAL_CODES = new Set([
  'ALREADY_SOLD',
  'SLOT_EMPTY',
  'INVALID_PRICE',
  'SELF_BUY',
  'LIMIT_REACHED',
  'INSUFFICIENT_SICKLE',
]);

export type StandBuyRpcResult =
  | {
      status: 'ok';
      sickleCharged?: number;
      itemId?: string;
      qty?: number;
      inboxSeq?: number;
    }
  | { status: 'refused'; code: string; msg: string }
  | { status: 'unsupported' };

export type CoopCrateRpcResult =
  | {
      status: 'ok';
      weekKey: string;
      totalPoints: number;
      contributors: Array<{
        uid: string;
        displayName: string;
        avatarEmoji?: string;
        points: number;
      }>;
    }
  | { status: 'unsupported' };

function sanitizeCoopContributors(raw: unknown): Array<{
  uid: string;
  displayName: string;
  avatarEmoji?: string;
  points: number;
}> {
  if (!Array.isArray(raw)) return [];
  const out: Array<{ uid: string; displayName: string; avatarEmoji?: string; points: number }> = [];
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue;
    const r = row as Record<string, unknown>;
    const pts = Math.max(0, Math.round(Number(r.points) || 0));
    if (pts <= 0) continue;
    out.push({
      uid: String(r.uid || r.id || out.length),
      displayName: String(r.displayName || r.name || 'Bạn HPVN').slice(0, 36),
      avatarEmoji: typeof r.avatarEmoji === 'string' ? r.avatarEmoji.slice(0, 8) : undefined,
      points: pts,
    });
  }
  return out.sort((a, b) => b.points - a.points).slice(0, 12);
}

export default {
  authoritativeClient: {
    snapshot: null as AuthoritativeSnapshot,
    visit: (data: Record<string, unknown> = {}) => farm(data.help === true ? 'help' : 'visit', data.hostUid),
    fireOut: (data: { hostUid?: unknown }) => farm('fire-out', data.hostUid),
    async buyRoadsideStand(params: {
      hostUid: string;
      slotIndex: number;
      itemId: string;
      qty: number;
      totalSickle: number;
      requestId: string;
    }): Promise<StandBuyRpcResult> {
      try {
        const res = await request<Record<string, unknown>>('farm', {
          op: 'stand-buy',
          hostUid: params.hostUid,
          slotIndex: params.slotIndex,
          itemId: params.itemId,
          qty: params.qty,
          totalSickle: params.totalSickle,
          requestId: params.requestId,
        });
        if (res && typeof res === 'object' && res.ok !== false) {
          return {
            status: 'ok',
            sickleCharged:
              typeof res.sickleCharged === 'number' ? Math.round(res.sickleCharged) : undefined,
            itemId: typeof res.itemId === 'string' ? res.itemId : undefined,
            qty: typeof res.qty === 'number' ? Math.round(res.qty) : undefined,
            inboxSeq: typeof res.inboxSeq === 'number' ? Math.round(res.inboxSeq) : undefined,
          };
        }
        const code = String((res as { code?: unknown })?.code || 'ALREADY_SOLD');
        const msg = String((res as { message?: unknown })?.message || 'Lô hàng này vừa có người khác mua mất rồi!');
        return { status: 'refused', code, msg };
      } catch (err) {
        const code = String((err as { code?: unknown })?.code || '').toUpperCase();
        if (STAND_REFUSAL_CODES.has(code)) {
          return {
            status: 'refused',
            code,
            msg: err instanceof Error && err.message ? err.message : 'Lô hàng này không còn trên sạp nữa!',
          };
        }
        return { status: 'unsupported' };
      }
    },
    async fetchCoopCrate(params: { weekKey: string }): Promise<CoopCrateRpcResult> {
      try {
        const res = await request<Record<string, unknown>>('farm', {
          op: 'coop-status',
          weekKey: params.weekKey,
        });
        if (!res || typeof res !== 'object' || typeof res.totalPoints !== 'number') {
          return { status: 'unsupported' };
        }
        return {
          status: 'ok',
          weekKey: typeof res.weekKey === 'string' ? res.weekKey : params.weekKey,
          totalPoints: Math.max(0, Math.round(res.totalPoints)),
          contributors: sanitizeCoopContributors(res.contributors),
        };
      } catch {
        return { status: 'unsupported' };
      }
    },
    async contributeCoopCrate(params: {
      weekKey: string;
      itemId: string;
      qty: number;
      points: number;
      requestId: string;
    }): Promise<CoopCrateRpcResult> {
      try {
        const res = await request<Record<string, unknown>>('farm', {
          op: 'coop-contribute',
          weekKey: params.weekKey,
          itemId: params.itemId,
          qty: params.qty,
          points: params.points,
          requestId: params.requestId,
        });
        if (!res || typeof res !== 'object' || typeof res.totalPoints !== 'number') {
          return { status: 'unsupported' };
        }
        return {
          status: 'ok',
          weekKey: typeof res.weekKey === 'string' ? res.weekKey : params.weekKey,
          totalPoints: Math.max(0, Math.round(res.totalPoints)),
          contributors: sanitizeCoopContributors(res.contributors),
        };
      } catch {
        return { status: 'unsupported' };
      }
    },
    // the name is HPVN's (the handoff), never one typed in the game
    syncProfile: async (_profile?: object): Promise<AuthoritativeSnapshot> => ({ profile: { username: identity?.displayName ?? '' } }),
  },
  syncWalletBaseline: (_sickle: number) => {},
};

/** The server's Vietnamese refusal (the bridge forwards its message). */
export function formatServerRefusalVi(err: unknown): { reason: string; icon: string; item?: string; text: string } {
  const text = err instanceof Error && err.message ? err.message : 'Chưa kết nối được HPVN, thử lại nhé.';
  return { reason: 'hpvn-server', icon: '🦉', text };
}
