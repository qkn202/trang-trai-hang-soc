/**
 * Cloudflare Worker & Authoritative HTTP Gateway cho 'Trang Trại Hang Sóc'
 * Kiến trúc Server-Authoritative độc lập hoàn toàn (`burrow_*` namespace):
 *  - `POST /api/auth/session`: Cấp phát JWT phiên đăng nhập ký HMAC-SHA256 (`Authorization: Bearer <token>`).
 *  - `POST /api/rpc/:callableName`: Bộ Callable RPC chuẩn giao thức `{ data } -> { result | error }`
 *    (`getBurrowGarden`, `performBurrowAction`, `buyBurrowSupplies`, `sellBurrowGoods`,
 *     `visitBurrowGarden`, `extinguishBurrowGarden`, `setBurrowFlooFrame`, `manageBurrowSales`,
 *     `getBurrowHouseCupStandings`, `contributeBurrowHouseCup`, `postBurrowCoopRequest`,
 *     `fulfillBurrowCoopRequest`, `getBurrowCoopRequests`).
 *  - `GET/POST /api/save`: Đồng bộ save đám mây có đối soát lịch VN `UTC+7`, trần `5 lượt giúp/ngày`, `revision` & `helpers`.
 *  - `GET/POST /api/leaderboard`: Bảng xếp hạng trực tuyến cho 6 bộ môn mini game + cộng điểm Cúp Nhà tuần.
 *  - `POST /api/friends/register` & `GET /api/friends/lookup`: Danh bạ người chơi thật liên thông `visitBurrowGarden`.
 *  - `POST /api/track`: Ghi nhận sự kiện phân tích và nhật ký lỗi (capped KV buffer).
 */

import {
  type BackendKVStore,
  BurrowAuthoritativeBackend,
  BurrowServerError,
  extractSanitizedPublicValleySave,
  MemoryBackendKVStore,
  normalizeHogwartsHouse,
  sanitizeBackendUid,
  sanitizeFriendCode,
  SCORED_SERVER_LEADERBOARD_GAMES,
  type VerifiedSessionIdentity,
  vnDayKey,
} from './burrowBackendCore';

export interface KVNamespace {
  get(key: string, type?: 'text'): Promise<string | null>;
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Env {
  SAVE_KV?: KVNamespace;
  HMAC_SECRET?: string;
  ADMIN_TOKEN?: string;
  ENVIRONMENT?: string;
  REQUIRE_VERIFIED_AUTH?: string;
  ALLOWED_ORIGINS?: string;
  ENABLE_KV_TRACK_BUFFER?: string;
  verifyFirebaseIdToken?: (idToken: string) => Promise<VerifiedSessionIdentity | null>;
}

export interface AnalyticsIncomingEvent {
  id: string;
  name: string;
  props?: Record<string, unknown>;
  timestamp: number;
}

export interface AnalyticsPayload {
  events: AnalyticsIncomingEvent[];
  sentAt?: number;
}

export interface SavePayload {
  version: number;
  savedAt?: number;
  lastSavedAt?: number;
  [key: string]: unknown;
}

const BASE_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'Content-Type, Content-Encoding, Authorization, X-User-Id, X-Hpvn-Uid, X-Hpvn-Ticket, X-User-Name, X-User-Avatar, X-Admin-Token, Accept',
  'Access-Control-Max-Age': '86400',
};

const DEFAULT_TRUSTED_ORIGIN_PATTERNS: ReadonlyArray<RegExp> = [
  /^https:\/\/([a-z0-9-]+\.)?hpvn-archive\.net$/i,
  /^https:\/\/([a-z0-9-]+\.)?hpvn\.net$/i,
  /^https:\/\/([a-z0-9-]+\.)?hangsoc\.game$/i,
  /^https:\/\/([a-z0-9-]+\.)?web\.app$/i,
  /^https:\/\/([a-z0-9-]+\.)?firebaseapp\.com$/i,
  /^http:\/\/localhost(:\d+)?$/i,
  /^http:\/\/127\.0\.0\.1(:\d+)?$/i,
];

function buildCorsHeaders(request?: Request, env?: Env): Record<string, string> {
  const origin = request?.headers.get('Origin')?.trim() || '';
  if (!origin || env?.ENVIRONMENT !== 'production') {
    return {
      ...BASE_CORS_HEADERS,
      'Access-Control-Allow-Origin': origin || '*',
      ...(origin ? { Vary: 'Origin, Accept-Encoding' } : {}),
    };
  }
  const extraAllowed = (env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const isAllowed =
    extraAllowed.includes(origin) ||
    DEFAULT_TRUSTED_ORIGIN_PATTERNS.some((re) => re.test(origin));
  return {
    ...BASE_CORS_HEADERS,
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://hpvn-archive.net',
    Vary: 'Origin, Accept-Encoding',
  };
}

const BLOCKED_NPC_CODES = new Set([
  'HS-HAGRID-01',
  'HS-LUNA-02',
  'HS-NEVILLE-03',
  'HS-HERMIONE-04',
  'HS-WEASLEY-05',
]);

interface StoredFriendDirectoryProfile {
  userId: string;
  friendCode: string;
  name: string;
  parkName: string;
  level: number;
  house: string;
  avatarEmoji: string;
  buildings?: unknown[];
  tileOverrides?: Record<string, unknown>;
  unlockedZones?: unknown[];
  updatedAt: number;
}

const fallbackMemoryStore = new MemoryBackendKVStore();
const backendByStore = new WeakMap<object, Map<string, BurrowAuthoritativeBackend>>();

function getBackendForEnv(env: Env, customNow?: () => number): {
  backend: BurrowAuthoritativeBackend;
  store: BackendKVStore;
} {
  const isProduction = env?.ENVIRONMENT === 'production';
  if (isProduction && !env?.SAVE_KV) {
    throw new BurrowServerError(
      'server-misconfigured',
      'Thiếu cấu hình lưu trữ bền vững SAVE_KV trên môi trường production.',
      {},
      500
    );
  }
  const store: BackendKVStore = env?.SAVE_KV ?? fallbackMemoryStore;
  const requireVerifiedAuth = env?.REQUIRE_VERIFIED_AUTH === 'true';
  if (customNow) {
    return {
      store,
      backend: new BurrowAuthoritativeBackend({
        store,
        now: customNow,
        hmacSecret: env?.HMAC_SECRET,
        adminToken: env?.ADMIN_TOKEN,
        isProduction,
        requireVerifiedAuth,
        allowEmulatorTokens: !isProduction,
        verifyExternalToken: env?.verifyFirebaseIdToken,
      }),
    };
  }
  let byConfig = backendByStore.get(store as object);
  if (!byConfig) {
    byConfig = new Map<string, BurrowAuthoritativeBackend>();
    backendByStore.set(store as object, byConfig);
  }
  const cacheSig = `${isProduction}|${requireVerifiedAuth}|${env?.HMAC_SECRET ?? ''}|${env?.ADMIN_TOKEN ?? ''}|${Boolean(env?.verifyFirebaseIdToken)}`;
  let cached = byConfig.get(cacheSig);
  if (!cached) {
    cached = new BurrowAuthoritativeBackend({
      store,
      hmacSecret: env?.HMAC_SECRET,
      adminToken: env?.ADMIN_TOKEN,
      isProduction,
      requireVerifiedAuth,
      allowEmulatorTokens: !isProduction,
      verifyExternalToken: env?.verifyFirebaseIdToken,
    });
    byConfig.set(cacheSig, cached);
  }
  return { backend: cached, store };
}

async function buildJsonResponse(
  bodyText: string,
  status = 200,
  request?: Request,
  env?: Env
): Promise<Response> {
  const corsHeaders = buildCorsHeaders(request, env);
  const acceptEnc = request?.headers.get('Accept-Encoding') || '';
  if (
    bodyText.length >= 1024 &&
    /\bgzip\b/i.test(acceptEnc) &&
    typeof CompressionStream !== 'undefined'
  ) {
    const gzStream = new Blob([bodyText]).stream().pipeThrough(new CompressionStream('gzip'));
    return new Response(gzStream, {
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Encoding': 'gzip',
        Vary: corsHeaders.Vary || 'Accept-Encoding',
      },
    });
  }
  return new Response(bodyText, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      Vary: corsHeaders.Vary || 'Accept-Encoding',
    },
  });
}

function jsonResponse(
  data: unknown,
  status = 200,
  request?: Request,
  env?: Env
): Promise<Response> {
  return buildJsonResponse(JSON.stringify(data), status, request, env);
}

async function readStreamUtf8WithLimit(
  stream: ReadableStream<Uint8Array>,
  maxBytes: number
): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => {});
          throw new BurrowServerError(
            'payload-too-large',
            'Dữ liệu gửi lên vượt quá giới hạn dung lượng cho phép.',
            { maxBytes },
            413
          );
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

function createByteLimitedStream(
  source: ReadableStream<Uint8Array>,
  maxBytes: number
): ReadableStream<Uint8Array> {
  let seenBytes = 0;
  return source.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        seenBytes += chunk.byteLength;
        if (seenBytes > maxBytes) {
          controller.error(
            new BurrowServerError(
              'payload-too-large',
              'Luồng nén vượt quá giới hạn dung lượng cho phép.',
              { maxBytes },
              413
            )
          );
          return;
        }
        controller.enqueue(chunk);
      },
    })
  );
}

async function parseRequestJson<T>(request: Request, maxBytes = 64 * 1024): Promise<T> {
  const rawContentLen = Number(request.headers.get('Content-Length') || 0);
  if (Number.isFinite(rawContentLen) && rawContentLen > maxBytes) {
    throw new BurrowServerError(
      'payload-too-large',
      'Dữ liệu gửi lên vượt quá giới hạn dung lượng cho phép.',
      { maxBytes, contentLength: rawContentLen },
      413
    );
  }
  const enc = (request.headers.get('Content-Encoding') || '').toLowerCase();
  if (enc === 'gzip' && request.body && typeof DecompressionStream !== 'undefined') {
    const safeCompressed = createByteLimitedStream(request.body, maxBytes);
    const decompressed = safeCompressed.pipeThrough(
      new DecompressionStream('gzip') as unknown as ReadableWritablePair<Uint8Array, Uint8Array>
    );
    const text = await readStreamUtf8WithLimit(decompressed, maxBytes);
    return JSON.parse(text) as T;
  }
  if (request.body) {
    const text = await readStreamUtf8WithLimit(request.body, maxBytes);
    return JSON.parse(text) as T;
  }
  const rawText = await request.text();
  if (new TextEncoder().encode(rawText).byteLength > maxBytes) {
    throw new BurrowServerError(
      'payload-too-large',
      'Dữ liệu gửi lên vượt quá giới hạn dung lượng cho phép.',
      { maxBytes },
      413
    );
  }
  return JSON.parse(rawText) as T;
}

function isSandboxSavePayload(body: Record<string, unknown> | null | undefined): boolean {
  if (!body || typeof body !== 'object') return false;
  return (
    body.sandboxMode === true ||
    body.sandboxTainted === true ||
    body.isHeadmasterPreview === true
  );
}

function validateSavePayloadBounds(body: SavePayload): string | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return 'Invalid save payload: expected JSON object';
  }
  if (
    typeof body.version !== 'number' ||
    !Number.isInteger(body.version) ||
    body.version <= 0 ||
    body.version > 20
  ) {
    return 'Invalid save payload: missing or invalid version';
  }
  for (const numKey of ['galleons', 'xp', 'magicStars', 'level'] as const) {
    if (body[numKey] !== undefined) {
      const val = Number(body[numKey]);
      if (!Number.isFinite(val) || val < 0 || val > 999_999_999) {
        return `Invalid save payload: out-of-bounds ${numKey}`;
      }
    }
  }
  if (body.buildings !== undefined) {
    if (!Array.isArray(body.buildings) || body.buildings.length > 600) {
      return 'Invalid save payload: buildings exceeds maximum limit';
    }
  }
  return null;
}

function getClientRateKey(request: Request, fallbackUid?: string): string {
  const cfIp = request.headers.get('CF-Connecting-IP')?.trim();
  const fwd = request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim();
  return (cfIp || fwd || fallbackUid || 'anon_ip').slice(0, 64);
}

function sanitizeTelemetryEvents(rawEvents: AnalyticsIncomingEvent[]): AnalyticsIncomingEvent[] {
  const clean: AnalyticsIncomingEvent[] = [];
  for (const raw of rawEvents.slice(0, 50)) {
    if (!raw || typeof raw !== 'object') continue;
    if (typeof raw.name !== 'string' || !raw.name.trim()) continue;
    let safeProps: Record<string, unknown> | undefined;
    if (raw.props && typeof raw.props === 'object' && !Array.isArray(raw.props)) {
      safeProps = {};
      for (const [k, v] of Object.entries(raw.props).slice(0, 16)) {
        const cleanKey = k.slice(0, 48);
        if (typeof v === 'number' && Number.isFinite(v)) {
          safeProps[cleanKey] = v;
        } else if (typeof v === 'boolean' || v === null) {
          safeProps[cleanKey] = v;
        } else if (typeof v === 'string') {
          safeProps[cleanKey] = v.slice(0, 300);
        }
      }
    }
    clean.push({
      id: typeof raw.id === 'string' ? raw.id.slice(0, 64) : `evt_${clean.length}`,
      name: raw.name.trim().slice(0, 64),
      timestamp:
        typeof raw.timestamp === 'number' && Number.isFinite(raw.timestamp)
          ? raw.timestamp
          : Date.now(),
      ...(safeProps ? { props: safeProps } : {}),
    });
  }
  return clean;
}

function extractFriendProfileFromSave(
  userId: string,
  body: Record<string, unknown>,
  nowMs: number
): StoredFriendDirectoryProfile | null {
  const soc =
    body.neighborSocial && typeof body.neighborSocial === 'object'
      ? (body.neighborSocial as Record<string, unknown>)
      : null;
  const friendCode = sanitizeFriendCode(soc?.playerFriendCode ?? body.friendCode);
  if (friendCode.length < 4 || BLOCKED_NPC_CODES.has(friendCode)) return null;

  const parkName = String(body.parkName || 'Trang Trại Hang Sóc').slice(0, 42);
  const displayName =
    typeof soc?.playerDisplayName === 'string' && soc.playerDisplayName.trim()
      ? soc.playerDisplayName.trim()
      : String(body.name || parkName);
  const name = displayName.slice(0, 42);
  const level = Math.max(1, Math.min(100, Math.floor(Number(body.level) || 1)));
  const lbObj =
    body.minigameLeaderboard && typeof body.minigameLeaderboard === 'object'
      ? (body.minigameLeaderboard as Record<string, unknown>)
      : null;
  let resolvedHouse =
    normalizeHogwartsHouse(lbObj?.playerHouse) ?? normalizeHogwartsHouse(body.house);
  if (!resolvedHouse && body.housePoints && typeof body.housePoints === 'object') {
    const hp = body.housePoints as Record<string, unknown>;
    let bestH: 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin' = 'Gryffindor';
    let bestPts = 0;
    for (const h of ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'] as const) {
      const v = Number(hp[h] || 0);
      if (v > bestPts) {
        bestPts = v;
        bestH = h;
      }
    }
    if (bestPts > 0) resolvedHouse = bestH;
  }
  const house = resolvedHouse ?? 'Gryffindor';
  const avatarEmoji = String(body.avatarEmoji || '🧙‍♂️').slice(0, 8);
  const buildings = Array.isArray(body.buildings) ? body.buildings.slice(0, 260) : undefined;
  const tileOverrides =
    body.tileOverrides && typeof body.tileOverrides === 'object'
      ? (body.tileOverrides as Record<string, unknown>)
      : undefined;
  const unlockedZones = Array.isArray(body.unlockedZones)
    ? body.unlockedZones.slice(0, 12)
    : undefined;

  return {
    userId,
    friendCode,
    name,
    parkName,
    level,
    house,
    avatarEmoji,
    buildings,
    tileOverrides,
    unlockedZones,
    updatedAt: nowMs,
  };
}

function matchCallableRoute(pathname: string): string | null {
  const rpcPrefix = '/api/rpc/';
  if (pathname.startsWith(rpcPrefix)) {
    const name = pathname.slice(rpcPrefix.length).split('/')[0];
    return name || null;
  }
  if (pathname === '/api' || pathname.startsWith('/api/')) {
    return null;
  }
  // Tương thích đường dẫn Firebase Emulator: `/<project>/<region>/<callableName>`
  const firebaseMatch = pathname.match(/^\/[a-zA-Z0-9_-]+\/[a-z0-9-]+\/([a-zA-Z0-9_]+)$/);
  if (firebaseMatch) {
    return firebaseMatch[1];
  }
  return null;
}

export async function handleAuthoritativeHttpRequest(
  request: Request,
  env: Env = {},
  customNow?: () => number
): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const nowFn = customNow ?? (() => Date.now());

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: buildCorsHeaders(request, env),
    });
  }

  try {
    const { backend, store } = getBackendForEnv(env, customNow);
    const clientRateKey = getClientRateKey(request);

    // 1. Route POST /api/auth/session — Cấp phát phiên HMAC-SHA256 Bearer JWT
    if (pathname === '/api/auth/session' || pathname.endsWith('/api/auth/session')) {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
      }
      let body: Record<string, unknown> = {};
      try {
        body = await parseRequestJson<Record<string, unknown>>(request, 16 * 1024);
      } catch (parseErr) {
        if (parseErr instanceof BurrowServerError) throw parseErr;
        body = {};
      }

      backend.checkRateLimit(`auth:${clientRateKey}`, 20, 60_000);

      const adminHeader = request.headers.get('X-Admin-Token');
      const isAdmin = backend.isStaticAdminTokenValid(adminHeader);

      let verifiedIdentity: VerifiedSessionIdentity | null = null;
      const authHeader = request.headers.get('Authorization') || '';
      const bearerToken = /^Bearer\s+/i.test(authHeader)
        ? authHeader.replace(/^Bearer\s+/i, '').trim()
        : '';
      const rawIdToken =
        (typeof body.idToken === 'string' && body.idToken.trim()) || bearerToken;
      const rawTicket =
        (typeof body.ticket === 'string' && body.ticket.trim()) ||
        request.headers.get('X-Hpvn-Ticket')?.trim() ||
        '';

      if (rawIdToken && env.verifyFirebaseIdToken) {
        verifiedIdentity = await env.verifyFirebaseIdToken(rawIdToken);
      }
      if (!verifiedIdentity && rawTicket) {
        verifiedIdentity = await backend.verifySignedHpvnTicket(rawTicket);
      }
      if (!verifiedIdentity && bearerToken) {
        try {
          verifiedIdentity = await backend.verifyIdentityFromHeaders(
            new Headers({ Authorization: `Bearer ${bearerToken}` })
          );
        } catch {
          verifiedIdentity = null;
        }
      }

      if (env.REQUIRE_VERIFIED_AUTH === 'true' && !verifiedIdentity && !isAdmin) {
        throw new BurrowServerError(
          'unauthorized',
          'Cần đăng nhập qua cổng HPVN hoặc thẻ phiên đã ký hợp lệ để cấp phát token.',
          {},
          401
        );
      }

      const rawUid =
        verifiedIdentity?.uid ||
        (typeof body.uid === 'string' ? body.uid : null) ||
        request.headers.get('X-User-Id') ||
        url.searchParams.get('userId');
      const uid = sanitizeBackendUid(rawUid);
      backend.checkRateLimit(`auth_uid:${uid}`, 20, 60_000);

      const explicitBodyHouse = normalizeHogwartsHouse(body.house);
      let resolvedDocProfile: Awaited<ReturnType<NonNullable<BackendKVStore['resolveMemberIdentityProfile']>>> =
        null;
      if (
        (!verifiedIdentity || verifiedIdentity.houseExplicit !== true || !verifiedIdentity.username) &&
        typeof store.resolveMemberIdentityProfile === 'function'
      ) {
        try {
          resolvedDocProfile = await store.resolveMemberIdentityProfile(uid);
        } catch {
          resolvedDocProfile = null;
        }
      }
      const resolvedSessionHouse =
        (verifiedIdentity?.houseExplicit ? verifiedIdentity.house : undefined) ??
        resolvedDocProfile?.house ??
        explicitBodyHouse ??
        verifiedIdentity?.house;
      const resolvedHouseExplicit = Boolean(
        verifiedIdentity?.houseExplicit || resolvedDocProfile?.house || explicitBodyHouse
      );

      const issued = await backend.issueSessionToken({
        uid,
        house: resolvedSessionHouse,
        houseExplicit: resolvedHouseExplicit,
        username:
          verifiedIdentity?.username ||
          resolvedDocProfile?.username ||
          (typeof body.username === 'string' ? body.username : undefined),
        avatarUrl:
          verifiedIdentity?.avatarUrl ||
          resolvedDocProfile?.avatarUrl ||
          (typeof body.avatarUrl === 'string' ? body.avatarUrl : undefined),
        role:
          isAdmin || verifiedIdentity?.role === 'saleAdmin' ? 'saleAdmin' : 'member',
      });
      const nowMs = nowFn();
      return jsonResponse(
        {
          ok: true,
          ...issued,
          serverNow: nowMs,
          dayKey: vnDayKey(nowMs),
        },
        200,
        request,
        env
      );
    }

    // 2. Route POST /api/rpc/:callableName — 8 Callable RPC chuẩn HPVNN `{ data } -> { result | error }`
    const callableName = matchCallableRoute(pathname);
    if (callableName) {
      if (request.method !== 'POST') {
        return jsonResponse({ error: { message: 'Method Not Allowed' } }, 405, request, env);
      }
      let envelope: { data?: Record<string, unknown> } = {};
      try {
        // syncProfile có thể kèm sơ đồ vườn tinh gọn nên cho phép tới 256KB, các lệnh khác rất nhỏ
        envelope = await parseRequestJson<{ data?: Record<string, unknown> }>(request, 256 * 1024);
      } catch (parseErr) {
        if (parseErr instanceof BurrowServerError) {
          return jsonResponse(
            {
              error: {
                message: parseErr.message,
                details: { reason: parseErr.reason, ...parseErr.details },
              },
            },
            parseErr.httpStatus,
            request,
            env
          );
        }
        return jsonResponse(
          {
            error: {
              message: 'Payload JSON không hợp lệ.',
              details: { reason: 'invalid-action-input' },
            },
          },
          400,
          request,
          env
        );
      }
      try {
        const identity = await backend.verifyIdentityFromHeaders(
          request.headers,
          url.searchParams.get('userId')
        );
        const payload =
          envelope && typeof envelope === 'object' && 'data' in envelope && envelope.data
            ? envelope.data
            : (envelope as unknown as Record<string, unknown>);
        const result = await backend.handleCallable(callableName, payload, identity);
        return jsonResponse({ result }, 200, request, env);
      } catch (rpcErr) {
        if (rpcErr instanceof BurrowServerError) {
          return jsonResponse(
            {
              error: {
                message: rpcErr.message,
                details: rpcErr.details,
              },
            },
            rpcErr.httpStatus,
            request,
            env
          );
        }
        throw rpcErr;
      }
    }

    // 3. Route /api/save — Cloud Save có đối soát lịch VN UTC+7, trần 5 lượt giúp/ngày & helpers
    if (pathname === '/api/save' || pathname.endsWith('/api/save')) {
      const identity = await backend.verifyIdentityFromHeaders(
        request.headers,
        url.searchParams.get('userId')
      );
      const userId = identity.uid;
      backend.checkRateLimit(`save:${userId}`, 30, 60_000);
      const kvKey = `burrow_save:${userId}`;

      if (request.method === 'GET') {
        const rawSave = await store.get(kvKey, 'text');
        if (!rawSave) {
          return new Response(null, {
            status: 204,
            headers: buildCorsHeaders(request, env),
          });
        }
        // Đính kèm danh sách `helpers` hôm nay & khóa ngày VN từ server vào bản tải về
        try {
          const parsed = JSON.parse(rawSave) as Record<string, unknown>;
          const nowMs = nowFn();
          const dayKey = vnDayKey(nowMs);
          const daily = await backend.getOrCreateDaily(userId, dayKey);
          const helpers = await backend.getHelpersForHost(userId, dayKey);
          parsed.serverNow = nowMs;
          parsed.serverDayKey = dayKey;
          parsed.serverHelpsLeft = Math.max(0, 5 - daily.helpsGivenCount);
          if (helpers.length > 0) {
            parsed.serverHelpers = helpers;
          }
          return jsonResponse(parsed, 200, request, env);
        } catch {
          return buildJsonResponse(rawSave, 200, request, env);
        }
      }

      if (request.method === 'POST') {
        let body: SavePayload;
        try {
          body = await parseRequestJson<SavePayload>(request, 512 * 1024);
        } catch (parseErr) {
          if (parseErr instanceof BurrowServerError) throw parseErr;
          return jsonResponse({ error: 'Invalid JSON save payload' }, 400, request, env);
        }

        if (isSandboxSavePayload(body)) {
          throw new BurrowServerError(
            'sandbox-forbidden',
            'Không cho phép đồng bộ bản lưu Chế Độ Thử Nghiệm (Sandbox) lên máy chủ HPVN!',
            {},
            403
          );
        }

        const schemaErr = validateSavePayloadBounds(body);
        if (schemaErr) {
          return jsonResponse({ error: schemaErr }, 400, request, env);
        }

        const nowMs = nowFn();
        const dayKey = vnDayKey(nowMs);
        const state = await backend.getOrCreateState(
          userId,
          identity.house,
          identity.houseExplicit ? 'hpvn' : 'default'
        );
        await backend.syncIdentityProfileForState(state, identity);
        const daily = await backend.getOrCreateDaily(userId, dayKey);

        const timestamp = Number(body.savedAt || body.lastSavedAt || nowMs);
        body.savedAt = timestamp;
        body.lastSavedAt = timestamp;

        const reconciled = backend.reconcileClientSaveIntoState(
          body as Record<string, unknown>,
          state,
          daily
        );
        await backend.syncSaveLeaderboardsForState(reconciled, state, daily);
        state.revision += 1;
        state.updatedAt = nowMs;

        const publicLayout = extractSanitizedPublicValleySave(reconciled);

        await store.put(kvKey, JSON.stringify(reconciled), { expirationTtl: 31_536_000 });
        await store.put(`burrow_public_layout:${userId}`, JSON.stringify(publicLayout), {
          expirationTtl: 31_536_000,
        });
        await store.put(`burrow_states:${userId}`, JSON.stringify(state), {
          expirationTtl: 31_536_000,
        });
        await store.put(`burrow_daily:${userId}:${dayKey}`, JSON.stringify(daily), {
          expirationTtl: 86_400 * 14,
        });
        await backend.syncVisitDirectoryForState(state);

        const friendProfile = extractFriendProfileFromSave(userId, reconciled, nowMs);
        if (friendProfile) {
          friendProfile.friendCode = state.friendCode;
          friendProfile.house = state.house;
          if (state.playerName && state.playerName !== 'Phù Thủy Hang Sóc') {
            friendProfile.name = state.playerName;
          }
          let canWriteFriend = true;
          const existingFriendRaw = await store.get(`burrow_friend:${friendProfile.friendCode}`, 'text');
          if (existingFriendRaw) {
            try {
              const existingParsed = JSON.parse(existingFriendRaw) as { userId?: string };
              if (existingParsed.userId && existingParsed.userId !== userId) {
                canWriteFriend = false;
              }
            } catch {
              canWriteFriend = true;
            }
          }
          if (canWriteFriend) {
            await store.put(`burrow_friend:${friendProfile.friendCode}`, JSON.stringify(friendProfile), {
              expirationTtl: 31_536_000,
            });
          }
        }

        const helpers = await backend.getHelpersForHost(userId, dayKey);
        return jsonResponse(
          {
            ok: true,
            userId,
            friendCode: state.friendCode,
            savedAt: timestamp,
            version: body.version,
            revision: state.revision,
            dayKey,
            serverNow: nowMs,
            helpsLeft: Math.max(0, 5 - daily.helpsGivenCount),
            helpers,
          },
          200,
          request,
          env
        );
      }

      return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
    }

    // 4. Route /api/track — Analytics & Error Monitoring (POST)
    if (pathname === '/api/track' || pathname.endsWith('/api/track')) {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
      }
      backend.checkRateLimit(`track:${clientRateKey}`, 60, 60_000);

      let body: AnalyticsPayload;
      try {
        body = await parseRequestJson<AnalyticsPayload>(request, 32 * 1024);
      } catch (parseErr) {
        if (parseErr instanceof BurrowServerError) throw parseErr;
        return jsonResponse({ error: 'Invalid JSON payload' }, 400, request, env);
      }

      if (!body || !Array.isArray(body.events)) {
        return jsonResponse({ error: 'Missing events array in payload' }, 400, request, env);
      }

      const cleanEvents = sanitizeTelemetryEvents(body.events);

      // Trên production (Cloud Functions / Worker), ghi structured JSON log thay vì read-modify-write
      // 1 document duy nhất (`burrow_track:recent_events`) gây nghẽn Firestore 1 write/sec.
      if (env.ENVIRONMENT === 'production' && env.ENABLE_KV_TRACK_BUFFER !== 'true') {
        if (cleanEvents.length > 0) {
          console.info(
            JSON.stringify({
              severity: 'INFO',
              component: 'burrow-telemetry',
              count: cleanEvents.length,
              events: cleanEvents,
            })
          );
        }
        return jsonResponse(
          {
            ok: true,
            trackedCount: cleanEvents.length,
            totalBuffered: cleanEvents.length,
          },
          200,
          request,
          env
        );
      }

      const LOG_KEY = 'burrow_track:recent_events';
      const MAX_LOGS = 200;
      let existing: AnalyticsIncomingEvent[] = [];
      try {
        const rawLogs = await store.get(LOG_KEY, 'text');
        if (rawLogs) {
          const parsed = JSON.parse(rawLogs);
          if (Array.isArray(parsed)) existing = parsed as AnalyticsIncomingEvent[];
        }
      } catch {
        existing = [];
      }

      const merged = [...existing, ...cleanEvents].slice(-MAX_LOGS);
      await store.put(LOG_KEY, JSON.stringify(merged), { expirationTtl: 86_400 * 7 });

      return jsonResponse(
        {
          ok: true,
          trackedCount: cleanEvents.length,
          totalBuffered: merged.length,
        },
        200,
        request,
        env
      );
    }

    // 5. Route /api/leaderboard — Bảng Xếp Hạng Trực Tuyến 3 Môn Tính Điểm + Cúp Nhà Tuần
    if (pathname === '/api/leaderboard' || pathname.endsWith('/api/leaderboard')) {
      const ALL_KNOWN_GAMES = new Set([
        'match3',
        'sudoku',
        'blocks',
        'jigsaw',
        'caro',
        'chess',
        'seedquiz',
      ]);

      if (request.method === 'GET') {
        const rawGame = url.searchParams.get('game') || 'match3';
        if (!SCORED_SERVER_LEADERBOARD_GAMES.has(rawGame)) {
          return jsonResponse(
            {
              ok: true,
              gameId: ALL_KNOWN_GAMES.has(rawGame) ? rawGame : 'match3',
              entries: [],
            },
            200,
            request,
            env
          );
        }
        const entries = await backend.getLeaderboardEntries(rawGame);
        return jsonResponse({ ok: true, gameId: rawGame, entries }, 200, request, env);
      }

      if (request.method === 'POST') {
        let body: {
          gameId?: string;
          entry?: Record<string, unknown>;
        };
        try {
          body = await parseRequestJson<typeof body>(request, 32 * 1024);
        } catch (parseErr) {
          if (parseErr instanceof BurrowServerError) throw parseErr;
          return jsonResponse({ error: 'Invalid JSON payload' }, 400, request, env);
        }

        const rawGame = String(body?.gameId || 'match3');
        if (!SCORED_SERVER_LEADERBOARD_GAMES.has(rawGame) || !body?.entry) {
          return jsonResponse(
            { error: 'Invalid or unscored leaderboard gameId or entry' },
            400,
            request,
            env
          );
        }

        if (isSandboxSavePayload(body.entry)) {
          throw new BurrowServerError(
            'sandbox-forbidden',
            'Không cho phép gửi điểm từ Chế Độ Thử Nghiệm (Sandbox)!',
            {},
            403
          );
        }

        const identity = await backend.verifyIdentityFromHeaders(
          request.headers,
          typeof body.entry.userId === 'string' ? body.entry.userId : null
        );
        backend.checkRateLimit(`lb:${identity.uid}`, 20, 60_000);

        const submitted = await backend.submitLeaderboardScore({
          uid: identity.uid,
          gameId: rawGame,
          entry: body.entry,
        });

        const cleanLbCode = sanitizeFriendCode(body.entry.friendCode);
        if (cleanLbCode.length >= 4 && !BLOCKED_NPC_CODES.has(cleanLbCode)) {
          const existingFriendRaw = await store.get(`burrow_friend:${cleanLbCode}`, 'text');
          if (!existingFriendRaw) {
            const lbProfile: StoredFriendDirectoryProfile = {
              userId: identity.uid,
              friendCode: cleanLbCode,
              name: String(body.entry.name || 'Trang Trại Hang Sóc').slice(0, 42),
              parkName: String(body.entry.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
              level: Math.max(
                1,
                Math.min(100, Math.round(Number(body.entry.primaryValue || 5) / 5) || 1)
              ),
              house: String(body.entry.house || 'Gryffindor'),
              avatarEmoji: String(body.entry.avatarEmoji || '🧙‍♂️').slice(0, 8),
              updatedAt: nowFn(),
            };
            await store.put(`burrow_friend:${cleanLbCode}`, JSON.stringify(lbProfile), {
              expirationTtl: 86_400 * 180,
            });
          }
        }

        return jsonResponse(
          {
            ok: true,
            gameId: submitted.gameId,
            entries: submitted.entries,
            cupPointsAdded: submitted.cupPointsAdded,
          },
          200,
          request,
          env
        );
      }

      return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
    }

    // 6. Route /api/friends/register & /api/friends/lookup — Danh bạ Người Chơi Thật
    if (pathname === '/api/friends/register' || pathname.endsWith('/api/friends/register')) {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
      }
      let body: Record<string, unknown>;
      try {
        body = await parseRequestJson<Record<string, unknown>>(request, 128 * 1024);
      } catch (parseErr) {
        if (parseErr instanceof BurrowServerError) throw parseErr;
        return jsonResponse({ error: 'Invalid JSON payload' }, 400, request, env);
      }

      if (isSandboxSavePayload(body)) {
        throw new BurrowServerError(
          'sandbox-forbidden',
          'Không cho phép đăng ký Mã Thung Lũng từ Chế Độ Thử Nghiệm (Sandbox)!',
          {},
          403
        );
      }

      const identity = await backend.verifyIdentityFromHeaders(
        request.headers,
        typeof body.userId === 'string' ? body.userId : null
      );
      backend.checkRateLimit(`friend_reg:${identity.uid}`, 15, 60_000);

      const nowMs = nowFn();
      const state = await backend.getOrCreateState(
        identity.uid,
        identity.house,
        identity.houseExplicit ? 'hpvn' : 'default'
      );
      await backend.syncIdentityProfileForState(state, identity);

      const profile = extractFriendProfileFromSave(identity.uid, body, nowMs);
      if (!profile) {
        return jsonResponse({ ok: false, error: 'Invalid friendCode' }, 400, request, env);
      }
      if (state.houseSource === 'hpvn') {
        profile.house = state.house;
      }
      if (
        state.playerName &&
        state.playerName !== 'Phù Thủy Hang Sóc' &&
        (profile.name === 'Trang Trại Hang Sóc' || !profile.name)
      ) {
        profile.name = state.playerName;
      }

      const existingFriendRaw = await store.get(`burrow_friend:${profile.friendCode}`, 'text');
      if (existingFriendRaw) {
        let existingOwnerUid = '';
        try {
          const parsedExisting = JSON.parse(existingFriendRaw) as { userId?: string };
          existingOwnerUid = typeof parsedExisting.userId === 'string' ? parsedExisting.userId : '';
        } catch {
          existingOwnerUid = '';
        }
        if (existingOwnerUid && existingOwnerUid !== identity.uid) {
          throw new BurrowServerError(
            'friend-code-taken',
            'Mã Thung Lũng này đã thuộc về một phù thủy khác!',
            { friendCode: profile.friendCode },
            409
          );
        }
      }

      await store.put(`burrow_friend:${profile.friendCode}`, JSON.stringify(profile), {
        expirationTtl: 31_536_000,
      });

      // Đồng bộ hồ sơ vào `burrow_states` + `burrow_public_layout` để bạn bè thăm qua `visitBurrowGarden`
      const daily = await backend.getOrCreateDaily(profile.userId, vnDayKey(nowMs));
      state.friendCode = profile.friendCode;
      backend.reconcileClientSaveIntoState(body, state, daily);
      const publicLayout = extractSanitizedPublicValleySave(body);
      await store.put(`burrow_public_layout:${profile.userId}`, JSON.stringify(publicLayout), {
        expirationTtl: 31_536_000,
      });
      await store.put(`burrow_states:${profile.userId}`, JSON.stringify(state), {
        expirationTtl: 31_536_000,
      });
      await backend.syncVisitDirectoryForState(state);

      return jsonResponse(
        { ok: true, friendCode: profile.friendCode, userId: profile.userId },
        200,
        request,
        env
      );
    }

    if (pathname === '/api/friends/lookup' || pathname.endsWith('/api/friends/lookup')) {
      if (request.method !== 'GET') {
        return jsonResponse({ error: 'Method Not Allowed' }, 405, request, env);
      }
      backend.checkRateLimit(`friend_lookup:${clientRateKey}`, 45, 60_000);
      const code = sanitizeFriendCode(url.searchParams.get('code'));
      if (code.length < 4 || BLOCKED_NPC_CODES.has(code)) {
        return jsonResponse(
          { ok: false, found: false, error: 'Mã Thung Lũng không hợp lệ!' },
          404,
          request,
          env
        );
      }
      const rawFriend = await store.get(`burrow_friend:${code}`, 'text');
      if (rawFriend) {
        try {
          const profile = JSON.parse(rawFriend) as StoredFriendDirectoryProfile;
          return jsonResponse({ ok: true, found: true, profile }, 200, request, env);
        } catch {
          // Fall through
        }
      }
      return jsonResponse(
        {
          ok: false,
          found: false,
          error: 'Không tìm thấy người chơi thật nào đăng ký Mã Thung Lũng này!',
        },
        404,
        request,
        env
      );
    }

    return jsonResponse({ error: 'Route not found', path: pathname }, 404, request, env);
  } catch (err) {
    if (err instanceof BurrowServerError) {
      return jsonResponse(
        {
          error: err.message,
          reason: err.reason,
          details: err.details,
        },
        err.httpStatus,
        request,
        env
      );
    }
    console.error('[Worker Error]', err);
    return jsonResponse(
      {
        error: 'Internal Server Error',
        message: err instanceof Error ? err.message : String(err),
      },
      500,
      request,
      env
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return handleAuthoritativeHttpRequest(request, env);
  },
};
