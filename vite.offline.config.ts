import crypto from 'node:crypto';
import fs from 'node:fs';
import path, { resolve } from 'node:path';
import { defineConfig, type ResolvedConfig } from 'vite';

const PROJECT_ROOT = __dirname;
const OFFLINE_PUBLIC_DIR = resolve(PROJECT_ROOT, 'public/offline');
const MAIN_PUBLIC_DIR = resolve(PROJECT_ROOT, 'public');
const OUT_DIR = resolve(PROJECT_ROOT, 'dist-offline');

const MINIGAME_SOURCE_FILES_FOR_SPRITE_SCAN = [
  'src/sim/jigsawPaintingComposer.ts',
  'src/sim/puzzleShared.ts',
  'src/sim/onetEngine.ts',
  'src/sim/languageQuizEngine.ts',
  'src/engine/candyHogwartsRenderer.ts',
  'src/data/candyHogwartsLevels.ts',
  'src/offline/offlineCatalog.ts',
];

const PAINTING_SUBDIRS_TO_COPY = ['candy-hogwarts', 'candy-yule', 'sudoku', 'sudoku-yule'];

function copyDirRecursive(srcDir: string, destDir: string): void {
  if (!fs.existsSync(srcDir)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(s, d);
    } else if (entry.isFile()) {
      fs.copyFileSync(s, d);
    }
  }
}

function collectReferencedSpriteNames(): string[] {
  const spritesDir = path.join(MAIN_PUBLIC_DIR, 'sprites');
  if (!fs.existsSync(spritesDir)) return [];
  const allPngs = fs.readdirSync(spritesDir).filter((f) => f.endsWith('.png'));
  const combinedSource = MINIGAME_SOURCE_FILES_FOR_SPRITE_SCAN.map((rel) => {
    const p = resolve(PROJECT_ROOT, rel);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  }).join('\n');

  const selected: string[] = [];
  for (const fileName of allPngs) {
    const key = fileName.slice(0, -4);
    if (combinedSource.includes(key)) {
      selected.push(fileName);
    }
  }
  return selected.sort();
}

function collectRelativeFilesRecursive(rootDir: string, currentDir = rootDir, out: string[] = []): string[] {
  if (!fs.existsSync(currentDir)) return out;
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === '_headers' || entry.name === 'sw.js') {
      continue;
    }
    const full = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      collectRelativeFilesRecursive(rootDir, full, out);
    } else if (entry.isFile()) {
      const rel = path.relative(rootDir, full).split(path.sep).join('/');
      out.push(`./${rel}`);
    }
  }
  return out.sort();
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8';
    case '.js':
    case '.mjs':
      return 'application/javascript; charset=utf-8';
    case '.css':
      return 'text/css; charset=utf-8';
    case '.json':
    case '.webmanifest':
      return 'application/manifest+json; charset=utf-8';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.woff2':
      return 'font/woff2';
    case '.mp3':
      return 'audio/mpeg';
    default:
      return 'application/octet-stream';
  }
}

let resolvedCfg: ResolvedConfig | null = null;

export default defineConfig({
  root: OFFLINE_PUBLIC_DIR,
  base: process.env.VITE_OFFLINE_BASE_PATH || './',
  publicDir: false,
  resolve: {
    alias: {
      '/src': resolve(PROJECT_ROOT, 'src'),
    },
  },
  server: {
    port: 5174,
    host: true,
    fs: {
      allow: [PROJECT_ROOT],
    },
  },
  build: {
    outDir: OUT_DIR,
    emptyOutDir: true,
    target: ['es2020', 'safari16'],
    cssTarget: 'safari16',
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: resolve(OFFLINE_PUBLIC_DIR, 'index.html'),
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/quizPacks/')) {
            if (id.includes('/packHelper')) return 'quiz-shared';
            const m = id.match(/\/quizPacks\/([a-z]+)\./);
            if (m) return `quiz-${m[1]}`;
          }
          if (
            id.includes('/src/sim/candyHogwartsEngine') ||
            id.includes('/src/engine/candyHogwartsRenderer') ||
            id.includes('/src/data/candyHogwartsLevels')
          ) {
            return 'candy-hogwarts';
          }
          if (
            id.includes('/src/sim/jigsawEngine') ||
            id.includes('/src/sim/jigsawPaintingComposer') ||
            id.includes('/src/sim/sudokuEngine') ||
            id.includes('/src/sim/onetEngine') ||
            id.includes('/src/sim/puzzleShared')
          ) {
            return 'puzzle-arcade';
          }
          if (
            id.includes('/src/sim/languageQuizEngine') ||
            id.includes('/src/data/languageQuizBank')
          ) {
            return 'seed-quiz';
          }
        },
      },
    },
  },
  plugins: [
    {
      name: 'offline-pwa-packager',
      configResolved(cfg) {
        resolvedCfg = cfg;
      },
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const cleanPath = (req.url || '/').split('?')[0];
          const candidates = [
            path.join(OFFLINE_PUBLIC_DIR, cleanPath),
            path.join(MAIN_PUBLIC_DIR, cleanPath),
          ];
          for (const file of candidates) {
            if (fs.existsSync(file) && fs.statSync(file).isFile() && !file.endsWith('index.html')) {
              res.setHeader('Content-Type', getMimeType(file));
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          next();
        });
      },
      closeBundle() {
        if (!resolvedCfg) return;

        // 1. Copy standalone PWA files from public/offline/
        for (const staticFile of ['manifest.webmanifest', 'offline.html', 'sw.js', '_headers']) {
          const src = path.join(OFFLINE_PUBLIC_DIR, staticFile);
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(OUT_DIR, staticFile));
          }
        }
        copyDirRecursive(path.join(OFFLINE_PUBLIC_DIR, 'icons'), path.join(OUT_DIR, 'icons'));
        fs.writeFileSync(path.join(OUT_DIR, '.nojekyll'), '', 'utf8');

        // 2. Copy self-hosted Vietnamese & Latin fonts
        copyDirRecursive(path.join(MAIN_PUBLIC_DIR, 'fonts'), path.join(OUT_DIR, 'fonts'));

        // 3. Copy only mini-game paintings (top-level .jpg backdrops + candy/sudoku subdirs)
        const paintingsSrc = path.join(MAIN_PUBLIC_DIR, 'paintings');
        const paintingsDest = path.join(OUT_DIR, 'paintings');
        fs.mkdirSync(paintingsDest, { recursive: true });
        if (fs.existsSync(paintingsSrc)) {
          for (const ent of fs.readdirSync(paintingsSrc, { withFileTypes: true })) {
            if (ent.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(ent.name)) {
              fs.copyFileSync(
                path.join(paintingsSrc, ent.name),
                path.join(paintingsDest, ent.name)
              );
            }
          }
          for (const sub of PAINTING_SUBDIRS_TO_COPY) {
            copyDirRecursive(path.join(paintingsSrc, sub), path.join(paintingsDest, sub));
          }
        }

        // 4. Copy only sprites actually referenced by the 5 mini-games
        const spritesDest = path.join(OUT_DIR, 'sprites');
        fs.mkdirSync(spritesDest, { recursive: true });
        const neededSprites = collectReferencedSpriteNames();
        for (const fileName of neededSprites) {
          fs.copyFileSync(
            path.join(MAIN_PUBLIC_DIR, 'sprites', fileName),
            path.join(spritesDest, fileName)
          );
        }

        // 5. Rewrite root-leading "/paintings/...", "/sprites/...", "/fonts/...", "/icons/..."
        //    to relative "./paintings/..." (or custom base) so both root subdomain and /offline/ subpath work
        const base = resolvedCfg.base || './';
        const prefix =
          base === './'
            ? './'
            : base.endsWith('/')
              ? base
              : `${base}/`;
        const assetPrefixRe =
          /(['"(`=])\/((?:paintings|sprites|fonts|icons)\/|(?:manifest\.webmanifest|offline\.html|favicon\.ico))/g;

        const rewriteAssetUrls = (filePath: string) => {
          if (!fs.existsSync(filePath)) return;
          const raw = fs.readFileSync(filePath, 'utf8');
          const rewritten = raw.replace(assetPrefixRe, `$1${prefix}$2`);
          if (rewritten !== raw) {
            fs.writeFileSync(filePath, rewritten, 'utf8');
          }
        };

        rewriteAssetUrls(path.join(OUT_DIR, 'index.html'));
        rewriteAssetUrls(path.join(OUT_DIR, 'offline.html'));
        const assetsOutDir = path.join(OUT_DIR, 'assets');
        if (fs.existsSync(assetsOutDir)) {
          for (const f of fs.readdirSync(assetsOutDir)) {
            if (
              /^manifest-[A-Za-z0-9_-]+\.webmanifest$/.test(f) ||
              /^favicon-32-[A-Za-z0-9_-]+\.png$/.test(f) ||
              /^apple-touch-icon-[A-Za-z0-9_-]+\.png$/.test(f)
            ) {
              fs.unlinkSync(path.join(assetsOutDir, f));
              continue;
            }
            if (f.endsWith('.js') || f.endsWith('.css')) {
              rewriteAssetUrls(path.join(assetsOutDir, f));
            }
          }
        }

        const outIndexHtmlPath = path.join(OUT_DIR, 'index.html');
        if (fs.existsSync(outIndexHtmlPath)) {
          const htmlRaw = fs.readFileSync(outIndexHtmlPath, 'utf8');
          const htmlFixed = htmlRaw
            .replace(
              /href="[^"]*assets\/manifest-[^"]+\.webmanifest"/g,
              `href="${prefix}manifest.webmanifest"`
            )
            .replace(
              /href="[^"]*assets\/favicon-32-[^"]+\.png"/g,
              `href="${prefix}icons/favicon-32.png"`
            )
            .replace(
              /href="[^"]*assets\/apple-touch-icon-[^"]+\.png"/g,
              `href="${prefix}icons/apple-touch-icon.png"`
            );
          if (htmlFixed !== htmlRaw) {
            fs.writeFileSync(outIndexHtmlPath, htmlFixed, 'utf8');
          }
        }

        // 6. Generate full precache manifest & deterministic CACHE_VERSION in dist-offline/sw.js
        const swOutPath = path.join(OUT_DIR, 'sw.js');
        if (fs.existsSync(swOutPath)) {
          const allRelAssets = collectRelativeFilesRecursive(OUT_DIR);
          const hash = crypto.createHash('sha256');
          for (const rel of allRelAssets) {
            const abs = path.join(OUT_DIR, rel.replace(/^\.\//, ''));
            const st = fs.statSync(abs);
            hash.update(`${rel}:${st.size}|`);
          }
          const buildHash = hash.digest('hex').slice(0, 8);
          const swRaw = fs.readFileSync(swOutPath, 'utf8');
          const swStamped = swRaw
            .replace(
              /const CACHE_VERSION = ['"][^'"]+['"];/,
              `const CACHE_VERSION = 'offline-v1-${buildHash}';`
            )
            .replace(
              /\/\* __OFFLINE_PRECACHE_MANIFEST__ \*\//,
              allRelAssets.map((u) => JSON.stringify(u)).join(',\n  ')
            );
          fs.writeFileSync(swOutPath, swStamped, 'utf8');
          console.log(
            `✓ [offline-pwa] Stamped dist-offline/sw.js ('offline-v1-${buildHash}', ${allRelAssets.length} precached files, ${neededSprites.length} sprites)`
          );
        }
      },
    },
  ],
});
