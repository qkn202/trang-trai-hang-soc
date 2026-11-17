// HPVN: upstream's own farm server (src/ui/authoritativeClient.ts) is not shipped. «Cổng Floo» goes through the HPVN
// bridge to the trangTraiHangSoc callable (ops visit / help / fire-out): the server takes the member from the HPVN
// sign-in and the page only names the farm. The coins stay the farm's own Sickle.
import { identity, request } from './bridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AuthoritativeSnapshot = any;
const farm = (op: string, hostUid?: unknown): Promise<AuthoritativeSnapshot> =>
  request('farm', { op, ...(typeof hostUid === 'string' ? { hostUid } : {}) });

export default {
  authoritativeClient: {
    snapshot: null as AuthoritativeSnapshot,
    visit: (data: Record<string, unknown> = {}) => farm(data.help === true ? 'help' : 'visit', data.hostUid),
    fireOut: (data: { hostUid?: unknown }) => farm('fire-out', data.hostUid),
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
