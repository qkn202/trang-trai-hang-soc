/**
 * AuthoritativeClient — Tầng Giao Thức RPC & Lưu Trữ Nguyên Tử cho 'Trang Trại Hang Sóc'
 * Thiết kế độc lập hoàn toàn (`*Burrow*` Callables & kênh `hpvn-burrow-game`):
 *  - Hàng đợi tuần tự (`chain`) đảm bảo phản hồi mạng đến trễ không bao giờ ghi đè snapshot mới hơn.
 *  - Giữ nguyên `requestId` (`pending`) khi rớt mạng giữa chừng (`definitive: false`) để thử lại không bị trừ Galleons hay nhận thưởng 2 lần; chặn lệnh khác cho tới khi giao dịch treo hoàn tất.
 *  - Tối ưu băng thông `catalogHash` (tự động tái sử dụng `catalog` cục bộ khi máy chủ lược bỏ).
 *  - Hỗ trợ tự động các chế độ kết nối độc lập:
 *      + Mode A (`#burrow-ticket=<nonce>`): Nhúng iframe sandbox qua `parent.postMessage({ channel: 'hpvn-burrow-game' })`.
 *      + Mode B (HTTP Callable `/api/rpc/<callableName>`): Kèm JWT phiên HMAC-SHA256 (`Authorization: Bearer`).
 *      + Mode C/D (Firebase Emulator `demo-hpvnn-burrow` / Cloud Functions `asia-southeast1`): Gọi trực tiếp các hàm `*Burrow*`.
 *  - Lưu trữ cục bộ nguyên tử bảo vệ đa tab qua Web Locks API (`navigator.locks.request`).
 */

import { getOrCreateClientUserId, setAuthenticatedUserId } from './cloudSave';
import { isTrustedHpvnOrigin } from './hpvnBridge';

export interface AuthoritativeError extends Error {
  definitive?: boolean;
  reason?: string;
  details?: Record<string, unknown>;
}

export interface AuthoritativeCatalogItem {
  id: string;
  label: string;
  kind: string;
  price: number;
  effectivePrice?: number;
  quantity: number;
  dailyLimit: number;
  dailyRemaining?: number;
  overflowMultiplier?: number;
}

export interface AuthoritativeSnapshot {
  uid: string;
  garden: {
    progression: {
      revision: number;
      level: number;
      xp: number;
      magicStars: number;
      timeSand: number;
      phoenixTalismans: number;
      friendshipTokens: number;
      house: string;
      parkName: string;
      friendCode: string;
      inventory: Record<string, number>;
      economicCycles: Record<string, number>;
      timers: Array<{
        timerId: string;
        domain: string;
        targetId: string;
        qty: number;
        startedAt: number;
        readyAt: number;
        boosted: boolean;
        cared: boolean;
      }>;
      builtIds: string[];
      minigameRecords: Record<string, unknown>;
    };
    supplies: {
      seeds: Record<string, number>;
      water: number;
      boost: number;
    };
    decorations: {
      owned: string[];
      placements: Array<string | null>;
      rotations: Record<string, 'default' | 'right'>;
      scene: { weather: string; atmosphere: string; event: string };
    };
    festival: {
      seasonKey: string;
      points: number;
      claimedMilestones: string[];
    };
    tutorial?: { guide: string[] };
  };
  wallet: {
    spendable: number;
    balance: number;
    bankBalance: number;
    frozen?: boolean;
  };
  catalog?: AuthoritativeCatalogItem[];
  catalogVersion: string;
  catalogHash: string;
  dayKey: string;
  weekKey?: string;
  daily: Record<string, unknown>;
  festival?: Record<string, unknown>;
  achievements?: Record<string, unknown>;
  orders?: Array<Record<string, unknown>>;
  houseCup?: Record<string, unknown>;
  flooFrames?: { frames: string[]; worn: string };
  helpers?: Array<{
    id: string;
    uid: string;
    name: string;
    avatarEmoji: string;
    avatarUrl?: string;
    kind: string;
    buildingUid?: string;
    noteText: string;
    at: number;
  }>;
  fire?: Record<string, unknown> | null;
  saleAdmin?: boolean;
  serverNow: number;
  profile?: Record<string, unknown>;
  receipt?: Record<string, unknown>;
}

export type CallableTransportFn = (
  callableName: string,
  data: Record<string, unknown>
) => Promise<Record<string, unknown>>;

/**
 * Sinh UUID v4 an toàn trên cả HTTPS lẫn mạng LAN nội bộ (`http://192.168.x.x` nơi `crypto.randomUUID` bị khóa).
 */
export function generateRequestId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (ch) => {
    const n = Number(ch);
    const rnd =
      typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function'
        ? crypto.getRandomValues(new Uint8Array(1))[0]
        : Math.floor(Math.random() * 256);
    return (n ^ (rnd & (15 >> (n / 4)))).toString(16);
  });
}

/**
 * Tính tổng giá gói hàng trên client khớp công thức `packTotal` của máy chủ để gửi `expectedTotal`.
 */
export function computeClientPackTotal(item: AuthoritativeCatalogItem, packages: number): number {
  const qty = Math.max(1, Math.floor(Number(packages) || 1));
  const unit = item.effectivePrice ?? item.price;
  const remaining = item.dailyRemaining ?? item.dailyLimit;
  let total = 0;
  for (let i = 0; i < qty; i++) {
    if (i < remaining) {
      total += unit;
    } else if (item.overflowMultiplier && item.overflowMultiplier > 1) {
      total += Math.ceil(unit * item.overflowMultiplier);
    } else {
      total += unit;
    }
  }
  return total;
}

const DEFAULT_VI_LABELS: Readonly<Record<string, string>> = Object.freeze({
  wheat: 'Lúa Mì',
  pumpkin: 'Bí Ngô',
  strawberry: 'Dâu Tây',
  carrot: 'Cà Rốt',
  corn: 'Bắp Ngọt',
  apple: 'Táo Đỏ',
  mandrake: 'Nhân Sâm Mandrake',
  gillyweed: 'Cỏ Mang Cá',
  milk: 'Sữa Tươi',
  egg: 'Trứng Gà',
  wool: 'Lông Cừu',
  honey: 'Mật Ong',
  apple_pie: 'Bánh Táo Bà Molly',
  butterbeer_cask: 'Thùng Bia Bơ',
  water: 'Nước Phép',
  boost: 'Phân Bón Thảo Dược',
});

/**
 * Chuyển mã từ chối có cấu trúc của máy chủ (`reason` + `details`) thành thông báo ngắn gọn kèm biểu tượng.
 * Không bao giờ dùng biểu thức chính quy (regex) đoán chuỗi lỗi thô của engine.
 */
export function formatServerRefusalVi(
  err: unknown,
  options: {
    labels?: Record<string, string>;
    modelText?: (code: string) => string | undefined;
  } = {}
): { reason: string; icon: string; item?: string; text: string } {
  const e = (err && typeof err === 'object' ? err : {}) as {
    reason?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
  const details = (e.details && typeof e.details === 'object' ? e.details : {}) as Record<
    string,
    unknown
  >;
  const reason = String(e.reason || details.reason || 'unknown-error');
  const labels = { ...DEFAULT_VI_LABELS, ...(options.labels || {}) };

  switch (reason) {
    case 'missing-crops': {
      const missing = Array.isArray(details.missing)
        ? (details.missing as Array<{ resource?: string; required?: number; have?: number }>)
        : [];
      if (missing.length > 0) {
        const parts = missing.map((m) => {
          const resId = String(m.resource || '');
          const short = Math.max(1, Number(m.required || 0) - Number(m.have || 0));
          return `${short} ${labels[resId] || resId}`;
        });
        return {
          reason,
          icon: '🌾',
          item: String(missing[0].resource || ''),
          text: `Thiếu ${parts.join(' · ')}`,
        };
      }
      return { reason, icon: '🌾', text: 'Thiếu nông sản' };
    }

    case 'insufficient-galleons':
    case 'insufficient-balance': {
      const shortBy =
        typeof details.shortBy === 'number'
          ? details.shortBy
          : typeof details.required === 'number' && typeof details.spendable === 'number'
            ? Math.max(1, details.required - details.spendable)
            : null;
      return {
        reason,
        icon: '🪙',
        text: shortBy !== null ? `Thiếu ${shortBy} G` : 'Chưa đủ Galleons',
      };
    }

    case 'insufficient-stars': {
      const req = Number(details.required || 0);
      const have = Number(details.have || 0);
      const short = Math.max(1, req - have);
      return { reason, icon: '🌟', text: `Thiếu ${short} Sao Phép Thuật` };
    }

    case 'missing-supply': {
      const res = String(details.resource || '');
      if (res.startsWith('seeds.')) {
        const cropId = res.slice(6);
        return { reason, icon: '🌱', item: cropId, text: `Thiếu hạt ${labels[cropId] || cropId}` };
      }
      return { reason, icon: '💧', item: res, text: `Thiếu ${labels[res] || 'vật tư'}` };
    }

    case 'wallet-frozen':
      return { reason, icon: '🪙', text: 'Ví Gringotts đang tạm khóa bảo vệ' };

    case 'market-closed':
      return { reason, icon: '🏪', text: 'Quầy chợ đang tạm nghỉ kiểm kê' };

    case 'price-changed':
      return { reason, icon: '🏷️', text: 'Giá vừa thay đổi · vui lòng xác nhận lại' };

    case 'daily-help-cap':
      return { reason, icon: '🤝', text: 'Đã dùng hết 5/5 lượt hỗ trợ hôm nay' };

    case 'host-help-cap':
      return { reason, icon: '🤝', text: 'Thung lũng này đã nhận đủ 10 lượt giúp hôm nay' };

    case 'already-helped':
      return { reason, icon: '🤝', text: 'Hôm nay bạn đã hỗ trợ thung lũng này rồi' };

    case 'daily-cap':
      return { reason, icon: '⏳', text: 'Đã chạm hạn mức trong ngày' };

    case 'stock-cap':
      return { reason, icon: '📦', text: 'Kho chứa vật phẩm này đã đầy' };

    case 'already-claimed':
      return { reason, icon: '✅', text: 'Đã nhận rồi' };

    case 'quest-incomplete':
      return { reason, icon: '📜', text: 'Chưa hoàn thành đủ chỉ tiêu nhiệm vụ' };

    case 'festival-incomplete':
      return { reason, icon: '🎃', text: 'Chưa đủ điểm Đại Tiệc Mùa Gặt' };

    case 'revision-conflict':
      return { reason, icon: '🔄', text: 'Thung lũng vừa cập nhật ở tab khác · đang đồng bộ lại' };

    case 'request-id-conflict':
      return { reason, icon: '⚠️', text: 'Mã giao dịch bị trùng với nội dung khác' };

    case 'timer-not-ready':
      return { reason, icon: '⏳', text: 'Chưa tới giờ thu hoạch theo đồng hồ máy chủ' };

    case 'rate-limited':
      return { reason, icon: '⚡', text: 'Thao tác quá nhanh · đợi giây lát nhé' };

    default: {
      if (reason === 'model-rejected' && typeof details.modelCode === 'string' && options.modelText) {
        const custom = options.modelText(details.modelCode);
        if (custom) return { reason, icon: '🪄', text: custom };
      }
      return {
        reason,
        icon: '🪄',
        text: e.message || 'Máy chủ từ chối thao tác',
      };
    }
  }
}

export interface BurrowGardenClient {
  readonly snapshot: AuthoritativeSnapshot | null;
  readonly hasPendingMutation: boolean;
  read: () => Promise<AuthoritativeSnapshot>;
  act: (command: Record<string, unknown>) => Promise<AuthoritativeSnapshot>;
  free: (kind: string, extra?: Record<string, unknown>) => Promise<AuthoritativeSnapshot>;
  guide: (lessonId: string) => Promise<AuthoritativeSnapshot>;
  scene: (scene: {
    weather: string;
    atmosphere: string;
    event: string;
  }) => Promise<AuthoritativeSnapshot>;
  syncProfile: (profile: Record<string, unknown>) => Promise<AuthoritativeSnapshot>;
  visit: (data?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  frame: (frameKey: string) => Promise<Record<string, unknown>>;
  sales: (data?: Record<string, unknown>) => Promise<Record<string, unknown>>;
  fireOut: (data: Record<string, unknown>) => Promise<Record<string, unknown>>;
  sell: (
    items: Record<string, number> | null,
    expectedTotal: number
  ) => Promise<AuthoritativeSnapshot>;
  buy: (itemId: string, packages?: number) => Promise<AuthoritativeSnapshot>;
  settleWallet: (params: {
    direction: 'debit' | 'credit';
    amount: number;
    reasonCode?: string;
    sourceType?: string;
    clientLevel?: number;
    requestId?: string;
  }) => Promise<AuthoritativeSnapshot>;
  houseCup: () => Promise<Record<string, unknown>>;
  contributeHouseCup: (points: number, house?: string) => Promise<Record<string, unknown>>;
  postCoop: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
  fulfillCoop: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
  listCoop: (hostUid?: string) => Promise<Record<string, unknown>>;
  host?: (action: string, extra?: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Tạo Client điều phối RPC tuần tự chuẩn `hagridfarm` (`createGardenClient`).
 */
export function createBurrowGardenClient(transport: CallableTransportFn): BurrowGardenClient {
  let snapshot: AuthoritativeSnapshot | null = null;
  let pending: { signature: string; data: Record<string, unknown> } | null = null;
  let chain: Promise<unknown> = Promise.resolve();

  const queue = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = chain.then(fn, fn);
    chain = run.catch(() => {});
    return run;
  };

  async function callSnapshot(
    name: string,
    data: Record<string, unknown>
  ): Promise<AuthoritativeSnapshot> {
    const knownHash = snapshot?.catalogHash;
    const wireData = knownHash ? { ...data, catalogHash: knownHash } : data;
    const rawResult = await transport(name, wireData);
    if (!rawResult || typeof rawResult !== 'object' || !('garden' in rawResult)) {
      throw new Error('Phản hồi thung lũng từ máy chủ không hợp lệ.');
    }
    const nextSnap = rawResult as unknown as AuthoritativeSnapshot;
    if (nextSnap.catalog === undefined && knownHash && nextSnap.catalogHash === knownHash) {
      nextSnap.catalog = snapshot?.catalog;
    }
    if (snapshot?.saleAdmin && nextSnap.saleAdmin === undefined) {
      nextSnap.saleAdmin = true;
    }
    snapshot = nextSnap;
    return snapshot;
  }

  async function mutate(
    name: string,
    payload: Record<string, unknown>
  ): Promise<AuthoritativeSnapshot> {
    const signature = JSON.stringify({ name, payload });
    if (pending && pending.signature !== signature) {
      throw new Error(
        'Giao dịch trước chưa có kết quả. Hãy thử lại đúng thao tác đó trước.'
      );
    }
    if (!pending) {
      pending = {
        signature,
        data: { ...payload, requestId: generateRequestId() },
      };
    }
    try {
      const result = await callSnapshot(name, pending.data);
      pending = null;
      return result;
    } catch (err) {
      const authErr = err as AuthoritativeError;
      if (authErr?.definitive === true) {
        pending = null;
      }
      throw err;
    }
  }

  const currentRevision = (): number => {
    if (!snapshot) {
      throw new Error('Cần gọi read() tải trạng thái thung lũng trước khi thao tác.');
    }
    return snapshot.garden.progression.revision;
  };

  return {
    get snapshot() {
      return snapshot;
    },
    get hasPendingMutation() {
      return pending !== null;
    },
    read: () => queue(() => callSnapshot('getBurrowGarden', {})),
    act: (command) =>
      queue(() =>
        mutate('performBurrowAction', {
          ...command,
          expectedRevision: currentRevision(),
        })
      ),
    free: (kind, extra = {}) =>
      queue(() =>
        callSnapshot('performBurrowAction', {
          ...extra,
          action: 'freeAction',
          kind,
          expectedRevision: snapshot?.garden.progression.revision ?? 0,
          requestId: generateRequestId(),
        })
      ),
    guide: (lessonId) =>
      queue(() =>
        callSnapshot('performBurrowAction', {
          action: 'guideDone',
          lessonId,
          expectedRevision: snapshot?.garden.progression.revision ?? 0,
          requestId: generateRequestId(),
        })
      ),
    scene: (scene) =>
      queue(() =>
        callSnapshot('performBurrowAction', {
          action: 'setScene',
          scene,
          expectedRevision: snapshot?.garden.progression.revision ?? 0,
          requestId: generateRequestId(),
        })
      ),
    syncProfile: (profile) =>
      queue(() =>
        callSnapshot('performBurrowAction', {
          ...profile,
          action: 'syncProfile',
          expectedRevision: snapshot?.garden.progression.revision ?? 0,
          requestId: generateRequestId(),
        })
      ),
    visit: (data = {}) => queue(() => transport('visitBurrowGarden', data)),
    frame: (frameKey) =>
      queue(async () => {
        const res = await transport('setBurrowFlooFrame', { frameKey });
        if (snapshot && Array.isArray(res.frames) && typeof res.worn === 'string') {
          snapshot = {
            ...snapshot,
            flooFrames: { frames: res.frames as string[], worn: res.worn },
          };
        }
        return res;
      }),
    sales: (data = { mode: 'get' }) => queue(() => transport('manageBurrowSales', data)),
    fireOut: (data) =>
      queue(() =>
        transport('extinguishBurrowGarden', {
          ...data,
          requestId: generateRequestId(),
        })
      ),
    sell: (items, expectedTotal) =>
      queue(() =>
        mutate(
          'sellBurrowGoods',
          items ? { items, expectedTotal } : { clearance: true, expectedTotal }
        )
      ),
    buy: (itemId, packages = 1) =>
      queue(() => {
        const item = snapshot?.catalog?.find((i) => i.id === itemId);
        if (!item) {
          throw new Error('Vật tư chưa mở khóa hoặc chưa tải danh mục cửa hàng.');
        }
        return mutate('buyBurrowSupplies', {
          itemId,
          quantity: packages,
          catalogVersion: snapshot?.catalogVersion,
          expectedTotal: computeClientPackTotal(item, packages),
        });
      }),
    settleWallet: (params) =>
      queue(() =>
        callSnapshot('settleBurrowWallet', {
          direction: params.direction,
          amount: Math.max(1, Math.floor(params.amount)),
          ...(params.reasonCode ? { reasonCode: params.reasonCode } : {}),
          ...(params.sourceType ? { sourceType: params.sourceType } : {}),
          ...(typeof params.clientLevel === 'number'
            ? { clientLevel: Math.floor(params.clientLevel) }
            : {}),
          requestId:
            typeof params.requestId === 'string' && params.requestId
              ? params.requestId
              : generateRequestId(),
        })
      ),
    houseCup: () => queue(() => transport('getBurrowHouseCupStandings', {})),
    contributeHouseCup: (points, house) =>
      queue(() =>
        transport('contributeBurrowHouseCup', {
          points,
          ...(house ? { house } : {}),
        })
      ),
    postCoop: (payload) =>
      queue(() =>
        transport('postBurrowCoopRequest', {
          ...payload,
          requestId:
            typeof payload.requestId === 'string' ? payload.requestId : generateRequestId(),
        })
      ),
    fulfillCoop: (payload) =>
      queue(() => transport('fulfillBurrowCoopRequest', payload)),
    listCoop: (hostUid) =>
      queue(() => transport('getBurrowCoopRequests', hostUid ? { hostUid } : {})),
  };
}

export const BURROW_EMBED_RPC_CHANNEL = 'hpvn-burrow-game';

/**
 * Đọc mã vé phiên `#burrow-ticket=<nonce>` (hoặc fallback `#hpvn-ticket=<nonce>`) khi game được nhúng trong iframe HPVN.
 */
export function getHpvnTicketFromLocation(loc: { hash?: string } | undefined = globalThis.location): string | null {
  const hash = loc?.hash ? loc.hash.slice(1) : '';
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  return params.get('burrow-ticket') ?? params.get('hpvn-ticket');
}

/**
 * Mode A: Client giao tiếp qua `parent.postMessage({ channel: 'hpvn-burrow-game', nonce })` khi nhúng trong HPVN shell.
 */
export function createHpvnEmbedClient(
  nonce: string,
  win: Window = window,
  options: {
    allowedOrigins?: ReadonlyArray<string | RegExp>;
    targetOrigin?: string;
    allowAnyOrigin?: boolean;
  } = {}
): BurrowGardenClient {
  let seq = 0;
  const waiting = new Map<string, (msg: Record<string, unknown>) => void>();
  let resolvedParentOrigin: string | null =
    options.targetOrigin && options.targetOrigin !== '*' ? options.targetOrigin : null;
  if (!resolvedParentOrigin && typeof document !== 'undefined' && document.referrer) {
    try {
      const refOrigin = new URL(document.referrer).origin;
      if (isTrustedHpvnOrigin(refOrigin, options.allowedOrigins)) {
        resolvedParentOrigin = refOrigin;
      }
    } catch {
      // Ignore malformed referrer
    }
  }

  win.addEventListener('message', (event: MessageEvent) => {
    if (
      !options.allowAnyOrigin &&
      typeof event.origin === 'string' &&
      event.origin.length > 0
    ) {
      if (!isTrustedHpvnOrigin(event.origin, options.allowedOrigins)) {
        return;
      }
      resolvedParentOrigin = event.origin;
    }
    const m = event.data as Record<string, unknown> | null;
    if (
      event.source !== win.parent ||
      !m ||
      m.channel !== BURROW_EMBED_RPC_CHANNEL ||
      m.nonce !== nonce ||
      typeof m.id !== 'string' ||
      !waiting.has(m.id)
    ) {
      return;
    }
    const done = waiting.get(m.id)!;
    waiting.delete(m.id);
    done(m);
  });

  const client = createBurrowGardenClient(
    (name, data) =>
      new Promise<Record<string, unknown>>((resolve, reject) => {
        const id = `burrow-${++seq}`;
        // Khi quá hạn 20s, definitive vẫn giữ false để lệnh kế tiếp gửi lại đúng requestId cũ
        const timer = setTimeout(() => {
          waiting.delete(id);
          reject(
            new Error(
              'Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.'
            )
          );
        }, 20_000);

        waiting.set(id, (m) => {
          clearTimeout(timer);
          if ('result' in m && m.result && typeof m.result === 'object') {
            resolve(m.result as Record<string, unknown>);
            return;
          }
          const e = new Error(
            typeof m.error === 'string' ? m.error : 'Máy chủ từ chối thao tác.'
          ) as AuthoritativeError;
          e.definitive = m.definitive === true;
          e.reason = typeof m.reason === 'string' ? m.reason : undefined;
          e.details =
            m.details && typeof m.details === 'object'
              ? (m.details as Record<string, unknown>)
              : {};
          reject(e);
        });

        win.parent.postMessage(
          { channel: BURROW_EMBED_RPC_CHANNEL, nonce, id, action: 'burrow', name, data },
          options.targetOrigin || resolvedParentOrigin || '*'
        );
      })
  );

  client.host = (action: string, extra: Record<string, unknown> = {}) =>
    new Promise((resolve) => {
      const id = `host-${++seq}`;
      const timer = setTimeout(() => {
        waiting.delete(id);
        resolve(null);
      }, 5_000);
      waiting.set(id, (m) => {
        clearTimeout(timer);
        resolve(m.result ?? null);
      });
      win.parent.postMessage(
        { ...extra, channel: BURROW_EMBED_RPC_CHANNEL, nonce, id, action },
        options.targetOrigin || resolvedParentOrigin || '*'
      );
    });

  return client;
}

/**
 * Mode B: Client gọi HTTP trực tiếp tới `/api/rpc/<callableName>` kèm phiên Bearer JWT ký HMAC-SHA256.
 * Trên Firebase Hosting (`hpvnn-archive`), `/api/**` được rewrite thẳng về `burrowApiGateway` (`asia-southeast1`).
 */
export function createHttpAuthoritativeClient(
  options: {
    baseUrl?: string;
    sessionEndpoint?: string;
    fetchImpl?: typeof fetch;
    getUid?: () => string;
    timeoutMs?: number;
  } = {}
): BurrowGardenClient {
  const baseUrl = (options.baseUrl ?? '/api/rpc/').replace(/\/?$/, '/');
  const sessionEndpoint = options.sessionEndpoint ?? '/api/auth/session';
  const fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const getUid = options.getUid ?? getOrCreateClientUserId;
  const timeoutMs = options.timeoutMs ?? 18_000;

  let cachedToken: string | null = null;
  let tokenExpiresAt = 0;

  async function ensureBearerToken(uid: string): Promise<string | null> {
    if (cachedToken && Date.now() + 30_000 < tokenExpiresAt) {
      return cachedToken;
    }
    try {
      const globalWin = typeof window !== 'undefined'
        ? (window as Window & {
            __HPVN_GET_ID_TOKEN__?: () => Promise<string | null>;
            __HPVN_CONFIG__?: { getIdToken?: () => Promise<string | null> };
          })
        : undefined;
      const getIdTokenFn =
        globalWin?.__HPVN_CONFIG__?.getIdToken ?? globalWin?.__HPVN_GET_ID_TOKEN__;
      const idToken = getIdTokenFn ? await getIdTokenFn().catch(() => null) : null;
      const ticket =
        typeof window !== 'undefined' ? getHpvnTicketFromLocation(window.location) : null;
      const res = await fetchFn(sessionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': uid,
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify({
          uid,
          ...(idToken ? { idToken } : {}),
          ...(ticket ? { ticket } : {}),
        }),
      });
      if (!res.ok) return null;
      const body = (await res.json()) as {
        token?: string;
        uid?: string;
        expiresAt?: number;
      };
      if (typeof body.uid === 'string' && body.uid && !options.getUid) {
        setAuthenticatedUserId(body.uid);
      }
      if (typeof body.token === 'string' && body.token) {
        cachedToken = body.token;
        tokenExpiresAt = Number(body.expiresAt || Date.now() + 3_600_000);
        return cachedToken;
      }
    } catch {
      // Nếu endpoint phiên tạm gián đoạn, tiếp tục fallback X-User-Id
    }
    return null;
  }

  return createBurrowGardenClient(async (name, data) => {
    const uid = getUid();
    const token = await ensureBearerToken(uid);
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);

    let response: Response;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-User-Id': uid,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      response = await fetchFn(`${baseUrl}${name}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data }),
        signal: abort.signal,
      });
    } catch {
      // Lỗi mất mạng / timeout -> definitive mặc định undefined (false) để giữ nguyên requestId!
      throw new Error(
        'Chưa nhận được phản hồi. Thử lại đúng thao tác để kiểm tra giao dịch; mã mua được giữ nguyên.'
      );
    } finally {
      clearTimeout(timer);
    }

    const body = (await response.json()) as {
      result?: Record<string, unknown>;
      error?: {
        message?: string;
        details?: Record<string, unknown>;
      };
    };

    if (body.error || !response.ok) {
      const err = new Error(
        body.error?.message || `Máy chủ từ chối thao tác (${response.status}).`
      ) as AuthoritativeError;
      err.definitive = response.status < 500;
      err.reason =
        typeof body.error?.details?.reason === 'string'
          ? body.error.details.reason
          : undefined;
      err.details = body.error?.details ?? {};
      throw err;
    }

    return body.result ?? {};
  });
}

export const HPVN_FIREBASE_REGION = 'asia-southeast1';
export const HPVN_DEFAULT_EMULATOR_PROJECT = 'demo-hpvnn-burrow';
export const HPVN_PROD_FIREBASE_PROJECT = 'hpvnn-archive';

/**
 * Kiểm tra hostname có phải môi trường phát triển nội bộ (localhost / 127.0.0.1 / mạng LAN nội bộ) hay không.
 */
export function isLocalDevelopmentHost(hostname: string): boolean {
  const h = String(hostname || '').trim().toLowerCase();
  if (!h) return false;
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '::1') {
    return true;
  }
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(h)) return true;
  return false;
}

function encodeBase64UrlUtf8(raw: string): string {
  const bytes = new TextEncoder().encode(raw);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

/**
 * Sinh JWT không chữ ký (`alg: 'none'`) chuẩn Firebase Auth Emulator (`fixtureToken` từ `hagridfarm`).
 * Khóa an toàn: từ chối chạy nếu trang đang mở trên tên miền Internet thật.
 */
export function createEmulatorFixtureToken(
  uid: string,
  projectId = HPVN_DEFAULT_EMULATOR_PROJECT,
  loc: { hostname?: string } | undefined = globalThis.location,
  nowMs: number = Date.now()
): string {
  const host = loc?.hostname ?? '127.0.0.1';
  if (!isLocalDevelopmentHost(host)) {
    throw new Error(
      'createEmulatorFixtureToken chỉ được phép dùng trên localhost/LAN cho Firebase Emulator.'
    );
  }
  const nowSec = Math.floor(nowMs / 1000);
  const header = encodeBase64UrlUtf8(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = encodeBase64UrlUtf8(
    JSON.stringify({
      iss: `https://securetoken.google.com/${projectId}`,
      aud: projectId,
      auth_time: nowSec,
      user_id: uid,
      sub: uid,
      iat: nowSec,
      exp: nowSec + 3600,
      firebase: { identities: {}, sign_in_provider: 'custom' },
    })
  );
  return `${header}.${payload}.`;
}

/**
 * Mode C: Client kết nối thẳng Firebase Functions Emulator (`http://127.0.0.1:5001/demo-hpvnn-burrow/asia-southeast1/<callable>`).
 * Luôn gọi trực tiếp các Callable riêng miền `Burrow` (`*Burrow*`), độc lập hoàn toàn với Hagrid Farm.
 */
export function createFirebaseEmulatorClient(
  options: {
    projectId?: string;
    region?: string;
    host?: string;
    port?: number;
    useSameOriginRewrite?: boolean;
    uid?: string;
    getUid?: () => string;
    fetchImpl?: typeof fetch;
    loc?: { hostname?: string };
    now?: () => number;
    timeoutMs?: number;
  } = {}
): BurrowGardenClient {
  const loc = options.loc ?? globalThis.location;
  if (loc?.hostname && !isLocalDevelopmentHost(loc.hostname)) {
    throw new Error('Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.');
  }
  const host = options.host ?? (loc?.hostname || '127.0.0.1');
  if (!isLocalDevelopmentHost(host)) {
    throw new Error('Firebase Emulator Client từ chối kết nối ngoài môi trường cục bộ.');
  }
  const projectId = options.projectId || HPVN_DEFAULT_EMULATOR_PROJECT;
  const region = options.region || HPVN_FIREBASE_REGION;
  const port = options.port || 5001;
  const baseOrigin = options.useSameOriginRewrite ? '' : `http://${host}:${port}`;
  const baseUrl = `${baseOrigin}/${projectId}/${region}/`;
  const fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const resolveUid = options.getUid ?? (() => options.uid || getOrCreateClientUserId());
  const nowFn = options.now ?? (() => Date.now());
  const timeoutMs = options.timeoutMs ?? 18_000;

  return createBurrowGardenClient(async (name, data) => {
    const uid = resolveUid();
    const token = createEmulatorFixtureToken(uid, projectId, { hostname: host }, nowFn());
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchFn(`${baseUrl}${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data }),
        signal: abort.signal,
      });
    } catch {
      throw new Error(
        'Chưa nhận được phản hồi từ Firebase Emulator. Thử lại đúng thao tác; mã giao dịch được giữ nguyên.'
      );
    } finally {
      clearTimeout(timer);
    }

    const body = (await response.json()) as {
      result?: Record<string, unknown>;
      error?: {
        status?: string;
        message?: string;
        details?: Record<string, unknown>;
      };
    };

    if (body.error || !response.ok) {
      const err = new Error(
        body.error?.message || `Emulator từ chối thao tác (${response.status}).`
      ) as AuthoritativeError;
      err.definitive = response.status < 500;
      err.reason =
        typeof body.error?.details?.reason === 'string'
          ? body.error.details.reason
          : undefined;
      err.details = body.error?.details ?? {};
      throw err;
    }

    return body.result ?? {};
  });
}

/**
 * Mode D: Client gọi thẳng Firebase Cloud Functions v2 (`https://asia-southeast1-hpvnn-archive.cloudfunctions.net/<callable>`)
 * kèm Firebase Auth ID Token (`Bearer <idToken>`). Chỉ gọi các hàm `*Burrow*` độc lập của Hang Sóc.
 */
export function createFirebaseFunctionsClient(options: {
  functionsBaseUrl: string;
  getIdToken?: () => Promise<string | null> | string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): BurrowGardenClient {
  const baseUrl = options.functionsBaseUrl.replace(/\/?$/, '/');
  const fetchFn = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  const timeoutMs = options.timeoutMs ?? 20_000;

  return createBurrowGardenClient(async (name, data) => {
    const globalGetToken =
      typeof window !== 'undefined'
        ? (window as Window & { __HPVN_GET_ID_TOKEN__?: () => Promise<string | null> })
            .__HPVN_GET_ID_TOKEN__
        : undefined;
    const idToken = options.getIdToken
      ? await options.getIdToken()
      : globalGetToken
        ? await globalGetToken()
        : null;

    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), timeoutMs);

    let response: Response;
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (idToken) {
        headers.Authorization = `Bearer ${idToken}`;
      } else {
        headers['X-User-Id'] = getOrCreateClientUserId();
      }
      response = await fetchFn(`${baseUrl}${name}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ data }),
        signal: abort.signal,
      });
    } catch {
      throw new Error(
        'Chưa nhận được phản hồi từ Cloud Functions (asia-southeast1). Mã giao dịch vẫn được giữ nguyên.'
      );
    } finally {
      clearTimeout(timer);
    }

    const body = (await response.json()) as {
      result?: Record<string, unknown>;
      error?: {
        message?: string;
        details?: Record<string, unknown>;
      };
    };

    if (body.error || !response.ok) {
      const err = new Error(
        body.error?.message || `Cloud Functions từ chối thao tác (${response.status}).`
      ) as AuthoritativeError;
      err.definitive = response.status < 500;
      err.reason =
        typeof body.error?.details?.reason === 'string'
          ? body.error.details.reason
          : undefined;
      err.details = body.error?.details ?? {};
      throw err;
    }

    return body.result ?? {};
  });
}

/**
 * Bộ tiếp nhận phía trang chủ HPVN (`/phongsinhoatchung`) cho giao thức `channel: 'hpvn-burrow-game'`.
 * Dùng cho cả trang mô phỏng `/hpvn-embed-preview.html` lẫn kiểm thử tích hợp iframe sandbox.
 */
export function attachHpvnParentShellResponder(options: {
  nonce: string;
  transport: CallableTransportFn;
  onHostAction?: (action: string, payload: Record<string, unknown>) => Promise<unknown> | unknown;
  expectedSource?: MessageEventSource | null;
  allowedOrigins?: ReadonlyArray<string | RegExp>;
  allowAnyOrigin?: boolean;
  win?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}): () => void {
  const win = options.win ?? (typeof window !== 'undefined' ? window : undefined);
  if (!win) return () => {};

  const handler = async (ev: Event) => {
    const event = ev as MessageEvent;
    if (
      !options.allowAnyOrigin &&
      typeof event.origin === 'string' &&
      event.origin.length > 0 &&
      !isTrustedHpvnOrigin(event.origin, options.allowedOrigins)
    ) {
      return;
    }
    const m = event.data as Record<string, unknown> | null;
    if (
      !m ||
      m.channel !== BURROW_EMBED_RPC_CHANNEL ||
      m.nonce !== options.nonce ||
      typeof m.id !== 'string'
    ) {
      return;
    }
    if (options.expectedSource && event.source !== options.expectedSource) {
      return;
    }
    const replyTarget = event.source as { postMessage?: (msg: unknown, origin: string) => void } | null;
    if (!replyTarget || typeof replyTarget.postMessage !== 'function') return;
    const replyOrigin =
      typeof event.origin === 'string' && event.origin.length > 0 && event.origin !== 'null'
        ? event.origin
        : '*';

    const id = m.id;
    const action = String(m.action || '');
    if (action === 'burrow' || action === 'garden') {
      const callableName = String(m.name || '');
      const data =
        m.data && typeof m.data === 'object' ? (m.data as Record<string, unknown>) : {};
      try {
        const result = await options.transport(callableName, data);
        replyTarget.postMessage(
          { channel: BURROW_EMBED_RPC_CHANNEL, nonce: options.nonce, id, result },
          replyOrigin
        );
      } catch (err) {
        const authErr = err as AuthoritativeError;
        replyTarget.postMessage(
          {
            channel: BURROW_EMBED_RPC_CHANNEL,
            nonce: options.nonce,
            id,
            error: authErr?.message || 'Máy chủ từ chối thao tác.',
            definitive: authErr?.definitive === true,
            reason: authErr?.reason,
            details: authErr?.details ?? {},
          },
          replyOrigin
        );
      }
      return;
    }

    try {
      const hostResult = options.onHostAction ? await options.onHostAction(action, m) : { ok: true };
      replyTarget.postMessage(
        { channel: BURROW_EMBED_RPC_CHANNEL, nonce: options.nonce, id, result: hostResult },
        replyOrigin
      );
    } catch (err) {
      replyTarget.postMessage(
        {
          channel: BURROW_EMBED_RPC_CHANNEL,
          nonce: options.nonce,
          id,
          error: err instanceof Error ? err.message : 'Lỗi xử lý lệnh host.',
          definitive: true,
        },
        replyOrigin
      );
    }
  };

  win.addEventListener('message', handler);
  return () => {
    win.removeEventListener('message', handler);
  };
}

/**
 * Tự động chọn kênh vận chuyển độc lập cho Trang Trại Hang Sóc:
 *  1. `#burrow-ticket=<nonce>` -> Iframe Sandbox `postMessage({ channel: 'hpvn-burrow-game' })` tới trang chủ HPVN.
 *  2. `?emulator=1` hoặc `?functionsPort=5001` -> Firebase Functions Emulator (`demo-hpvnn-burrow`, `asia-southeast1`).
 *  3. `VITE_HPVN_FUNCTIONS_URL` hoặc `window.__HPVN_CONFIG__.functionsBaseUrl` -> Cloud Functions v2 `asia-southeast1`.
 *  4. Mặc định `/api/rpc/*` -> Firebase Hosting Rewrite sang `burrowApiGateway` (`asia-southeast1`) hoặc Vite Middleware.
 */
export function createAutoAuthoritativeClient(): BurrowGardenClient {
  if (typeof window !== 'undefined') {
    const ticket = getHpvnTicketFromLocation(window.location);
    if (ticket) {
      return createHpvnEmbedClient(ticket, window);
    }

    const params = new URLSearchParams(window.location.search);
    const emulatorFlag = params.get('emulator');
    const functionsPortParam = params.get('functionsPort');
    if (
      (emulatorFlag === '1' || functionsPortParam) &&
      isLocalDevelopmentHost(window.location.hostname)
    ) {
      const port = Number(functionsPortParam || 5001) || 5001;
      const projectId = params.get('project') || HPVN_DEFAULT_EMULATOR_PROJECT;
      const uidOverride = params.get('uid') || undefined;
      return createFirebaseEmulatorClient({
        projectId,
        port,
        uid: uidOverride,
        useSameOriginRewrite: emulatorFlag === 'vite',
      });
    }

    const globalCfg = (
      window as Window & {
        __HPVN_CONFIG__?: {
          functionsBaseUrl?: string;
          getIdToken?: () => Promise<string | null>;
        };
      }
    ).__HPVN_CONFIG__;
    const envFunctionsUrl = (
      import.meta as ImportMeta & { env?: Record<string, string | undefined> }
    ).env?.VITE_HPVN_FUNCTIONS_URL;
    const directFunctionsUrl = globalCfg?.functionsBaseUrl || envFunctionsUrl;
    if (directFunctionsUrl) {
      return createFirebaseFunctionsClient({
        functionsBaseUrl: directFunctionsUrl,
        getIdToken: globalCfg?.getIdToken,
      });
    }
  }
  return createHttpAuthoritativeClient();
}

/**
 * Chạy giao dịch lưu trữ cục bộ an toàn đa tab bằng Web Locks API (`navigator.locks.request`).
 */
let fallbackLockChain: Promise<unknown> = Promise.resolve();

export async function runWithStorageLock<T>(
  lockName: string,
  fn: () => Promise<T> | T
): Promise<T> {
  const nav = typeof navigator !== 'undefined' ? navigator : undefined;
  const locks = nav && 'locks' in nav ? (nav as Navigator & { locks?: LockManager }).locks : undefined;
  if (locks && typeof locks.request === 'function') {
    return locks.request(lockName, async () => fn());
  }
  const run = fallbackLockChain.then(fn, fn);
  fallbackLockChain = run.catch(() => {});
  return run;
}

/**
 * Bộ bọc lưu trữ JSON nguyên tử chuẩn `createGardenStorage` của `hagridfarm`.
 */
export function createAtomicGardenStorage(options: {
  scope: string;
  persistent?: boolean;
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  legacyKeys?: string[];
}) {
  const storageKey = `${options.scope}-save-envelope`;
  const persistent = options.persistent !== false;
  const backing = options.storage ?? globalThis.localStorage;
  const legacyKeys = options.legacyKeys ?? [];

  let memory: Record<string, string> = {};
  let pendingTx: Record<string, string> | null = null;

  function readAll(): Record<string, string> {
    if (pendingTx) return pendingTx;
    if (!persistent || !backing) return memory;
    const raw = backing.getItem(storageKey);
    if (raw !== null) {
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('Bản lưu thung lũng không hợp lệ.');
      }
      return parsed as Record<string, string>;
    }
    const migrated: Record<string, string> = {};
    for (const key of legacyKeys) {
      const val = backing.getItem(key);
      if (val !== null) migrated[key] = val;
    }
    return migrated;
  }

  function writeAll(data: Record<string, string>): void {
    if (persistent && backing) {
      backing.setItem(storageKey, JSON.stringify(data));
    } else {
      memory = data;
    }
  }

  return {
    storageKey,
    getItem(key: string): string | null {
      return readAll()[key] ?? null;
    },
    setItem(key: string, value: string): void {
      if (pendingTx) {
        pendingTx[key] = String(value);
      } else {
        writeAll({ ...readAll(), [key]: String(value) });
      }
    },
    transaction<T>(fn: () => T): T {
      if (pendingTx) return fn();
      pendingTx = { ...readAll() };
      try {
        const result = fn();
        writeAll(pendingTx);
        return result;
      } finally {
        pendingTx = null;
      }
    },
  };
}

export interface WeeklyHouseCupOnlineSnapshot {
  weekKey: string;
  totals: {
    Gryffindor: number;
    Slytherin: number;
    Ravenclaw: number;
    Hufflepuff: number;
  };
  playerContribution: number;
  updatedAt: number;
}

export async function fetchWeeklyHouseCupStandingsOnline(
  client: BurrowGardenClient = createAutoAuthoritativeClient()
): Promise<WeeklyHouseCupOnlineSnapshot | null> {
  const raw = await client.houseCup();
  if (!raw || typeof raw !== 'object') return null;
  const totalsObj =
    raw.totals && typeof raw.totals === 'object' ? (raw.totals as Record<string, unknown>) : {};
  return {
    weekKey: String(raw.weekKey || ''),
    totals: {
      Gryffindor: Math.max(0, Math.floor(Number(totalsObj.Gryffindor) || 0)),
      Slytherin: Math.max(0, Math.floor(Number(totalsObj.Slytherin) || 0)),
      Ravenclaw: Math.max(0, Math.floor(Number(totalsObj.Ravenclaw) || 0)),
      Hufflepuff: Math.max(0, Math.floor(Number(totalsObj.Hufflepuff) || 0)),
    },
    playerContribution: Math.max(0, Math.floor(Number(raw.playerContribution) || 0)),
    updatedAt: Number(raw.updatedAt) || Date.now(),
  };
}

export async function contributeWeeklyHouseCupOnline(
  points: number,
  house?: string,
  client: BurrowGardenClient = createAutoAuthoritativeClient()
): Promise<WeeklyHouseCupOnlineSnapshot | null> {
  const raw = await client.contributeHouseCup(points, house);
  if (!raw || typeof raw !== 'object') return null;
  const totalsObj =
    raw.totals && typeof raw.totals === 'object' ? (raw.totals as Record<string, unknown>) : {};
  return {
    weekKey: String(raw.weekKey || ''),
    totals: {
      Gryffindor: Math.max(0, Math.floor(Number(totalsObj.Gryffindor) || 0)),
      Slytherin: Math.max(0, Math.floor(Number(totalsObj.Slytherin) || 0)),
      Ravenclaw: Math.max(0, Math.floor(Number(totalsObj.Ravenclaw) || 0)),
      Hufflepuff: Math.max(0, Math.floor(Number(totalsObj.Hufflepuff) || 0)),
    },
    playerContribution: Math.max(0, Math.floor(Number(raw.playerContribution) || 0)),
    updatedAt: Number(raw.updatedAt) || Date.now(),
  };
}

export async function postCoopAssistanceOnline(
  payload: Record<string, unknown>,
  client: BurrowGardenClient = createAutoAuthoritativeClient()
): Promise<Record<string, unknown>> {
  return client.postCoop(payload);
}

export async function fulfillCoopAssistanceOnline(
  payload: Record<string, unknown>,
  client: BurrowGardenClient = createAutoAuthoritativeClient()
): Promise<Record<string, unknown>> {
  return client.fulfillCoop(payload);
}
