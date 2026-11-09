import fs from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'node:path';
import { defineConfig } from 'vite';

const localDevSaveStore = new Map<string, string>();

function attachLocalApiMiddleware(middlewares: {
  use: (fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void;
}): void {
  middlewares.use((req, res, next) => {
    const rawUrl = req.url || '';
    const pathname = rawUrl.split('?')[0];
    if (pathname !== '/api/save' && pathname !== '/api/track') {
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
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, mocked: true }));
      return;
    }

    const search = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?')) : '';
    const params = new URLSearchParams(search);
    const headerUid = req.headers['x-user-id'];
    const rawUid = (Array.isArray(headerUid) ? headerUid[0] : headerUid) || params.get('userId') || 'default_player';
    const userId = rawUid.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'default_player';

    if (req.method === 'GET') {
      const saved = localDevSaveStore.get(userId);
      if (!saved) {
        res.statusCode = 204;
        res.end();
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(saved);
      return;
    }

    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      req.on('data', (chunk: Buffer) => chunks.push(chunk));
      req.on('end', () => {
        const bodyText = Buffer.concat(chunks).toString('utf8');
        localDevSaveStore.set(userId, bodyText);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: true, userId, mocked: true }));
      });
      return;
    }

    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  });
}

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
