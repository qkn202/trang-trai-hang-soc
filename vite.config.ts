import crypto from 'node:crypto';
import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';
import { defineConfig, type ResolvedConfig } from 'vite';
import { BurrowAuthoritativeBackend, MemoryBackendKVStore } from './server/burrowBackendCore';
import { handleAuthoritativeHttpRequest } from './server/index';

const COMPRESSIBLE_EXTS = new Set([
  '.js',
  '.mjs',
  '.css',
  '.html',
  '.json',
  '.webmanifest',
  '.svg',
  '.ico',
  '.xml',
  '.txt',
]);
const MIN_COMPRESS_BYTES = 256;

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

const localAuthoritativeKv = new MemoryBackendKVStore();
let devFlooCommunitySeeded: Promise<void> | null = null;

function ensureDevFlooCommunitySeeded(): Promise<void> {
  if (devFlooCommunitySeeded) return devFlooCommunitySeeded;
  devFlooCommunitySeeded = (async () => {
    const backend = new BurrowAuthoritativeBackend({
      store: localAuthoritativeKv,
      allowEmulatorTokens: true,
    });
    const now = Date.now();
    const members: Array<{
      uid: string;
      playerName: string;
      parkName: string;
      house: 'Gryffindor' | 'Ravenclaw' | 'Hufflepuff' | 'Slytherin';
      avatarEmoji: string;
      level: number;
      growing: number;
      fire: boolean;
      weather: string;
      atmosphere: string;
    }> = [
      {
        uid: 'hpvn_hoanglong_gf',
        playerName: 'Hoàng Long',
        parkName: 'Lò Sưởi Sư Tử Đỏ',
        house: 'Gryffindor',
        avatarEmoji: '🦁',
        level: 31,
        growing: 3,
        fire: true,
        weather: 'clear',
        atmosphere: 'dusk',
      },
      {
        uid: 'hpvn_linh_rc',
        playerName: 'Khánh Linh',
        parkName: 'Đài Sao Ravenclaw',
        house: 'Ravenclaw',
        avatarEmoji: '🦅',
        level: 26,
        growing: 4,
        fire: false,
        weather: 'fireflies',
        atmosphere: 'night',
      },
      {
        uid: 'hpvn_minhanh_hp',
        playerName: 'Minh Anh',
        parkName: 'Nhà Kính Hufflepuff',
        house: 'Hufflepuff',
        avatarEmoji: '🦡',
        level: 19,
        growing: 2,
        fire: false,
        weather: 'clear',
        atmosphere: 'day',
      },
      {
        uid: 'hpvn_thaovy_sl',
        playerName: 'Thảo Vy',
        parkName: 'Thung Lũng Lục Bảo',
        house: 'Slytherin',
        avatarEmoji: '🐍',
        level: 42,
        growing: 5,
        fire: false,
        weather: 'fog',
        atmosphere: 'dawn',
      },
    ];

    for (const m of members) {
      const st = await backend.getOrCreateState(m.uid, m.house);
      st.playerName = m.playerName;
      st.parkName = m.parkName;
      st.avatarEmoji = m.avatarEmoji;
      st.level = m.level;
      st.decorations.scene = {
        weather: m.weather,
        atmosphere: m.atmosphere,
        event: 'harvest_feast',
      };
      st.timers = Array.from({ length: m.growing }, (_, idx) => ({
        timerId: `tm_${m.uid}_${idx}`,
        domain: 'crop' as const,
        targetId: idx % 2 === 0 ? 'pumpkin' : 'wheat',
        qty: 1,
        startedAt: now - 15 * 60_000,
        readyAt: now + 45 * 60_000,
        boosted: false,
        cared: false,
      }));
      st.rawClientSave = {
        version: 1,
        name: m.playerName,
        parkName: m.parkName,
        level: m.level,
        house: m.house,
      };
      await localAuthoritativeKv.put(`burrow_states:${m.uid}`, JSON.stringify(st));
      await backend.syncVisitDirectoryForState(st);
      if (m.fire) {
        await localAuthoritativeKv.put(
          `burrow_fire:${m.uid}`,
          JSON.stringify({ mode: 'visual', since: now - 600_000, until: now + 7_200_000 }),
          { expirationTtl: 86_400 }
        );
      }
    }
  })().catch(() => {
    // Non-blocking dev seed
  });
  return devFlooCommunitySeeded;
}

function attachLocalApiMiddleware(middlewares: {
  use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
}): void {
  middlewares.use((req, res, next) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    const isApiRoute = pathname.startsWith('/api/');
    const isEmulatorCallable = /^\/demo-[a-z0-9-]+\/[a-z0-9-]+\/[a-zA-Z0-9_]+$/.test(pathname);
    if (!isApiRoute && !isEmulatorCallable) {
      next();
      return;
    }

    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', async () => {
      try {
        await ensureDevFlooCommunitySeeded();
        const method = (req.method || 'GET').toUpperCase();
        const rawBody = chunks.length > 0 ? Buffer.concat(chunks) : undefined;
        const isGzipReq =
          String(req.headers['content-encoding'] || '').toLowerCase() === 'gzip';
        const decodedBody =
          rawBody && isGzipReq ? zlib.gunzipSync(rawBody) : rawBody;

        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) {
          if (k.toLowerCase() === 'content-encoding' && isGzipReq) continue;
          if (k.toLowerCase() === 'accept-encoding') continue;
          if (Array.isArray(v)) {
            headers.set(k, v.join(', '));
          } else if (typeof v === 'string') {
            headers.set(k, v);
          }
        }

        const fullUrl = `http://${req.headers.host || 'localhost:5173'}${rawUrl}`;
        const webReq = new Request(fullUrl, {
          method,
          headers,
          body:
            method === 'GET' || method === 'HEAD' || method === 'OPTIONS' || !decodedBody
              ? undefined
              : new Uint8Array(decodedBody),
        });

        const webRes = await handleAuthoritativeHttpRequest(webReq, {
          SAVE_KV: localAuthoritativeKv,
          ENVIRONMENT: 'development',
        });

        for (const [hk, hv] of webRes.headers.entries()) {
          if (hk.toLowerCase() === 'content-encoding' || hk.toLowerCase() === 'content-length') {
            continue;
          }
          res.setHeader(hk, hv);
        }

        if (webRes.status === 204) {
          res.statusCode = 204;
          res.end();
          return;
        }

        const respText = await webRes.text();
        sendJsonMaybeGzip(req, res, webRes.status, respText);
      } catch (err) {
        sendJsonMaybeGzip(
          req,
          res,
          500,
          JSON.stringify({
            error: 'Local Authoritative Middleware Error',
            message: err instanceof Error ? err.message : String(err),
          })
        );
      }
    });
  });
}

let resolvedViteConfig: ResolvedConfig | null = null;

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  optimizeDeps: {
    exclude: ['input-switch-polyfill'],
  },
  plugins: [
    {
      name: 'local-authoritative-backend',
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
        if (!resolvedViteConfig) return;
        const outDir = path.resolve(resolvedViteConfig.root, resolvedViteConfig.build.outDir);

        // Tự động đóng dấu mã băm tài sản (`v33-<hash>`) vào `dist/sw.js` ở mỗi lần build
        // để trình duyệt tự dọn cache Service Worker cũ ngay khi triển khai bản mới lên HPVN.
        const swPath = path.join(outDir, 'sw.js');
        const assetsDir = path.join(outDir, 'assets');
        if (fs.existsSync(swPath) && fs.existsSync(assetsDir)) {
          const assetEntries = fs
            .readdirSync(assetsDir)
            .filter((name) => !name.endsWith('.gz') && !name.endsWith('.br'))
            .sort();
          const buildHash = crypto
            .createHash('sha256')
            .update(assetEntries.join('|'))
            .digest('hex')
            .slice(0, 8);
          const swRaw = fs.readFileSync(swPath, 'utf8');
          const verMatch = swRaw.match(/const CACHE_VERSION = ['"](v\d+)[^'"]*['"];/);
          const verPrefix = verMatch ? verMatch[1] : 'v36';
          const swStamped = swRaw.replace(
            /const CACHE_VERSION = ['"][^'"]+['"];/,
            `const CACHE_VERSION = '${verPrefix}-${buildHash}';`
          );
          if (swStamped !== swRaw) {
            fs.writeFileSync(swPath, swStamped, 'utf8');
            console.log(`✓ [sw-stamp] Stamped dist/sw.js CACHE_VERSION = '${verPrefix}-${buildHash}'`);
          }
        }

        if (resolvedViteConfig.base && resolvedViteConfig.base !== '/') {
          const baseWithSlash = resolvedViteConfig.base.endsWith('/')
            ? resolvedViteConfig.base
            : `${resolvedViteConfig.base}/`;
          const baseNoTrail = baseWithSlash.slice(0, -1);
          const assetPrefixRe =
            /(['"(`=])\/((?:sprites|paintings|audio|fonts|icons)\/|(?:manifest\.webmanifest|offline\.html|favicon\.ico))/g;

          const rewriteFilePaths = (filePath: string) => {
            if (!fs.existsSync(filePath)) return;
            const src = fs.readFileSync(filePath, 'utf8');
            const next = src.replace(assetPrefixRe, `$1${baseNoTrail}/$2`);
            if (next !== src) {
              fs.writeFileSync(filePath, next, 'utf8');
            }
          };

          rewriteFilePaths(path.join(outDir, 'index.html'));
          rewriteFilePaths(path.join(outDir, 'offline.html'));
          if (fs.existsSync(assetsDir)) {
            for (const name of fs.readdirSync(assetsDir)) {
              if (name.endsWith('.js') || name.endsWith('.css')) {
                rewriteFilePaths(path.join(assetsDir, name));
              }
            }
          }

          const manifestPath = path.join(outDir, 'manifest.webmanifest');
          if (fs.existsSync(manifestPath)) {
            const mRaw = fs.readFileSync(manifestPath, 'utf8');
            const mNext = mRaw
              .replace(/"(id|start_url|scope)":\s*"\/"/g, `"$1": "${baseWithSlash}"`)
              .replace(/"url":\s*"\/\?/g, `"url": "${baseWithSlash}?`)
              .replace(assetPrefixRe, `$1${baseNoTrail}/$2`);
            if (mNext !== mRaw) {
              fs.writeFileSync(manifestPath, mNext, 'utf8');
            }
          }
        }

        if (process.env.SKIP_PRECOMPRESS === '1') return;
        const files = collectCompressibleFiles(outDir);
        let totalRaw = 0;
        let totalGz = 0;
        let totalBr = 0;
        let count = 0;

        for (const file of files) {
          const stat = fs.statSync(file);
          if (stat.size < MIN_COMPRESS_BYTES) continue;
          const raw = fs.readFileSync(file);
          const gz = zlib.gzipSync(raw, { level: zlib.constants.Z_BEST_COMPRESSION });
          const br = zlib.brotliCompressSync(raw, {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
            },
          });
          const gzPath = `${file}.gz`;
          const brPath = `${file}.br`;
          fs.writeFileSync(gzPath, gz);
          fs.writeFileSync(brPath, br);
          // Giữ đồng bộ mtime giữa file gốc và .gz/.br để Nginx `gzip_static on;` / `brotli_static on;` nhận diện chuẩn xác
          fs.utimesSync(gzPath, stat.atime, stat.mtime);
          fs.utimesSync(brPath, stat.atime, stat.mtime);
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
    headers: {
      'Cache-Control': 'no-cache, max-age=0, must-revalidate',
    },
  },
  build: {
    target: ['es2020', 'safari16'],
    cssTarget: 'safari16',
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
            id.includes('/src/sim/blocksEngine') ||
            id.includes('/src/sim/sudokuEngine') ||
            id.includes('/src/sim/caroEngine') ||
            id.includes('/src/sim/chessPresets') ||
            id.includes('/src/sim/chessEngine') ||
            id.includes('/src/sim/onetEngine') ||
            id.includes('/src/data/chessTacticsPack') ||
            id.includes('/src/sim/match3Engine') ||
            id.includes('/src/sim/candyHogwartsEngine') ||
            id.includes('/src/engine/candyHogwartsRenderer') ||
            id.includes('/src/data/candyHogwartsLevels') ||
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
