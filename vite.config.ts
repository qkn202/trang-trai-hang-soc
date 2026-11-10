import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { defineConfig, type ResolvedConfig } from 'vite';

const COMPRESSIBLE_EXTS = new Set([
  '.js',
  '.mjs',
  '.css',
  '.html',
  '.json',
  '.webmanifest',
  '.svg',
]);
const MIN_COMPRESS_BYTES = 1024;

function sendJsonMaybeGzip(
  req: IncomingMessage,
  res: ServerResponse,
  statusCode: number,
  bodyText: string
): void {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Vary', 'Accept-Encoding');
  const acceptEnc = String(req.headers['accept-encoding'] || '');
  const rawBuf = Buffer.from(bodyText, 'utf8');
  if (rawBuf.byteLength >= 512 && /\bgzip\b/i.test(acceptEnc)) {
    const gz = zlib.gzipSync(rawBuf, { level: zlib.constants.Z_DEFAULT_COMPRESSION });
    res.setHeader('Content-Encoding', 'gzip');
    res.setHeader('Content-Length', String(gz.byteLength));
    res.end(gz);
    return;
  }
  res.setHeader('Content-Length', String(rawBuf.byteLength));
  res.end(rawBuf);
}

function collectCompressibleFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectCompressibleFiles(full, out);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (COMPRESSIBLE_EXTS.has(ext)) {
        out.push(full);
      }
    }
  }
  return out;
}

const localDevSaveStore = new Map<string, string>();
const localDevFriendDirectory = new Map<string, string>();
const localDevLeaderboardStore = new Map<string, Array<Record<string, unknown>>>();

function indexLocalFriendProfile(userId: string, bodyText: string): string | null {
  try {
    const parsed = JSON.parse(bodyText) as Record<string, unknown>;
    const soc =
      parsed.neighborSocial && typeof parsed.neighborSocial === 'object'
        ? (parsed.neighborSocial as Record<string, unknown>)
        : null;
    const rawCode = String(soc?.playerFriendCode ?? parsed.friendCode ?? '')
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 18);
    if (rawCode.length < 4) return null;
    const parkName = String(parsed.parkName || 'Trang Trại Hang Sóc').slice(0, 42);
    const profile = {
      userId,
      friendCode: rawCode,
      name: String(parsed.name || parkName).slice(0, 42),
      parkName,
      level: Math.max(1, Math.min(100, Math.floor(Number(parsed.level) || 1))),
      house: String(parsed.house || 'Gryffindor'),
      avatarEmoji: String(parsed.avatarEmoji || '🧙‍♂️').slice(0, 8),
      buildings: Array.isArray(parsed.buildings) ? parsed.buildings.slice(0, 260) : undefined,
      tileOverrides:
        parsed.tileOverrides && typeof parsed.tileOverrides === 'object'
          ? parsed.tileOverrides
          : undefined,
      unlockedZones: Array.isArray(parsed.unlockedZones)
        ? parsed.unlockedZones.slice(0, 12)
        : undefined,
      updatedAt: Date.now(),
    };
    localDevFriendDirectory.set(rawCode, JSON.stringify(profile));
    return rawCode;
  } catch {
    return null;
  }
}

function attachLocalApiMiddleware(middlewares: {
  use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
}): void {
  middlewares.use((req, res, next) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    if (
      pathname !== '/api/save' &&
      pathname !== '/api/track' &&
      pathname !== '/api/leaderboard' &&
      pathname !== '/api/friends/register' &&
      pathname !== '/api/friends/lookup'
    ) {
      next();
      return;
    }

    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    if (pathname === '/api/track') {
      req.resume();
      sendJsonMaybeGzip(req, res, 200, JSON.stringify({ ok: true, mocked: true }));
      return;
    }

    const search = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
    const params = new URLSearchParams(search);
    const headerUid = req.headers['x-user-id'];
    const rawUid = (Array.isArray(headerUid) ? headerUid[0] : headerUid) || params.get('userId') || 'default_player';
    const userId = rawUid.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'default_player';

    if (pathname === '/api/leaderboard') {
      if (req.method === 'GET') {
        const gameId = String(params.get('game') || 'match3');
        const entries = localDevLeaderboardStore.get(gameId) ?? [];
        sendJsonMaybeGzip(req, res, 200, JSON.stringify({ ok: true, gameId, entries }));
        return;
      }
      if (req.method === 'POST') {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => {
          try {
            const rawBody = Buffer.concat(chunks);
            const isGz = String(req.headers['content-encoding'] || '').toLowerCase() === 'gzip';
            const body = JSON.parse((isGz ? zlib.gunzipSync(rawBody) : rawBody).toString('utf8')) as {
              gameId?: string;
              entry?: Record<string, unknown>;
            };
            const gameId = String(body.gameId || 'match3');
            const entry = { ...(body.entry ?? {}), userId, updatedAt: Date.now() };
            const prevList = localDevLeaderboardStore.get(gameId) ?? [];
            const byUser = new Map<string, Record<string, unknown>>();
            for (const it of prevList) {
              if (typeof it.userId === 'string') byUser.set(it.userId, it);
            }
            byUser.set(userId, entry);
            const sorted = Array.from(byUser.values())
              .sort(
                (a, b) =>
                  Number(b.primaryValue || 0) - Number(a.primaryValue || 0) ||
                  Number(b.ratingScore || 0) - Number(a.ratingScore || 0)
              )
              .slice(0, 50);
            localDevLeaderboardStore.set(gameId, sorted);
            sendJsonMaybeGzip(req, res, 200, JSON.stringify({ ok: true, gameId, entries: sorted }));
          } catch {
            sendJsonMaybeGzip(req, res, 400, JSON.stringify({ ok: false, error: 'Invalid JSON' }));
          }
        });
        return;
      }
      sendJsonMaybeGzip(req, res, 405, JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    if (pathname === '/api/friends/lookup') {
      const code = String(params.get('code') || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, '')
        .slice(0, 18);
      const rawProfile = code ? localDevFriendDirectory.get(code) : undefined;
      if (!rawProfile) {
        sendJsonMaybeGzip(
          req,
          res,
          404,
          JSON.stringify({
            ok: false,
            found: false,
            error: 'Không tìm thấy người chơi thật nào đăng ký Mã Thung Lũng này!',
          })
        );
        return;
      }
      sendJsonMaybeGzip(
        req,
        res,
        200,
        `{"ok":true,"found":true,"profile":${rawProfile}}`
      );
      return;
    }

    if (pathname === '/api/friends/register') {
      if (req.method !== 'POST') {
        sendJsonMaybeGzip(req, res, 405, JSON.stringify({ error: 'Method Not Allowed' }));
        return;
      }
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        const isGz = String(req.headers['content-encoding'] || '').toLowerCase() === 'gzip';
        const bodyText = (isGz ? zlib.gunzipSync(rawBody) : rawBody).toString('utf8');
        const code = indexLocalFriendProfile(userId, bodyText);
        if (!code) {
          sendJsonMaybeGzip(req, res, 400, JSON.stringify({ ok: false, error: 'Invalid friendCode' }));
          return;
        }
        sendJsonMaybeGzip(req, res, 200, JSON.stringify({ ok: true, friendCode: code, userId }));
      });
      return;
    }

    if (req.method === 'GET') {
      const saved = localDevSaveStore.get(userId);
      if (!saved) {
        res.statusCode = 204;
        res.end();
        return;
      }
      sendJsonMaybeGzip(req, res, 200, saved);
      return;
    }

    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        const rawBody = Buffer.concat(chunks);
        const isGz = String(req.headers['content-encoding'] || '').toLowerCase() === 'gzip';
        const bodyText = (isGz ? zlib.gunzipSync(rawBody) : rawBody).toString('utf8');
        localDevSaveStore.set(userId, bodyText);
        indexLocalFriendProfile(userId, bodyText);
        sendJsonMaybeGzip(req, res, 200, JSON.stringify({ ok: true, userId, mocked: true }));
      });
      return;
    }

    sendJsonMaybeGzip(req, res, 405, JSON.stringify({ error: 'Method Not Allowed' }));
  });
}

let resolvedViteConfig: ResolvedConfig | null = null;

export default defineConfig({
  optimizeDeps: {
    exclude: ['input-switch-polyfill'],
  },
  plugins: [
    {
      name: 'local-api-dev-mock',
      configureServer(server) {
        attachLocalApiMiddleware(server.middlewares);
      },
      configurePreviewServer(server) {
        attachLocalApiMiddleware(server.middlewares);
      },
    },
    {
      name: 'inline-input-switch-polyfill-css',
      transform(code, id) {
        if (!id.includes('input-switch-polyfill') || !id.endsWith('.js')) return null;
        const cssPath = path.resolve(path.dirname(id.split('?')[0]), 'input-switch-polyfill.css');
        if (!fs.existsSync(cssPath)) return null;
        const cssText = fs.readFileSync(cssPath, 'utf8');
        return code.replace(
          /fetch\(import\.meta\.resolve\(['"]\.\/input-switch-polyfill\.css['"]\)\)\s*\.then\(\(r\)\s*=>\s*r\.text\(\)\)/,
          `Promise.resolve(${JSON.stringify(cssText)})`
        );
      },
    },
    {
      name: 'precompress-gzip-and-brotli',
      apply: 'build',
      configResolved(cfg) {
        resolvedViteConfig = cfg;
      },
      closeBundle() {
        if (!resolvedViteConfig || process.env.SKIP_PRECOMPRESS === '1') return;
        const outDir = path.resolve(resolvedViteConfig.root, resolvedViteConfig.build.outDir);
        const files = collectCompressibleFiles(outDir);
        let totalRaw = 0;
        let totalGz = 0;
        let totalBr = 0;
        let count = 0;

        for (const file of files) {
          const raw = fs.readFileSync(file);
          if (raw.byteLength < MIN_COMPRESS_BYTES) continue;
          const gz = zlib.gzipSync(raw, { level: zlib.constants.Z_BEST_COMPRESSION });
          const br = zlib.brotliCompressSync(raw, {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
          });
          fs.writeFileSync(`${file}.gz`, gz);
          fs.writeFileSync(`${file}.br`, br);
          totalRaw += raw.byteLength;
          totalGz += gz.byteLength;
          totalBr += br.byteLength;
          count += 1;
        }

        if (count > 0) {
          const kb = (n: number) => (n / 1024).toFixed(1);
          console.log(
            `✓ [gzip+br] Pre-compressed ${count} files (${kb(totalRaw)} kB -> gzip: ${kb(totalGz)} kB | brotli: ${kb(totalBr)} kB)`
          );
        }
      },
    },
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/data/quizPacks/')) {
            if (id.includes('/packHelper')) return 'quiz-shared';
            const m = id.match(/\/quizPacks\/([a-z]+)\./);
            if (m) return `quiz-${m[1]}`;
          }
          if (
            id.includes('/src/sim/puzzleArcadeEngine') ||
            id.includes('/src/sim/match3Engine') ||
            id.includes('/src/ui/match3Modal') ||
            id.includes('/src/ui/puzzleArcadeModal')
          ) {
            return;
          }
          if (id.includes('/src/data/')) {
            return 'game-data';
          }
          if (
            id.includes('/src/engine/audio') ||
            id.includes('/src/engine/bgmMood') ||
            id.includes('/src/engine/pathfinding') ||
            id.includes('/src/engine/isometric') ||
            id.includes('/src/sim/')
          ) {
            return 'sim';
          }
          if (id.includes('/src/engine/')) {
            return 'engine';
          }
        },
      },
    },
  },
});
