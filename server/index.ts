/**
 * Cloudflare Worker Backend cho 'Trang Trại Hang Sóc'
 * Hỗ trợ 3 endpoints cốt lõi:
 *  - /api/save: Lưu và tải tiến trình game qua Cloudflare KV (SAVE_KV)
 *  - /api/track: Ghi nhận sự kiện phân tích và nhật ký lỗi (capped KV buffer)
 *  - /api/leaderboard: Bảng xếp hạng trực tuyến cho từng môn trong 6 mini game
 */

export interface KVNamespace {
  get(key: string, type?: 'text'): Promise<string | null>;
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface Env {
  SAVE_KV: KVNamespace;
  ENVIRONMENT?: string;
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

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Content-Encoding, X-User-Id, Accept',
  'Access-Control-Max-Age': '86400',
};

async function buildJsonResponse(
  bodyText: string,
  status = 200,
  request?: Request
): Promise<Response> {
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
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Encoding': 'gzip',
        Vary: 'Accept-Encoding',
        ...CORS_HEADERS,
      },
    });
  }
  return new Response(bodyText, {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Vary: 'Accept-Encoding',
      ...CORS_HEADERS,
    },
  });
}

function jsonResponse(data: unknown, status = 200, request?: Request): Promise<Response> {
  return buildJsonResponse(JSON.stringify(data), status, request);
}

async function parseRequestJson<T>(request: Request): Promise<T> {
  const enc = (request.headers.get('Content-Encoding') || '').toLowerCase();
  if (enc === 'gzip' && request.body && typeof DecompressionStream !== 'undefined') {
    const decompressed = request.body.pipeThrough(new DecompressionStream('gzip'));
    const text = await new Response(decompressed).text();
    return JSON.parse(text) as T;
  }
  return (await request.json()) as T;
}

function sanitizeUserId(rawId: string | null): string {
  if (!rawId) return 'default_player';
  const clean = rawId.replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64);
  return clean || 'default_player';
}

function sanitizeFriendCode(rawCode: unknown): string {
  if (typeof rawCode !== 'string') return '';
  return rawCode
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 18);
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

function extractFriendProfileFromSave(
  userId: string,
  body: Record<string, unknown>
): StoredFriendDirectoryProfile | null {
  const soc =
    body.neighborSocial && typeof body.neighborSocial === 'object'
      ? (body.neighborSocial as Record<string, unknown>)
      : null;
  const friendCode = sanitizeFriendCode(soc?.playerFriendCode ?? body.friendCode);
  if (friendCode.length < 4 || BLOCKED_NPC_CODES.has(friendCode)) return null;

  const parkName = String(body.parkName || 'Trang Trại Hang Sóc').slice(0, 42);
  const name = String(body.name || parkName).slice(0, 42);
  const level = Math.max(1, Math.min(100, Math.floor(Number(body.level) || 1)));
  const validHouses = new Set(['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin']);
  let house = String(body.house || 'Gryffindor');
  if (!validHouses.has(house) && body.housePoints && typeof body.housePoints === 'object') {
    const hp = body.housePoints as Record<string, unknown>;
    let bestH = 'Gryffindor';
    let bestPts = -1;
    for (const h of ['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin']) {
      const v = Number(hp[h] || 0);
      if (v > bestPts) {
        bestPts = v;
        bestH = h;
      }
    }
    house = bestH;
  }
  if (!validHouses.has(house)) house = 'Gryffindor';
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
    updatedAt: Date.now(),
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Xử lý preflight CORS OPTIONS request
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    try {
      // 2. Route /api/save — Cloud Save (GET / POST)
      if (pathname === '/api/save' || pathname.endsWith('/api/save')) {
        const rawUserId = request.headers.get('X-User-Id') || url.searchParams.get('userId');
        const userId = sanitizeUserId(rawUserId);
        const kvKey = `save:${userId}`;

        if (request.method === 'GET') {
          // Tải dữ liệu save từ Cloudflare KV
          if (!env.SAVE_KV) {
            return jsonResponse({ error: 'SAVE_KV binding not configured' }, 500);
          }

          const rawSave = await env.SAVE_KV.get(kvKey, 'text');
          if (!rawSave) {
            return jsonResponse({ error: 'Save not found', userId }, 404, request);
          }

          return buildJsonResponse(rawSave, 200, request);
        }

        if (request.method === 'POST') {
          // Ghi nhận save mới từ máy người chơi
          if (!env.SAVE_KV) {
            return jsonResponse({ error: 'SAVE_KV binding not configured' }, 500, request);
          }

          const body = await parseRequestJson<SavePayload>(request);

          // Version guard: Bắt buộc phải có version hợp lệ
          if (!body || typeof body !== 'object' || typeof body.version !== 'number' || body.version <= 0) {
            return jsonResponse({ error: 'Invalid save payload: missing or invalid version' }, 400);
          }

          const timestamp = Number(body.savedAt || body.lastSavedAt || Date.now());
          body.savedAt = timestamp;
          body.lastSavedAt = timestamp;

          // Lưu chuỗi JSON vào KV với TTL 1 năm (31.536.000 giây)
          await env.SAVE_KV.put(kvKey, JSON.stringify(body), {
            expirationTtl: 31536000,
          });

          // Đồng thời ghi nhận Mã Thung Lũng của người chơi thật vào danh bạ bạn bè
          const friendProfile = extractFriendProfileFromSave(
            userId,
            body as unknown as Record<string, unknown>
          );
          if (friendProfile) {
            await env.SAVE_KV.put(
              `friend:${friendProfile.friendCode}`,
              JSON.stringify(friendProfile),
              { expirationTtl: 31536000 }
            );
          }

          return jsonResponse({
            ok: true,
            userId,
            savedAt: timestamp,
            version: body.version,
          });
        }

        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }

      // 3. Route /api/track — Analytics & Error Monitoring (POST)
      if (pathname === '/api/track' || pathname.endsWith('/api/track')) {
        if (request.method !== 'POST') {
          return jsonResponse({ error: 'Method Not Allowed' }, 405);
        }

        if (!env.SAVE_KV) {
          // Khi chưa bind KV thật, vẫn trả 200 để client game chạy mượt mà
          return jsonResponse({ ok: true, mocked: true });
        }

        let body: AnalyticsPayload;
        try {
          body = (await request.json()) as AnalyticsPayload;
        } catch {
          return jsonResponse({ error: 'Invalid JSON payload' }, 400);
        }

        if (!body || !Array.isArray(body.events)) {
          return jsonResponse({ error: 'Missing events array in payload' }, 400);
        }

        // Lưu vào bộ đệm nhật ký gần đây (capped buffer tối đa 200 sự kiện mới nhất)
        const LOG_KEY = 'track:recent_events';
        const MAX_LOGS = 200;

        let existing: AnalyticsIncomingEvent[] = [];
        try {
          const rawLogs = await env.SAVE_KV.get(LOG_KEY, 'text');
          if (rawLogs) {
            const parsed = JSON.parse(rawLogs);
            if (Array.isArray(parsed)) {
              existing = parsed as AnalyticsIncomingEvent[];
            }
          }
        } catch {
          existing = [];
        }

        const merged = [...existing, ...body.events].slice(-MAX_LOGS);
        // Lưu giữ trong 7 ngày
        await env.SAVE_KV.put(LOG_KEY, JSON.stringify(merged), {
          expirationTtl: 86400 * 7,
        });

        return jsonResponse({
          ok: true,
          trackedCount: body.events.length,
          totalBuffered: merged.length,
        });
      }

      // 4. Route /api/leaderboard — Per-Minigame Cloud Leaderboard (GET / POST) — Chỉ tính 3 môn: Match-3, Sudoku, Pikachu
      if (pathname === '/api/leaderboard' || pathname.endsWith('/api/leaderboard')) {
        const VALID_GAMES = new Set([
          'match3',
          'sudoku',
          'blocks',
        ]);

        if (request.method === 'GET') {
          const rawGame = url.searchParams.get('game') || 'match3';
          const gameId = VALID_GAMES.has(rawGame) ? rawGame : 'match3';
          if (!env.SAVE_KV) {
            return jsonResponse({ ok: true, gameId, entries: [], mocked: true });
          }
          const rawList = await env.SAVE_KV.get(`lb:${gameId}`, 'text');
          let entries: unknown[] = [];
          if (rawList) {
            try {
              const parsed = JSON.parse(rawList);
              if (Array.isArray(parsed)) entries = parsed;
            } catch {
              entries = [];
            }
          }
          return jsonResponse({ ok: true, gameId, entries }, 200, request);
        }

        if (request.method === 'POST') {
          let body: {
            gameId?: string;
            entry?: {
              userId?: string;
              name?: string;
              parkName?: string;
              friendCode?: string;
              avatarEmoji?: string;
              house?: string;
              primaryValue?: number;
              ratingScore?: number;
              totalWins?: number;
              bestStreak?: number;
              detailLabelVi?: string;
            };
          };
          try {
            body = await parseRequestJson<typeof body>(request);
          } catch {
            return jsonResponse({ error: 'Invalid JSON payload' }, 400, request);
          }
          const rawGame = String(body?.gameId || 'match3');
          if (!VALID_GAMES.has(rawGame) || !body?.entry) {
            return jsonResponse({ error: 'Invalid leaderboard gameId or entry' }, 400);
          }

          const rawUid = request.headers.get('X-User-Id') || body.entry.userId || null;
          const userId = sanitizeUserId(rawUid);
          const validHouses = new Set(['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin']);
          const house = validHouses.has(String(body.entry.house))
            ? String(body.entry.house)
            : 'Gryffindor';
          const maxPrimary = rawGame === 'seedquiz' ? 20000 : 777;
          const sanitizedEntry = {
            userId,
            name: String(body.entry.name || 'Trang Trại Hang Sóc').slice(0, 42),
            parkName: String(body.entry.parkName || 'Trang Trại Hang Sóc').slice(0, 42),
            friendCode: String(body.entry.friendCode || 'HS-CLUD-01').slice(0, 16),
            avatarEmoji: String(body.entry.avatarEmoji || '🧙‍♂️').slice(0, 8),
            house,
            primaryValue: Math.max(
              0,
              Math.min(maxPrimary, Math.floor(Number(body.entry.primaryValue) || 0))
            ),
            ratingScore: Math.max(
              0,
              Math.min(9_999_999, Math.floor(Number(body.entry.ratingScore) || 0))
            ),
            totalWins: Math.max(
              0,
              Math.min(999_999, Math.floor(Number(body.entry.totalWins) || 0))
            ),
            bestStreak: Math.max(
              0,
              Math.min(99_999, Math.floor(Number(body.entry.bestStreak) || 0))
            ),
            detailLabelVi: String(body.entry.detailLabelVi || '').slice(0, 64),
            updatedAt: Date.now(),
          };

          if (!env.SAVE_KV) {
            return jsonResponse({
              ok: true,
              gameId: rawGame,
              entries: [sanitizedEntry],
              mocked: true,
            });
          }

          const kvKey = `lb:${rawGame}`;
          let existing: Array<typeof sanitizedEntry> = [];
          try {
            const rawExisting = await env.SAVE_KV.get(kvKey, 'text');
            if (rawExisting) {
              const parsed = JSON.parse(rawExisting);
              if (Array.isArray(parsed)) existing = parsed;
            }
          } catch {
            existing = [];
          }

          const byUser = new Map<string, typeof sanitizedEntry>();
          for (const item of existing) {
            if (item && typeof item.userId === 'string') {
              byUser.set(item.userId, item);
            }
          }
          const prev = byUser.get(userId);
          if (
            !prev ||
            sanitizedEntry.primaryValue > prev.primaryValue ||
            (sanitizedEntry.primaryValue === prev.primaryValue &&
              sanitizedEntry.ratingScore >= prev.ratingScore)
          ) {
            byUser.set(userId, sanitizedEntry);
          }

          const topEntries = Array.from(byUser.values())
            .sort(
              (a, b) =>
                b.primaryValue - a.primaryValue ||
                b.ratingScore - a.ratingScore ||
                b.totalWins - a.totalWins
            )
            .slice(0, 50);

          await env.SAVE_KV.put(kvKey, JSON.stringify(topEntries), {
            expirationTtl: 86400 * 180,
          });

          const cleanLbCode = sanitizeFriendCode(sanitizedEntry.friendCode);
          if (cleanLbCode.length >= 4 && !BLOCKED_NPC_CODES.has(cleanLbCode)) {
            const existingFriendRaw = await env.SAVE_KV.get(`friend:${cleanLbCode}`, 'text');
            if (!existingFriendRaw) {
              const lbProfile: StoredFriendDirectoryProfile = {
                userId,
                friendCode: cleanLbCode,
                name: sanitizedEntry.name,
                parkName: sanitizedEntry.parkName,
                level: Math.max(1, Math.min(100, Math.round(sanitizedEntry.primaryValue / 5) || 1)),
                house: sanitizedEntry.house,
                avatarEmoji: sanitizedEntry.avatarEmoji,
                updatedAt: Date.now(),
              };
              await env.SAVE_KV.put(`friend:${cleanLbCode}`, JSON.stringify(lbProfile), {
                expirationTtl: 86400 * 180,
              });
            }
          }

          return jsonResponse({ ok: true, gameId: rawGame, entries: topEntries }, 200, request);
        }

        return jsonResponse({ error: 'Method Not Allowed' }, 405);
      }

      // 5. Route /api/friends/register & /api/friends/lookup — Danh bạ Người Chơi Thật
      if (
        pathname === '/api/friends/register' ||
        pathname.endsWith('/api/friends/register')
      ) {
        if (request.method !== 'POST') {
          return jsonResponse({ error: 'Method Not Allowed' }, 405, request);
        }
        if (!env.SAVE_KV) {
          return jsonResponse({ error: 'SAVE_KV binding not configured' }, 500, request);
        }
        let body: Record<string, unknown>;
        try {
          body = await parseRequestJson<Record<string, unknown>>(request);
        } catch {
          return jsonResponse({ error: 'Invalid JSON payload' }, 400, request);
        }
        const rawUid =
          request.headers.get('X-User-Id') ||
          (typeof body.userId === 'string' ? body.userId : null);
        const userId = sanitizeUserId(rawUid);
        const profile = extractFriendProfileFromSave(userId, body);
        if (!profile) {
          return jsonResponse({ ok: false, error: 'Invalid friendCode' }, 400, request);
        }
        await env.SAVE_KV.put(`friend:${profile.friendCode}`, JSON.stringify(profile), {
          expirationTtl: 31536000,
        });
        return jsonResponse(
          { ok: true, friendCode: profile.friendCode, userId: profile.userId },
          200,
          request
        );
      }

      if (
        pathname === '/api/friends/lookup' ||
        pathname.endsWith('/api/friends/lookup')
      ) {
        if (request.method !== 'GET') {
          return jsonResponse({ error: 'Method Not Allowed' }, 405, request);
        }
        const code = sanitizeFriendCode(url.searchParams.get('code'));
        if (code.length < 4 || BLOCKED_NPC_CODES.has(code)) {
          return jsonResponse(
            { ok: false, found: false, error: 'Mã Thung Lũng không hợp lệ!' },
            404,
            request
          );
        }
        if (!env.SAVE_KV) {
          return jsonResponse(
            { ok: false, found: false, error: 'SAVE_KV binding not configured' },
            503,
            request
          );
        }
        const rawFriend = await env.SAVE_KV.get(`friend:${code}`, 'text');
        if (rawFriend) {
          try {
            const profile = JSON.parse(rawFriend) as StoredFriendDirectoryProfile;
            return jsonResponse({ ok: true, found: true, profile }, 200, request);
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
          request
        );
      }

      // 6. Default 404 cho các route không xác định
      return jsonResponse({ error: 'Route not found', path: pathname }, 404);
    } catch (err) {
      console.error('[Worker Error]', err);
      return jsonResponse(
        {
          error: 'Internal Server Error',
          message: err instanceof Error ? err.message : String(err),
        },
        500
      );
    }
  },
};
